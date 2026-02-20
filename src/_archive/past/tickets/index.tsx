import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/past/tickets/")({
  component: Tickets,
});

function Tickets() {
  return (
    <>
      <Header
        action={
          <Link className="rounded-xl p-4 text-blue-600 underline hover:bg-blue-100" to="../2024">
            Go Home
          </Link>
        }
      />
      <div className="relative mt-10 space-y-12 px-4 sm:px-6 md:mt-20 lg:px-8">
        <div className="mx-auto w-full max-w-2xl space-y-4">
          <h2
            id="speakers-title"
            className="font-display text-4xl font-medium tracking-tighter text-blue-600 sm:text-5xl"
          >
            Tickets & Registration
          </h2>
          <div className="space-y-4">
            <p className="font-display text-xl tracking-tight text-blue-900">
              Welcome to the One for the City registration and ticket page! This is your gateway to
              securing your participation in the upcoming Crew vs. Crew Battle competition. Sign up
              now to enter the competition with your crew, which should consist of at least 5
              members and can have up to a maximum of 10.
            </p>
            <p className="font-display text-xl tracking-tight text-blue-900">
              Alternatively, you're welcome to join us as a spectator to cheer on the dancers and
              experience the vibrant atmosphere of street dance firsthand. Don't wait any longer –
              reserve your tickets today and prepare to be captivated by the incredible talent and
              enthusiasm of the street dance community at OFTC!
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
