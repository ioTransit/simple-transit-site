import { importGtfs } from "gtfs";

import { config } from "./config.js";

export const load = async () => {
  try {
    await importGtfs(config);
  } catch (error) {
    console.error(error);
  }
};
