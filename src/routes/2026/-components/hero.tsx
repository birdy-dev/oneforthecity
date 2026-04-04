import { CalendarIcon, DotIcon, MapPinIcon } from "lucide-react";
import posterJpg from "./poster.jpg?url";

export function Hero() {
  return (
    <section
      className="mx-auto flex max-w-5xl flex-col justify-between gap-16 md:flex-row"
      id="hero"
    >
      <div className="order-1 space-y-16">
        <div className="flex flex-col gap-4">
          <div className="w-fit rounded-full px-3 py-0.5 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Edmonton 2026
          </div>
          <h1 className="text-4xl font-bold tracking-tight uppercase md:text-6xl">
            One for
            <br />
            the City 6
          </h1>
          <p className="inline-flex flex-wrap items-center px-1 text-sm font-medium text-gray-500 md:text-base">
            Breaking
            <DotIcon />
            Openstyles <DotIcon />
            Crew Battles
            <DotIcon />
            Workshops
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex h-fit w-fit items-center gap-4 rounded-xl bg-gray-50 px-4 py-2">
            <div className="rounded-full bg-indigo-100 p-2">
              <CalendarIcon className="text-gray-600" size={18} />
            </div>
            <div>
              <span className="text-sm text-gray-600">Date</span>
              <p className="font-semibold tracking-tight text-gray-900">June 26 to 28</p>
            </div>
          </div>

          <div className="flex h-fit w-fit items-center gap-4 rounded-xl bg-gray-50 px-4 py-2">
            <div className="rounded-full bg-indigo-100 p-2">
              <MapPinIcon className="text-gray-600" size={18} />
            </div>
            <div>
              <span className="text-sm text-gray-600">Location</span>
              <p className="font-semibold tracking-tight text-gray-900">Pawn Shop Live</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:order-2">
        <img className="rounded-2xl" src={posterJpg} width={300} height={400} />
      </div>
    </section>
  );
}
