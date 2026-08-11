import type { ReactNode } from "react";
import { Footer } from "@/components/organisms/footer";
import { Header } from "@/components/organisms/header";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header current="blog" />
      <main className="flex-1 bg-slate-100">{children}</main>
      <Footer />
    </>
  );
}
