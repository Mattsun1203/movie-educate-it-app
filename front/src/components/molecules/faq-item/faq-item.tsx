import { cn } from "@/lib/cn";

export interface FaqItemProps {
  question: string;
  answer: string;
  className?: string;
}

export function FaqItem({ question, answer, className }: FaqItemProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5",
        className,
      )}
    >
      <p className="mb-1.5 text-sm font-bold text-slate-900">{`Q. ${question}`}</p>
      <p className="text-xs leading-relaxed text-slate-500">{`A. ${answer}`}</p>
    </div>
  );
}
