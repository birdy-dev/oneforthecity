import { Container } from "../../../../components/Container";
import { Image } from "@unpic/react";
import economy_inn from "@/images/hotels/economy_inn.jpg";
import royal_lodge from "@/images/hotels/royal_lodge.jpg";

type Hotel = {
  img: typeof Image;
  room: string;
  price: string;
  name: string;
  address: string;
  link: string;
  description: string;
};

export function Hotels() {
  const hotels: Hotel[] = [
    {
      name: "Economy Inn",
      room: "Double Room",
      price: "$78/night",
      address: "4009 Gateway blvd NW",
      link: "https://maps.app.goo.gl/GjAjM7p9q1Ld5idq7",
      img: economy_inn,
      description: "Use promo code Eco4009",
    },
    {
      name: "Royal Lodge Edmonton",
      room: "Double Room",
      price: "$90/night",
      address: "3815 Gateway blvd NW",
      link: "https://maps.app.goo.gl/xkEX3rqmMZj9Cu6DA",
      img: royal_lodge,
      description: "Call 780-756-6810 & let them know you're booking with One for the City",
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
            Discounted accommodations for out-of-town competitors. Limited spots available. First
            come first serve.
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
          <Image
            className="h-full w-full object-cover object-center"
            src={hotel.img}
            alt={hotel.name}
          />
        </div>
        <div className="relative mt-4">
          <h3 className="text-sm font-medium text-gray-900">
            {hotel.name} • <span className="font-normal text-gray-800">{hotel.room}</span>
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
          <p className="relative text-lg font-semibold text-white">{hotel.price}</p>
        </div>
      </div>
    </div>
  );
}
