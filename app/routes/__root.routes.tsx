import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getAllRoutes } from "~/models/routes.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const _routes = await getAllRoutes();
  return json({ allRoutes: _routes });
}

export default function RouteRootTemplat() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div className="flex w-full overflow-hidden">
      <div className="w-44">
        <ul>
          {loaderData.allRoutes.map((el) => (
            <li key={el.routeId}>
              <Link
                to={`/routes/${el.routeShortName}`}
                className="hover:text-blue-400"
              >
                {el.routeLongName}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
    </div>
  );
}
