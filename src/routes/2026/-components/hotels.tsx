import { Container } from "@/components/Container";
import argyl_hotel from "./argyl_hotel.jpg?url";

type Hotel = {
  img: string;
  name: string;
  address: string;
  phone: string;
  link: string;
  description: string;
};

export function Hotels() {
  const hotels: Hotel[] = [
    {
      name: "Argyll Plaza Hotel",
      address: "9933-63 Avenue Edmonton",
      phone: "(780) 438-5876",
      link: "https://argyllplazahotel.com/",
      img: argyl_hotel,
      description: "Book direct via phone for group rate.",
    },
  ];
  return (
    <section id="hotels" aria-label="hotels" className="py-20 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-4xl lg:pr-24">
          <h2 className="font-display text-4xl font-medium tracking-tighter text-blue-600 sm:text-5xl">
            Hotels
          </h2>
          <p className="mt-4 font-display text-2xl tracking-tight text-blue-900">
            Preferred accommodations for out-of-town competitors. Saturday night rooms available.
            Mention One for the City event to get group rate.
          </p>
        </div>
      </Container>
      <Container className="space-y-20">
        <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:gap-x-12">
          {hotels.map((hotel) => (
            <Card hotel={hotel} key={hotel.name} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function Card({ hotel }: { hotel: Hotel }) {
  return (
    <div>
      <div className="relative">
        <div className="relative h-72 w-full overflow-hidden rounded-lg">
          <img
            className="h-full w-full object-cover object-center"
            src={hotel.img}
            alt={hotel.name}
            width={400}
          />
        </div>
        <div className="relative mt-4">
          <h3 className="text-sm font-medium text-gray-900">
            {hotel.name} • {hotel.phone}
          </h3>
          <a
            className="mt-1 text-sm text-gray-500"
            href={hotel.link}
            target="_blank"
            rel="noreferrer"
          >
            {hotel.address}
          </a>
          <p className="mt-1 text-sm text-gray-500">{hotel.description}</p>
        </div>
        <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-black opacity-50"
          ></div>
        </div>
      </div>
    </div>
  );
}
