import { Temporal } from "temporal-polyfill";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

const INTERVAL = 100;

const changeTimeBtn = cn("size-18 cursor-pointer rounded-full border border-white text-xl");
const btn = cn("w-30 cursor-pointer rounded-lg border border-white py-2");

type Props = {
  teamName?: string;
  color?: "red" | "blue";
  disabled?: boolean;
  onStart?: () => void;
};

export function BattleTimer(props: Props) {
  const [teamName, setTeamName] = useState(props.teamName);
  const [duration, setDuration] = useState(new Temporal.Duration(0, 0, 0, 0, 0, 6, 0));
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number>(null);

  const start = () => {
    if (isRunning || duration.sign <= 0) return;
    setIsRunning(true);
    props.onStart?.();

    timerRef.current = window.setInterval(() => {
      setDuration((prev) => {
        if (timerRef.current && prev.sign <= 0) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          return new Temporal.Duration();
        }
        return prev.subtract({ milliseconds: INTERVAL });
      });
    }, INTERVAL);
  };

  const pause = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
  };

  const reset = () => {
    setDuration(new Temporal.Duration(0, 0, 0, 0, 0, 0, 0));
    pause();
  };

  const setTime = ({ minutes = 0, seconds = 0 }: { minutes?: number; seconds?: number }) => {
    setDuration((prev) => {
      const result = prev.add(new Temporal.Duration(0, 0, 0, 0, 0, minutes, seconds, 0));
      if (result.sign <= 0) return new Temporal.Duration(0, 0, 0, 0, 0, 0, 0);

      return result;
    });
  };

  const changeTeamName = () => {
    const name = window.prompt("Enter team name");
    if (name) {
      setTeamName(name);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (props.disabled) {
      return pause();
    }

    start();
  }, [props.disabled]);

  return (
    <div className="flex max-w-lg flex-col items-center gap-14 py-4">
      <div>
        <div className="flex gap-4">
          <button className={changeTimeBtn} type="button" onClick={() => setTime({ seconds: 5 })}>
            +5s
          </button>
          <button className={changeTimeBtn} type="button" onClick={() => setTime({ seconds: 30 })}>
            +30s
          </button>

          <button className={changeTimeBtn} type="button" onClick={() => setTime({ minutes: 1 })}>
            +1m
          </button>
        </div>
      </div>

      <div
        className={cn(
          "relative flex size-[500px] items-center justify-center rounded-full",
          props.color === "red" ? "border-4  border-red-600" : "border-3 border-blue-600",
        )}
      >
        <button
          className={cn(
            "absolute top-20 cursor-pointer text-3xl",
            props.color === "red" ? "font-medium text-red-600" : "text-blue-600",
          )}
          onClick={() => changeTeamName()}
          type="button"
        >
          {teamName}
        </button>
        <span className="font-mono text-7xl">
          {duration.minutes.toString().padStart(1, "0")}m{" "}
          {duration.seconds.toString().padStart(2, "0")}.
          {(duration.milliseconds / 100).toString().padEnd(1, "0")}s
        </span>
        <div className="absolute bottom-20 flex items-center justify-center gap-4" id="controls">
          {isRunning ? (
            <button className={btn} type="button" onClick={pause}>
              Pause
            </button>
          ) : (
            <button className={btn} type="button" onClick={start}>
              Start
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button className={changeTimeBtn} type="button" onClick={() => setTime({ seconds: -5 })}>
          -5s
        </button>
        <button className={changeTimeBtn} type="button" onClick={() => setTime({ seconds: -30 })}>
          -30s
        </button>

        <button className={changeTimeBtn} type="button" onClick={() => setTime({ minutes: -1 })}>
          -1m
        </button>
      </div>
      <div className="flex items-center justify-center">
        <button className={btn} type="button" onClick={reset}>
          CLEAR
        </button>
      </div>
    </div>
  );
}
