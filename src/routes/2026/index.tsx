import { buttonStyles } from "@/components/Button";
import { cn } from "@/utils/cn";
import { getStoreEnabled } from "@/utils/store_enabled.functions";
import { createFileRoute, Link } from "@tanstack/react-router";
import { People } from "./-components/people";
import { Schedule } from "./-components/schedule";
import { Hero } from "./-components/hero";
import { OrganizingTeam } from "./-components/organizing-team";
import { BrandInstagram, BrandYoutube } from "tabler-icons-react";

export const Route = createFileRoute("/2026/")({
  loader: async () => getStoreEnabled(),
  component: RouteComponent,
});

function RouteComponent() {
  const { isStoreEnabled } = Route.useLoaderData();

  return (
    <>
      <nav className="flex justify-end p-4">
        <div className="flex gap-2 sm:gap-4">
          <Link
            className="inline-flex w-fit items-center justify-center gap-1 rounded-full px-2 py-1 font-mono text-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-900 active:bg-gray-50 sm:gap-3 sm:px-3.5"
            to="/2026/rulebook"
          >
            Rulebook
          </Link>
          {isStoreEnabled ? (
            <Link
              className={cn(buttonStyles, "rounded-full px-3.5 py-1 text-sm shadow-xs")}
              to="/store"
            >
              Merch
            </Link>
          ) : null}
          <a
            className="inline-flex w-fit items-center justify-center gap-1 rounded-full px-2 py-1 font-mono text-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-900 active:bg-gray-50 sm:gap-3 sm:px-3.5"
            href="https://www.youtube.com/@oneforthecity"
          >
            <BrandYoutube className="size-7 sm:size-5" />
            <span className="hidden sm:block">YouTube</span>
          </a>
          <a
            className="inline-flex w-fit items-center justify-center gap-1 rounded-full px-2 py-1 font-mono text-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-900 active:bg-gray-50 sm:gap-3 sm:px-3.5"
            href="https://www.instagram.com/oneforthecity"
          >
            <BrandInstagram className="size-7 sm:size-5" />
            <span className="hidden sm:block">Instagram</span>
          </a>
        </div>
      </nav>

      <div className="space-y-24 px-4 py-16 pb-28 md:space-y-44 md:py-32 md:pb-40">
        <Hero />
        <Schedule />
        <People />

        <section className="mx-auto max-w-5xl space-y-6 font-display text-2xl tracking-tight text-blue-950">
          <h2 className="font-display text-4xl font-medium tracking-tighter text-blue-600 sm:text-5xl">
            About
          </h2>
          <p>
            One for the City was founded in 2021, with the aim of supporting the street dance
            community. <abbr title="One for the City">OFTC</abbr> exceeded expectations by providing
            opportunities to battle, learn and connect with local, national and international street
            dance educators. Battles are deeply rooted in Hip-Hop culture, and are central to{" "}
            <abbr title="One for the City">OFTC</abbr>, celebrating Hip-Hop values like Love, Peace,
            Unity, and Having Fun. Through collaborations and grassroots efforts,{" "}
            <abbr title="One for the City">OFTC</abbr> has facilitated city-cyphers, freestyle
            sessions and workshops to more than four cities in Canada over the past three years.
          </p>
        </section>

        <OrganizingTeam />
      </div>
    </>
  );
}
