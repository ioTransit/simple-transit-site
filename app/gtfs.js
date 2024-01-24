import { importGtfs } from "gtfs";

import { config } from "./config.js";
import { getAllRoutes } from "./models/routes.server";

export const load = async () => {
  try {
    await importGtfs(config);
    const routes = await getAllRoutes();
    console.log(routes);
  } catch (error) {
    console.error(error);
  }
};
