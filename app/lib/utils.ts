import fs from "fs";

import { type ClassValue, clsx } from "clsx";
import type { FeatureCollection, Point } from "geojson";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const addPadding = (number: number) =>
  number < 10 ? `0${number}` : number.toString();

export const cleanDate = (date: Date) => {
  const month = addPadding(date.getMonth() + 1);
  const day = addPadding(date.getDate());
  const dateString = `${date.getFullYear()}${month}${day}`;
  return parseInt(dateString);
};

function readFileToString(filePath: string): string {
  try {
    // Read file synchronously
    const fileContent: Buffer = fs.readFileSync(filePath);

    // Convert Buffer to string using UTF-8 encoding
    const contentString: string = fileContent.toString("utf-8");

    return contentString;
  } catch (error) {
    // Handle errors, e.g., file not found or permission issues
    console.error(`Error reading file:`, error);
    return "";
  }
}

export const getFiles = (date: number, routeShortName: string) => {
  const folders = fs
    .readdirSync("html")
    .filter((el) => el.includes("-"))
    .map((el) => {
      const [startDate, endDate] = el.split("-");
      if (!startDate || !endDate) throw Error("Dates are missing in folder");
      return { startDate: parseInt(startDate), endDate: parseInt(endDate) };
    });
  const [currentFolder] = folders.filter(({ startDate, endDate }) => {
    return startDate <= date && endDate >= date;
  });
  if (!currentFolder) throw Error("Current folder not found");
  const folder = `html/${currentFolder.startDate}-${currentFolder.endDate}`;
  const files = fs.readdirSync(folder);

  return files
    .map((el) => {
      const contents = readFileToString(`${folder}/${el}`);
      const [, routeShortName, direction, service] = el.split("_");
      if (!routeShortName || !direction || !service)
        throw Error("Error with contents");
      const obj = {
        fileName: el,
        routeShortName,
        direction,
        contents,
        service: service.replace(".html", ""),
      };
      return obj;
    })
    .filter(
      (el) => el.routeShortName.toLowerCase() === routeShortName.toLowerCase(),
    );
};

export const getGeojson = (routeShortName: string) => {
  const agency = process.env.AGENCY_NAME;
  if (!agency) throw Error("Agency missing in env");
  else {
    const files = fs
      .readdirSync(`geojson/${agency}`)
      .filter((el) => el.includes(`_${routeShortName}_`));
    return files.map((el) => {
      const contents = JSON.parse(
        readFileToString(`${`geojson/${agency}`}/${el}`),
      ) as FeatureCollection<Point>;
      const [, routeShortName, direction] = el.split("_");
      if (!direction || !routeShortName)
        throw Error("GeoJson not formatted properly");
      const obj = {
        fileName: el,
        routeShortName,
        direction: direction.replace(".geojson", ""),
        contents,
      };
      return obj;
    });
  }
};

export const getService = (serviceIds: string[], dow: string) => {
  switch (dow) {
    case "Saturday":
      return serviceIds.includes("sat")
        ? "sat"
        : serviceIds.includes("mon-fri")
        ? "mon-fri"
        : serviceIds[0];
    case "Sunday":
      return serviceIds.includes("sun")
        ? "sun"
        : serviceIds.includes("mon-fri")
        ? "mon-fri"
        : serviceIds[0];
    default:
      return serviceIds.includes("mon-fri") ? "mon-fri" : serviceIds[0];
  }
};
