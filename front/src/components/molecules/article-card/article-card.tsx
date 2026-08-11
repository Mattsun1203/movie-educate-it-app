import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/atoms/badge";
import type { BadgeVariant } from "@/components/atoms/badge";
import { cn } from "@/lib/cn";

export type ArticleCardSize = "default" | "featured";

export interface ArticleCardProps {
  href: string;
  title: string;
  category: string;
  date: string;
  thumbnailSrc?: string;
  excerpt?: string;
  size?: ArticleCardSize;
  className?: string;
}

const categoryVariant: Record<string, BadgeVariant> = {
  フロントエンド: "practice",
  学習法: "basic",
  お知らせ: "advanced",
};

function getCategoryVariant(category: string): BadgeVariant {
  return categoryVariant[category] ?? "neutral";
}

export function ArticleCard({
  href,
  title,
  category,
  date,
  thumbnailSrc,
  excerpt,
  size = "default",
  className,
}: ArticleCardProps) {
  const isFeatured = size === "featured";

  return (
    <Link
      href={href}
      className={cn(
        "block overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md",
        isFeatured && "sm:grid sm:grid-cols-2",
        className,
      )}
    >
      <div className="relative aspect-video w-full bg-slate-100">
        {thumbnailSrc ? (
          <Image src={thumbnailSrc} alt={title} fill className="object-cover" />
        ) : null}
      </div>
      <div
        className={cn("p-4", isFeatured && "flex flex-col justify-center p-6")}
      >
        <div className="mb-2.5 flex items-center gap-2">
          <Badge variant={getCategoryVariant(category)}>{category}</Badge>
          <span className="text-xs text-slate-400">{date}</span>
        </div>
        <h3
          className={cn(
            "font-bold leading-snug text-slate-900",
            isFeatured ? "mb-3 text-xl" : "text-sm",
          )}
        >
          {title}
        </h3>
        {isFeatured && excerpt ? (
          <p className="text-sm leading-relaxed text-slate-600">{excerpt}</p>
        ) : null}
      </div>
    </Link>
  );
}
