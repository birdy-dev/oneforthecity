import { useEffect } from "react";

export function TicketBar() {
  useEffect(() => {
    const scriptId = "luma-checkout";

    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://embed.lu.ma/checkout-button.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 px-3 sm:px-4">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-white/20 bg-white/70 p-3 shadow-lg backdrop-blur-md sm:w-fit sm:max-w-none sm:flex-row sm:items-end sm:gap-6 sm:p-4">
        <div className="min-w-0 sm:min-w-44">
          <div className="pb-2 text-center text-[11px] font-semibold tracking-[0.18em] text-gray-600 uppercase">
            Crew
          </div>
          <a
            className="inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-none sm:px-8"
            href="https://luma.com/event/evt-g8NXPtx9gvq9MaF"
            target="_blank"
            rel="noopener noreferrer"
            data-luma-action="checkout"
            data-luma-event-id="evt-g8NXPtx9gvq9MaF"
          >
            Register
          </a>
        </div>

        <div className="min-w-0">
          <div className="pb-2 text-center text-[11px] font-semibold tracking-[0.18em] text-gray-600 uppercase">
            Tickets
          </div>
          <div className="flex flex-nowrap overflow-clip rounded-full whitespace-nowrap">
            <a
              className="inline-flex flex-1 items-center justify-center bg-indigo-50 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-indigo-100 focus-visible:outline-none sm:px-6"
              href="https://www.ticketweb.ca/event/one-for-the-city-pawn-shop-live-formally-known-tickets/14839363?pl=PawnShopLive"
            >
              Day 1
            </a>
            <a
              className="inline-flex flex-1 items-center justify-center border-l border-slate-950/15 bg-indigo-50 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-indigo-100 focus-visible:outline-none sm:px-6"
              href="https://www.ticketweb.ca/event/one-for-the-city-pawn-shop-live-formally-known-tickets/14839373?pl=PawnShopLive"
            >
              Day 2
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
