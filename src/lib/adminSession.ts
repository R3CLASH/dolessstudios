import "server-only";
import { cache } from "react";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

/**
 * The whole of /admin's auth: one shared password in ADMIN_PASSWORD, and a
 * signed cookie proving someone typed it.
 *
 * Three decisions worth knowing before changing anything here:
 *
 * 1. **The signing key is derived from the password**, not configured
 *    separately. One env var is the whole setup, and rotating the password
 *    invalidates every live session for free.
 * 2. **The cookie's payload is only an expiry timestamp.** There is one
 *    account, so there is no identity to carry; signing the expiry is what
 *    stops a client extending its own session by editing the value.
 * 3. **Absent reads as absent.** With no ADMIN_PASSWORD set, every admin route
 *    404s — including the login form, which would otherwise advertise a door
 *    that can never open. Same posture as getDb(), getTransport(), dodoKey()
 *    and ORDER_LINK_SECRET: nothing throws and nothing half-works.
 */

export const ADMIN_COOKIE = "dls_admin";

const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Inside the signed bytes, so a future v2 format can't be downgraded to v1 by
 * trimming the cookie value.
 */
const SESSION_VERSION = "v1";

/**
 * Short enough to be guessable at the rate API Gateway allows. Warn rather than
 * refuse: refusing would 404 the area, which looks identical to "unset" and
 * would hide the real problem. CloudWatch is the only observability here.
 */
const WEAK_PASSWORD_CHARS = 16;
let warnedWeak = false;

/** Read inside the function, never at module scope: CI builds with no secrets (trap #3). */
function adminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD || null;
  if (password && password.length < WEAK_PASSWORD_CHARS && !warnedWeak) {
    warnedWeak = true;
    console.error(
      `[admin] ADMIN_PASSWORD is only ${password.length} characters. The login rate limit is in-memory and per instance, so the password's entropy is the real defence — generate one with: openssl rand -base64 24`,
    );
  }
  return password;
}

export function adminConfigured(): boolean {
  return adminPassword() !== null;
}

/**
 * Constant-time compare of two secrets of any length.
 *
 * This hashes both sides first rather than using orderRef.ts's
 * length-check-then-timingSafeEqual: there, both strings are HMACs of a known
 * fixed length, so a length mismatch leaks nothing. Here one side is a password
 * a human chose, and an early length check would leak how long it is. Hashing
 * makes both inputs 32 bytes, so the comparison is always over equal lengths.
 */
function sameSecret(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a, "utf8").digest();
  const hb = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(ha, hb);
}

/**
 * HMAC with the password as the key, not a hash over a concatenation: HMAC is
 * the defined construction for keyed derivation, and it matches the idiom in
 * orderRef.ts. 32 base64url chars is 192 bits, same as signReference().
 */
function signingKey(password: string) {
  return createHmac("sha256", password).update(SESSION_VERSION).digest();
}

function sign(payload: string, password: string): string {
  return createHmac("sha256", signingKey(password)).update(payload).digest("base64url").slice(0, 32);
}

export function checkPassword(input: string): boolean {
  const password = adminPassword();
  if (!password) return false;
  return sameSecret(input, password);
}

/** The cookie value for a fresh session, or null when there's no password to sign with. */
export function createSession(): string | null {
  const password = adminPassword();
  if (!password) return null;
  const payload = `${SESSION_VERSION}.${Date.now() + SESSION_MS}`;
  return `${payload}.${sign(payload, password)}`;
}

export function verifySession(value: string | undefined): boolean {
  const password = adminPassword();
  if (!password || !value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [version, expiryRaw, token] = parts;
  if (version !== SESSION_VERSION) return false;

  const payload = `${version}.${expiryRaw}`;
  // Signature before expiry, so an unsigned value is never parsed as a date.
  if (!sameSecret(token, sign(payload, password))) return false;

  /**
   * Expiry is enforced from the SIGNED payload, never from the cookie's own
   * Max-Age: that is a client-side courtesy, and a client can keep presenting
   * an expired cookie forever.
   */
  const expiry = Number(expiryRaw);
  return Number.isFinite(expiry) && expiry > Date.now();
}

/**
 * Scoped to /admin, so the session is never attached to a request for the
 * marketing site, the Dodo webhook or the checkout route. `secure` is off
 * outside production only because local dev is plain http, and a Secure cookie
 * on http is silently dropped.
 */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/admin",
    maxAge: Math.floor(SESSION_MS / 1000),
  };
}

export async function signedIn(): Promise<boolean> {
  const jar = await cookies();
  return verifySession(jar.get(ADMIN_COOKIE)?.value);
}

/** 404s the whole area when there is no password configured. */
export function requireConfigured(): void {
  if (!adminConfigured()) notFound();
}

/**
 * The authorisation check, called at the top of every admin page and inside
 * every mutation — next to the data, not in a proxy/middleware matcher. The
 * Next docs are explicit that Proxy should not be the only authorisation layer,
 * and with a handful of routes an explicit call is easier to audit than a
 * matcher. cache() keeps it to one cookie read per render.
 */
export const requireAdmin = cache(async (): Promise<void> => {
  requireConfigured();
  if (!(await signedIn())) redirect("/admin/login");
});
