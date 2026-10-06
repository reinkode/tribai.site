import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  deleteLiveProject,
  listLiveProjects,
  normalizeLiveName,
  normalizeLiveUrl,
  upsertLiveProject,
} from "@/lib/live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  try {
    return NextResponse.json({ ok: true, projects: await listLiveProjects() });
  } catch (err) {
    console.error("GET /api/admin/live: failed", err);
    return NextResponse.json({ ok: false, error: "database_error" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? normalizeLiveName(body.name) : null;
  const url = typeof body.url === "string" ? normalizeLiveUrl(body.url) : null;
  if (!name) {
    return NextResponse.json(
      { ok: false, error: "invalid_name", hint: "1–40 chars: letters, numbers and hyphens." },
      { status: 400 },
    );
  }
  if (!url) {
    return NextResponse.json(
      { ok: false, error: "invalid_url", hint: "Must be a valid http(s) URL." },
      { status: 400 },
    );
  }

  try {
    await upsertLiveProject(name, url);
    return NextResponse.json({ ok: true, project: { name, url } });
  } catch (err) {
    console.error("POST /api/admin/live: failed", err);
    return NextResponse.json({ ok: false, error: "database_error" }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  const nameParam = new URL(request.url).searchParams.get("name");
  const name = nameParam ? normalizeLiveName(nameParam) : null;
  if (!name) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }

  try {
    const deleted = await deleteLiveProject(name);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/live: failed", err);
    return NextResponse.json({ ok: false, error: "database_error" }, { status: 503 });
  }
}
