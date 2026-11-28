import { TimerPage } from "@/features/battle-timer/timer-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/timer/")({
  component: TimerPage,
});
