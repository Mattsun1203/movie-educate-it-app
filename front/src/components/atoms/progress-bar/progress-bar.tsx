import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export interface ProgressBarProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  value: number;
}

export function ProgressBar({ value, className, ...props }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-slate-100", className)}
      {...props}
    >
      <div className="h-full rounded-full bg-indigo-600 transition-[width]" style={{ width: `${clamped}%` }} />
    </div>
  );
}
