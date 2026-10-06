import { NextResponse } from "next/server";
import { normalizeLiveName, resolveLiveUrl } from "@/lib/live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPSTREAM_TIMEOUT_MS = 30_000;
const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);
// Dropped from the forwarded request: fetch re-computes content-length for
// streamed bodies and we pin accept-encoding to identity (below) so the
// response body can be piped through untouched.
const REQUEST_STRIP = new Set(["host", "content-length", "accept-encoding", ...HOP_BY_HOP]);

type RouteParams = { project: string; path?: string[] };

function errorResponse(status: number, error: string, extra?: Record<string, string>) {
  return NextResponse.json({ ok: false, error, ...extra }, { status });
}

function mapLocation(location: string, base: string, project: string, origin: string): string {
  try {
    const target = new URL(location, base);
    if (target.origin !== new URL(base).origin) return location;
    return `${origin}/live/${project}${target.pathname}${target.search}${target.hash}`;
  } catch {
    return location;
  }
}

// Responses of these media types get their root-absolute references rewritten
// to /live/<project>, so apps that don't know they're being proxied (tunneled
// Next.js apps emit "/_next/..." and their own origin URL) still load styles,
// scripts and client-side routes under the prefix.
const REWRITE_CONTENT_TYPES = new Set([
  "text/html",
  "text/css",
  "application/javascript",
  "text/javascript",
  "application/x-javascript",
  "application/json",
  "text/x-component",
  "image/svg+xml",
]);
const MAX_REWRITE_BYTES = 25 * 1024 * 1024;

function rewriteText(
  text: string,
  project: string,
  upstreamOrigin: string,
  publicBase: string,
): string {
  const prefix = `/live/${project}`;
  // Prefix without its leading slash: the regexes below consume that slash in
  // the match, so the lookahead must not expect it again (or "/live/x/…" would
  // be prefixed a second time).
  const rest = prefix.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Absolute URLs pointing back at the upstream origin -> public prefix.
  text = text.split(upstreamOrigin).join(publicBase);
  // Protocol-relative references to the upstream host.
  text = text.split(`//${new URL(upstreamOrigin).host}`).join(publicBase);
  // srcset / imagesrcset hold several root-absolute URLs separated by commas;
  // rewrite each entry so responsive images don't lose their 2x+ sources.
  text = text.replace(
    /((?:srcset|imagesrcset)\s*=\s*")([^"]*)(")/gi,
    (_m, before: string, value: string, after: string) =>
      `${before}${value.replace(/(^|[\s,])\/(?!\/)((?![\s,"']))/g, (match, sep: string) =>
        match.slice(sep.length).startsWith(prefix) ? match : `${sep}${prefix}${match.slice(sep.length)}`,
      )}${after}`,
  );
  // Root-absolute references in quotes / JSON strings. The lookahead skips
  // paths that already carry the prefix so nothing is double-rewritten.
  text = text.replace(
    new RegExp(`(["'])(?!//)\\/(?!${rest}(?:/|["']|$))`, "g"),
    `$1${prefix}/`,
  );
  // Unquoted CSS url(/...).
  text = text.replace(new RegExp(`url\\(\\s*\\/(?!${rest}/)`, "gi"), `url(${prefix}/`);
  return text;
}

async function proxy(request: Request, context: { params: Promise<RouteParams> }) {
  const { project: rawProject, path } = await context.params;
  const project = normalizeLiveName(decodeURIComponent(rawProject));
  if (!project) return errorResponse(400, "invalid_project");

  let base: string | null;
  try {
    base = await resolveLiveUrl(project);
  } catch (err) {
    console.error(`live/${project}: lookup failed`, err);
    return errorResponse(503, "lookup_failed");
  }
  if (!base) return errorResponse(404, "not_found", { project });

  const incoming = new URL(request.url);
  const prefix = `/live/${project}`;
  const publicBase = `${incoming.origin}${prefix}`;
  const suffix = path && path.length ? path.map(encodeURIComponent).join("/") : "";
  let target: URL;
  try {
    target = new URL(`${base}/${suffix}`);
  } catch {
    return errorResponse(502, "invalid_upstream", { project });
  }
  target.search = incoming.search;

  const headers = new Headers();
  for (const [name, value] of request.headers.entries()) {
    if (!REQUEST_STRIP.has(name.toLowerCase())) headers.append(name, value);
  }
  // Node's fetch injects "accept-encoding: gzip" by default and then decodes
  // the body transparently, while the content-encoding header survives into
  // the response — the browser then fails to gunzip the plaintext ("no muestra
  // nada"). Pinning identity keeps header and body consistent.
  headers.set("accept-encoding", "identity");

  const method = request.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";
  const init: RequestInit & { duplex?: "half" } = {
    method,
    headers,
    body: hasBody ? request.body : undefined,
    duplex: hasBody ? "half" : undefined,
    redirect: "manual",
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  };
  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch (err) {
    console.error(`live/${project}: upstream request failed`, err);
    return errorResponse(502, "tunnel_unreachable", { project });
  }

  const responseHeaders = new Headers();
  for (const [name, value] of upstream.headers.entries()) {
    const lower = name.toLowerCase();
    if (HOP_BY_HOP.has(lower)) continue;
    if (lower === "location") {
      responseHeaders.append(name, mapLocation(value, base, project, incoming.origin));
    } else if (lower === "set-cookie") {
      // A Domain attribute pointing at the tunnel host would make the cookie
      // unusable under the /live prefix — strip it, and scope Path=/ to the
      // prefix so it isn't sent to the host site's own pages.
      const scoped = value
        .replace(/;\s*domain=[^;]*/i, "")
        .replace(/;(\s*)path=\/(?=[;\s]|$)/i, `;$1path=${prefix}`);
      responseHeaders.append(name, scoped);
    } else {
      responseHeaders.append(name, value);
    }
  }

  const mediaType = (upstream.headers.get("content-type") ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  const declaredLength = Number.parseInt(upstream.headers.get("content-length") ?? "0", 10) || 0;
  const rewrite =
    method !== "HEAD" &&
    upstream.status !== 101 &&
    REWRITE_CONTENT_TYPES.has(mediaType) &&
    declaredLength <= MAX_REWRITE_BYTES;

  if (!rewrite) {
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  }

  const text = rewriteText(
    new TextDecoder().decode(await upstream.arrayBuffer()),
    project,
    new URL(base).origin,
    publicBase,
  );
  // Body no longer matches upstream's size or validators.
  responseHeaders.delete("content-length");
  responseHeaders.delete("etag");
  return new Response(text, { status: upstream.status, headers: responseHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
export const OPTIONS = proxy;
