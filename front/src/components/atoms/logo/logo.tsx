import { cn } from "@/lib/cn";

export type LogoVariant = "default" | "onDark";

export interface LogoProps {
  variant?: LogoVariant;
  className?: string;
}

const textStyles: Record<LogoVariant, string> = {
  default: "text-slate-900",
  onDark: "text-slate-100",
};

export function Logo({ variant = "default", className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
        <span className="font-heading text-base font-bold text-white">C</span>
      </span>
      <span
        className={cn("font-heading text-lg font-bold", textStyles[variant])}
      >
        CodeStep
      </span>
    </span>
  );
}
