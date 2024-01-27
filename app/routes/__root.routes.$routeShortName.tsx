import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import groupBy from "lodash/groupBy";
import { useState } from "react";

import { db } from "drizzle/config";
import { routes, trips } from "drizzle/schema";
import { Button } from "~/components/ui/button";
import { getDow, getFiles } from "~/lib/utils";

export async function loader({ params }: LoaderFunctionArgs) {
  const { routeShortName } = params;
  if (!routeShortName) return redirect("/");
  const [route] = await db
    .select()
    .from(routes)
    .where(eq(routes.routeShortName, routeShortName))
    .limit(1);

  const { dow, formattedDate } = getDow(new Date());

  if (!route.routeShortName) return redirect("/");
  const files = getFiles(formattedDate, route.routeShortName);

  const directions = await db
    .select({
      directionId: trips.directionId,
      tripHeadsign: trips.tripHeadsign,
    })
    .from(trips)
    .groupBy(trips.directionId, trips.tripHeadsign)
    .orderBy(trips.tripHeadsign)
    .where(eq(trips.routeId, route.routeId));

  return json({
    route,
    dow,
    files,
    directions: groupBy(directions, "directionId"),
  });
}

export default function RootRouteTemplate() {
  const loaderData = useLoaderData<typeof loader>();
  const [dow, setDow] = useState<string>(loaderData.dow);
  console.log(loaderData);
  const [direction, setDirection] = useState(
    loaderData.directions[0]
      ? loaderData.directions[0].directionId.toString()
      : null,
  );
  return (
    <div className="flex flex-col gap-3 w-[80%]">
      <h1 className="text-3xl font-bold">{loaderData.route.routeLongName}</h1>
      <div className="flex gap-3">
        {Object.entries(loaderData.directions).map(([directionId, idk], i) => {
          return (
            <Button
              key={i}
              onClick={() => setDirection(directionId.toString())}
            >
              {idk
                .map((el) => {
                  return el.tripHeadsign;
                })
                .join(" / ")}
            </Button>
          );
        })}
      </div>

      {loaderData.files.map((el, i) => {
        if (!!direction && direction !== el.direction) return null;
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
