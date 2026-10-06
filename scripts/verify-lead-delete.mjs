// E2E for the dashboard lead deletion: same SQL shapes as
// app/api/admin/leads/route.ts — delete the outbox row (returning its
// resend_email_id) and then the webhook events tied to that email id.
import { randomBytes } from "node:crypto";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}
const sql = postgres(url, { prepare: false, max: 1 });

let failures = 0;
function check(name, condition) {
  console.log(`${condition ? "ok   " : "FAIL "} ${name}`);
  if (!condition) failures++;
}

const token = randomBytes(24).toString("hex");
const emailId = `test-${randomBytes(6).toString("hex")}@resend.dev`;
const fakeSvix = `msg_${randomBytes(12).toString("hex")}`;

await sql`
  insert into outbox (payload, confirm_token, status, resend_email_id, sent_at)
  values (
    ${sql.json({ name: "DeleteMe", email: "delete-me@example.com", service: "", lang: "en", message: "temp" })},
    ${token}, 'sent', ${emailId}, now()
  )
`;
await sql`
  insert into webhook_events (svix_id, type, email_id, payload)
  values (${fakeSvix}, 'email.sent', ${emailId}, ${sql.json({ test: true })})
  on conflict (svix_id) do nothing
`;

const rows = await sql`
  delete from outbox where confirm_token = ${token} returning resend_email_id
`;
check("outbox row deleted", rows.length === 1 && rows[0].resend_email_id === emailId);

if (rows[0].resend_email_id) {
  await sql`delete from webhook_events where email_id = ${rows[0].resend_email_id}`;
}
const eventsLeft = await sql`
  select count(*)::int as count from webhook_events where email_id = ${emailId}
`;
check("related webhook events deleted", eventsLeft[0].count === 0);

// A lead with no resend_email_id still deletes cleanly (no events step).
const token2 = randomBytes(24).toString("hex");
await sql`
  insert into outbox (payload, confirm_token, status)
  values (${sql.json({ name: "NoEmail", email: "none@example.com", service: "", lang: "es", message: "temp" })}, ${token2}, 'pending')
`;
const rows2 = await sql`
  delete from outbox where confirm_token = ${token2} returning resend_email_id
`;
check("pending lead without email id deletes", rows2.length === 1 && rows2[0].resend_email_id === null);

// Unknown id deletes nothing (404 path).
const ghost = await sql`delete from outbox where id = ${randomBytes(16).toString("hex")} returning id`;
check("unknown id deletes nothing", ghost.length === 0);

await sql.end();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
