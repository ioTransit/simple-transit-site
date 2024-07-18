import { region, timezone } from "~/config.server";
import { cleanDate } from "./utils";

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
    // @ts-expect-error dates are hard
    formattedDateOptions,
  ) as string;
  const _date = new Date(formattedDate);

  return { dow: dayOfWeek, formattedDate: cleanDate(_date) };
}
