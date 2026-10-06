import { getSql } from "./db";

export type EmailTemplate = { subject: string; html: string };
export type TemplateKey = "confirmation";
export type TemplateLang = "en" | "es";

export const TEMPLATE_LANGS: TemplateLang[] = ["en", "es"];

const TEMPLATE_TTL_MS = 5_000;
const templateCache = new Map<string, { template: EmailTemplate | null; expires: number }>();

const DEFAULT_CONFIRMATION_EN: EmailTemplate = {
  subject: "We received your message — TribAI",
  html: `<div style="margin:0;padding:24px;background:#0d0618;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#160b26;border:1px solid #3b1d5e;border-radius:12px;overflow:hidden">
    <div style="padding:20px 24px;border-bottom:1px solid #3b1d5e">
      <span style="font-size:20px;font-weight:bold;letter-spacing:1px;color:#D7A1F9">Trib<span style="color:#A020F0">AI</span></span>
    </div>
    <div style="padding:24px;color:#e9e9e9;font-size:14px;line-height:1.6">
      <p style="margin:0 0 16px">Hi {{name}},</p>
      <p style="margin:0 0 16px">Thank you for reaching out. We have received your message and our team will get back to you shortly.</p>
      <div style="margin:0 0 16px;padding:12px 16px;background:#0d0618;border-left:3px solid #A020F0;border-radius:0 8px 8px 0;color:#bdbdbd;white-space:pre-wrap">{{message}}</div>
      <p style="margin:0 0 8px">To confirm you received this email, please click the button below:</p>
      {{confirm_button}}
      <p style="margin:16px 0 16px">If anything changes, just reply to this email.</p>
      <p style="margin:0">— The TribAI team</p>
    </div>
    <div style="padding:16px 24px;border-top:1px solid #3b1d5e;color:#777;font-size:11px">
      You are receiving this email because you contacted us through tribai.site.
    </div>
  </div>
</div>`,
};

const DEFAULT_CONFIRMATION_ES: EmailTemplate = {
  subject: "Recibimos tu mensaje — TribAI",
  html: `<div style="margin:0;padding:24px;background:#0d0618;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#160b26;border:1px solid #3b1d5e;border-radius:12px;overflow:hidden">
    <div style="padding:20px 24px;border-bottom:1px solid #3b1d5e">
      <span style="font-size:20px;font-weight:bold;letter-spacing:1px;color:#D7A1F9">Trib<span style="color:#A020F0">AI</span></span>
    </div>
    <div style="padding:24px;color:#e9e9e9;font-size:14px;line-height:1.6">
      <p style="margin:0 0 16px">Hola {{name}},</p>
      <p style="margin:0 0 16px">Gracias por escribirnos. Hemos recibido tu mensaje y nuestro equipo te responderá en breve.</p>
      <div style="margin:0 0 16px;padding:12px 16px;background:#0d0618;border-left:3px solid #A020F0;border-radius:0 8px 8px 0;color:#bdbdbd;white-space:pre-wrap">{{message}}</div>
      <p style="margin:0 0 8px">Para confirmar que recibiste este correo, pulsa el siguiente botón:</p>
      {{confirm_button}}
      <p style="margin:16px 0 16px">Si algo cambia, simplemente responde a este correo.</p>
      <p style="margin:0">— El equipo de TribAI</p>
    </div>
    <div style="padding:16px 24px;border-top:1px solid #3b1d5e;color:#777;font-size:11px">
      Recibes este correo porque nos contactaste a través de tribai.site.
    </div>
  </div>
</div>`,
};

const DEFAULT_TEMPLATES: Record<TemplateKey, Record<TemplateLang, EmailTemplate>> = {
  confirmation: { en: DEFAULT_CONFIRMATION_EN, es: DEFAULT_CONFIRMATION_ES },
};

export function getDefaultTemplate(key: TemplateKey, lang: TemplateLang): EmailTemplate {
  return DEFAULT_TEMPLATES[key][lang];
}

