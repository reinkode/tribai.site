import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { normalizeLiveUrl } from "@/lib/live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROBE_TIMEOUT_MS = 10_000;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const url = typeof body.url === "string" ? normalizeLiveUrl(body.url) : null;
  if (!url) {
    return NextResponse.json(
      { ok: false, error: "invalid_url", hint: "Must be a valid http(s) URL." },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
    // Read one chunk so a status-200-with-hung-body still counts as failure.
    let bytes = 0;
    const reader = upstream.body?.getReader();
    if (reader) {
      const first = await reader.read();
      bytes = first.value?.byteLength ?? 0;
      await reader.cancel().catch(() => {});
    }
    return NextResponse.json({
      ok: upstream.ok,
      status: upstream.status,
      contentType: upstream.headers.get("content-type") ?? null,
      bytes,
    });
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    console.error("POST /api/admin/live/test: probe failed", err);
    return NextResponse.json({ ok: false, error: timedOut ? "timeout" : "unreachable" });
  }
}
