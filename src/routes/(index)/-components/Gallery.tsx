import breakingWinnersUrl from "./breaking_winners_2025.webp?url";
import judgesDjUrl from "./judges_dj_2025.webp?url";
import openstyleWinnersUrl from "./openstyle_winners_2025.webp?url";

const images = [
  { src: breakingWinnersUrl, alt: "Breaking winners 2025" },
  { src: judgesDjUrl, alt: "Judges and DJ 2025" },
  { src: openstyleWinnersUrl, alt: "Open style winners 2025" },
];

export function Gallery() {
  return (
    <div className="grid grid-cols-1 gap-4 py-16 md:grid-cols-3">
      {images.map((image) => (
        <img
          key={image.alt}
          src={image.src}
          alt={image.alt}
          width={800}
          height={800}
          className="aspect-square w-full rounded-2xl object-cover"
          loading="lazy"
        />
      ))}
    </div>
  );
}
