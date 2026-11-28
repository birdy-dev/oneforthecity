import { Container } from "@/components/container";
import { Footer } from "@/components/footer";
import { HomeButton } from "@/components/home-button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: "Past Editions | One for the City" },
      { name: "description", content: "Explore past editions of One for the City." },
    ],
  }),
  component: Archive,
});

function Archive() {
  return (
    <>
      <Container>
        <nav className="py-4" aria-label="Edition navigation">
          <HomeButton />
        </nav>
      </Container>

      <main className="flex-auto py-12 sm:py-20">
        <Container>
          <h1 className="font-display text-5xl font-semibold tracking-tighter text-blue-600">
            Past editions
          </h1>
          <ul className="mt-8 max-w-lg divide-y divide-slate-200">
            <li>
              <Link
                className="block py-4 text-lg font-medium text-blue-700 hover:underline"
                to="/2026"
              >
                2026 - Volume 6
              </Link>
            </li>
            <li>
              <Link
                className="block py-4 text-lg font-medium text-blue-700 hover:underline"
                to="/2025"
              >
                2025 - Volume 5
              </Link>
            </li>
            <li>
              <Link
                className="block py-4 text-lg font-medium text-blue-700 hover:underline"
                to="/2024"
              >
                2024 - Volume 4
              </Link>
            </li>
          </ul>
        </Container>
      </main>

      <Footer />
    </>
  );
}
