const { sql } = require(  "drizzle-orm" );

const { db } = require("./config");

db.run(sql`PRAGMA journal_mode = WAL;`);
