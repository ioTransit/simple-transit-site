import {
  LinksFunction,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import bbox from "@turf/bbox";
import { lineString } from "@turf/helpers";
import clsx from "clsx";
import { eq } from "drizzle-orm";
import concat from "lodash/concat";
import groupBy from "lodash/groupBy";
import mapboxCss from "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import Map, { // eslint-disable-line
  CircleLayer,
  Layer,
  LineLayer,
  Source,
  useMap,
} from "react-map-gl";

import { db } from "drizzle/config";
import { routes } from "drizzle/schema";
import { Button } from "~/components/ui/button";
import { getDow, getFiles, getGeojson, getService } from "~/lib/utils";
import { getDirections } from "~/models/directions.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: mapboxCss }];
};
export async function loader({ params }: LoaderFunctionArgs) {
  const { routeShortName } = params;
  if (!routeShortName) return redirect("/");
  const _routes = await db
    .select()
    .from(routes)
    .where(eq(routes.routeShortName, routeShortName));

  const { dow, formattedDate } = getDow(new Date());

  if (!_routes[0] || !_routes[0].routeShortName) return redirect("/");
  const files = getFiles(formattedDate, _routes[0].routeShortName);
  const geojson = getGeojson(routeShortName);

  const bounds = geojson[0]
    ? bbox(
        lineString(
          concat(
            ...geojson.map((el) =>
              el.contents.features
                .filter((el) => el.properties?.stop_id)
                .map((feat) => feat.geometry.coordinates),
            ),
          ),
        ),
      )
    : null;

  const routeIds = _routes.map((el) => el.routeId);
  const [directions] = await Promise.all([getDirections(routeIds)]);

  const serviceIds = Object.keys(groupBy(files, "service"));
  const service = getService(serviceIds, dow);
  if (!service) throw Error("Service not found");
  const routeLongName = _routes[0].routeLongName;
  if (!routeLongName) throw Error("Route Long Name not found");

  const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;
  if (!mapboxAccessToken) throw Error("Mapbox access token not found");

  return json({
    routes: _routes,
    dow,
    bounds,
    service,
    files,
    geojson,
    mapboxAccessToken,
    routeLongName,
    directions: groupBy(directions, "directionId"),
  });
}

const stopsStyle = (fileName: string): CircleLayer => {
  return {
    id: `${fileName}-stops`,
    type: "circle",
    paint: {
      "circle-radius": 5,
      "circle-color": "#007cbf",
    },
  };
};

const routesStyle = (fileName: string): LineLayer => {
  return {
    id: `${fileName}-routes`,
    type: "line",
    paint: {
      "line-color": [
        "case",
        ["has", "route_color"],
        ["get", "route_color"],
        "#ffffff",
      ],
      "line-width": 3,
      "line-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        // zoom is 5 (or less) -> circle radius will be 0px (hidden)
        5,
        0,
        // zoom is 10 (or greater) -> circle radius will be 5px
        10,
        1,
      ],
    },
  };
};

export default function RootRouteTemplate() {
  const loaderData = useLoaderData<typeof loader>();
  const [dow, setDow] = useState<string>(loaderData.service);
  const [direction, setDirection] = useState(
    Object.keys(loaderData.directions)[0],
  );
  return (
    <div className="flex flex-col gap-3 w-[70%] pb-3 pr-10">
      <h1 className="text-3xl font-bold">{loaderData.routeLongName}</h1>
      {loaderData.bounds ? (
        <Map
          mapboxAccessToken={loaderData.mapboxAccessToken}
          initialViewState={{
            bounds: loaderData.bounds as [number, number, number, number],
            fitBoundsOptions: {
              padding: { top: 20, bottom: 20, right: 20, left: 20 },
            },
          }}
          style={{ width: "100%", height: 400 }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          <ReloadMap />
          {loaderData.geojson.map((el) => (
            <Source
              key={el.fileName}
              id={el.fileName}
              data={el.contents}
              type="geojson"
            >
              <Layer
                {...routesStyle(el.fileName)}
                filter={["has", "route_id"]}
                beforeId="road-label-small"
              />
              <Layer {...stopsStyle(el.fileName)} filter={["has", "stop_id"]} />
            </Source>
          ))}
        </Map>
      ) : null}
      {loaderData.files.length === 0 ? (
        <div className="flex flex-col gap-3">No files found for this route</div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            {Object.keys(groupBy(loaderData.files, "service")).map((el, i) => {
              return (
                <Button
                  key={i}
                  className={clsx("capitalize", dow === el && "bg-gray-500")}
                  onClick={() => setDow(el)}
                >
                  {el}
                </Button>
              );
            })}
          </div>
          <div className="flex gap-3">
            {Object.entries(loaderData.directions).length > 1
              ? Object.entries(loaderData.directions).map(
                  ([directionId, idk], i) => {
                    return (
                      <Button
                        key={i}
                        onClick={() => setDirection(directionId.toString())}
                        className={clsx(
                          "capitalize",
                          direction === directionId.toString() && "bg-gray-500",
                        )}
                      >
                        {idk
                          .map((el) => {
                            return el.tripHeadsign;
                          })
                          .join(" / ")}
                      </Button>
                    );
                  },
                )
              : null}
          </div>
        </div>
      )}

      {loaderData.files.map((el, i) => {
        if (
          (!!direction && direction !== el.direction) ||
          (!!dow && dow !== el.service)
        )
          return null;
        return (
          <div
            key={i}
            className="flex flex-col overflow-auto"
            dangerouslySetInnerHTML={{ __html: el.contents }}
          />
        );
      })}
    </div>
  );
}

const ReloadMap = () => {
  const loaderData = useLoaderData<typeof loader>();
  const { current: map } = useMap();

  useEffect(() => {
    map?.fitBounds(loaderData.bounds as [number, number, number, number], {
      padding: { top: 20, bottom: 20, right: 20, left: 20 },
    });
  }, [loaderData.routeLongName, loaderData.bounds]); // eslint-disable-line

  return null;
};

export const ErrorBoundary = () => {
  return (
    <div className="my-auto flex flex-col gap-3 w-[60%] pb-3 pr-10">
      <h1 className="text-3xl text-center">
        Oops! Looks like you found a bug. This might be a problem with your
        GTFS.
      </h1>
    </div>
  );
};
