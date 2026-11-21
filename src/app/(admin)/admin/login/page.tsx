import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireConfigured, signedIn } from "@/lib/adminSession";
import { login } from "../actions";

/**
 * The only admin page that doesn't require a session.
 *
 * With ADMIN_PASSWORD unset this 404s like every other admin route, rather than
 * showing a form that could never succeed: an unconfigured deployment should
 * not advertise the door.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

// Deliberately vague. "Wrong password" and "no such user" would be the same
// message anyway — there is one password — but there's no reason to confirm
// anything to someone guessing.
const MESSAGES: Record<string, string> = {
  bad: "That didn't work.",
  rate: "Too many attempts from here. Give it ten minutes.",
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  requireConfigured();
  if (await signedIn()) redirect("/admin/orders");

  const { e } = await searchParams;
  const message = e ? MESSAGES[e] : undefined;

  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-mist">Do Less · admin</p>
        <h1 className="display heavy mt-3 text-[clamp(2rem,6vw,2.8rem)]">Sign in</h1>

        <form action={login} className="mt-8 flex flex-col gap-4">
          <label htmlFor="password" className="font-mono text-sm text-mist">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            autoFocus
            aria-describedby={message ? "login-error" : undefined}
            className="min-h-12 w-full border border-line bg-ink-2 px-4 font-mono text-paper outline-none transition-colors placeholder:text-paper/25 focus:border-accent"
          />
          {message && (
            <p id="login-error" role="alert" className="font-mono text-sm text-accent">
              ↳ {message}
            </p>
          )}
          <button type="submit" className="btn btn-accent mt-2">
            Sign in
          </button>
        </form>

        <p className="mt-10 text-sm text-mist">
          Orders and leads for the off-the-shelf catalog. Nothing here is public.
        </p>
      </div>
    </div>
  );
}