export async function getTemplate(key: TemplateKey, lang: TemplateLang): Promise<EmailTemplate> {
  const cacheKey = `${key}:${lang}`;
  const cached = templateCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.template ?? DEFAULT_TEMPLATES[key][lang];
  }

  const sql = getSql();
  let template: EmailTemplate | null = null;
  if (sql) {
    try {
      const rows = await sql<EmailTemplate[]>`
        select subject, html from email_templates where key = ${key} and lang = ${lang}
      `;
      template = rows[0] ?? null;
    } catch (err) {
      // A DB hiccup must not break the contact form — fall back to the default.
      console.error(`templates: read failed for ${cacheKey}`, err);
    }
  }
  templateCache.set(cacheKey, { template, expires: Date.now() + TEMPLATE_TTL_MS });
  return template ?? DEFAULT_TEMPLATES[key][lang];
}

export type TemplatePairInfo = {
  templates: Record<TemplateLang, EmailTemplate>;
  source: "database" | "defaults";
  updatedAt: Date | null;
};

export async function getTemplatePair(key: TemplateKey): Promise<TemplatePairInfo> {
  const sql = getSql();
  const result: TemplatePairInfo = {
    templates: {
      en: DEFAULT_TEMPLATES[key].en,
      es: DEFAULT_TEMPLATES[key].es,
    },
    source: "defaults",
    updatedAt: null,
  };
  if (!sql) return result;

  const rows = await sql<{ lang: TemplateLang; subject: string; html: string; updated_at: Date }[]>`
    select lang, subject, html, updated_at from email_templates where key = ${key}
  `;
  for (const row of rows) {
    if (row.lang === "en" || row.lang === "es") {
      result.templates[row.lang] = { subject: row.subject, html: row.html };
      result.source = "database";
      if (!result.updatedAt || row.updated_at > result.updatedAt) {
        result.updatedAt = row.updated_at;
      }
    }
  }
  return result;
}

export async function saveTemplatePair(
  key: TemplateKey,
  pair: Record<TemplateLang, EmailTemplate>,
): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("database_not_configured");
  for (const lang of TEMPLATE_LANGS) {
    const { subject, html } = pair[lang];
    await sql`
      insert into email_templates (key, lang, subject, html)
      values (${key}, ${lang}, ${subject}, ${html})
      on conflict (key, lang) do update
        set subject = excluded.subject, html = excluded.html, updated_at = now()
    `;
  }
  invalidateTemplateCache(key);
}

export async function deleteTemplate(key: TemplateKey): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("database_not_configured");
  await sql`delete from email_templates where key = ${key}`;
  invalidateTemplateCache(key);
}

export function invalidateTemplateCache(key?: TemplateKey): void {
  if (key) {
    for (const lang of TEMPLATE_LANGS) templateCache.delete(`${key}:${lang}`);
  } else {
    templateCache.clear();
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Centered CTA block that points to the lead's confirmation link. The URL is
// built from the request origin plus a server-generated hex token, but it is
// escaped anyway since it lands inside an href attribute.
export function buildConfirmButton(url: string, lang: TemplateLang): string {
  const label = lang === "es" ? "Confirmar mi correo" : "Confirm my email address";
  return `<div style="margin:0 0 16px;text-align:center"><a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 30px;background:#A020F0;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;border-radius:8px">${label}</a></div>`;
}

// Fills {{placeholders}} with HTML-escaped values. Placeholders without a
// matching variable are left untouched so typos are visible in the preview
// instead of silently rendering empty. Values whose key is listed in `trusted`
// are inserted raw — only for variables whose HTML is generated server-side
// (e.g. the confirm button block), never for lead-provided data.
export function renderTemplate(
  template: EmailTemplate,
  variables: Record<string, string>,
  trusted: string[] = [],
): EmailTemplate {
  const trustedKeys = new Set(trusted);
  const fill = (value: string) =>
    value.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) =>
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
