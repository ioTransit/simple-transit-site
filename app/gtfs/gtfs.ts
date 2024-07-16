// @ts-expect-error no types
import { importGtfs } from "gtfs";
// @ts-expect-error no types
import gtfsToGeoJSON from "gtfs-to-geojson";
// @ts-expect-error no types
import gtfsToHtml from "gtfs-to-html";

import { gtfsConfig, envConfig } from "../config.server";

export const load = () => {
  try {
    importGtfs(gtfsConfig)
      .then(() => {
        gtfsToHtml(gtfsConfig);
      })
      .then(() => {
        console.log("HTML Generation Successful");
        process.exit();
      })
      .then(() => {
        gtfsToGeoJSON(gtfsConfig as any);
      })
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  } catch (error) {
    console.error(error);
  }
};
