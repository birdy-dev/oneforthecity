import { Container } from "@/components/container";

interface Day {
  date: string;
  dateTime: string;
  summary: string;
  timeSlots: Array<{
    name: string;
    description?: string;
    start?: string;
    end?: string;
  }>;
}

const schedule: Day[] = [
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
        start: "12:30PM",
      },
      {
        name: "Start",
        start: "1:30PM",
      },
      {
        name: "Top 8 - Open Styles",
        description: "15 min each",
        start: "1:35PM",
      },
      {
        name: "Cypher - Breaking",
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
        start: "6:45PM",
      },
    ],
  },
];

export function Schedule() {
  return (
    <section id="schedule" aria-labelledby="schedule-heading">
      <Container>
        <h2 id="schedule-heading" className="font-display text-3xl tracking-tight text-blue-950">
          Schedule
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {schedule.map((day) => (
            <section key={day.dateTime} className="rounded-2xl bg-slate-50 p-5 sm:p-6">
              <h3 className="text-xl font-semibold text-blue-950">
                <time dateTime={day.dateTime}>{day.date}</time>
              </h3>
              <p className="mt-1 text-slate-600">{day.summary}</p>
              <ol className="mt-4 divide-y divide-slate-200">
                {day.timeSlots.map((slot) => (
                  <li key={slot.name} className="py-3">
                    {slot.start && (
                      <p className="font-mono text-xs text-slate-600">
                        {slot.start}
                        {slot.end && ` to ${slot.end}`}
                      </p>
                    )}
                    <h4 className="font-medium text-slate-900">{slot.name}</h4>
                    {slot.description && (
                      <p className="text-sm text-slate-600">{slot.description}</p>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </Container>
    </section>
  );
}
