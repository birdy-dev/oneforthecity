import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

type DaySchedule = {
  weekday: string;
  month: string;
  date: string;
  summary: string;
  schedule: {
    time: string;
    title: string;
    description: string;
    link?: string;
  }[];
};

const friday: DaySchedule = {
  weekday: "Friday",
  month: "Jun",
  date: "26",
  summary: "Workshops",
  schedule: [
    {
      time: "6PM–8PM",
      title: "ROCKFORCE CREW WORKSHOP",
      description:
        "Breaking foundations, battle tactics, and real crew knowledge — from elements to longevity.",
      link: "https://luma.com/inka0iev",
    },
    {
      time: "8PM–10PM",
      title: "STORM’S KNOWLEDGE WORKSHOP",
      description:
        "International criteria, battle evaluation, judging insight, conversations, Q&A, and community exchange.",
      link: "https://luma.com/inka0iev",
    },
  ],
};

const saturday: DaySchedule = {
  weekday: "Saturday - Prelims",
  month: "Jun",
  date: "27",
  summary: "Workshops, Prelims & Party",
  schedule: [
    {
      time: "12:00PM",
      title: "Doors open",
      description: "",
    },
    {
      time: "1:00PM",
      title: "Openstyles - Block 1",
      description: "",
    },
    {
      time: "2:00PM",
      title: "Breaking - Block 2",
      description: "",
    },
    {
      time: "3:00PM",
      title: "Openstyles - Block 3",
      description: "",
    },
    {
      time: "4:00PM",
      title: "Breaking - Block 4",
      description: "",
    },
    {
      time: "5:00PM",
      title: "Top 8 Announcement &  Challenger Rounds",
      description: "",
    },
    {
      time: "6:00PM",
      title: "Day End",
      description: "",
    },
  ],
};

const sunday: DaySchedule = {
  weekday: "Sunday - Finals",
  month: "Jun",
  date: "28",
  summary: "Workshop & Top 8 to finals",
  schedule: [
    {
      time: "10:30AM–12:00PM",
      title: "RUBIX HIPHOP WORKSHOP",
      description: "New Roots Breaking Studio",
      link: "https://luma.com/vj3ri6go",
    },
    {
      time: "12:00PM",
      title: "Doors open",
      description: "",
    },
    {
      time: "1:00PM",
      title: "Openstyles - Top 8",
      description: "",
    },
    {
      time: "2:00PM",
      title: "Breaking - Top 8",
      description: "",
    },
    {
      time: "3:00PM",
      title: "Openstyles - Top 4",
      description: "",
    },
    {
      time: "3:30PM",
      title: "Breaking - Top 4",
      description: "",
    },
    {
      time: "4:00PM",
      title: "Openstyles - Finals",
      description: "",
    },
    {
      time: "4:15PM",
      title: "Breaking - Finals",
      description: "",
    },
  ],
};

export function Schedule() {
  const id = "schedule";
  return (
    <>
      <section className="md:hidden" id={id}>
        <TabGroup className="space-y-4">
          <TabList className="flex gap-4">
            {[friday, saturday, sunday].map((day) => (
              <Tab
                key={day.weekday}
                className="rounded-lg border px-2 py-1 hover:active:bg-gray-100 data-selected:bg-gray-100"
              >
                {day.month} {day.date}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            <TabPanel>
              <Day {...friday} />
            </TabPanel>
            <TabPanel>
              <Day {...saturday} />
            </TabPanel>
            <TabPanel>
              <Day {...sunday} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </section>
      <section className="mx-auto hidden max-w-5xl grid-cols-3 items-start gap-12 md:grid" id={id}>
        <Day {...friday} />
        <Day {...saturday} />
        <Day {...sunday} />
      </section>
    </>
  );
}

function Day({ weekday, summary, month, date, schedule }: DaySchedule) {
  return (
    <div className="self-start rounded-2xl border p-4">
      <div className="flex justify-between">
        <div>
          <h3>{weekday}</h3>
          <p className="text-sm text-gray-500">{summary}</p>
        </div>
        <div className="flex size-12 flex-col items-center justify-center rounded-lg bg-gray-100 text-center">
          <span className="text-xs/tight text-gray-600 uppercase">{month}</span>
          <span className="text-base/tight font-semibold">{date}</span>
        </div>
      </div>

      <div>
        {schedule.length === 0 ? (
          <div>To be announced</div>
        ) : (
          schedule.map((item) => (
            <div key={`${item.time}-${item.title}`} className="space-y-1 border-t py-4 first:mt-4">
              <span className="text-sm font-medium text-gray-500">{item.time}</span>
              <div>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block font-semibold underline decoration-gray-300 underline-offset-4 transition hover:decoration-current"
                  >
                    {item.title}
                  </a>
                ) : (
                  <span className="block font-semibold">{item.title}</span>
                )}
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
