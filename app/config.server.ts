import dotEnv from "dotenv";

export const { parsed: envConfig } = dotEnv.config();

export const gtfsConfig = {
  agencies: [
    {
      agency_key: "gotriangle",
      url: envConfig?.GTFS_URL,
    },
  ],
  sqlitePath: "drizzle/data.db",
  debug: false,
  outputFormat: "lines-and-stops",
  outputType: "route",
  showMap: false,
  zipOutput: true,
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
