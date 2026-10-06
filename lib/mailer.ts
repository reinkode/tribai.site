import { Resend } from "resend";

export type Inquiry = {
  name: string;
  email: string;
  service: string;
  lang: "en" | "es";
  message: string;
};

export type SendResult = { ok: true; id: string | null } | { ok: false; error: string };

const TO = process.env.CONTACT_TO ?? "contact@tribai.site";
const FROM = process.env.CONTACT_FROM ?? "TribAI Website <no-reply@tribai.site>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildInquiryEmail(inquiry: Inquiry): { subject: string; text: string; html: string } {
  const subject = `New inquiry — ${inquiry.name}${inquiry.service ? ` · ${inquiry.service}` : ""}`.replace(
    /[\r\n]+/g,
    " ",
  );
  const lines = [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    inquiry.service ? `Service: ${inquiry.service}` : null,
    `Language: ${inquiry.lang.toUpperCase()}`,
    "",
    inquiry.message,
  ].filter((line): line is string => line !== null);

  const html = `<div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;line-height:1.6;color:#1a1a1a">
<p><strong>Name:</strong> ${escapeHtml(inquiry.name)}<br/>
<strong>Email:</strong> ${escapeHtml(inquiry.email)}${inquiry.service ? `<br/><strong>Service:</strong> ${escapeHtml(inquiry.service)}` : ""}<br/>
<strong>Language:</strong> ${inquiry.lang.toUpperCase()}</p>
<hr style="border:none;border-top:1px solid #ddd"/>
<p style="white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>
</div>`;

  return { subject, text: lines.join("\n"), html };
}

export async function sendInquiry(inquiry: Inquiry, idempotencyKey?: string): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "not_configured" };

  const { subject, text, html } = buildInquiryEmail(inquiry);
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send(
    { from: FROM, to: [TO], replyTo: inquiry.email, subject, text, html },
    idempotencyKey ? { idempotencyKey } : undefined,
  );

  if (error) return { ok: false, error: `${error.name}: ${error.message}` };
  return { ok: true, id: data?.id ?? null };
}

// Rough plain-text version of the confirmation HTML for mail clients that
// don't render HTML: drop style blocks and tags, keep line breaks.
function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function sendConfirmation(
  inquiry: Inquiry,
  content: { subject: string; html: string },
  idempotencyKey?: string,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "not_configured" };

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send(
    {
      from: FROM,
      to: [inquiry.email],
      replyTo: TO,
      subject: content.subject,
      text: htmlToText(content.html),
      html: content.html,
    },
    idempotencyKey ? { idempotencyKey } : undefined,
  );

  if (error) return { ok: false, error: `${error.name}: ${error.message}` };
  return { ok: true, id: data?.id ?? null };
}
