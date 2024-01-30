import { BusFront, Map, RecycleIcon } from "lucide-react";

export default function RootIndex() {
  return (
    <div>
      <div className="header w-full h-[700px] flex flex-col justify-end">
        <div className="py-24 flex flex-col gap-6 text-white bg-gray-500/50">
          <div className="w-5/6 mx-auto flex flex-col gap-6">
            <h1 className="text-5xl font-bold">
              Welcome to Simple Transit Site
            </h1>
            <h2 className="text-2xl font-medium">
              A simple way to share transit agencies route schedule information
            </h2>
            <p>
              This website is built on the idea that Transit agencies all use
              the{" "}
              <a className="link" href="https://gtfs.org/schedule/">
                GTFS specification
              </a>
              . This website is auto generated on a schedule maps and tables
              automatically to keep your website up to date.{" "}
            </p>
          </div>
        </div>
      </div>
      <div id="about" className="w-2/3 mx-auto flex flex-col gap-20 py-20">
        <h2 className="text-4xl text-center font-medium">About</h2>
        <div className="flex gap-6 items-center">
          <RecycleIcon size={100} />
          <div className="flex flex-col w-2/3">
            <h3 className="text-xl font-medium">Updates automatically</h3>
            <p>
              Your schedules never stop changing and Simple Transit Site keeps
              up with your pace by using your existing published schedule feed
              to keep your website updated.
            </p>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <BusFront size={100} />
          <div className="flex flex-col w-2/3">
            <h3 className="text-xl font-medium">Uses the GTFS standard</h3>
            <p>
              The GTFS standard is used worldwide and this website can be
              updated to work with any transit agency that has one.
            </p>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <Map size={100} />
          <div className="flex flex-col w-2/3">
            <h3 className="text-xl font-medium">Maps and Schedules</h3>
            <p>
              Each route page has up to date maps and time table schedules for a
              great experience for you riders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
