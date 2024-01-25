import { eq } from "drizzle-orm";

import { db } from "drizzle/config";
import { stopTimes, stops, trips } from "drizzle/schema";

export const getStopTimes = async (routeId: string) => {
  const _stopTimes = await db
    .select({
      stopId: stops.stopId,
      stopName: stops.stopName,
    })
    .from(stopTimes)
    .leftJoin(trips, eq(trips.tripId, stopTimes.tripId))
    .leftJoin(stops, eq(stops.stopId, stopTimes.stopId))
    .groupBy(stopTimes.stopId, stops.stopName)
    .orderBy(stopTimes.stopSequence)
    .where(eq(trips.routeId, routeId));
  if (_stopTimes.length === 0) console.error("No stop times found: " + routeId);
  else return _stopTimes;
};
