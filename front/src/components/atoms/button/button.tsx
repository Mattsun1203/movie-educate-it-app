import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "invert"
  | "onDark";
export type ButtonSize = "sm" | "md";

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = ButtonOwnProps & {
  href?: undefined;
} & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof ButtonOwnProps | "href"
  >;

type ButtonAsLink = ButtonOwnProps & {
  href: string;
} & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof ButtonOwnProps | "href"
  >;

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseStyles =
  "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  ghost: "text-slate-700 hover:text-indigo-700",
  invert: "bg-white text-indigo-700 hover:bg-slate-50",
  onDark:
    "border border-slate-700 bg-white/10 text-slate-100 hover:bg-white/15",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "px-7 py-3.5 text-sm",
  sm: "px-4 py-2.5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...rest
}: ButtonProps) {
  const classes = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
