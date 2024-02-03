import Database from "better-sqlite3";
import type { Config } from "drizzle-kit";
import { drizzle } from "drizzle-orm/better-sqlite3";

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  driver: "better-sqlite",
  dbCredentials: {
    url: "drizzle/data.db",
  },
} satisfies Config;

// export const client = createClient({
//   url: "file:./drizzle/data.db",
//   authToken: "DATABASE_AUTH_TOKEN",
// });
export const sqlite = new Database("drizzle/data.db");

export const db = drizzle(sqlite);
