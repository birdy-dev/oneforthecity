import { describe, expect, it } from "vitest";
import {
  createInitialTimerState,
  DEFAULT_DURATION_MS,
  getRemainingMs,
  restoreTimerState,
  serializeTimerState,
  timerReducer,
  type TimerMachineState,
} from "../timer_machine";

describe("timer machine", () => {
  it("starts the focused timer without changing its configured duration", () => {
    const state = timerReducer(createInitialTimerState(), {
      type: "toggleFocused",
      nowMs: 10_000,
    });

    expect(state.activeId).toBe("A");
    expect(state.timers.A.remainingMs).toBe(DEFAULT_DURATION_MS);
    expect(state.timers.A.startedAtMs).toBe(10_000);
    expect(getRemainingMs(state.timers.A, 10_000)).toBe(DEFAULT_DURATION_MS);
    expectValidState(state);
  });

  it("pauses using elapsed monotonic time", () => {
    const running = timerReducer(createInitialTimerState(), {
      type: "toggleFocused",
      nowMs: 1_000,
    });
    const paused = timerReducer(running, {
      type: "toggleFocused",
      nowMs: 3_500,
    });

    expect(paused.activeId).toBeNull();
    expect(paused.timers.A).toMatchObject({
      remainingMs: DEFAULT_DURATION_MS - 2_500,
      startedAtMs: null,
    });
    expectValidState(paused);
  });

  it("switches timers atomically with exactly one active timer", () => {
    let state = timerReducer(createInitialTimerState(), {
      type: "toggleFocused",
      nowMs: 1_000,
    });
    state = timerReducer(state, { type: "focus", id: "B" });
    state = timerReducer(state, {
      type: "toggleFocused",
      nowMs: 6_000,
    });

    expect(state.activeId).toBe("B");
    expect(state.timers.A).toMatchObject({
      remainingMs: DEFAULT_DURATION_MS - 5_000,
      startedAtMs: null,
    });
    expect(state.timers.B).toMatchObject({
      remainingMs: DEFAULT_DURATION_MS,
      startedAtMs: 6_000,
    });
    expectValidState(state);
  });

  it("ignores a backwards monotonic clock reading", () => {
    const state = timerReducer(createInitialTimerState(), {
      type: "toggleFocused",
      nowMs: 5_000,
    });

    expect(getRemainingMs(state.timers.A, 4_000)).toBe(DEFAULT_DURATION_MS);
  });

  it("finishes at zero without producing a negative duration", () => {
    let state = timerReducer(createInitialTimerState(), {
      type: "setFocusedTime",
      remainingMs: 1_000,
      nowMs: 0,
    });
    state = timerReducer(state, { type: "toggleFocused", nowMs: 100 });
    state = timerReducer(state, { type: "tick", nowMs: 1_100 });

    expect(state.activeId).toBeNull();
    expect(state.timers.A).toMatchObject({
      remainingMs: 0,
      startedAtMs: null,
    });
    expectValidState(state);
  });

  it("adjusts a running timer without losing elapsed time", () => {
    let state = timerReducer(createInitialTimerState(), {
      type: "toggleFocused",
      nowMs: 1_000,
    });
    state = timerReducer(state, {
      type: "adjustFocused",
      deltaMs: 5_000,
      nowMs: 4_000,
    });

    expect(state.timers.A).toMatchObject({
      remainingMs: DEFAULT_DURATION_MS + 2_000,
      startedAtMs: 4_000,
    });
    expect(getRemainingMs(state.timers.A, 5_000)).toBe(DEFAULT_DURATION_MS + 1_000);
    expectValidState(state);
  });

  it("does not start a timer whose remaining duration is zero", () => {
    let state = timerReducer(createInitialTimerState(), {
      type: "resetFocused",
      nowMs: 0,
    });
    state = timerReducer(state, { type: "toggleFocused", nowMs: 1_000 });

    expect(state.activeId).toBeNull();
    expect(state.timers.A.remainingMs).toBe(0);
    expectValidState(state);
  });

  it("restores a running snapshot paused and accounts for time while closed", () => {
    const running = timerReducer(createInitialTimerState(), {
      type: "toggleFocused",
      nowMs: 1_000,
    });
    const raw = serializeTimerState(running, 6_000, 100_000);
    const restored = restoreTimerState(raw, 103_000);

    expect(restored.activeId).toBeNull();
    expect(restored.timers.A).toMatchObject({
      remainingMs: DEFAULT_DURATION_MS - 8_000,
      startedAtMs: null,
    });
    expectValidState(restored);
  });

  it("falls back to a clean state for corrupt or unsupported persistence", () => {
    expect(restoreTimerState("{not-json", 0)).toEqual(createInitialTimerState());
    expect(restoreTimerState(JSON.stringify({ version: 1 }), 0)).toEqual(
      createInitialTimerState(),
    );
  });

  it("preserves invariants through a long mixed command sequence", () => {
    let state = createInitialTimerState();
    let nowMs = 0;
    let seed = 42;

    for (let index = 0; index < 2_000; index += 1) {
      seed = (seed * 1_664_525 + 1_013_904_223) >>> 0;
      nowMs += seed % 250;

      switch (seed % 8) {
        case 0:
          state = timerReducer(state, { type: "toggleFocused", nowMs });
          break;
        case 1:
          state = timerReducer(state, { type: "focus", id: "A" });
          break;
        case 2:
          state = timerReducer(state, { type: "focus", id: "B" });
          break;
        case 3:
          state = timerReducer(state, { type: "focus", id: "C" });
          break;
        case 4:
          state = timerReducer(state, {
            type: "adjustFocused",
            deltaMs: seed % 2 === 0 ? 5_000 : -15_000,
            nowMs,
          });
          break;
        case 5:
          state = timerReducer(state, { type: "tick", nowMs });
          break;
        case 6:
          state = timerReducer(state, {
            type: "setMode",
            mode: state.mode === "2WAY" ? "3WAY" : "2WAY",
            nowMs,
          });
          break;
        case 7:
          state = timerReducer(state, { type: "resetFocused", nowMs });
          break;
      }

      expectValidState(state);
    }
  });
});

function expectValidState(state: TimerMachineState) {
  const runningIds = Object.entries(state.timers)
    .filter(([, timer]) => timer.startedAtMs !== null)
    .map(([id]) => id);

  expect(runningIds).toHaveLength(state.activeId === null ? 0 : 1);
  expect(runningIds[0] ?? null).toBe(state.activeId);

  for (const timer of Object.values(state.timers)) {
    expect(Number.isFinite(timer.remainingMs)).toBe(true);
    expect(timer.remainingMs).toBeGreaterThanOrEqual(0);
  }
}
