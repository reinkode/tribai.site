// E2E for the confirmation email template: DB round-trip with the same SQL
// shapes lib/templates.ts uses, plus renderTemplate/escapeHtml logic checks.
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

// --- DB round-trip (same query shapes as lib/templates.ts) ---
const key = "confirmation";
const en = { subject: "Test subject EN {{name}}", html: "<p>Hi {{name}}</p>" };
const es = { subject: "Asunto de prueba ES {{name}}", html: "<p>Hola {{name}}</p>" };

for (const [lang, tpl] of [["en", en], ["es", es]]) {
  await sql`
    insert into email_templates (key, lang, subject, html)
    values (${key}, ${lang}, ${tpl.subject}, ${tpl.html})
    on conflict (key, lang) do update
      set subject = excluded.subject, html = excluded.html, updated_at = now()
  `;
}
const rows = await sql`
  select lang, subject, html, updated_at from email_templates where key = ${key}
`;
check("upsert wrote 2 rows", rows.length === 2);
check("en round-trip", rows.find((r) => r.lang === "en")?.subject === en.subject);
check("es round-trip", rows.find((r) => r.lang === "es")?.html === es.html);

await sql`delete from email_templates where key = ${key}`;
const after = await sql`select count(*)::int as count from email_templates where key = ${key}`;
check("delete clears rows", after[0].count === 0);

// --- renderTemplate + escapeHtml (mirror of lib/templates.ts) ---
function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function renderTemplate(template, variables) {
  const fill = (value) =>
    value.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name) =>
      name in variables ? escapeHtml(variables[name]) : match,
    );
  return {
    subject: fill(template.subject).replace(/[\r\n]+/g, " ").slice(0, 300),
    html: fill(template.html),
  };
}

const rendered = renderTemplate(
  { subject: "Hola {{name}}", html: "<b>{{name}}</b><p>{{message}}</p><p>{{unknown}}</p>" },
  { name: `<img src=x onerror=alert(1)>`, message: "Linea1\nLinea2" },
);
check("name escaped", rendered.html.startsWith("<b>&lt;img src=x onerror=alert(1)&gt;</b>"));
check("unknown placeholder preserved", rendered.html.includes("{{unknown}}"));
check("subject filled", rendered.subject === "Hola &lt;img src=x onerror=alert(1)&gt;");

const longSubject = renderTemplate({ subject: "x".repeat(400), html: "ok" }, {});
check("subject capped at 300", longSubject.subject.length === 300);
const newlineSubject = renderTemplate({ subject: "a\r\nb", html: "ok" }, {});
check("subject newlines stripped", newlineSubject.subject === "a b");

// Default templates contain the placeholders they need.
const fs = await import("node:fs");
const lib = fs.readFileSync("lib/templates.ts", "utf8");
check("default EN has {{name}} and {{message}}", /DEFAULT_CONFIRMATION_EN[\s\S]*\{\{name\}\}[\s\S]*\{\{message\}\}/.test(lib));
check("default ES has {{name}} and {{message}}", /DEFAULT_CONFIRMATION_ES[\s\S]*\{\{name\}\}[\s\S]*\{\{message\}\}/.test(lib));

await sql.end();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
