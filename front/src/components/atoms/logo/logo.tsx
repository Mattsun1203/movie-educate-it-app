import { cn } from "@/lib/cn";

export interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
        <span className="font-heading text-base font-bold text-white">C</span>
      </span>
      <span className="font-heading text-lg font-bold text-slate-900">
        CodeStep
      </span>
    </span>
  );
}
