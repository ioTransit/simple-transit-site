import { and, eq } from "drizzle-orm";

import { db } from "drizzle/config";
import { calendar, directions, stopTimes, stops, trips } from "drizzle/schema";

export const getStopTimes = async (routeId: string) => {
  const _stopTimes = await db
    .select({
      stopId: stops.stopId,
      stopName: stops.stopName,
      direction: directions.direction,
      departureTime: stopTimes.departureTime,
      tripId: trips.tripId,
      monday: calendar.monday,
      tuesday: calendar.tuesday,
      wednesday: calendar.wednesday,
    })
    .from(stopTimes)
    .leftJoin(trips, eq(trips.tripId, stopTimes.tripId))
    .leftJoin(stops, eq(stops.stopId, stopTimes.stopId))
    .leftJoin(
      directions,
      and(
        eq(directions.directionId, trips.directionId),
        eq(directions.routeId, trips.routeId),
      ),
    )
    .orderBy(stopTimes.stopSequence, trips.tripId)
    .where(eq(trips.routeId, routeId));
  return _stopTimes;
};
