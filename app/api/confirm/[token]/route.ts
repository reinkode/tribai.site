import { NextResponse } from "next/server";
import { confirmByToken } from "@/lib/outbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Tokens are 48 lowercase hex chars; anything else is not worth a DB lookup.
const TOKEN_RE = /^[a-f0-9]{48}$/;

// Redirect target must be the address the visitor actually used to reach this
// endpoint (the link in their email): SITE_URL env if set, otherwise the
// proxy-aware Host. request.url alone reports localhost behind tunnels.
function publicOrigin(request: Request): string {
  const siteUrl = process.env.SITE_URL?.trim();
  if (siteUrl && /^https?:\/\//i.test(siteUrl)) return siteUrl.replace(/\/+$/, "");
  const host = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
    ?? request.headers.get("host")?.trim();
  if (host) {
    const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim()
      ?? (/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host) ? "http" : "https");
    return `${proto}://${host}`;
  }
  return new URL(request.url).origin;
}

type RouteParams = { params: Promise<{ token: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const { token } = await params;

  let status = "invalid";
  if (TOKEN_RE.test(token)) {
    const result = await confirmByToken(token);
    status =
      result === "ok"
        ? "ok"
        : result === "already"
          ? "already"
          : result === "error"
            ? "error"
            : "invalid";
  }

  return NextResponse.redirect(`${publicOrigin(request)}/confirmacion?status=${status}`);
}
