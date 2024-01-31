import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { AtSign, GithubIcon, LinkedinIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { GoTriangleLogo, HeadshotImage } from "~/images";
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
      <div className="mx-auto flex py-8 gap-8 w-5/6">
        <Link to="/">
          <GoTriangleLogo height={50} />
        </Link>
        <div className="flex items-end gap-6">
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
          <Link to={"/#about"}>
            <span className="hover:text-blue-400">About</span>
          </Link>
          <Link to={"/#contact"}>
            <span className="hover:text-blue-400">Contact</span>
          </Link>
        </div>
      </div>
      <div className="flex-col flex justify-center">
        <Outlet />
      </div>
      <div
        id="contact"
        className="w-3/4 text-center lg:w-1/2 mx-auto flex flex-col gap-10 py-20"
      >
        <h2 className="text-4xl text-center font-medium">Contact</h2>
        <div className="mx-auto">
          <HeadshotImage />
        </div>
        <p>
          Want to get your own Simple Transit Site? You can find this project
          open on Github. If you need some help or if you have a special project
          that you want to work on reach out to Walter.
        </p>
        <div className="flex gap-6 mx-auto">
          <a href="https://www.linkedin.com/in/walter-k-jenkins/">
            <LinkedinIcon size={30} className="hover:text-blue-500" />
          </a>
          <a href="https://github.com/AvidDabbler">
            <GithubIcon size={30} className="hover:text-blue-500" />
          </a>
          <a href="mailto:walter@transit.chat">
            <AtSign size={30} className="hover:text-blue-500" />
          </a>
        </div>
      </div>
    </div>
  );
}
