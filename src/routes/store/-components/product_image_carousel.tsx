import { cn } from "@/utils/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

export type ProductImage = {
  alt: string;
  src: string;
};

const swipeThreshold = 50;

export function ProductImageCarousel({
  badge,
  className,
  images,
  onSelect,
  productName,
  variant = "full",
}: {
  badge?: string;
  className?: string;
  images: readonly ProductImage[];
  onSelect?: () => void;
  productName: string;
  variant?: "full" | "minimal";
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [pointerStartX, setPointerStartX] = useState<number | null>(null);
  const [pointerEndX, setPointerEndX] = useState<number | null>(null);
  const hasMultipleImages = images.length > 1;
  const isMinimal = variant === "minimal";

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const showPreviousImage = () => {
    setCurrentIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const showNextImage = () => {
    setCurrentIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(null);
    setTouchStartX(event.changedTouches[0]?.clientX ?? null);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(event.changedTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const endX = touchEndX ?? event.changedTouches[0]?.clientX ?? null;

    if (touchStartX === null || endX === null) {
      return;
    }

    const swipeDistance = touchStartX - endX;

    if (swipeDistance > swipeThreshold) {
      showNextImage();
    } else if (swipeDistance < -swipeThreshold) {
      showPreviousImage();
    } else {
      onSelect?.();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") {
      return;
    }

    setPointerEndX(null);
    setPointerStartX(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || pointerStartX === null) {
      return;
    }

    setPointerEndX(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") {
      return;
    }

    const endX = pointerEndX ?? event.clientX;

    if (pointerStartX === null) {
      return;
    }

    const swipeDistance = pointerStartX - endX;

    if (swipeDistance > swipeThreshold) {
      showNextImage();
    } else if (swipeDistance < -swipeThreshold) {
      showPreviousImage();
    } else {
      onSelect?.();
    }

    setPointerStartX(null);
    setPointerEndX(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onSelect || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    onSelect();
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-stone-200 bg-stone-50 shadow-sm",
        className,
      )}
    >
      <div
        aria-label={`${productName} images`}
        className={cn(
          "relative touch-pan-y",
          onSelect && "cursor-pointer",
          hasMultipleImages && "cursor-grab active:cursor-grabbing",
        )}
        onClick={!hasMultipleImages ? onSelect : undefined}
        onKeyDown={onSelect ? handleKeyDown : undefined}
        onPointerDown={hasMultipleImages ? handlePointerDown : undefined}
        onPointerMove={hasMultipleImages ? handlePointerMove : undefined}
        onPointerUp={hasMultipleImages ? handlePointerUp : undefined}
        onPointerCancel={
          hasMultipleImages
            ? () => {
                setPointerStartX(null);
                setPointerEndX(null);
              }
            : undefined
        }
        onTouchEnd={hasMultipleImages ? handleTouchEnd : undefined}
        onTouchMove={hasMultipleImages ? handleTouchMove : undefined}
        onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
        role={onSelect ? "button" : undefined}
        tabIndex={onSelect ? 0 : undefined}
      >
        {badge ? (
          <p className="absolute top-4 left-4 z-10 w-fit rounded-full bg-white/95 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-stone-700 uppercase shadow-sm">
            {badge}
          </p>
        ) : null}

        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image) => (
            <div key={image.src} className="w-full shrink-0">
              <img
                alt={image.alt}
                className="aspect-square w-full object-cover select-none"
                draggable={false}
                src={image.src}
              />
            </div>
          ))}
        </div>

        {hasMultipleImages && !isMinimal ? (
          <div className="pointer-events-none absolute inset-x-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-between">
            <button
              aria-label="Show previous product image"
              className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-stone-900 shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
              onClick={showPreviousImage}
              type="button"
            >
              <ChevronLeftIcon className="size-5" />
            </button>

            <button
              aria-label="Show next product image"
              className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-stone-900 shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
              onClick={showNextImage}
              type="button"
            >
              <ChevronRightIcon className="size-5" />
            </button>
          </div>
        ) : null}

        {hasMultipleImages ? (
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 flex justify-center",
              isMinimal
                ? "bg-linear-to-t from-black/45 to-transparent px-4 py-3"
                : "pointer-events-none",
            )}
          >
            <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-sm">
              {images.map((image, index) => {
                const isActive = index === currentIndex;

                return isMinimal ? (
                  <span
                    key={`${image.src}-dot`}
                    aria-hidden="true"
                    className={cn(
                      "h-2 w-2 rounded-full transition",
                      isActive ? "bg-stone-900" : "bg-stone-300",
                    )}
                  />
                ) : (
                  <button
                    key={`${image.src}-dot`}
                    aria-label={`Show image ${index + 1}`}
                    aria-pressed={isActive}
                    className={cn(
                      "pointer-events-auto h-2.5 w-2.5 rounded-full transition",
                      isActive ? "bg-stone-900" : "bg-stone-300 hover:bg-stone-400",
                    )}
                    onClick={() => goToImage(index)}
                    type="button"
                  />
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {hasMultipleImages && !isMinimal ? (
        <div className="border-t border-stone-200 bg-white px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase">
              Image {currentIndex + 1} of {images.length}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {images.map((image, index) => {
              const isActive = index === currentIndex;

              return (
                <button
                  key={`${image.src}-thumb`}
                  aria-label={`View ${image.alt}`}
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-stone-50 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900",
                    isActive
                      ? "border-stone-900 ring-2 ring-stone-900/10"
                      : "border-stone-200 hover:border-stone-300",
                  )}
                  onClick={() => goToImage(index)}
                  type="button"
                >
                  <img
                    alt={image.alt}
                    className="aspect-square w-full object-cover"
                    src={image.src}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
