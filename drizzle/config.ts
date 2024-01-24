import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema/*",
  out: "./drizzle",
  driver: "libsql",
  dbCredentials: {
    url: "file:./prisma/data.db",
  },
} satisfies Config;

export const client = createClient({
  url: "file:./prisma/data.db",
  authToken: "DATABASE_AUTH_TOKEN",
});

export const db = drizzle(client);
