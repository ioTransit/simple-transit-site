import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import { eq } from "drizzle-orm";
import groupBy from "lodash/groupBy";
import { useState } from "react";

import { db } from "drizzle/config";
import { routes } from "drizzle/schema";
import { Button } from "~/components/ui/button";
import { getDow, getFiles, getGeojson, getService } from "~/lib/utils";
import { getDirections } from "~/models/directions.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { routeShortName } = params;
  if (!routeShortName) return redirect("/");
  const _routes = await db
    .select()
    .from(routes)
    .where(eq(routes.routeShortName, routeShortName));

  const { dow, formattedDate } = getDow(new Date());

  if (!_routes[0].routeShortName) return redirect("/");
  const files = getFiles(formattedDate, _routes[0].routeShortName);
  const geojson = getGeojson(routeShortName);

  const routeIds = _routes.map((el) => el.routeId);
  const [directions] = await Promise.all([getDirections(routeIds)]);

  const serviceIds = Object.keys(groupBy(files, "service"));
  const service = getService(serviceIds, dow);

  return json({
    routes: _routes,
    dow,
    service,
    files,
    geojson,
    directions: groupBy(directions, "directionId"),
  });
}

export default function RootRouteTemplate() {
  const loaderData = useLoaderData<typeof loader>();
  const [dow, setDow] = useState<string>(loaderData.service);
  const [direction, setDirection] = useState(
    Object.keys(loaderData.directions)[0],
  );

  // console.log(loaderData);
  return (
    <div className="flex flex-col gap-3 w-[80%] py-3">
      <h1 className="text-3xl font-bold">
        {loaderData.routes[0].routeLongName}
      </h1>
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
