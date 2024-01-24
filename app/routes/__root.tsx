import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "drizzle/config";
import { routes } from "drizzle/schema";
import { json } from "@remix-run/node";

import { useOptionalUser } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const _routes = await db.select().from(routes);

  return json({ routes: _routes });
}

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function RootTemplate() {
  const user = useOptionalUser();
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="w-full">
      <div className="mx-12 my-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Routes</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {loaderData.routes.map((el) => (
              <DropdownMenuItem className="truncate">
                <Link className="w-full" to={`routes/${el.routeShortName}`}>
                  {el.routeLongName}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Outlet />
    </div>
  );
}
