import { writeFile } from "fs/promises";

import { importGtfs } from "gtfs";
// @ts-expect-error no types
import gtfsToHtml from "gtfs-to-html";

import { gtfsConfig } from "../config";
import { getAllRoutes } from "../models/routes.server";

export const load = async () => {
  try {
    await importGtfs(gtfsConfig);
    const routes = await getAllRoutes();
    gtfsToHtml(gtfsConfig)
      .then(() => {
        console.log("HTML Generation Successful");
        process.exit();
      })
      // @ts-expect-error no types
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
    for (const route of routes) {
      await writeFile(
        `routes/${route.routeShortName}.md`,
        `\nThis is where the text goes`,
      );
    }
  } catch (error) {
    console.error(error);
  }
};
