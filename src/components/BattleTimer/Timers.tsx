import { useState } from "react";
import { BattleTimer } from "./BattleTimer";

export function Timers() {
  const [activeTimer, setActiveTimer] = useState<"A" | "B">();

  return (
    <div className="flex justify-evenly">
      <BattleTimer
        teamName="Team A"
        color="red"
        onStart={() => setActiveTimer("A")}
        disabled={activeTimer !== "A"}
      />

      <BattleTimer
        teamName="Team B"
        color="blue"
        onStart={() => setActiveTimer("B")}
        disabled={activeTimer !== "B"}
      />
    </div>
  );
}
