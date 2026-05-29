import { Temporal } from "temporal-polyfill";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";

const DISPLAY_INTERVAL = 100;
const DEFAULT_DURATION_MS = 6 * 60 * 1000;

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
  storageKey: string;
  persistenceReady?: boolean;
  shouldRestoreRunning?: boolean;
  teamName?: string;
  color?: BattleColor;
  disabled?: boolean;
  focused?: boolean;
  editing?: boolean;
  onStart?: () => void;
  onFocus?: () => void;
  onEditDone?: () => void;
  onRunningChange?: (running: boolean) => void;
  onRegisterApi?: (api: TimerApi) => void;
};

type PersistedTimerState = {
  teamName?: string;
  remainingMs: number;
  endTimeMs: number | null;
  isRunning: boolean;
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

function initialDurationMs() {
  return DEFAULT_DURATION_MS;
}

function clampRemainingMs(value: number) {
  return Math.max(0, value);
}

function nowMs() {
  return Temporal.Now.instant().epochMilliseconds;
}

function getRemainingMs(endTimeMs: number | null) {
  if (endTimeMs === null) return 0;
  return clampRemainingMs(endTimeMs - nowMs());
}

export function BattleTimer({
  storageKey,
  persistenceReady = false,
  shouldRestoreRunning = false,
  teamName: initialTeamName,
  color = "red",
  disabled,
  focused = false,
  editing = false,
  onStart,
  onFocus,
  onEditDone,
  onRunningChange,
  onRegisterApi,
}: Props) {
  const [teamName, setTeamName] = useState(initialTeamName);
  const [remainingMs, setRemainingMs] = useState(initialDurationMs());
  const [isRunning, setIsRunning] = useState(false);
  const [endTimeMsState, setEndTimeMsState] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const endTimeMsRef = useRef<number | null>(null);
  const hasHydratedRef = useRef(false);

  const palette = useMemo(() => THEME[color], [color]);

  const clearTimerRef = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Refs so the API object always calls the latest closures
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  const remainingMsRef = useRef(remainingMs);
  remainingMsRef.current = remainingMs;

  const teamNameRef = useRef(teamName);
  teamNameRef.current = teamName;

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const onStartRef = useRef(onStart);
  onStartRef.current = onStart;

  const onRunningChangeRef = useRef(onRunningChange);
  onRunningChangeRef.current = onRunningChange;

  const commitRemainingMs = useCallback((value: number) => {
    remainingMsRef.current = value;
    setRemainingMs(value);
  }, []);

  const commitIsRunning = useCallback((value: boolean) => {
    isRunningRef.current = value;
    setIsRunning(value);
  }, []);

  const commitEndTimeMs = useCallback((value: number | null) => {
    endTimeMsRef.current = value;
    setEndTimeMsState(value);
  }, []);

  const finish = useCallback(() => {
    clearTimerRef();
    commitEndTimeMs(null);
    commitRemainingMs(0);
    commitIsRunning(false);
    onRunningChangeRef.current?.(false);
  }, [clearTimerRef, commitEndTimeMs, commitIsRunning, commitRemainingMs]);

  const scheduleTick = useCallback(() => {
    clearTimerRef();

    if (!isRunningRef.current || endTimeMsRef.current === null) return;

    const tick = () => {
      const next = getRemainingMs(endTimeMsRef.current);
      commitRemainingMs(next);

      if (next <= 0) {
        finish();
        return;
      }

      timerRef.current = window.setTimeout(tick, Math.min(DISPLAY_INTERVAL, next));
    };

    tick();
  }, [clearTimerRef, commitRemainingMs, finish]);

  const pause = useCallback(() => {
    if (!isRunningRef.current) return;

    const next = getRemainingMs(endTimeMsRef.current);
    clearTimerRef();
    commitEndTimeMs(null);
    commitRemainingMs(next);
    commitIsRunning(false);
    onRunningChangeRef.current?.(false);
  }, [clearTimerRef, commitEndTimeMs, commitIsRunning, commitRemainingMs]);

  const start = useCallback(() => {
    if (disabledRef.current || isRunningRef.current || remainingMsRef.current <= 0) return;

    commitEndTimeMs(nowMs() + remainingMsRef.current);
    commitIsRunning(true);
    onStartRef.current?.();
    onRunningChangeRef.current?.(true);
    scheduleTick();
  }, [commitEndTimeMs, commitIsRunning, scheduleTick]);

  const toggle = useCallback(() => {
    if (isRunningRef.current) pause();
    else start();
  }, [pause, start]);

  const updateRemainingMs = useCallback(
    (updater: (current: number) => number) => {
      const current = isRunningRef.current
        ? getRemainingMs(endTimeMsRef.current)
        : remainingMsRef.current;
      const next = clampRemainingMs(updater(current));

      if (!isRunningRef.current) {
        commitRemainingMs(next);
        return;
      }

      if (next <= 0) {
        finish();
        return;
      }

      commitEndTimeMs(nowMs() + next);
      commitRemainingMs(next);
      scheduleTick();
    },
    [commitEndTimeMs, commitRemainingMs, finish, scheduleTick],
  );

  const reset = useCallback(() => {
    if (isRunningRef.current) {
      pause();
    }
    commitRemainingMs(0);
  }, [commitRemainingMs, pause]);

  const addSeconds = useCallback(
    (seconds: number) => {
      updateRemainingMs((current) => current + seconds * 1000);
    },
    [updateRemainingMs],
  );

  const setTime = useCallback(
    (minutes: number, seconds: number) => {
      updateRemainingMs(() => (minutes * 60 + seconds) * 1000);
    },
    [updateRemainingMs],
  );

  // Register the API so the parent can drive this timer via hotkeys
  useEffect(() => {
    onRegisterApi?.({ start, pause, toggle, reset, addSeconds, setTime });
  }, [onRegisterApi, start, pause, toggle, reset, addSeconds, setTime]);

  const changeTeamName = () => {
    const name = window.prompt("Enter team/crew name");
    if (name) setTeamName(name);
  };

  useEffect(() => {
    if (!persistenceReady) return;

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;

      const persisted = JSON.parse(raw) as Partial<PersistedTimerState>;
      const nextTeamName = persisted.teamName ?? initialTeamName;
      const persistedEndTimeMs =
        typeof persisted.endTimeMs === "number" ? persisted.endTimeMs : null;
      const persistedWasRunning = persisted.isRunning === true && persistedEndTimeMs !== null;
      const nextRemainingMs = clampRemainingMs(
        persistedWasRunning
          ? persistedEndTimeMs - nowMs()
          : typeof persisted.remainingMs === "number"
            ? persisted.remainingMs
            : initialDurationMs(),
      );
      const shouldResume =
        persistedWasRunning && nextRemainingMs > 0 && shouldRestoreRunning && !disabledRef.current;

      teamNameRef.current = nextTeamName;
      setTeamName(nextTeamName);
      commitRemainingMs(nextRemainingMs);

      if (shouldResume) {
        commitEndTimeMs(persistedEndTimeMs);
        commitIsRunning(true);
        onRunningChangeRef.current?.(true);
        scheduleTick();
      } else {
        commitEndTimeMs(null);
        commitIsRunning(false);
        onRunningChangeRef.current?.(false);
      }
    } catch {
      commitEndTimeMs(null);
      commitIsRunning(false);
    } finally {
      hasHydratedRef.current = true;
    }
  }, [
    commitEndTimeMs,
    commitIsRunning,
    commitRemainingMs,
    initialTeamName,
    persistenceReady,
    scheduleTick,
    shouldRestoreRunning,
    storageKey,
  ]);

  useEffect(() => {
    if (!hasHydratedRef.current) return;

    const snapshot: PersistedTimerState = {
      teamName: teamNameRef.current,
      remainingMs: isRunningRef.current
        ? getRemainingMs(endTimeMsRef.current)
        : remainingMsRef.current,
      endTimeMs: endTimeMsRef.current,
      isRunning: isRunningRef.current,
    };

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
    } catch {
      // Ignore storage write failures
    }
  }, [endTimeMsState, isRunning, isRunning ? 0 : remainingMs, storageKey, teamName]);

  useEffect(() => () => clearTimerRef(), [clearTimerRef]);

  useEffect(() => {
    if (disabled) pause();
  }, [disabled, pause]);

  useEffect(() => {
    const syncTimerWithVisibility = () => {
      if (!isRunningRef.current) return;

      if (document.visibilityState === "visible") {
        scheduleTick();
        return;
      }

      clearTimerRef();
    };

    document.addEventListener("visibilitychange", syncTimerWithVisibility);
    window.addEventListener("focus", syncTimerWithVisibility);

    return () => {
      document.removeEventListener("visibilitychange", syncTimerWithVisibility);
      window.removeEventListener("focus", syncTimerWithVisibility);
    };
  }, [clearTimerRef, scheduleTick]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  const minute = Math.floor(totalSeconds / 60).toString();
  const second = (totalSeconds % 60).toString().padStart(2, "0");
  const tenth = Math.floor((remainingMs % 1000) / 100).toString();

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
              "absolute bottom-[8%] rounded-full px-[1.5cqi] py-[0.3cqi] text-[clamp(0.45rem,2cqi,0.9rem)] font-bold tracking-widest uppercase",
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
