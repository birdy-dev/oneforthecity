import { buttonStyles } from "@/components/Button";
import { cn } from "@/utils/cn";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

type HomeButtonProps = {
  className?: string;
  showArrow?: boolean;
  to?: "/home" | "/2026";
};

export function HomeButton({ className, showArrow = true, to = "/home" }: HomeButtonProps) {
  return (
    <Link
      className={cn(
        buttonStyles,
        "size-fit flex-none gap-1 rounded-full px-3.5 py-1 text-sm shadow-xs",
        className,
      )}
      to={to}
    >
      {showArrow ? <ArrowLeft size={16} /> : null}
      Home
    </Link>
  );
}
