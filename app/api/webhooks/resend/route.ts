import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";

const REPLAY_WINDOW_SECONDS = 300;

function verifySignature(headers: Headers, rawBody: string, secret: string): boolean {
  const svixId = headers.get("svix-id");
  const svixTimestamp = headers.get("svix-timestamp");
  const svixSignature = headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) return false;

  const timestamp = Number(svixTimestamp);
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > REPLAY_WINDOW_SECONDS) {
    return false;
  }

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = crypto
    .createHmac("sha256", key)
    .update(`${svixId}.${svixTimestamp}.${rawBody}`)
    .digest();

  return svixSignature.split(" ").some((part) => {
    const [version, signature] = part.split(",");
    if (version !== "v1" || !signature) return false;
    const provided = Buffer.from(signature, "base64");
    return provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
  });
}

type ResendEvent = {
  type?: string;
  data?: {
    email_id?: string;
    bounce?: { message?: string };
    failed?: { reason?: string };
  };
};

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("POST /api/webhooks/resend: RESEND_WEBHOOK_SECRET is not set");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  if (!verifySignature(request.headers, rawBody, secret)) {
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 401 });
  }

  const sql = getSql();
  if (!sql) {
    console.error("POST /api/webhooks/resend: DATABASE_URL is not set");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let event: ResendEvent;
  try {
    event = JSON.parse(rawBody) as ResendEvent;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const svixId = request.headers.get("svix-id")!;
  const emailId = event.data?.email_id ?? null;

  // Svix retries reuse the same svix-id — apply each event exactly once.
  const inserted = await sql<{ svix_id: string }[]>`
    insert into webhook_events (svix_id, type, email_id, payload)
    values (${svixId}, ${event.type ?? "unknown"}, ${emailId}, ${sql.json(event)})
    on conflict (svix_id) do nothing
    returning svix_id
  `;
  if (inserted.length === 0) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  if (emailId) {
    if (event.type === "email.delivered") {
      await sql`
        update outbox
        set status = 'delivered', delivered_at = now(), last_error = null, updated_at = now()
        where resend_email_id = ${emailId}
      `;
    } else if (event.type === "email.bounced" || event.type === "email.failed") {
      const reason = event.data?.bounce?.message ?? event.data?.failed?.reason ?? event.type;
      await sql`
        update outbox
        set status = 'failed', last_error = ${reason}, updated_at = now()
        where resend_email_id = ${emailId} and status <> 'delivered'
      `;
    } else if (event.type === "email.delivery_delayed") {
      await sql`
        update outbox
        set last_error = 'delivery_delayed', updated_at = now()
        where resend_email_id = ${emailId} and status = 'sent'
      `;
    }
  }

  return NextResponse.json({ ok: true });
}
