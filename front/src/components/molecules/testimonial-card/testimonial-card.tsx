import { Avatar } from "@/components/atoms/avatar";
import { cn } from "@/lib/cn";

export interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  className?: string;
}

export function TestimonialCard({ quote, name, role, className }: TestimonialCardProps) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 p-6", className)}>
      <p className="mb-4 text-sm leading-relaxed text-slate-700">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-2.5">
        <Avatar initials={name.slice(0, 1)} size="sm" />
        <div>
          <div className="text-xs font-semibold text-slate-900">{name}</div>
          <div className="text-xs text-slate-400">{role}</div>
        </div>
      </div>
    </div>
  );
}
