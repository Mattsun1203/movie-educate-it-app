import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant =
  | "basic"
  | "practice"
  | "advanced"
  | "success"
  | "neutral"
  | "onDark";

const variantStyles: Record<BadgeVariant, string> = {
  basic: "bg-green-100 text-green-800",
  practice: "bg-indigo-100 text-indigo-800",
  advanced: "bg-amber-100 text-amber-800",
  success: "bg-emerald-600 text-white",
  neutral: "bg-slate-100 text-slate-500",
  onDark: "bg-indigo-500/25 text-indigo-200",
};

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  variant?: BadgeVariant;
}

export function Badge({
  variant = "neutral",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
