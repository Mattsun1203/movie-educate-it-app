import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export interface NavLinkProps
  extends Omit<ComponentPropsWithoutRef<typeof Link>, "className"> {
  isActive?: boolean;
  className?: string;
}

export function NavLink({
  isActive = false,
  className,
  children,
  ...props
}: NavLinkProps) {
  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "text-sm font-medium text-slate-600 transition-colors hover:text-indigo-700",
        isActive && "font-semibold text-indigo-700",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
