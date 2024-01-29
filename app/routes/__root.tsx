import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { title } from "~/config";
import { GoTriangleLogo } from "~/images";
import { getAllRoutes } from "~/models/routes.server";

export async function loader() {
  const _routes = await getAllRoutes();

  return json({ routes: _routes });
}

export const meta: MetaFunction = () => [{ title }];

export default function RootTemplate() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="w-full flex p-8 gap-8">
        <Link to="/">
          <GoTriangleLogo height={90} />
        </Link>
        <div className="flex items-end ">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="hover:text-blue-400">Routes</span>{" "}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="relative mt-2">
              {loaderData.routes.map((el) => (
                <DropdownMenuItem className="truncate" key={el.routeId} asChild>
                  <Link className="w-full" to={`routes/${el.routeShortName}`}>
                    {el.routeLongName}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-col flex justify-center px-12">
        <Outlet />
      </div>
    </div>
  );
}
