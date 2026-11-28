import { Container } from "@/components/container";
import { Footer } from "@/components/footer";
import { HomeButton } from "@/components/home-button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { People } from "./-components/people";
import { Schedule } from "./-components/schedule";
import { Sponsors } from "./-components/sponsors";

export const Route = createFileRoute("/2024/")({
  head: () => ({
    meta: [
      { title: "One for the City Vol. 4 | 2024" },
      {
        name: "description",
        content: "The schedule, lineup, and crews from One for the City Vol. 4 in Edmonton, AB.",
      },
    ],
  }),
  component: VolumeFour,
});

function VolumeFour() {
  return (
    <>
      <Container>
        <nav
          className="flex items-center justify-between gap-4 py-4"
          aria-label="Edition navigation"
        >
          <HomeButton />
          <Link className="text-sm font-medium text-blue-700 hover:underline" to="/archive">
            Past editions
          </Link>
        </nav>
      </Container>

      <main className="flex-auto space-y-16 py-12 sm:py-20">
        <Container className="space-y-4 text-center">
          <h1 className="font-display text-5xl font-semibold tracking-tighter text-blue-600 sm:text-7xl">
            One for the City Vol. 4
          </h1>
          <p className="text-lg text-slate-600">
            <time dateTime="2024-06-29">June 29</time> and{" "}
            <time dateTime="2024-06-30">30, 2024</time>
            <br />
            St. Basil’s Cultural Centre, Edmonton, AB
          </p>
          <p className="text-slate-600">Two days of breaking and open style crew battles.</p>
        </Container>
        <Schedule />
        <People />
        <Sponsors />
      </main>

      <Footer />
    </>
  );
}
