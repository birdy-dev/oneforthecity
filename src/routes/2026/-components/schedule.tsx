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
  }[];
};

const friday: DaySchedule = {
  weekday: "Friday",
  month: "Jun",
  date: "26",
  summary: "Workshops & hangout",
  schedule: [],
};

const saturday: DaySchedule = {
  weekday: "Saturday",
  month: "Jun",
  date: "27",
  summary: "Workshops, Prelims & Party",
  schedule: [],
};

const sunday: DaySchedule = {
  weekday: "Sunday",
  month: "Jun",
  date: "28",
  summary: "Finals Crew",
  schedule: [],
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
      <section className="mx-auto hidden max-w-5xl grid-cols-3 gap-12 md:grid" id={id}>
        <Day {...friday} />
        <Day {...saturday} />
        <Day {...sunday} />
      </section>
    </>
  );
}

function Day({ weekday, summary, month, date, schedule }: DaySchedule) {
  return (
    <div className="rounded-2xl border p-4">
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
        {schedule.length > 0 ? (
          <div>To be announced</div>
        ) : (
          schedule.map((item) => (
            <div key={item.time}>
              <span>{item.time}</span>
              <div>
                <span>{item.title}</span>
                <p>{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
