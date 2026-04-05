import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BattleTimer, type TimerApi } from "./BattleTimer";
import { cn } from "@/utils/cn";

type BattleMode = "2WAY" | "3WAY";
type TimerId = "A" | "B" | "C";

type Competitor = {
  id: TimerId;
  teamName: string;
  color: "red" | "blue" | "gold";
};

const COMPETITORS_BY_MODE: Record<BattleMode, Competitor[]> = {
  "2WAY": [
    { id: "A", teamName: "Team A", color: "red" },
    { id: "B", teamName: "Team B", color: "blue" },
  ],
  "3WAY": [
    { id: "A", teamName: "Team A", color: "red" },
    { id: "B", teamName: "Team B", color: "blue" },
    { id: "C", teamName: "Team C", color: "gold" },
  ],
};

function keyToTimerId(key: string): TimerId | null {
  if (key === "1") return "A";
  if (key === "2") return "B";
  if (key === "3") return "C";
  return null;
}

// ---------------------------------------------------------------------------
// Kbd – styled keyboard shortcut hint for the help dialog
// ---------------------------------------------------------------------------
function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-6 items-center justify-center rounded-md border border-white/25 bg-white/10 px-1.5 py-0.5 font-mono text-xs leading-none text-white/90">
      {children}
    </kbd>
  );
}

// ---------------------------------------------------------------------------
// HotkeyRow – a single row in the help table
// ---------------------------------------------------------------------------
function HotkeyRow({ keys, desc }: { keys: React.ReactNode; desc: string }) {
  return (
    <tr className="border-b border-white/10 last:border-b-0">
      <td className="py-2 pr-6 align-top whitespace-nowrap">{keys}</td>
      <td className="py-2 text-white/70">{desc}</td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function Timers() {
  const [mode, setMode] = useState<BattleMode>("2WAY");
  const [focusedTimer, setFocusedTimer] = useState<TimerId>("A");
  const [activeTimer, setActiveTimer] = useState<TimerId | null>(null);
  const [timerApiById, setTimerApiById] = useState<Partial<Record<TimerId, TimerApi>>>({});
  const [editingTimer, setEditingTimer] = useState<TimerId | null>(null);

  const helpDialogRef = useRef<HTMLDialogElement>(null);

  const competitors = useMemo(() => COMPETITORS_BY_MODE[mode], [mode]);
  const availableIds = useMemo(() => competitors.map((c) => c.id), [competitors]);

  useEffect(() => {
    if (!availableIds.includes(focusedTimer)) {
      setFocusedTimer(availableIds[0] ?? "A");
    }
    if (activeTimer && !availableIds.includes(activeTimer)) {
      setActiveTimer(null);
    }
  }, [availableIds, focusedTimer, activeTimer]);

  const registerApi = useCallback((id: TimerId, api: TimerApi) => {
    setTimerApiById((prev) => ({ ...prev, [id]: api }));
  }, []);

  const focusTimer = (id: TimerId) => {
    if (!availableIds.includes(id)) return;
    setFocusedTimer(id);
  };

  const handleModeChange = (nextMode: BattleMode) => {
    setMode(nextMode);
    setActiveTimer(null);
  };

  // -------------------------------------------------------------------
  // Keyboard handler
  // -------------------------------------------------------------------
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        Boolean(target?.closest("[contenteditable='true']"));

      if (isTyping) return;

      // ? — toggle help dialog
      if (event.key === "?" || event.key === "/") {
        event.preventDefault();
        const dialog = helpDialogRef.current;
        if (!dialog) return;
        if (dialog.open) {
          dialog.close();
        } else {
          dialog.showModal();
        }
        return;
      }

      // If the help dialog is open, only ? and Escape should work.
      // Escape is handled natively by <dialog>. Block everything else.
      if (helpDialogRef.current?.open) return;

      // Tab — toggle battle mode (blocked while a timer is running)
      if (event.key === "Tab") {
        event.preventDefault();
        if (activeTimer !== null) return; // don't interrupt mid-battle
        handleModeChange(mode === "2WAY" ? "3WAY" : "2WAY");
        return;
      }

      // Enter — start editing time on focused timer (blocked while running)
      if (event.key === "Enter") {
        event.preventDefault();
        if (activeTimer !== null) return;
        if (editingTimer !== null) return;
        setEditingTimer(focusedTimer);
        return;
      }

      // 1 / 2 / 3 — focus a timer
      const timerIdFromNumber = keyToTimerId(event.key);
      if (timerIdFromNumber) {
        if (availableIds.includes(timerIdFromNumber)) {
          event.preventDefault();
          focusTimer(timerIdFromNumber);
        }
        return;
      }

      const api = timerApiById[focusedTimer];
      if (!api) return;

      const multiplier = event.shiftKey ? 2 : 1;

      // Space — start / pause (swap: stop the running timer first)
      if (event.code === "Space") {
        event.preventDefault();
        if (activeTimer && activeTimer !== focusedTimer) {
          timerApiById[activeTimer]?.pause();
          setActiveTimer(null);
        }
        api.toggle();
        return;
      }

      // Ctrl+Shift+Backspace — reset ALL timers
      if (event.ctrlKey && event.shiftKey && event.key === "Backspace") {
        event.preventDefault();
        for (const id of availableIds) {
          timerApiById[id]?.reset();
        }
        setActiveTimer(null);
        return;
      }

      // Ctrl+Backspace — clear / reset focused timer
      if (event.ctrlKey && event.key === "Backspace") {
        event.preventDefault();
        api.reset();
        return;
      }

      // Arrow keys — time adjustment
      if (event.key === "ArrowRight") {
        event.preventDefault();
        api.addSeconds(5 * multiplier);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        api.addSeconds(15 * multiplier);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        api.addSeconds(-5 * multiplier);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        api.addSeconds(-15 * multiplier);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [availableIds, focusedTimer, timerApiById, mode, activeTimer, editingTimer]);

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------
  return (
    <section className="h-100dvh flex w-full items-center justify-center overflow-hidden select-none">
      <div
        className={cn(
          "grid w-full place-items-center gap-[2vmin] p-[2vmin]",
          mode === "2WAY" ? "grid-cols-2" : "grid-cols-3",
        )}
      >
        {competitors.map((competitor) => (
          <BattleTimer
            key={competitor.id}
            teamName={competitor.teamName}
            color={competitor.color}
            onStart={() => setActiveTimer(competitor.id)}
            disabled={activeTimer !== null && activeTimer !== competitor.id}
            focused={focusedTimer === competitor.id}
            editing={editingTimer === competitor.id}
            onFocus={() => focusTimer(competitor.id)}
            onEditDone={() => setEditingTimer(null)}
            onRegisterApi={(api) => registerApi(competitor.id, api)}
          />
        ))}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Hotkey help dialog (native <dialog>, opened with ?)               */}
      {/* ----------------------------------------------------------------- */}
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
