import { CalendarIcon, DotIcon, MapPinIcon } from "lucide-react";
import videoMp4 from "./video_loop_opt.mp4?url";

export function Hero() {
  return (
    <section
      className="mx-auto flex max-w-5xl flex-col justify-between gap-16 md:flex-row md:items-center"
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
            the City
            <br />
            <span className="line-clamp-1 text-3xl md:text-5xl">Vol. 6</span>
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

      <div className="mx-auto aspect-square w-full max-w-75 overflow-hidden rounded-2xl md:order-2 md:mx-0 md:aspect-auto md:w-auto md:max-w-none md:shrink-0 md:overflow-visible">
        <video
          className="h-full w-full object-cover object-center md:h-auto md:max-h-125 md:w-auto md:rounded-2xl"
          autoPlay
          loop
          muted
          playsInline
          width={300}
          height={480}
        >
          <source src={videoMp4} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
