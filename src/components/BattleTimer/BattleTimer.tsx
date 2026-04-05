import { Temporal } from "temporal-polyfill";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";

const INTERVAL = 100;

export type BattleColor = "red" | "blue" | "gold";

export type TimerApi = {
  start: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  addSeconds: (value: number) => void;
  setTime: (minutes: number, seconds: number) => void;
};

type Props = {
  teamName?: string;
  color?: BattleColor;
  disabled?: boolean;
  focused?: boolean;
  editing?: boolean;
  onStart?: () => void;
  onFocus?: () => void;
  onEditDone?: () => void;
  onRegisterApi?: (api: TimerApi) => void;
};

const THEME: Record<
  BattleColor,
  {
    ring: string;
    glow: string;
    text: string;
    chip: string;
    card: string;
  }
> = {
  red: {
    ring: "border-red-500",
    glow: "shadow-[0_0_3vmin_rgba(239,68,68,0.35)]",
    text: "text-red-400",
    chip: "bg-red-500/15 border-red-400/60 text-red-200",
    card: "border-red-500/25",
  },
  blue: {
    ring: "border-blue-500",
    glow: "shadow-[0_0_3vmin_rgba(59,130,246,0.35)]",
    text: "text-blue-400",
    chip: "bg-blue-500/15 border-blue-400/60 text-blue-200",
    card: "border-blue-500/25",
  },
  gold: {
    ring: "border-amber-400",
    glow: "shadow-[0_0_3vmin_rgba(251,191,36,0.35)]",
    text: "text-amber-300",
    chip: "bg-amber-500/15 border-amber-300/60 text-amber-100",
    card: "border-amber-500/25",
  },
};

function initialDuration() {
  return new Temporal.Duration(0, 0, 0, 0, 0, 6, 0);
}

function zeroDuration() {
  return new Temporal.Duration(0, 0, 0, 0, 0, 0, 0);
}

export function BattleTimer({
  teamName: initialTeamName,
  color = "red",
  disabled,
  focused = false,
  editing = false,
  onStart,
  onFocus,
  onEditDone,
  onRegisterApi,
}: Props) {
  const [teamName, setTeamName] = useState(initialTeamName);
  const [duration, setDuration] = useState(initialDuration());
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const palette = useMemo(() => THEME[color], [color]);

  const clearIntervalRef = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Refs so the API object always calls the latest closures
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;
  const durationRef = useRef(duration);
  durationRef.current = duration;
  const onStartRef = useRef(onStart);
  onStartRef.current = onStart;

  const pause = useCallback(() => {
    clearIntervalRef();
    setIsRunning(false);
  }, [clearIntervalRef]);

  const start = useCallback(() => {
    if (isRunningRef.current || durationRef.current.sign <= 0) return;
    onStartRef.current?.();
    setIsRunning(true);
    clearIntervalRef();

    timerRef.current = window.setInterval(() => {
      setDuration((prev) => {
        const next = prev.subtract({ milliseconds: INTERVAL });
        if (next.sign <= 0) {
          clearIntervalRef();
          setIsRunning(false);
          return zeroDuration();
        }
        return next;
      });
    }, INTERVAL);
  }, [clearIntervalRef]);

  const toggle = useCallback(() => {
    if (isRunningRef.current) pause();
    else start();
  }, [pause, start]);

  const reset = useCallback(() => {
    pause();
    setDuration(zeroDuration());
  }, [pause]);

  const addSeconds = useCallback((seconds: number) => {
    setDuration((prev) => {
      const next = prev
        .add(new Temporal.Duration(0, 0, 0, 0, 0, 0, seconds, 0))
        .round({ largestUnit: "minute" });
      return next.sign <= 0 ? zeroDuration() : next;
    });
  }, []);

  const setTime = useCallback((minutes: number, seconds: number) => {
    setDuration(new Temporal.Duration(0, 0, 0, 0, 0, minutes, seconds, 0));
  }, []);

  // Register the API so the parent can drive this timer via hotkeys
  useEffect(() => {
    onRegisterApi?.({ start, pause, toggle, reset, addSeconds, setTime });
  }, [onRegisterApi, start, pause, toggle, reset, addSeconds, setTime]);

  const changeTeamName = () => {
    const name = window.prompt("Enter team/crew name");
    if (name) setTeamName(name);
  };

  useEffect(() => () => clearIntervalRef(), [clearIntervalRef]);
  useEffect(() => {
    if (disabled) pause();
  }, [disabled, pause]);

  const minute = duration.minutes.toString().padStart(1, "0");
  const second = duration.seconds.toString().padStart(2, "0");
  const tenth = Math.floor(duration.milliseconds / 100).toString();

  return (
    <article
      className={cn(
        "flex w-full items-center justify-center p-[2vmin] transition-all duration-150",
        focused ? "opacity-100" : "opacity-70",
      )}
      onMouseDown={onFocus}
    >
      <div
        className={cn(
          "@container relative flex aspect-square w-full max-w-[min(85vh,85vw)] items-center justify-center rounded-full border-[3px] bg-black/70",
          palette.ring,
          palette.glow,
          focused && "ring-2 ring-white/20 ring-offset-2 ring-offset-black",
        )}
      >
        {/* Inner decorative ring */}
        <div className="pointer-events-none absolute inset-[0.5vmin] rounded-full border border-white/10" />

        {/* Team name chip */}
        <button
          type="button"
          className={cn(
            "absolute top-[8%] rounded-full border px-[1.5cqi] py-[0.4cqi] text-[clamp(0.5rem,2.5cqi,1.1rem)] font-black tracking-[0.14em] uppercase transition-colors",
            palette.chip,
          )}
          onClick={changeTeamName}
        >
          {teamName ?? "Crew"}
        </button>

        {/* Time display / inline edit */}
        {editing ? (
          <input
            type="text"
            autoFocus
            placeholder={`${minute}:${second}`}
            className={cn(
              "w-[60%] bg-transparent text-center font-mono font-black outline-none",
              "text-[clamp(1rem,12cqi,7rem)]",
              "border-b-2 border-current",
              palette.text,
            )}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onEditDone?.();
                return;
              }
              if (e.key === "Enter") {
                const raw = (e.target as HTMLInputElement).value.trim();
                const parts = raw.split(":");
                const min = Number.parseInt(parts[0] ?? "", 10);
                const sec = parts.length > 1 ? Number.parseInt(parts[1] ?? "", 10) : 0;
                if (!Number.isNaN(min) && !Number.isNaN(sec) && min >= 0 && sec >= 0) {
                  setTime(min, sec);
                }
                onEditDone?.();
              }
            }}
            onBlur={() => onEditDone?.()}
          />
        ) : (
          <span
            className={cn(
              "font-mono font-black whitespace-nowrap",
              "text-[clamp(1rem,12cqi,7rem)]",
              palette.text,
            )}
          >
            {minute}m {second}.{tenth}s
          </span>
        )}

        {/* Running indicator */}
        {isRunning && (
          <div
            className={cn(
              "absolute bottom-[8%] rounded-full px-[1.5cqi] py-[0.3cqi] text-[clamp(0.45rem,2cqi,0.9rem)] font-bold uppercase tracking-widest",
              palette.chip,
            )}
          >
            Running
          </div>
        )}
      </div>
    </article>
  );
}
