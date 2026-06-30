type TeamMember = {
  role: string;
  name: string;
  link?: string;
};

const coreTeam: TeamMember[] = [
  { role: "Event Director", name: "Amit Vaghela" },
  {
    role: "Assistant Director & Tech",
    name: "Hubert Lin",
    link: "https://www.linkedin.com/in/linhub/",
  },
  { role: "Ticketing & Merch", name: "Pranaya Prajapati" },
  { role: "Artist Liason & Stage manager", name: "Josh Kearney" },
  { role: "Production & Volunteer coordinator", name: "Shawn Coso" },
];

const volunteers: TeamMember[] = [
  { role: "Volunteer", name: "Alice Buki" },
  { role: "Volunteer", name: "Allyson Hamor" },
  { role: "Volunteer", name: "Anna Dai" },
  { role: "Volunteer", name: "Colin Rejano" },
  { role: "Volunteer", name: "Divya Sharma" },
  { role: "Volunteer", name: "Jasmine Khokhar" },
  { role: "Volunteer", name: "Jeme Magallones" },
  { role: "Volunteer", name: "Kamsie Osadebe" },
  { role: "Volunteer", name: "Kate He" },
  { role: "Volunteer", name: "Kit Padron" },
  { role: "Volunteer", name: "Lin Yang" },
  { role: "Volunteer", name: "Nardos" },
  { role: "Volunteer Media", name: "Neel Das Choudhury" },
  { role: "Volunteer Merch & Graphics", name: "Paul Porras" },
  { role: "Volunteer", name: "Reese Pascual" },
  { role: "Volunteer", name: "Sara Sereda" },
  { role: "Volunteer", name: "Thu Le" },
  { role: "Volunteer", name: "Vaishnavi Bhawsar" },
  { role: "Volunteer", name: "Zareef Hasan" },
];

export function OrganizingTeam() {
  return (
    <section className="mx-auto max-w-5xl space-y-14 text-center" id="organizing-team">
      <div className="mx-auto max-w-3xl space-y-3">
        <h2 className="font-display text-4xl font-medium tracking-tighter text-blue-600 sm:text-5xl">
          Organizing Team & Volunteers
        </h2>
        <p className="font-display text-2xl tracking-tight text-blue-950">
          Thank you to everyone who helped bring One for the City Vol. 6 to life.
        </p>
      </div>

      <div className="space-y-16">
        <TeamGrid title="Executive Team" members={coreTeam} variant="exec" />
        <TeamGrid title="Volunteers" members={volunteers} variant="volunteer" />
      </div>
    </section>
  );
}

function TeamGrid({
  title,
  members,
  variant,
}: {
  title: string;
  members: TeamMember[];
  variant: "exec" | "volunteer";
}) {
  const isExec = variant === "exec";
  const itemClass = isExec
    ? "w-full min-w-0 rounded-2xl border border-blue-100 bg-blue-50/50 px-5 py-4 text-center"
    : "w-full min-w-0 px-2 text-center";
  const linkedItemClass = isExec
    ? `${itemClass} transition hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700`
    : `${itemClass} rounded-xl transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-900`;

  return (
    <div className="space-y-8">
      <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">{title}</h3>
      <ul
        className={
          isExec
            ? "mx-auto grid max-w-4xl grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3"
            : "mx-auto grid max-w-4xl grid-cols-2 justify-items-center gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
        }
      >
        {members.map((member) => (
          <li className="w-full min-w-0" key={`${member.role}-${member.name}`}>
            {member.link ? (
              <a
                className={`block text-inherit no-underline ${linkedItemClass}`}
                href={member.link}
                target="_blank"
                rel="noreferrer"
              >
                <MemberText member={member} isExec={isExec} />
              </a>
            ) : (
              <div className={itemClass}>
                <MemberText member={member} isExec={isExec} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MemberText({ member, isExec }: { member: TeamMember; isExec: boolean }) {
  return (
    <>
      <h4
        className={
          isExec
            ? "text-xl font-semibold tracking-tight text-blue-950"
            : "text-lg font-semibold tracking-tight text-gray-950"
        }
      >
        {member.name}
      </h4>
      <p className={isExec ? "text-sm text-blue-700" : "text-sm text-gray-500"}>{member.role}</p>
    </>
  );
}
