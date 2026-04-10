import nobunagaImage from "./nobunaga.jpg?url";
import unknownImage from "@/images/avatars/unknown.png?url";

type Person = {
  name: string;
  role: string;
  image: string;
  instagram: string;
};

const people: Person[] = [
  {
    // name: "Nobunaga",
    name: "TBA",
    role: "DJ",
    image: unknownImage,
    instagram: "https://www.instagram.com/nobunagalewing",
  },
  {
    name: "TBA",
    role: "MC",
    image: unknownImage,
    instagram: "",
  },
  {
    name: "TBA",
    role: "Judge",
    image: unknownImage,
    instagram: "",
  },
  {
    name: "TBA",
    role: "Judge",
    image: unknownImage,
    instagram: "",
  },
  {
    name: "TBA",
    role: "Judge",
    image: unknownImage,
    instagram: "",
  },
  {
    name: "TBA",
    role: "Judge",
    image: unknownImage,
    instagram: "",
  },
];

export function People() {
  return (
    <section className="mx-auto max-w-5xl" id="people">
      <div className="grid w-full grid-cols-2 gap-8 md:grid-cols-4">
        {people.map((person) => (
          <div
            className="relative flex flex-col items-center overflow-clip rounded-xl transition-shadow hover:shadow"
            key={person.name}
          >
            <div className="items-ends absolute flex w-full justify-end p-2">
              <span className="block w-fit rounded-full bg-gray-200 px-2 text-xs text-gray-600">
                {person.role}
              </span>
            </div>
            <img className="size-full object-cover" src={person.image} width={200} height={200} />
            <div className="w-full rounded-b-xl border-x border-b p-2 text-center">
              <h3 className="text-lg/8 font-semibold tracking-tight text-gray-900">
                {person.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
