import { Container } from "@/components/container";
import { Footer } from "@/components/footer";
import { HomeButton } from "@/components/home-button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Gallery } from "./-components/gallery";

export const Route = createFileRoute("/2025/")({
  head: () => ({
    meta: [
      { title: "One for the City Vol. 5 | 2025" },
      {
        name: "description",
        content: "Event details and photos from One for the City Vol. 5 in Edmonton, AB.",
      },
    ],
  }),
  component: VolumeFive,
});

function VolumeFive() {
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

      <main className="flex-auto py-12 sm:py-20">
        <Container>
          <div className="space-y-4 text-center">
            <h1 className="font-display text-5xl font-semibold tracking-tighter text-blue-600 sm:text-7xl">
              One for the City Vol. 5
            </h1>
            <p className="text-lg text-slate-600">
              <time dateTime="2025-06-28">June 28</time> and{" "}
              <time dateTime="2025-06-29">29, 2025</time>
              <br />
              St Basil’s Cultural Centre, Edmonton, AB
            </p>
            <p className="text-slate-600">
              Two days of breaking and open style crew battles, showcases, and workshops.
            </p>
            <a
              className="inline-block text-sm font-medium text-blue-700 hover:underline"
              href="https://luma.com/nv9k3zi8"
            >
              Original event listing
            </a>
          </div>

          <section className="mt-16" aria-labelledby="gallery-heading">
            <h2 id="gallery-heading" className="font-display text-3xl tracking-tight text-blue-950">
              Event photos
            </h2>
            <Gallery />
          </section>

          <Link className="text-sm font-medium text-blue-700 hover:underline" to="/timer">
            Battle Timer
          </Link>
        </Container>
      </main>

      <Footer />
    </>
  );
}
