import { asc } from "drizzle-orm";

import { db } from "drizzle/config";
import { routes } from "drizzle/schema";

export const getAllRoutes = async () =>
  await db
    .select()
    .from(routes)
    .orderBy(asc(routes.routeLongName))
    .groupBy(routes.routeLongName);
