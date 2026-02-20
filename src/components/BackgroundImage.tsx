import { Image } from "@unpic/react";
import clsx from "clsx";

import logoImage from "@/images/brand/logo.png";

export function BackgroundImage({
  className,
  position = "left",
}: {
  className?: string;
  position?: "left" | "right";
}) {
  return (
    <div className={clsx("absolute inset-0 overflow-hidden bg-indigo-50", className)}>
      <Image
        className={clsx(
          "pointer-events-none absolute top-0 blur-3xl select-none",
          position === "left" &&
            "left-0 translate-x-[-55%] translate-y-[-10%] sm:left-1/2 sm:translate-x-[-98%] sm:translate-y-[-6%] lg:translate-x-[-106%] xl:translate-x-[-122%]",
          position === "right" &&
            "left-full -translate-x-1/2 sm:left-1/2 sm:translate-x-[-20%] sm:translate-y-[-15%] md:translate-x-0 lg:translate-x-[5%] lg:translate-y-[4%] xl:translate-x-[27%] xl:translate-y-[-8%]",
        )}
        src={logoImage}
        alt=""
        width={918}
        height={1495}
        loading="eager"
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-white" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-white" />
    </div>
  );
}
