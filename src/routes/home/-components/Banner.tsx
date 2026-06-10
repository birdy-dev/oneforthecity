import { buttonStyles } from "@/components/Button";
import { cn } from "@/utils/cn";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

export function Banner() {
  return (
    <div className="relative isolate flex items-center justify-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm/6 text-gray-900">
          <strong className="font-semibold">One for the City 6.0</strong>
          <span className="hidden md:inline">
            <svg viewBox="0 0 2 2" className="mx-2 inline size-1 fill-current" aria-hidden="true">
              <circle cx="1" cy="1" r="1" />
            </svg>
            Edmonton, Jun 26-28
          </span>
        </p>
        <Link
          className={cn(buttonStyles, "flex-none gap-1 rounded-full px-3.5 py-1 text-sm shadow-xs")}
          to="/2026"
          // href="https://luma.com/zbhkbwr0"
        >
          Event Page <ArrowRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
}
