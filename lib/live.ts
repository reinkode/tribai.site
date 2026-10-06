import { getSql } from "./db";

export type LiveProject = {
  name: string;
  url: string;
  created_at: Date;
  updated_at: Date;
};

export const LIVE_NAME_PATTERN = /^[a-z0-9][a-z0-9-]{0,39}$/;

const LOOKUP_TTL_MS = 5_000;
const lookupCache = new Map<string, { url: string | null; expires: number }>();

export function normalizeLiveName(raw: string): string | null {
  const name = raw.trim().toLowerCase();
  return LIVE_NAME_PATTERN.test(name) ? name : null;
}

export function normalizeLiveUrl(raw: string): string | null {
  // Tolerate the common "https//host" typo (scheme without colon).
  const cleaned = raw.trim().replace(/^(https?):?\/{2,}/i, "$1://");
  let parsed: URL;
  try {
    parsed = new URL(cleaned);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  // A hostname without a dot means the URL was malformed (e.g. a duplicated
  // scheme like "https://https//host" parses with hostname "https").
  if (!parsed.hostname.includes(".") && parsed.hostname !== "localhost") return null;
  let pathname = parsed.pathname.replace(/\/+$/, "");
  if (pathname === "/") pathname = "";
  parsed.pathname = pathname;
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString().replace(/\/$/, "");
}

export async function resolveLiveUrl(name: string): Promise<string | null> {
  const cached = lookupCache.get(name);
  if (cached && cached.expires > Date.now()) return cached.url;

  const sql = getSql();
  let url: string | null = null;
  if (sql) {
    const rows = await sql<{ url: string }[]>`
      select url from live_projects where name = ${name}
    `;
    url = rows[0]?.url ?? null;
  }
  lookupCache.set(name, { url, expires: Date.now() + LOOKUP_TTL_MS });
  return url;
}

export function invalidateLiveCache(name?: string): void {
  if (name) lookupCache.delete(name);
  else lookupCache.clear();
}

export async function listLiveProjects(): Promise<LiveProject[]> {
  const sql = getSql();
  if (!sql) return [];
  return sql<LiveProject[]>`
    select name, url, created_at, updated_at from live_projects order by name
  `;
}

export async function upsertLiveProject(name: string, url: string): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("database_not_configured");
  await sql`
    insert into live_projects (name, url) values (${name}, ${url})
    on conflict (name) do update set url = excluded.url, updated_at = now()
  `;
  invalidateLiveCache(name);
}

export async function deleteLiveProject(name: string): Promise<boolean> {
  const sql = getSql();
  if (!sql) throw new Error("database_not_configured");
  const rows = await sql<{ name: string }[]>`
    delete from live_projects where name = ${name} returning name
  `;
  invalidateLiveCache(name);
  return rows.length > 0;
}
