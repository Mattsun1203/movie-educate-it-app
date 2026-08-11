import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/molecules/article-card";
import { TagFilter } from "@/components/molecules/tag-filter";
import { formatArticleDate } from "@/lib/microcms/format-article-date";
import { getArticles } from "@/lib/microcms/get-articles";
import { getCategories } from "@/lib/microcms/get-categories";

export const metadata: Metadata = {
  title: "ブログ | CodeStep",
  description:
    "フロントエンド学習のコツから業界動向まで、講師陣が執筆する読み物です。",
};

// searchParams等の動的APIを使わないため、放置するとビルド時に静的プリレンダリングされ
// microCMSへの実リクエストが発生してしまう。常に最新の記事を出すためリクエスト時レンダリングに固定する。
export const dynamic = "force-dynamic";

export default async function BlogTopPage() {
  const [{ articles }, categories] = await Promise.all([
    getArticles({ limit: 7 }),
    getCategories(),
  ]);
  const [featured, ...latest] = articles;

  return (
    <div>
      <div className="bg-slate-900 px-6 py-14 md:px-16 md:py-16">
        <span className="mb-4 inline-block rounded-full bg-indigo-500/25 px-3 py-1 text-xs font-semibold text-indigo-200">
          BLOG
        </span>
        <h1 className="mb-2.5 font-heading text-2xl font-bold text-white md:text-3xl">
          学習を後押しするコラム
        </h1>
        <p className="max-w-lg text-sm text-slate-400">
          フロントエンド学習のコツから業界動向まで、講師陣が執筆する読み物です。
        </p>
      </div>

      {featured ? (
        <div className="px-6 pt-10 md:px-16">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
            注目記事
          </h2>
          <ArticleCard
            href={`/blog/${featured.id}`}
            title={featured.title}
            category={featured.category.name}
            date={formatArticleDate(featured.publishedAt)}
            thumbnailSrc={featured.thumbnail?.url}
            excerpt={featured.excerpt}
            size="featured"
            className="mb-12"
          />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 px-6 pb-6 md:px-16">
        <TagFilter
          items={[
            { label: "すべて", href: "/blog/articles", isActive: true },
            ...categories.map((category) => ({
              label: category.name,
              href: `/blog/articles?category=${encodeURIComponent(category.id)}`,
            })),
          ]}
        />
        <Link
          href="/blog/articles"
          className="whitespace-nowrap text-sm font-semibold text-slate-700 hover:text-indigo-700"
        >
          記事一覧をすべて見る →
        </Link>
      </div>

      {latest.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 px-6 pb-16 sm:grid-cols-2 md:px-16 lg:grid-cols-3">
          {latest.map((article) => (
            <ArticleCard
              key={article.id}
              href={`/blog/${article.id}`}
              title={article.title}
              category={article.category.name}
              date={formatArticleDate(article.publishedAt)}
              thumbnailSrc={article.thumbnail?.url}
            />
          ))}
        </div>
      ) : null}

      {articles.length === 0 ? (
        <p className="px-6 pb-16 text-sm text-slate-500 md:px-16">
          まだ記事がありません。
        </p>
      ) : null}
    </div>
  );
}
