import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { getAllRoutes } from "~/models/routes.server";
import { GoTriangleLogo } from "~/images";

export async function loader() {
  const _routes = await getAllRoutes();

  return json({ routes: _routes });
}

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function RootTemplate() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="w-full">
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
                <DropdownMenuItem className="truncate" key={el.routeId}>
                  <Link className="w-full" to={`routes/${el.routeShortName}`}>
                    {el.routeLongName}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-col mx-auto flex justify-center px-12">
        <Outlet />
      </div>
    </div>
  );
}
