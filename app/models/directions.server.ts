import { inArray } from "drizzle-orm";

import { db } from "drizzle/config";
import { trips } from "drizzle/schema";

export const getDirections = async (routeIds: string[]) =>
  await db
    .select({
      directionId: trips.directionId,
      tripHeadsign: trips.tripHeadsign,
    })
    .from(trips)
    .groupBy(trips.directionId, trips.tripHeadsign)
    .orderBy(trips.tripHeadsign)
    .where(inArray(trips.routeId, routeIds));
