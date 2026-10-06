// E2E for the registrant confirmation link: DB round-trip with the same SQL
// shapes lib/outbox.ts uses (enqueueInquiry + confirmByToken), plus
// buildConfirmButton/renderTemplate logic checks mirroring lib/templates.ts.
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
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

// --- confirmByToken round-trip (same query shapes as lib/outbox.ts) ---
const token = randomBytes(24).toString("hex");
check("token is 48 hex chars", /^[a-f0-9]{48}$/.test(token));

await sql`
  insert into outbox (payload, confirm_token)
  values (${sql.json({ name: "Verify", email: "verify@example.com", service: "", lang: "es", message: "prueba" })}, ${token})
`;
const row = await sql`select id from outbox where confirm_token = ${token}`;
check("enqueue row exists", row.length === 1);
const leadId = row[0].id;

const updated = await sql`
  update outbox set confirmed_at = now(), updated_at = now()
  where confirm_token = ${token} and confirmed_at is null
  returning id
`;
check("first confirm returns ok", updated.length === 1);

const again = await sql`
  update outbox set confirmed_at = now(), updated_at = now()
  where confirm_token = ${token} and confirmed_at is null
  returning id
`;
const stillThere = await sql`select id from outbox where confirm_token = ${token} limit 1`;
check("second confirm reports already", again.length === 0 && stillThere.length === 1);

const unknown = randomBytes(24).toString("hex");
const missing = await sql`select id from outbox where confirm_token = ${unknown} limit 1`;
check("unknown token reports not_found", missing.length === 0);

const confirmed = await sql`
  select count(*)::int as count from outbox where confirmed_at is not null
`;
check("confirmed count query works", confirmed[0].count >= 1);

await sql`delete from outbox where id = ${leadId}`;
const gone = await sql`select id from outbox where id = ${leadId}`;
check("cleanup removes test row", gone.length === 0);

// --- buildConfirmButton + renderTemplate (mirror of lib/templates.ts) ---
function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function buildConfirmButton(url, lang) {
  const label = lang === "es" ? "Confirmar mi correo" : "Confirm my email address";
  return `<div style="margin:0 0 16px;text-align:center"><a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 30px;background:#A020F0;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;border-radius:8px">${label}</a></div>`;
}
function renderTemplate(template, variables, trusted = []) {
  const trustedKeys = new Set(trusted);
  const fill = (value) =>
    value.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name) =>
      name in variables
        ? trustedKeys.has(name)
          ? variables[name]
          : escapeHtml(variables[name])
        : match,
    );
  return {
    subject: fill(template.subject).replace(/[\r\n]+/g, " ").slice(0, 300),
    html: fill(template.html),
  };
}

const confirmUrl = "https://tribai.site/api/confirm/" + token;
const buttonEs = buildConfirmButton(confirmUrl, "es");
check("button ES label", buttonEs.includes("Confirmar mi correo"));
check("button EN label", buildConfirmButton(confirmUrl, "en").includes("Confirm my email address"));
check("button href contains url", buttonEs.includes(`href="${confirmUrl}"`));

const evilUrl = 'https://tribai.site/x"onmouseover="alert(1)';
check("button url escaped", buildConfirmButton(evilUrl, "es").includes('href="https://tribai.site/x&quot;onmouseover=&quot;alert(1)"'));

const tpl = { subject: "s", html: "<p>{{confirm_url}}</p>{{confirm_button}}" };
const rendered = renderTemplate(tpl, { confirm_url: confirmUrl, confirm_button: buttonEs }, ["confirm_button"]);
check("confirm_url filled", rendered.html.includes(`<p>${confirmUrl}</p>`));
check("confirm_button inserted raw when trusted", rendered.html.includes('href="https://tribai.site'));
check("confirm_button escaped when not trusted", renderTemplate(tpl, { confirm_url: confirmUrl, confirm_button: buttonEs }).html.includes("&lt;div"));

// Escape hatch: with no confirm URL (no-DB fallback) the button renders empty.
const empty = renderTemplate(tpl, { confirm_url: "", confirm_button: "" }, ["confirm_button"]);
check("empty confirm vars leave no dangling link", !empty.html.includes("<a "));

// --- source checks ---
const lib = readFileSync("lib/templates.ts", "utf8");
check("default EN has {{confirm_button}}", /DEFAULT_CONFIRMATION_EN[\s\S]*\{\{confirm_button\}\}/.test(lib));
check("default ES has {{confirm_button}}", /DEFAULT_CONFIRMATION_ES[\s\S]*\{\{confirm_button\}\}/.test(lib));
const admin = readFileSync("app/admin/page.tsx", "utf8");
check("admin selects confirmed_at", /select[\s\S]*confirmed_at[\s\S]*from outbox/.test(admin));
check("admin shows Confirmados card", admin.includes("Confirmados"));
check("admin shows per-lead confirmed badge", admin.includes("✓ Confirmado"));
const outbox = readFileSync("lib/outbox.ts", "utf8");
check("outbox generates 48-hex token", /randomBytes\(24\)\.toString\("hex"\)/.test(outbox));

await sql.end();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
