import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { db } from "drizzle/config";
import { routes } from "drizzle/schema";
import { getAllRoutes } from "~/models/routes.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { routeShortName } = params;
  if (!routeShortName) return redirect("/");
  const [route] = await db
    .select()
    .from(routes)
    .where(eq(routes.routeShortName, routeShortName))
    .limit(1);

  const _routes = await getAllRoutes();
  return json({ route, allRoutes: _routes });
}

export default function RootRouteTemplate() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div className="px-12">
      <h1 className="text-3xl font-bold">{loaderData.route.routeLongName}</h1>
    </div>
  );
}
