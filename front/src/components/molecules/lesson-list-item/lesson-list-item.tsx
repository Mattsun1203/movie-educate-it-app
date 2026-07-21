import { cn } from "@/lib/cn";

export type LessonStatus = "completed" | "current" | "upcoming";

const statusIcon: Record<LessonStatus, string> = {
  completed: "✓",
  current: "▶",
  upcoming: "○",
};

const statusLabel: Record<LessonStatus, string> = {
  completed: "視聴済み",
  current: "再生中",
  upcoming: "未視聴",
};

export interface LessonListItemProps {
  title: string;
  duration: string;
  status: LessonStatus;
  className?: string;
}

export function LessonListItem({
  title,
  duration,
  status,
  className,
}: LessonListItemProps) {
  const isCurrent = status === "current";

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2.5",
        isCurrent && "bg-indigo-500/20",
        className,
      )}
    >
      <span
        className="w-5 text-center text-xs text-indigo-400"
        aria-label={statusLabel[status]}
      >
        {statusIcon[status]}
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-xs text-slate-200",
          isCurrent ? "font-bold" : "font-normal",
        )}
      >
        {title}
      </span>
      <span className="text-xs text-slate-500">{duration}</span>
    </div>
  );
}
