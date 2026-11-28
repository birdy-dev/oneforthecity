import { Container } from "@/components/container";
import eacImage from "@/images/sponsors/eac.png";
import edmontonImage from "@/images/sponsors/edmonton.png";
import stanceImage from "@/images/sponsors/stance.png";

const sponsors = [
  { name: "Stance Elements", logo: stanceImage, width: 1560, height: 571 },
  { name: "Edmonton Arts Council", logo: eacImage, width: 631, height: 226 },
  { name: "City of Edmonton", logo: edmontonImage, width: 220, height: 220 },
];

export function Sponsors() {
  return (
    <section id="sponsors" aria-labelledby="sponsors-heading">
      <Container>
        <h2 id="sponsors-heading" className="font-display text-3xl tracking-tight text-blue-950">
          Sponsors and partners
        </h2>
        <ul className="mt-6 grid grid-cols-2 items-center gap-6 sm:grid-cols-3">
          {sponsors.map((sponsor) => (
            <li key={sponsor.name} className="flex justify-center rounded-xl bg-slate-50 p-5">
              <img
                className="h-20 w-full max-w-40 object-contain"
                src={sponsor.logo}
                alt={sponsor.name}
                width={sponsor.width}
                height={sponsor.height}
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
