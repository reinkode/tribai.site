import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { processDue } from "@/lib/outbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authorization = request.headers.get("authorization");
    const key = new URL(request.url).searchParams.get("key");
    if (authorization !== `Bearer ${secret}` && key !== secret) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  if (!getSql()) {
    return NextResponse.json({ ok: true, skipped: "no_database" });
  }

  try {
    const result = await processDue(50);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("GET /api/cron/retry: database error", err);
    return NextResponse.json({ ok: false, error: "database_error" }, { status: 503 });
  }
}
