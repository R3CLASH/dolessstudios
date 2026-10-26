import "server-only";
import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

type DB = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { __dlsSql?: postgres.Sql; __dlsDb?: DB };

/**
 * Lazily creates one connection pool per server process.
 * Returns null when DATABASE_URL is missing so pages still render without a database.
 */
export function getDb(): DB | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!globalForDb.__dlsDb) {
    globalForDb.__dlsSql = postgres(url, { max: 5, prepare: false });
    globalForDb.__dlsDb = drizzle(globalForDb.__dlsSql, { schema });
  }
  return globalForDb.__dlsDb;
}

export { schema };
