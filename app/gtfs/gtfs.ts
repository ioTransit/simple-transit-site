import { writeFile } from "fs/promises";

import { importGtfs } from "gtfs";

import { getStopTimes } from "~/models/stopsTimes.server";

import { getAllRoutes } from "../models/routes.server";

import { config } from "./config";

export const load = async () => {
  try {
    await importGtfs(config);
    const routes = await getAllRoutes();
    console.log(routes);
    for (const route of routes) {
      try {
        const stopTimes = await getStopTimes(route.routeId);
        if (!stopTimes) continue;
        const stopTimeFields = stopTimes.map((stopTime) => {
          return `  - name: ${stopTime.stopName}\n    color: red`;
        });
        await writeFile(
          `routes/${route.routeShortName}.md`,
          [
            "---",
            "timepoint:",
            ...stopTimeFields,
            "---",
            "",
            "This is where the body goes",
          ].join("\n"),
        );
      } catch (e) {
        console.error(e);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
