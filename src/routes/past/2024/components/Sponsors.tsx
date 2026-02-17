import { Image } from "@unpic/react";

import { Container } from "@/components/Container";
import stanceImage from "@/images/sponsors/stance.png";
import eacImage from "@/images/sponsors/eac.png";
import edmontonImage from "@/images/sponsors/edmonton.png";

type Sponsor = {
  name: string;
  logo: typeof Image;
  link: string;
};
const sponsors: Sponsor[] = [
  { name: "Stance elements", logo: stanceImage, link: "" },
  { name: "Edmonton Arts Council", logo: eacImage, link: "" },
  { name: "City of Edmonton", logo: edmontonImage, link: "" },
];

export function Sponsors() {
  return (
    <section id="sponsors" aria-label="Sponsors" className="py-20 sm:py-32">
      <Container className="space-y-20">
        <h2 className="mx-auto max-w-2xl text-center font-display text-4xl font-medium tracking-tighter text-blue-900 sm:text-5xl">
          Sponsors and partners
        </h2>

        <div className="mx-auto grid max-w-max grid-cols-1 place-content-center gap-x-32 gap-y-12 sm:grid-cols-3 md:gap-x-16 lg:gap-x-32">
          {sponsors.map((sponsor) => (
            <div key={sponsor.name} className="flex items-center justify-center">
              <Image className="w-40" src={sponsor.logo} alt={sponsor.name} unoptimized />
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-max ">
          <p className="block w-full text-center">
            Contact us at{" "}
            <a className="text-blue-600 underline" href="mailto:contact@oneforthecity.com">
              contact@oneforthecity.com
            </a>{" "}
            for information on partnering or becoming a sponsor.
          </p>
        </div>
      </Container>
    </section>
  );
}
