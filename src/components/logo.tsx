import { Image } from "@unpic/react";
import brandImage from "@/images/brand/logo.jpg";

export function Logo() {
  return (
    <div className="h-24 w-32">
      <div className="absolute z-0 h-24 w-32 rotate-3 rounded-xl bg-gray-300"></div>
      <div className="absolute z-0 h-24 w-32 rotate-12 rounded-xl bg-gray-200 shadow-sm"></div>
      <Image
        className="absolute z-10 h-24 rounded-xl object-cover shadow-lg"
        src={brandImage}
        alt="One for the City logo"
        width={128}
        height={96}
      />
    </div>
  );
}
