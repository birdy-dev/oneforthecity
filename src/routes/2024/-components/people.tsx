import { Container } from "@/components/container";
import curtisImage from "@/images/avatars/curtis.jpg";
import dizzylockImage from "@/images/avatars/dizzylock.jpg";
import djbennyImage from "@/images/avatars/dj-benny.jpg";
import djroxswiftImage from "@/images/avatars/dj-roxswift.jpg";
import genieImage from "@/images/avatars/genie.png";
import jamalAliImage from "@/images/avatars/jamal-ali.png";
import jinImage from "@/images/avatars/jin.png";
import slimBoogieImage from "@/images/avatars/slim-boogie.jpg";
import ynotImage from "@/images/avatars/ynot.jpg";

type Category = {
  name: string;
  people: Person[];
};

type Person = {
  name: string;
  role?: string;
  image?: string;
  instagram?: string;
};
const categories: Category[] = [
  {
    name: "DJs, MC and judges",
    people: [
      {
        name: "Roxswift",
        role: "DJ (Los Angeles)",
        image: djroxswiftImage,
        instagram: "roxswift",
      },
      {
        name: "Benny Lava",
        role: "DJ (Montreal)",
        image: djbennyImage,
        instagram: "djbennylava",
      },
      {
        name: "Genie Baffoe",
        role: "Emcee (Winnipeg)",
        image: genieImage,
        instagram: "genieboss",
      },
      {
        name: "Curtis Siu",
        role: "Breaking Judge (Vancouver)",
        image: curtisImage,
        instagram: "straycurt",
      },
      {
        name: "YNOT",
        role: "Breaking Judge (New Jersey)",
        image: ynotImage,
        instagram: "ynotism",
      },
      {
        name: "Jin Lee",
        role: "Breaking Judge (Edmonton)",
        image: jinImage,
        instagram: "jinlehs",
      },
      {
        name: "Dizzylock",
        role: "Open Style Judge (Montreal)",
        image: dizzylockImage,
        instagram: "dizzylock",
      },
      {
        name: "Slim Boogie",
        role: "Open Style Judge (Los Angeles)",
        image: slimBoogieImage,
        instagram: "slimboogie777",
      },
      {
        name: "Jamal Ali",
        role: "Open Style Judge (Vancouver)",
        image: jamalAliImage,
        instagram: "jamal_ali2000",
      },
    ],
  },
  {
    name: "Breaking crews",
    people: [
      {
        name: "Alpha Kids",
      },
      {
        name: "Raw Honey",
      },
      {
        name: "Team Mayhem",
      },
      {
        name: "TM",
      },
      {
        name: "Crazy Time",
      },
    ],
  },
  {
    name: "Open style crews",
    people: [
      {
        name: "393 Dance Troupe",
      },
      {
        name: "Octagram",
      },
      {
        name: "Pound it",
      },
      {
        name: "Raw Honey",
      },
      {
        name: "Team Mayhem",
      },
      {
        name: "The Misfits",
      },
      {
        name: "Working title",
      },
    ],
  },
];

export function People() {
  return (
    <section id="people" aria-labelledby="people-heading">
      <Container>
        <h2 id="people-heading" className="font-display text-3xl tracking-tight text-blue-950">
          Lineup and crews
        </h2>
        <div className="mt-8 space-y-10">
          {categories.map((category) => (
            <div key={category.name}>
              <h3 className="text-xl font-semibold text-blue-950">{category.name}</h3>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.people.map((person) => (
                  <li
                    key={person.name}
                    className="flex items-center gap-4 rounded-xl bg-slate-50 p-4"
                  >
                    {person.image && (
                      <img
                        className="size-16 shrink-0 rounded-full object-cover"
                        src={person.image}
                        alt=""
                        width={64}
                        height={64}
                        loading="lazy"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">{person.name}</p>
                      {person.role && <p className="text-sm text-slate-600">{person.role}</p>}
                      {person.instagram && (
                        <a
                          className="text-sm text-blue-700 hover:underline"
                          href={`https://www.instagram.com/${person.instagram}/`}
                        >
                          @{person.instagram}
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
