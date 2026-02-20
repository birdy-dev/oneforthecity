"use client";

import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import clsx from "clsx";

import { BackgroundImage } from "@/components/BackgroundImage";
import { Container } from "@/components/Container";

interface Day {
  date: React.ReactNode;
  dateTime: string;
  summary: string;
  timeSlots: Array<{
    name: string;
    description: string | null;
    start?: string;
    end?: string;
    duration?: string;
  }>;
}

const schedule: Array<Day> = [
  {
    date: "June 29",
    dateTime: "2024-06-29",
    summary: "Cypher & Prelims",
    timeSlots: [
      {
        name: "Doors Open",
        description: "Crew check-in",
        start: "12:30PM",
      },
      {
        name: "Event Start",
        description: "",
        start: "1:30PM",
      },
      {
        name: "Block 1 - Open Styles",
        description: "4 battles (15 min each)",
        start: "1:35PM",
      },
      {
        name: "Cypher - Breaking",
        description: "Block 2 check-in",
        start: "2:55PM",
      },
      {
        name: "Block 2 - Breaking",
        description: "4 battles (15 min each)",
        start: "3:15PM",
      },
      {
        name: "Cypher - Open Styles",
        description: "Block 3 check-in",
        start: "4:35PM",
      },
      {
        name: "Block 3 - Open Styles",
        description: "4 battles (15 min each)",
        start: "4:55PM",
      },
      {
        name: "Cypher - Breaking",
        description: "Block 4 check-in",
        start: "6:15PM",
      },
      {
        name: "Block 4 - Breaking",
        description: "4 battles (15 min each)",
        start: "6:35PM",
      },
      {
        name: "Day End",
        description: "",
        start: "7:55PM",
      },
    ],
  },
  {
    date: "June 30",
    dateTime: "2024-06-30",
    summary: "Top 8 to Finals",
    timeSlots: [
      {
        name: "Doors Open",
        description: "",
        start: "12:30PM",
      },
      {
        name: "Start",
        description: "",
        start: "1:30PM",
      },
      {
        name: "Top 8 - Open Styles",
        description: "15 min each",
        start: "1:35PM",
      },
      {
        name: "Cypher - Breaking",
        description: "",
        start: "2:35PM",
      },
      {
        name: "Top 8 - Breaking",
        description: "15 min each",
        start: "3:15PM",
        end: "4:35PM",
      },
      {
        name: "Top 4 - Open Styles",
        description: "15 min each",
      },
      {
        name: "Top 4 - Breaking",
        description: "15 min each",
      },
      {
        name: "Finals - Open Styles",
        description: "15 min each",
      },
      {
        name: "Finals - Breaking",
        description: "15 min each",
      },
      {
        name: "Event End",
        description: "",
        start: "6:45PM",
      },
    ],
  },
];

function ScheduleTabbed() {
  const [tabOrientation, setTabOrientation] = useState("horizontal");

  useEffect(() => {
    const smMediaQuery = window.matchMedia("(min-width: 640px)");

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? "vertical" : "horizontal");
    }

    onMediaQueryChange(smMediaQuery);
    smMediaQuery.addEventListener("change", onMediaQueryChange);

    return () => {
      smMediaQuery.removeEventListener("change", onMediaQueryChange);
    };
  }, []);

  return (
    <Tab.Group
      as="div"
      className="mx-auto grid max-w-2xl grid-cols-1 gap-y-6 sm:grid-cols-2 lg:hidden"
      vertical={tabOrientation === "vertical"}
    >
      <Tab.List className="-mx-4 flex gap-x-4 gap-y-10 overflow-x-auto pb-4 pl-4 sm:mx-0 sm:flex-col sm:pr-8 sm:pb-0 sm:pl-0">
        {({ selectedIndex }) => (
          <>
            {schedule.map((day, dayIndex) => (
              <div
                key={day.dateTime}
                className={clsx(
                  "relative w-1/2 flex-none pr-4 sm:w-auto sm:pr-0",
                  dayIndex !== selectedIndex && "opacity-70",
                )}
              >
                <DaySummary
                  day={{
                    ...day,
                    date: (
                      <Tab className="ui-not-focus-visible:outline-hidden">
                        <span className="absolute inset-0" />
                        {day.date}
                      </Tab>
                    ),
                  }}
                />
              </div>
            ))}
          </>
        )}
      </Tab.List>
      <Tab.Panels>
        {schedule.map((day) => (
          <Tab.Panel key={day.dateTime} className="ui-not-focus-visible:outline-hidden">
            <TimeSlots day={day} />
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}

function DaySummary({ day }: { day: Day }) {
  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-blue-900">
        <time dateTime={day.dateTime}>{day.date}</time>
      </h3>
      <p className="mt-1.5 text-base tracking-tight text-blue-900">{day.summary}</p>
    </>
  );
}

function TimeSlots({ day, className }: { day: Day; className?: string }) {
  return (
    <ol
      className={clsx(
        className,
        "space-y-8 bg-white/60 px-10 py-14 text-center shadow-xl shadow-blue-900/5 backdrop-blur-sm",
      )}
    >
      {day.timeSlots.map((timeSlot, timeSlotIndex) => (
        <li
          key={timeSlot.start}
          aria-label={`${timeSlot.name} talking about ${timeSlot.description} at ${timeSlot.start} - ${timeSlot.end}`}
        >
          {timeSlotIndex > 0 && <div className="mx-auto mb-8 h-px w-48 bg-indigo-500/10" />}
          <h4 className="text-lg font-semibold tracking-tight text-blue-900">{timeSlot.name}</h4>
          {timeSlot.description && (
            <p className="mt-1 tracking-tight text-blue-900">{timeSlot.description}</p>
          )}
          <p className="mt-1 font-mono text-sm text-slate-500">
            {timeSlot.start && (
              <time dateTime={`${day.dateTime}T${timeSlot.start}-08:00`}>{timeSlot.start} </time>
            )}
            {timeSlot.end && (
              <>
                -{" "}
                <time dateTime={`${day.dateTime}T${timeSlot.end}-08:00`}>{timeSlot.end}</time>{" "}
              </>
            )}
            {timeSlot.duration && ` (${timeSlot.duration})`}
          </p>
        </li>
      ))}
    </ol>
  );
}

function ScheduleStatic() {
  return (
    <div className="hidden lg:grid lg:grid-cols-2 lg:gap-x-8">
      {schedule.map((day) => (
        <section key={day.dateTime}>
          <DaySummary day={day} />
          <TimeSlots day={day} className="mt-10" />
        </section>
      ))}
    </div>
  );
}

export function Schedule() {
  return (
    <section id="schedule" aria-label="Schedule" className="py-20 sm:py-32">
      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-4xl lg:pr-24">
          <h2 className="font-display text-4xl font-medium tracking-tighter text-blue-600 sm:text-5xl">
            Schedule
          </h2>
          <p className="mt-4 font-display text-2xl tracking-tight text-blue-900"></p>
        </div>
      </Container>
      <div className="relative mt-14 sm:mt-24">
        <BackgroundImage position="right" className="-top-40 -bottom-32" />
        <Container className="relative">
          <ScheduleTabbed />
          <ScheduleStatic />
        </Container>
      </div>
    </section>
  );
}
