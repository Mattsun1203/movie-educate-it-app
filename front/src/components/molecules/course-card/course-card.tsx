import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/atoms/badge";
import type { BadgeVariant } from "@/components/atoms/badge";
import { ProgressBar } from "@/components/atoms/progress-bar";
import { cn } from "@/lib/cn";

export type CourseLevel = "基礎" | "実務" | "応用";

const levelVariant: Record<CourseLevel, BadgeVariant> = {
  基礎: "basic",
  実務: "practice",
  応用: "advanced",
};

export interface CourseCardProps {
  href: string;
  title: string;
  description: string;
  level: CourseLevel;
  duration: string;
  isFree?: boolean;
  progress?: number;
  thumbnailSrc?: string;
  className?: string;
}

export function CourseCard({
  href,
  title,
  description,
  level,
  duration,
  isFree = false,
  progress,
  thumbnailSrc,
  className,
}: CourseCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "block overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-video w-full bg-slate-100">
        {thumbnailSrc ? (
          <Image src={thumbnailSrc} alt={title} fill className="object-cover" />
        ) : null}
        {isFree ? (
          <Badge variant="success" className="absolute left-2.5 top-2.5 z-10">
            無料あり
          </Badge>
        ) : null}
      </div>
      <div className="p-4">
        <div className="mb-2.5 flex items-center gap-2">
          <Badge variant={levelVariant[level]}>{level}</Badge>
          <span className="text-xs text-slate-400">{duration}</span>
        </div>
        <h3 className="mb-1.5 text-sm font-bold leading-snug text-slate-900">
          {title}
        </h3>
        <p className="mb-3 text-xs leading-relaxed text-slate-500">
          {description}
        </p>
        {typeof progress === "number" ? (
          <>
            <ProgressBar value={progress} />
            <div className="mt-1.5 text-xs text-slate-400">
              受講進捗 {progress}%
            </div>
          </>
        ) : null}
      </div>
    </Link>
  );
}
