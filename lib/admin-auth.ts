import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "tribai_admin";
export const ADMIN_SESSION_SECONDS = 7 * 24 * 60 * 60;

function sessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Hash both sides so timingSafeEqual always gets equal-length buffers.
  const given = createHash("sha256").update(candidate, "utf8").digest();
  const real = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(given, real);
}

function sign(payload: string): string | null {
  const secret = sessionSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function createSessionToken(): string | null {
  const exp = Date.now() + ADMIN_SESSION_SECONDS * 1000;
  const sig = sign(`v1.${exp}`);
  return sig ? `v1.${exp}.${sig}` : null;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [version, expRaw, sig] = token.split(".");
  if (version !== "v1" || !expRaw || !sig) return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp <= Date.now()) return false;
  const expected = sign(`v1.${expRaw}`);
  if (!expected) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}
