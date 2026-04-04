import { createFileRoute, Link } from "@tanstack/react-router";
import { People } from "./-components/people";
import { Schedule } from "./-components/schedule";
import { Hero } from "./-components/hero";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/2026/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <nav className="p-4">
        <Link
          className="flex w-fit flex-none items-center justify-center gap-1 rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          to="/"
        >
          <ArrowLeft size={16} />
          Home
        </Link>
      </nav>

      <div className="space-y-24 px-4 py-16 md:space-y-44 md:py-32">
        <Hero />
        <Schedule />
        <People />
      </div>
    </>
  );
}
