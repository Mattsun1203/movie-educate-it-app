import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type LabelProps = ComponentPropsWithoutRef<"label">;

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-xs font-semibold text-slate-700",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
