import { asc, sql, eq } from "drizzle-orm";

import { db } from "drizzle/config";
import { routes, trips, shapes } from "drizzle/schema";

export const getAllRoutes = async () =>
  await db
    .select()
    .from(routes)
    .orderBy(asc(routes.routeLongName))
    .groupBy(routes.routeLongName);

export const getRouteFeatures = async () => {
  //   const _routes = await db.values(sql`SELECT
  //   'Feature' as 'type',
  //   json_object(
  // 	'routeId', r.route_id,
  //     'routeLongName', r.route_long_name,
  //     'tripId', t.trip_id,
  //     'shapeId', t.shape_id
  // ) as properties,
  //   json_object(
  //   'type', 'MultiLineString',
  //   'coordinates', (SELECT '[' || GROUP_CONCAT('[' || s.shape_pt_lat  || ',' || s.shape_pt_lon || ']') || ']' AS wkt_linestring FROM shapes s group by s.shape_id ORDER BY s.shape_pt_sequence)) as geometry
  // FROM routes r
  // left join trips t `);
  const _routes = await db
    .select({
      type: sql<"Feature">`'Feature'`,
      properties: {
        routeId: routes.routeId,
        routeLongName: routes.routeLongName,
        tripId: trips.tripId,
        shapeId: trips.shapeId,
      },
      geometry: sql<MultiLineString>`json_object(
  'type', 'MultiLineString',
  'coordinates', (SELECT '[' || GROUP_CONCAT('[' || s.shape_pt_lat  || ',' || s.shape_pt_lon || ']') || ']' AS wkt_linestring FROM shapes s group by s.shape_id ORDER BY s.shape_pt_sequence)) as geometry`,
    })
    .from(routes)
    .leftJoin(trips, eq(trips.routeId, routes.routeId))
    .leftJoin(shapes, eq(shapes.shapeId, trips.shapeId))
    .where(and(...where));

  return {
    type: "FeatureCollection",
    features: _routes,
  };
};
