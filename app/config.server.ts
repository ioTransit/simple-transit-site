import fs from "fs";
import path from "path";
import { z } from "zod";

const loadEnv = () => {
  try {
    // Path to the .env file
    const envFilePath = path.resolve(__dirname, ".env");

    // Read the contents of the .env file
    const envFileContent = fs.readFileSync(envFilePath, "utf8");

    // Split the content into lines
    const envLines = envFileContent.split("\n");

    // Set each environment variable
    envLines.forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value)
        // @ts-ignore idk
        process.env[key.trim()] = value.trim().replaceAll('"', "");
    });
  } catch {
    return;
  }
};

const config = () => {
  loadEnv();
  const _config = z
    .object({
      ADMIN_EMAIL: z.string(),
      ADMIN_PASSWORD: z.string(),
      DATABASE_URL: z.string(),
      AGENCY_NAME: z.string(),
      MAPBOX_ACCESS_TOKEN: z.string(),
      GTFS_URL: z.string(),
      S3_BUCKET: z.string(),
      AWS_ACCESS_KEY_ID: z.string(),
      AWS_SECRET_ACCESS_KEY: z.string(),
    })
    .parse(process.env);
  return _config;
};

export const envConfig = config();

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
