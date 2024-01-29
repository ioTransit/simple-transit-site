import { importGtfs } from "gtfs";
// @ts-expect-error no types
import gtfsToHtml from "gtfs-to-html";

import { gtfsConfig } from "../config";

export const load = async () => {
  try {
    await importGtfs(gtfsConfig);
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
  } catch (error) {
    console.error(error);
  }
};
