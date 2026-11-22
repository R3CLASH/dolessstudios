import "server-only";
import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

type DB = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { __dlsSql?: postgres.Sql; __dlsDb?: DB };

/**
 * Connection-string parameters that are libpq client-side only, and which
 * postgres-js does not know about.
 *
 * postgres-js forwards every query parameter it does not recognise to Postgres as
 * a startup parameter (the `connection` object in its parseOptions), and the
 * server then refuses the connection outright:
 *   unrecognized configuration parameter "channel_binding"
 * Neon puts `channel_binding=require` on the URIs it issues, so the URL has to be
 * cleaned before the driver sees it. `sslmode` is deliberately NOT in this list:
 * postgres-js recognises it and maps it onto its own `ssl` option.
 */
const CLIENT_ONLY_PARAMS = ["channel_binding"];

/** Strips the parameters above, leaving any other URL byte-for-byte untouched. */
function driverUrl(raw: string): string {
  // Local Postgres and anything else without these parameters is passed through
  // unchanged, so this can never reformat a URL it did not need to fix.
  if (!CLIENT_ONLY_PARAMS.some((name) => raw.includes(name + "="))) return raw;
  try {
    const parsed = new URL(raw);
    for (const name of CLIENT_ONLY_PARAMS) parsed.searchParams.delete(name);
    return parsed.toString();
  } catch {
    // Not something URL can parse. Hand it over as-is rather than guessing.
    return raw;
  }
}

/**
 * Lazily creates one connection pool per server process.
 * Returns null when DATABASE_URL is missing so pages still render without a database.
 */
export function getDb(): DB | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!globalForDb.__dlsDb) {
    globalForDb.__dlsSql = postgres(driverUrl(url), { max: 5, prepare: false });
    globalForDb.__dlsDb = drizzle(globalForDb.__dlsSql, { schema });
  }
  return globalForDb.__dlsDb;
}

export { schema };
