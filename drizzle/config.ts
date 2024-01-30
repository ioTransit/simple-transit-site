import Database from "better-sqlite3";
import type { Config } from "drizzle-kit";
import { drizzle } from "drizzle-orm/better-sqlite3";

export default {
  schema: "./src/schema/*",
  out: "./drizzle",
  driver: "libsql",
  dbCredentials: {
    url: "file:./drizzle/data.db",
  },
} satisfies Config;

// export const client = createClient({
//   url: "file:./drizzle/data.db",
//   authToken: "DATABASE_AUTH_TOKEN",
// });
export const sqlite = new Database("file:./drizzle/data.db");

export const db = drizzle(sqlite);
