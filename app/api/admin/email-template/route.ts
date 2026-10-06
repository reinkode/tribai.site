import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  deleteTemplate,
  getTemplatePair,
  saveTemplatePair,
  TEMPLATE_LANGS,
  type EmailTemplate,
  type TemplateKey,
} from "@/lib/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY: TemplateKey = "confirmation";
const MAX_SUBJECT = 300;
const MAX_HTML = 200_000;

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

function parseTemplate(value: unknown): EmailTemplate | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  if (typeof record.subject !== "string" || typeof record.html !== "string") return null;
  const subject = record.subject.trim();
  const html = record.html.trim();
  if (!subject || subject.length > MAX_SUBJECT) return null;
  if (!html || html.length > MAX_HTML) return null;
  return { subject, html };
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  try {
    const info = await getTemplatePair(KEY);
    return NextResponse.json({
      ok: true,
      key: KEY,
      templates: info.templates,
      source: info.source,
      updatedAt: info.updatedAt ? info.updatedAt.toISOString() : null,
    });
  } catch (err) {
    console.error("GET /api/admin/email-template: failed", err);
    return NextResponse.json({ ok: false, error: "database_error" }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const pair: Record<(typeof TEMPLATE_LANGS)[number], EmailTemplate> = {} as never;
  for (const lang of TEMPLATE_LANGS) {
    const template = parseTemplate(body[lang]);
    if (!template) {
      return NextResponse.json(
        {
          ok: false,
          error: "invalid_template",
          hint: `${lang.toUpperCase()}: subject (1–${MAX_SUBJECT} chars) and HTML (1–${MAX_HTML.toLocaleString("en")} chars) are required.`,
        },
        { status: 400 },
      );
    }
    pair[lang] = template;
  }

  try {
    await saveTemplatePair(KEY, pair);
    return NextResponse.json({ ok: true, key: KEY });
  } catch (err) {
    console.error("PUT /api/admin/email-template: failed", err);
    return NextResponse.json({ ok: false, error: "database_error" }, { status: 503 });
  }
}

export async function DELETE() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  try {
    await deleteTemplate(KEY);
    return NextResponse.json({ ok: true, key: KEY });
  } catch (err) {
    console.error("DELETE /api/admin/email-template: failed", err);
    return NextResponse.json({ ok: false, error: "database_error" }, { status: 503 });
  }
}
