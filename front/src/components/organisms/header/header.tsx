import Link from "next/link";
import { Avatar } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { Logo } from "@/components/atoms/logo";
import { NavLink } from "@/components/atoms/nav-link";

export type HeaderCurrentNav =
  | "courses"
  | "roadmap"
  | "pricing"
  | "faq"
  | "blog"
  | "dashboard";

export interface HeaderProps {
  current?: HeaderCurrentNav;
  isLoggedIn?: boolean;
  userInitials?: string;
}

const navItems: {
  key: Exclude<HeaderCurrentNav, "dashboard">;
  label: string;
  href: string;
}[] = [
  { key: "courses", label: "講座を探す", href: "/courses" },
  { key: "roadmap", label: "学習の進め方", href: "/#roadmap" },
  { key: "pricing", label: "料金プラン", href: "/pricing" },
  { key: "faq", label: "よくある質問", href: "/#faq" },
  { key: "blog", label: "ブログ", href: "/blog" },
];

export function Header({
  current,
  isLoggedIn = false,
  userInitials = "",
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-6 md:px-10">
      <div className="flex items-center gap-10">
        <Link href="/" aria-label="CodeStep トップページ">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              href={item.href}
              isActive={current === item.key}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <NavLink
            href="/dashboard"
            isActive={current === "dashboard"}
            className="hidden md:inline"
          >
            マイページ
          </NavLink>
          <Link href="/dashboard" aria-label="アカウントメニュー">
            <Avatar initials={userInitials} size="sm" />
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button href="/auth" variant="ghost" size="sm">
            ログイン
          </Button>
          <Button href="/auth" variant="primary" size="sm">
            無料登録
          </Button>
        </div>
      )}
    </header>
  );
}
