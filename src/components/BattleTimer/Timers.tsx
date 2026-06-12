import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { BattleTimer, type BattleColor } from "./BattleTimer";
import {
  availableTimerIds,
  createInitialTimerState,
  getRemainingMs,
  restoreTimerState,
  serializeTimerState,
  TIMER_STORAGE_KEY,
  timerReducer,
  type BattleMode,
  type TimerId,
  type TimerMachineState,
} from "./timer_machine";
import { cn } from "@/utils/cn";

type Competitor = {
  id: TimerId;
  color: BattleColor;
};

const COMPETITORS: Record<TimerId, Competitor> = {
  A: { id: "A", color: "red" },
  B: { id: "B", color: "blue" },
  C: { id: "C", color: "gold" },
};

function keyToTimerId(key: string): TimerId | null {
  if (key === "1") return "A";
  if (key === "2") return "B";
  if (key === "3") return "C";
  return null;
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-6 items-center justify-center rounded-md border border-white/25 bg-white/10 px-1.5 py-0.5 font-mono text-xs leading-none text-white/90">
      {children}
    </kbd>
  );
}

function HotkeyRow({ keys, desc }: { keys: React.ReactNode; desc: string }) {
  return (
    <tr className="border-b border-white/10 last:border-b-0">
      <td className="py-2 pr-6 align-top whitespace-nowrap">{keys}</td>
      <td className="py-2 text-white/70">{desc}</td>
    </tr>
  );
}

