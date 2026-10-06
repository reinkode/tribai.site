import postgres from "postgres";

const globalForDb = globalThis as unknown as { tribaiSql?: ReturnType<typeof postgres> };

export function getSql(): ReturnType<typeof postgres> | null {
  if (globalForDb.tribaiSql) return globalForDb.tribaiSql;

  const url = process.env.DATABASE_URL;
  if (!url) return null;

  globalForDb.tribaiSql = postgres(url, {
    // Required for transaction-mode poolers (Supabase, Neon, PgBouncer).
    prepare: false,
    max: 5,
    idle_timeout: 20,
    // Bound the wait so a dead database falls back to the direct send quickly.
    connect_timeout: 5,
  });
  return globalForDb.tribaiSql;
}
