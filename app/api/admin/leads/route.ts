import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Deletes one lead row and the webhook events tied to its owner-notification
// email. Events arrive with a 1–2 min lag, so a row deleted right after sending
// may leave a few unmatched events behind — they expire on their own and are
// never re-linked.
export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id || id.length > 64) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  const sql = getSql();
  if (!sql) {
    return NextResponse.json({ ok: false, error: "database_not_configured" }, { status: 503 });
  }

  try {
    const rows = await sql<{ resend_email_id: string | null }[]>`
      delete from outbox where id = ${id} returning resend_email_id
    `;
    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    if (rows[0].resend_email_id) {
      await sql`delete from webhook_events where email_id = ${rows[0].resend_email_id}`;
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/leads: failed", err);
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 });
  }
}
