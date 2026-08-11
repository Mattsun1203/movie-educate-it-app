import Link from "next/link";
import { Logo } from "@/components/atoms/logo";

interface FooterLinkColumn {
  heading: string;
  links: { label: string; href: string }[];
}

const columns: FooterLinkColumn[] = [
  {
    heading: "サービス",
    links: [
      { label: "講座を探す", href: "/courses" },
      { label: "料金プラン", href: "/pricing" },
      { label: "学習の進め方", href: "/#roadmap" },
    ],
  },
  {
    heading: "サポート",
    links: [
      { label: "よくある質問", href: "/#faq" },
      { label: "お問い合わせ", href: "#" },
      { label: "運営について", href: "#" },
    ],
  },
  {
    heading: "規約",
    links: [
      { label: "利用規約", href: "#" },
      { label: "プライバシーポリシー", href: "#" },
      { label: "特定商取引法に基づく表記", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 px-6 py-14 text-slate-400 md:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-8">
        <div>
          <Logo variant="onDark" className="mb-3" />
          <p className="max-w-xs text-sm leading-relaxed">
            現場で使える実務スキルを、動画でひとつずつ。IT初心者からのステップアップを支える学習プラットフォーム。
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.heading} className="flex flex-col gap-2.5">
            <span className="mb-1 text-sm font-semibold text-slate-100">
              {column.heading}
            </span>
            {column.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-slate-400 transition-colors hover:text-slate-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-slate-800 pt-5 text-xs text-slate-500">
        © 2026 CodeStep, Inc.
      </div>
    </footer>
  );
}
