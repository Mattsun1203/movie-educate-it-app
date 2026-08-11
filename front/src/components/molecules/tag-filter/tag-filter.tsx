import Link from "next/link";
import { cn } from "@/lib/cn";

export interface TagFilterItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface TagFilterProps {
  items: TagFilterItem[];
  className?: string;
}

export function TagFilter({ items, className }: TagFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          aria-current={item.isActive ? "true" : undefined}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            item.isActive
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200",
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
