import { buttonStyles } from "@/components/Button";
import { cn } from "@/utils/cn";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  GraduationCapIcon,
  type LucideIcon,
  TicketIcon,
  UserPlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

type TicketAction = {
  label: string;
  href: string;
  lumaEventId?: string;
  Icon: LucideIcon;
};

const ticketActions: TicketAction[] = [
  {
    label: "Spectator Tickets",
    href: "https://www.ticketweb.ca/event/one-for-the-city-pawn-shop-live-formally-known-tickets/14839363",
    Icon: TicketIcon,
  },
  {
    label: "Crew Registration",
    href: "https://luma.com/event/evt-g8NXPtx9gvq9MaF",
    lumaEventId: "evt-g8NXPtx9gvq9MaF",
    Icon: UserPlusIcon,
  },
];

const workshopActions: TicketAction[] = [
  {
    label: "Rockforce & Storm",
    href: "https://luma.com/inka0iev",
    lumaEventId: "evt-R8uR2IUndhQDhi0",
    Icon: GraduationCapIcon,
  },
  {
    label: "Lady C",
    href: "https://luma.com/2zm0ysqo",
    lumaEventId: "evt-29xTiIVY7HxDI9v",
    Icon: GraduationCapIcon,
  },
  {
    label: "Rubix",
    href: "https://luma.com/vj3ri6go",
    lumaEventId: "evt-RpCdBcHaJYpLSRv",
    Icon: GraduationCapIcon,
  },
];

declare global {
  interface Window {
    luma?: {
      initCheckout?: () => void;
    };
  }
}

export function TicketBar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const scriptId = "luma-checkout";
    const initCheckout = () => window.luma?.initCheckout?.();

    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existingScript) {
      initCheckout();
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://embed.lu.ma/checkout-button.js";
    script.async = true;
    script.onload = initCheckout;
    document.body.appendChild(script);
  }, []);

  const ticketButtonClass = cn(buttonStyles, "w-full rounded-full px-4 py-2 text-sm sm:px-4");
  const workshopButtonClass = cn(
    buttonStyles,
    "w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-950 hover:bg-gray-100 sm:px-4",
  );

  const actionLinks = (actions: TicketAction[], isMobile = false, variant: "ticket" | "workshop") => (
    <>
      {actions.map((action, index) => {
        const Icon = action.Icon;

        return (
          <div
            key={action.label}
            className={cn(
              "flex flex-nowrap overflow-clip rounded-full whitespace-nowrap",
              isMobile && "transition-opacity duration-300 ease-in",
            )}
            style={
              isMobile
                ? { opacity: isMobileOpen ? 1 : 0, transitionDelay: `${10 + index * 50}ms` }
                : undefined
            }
          >
            <a
              className={variant === "workshop" ? workshopButtonClass : ticketButtonClass}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              data-luma-action={action.lumaEventId ? "checkout" : undefined}
              data-luma-event-id={action.lumaEventId}
            >
              <Icon className="mr-2 shrink-0" size={16} />
              {action.label}
            </a>
          </div>
        );
      })}
    </>
  );

  const ticketLinks = (isMobile = false) => (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-row">
        {actionLinks(ticketActions, isMobile, "ticket")}
      </div>
      <div className="grid gap-3 border-t border-gray-300/70 pt-3 sm:grid-cols-3 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0 xl:flex xl:flex-row">
        {actionLinks(workshopActions, isMobile, "workshop")}
      </div>
    </>
  );

  return (
    <div className="fixed inset-x-0 bottom-2 z-50 px-3 sm:px-3">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-3 sm:w-fit sm:max-w-none">
        <div className="flex justify-center sm:hidden">
          <button
            type="button"
            className={cn(buttonStyles, "rounded-full px-4 py-3 text-sm shadow-lg")}
            aria-controls="mobile-ticket-links"
            aria-expanded={isMobileOpen}
            aria-label="Toggle ticket options"
            onClick={() => setIsMobileOpen((open) => !open)}
          >
            <span
              className="overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-200 ease-in"
              style={{
                maxWidth: isMobileOpen ? "0rem" : "8rem",
                opacity: isMobileOpen ? 0 : 1,
                marginRight: isMobileOpen ? "0rem" : "0.125rem",
              }}
            >
              Get Tickets
            </span>
            {isMobileOpen ? <ChevronDownIcon size={18} /> : <ChevronUpIcon size={18} />}
          </button>
        </div>

        <div
          id="mobile-ticket-links"
          className="overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-lg backdrop-blur-md transition-all duration-300 ease-in sm:hidden"
          style={{
            maxHeight: isMobileOpen ? "24rem" : "0rem",
            opacity: isMobileOpen ? 1 : 0,
            padding: isMobileOpen ? "0.75rem" : "0rem",
            borderWidth: isMobileOpen ? "1px" : "0px",
          }}
          aria-hidden={!isMobileOpen}
        >
          <div className="flex flex-col gap-3">{ticketLinks(true)}</div>
        </div>

        <div className="hidden items-center gap-3 rounded-3xl border border-white/20 bg-white/70 p-4 shadow-lg backdrop-blur-md sm:flex sm:flex-col md:flex-row xl:gap-4">
          {ticketLinks()}
        </div>
      </div>
    </div>
  );
}
