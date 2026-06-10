import { Link } from "@tanstack/react-router";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/utils/cn";

export const buttonStyles =
  "inline-flex items-center justify-center rounded-2xl bg-black p-4 text-base font-semibold text-white transition-colors duration-200 hover:bg-neutral-800 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

type ButtonProps =
  | (ComponentPropsWithoutRef<typeof Link> & { className?: string })
  | (ComponentPropsWithoutRef<"button"> & { to?: undefined; className?: string });

export function Button({ className, ...props }: ButtonProps) {
  const cls = cn(buttonStyles, className);
  return props.to != null ? (
    <Link className={cls} {...(props as ComponentPropsWithoutRef<typeof Link>)} />
  ) : (
    <button className={cls} {...(props as ComponentPropsWithoutRef<"button">)} />
  );
}
