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
    name: "Nobunaga",
    role: "DJ",
    image: nobunagaImage,
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
            className="flex w-full flex-col items-center space-y-4 p-4 text-center"
            key={person.name}
          >
            <img className="rounded-full" src={person.image} width={200} height={200} />
            <div className="">
              <h3 className="text-lg/8 font-semibold tracking-tight text-gray-900">
                {person.name}
              </h3>
              <p className="text-sm/6 text-gray-600">{person.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
