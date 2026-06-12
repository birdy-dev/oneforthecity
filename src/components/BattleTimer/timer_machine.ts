export const DEFAULT_DURATION_MS = 6 * 60 * 1000;
export const MAX_DURATION_MS = 24 * 60 * 60 * 1000;
export const TIMER_STORAGE_KEY = "battle-timers:v2";

export type BattleMode = "2WAY" | "3WAY";
export type TimerId = "A" | "B" | "C";

export type TimerState = {
  remainingMs: number;
  startedAtMs: number | null;
  teamName: string;
};

export type TimerMachineState = {
  mode: BattleMode;
  focusedId: TimerId;
  activeId: TimerId | null;
  timers: Record<TimerId, TimerState>;
};

export type TimerAction =
  | { type: "focus"; id: TimerId }
  | { type: "toggleFocused"; nowMs: number }
  | { type: "adjustFocused"; deltaMs: number; nowMs: number }
  | { type: "setFocusedTime"; remainingMs: number; nowMs: number }
  | { type: "resetFocused"; nowMs: number }
  | { type: "resetAll" }
  | { type: "rename"; id: TimerId; teamName: string }
  | { type: "setMode"; mode: BattleMode; nowMs: number }
  | { type: "tick"; nowMs: number }
  | { type: "hydrate"; state: TimerMachineState };

type PersistedTimerMachine = {
  version: 2;
  savedAtEpochMs: number;
  mode: BattleMode;
  focusedId: TimerId;
  activeId: TimerId | null;
  timers: Record<TimerId, { remainingMs: number; teamName: string }>;
};

const TIMER_IDS: TimerId[] = ["A", "B", "C"];

export function createInitialTimerState(): TimerMachineState {
  return {
    mode: "2WAY",
    focusedId: "A",
    activeId: null,
    timers: {
      A: createTimer("Team A"),
      B: createTimer("Team B"),
      C: createTimer("Team C"),
    },
  };
}

function createTimer(teamName: string): TimerState {
  return {
    remainingMs: DEFAULT_DURATION_MS,
    startedAtMs: null,
    teamName,
  };
}

function clampDuration(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(MAX_DURATION_MS, Math.max(0, Math.round(value)));
}

export function getRemainingMs(timer: TimerState, nowMs: number) {
  if (timer.startedAtMs === null) return clampDuration(timer.remainingMs);
  return clampDuration(timer.remainingMs - Math.max(0, nowMs - timer.startedAtMs));
}

function pauseTimer(timer: TimerState, nowMs: number): TimerState {
  return {
    ...timer,
    remainingMs: getRemainingMs(timer, nowMs),
    startedAtMs: null,
  };
}

function withTimer(
  state: TimerMachineState,
  id: TimerId,
  timer: TimerState,
): TimerMachineState {
  return {
    ...state,
    timers: {
      ...state.timers,
      [id]: timer,
    },
  };
}

function pauseActive(state: TimerMachineState, nowMs: number): TimerMachineState {
  if (state.activeId === null) return state;

  const activeId = state.activeId;
  return {
    ...withTimer(state, activeId, pauseTimer(state.timers[activeId], nowMs)),
    activeId: null,
  };
}

function updateFocusedDuration(
  state: TimerMachineState,
  remainingMs: number,
  nowMs: number,
): TimerMachineState {
  const id = state.focusedId;
  const nextRemainingMs = clampDuration(remainingMs);
  const isActive = state.activeId === id;

  return {
    ...withTimer(state, id, {
      ...state.timers[id],
      remainingMs: nextRemainingMs,
      startedAtMs: isActive && nextRemainingMs > 0 ? nowMs : null,
    }),
    activeId: isActive && nextRemainingMs <= 0 ? null : state.activeId,
  };
}

