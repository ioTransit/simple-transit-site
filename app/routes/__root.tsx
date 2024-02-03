import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { AtSign, Home, LinkedinIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  GoTriangleLogo,
  TransitChatVeritcalLogo,
  TransitChatLogo,
} from "~/images";
import { getAllRoutes } from "~/models/routes.server";

export async function loader() {
  const _routes = await getAllRoutes();

  return json({ routes: _routes });
}

export const meta: MetaFunction = () => [{ title: "GoTriangle Transit" }];

export default function RootTemplate() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex pb-8 pt-4 justify-between mx-auto w-5/6 items-end">
        <div className="flex gap-8">
          <Link to="/">
            <GoTriangleLogo className={"w-24 md:w-36"} />
          </Link>
          <div className="flex items-end gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className="hover:text-blue-400">Routes</span>{" "}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="relative mt-2">
                {loaderData.routes.map((el) => (
                  <DropdownMenuItem
                    className="truncate"
                    key={el.routeId}
                    asChild
                  >
                    <Link className="w-full" to={`routes/${el.routeShortName}`}>
                      {el.routeLongName}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to={"/#about"}>
              <span className="hover:text-blue-400">About</span>
            </Link>
            <Link to={"/#contact"}>
              <span className="hover:text-blue-400">Contact</span>
            </Link>
          </div>
        </div>
        <a
          href="www.transit.chat"
          className="text-gray-50L gap-2 hidden md:flex flex-col"
        >
          <span className="px-4">Made by</span>
          <TransitChatLogo className="w-40" />
        </a>
      </div>
      <div className="flex-col flex justify-center">
        <Outlet />
      </div>
      <div
        id="contact"
        className="w-3/4 text-center lg:w-1/2 mx-auto flex flex-col gap-10 py-20"
      >
        <div className="mx-auto">
          <a
            href="www.transit.chat"
            className="text-gray-50L gap-3 hidden md:flex flex-col"
          >
            <TransitChatVeritcalLogo className="w-[300px]" />
          </a>
        </div>
        <p>
          Want to get your own Simple Transit Site? You can find this project
          open on Github. If you need some help or if you have a special project
          that you want to work on reach out.
        </p>
        <div className="flex gap-6 mx-auto">
          <a href="https://www.linkedin.com/company/transit-chat">
            <LinkedinIcon size={30} className="hover:text-blue-500" />
          </a>
          <a href="www.transit.chat">
            <Home size={30} className="hover:text-blue-500" />
          </a>
          <a href="mailto:walter@transit.chat">
            <AtSign size={30} className="hover:text-blue-500" />
          </a>
        </div>
      </div>
    </div>
  );
}
