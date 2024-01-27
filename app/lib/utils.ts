import fs from "fs";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { region, timezone } from "~/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDow(date: Date) {
  const options = { timeZone: timezone, weekday: "long" };
  // @ts-expect-error times suck
  const dayOfWeek = date.toLocaleDateString(region, options);
  // Options for the formatted date
  const formattedDateOptions = {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const formattedDate = date.toLocaleDateString(
    "en-US",
    formattedDateOptions,
  ) as string;
  const _date = new Date(formattedDate);

  return { dow: dayOfWeek, formattedDate: cleanDate(_date) };
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
      return { startDate: parseInt(startDate), endDate: parseInt(endDate) };
    });
  const [currentFolder] = folders.filter(({ startDate, endDate }) => {
    return startDate <= date && endDate >= date;
  });
  const folder = `html/${currentFolder.startDate}-${currentFolder.endDate}`;
  const files = fs.readdirSync(folder);
  return files
    .map((el) => {
      const contents = readFileToString(`${folder}/${el}`);
      const [, routeShortName, direction, service] = el.split("_");
      const obj = {
        fileName: el,
        routeShortName,
        direction,
        contents,
        service: service.replace(".html", ""),
      };
      return obj;
    })
    .filter((el) => el.routeShortName === routeShortName);
};