export function timerReducer(
  state: TimerMachineState,
  action: TimerAction,
): TimerMachineState {
  switch (action.type) {
    case "hydrate":
      return action.state;

    case "focus":
      if (!availableTimerIds(state.mode).includes(action.id)) return state;
      return { ...state, focusedId: action.id };

    case "toggleFocused": {
      if (state.activeId === state.focusedId) {
        return pauseActive(state, action.nowMs);
      }

      const pausedState = pauseActive(state, action.nowMs);
      const id = pausedState.focusedId;
      const timer = pausedState.timers[id];
      if (timer.remainingMs <= 0) return pausedState;

      return {
        ...withTimer(pausedState, id, { ...timer, startedAtMs: action.nowMs }),
        activeId: id,
      };
    }

    case "adjustFocused": {
      const timer = state.timers[state.focusedId];
      return updateFocusedDuration(
        state,
        getRemainingMs(timer, action.nowMs) + action.deltaMs,
        action.nowMs,
      );
    }

    case "setFocusedTime":
      return updateFocusedDuration(state, action.remainingMs, action.nowMs);

    case "resetFocused":
      return updateFocusedDuration(state, 0, action.nowMs);

    case "resetAll":
      return {
        ...state,
        activeId: null,
        timers: mapTimers(state.timers, (timer) => ({
          ...timer,
          remainingMs: 0,
          startedAtMs: null,
        })),
      };

    case "rename": {
      const teamName = action.teamName.trim();
      if (!teamName) return state;
      return withTimer(state, action.id, { ...state.timers[action.id], teamName });
    }

    case "setMode": {
      const pausedState = pauseActive(state, action.nowMs);
      const ids = availableTimerIds(action.mode);
      return {
        ...pausedState,
        mode: action.mode,
        focusedId: ids.includes(pausedState.focusedId) ? pausedState.focusedId : ids[0],
      };
    }

    case "tick": {
      if (state.activeId === null) return state;
      const timer = state.timers[state.activeId];
      if (getRemainingMs(timer, action.nowMs) > 0) return state;
      return pauseActive(state, action.nowMs);
    }
  }
}

export function availableTimerIds(mode: BattleMode): TimerId[] {
  return mode === "2WAY" ? ["A", "B"] : ["A", "B", "C"];
}

function mapTimers(
  timers: Record<TimerId, TimerState>,
  map: (timer: TimerState, id: TimerId) => TimerState,
): Record<TimerId, TimerState> {
  return {
    A: map(timers.A, "A"),
    B: map(timers.B, "B"),
    C: map(timers.C, "C"),
  };
}

export function serializeTimerState(
  state: TimerMachineState,
  nowMs: number,
  epochMs: number,
): string {
  const timers = mapTimers(state.timers, (timer) => ({
    ...timer,
    remainingMs: getRemainingMs(timer, nowMs),
    startedAtMs: null,
  }));

  const persisted: PersistedTimerMachine = {
    version: 2,
    savedAtEpochMs: epochMs,
    mode: state.mode,
    focusedId: state.focusedId,
    activeId: state.activeId,
    timers: mapTimers(timers, (timer) => ({
      remainingMs: timer.remainingMs,
      startedAtMs: null,
      teamName: timer.teamName,
    })),
  };

  return JSON.stringify(persisted);
}

export function restoreTimerState(raw: string | null, epochMs: number): TimerMachineState {
  const fallback = createInitialTimerState();
  if (!raw) return fallback;

  try {
    const value = JSON.parse(raw) as Partial<PersistedTimerMachine>;
    if (value.version !== 2) return fallback;
    if (value.mode !== "2WAY" && value.mode !== "3WAY") return fallback;
    if (!isTimerId(value.focusedId) || !value.timers || typeof value.timers !== "object") {
      return fallback;
    }

    const savedAtEpochMs =
      typeof value.savedAtEpochMs === "number" && Number.isFinite(value.savedAtEpochMs)
        ? value.savedAtEpochMs
        : epochMs;
    const elapsedWhileClosedMs = Math.max(0, epochMs - savedAtEpochMs);
    const availableIds = availableTimerIds(value.mode);
    const persistedActiveId =
      isTimerId(value.activeId) && availableIds.includes(value.activeId) ? value.activeId : null;

    const timers = mapTimers(fallback.timers, (defaultTimer, id) => {
      const persistedTimer = value.timers?.[id];
      if (!persistedTimer || typeof persistedTimer !== "object") return defaultTimer;

      const persistedRemainingMs =
        typeof persistedTimer.remainingMs === "number"
          ? clampDuration(persistedTimer.remainingMs)
          : defaultTimer.remainingMs;
      const remainingMs =
        persistedActiveId === id
          ? clampDuration(persistedRemainingMs - elapsedWhileClosedMs)
          : persistedRemainingMs;

      return {
        remainingMs,
        startedAtMs: null,
        teamName:
          typeof persistedTimer.teamName === "string" && persistedTimer.teamName.trim()
            ? persistedTimer.teamName.trim()
            : defaultTimer.teamName,
      };
    });
    return {
      mode: value.mode,
      focusedId: availableIds.includes(value.focusedId) ? value.focusedId : availableIds[0],
      activeId: null,
      timers,
    };
  } catch {
    return fallback;
  }
}

function isTimerId(value: unknown): value is TimerId {
  return TIMER_IDS.includes(value as TimerId);
}
