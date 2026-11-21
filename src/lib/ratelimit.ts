import "server-only";
import { headers } from "next/headers";

/**
 * A very small in-memory rate limit, per IP, per server instance.
 *
 * Deliberately not durable: it exists to blunt a script, not to be an
 * authorisation boundary. A Lambda cold start forgets everything it knows, and
 * two warm instances count separately — both acceptable for the things it
 * guards (form posts and checkout sessions), neither acceptable if it ever
 * guards something that costs real money per call. Revisit if that changes.
 *
 * It also fronts the /admin login, where the same caveats are sharper: n warm
 * instances multiply the attempt budget by n, a cold start resets it to empty,
 * and the key is the IP, so rotating IPs defeat it entirely. There it blunts a
 * naive script and produces the only attack signal this stack can emit (a line
 * in CloudWatch). **The password's entropy is the actual defence** — see the
 * generate-don't-choose note in .env.example. Do not mistake five-per-ten-
 * minutes for a security control.
 *
 * Lives here rather than in actions.ts so the route handlers can share it:
 * actions.ts is "use server", and importing it from a route handler would drag
 * the whole server-action module graph along with it.
 */
const hits = new Map<string, number[]>();

export function limited(key: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

export async function clientIp() {
  const h = await headers();
  // x-viewer-ip is set by CloudFront (infra/cdn.tf) and can't be spoofed through it; x-forwarded-for can.
  return h.get("x-viewer-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}
