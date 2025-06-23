import { BattleTimer } from "@/components/BattleTimer/BattleTimer";

export default function Page() {
  return (
    <div className="bg-black size-screen min-h-screen text-white">
      <div className="flex justify-evenly">

      <BattleTimer teamName="Team A" color="red"/>

      <BattleTimer teamName="Team B" color="blue"/>
      </div>
    </div>
  );
}