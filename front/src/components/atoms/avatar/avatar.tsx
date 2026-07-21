import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type AvatarSize = "sm" | "md";

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-9 w-9 text-sm",
  md: "h-12 w-12 text-base",
};

export interface AvatarProps extends ComponentPropsWithoutRef<"span"> {
  initials: string;
  size?: AvatarSize;
}

export function Avatar({ initials, size = "md", className, ...props }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-700",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {initials}
    </span>
  );
}
