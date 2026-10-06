import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { sendConfirmation, sendInquiry, type Inquiry } from "@/lib/mailer";
import { deliver, enqueueInquiry } from "@/lib/outbox";
import { buildConfirmButton, getTemplate, renderTemplate } from "@/lib/templates";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  if (hits.size > 5000) hits.clear();
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

// Public base URL for links embedded in emails. Priority: SITE_URL env wins
// (stable public address in production); otherwise the origin reported by the
// browser (the address the visitor actually sees in the address bar, sent by
// the form); last resort the request origin.
function publicOrigin(request: Request, browserOrigin?: unknown): string {
  const siteUrl = process.env.SITE_URL?.trim();
  if (siteUrl && /^https?:\/\//i.test(siteUrl)) return siteUrl.replace(/\/+$/, "");
  if (
    typeof browserOrigin === "string" &&
    browserOrigin.length <= 100 &&
    /^https?:\/\/[\w.-]+(:\d{1,5})?$/i.test(browserOrigin)
  ) {
    return browserOrigin;
  }
  return new URL(request.url).origin;
}

// Acknowledgment for the registrant. Never let it fail the request: the lead
// is already persisted and the owner notification has its own retry path.
async function sendConfirmationEmail(
  inquiry: Inquiry,
  opts: { idempotencyKey?: string; confirmUrl?: string } = {},
): Promise<void> {
  try {
    const template = await getTemplate("confirmation", inquiry.lang);
    const content = renderTemplate(
      template,
      {
        name: inquiry.name,
        email: inquiry.email,
        service: inquiry.service,
        message: inquiry.message,
        confirm_url: opts.confirmUrl ?? "",
        confirm_button: opts.confirmUrl
          ? buildConfirmButton(opts.confirmUrl, inquiry.lang)
          : "",
      },
      ["confirm_button"],
    );
    const result = await sendConfirmation(inquiry, content, opts.idempotencyKey);
    if (!result.ok) console.error("POST /api/contact: confirmation failed:", result.error);
  } catch (err) {
    console.error("POST /api/contact: confirmation error", err);
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Honeypot: bots fill every field. Pretend success and drop silently.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const service = typeof body.service === "string" ? body.service.trim().slice(0, 160) : "";
  const lang = body.lang === "es" ? "es" : "en";

  if (!name || name.length > 120) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }
  if (!isValidEmail(email) || email.length > 200) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (!message || message.length > 5000) {
    return NextResponse.json({ ok: false, error: "invalid_message" }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "too_many_requests" }, { status: 429 });
  }

  const inquiry: Inquiry = { name, email, service, lang, message };

  // Persist first: once the lead is in the outbox it survives Resend outages,
  // quota limits and broken deploys — /api/cron/retry retries it with backoff
  // and the Idempotency-Key prevents duplicates.
  if (getSql()) {
    try {
      const { id, confirmToken } = await enqueueInquiry(inquiry);
      await deliver(id);
      await sendConfirmationEmail(inquiry, {
        idempotencyKey: `${id}:confirm`,
        confirmUrl: `${publicOrigin(request, body.origin)}/api/confirm/${confirmToken}`,
      });
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("POST /api/contact: outbox failed, falling back to direct send", err);
    }
  }

  const result = await sendInquiry(inquiry);
  if (!result.ok) {
    console.error("POST /api/contact: send failed:", result.error);
    const notConfigured = result.error === "not_configured";
    return NextResponse.json(
      { ok: false, error: notConfigured ? "not_configured" : "send_failed" },
      { status: notConfigured ? 503 : 502 },
    );
  }

  await sendConfirmationEmail(inquiry);
  return NextResponse.json({ ok: true });
}
