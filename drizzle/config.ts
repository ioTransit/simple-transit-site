import { createClient } from "@libsql/client";
import type { Config } from "drizzle-kit";
import { drizzle } from "drizzle-orm/libsql";

export default {
  schema: "./src/schema/*",
  out: "./drizzle",
  driver: "libsql",
  dbCredentials: {
    url: "file:./drizzle/data.db",
  },
} satisfies Config;

export const client = createClient({
  url: "file:./drizzle/data.db",
  authToken: "DATABASE_AUTH_TOKEN",
});

export const db = drizzle(client);
