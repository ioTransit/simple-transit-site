import dotEnv from "dotenv";
import { z } from "zod";

const config = () => {
  console.log(dotEnv.config());
  const _config = z
    .object({
      parsed: z.object({
        ADMIN_EMAIL: z.string(),
        ADMIN_PASSWORD: z.string(),
        DATABASE_URL: z.string(),
        AGENCY_NAME: z.string(),
        MAPBOX_ACCESS_TOKEN: z.string(),
        GTFS_URL: z.string(),
      }),
    })
    .parse(dotEnv.config());
  return _config;
};

export const { parsed: envConfig } = config();

export const gtfsConfig = {
  agencies: [
    {
      agency_key: envConfig.AGENCY_NAME,
      url: envConfig.GTFS_URL,
    },
  ],
  sqlitePath: "drizzle/data.db",
  debug: false,
  noHead: true,
  beautify: true,
  outputFormat: "lines-and-stops",
  outputType: "route",
  showMap: false,
};
export const region = "en-US";
export const timezone = "America/New_York";
export const services = ["Weekdays", "Saturday", "Sunday"];
export const serviceTypes = {
  monday: { label: "Weekdays", file: "mon-fri" },
  tuesday: { label: "Weekdays", file: "mon-fri" },
  wednesday: { label: "Weekdays", file: "mon-fri" },
  thursday: { label: "Weekdays", file: "mon-fri" },
  friday: { label: "Weekdays", file: "mon-fri" },
  saturday: { label: "Saturday", file: "sat" },
  sunday: { label: "Sunday", file: "sun" },
};
export const title = "GoTriangle Transit";
