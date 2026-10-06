import { randomBytes } from "node:crypto";
import { getSql } from "@/lib/db";
import { sendInquiry, type Inquiry, type SendResult } from "@/lib/mailer";

// Retry schedule after each failed attempt (~2.6 days before dead-lettering).
const BACKOFF_MINUTES = [1, 5, 15, 60, 240, 720, 1440, 2880];

type OutboxRow = { id: string; payload: Inquiry; attempts: number };

export async function enqueueInquiry(
  inquiry: Inquiry,
): Promise<{ id: string; confirmToken: string }> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");

  // 48 hex chars of entropy — unguessable, URL-safe, no padding.
  const confirmToken = randomBytes(24).toString("hex");
  const [row] = await sql<{ id: string }[]>`
    insert into outbox (payload, confirm_token) values (${sql.json(inquiry)}, ${confirmToken})
    returning id
  `;
  return { id: row.id, confirmToken };
}

export type ConfirmResult = "ok" | "already" | "not_found" | "error";

// Marks the lead as confirmed by its token. Idempotent: a second click on the
// same link reports "already" instead of failing.
export async function confirmByToken(token: string): Promise<ConfirmResult> {
  const sql = getSql();
  if (!sql) return "error";

  try {
    const updated = await sql<{ id: string }[]>`
      update outbox
      set confirmed_at = now(), updated_at = now()
      where confirm_token = ${token} and confirmed_at is null
      returning id
    `;
    if (updated.length > 0) return "ok";

    const rows = await sql<{ id: string }[]>`
      select id from outbox where confirm_token = ${token} limit 1
    `;
    return rows.length > 0 ? "already" : "not_found";
  } catch (err) {
    console.error("outbox: confirmByToken failed", err);
    return "error";
  }
}

async function attemptSend(row: OutboxRow): Promise<"sent" | "pending" | "failed"> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");

  let result: SendResult;
  try {
    result = await sendInquiry(row.payload, row.id);
  } catch (err) {
    result = { ok: false, error: err instanceof Error ? err.message : "unknown_error" };
  }

  if (result.ok) {
    try {
      await sql`
        update outbox
        set status = 'sent', sent_at = now(), resend_email_id = ${result.id}, last_error = null, updated_at = now()
        where id = ${row.id} and status = 'pending'
      `;
    } catch (err) {
      // The email went out; if the status update is lost the cron retries with the
      // same Idempotency-Key (row id) and Resend dedupes instead of sending twice.
      console.error("outbox: failed to mark sent", row.id, err);
    }
    return "sent";
  }

  // Missing API key is a deployment gap, not a failed attempt: stay due, don't burn retries.
  if (result.error === "not_configured") {
    await sql`
      update outbox
      set next_attempt_at = now(), last_error = ${result.error}, updated_at = now()
      where id = ${row.id} and status = 'pending'
    `;
    return "pending";
  }

  const attempts = row.attempts + 1;
  if (attempts >= BACKOFF_MINUTES.length) {
    await sql`
      update outbox
      set status = 'failed', attempts = ${attempts}, last_error = ${result.error}, updated_at = now()
      where id = ${row.id} and status = 'pending'
    `;
    return "failed";
  }

  await sql`
    update outbox
    set attempts = ${attempts},
        next_attempt_at = now() + make_interval(mins => ${BACKOFF_MINUTES[attempts - 1]}::int),
        last_error = ${result.error},
        updated_at = now()
    where id = ${row.id} and status = 'pending'
  `;
  return "pending";
}

export async function deliver(id: string): Promise<void> {
  const sql = getSql();
  if (!sql) return;

  const [row] = await sql<OutboxRow[]>`
    select id, payload, attempts from outbox where id = ${id} and status = 'pending'
  `;
  if (!row) return;

  await attemptSend(row);
}

export async function processDue(
  limit = 50,
): Promise<{ claimed: number; sent: number; pending: number; failed: number }> {
  const sql = getSql();
  if (!sql) return { claimed: 0, sent: 0, pending: 0, failed: 0 };

  // Claim due rows atomically (skip locked) and push them 10 minutes out so a
  // concurrent cron run can't double-process them; attemptSend writes the real backoff.
  const rows = await sql<OutboxRow[]>`
    update outbox
    set next_attempt_at = now() + make_interval(mins => 10)
    where id in (
      select id from outbox
      where status = 'pending' and next_attempt_at <= now()
      order by next_attempt_at
      limit ${limit}
      for update skip locked
    )
    returning id, payload, attempts
  `;

  const counts = { claimed: rows.length, sent: 0, pending: 0, failed: 0 };
  for (const row of rows) {
    counts[await attemptSend(row)] += 1;
  }
  return counts;
}
