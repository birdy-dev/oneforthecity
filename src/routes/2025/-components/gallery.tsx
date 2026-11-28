import breakingWinnersUrl from "./breaking-winners-2025.webp?url";
import judgesDjUrl from "./judges-dj-2025.webp?url";
import openstyleWinnersUrl from "./open-style-winners-2025.webp?url";

const images = [
  { src: breakingWinnersUrl, alt: "Breaking winners 2025" },
  { src: judgesDjUrl, alt: "Judges and DJ 2025" },
  { src: openstyleWinnersUrl, alt: "Open style winners 2025" },
];

export function Gallery() {
  return (
    <div className="mt-6 mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
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
