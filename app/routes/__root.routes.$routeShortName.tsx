import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { db } from "drizzle/config";
import { routes } from "drizzle/schema";

export async function loader({ params }: LoaderFunctionArgs) {
  const { routeShortName } = params;
  if (!routeShortName) return redirect("/");
  const [route] = await db
    .select()
    .from(routes)
    .where(eq(routes.routeShortName, routeShortName))
    .limit(1);

  return json({ route });
}

export default function RootRouteTemplate() {
  const loaderData = useLoaderData<typeof loader>();
  return <div>{loaderData.route.routeLongName}</div>;
}
