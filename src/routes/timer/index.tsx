import { Timers } from "@/components/BattleTimer/Timers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/timer/")({
  component: Timer,
});

function Timer() {
  return (
    <div className="size-screen min-h-screen bg-black text-white">
      <Timers />
    </div>
  );
}
