import { cn } from "@/utils/cn";

export type BattleColor = "red" | "blue" | "gold";

type Props = {
  teamName: string;
  remainingMs: number;
  color?: BattleColor;
  focused?: boolean;
  editing?: boolean;
  running?: boolean;
  onFocus?: () => void;
  onRename?: (teamName: string) => void;
  onSetTime?: (minutes: number, seconds: number) => void;
  onEditDone?: () => void;
};

const THEME: Record<
  BattleColor,
  {
    ring: string;
    glow: string;
    text: string;
    chip: string;
  }
> = {
  red: {
    ring: "border-red-500",
    glow: "shadow-[0_0_3vmin_rgba(239,68,68,0.35)]",
    text: "text-red-400",
    chip: "bg-red-500/15 border-red-400/60 text-red-200",
  },
  blue: {
    ring: "border-blue-500",
    glow: "shadow-[0_0_3vmin_rgba(59,130,246,0.35)]",
    text: "text-blue-400",
    chip: "bg-blue-500/15 border-blue-400/60 text-blue-200",
  },
  gold: {
    ring: "border-amber-400",
    glow: "shadow-[0_0_3vmin_rgba(251,191,36,0.35)]",
    text: "text-amber-300",
    chip: "bg-amber-500/15 border-amber-300/60 text-amber-100",
  },
};

export function BattleTimer({
  teamName,
  remainingMs,
  color = "red",
  focused = false,
  editing = false,
  running = false,
  onFocus,
  onRename,
  onSetTime,
  onEditDone,
}: Props) {
  const palette = THEME[color];
  const safeRemainingMs = Math.max(0, remainingMs);
  const totalSeconds = Math.floor(safeRemainingMs / 1000);
  const minute = Math.floor(totalSeconds / 60).toString();
  const second = (totalSeconds % 60).toString().padStart(2, "0");
  const tenth = Math.floor((safeRemainingMs % 1000) / 100).toString();

  const changeTeamName = () => {
    const name = window.prompt("Enter team/crew name", teamName);
    if (name?.trim()) onRename?.(name);
  };

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
        <div className="pointer-events-none absolute inset-[0.5vmin] rounded-full border border-white/10" />

        <button
          type="button"
          className={cn(
            "absolute top-[8%] rounded-full border px-[1.5cqi] py-[0.4cqi] text-[clamp(0.5rem,2.5cqi,1.1rem)] font-black tracking-[0.14em] uppercase transition-colors",
            palette.chip,
          )}
          onClick={changeTeamName}
        >
          {teamName}
        </button>

        {editing ? (
          <input
            type="text"
            autoFocus
            placeholder={`${minute}:${second}`}
            className={cn(
              "w-[60%] border-b-2 border-current bg-transparent text-center font-mono font-black outline-none",
              "text-[clamp(1rem,12cqi,7rem)]",
              palette.text,
            )}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                onEditDone?.();
                return;
              }
              if (event.key !== "Enter") return;

              const raw = event.currentTarget.value.trim();
              const parts = raw.split(":");
              const minutes = Number.parseInt(parts[0] ?? "", 10);
              const seconds = parts.length > 1 ? Number.parseInt(parts[1] ?? "", 10) : 0;
              if (
                Number.isFinite(minutes) &&
                Number.isFinite(seconds) &&
                minutes >= 0 &&
                seconds >= 0
              ) {
                onSetTime?.(minutes, seconds);
              }
              onEditDone?.();
            }}
            onBlur={onEditDone}
          />
        ) : (
          <span
            className={cn(
              "font-mono text-[clamp(1rem,12cqi,7rem)] font-black whitespace-nowrap",
              palette.text,
            )}
          >
            {minute}m {second}.{tenth}s
          </span>
        )}

        {running && (
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
