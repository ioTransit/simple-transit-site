import { sql } from "drizzle-orm";

import { db } from "./config";

db.run(sql`PRAGMA journal_mode = WAL;`);
