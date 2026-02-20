import { Link } from "@tanstack/react-router";
import type { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

const baseStyles =
  "inline-flex justify-center rounded-2xl bg-blue-600 p-4 text-base font-semibold text-white hover:bg-blue-500 focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:text-white/70";

type ButtonProps =
  | (ComponentPropsWithoutRef<typeof Link> & { className?: string })
  | (ComponentPropsWithoutRef<"button"> & { to?: undefined; className?: string });

export function Button({ className, ...props }: ButtonProps) {
  const cls = clsx(baseStyles, className);
  return props.to != null ? (
    <Link className={cls} {...(props as ComponentPropsWithoutRef<typeof Link>)} />
  ) : (
    <button className={cls} {...(props as ComponentPropsWithoutRef<"button">)} />
  );
}
