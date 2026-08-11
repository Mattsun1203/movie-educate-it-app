import Link from "next/link";
import { cn } from "@/lib/cn";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="ページ送り"
      className={cn("flex justify-center gap-2", className)}
    >
      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <Link
            key={page}
            href={hrefForPage(page)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
              isActive
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200",
            )}
          >
            {page}
          </Link>
        );
      })}
      {currentPage < totalPages ? (
        <Link
          href={hrefForPage(currentPage + 1)}
          aria-label="次のページ"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 hover:bg-slate-200"
        >
          →
        </Link>
      ) : null}
    </nav>
  );
}
