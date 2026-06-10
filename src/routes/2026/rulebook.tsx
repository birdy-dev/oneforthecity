import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

type RuleSection = {
  number: string;
  title: string;
  rules: string[];
};

const ruleSections: RuleSection[] = [
  {
    number: "01",
    title: "Crew Size",
    rules: [
      "Each crew must consist of a minimum of 5 members and a maximum of 10 members.",
      "Crews must remain the same throughout the competition.",
    ],
  },
  {
    number: "02",
    title: "Battle Format",
    rules: [
      "Each battle will run for a total of 8 minutes.",
      "Each crew receives 4 minutes per side.",
      "The clock runs only while crews are actively dancing.",
      "This format applies from preliminaries through finals.",
      "No physical contact between crews.",
      "Respect the battle space at all times.",
      "Misconduct may result in warnings, deductions, or disqualification.",
    ],
  },
  {
    number: "03",
    title: "Preliminary Format",
    rules: [
      "Day 1 is Saturday, June 27.",
      "Crews compete in showcase battles for judges to determine rankings.",
      "The Top 8 highest-scoring crews advance to Day 2 on Sunday, June 28 for Semi-Finals and Finals.",
    ],
  },
  {
    number: "04",
    title: "Breaking Division",
    rules: [
      "Routines are optional, not mandatory.",
      "No negative scoring will be applied in the absence of a routine.",
      "Judges will continue to value crew connection, team chemistry, cohesion, musicality, and overall battle presentation.",
      "Crews may still incorporate routines if they choose.",
    ],
  },
  {
    number: "05",
    title: "Open Style Division",
    rules: [
      "There is no routine requirement during preliminaries.",
      "Beginning in the Top 8 rounds through Finals, routines may earn additional value within the judging criteria.",
      "There is no fixed 16-count requirement.",
      "Routines may be shorter or longer depending on the crew's creative vision.",
      "Judges will reward effective use of routines, creativity, and crew coordination when appropriate.",
    ],
  },
  {
    number: "06",
    title: "Challenger Round",
    rules: [
      "After Top 8 selections are announced, crews ranked 9th and 10th earn one final opportunity on Day 1.",
      "These crews may challenge any crew ranked within the Top 8.",
      "Challenge battles are 4 minutes total, with 2 minutes per side.",
      "If the challenger wins, they take the challenged crew's place in the Top 8.",
    ],
  },
  {
    number: "07",
    title: "Crew Honors",
    rules: ["Best Routine", "Best Concept", "Best Costume", "Crowd Favourite"],
  },
  {
    number: "08",
    title: "Sportsmanship & Culture",
    rules: [
      "Respect fellow dancers, judges, staff, volunteers, and audience members.",
      "Discriminatory, abusive, or unsafe behaviour will not be tolerated.",
      "One For The City aims to celebrate Hip Hop values of Love, Peace, Unity, and Having Fun.",
    ],
  },
];

export const Route = createFileRoute("/2026/rulebook")({
  head: () => ({
    meta: [
      { title: "Crew Battle Rulebook | One for the City Vol. 6" },
      {
        name: "description",
        content:
          "Final crew battle rulebook for One for the City Vol. 6, including crew size, battle format, routines, challenger rounds, honors, and sportsmanship.",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="min-h-screen bg-white px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-12 flex items-center justify-between gap-4">
          <Link
            to="/2026"
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
          >
            <ArrowLeftIcon className="size-4" aria-hidden="true" />
            Vol. 6
          </Link>
        </nav>

        <header className="border-b border-gray-200 pb-12">
          <div className="space-y-6">
            <div className="w-fit rounded-full px-3 py-0.5 text-sm/6 text-gray-600 ring-1 ring-gray-900/10">
              Edmonton 2026
            </div>
            <div className="space-y-4">
              <p className="font-mono text-sm font-medium tracking-wide text-blue-600 uppercase">
                One for the City Vol. 6
              </p>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-gray-950 uppercase md:text-6xl">
                Rulebook
              </h1>
              <p className="max-w-2xl text-lg/8 text-gray-600">
                The official format and conduct guide for Breaking and Open Style crew battles.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 py-8 md:grid-cols-3">
          <SummaryCard label="Battle Length" value="8 min" detail="4 minutes per side" />
          <SummaryCard label="Challenge Battle" value="4 min" detail="2 minutes per side" />
          <SummaryCard label="Advancement" value="Top 8" detail="Highest-scoring crews move on" />
        </section>

        <section className="space-y-4 pb-20">
          {ruleSections.map((section) => (
            <article
              key={section.number}
              className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-gray-50/60 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 font-mono text-sm font-semibold text-white">
                  {section.number}
                </span>
                <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
                  {section.title}
                </h2>
              </div>

              <ul className="max-w-full space-y-3 text-base/7 text-gray-700 md:max-w-screen-lg">
                {section.rules.map((rule) => (
                  <li key={rule} className="flex gap-3">
                    <span
                      className="mt-3 size-1.5 shrink-0 rounded-full bg-blue-600"
                      aria-hidden="true"
                    />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-5">
      <p className="font-mono text-xs font-medium tracking-wide text-blue-600 uppercase">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">{value}</p>
      <p className="mt-1 text-sm/6 text-gray-600">{detail}</p>
    </div>
  );
}