export function Timers() {
  const [state, dispatch] = useReducer(timerReducer, undefined, createInitialTimerState);
  const [editingTimer, setEditingTimer] = useState<TimerId | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [displayNowMs, setDisplayNowMs] = useState(0);
  const helpDialogRef = useRef<HTMLDialogElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const availableIds = useMemo(() => availableTimerIds(state.mode), [state.mode]);
  const competitors = useMemo(() => availableIds.map((id) => COMPETITORS[id]), [availableIds]);

  useEffect(() => {
    const nowMs = performance.now();
    const restored = restoreTimerState(
      window.localStorage.getItem(TIMER_STORAGE_KEY),
      Date.now(),
    );
    dispatch({ type: "hydrate", state: restored });
    setDisplayNowMs(nowMs);
    setHydrated(true);
  }, []);

  const persist = useCallback((snapshot: TimerMachineState) => {
    try {
      window.localStorage.setItem(
        TIMER_STORAGE_KEY,
        serializeTimerState(snapshot, performance.now(), Date.now()),
      );
    } catch {
      // The timer remains fully operational when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persist(state);
  }, [hydrated, persist, state]);

  useEffect(() => {
    if (!hydrated) return;

    const persistLatestState = () => persist(stateRef.current);
    window.addEventListener("pagehide", persistLatestState);
    document.addEventListener("visibilitychange", persistLatestState);

    return () => {
      window.removeEventListener("pagehide", persistLatestState);
      document.removeEventListener("visibilitychange", persistLatestState);
    };
  }, [hydrated, persist]);

  useEffect(() => {
    if (!hydrated || state.activeId === null) return;

    let frameId = 0;
    const renderFrame = (nowMs: number) => {
      setDisplayNowMs(nowMs);
      dispatch({ type: "tick", nowMs });
      frameId = window.requestAnimationFrame(renderFrame);
    };

    frameId = window.requestAnimationFrame(renderFrame);
    return () => window.cancelAnimationFrame(frameId);
  }, [hydrated, state.activeId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!hydrated) return;

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        Boolean(target?.closest("[contenteditable='true']"));
      if (isTyping) return;

      if (event.key === "?" || event.key === "/") {
        event.preventDefault();
        const dialog = helpDialogRef.current;
        if (!dialog) return;
        if (dialog.open) dialog.close();
        else dialog.showModal();
        return;
      }

      if (helpDialogRef.current?.open) return;

      const nowMs = performance.now();

      if (event.key === "Tab") {
        event.preventDefault();
        if (state.activeId !== null) return;
        const mode: BattleMode = state.mode === "2WAY" ? "3WAY" : "2WAY";
        dispatch({ type: "setMode", mode, nowMs });
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        if (state.activeId !== null || editingTimer !== null) return;
        setEditingTimer(state.focusedId);
        return;
      }

      const timerId = keyToTimerId(event.key);
      if (timerId) {
        if (availableIds.includes(timerId)) {
          event.preventDefault();
          dispatch({ type: "focus", id: timerId });
        }
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
        dispatch({ type: "toggleFocused", nowMs });
        return;
      }

      if (event.ctrlKey && event.shiftKey && event.key === "Backspace") {
        event.preventDefault();
        dispatch({ type: "resetAll" });
        return;
      }

      if (event.ctrlKey && event.key === "Backspace") {
        event.preventDefault();
        dispatch({ type: "resetFocused", nowMs });
        return;
      }

      const multiplier = event.shiftKey ? 2 : 1;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        dispatch({ type: "adjustFocused", deltaMs: 5_000 * multiplier, nowMs });
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        dispatch({ type: "adjustFocused", deltaMs: 15_000 * multiplier, nowMs });
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        dispatch({ type: "adjustFocused", deltaMs: -5_000 * multiplier, nowMs });
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        dispatch({ type: "adjustFocused", deltaMs: -15_000 * multiplier, nowMs });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    availableIds,
    editingTimer,
    hydrated,
    state.activeId,
    state.focusedId,
    state.mode,
  ]);

  return (
    <section className="h-100dvh flex w-full items-center justify-center overflow-hidden select-none">
      <div
        className={cn(
          "grid w-full place-items-center gap-[2vmin] p-[2vmin]",
          state.mode === "2WAY" ? "grid-cols-2" : "grid-cols-3",
        )}
      >
        {competitors.map((competitor) => {
          const timer = state.timers[competitor.id];
          return (
            <BattleTimer
              key={competitor.id}
              teamName={timer.teamName}
              remainingMs={getRemainingMs(timer, displayNowMs)}
              color={competitor.color}
              running={state.activeId === competitor.id}
              focused={state.focusedId === competitor.id}
              editing={editingTimer === competitor.id}
              onFocus={() => dispatch({ type: "focus", id: competitor.id })}
              onRename={(teamName) =>
                dispatch({ type: "rename", id: competitor.id, teamName })
              }
              onSetTime={(minutes, seconds) => {
                dispatch({ type: "focus", id: competitor.id });
                dispatch({
                  type: "setFocusedTime",
                  remainingMs: (minutes * 60 + seconds) * 1000,
                  nowMs: performance.now(),
                });
              }}
              onEditDone={() => setEditingTimer(null)}
            />
          );
        })}
      </div>

      <dialog
        ref={helpDialogRef}
        className="fixed inset-auto bottom-0 left-0 m-0 max-h-[50dvh] w-full max-w-full overflow-y-auto rounded-t-xl border-t border-white/20 bg-neutral-900/95 px-8 py-6 text-white shadow-2xl backdrop:bg-transparent"
      >
        <div className="mx-auto max-w-lg">
          <h2 className="mb-4 text-lg font-bold tracking-wide">Keyboard Shortcuts</h2>

          <table className="w-full text-sm">
            <tbody>
              <HotkeyRow
                keys={
                  <span className="flex gap-1">
                    <Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd>
                  </span>
                }
                desc="Focus timer A / B / C"
              />
              <HotkeyRow keys={<Kbd>Space</Kbd>} desc="Start / pause focused timer" />
              <HotkeyRow keys={<Kbd>Enter</Kbd>} desc="Set time on focused timer (M:SS)" />
              <HotkeyRow
                keys={
                  <span className="flex gap-1">
                    <Kbd>Ctrl</Kbd>+<Kbd>Backspace</Kbd>
                  </span>
                }
                desc="Clear / reset focused timer"
              />
              <HotkeyRow
                keys={
                  <span className="flex gap-1">
                    <Kbd>Ctrl</Kbd>+<Kbd>Shift</Kbd>+<Kbd>Backspace</Kbd>
                  </span>
                }
                desc="Reset all timers"
              />
              <HotkeyRow
                keys={
                  <span className="flex gap-1">
                    <Kbd>→</Kbd> / <Kbd>←</Kbd>
                  </span>
                }
                desc="+5s / -5s"
              />
              <HotkeyRow
                keys={
                  <span className="flex gap-1">
                    <Kbd>↑</Kbd> / <Kbd>↓</Kbd>
                  </span>
                }
                desc="+15s / -15s"
              />
              <HotkeyRow
                keys={
                  <span className="flex gap-1">
                    <Kbd>Shift</Kbd>+ arrows
                  </span>
                }
                desc="Double the adjustment"
              />
              <HotkeyRow keys={<Kbd>Tab</Kbd>} desc="Toggle 2-WAY / 3-WAY mode" />
              <HotkeyRow
                keys={
                  <span className="flex gap-1">
                    <Kbd>?</Kbd> / <Kbd>/</Kbd>
                  </span>
                }
                desc="Show / hide this help"
              />
            </tbody>
          </table>

          <p className="mt-4 text-xs text-white/40">
            Press <Kbd>?</Kbd> or <Kbd>/</Kbd> or <Kbd>Esc</Kbd> to close
          </p>
        </div>
      </dialog>
    </section>
  );
}
