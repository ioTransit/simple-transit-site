import { importGtfs } from "gtfs";
import gtfsToGeoJSON from "../../gtfs-to-geojson/dist/index";
// @ts-expect-error no types
import gtfsToHtml from "gtfs-to-html";
import { envConfig } from "~/config.server";

export const gtfsConfig = {
  agencies: [
    {
      agency_key: envConfig.AGENCY_NAME,
      url: envConfig.GTFS_URL,
    },
  ],
  sqlitePath: "drizzle/data.db",
  debug: false,
  noHead: false,
  beautify: true,
  outputFormat: "lines-and-stops",
  outputType: "route",
  showMap: false,
};

export const load = async () => {
  try {
    await importGtfs(gtfsConfig);
    await gtfsToHtml({ ...gtfsConfig, skipInport: true });
    await gtfsToGeoJSON({ ...gtfsConfig, skipInport: true } as any);
  } catch (error) {
    console.error(error);
  }
};
