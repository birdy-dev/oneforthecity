import {
  ChevronDownIcon,
  ChevronUpIcon,
  GraduationCapIcon,
  TicketIcon,
  UserPlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

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

  const ticketButtonClass =
    "inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-none sm:px-4";

  const ticketLinks = (isMobile = false) => (
    <>
      <div
        className={isMobile ? "transition-opacity duration-300 ease-in" : undefined}
        style={isMobile ? { opacity: isMobileOpen ? 1 : 0, transitionDelay: "10ms" } : undefined}
      >
        <a
          className={ticketButtonClass}
          href="https://luma.com/event/evt-g8NXPtx9gvq9MaF"
          target="_blank"
          rel="noopener noreferrer"
          data-luma-action="checkout"
          data-luma-event-id="evt-g8NXPtx9gvq9MaF"
        >
          <UserPlusIcon className="mr-2" size={16} />
          Crew Registration
        </a>
      </div>

      <div
        className={isMobile ? "transition-opacity duration-300 ease-in" : undefined}
        style={isMobile ? { opacity: isMobileOpen ? 1 : 0, transitionDelay: "60ms" } : undefined}
      >
        <a
          className={ticketButtonClass}
          href="https://luma.com/event/evt-R8uR2IUndhQDhi0"
          target="_blank"
          rel="noopener noreferrer"
          data-luma-action="checkout"
          data-luma-event-id="evt-R8uR2IUndhQDhi0"
        >
          <GraduationCapIcon className="mr-2" size={16} />
          Workshops
        </a>
      </div>

      <div
        className={isMobile ? "transition-opacity duration-300 ease-in" : undefined}
        style={isMobile ? { opacity: isMobileOpen ? 1 : 0, transitionDelay: "110ms" } : undefined}
      >
        <div className="flex flex-nowrap overflow-clip rounded-full whitespace-nowrap">
          <a
            className="inline-flex w-full items-center justify-center rounded-full bg-gray-900 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-none sm:px-4"
            href="https://www.ticketweb.ca/event/one-for-the-city-pawn-shop-live-formally-known-tickets/14839363"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TicketIcon className="mr-2" size={16} />
            Spectator Tickets
          </a>
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 px-3 sm:px-3">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-3 sm:w-fit sm:max-w-none">
        <div className="flex justify-center sm:hidden">
          <button
            type="button"
            className="inline-flex items-center rounded-full bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-gray-800 focus-visible:outline-none"
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
            maxHeight: isMobileOpen ? "16rem" : "0rem",
            opacity: isMobileOpen ? 1 : 0,
            padding: isMobileOpen ? "0.75rem" : "0rem",
            borderWidth: isMobileOpen ? "1px" : "0px",
          }}
          aria-hidden={!isMobileOpen}
        >
          <div className="flex flex-col gap-4">{ticketLinks(true)}</div>
        </div>

        <div className="hidden flex-row items-end gap-6 rounded-3xl border border-white/20 bg-white/70 p-4 shadow-lg backdrop-blur-md sm:flex">
          {ticketLinks()}
        </div>
      </div>
    </div>
  );
}
