import { importGtfs } from "gtfs";
// @ts-expect-error no types
import gtfsToGeoJSON from "gtfs-to-geojson";
// @ts-expect-error no types
import gtfsToHtml from "gtfs-to-html";

import { gtfsConfig } from "../config.server";

export const load = async () => {
  try {
    await importGtfs(gtfsConfig);
    await gtfsToHtml(gtfsConfig)
      .then(() => {
        console.log("HTML Generation Successful");
        process.exit();
      })
      // @ts-expect-error no types
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
    await gtfsToGeoJSON(gtfsConfig);
  } catch (error) {
    console.error(error);
  }
};
