import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { useState } from "react";

import { db } from "drizzle/config";
import { routes } from "drizzle/schema";
import { serviceTypes } from "~/config";
import { getDow, getFiles } from "~/lib/utils";

export async function loader({ params }: LoaderFunctionArgs) {
  const { routeShortName } = params;
  if (!routeShortName) return redirect("/");
  const [route] = await db
    .select()
    .from(routes)
    .where(eq(routes.routeShortName, routeShortName))
    .limit(1);

  const { dow, formattedDate } = getDow(new Date());
  const todaysService = serviceTypes[dow];
  if (todaysService || !route.routeShortName) return redirect("/");
  const files = getFiles(formattedDate, route.routeShortName);

  console.log(files[0]);
  return json({ route, dow, todaysService, files });
}

export default function RootRouteTemplate() {
  const loaderData = useLoaderData<typeof loader>();
  console.log(loaderData);
  const [dow, setDow] = useState<string>(loaderData.dow);
  const [direction, setDirection] = useState();
  return (
    <div className="flex flex-col gap-3 px-12 w-3/4">
      <h1 className="text-3xl font-bold">{loaderData.route.routeLongName}</h1>
      <div className="flex gap-3"></div>
      {loaderData.files.map((el, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: el.contents }} />
      ))}
    </div>
  );
}
