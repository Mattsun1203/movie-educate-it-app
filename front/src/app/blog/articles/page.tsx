import type { Metadata } from "next";
import { Input } from "@/components/atoms/input";
import { ArticleCard } from "@/components/molecules/article-card";
import { Breadcrumb } from "@/components/molecules/breadcrumb";
import { Pagination } from "@/components/molecules/pagination";
import { TagFilter } from "@/components/molecules/tag-filter";
import { formatArticleDate } from "@/lib/microcms/format-article-date";
import { getArticles } from "@/lib/microcms/get-articles";
import { getCategories } from "@/lib/microcms/get-categories";

export const metadata: Metadata = {
  title: "記事一覧 | ブログ | CodeStep",
};

const PAGE_SIZE = 9;

interface BlogArticlesPageProps {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}

function buildHref({
  category,
  q,
  page,
}: {
  category?: string;
  q?: string;
  page?: number;
}) {
  const search = new URLSearchParams();
  if (category) search.set("category", category);
  if (q) search.set("q", q);
  if (page && page > 1) search.set("page", String(page));

  const queryString = search.toString();
  return queryString ? `/blog/articles?${queryString}` : "/blog/articles";
}

export default async function BlogArticlesPage({
  searchParams,
}: BlogArticlesPageProps) {
  const { category, q, page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? "1") || 1);
  const offset = (currentPage - 1) * PAGE_SIZE;

  const [{ articles, totalCount }, categories] = await Promise.all([
    getArticles({ limit: PAGE_SIZE, offset, categoryId: category, query: q }),
    getCategories(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const activeCategory = categories.find((c) => c.id === category);

  return (
    <div className="px-6 md:px-16">
      <div className="border-b border-slate-200 pb-6 pt-10">
        <Breadcrumb
          items={[{ label: "ブログ", href: "/blog" }, { label: "記事一覧" }]}
          className="mb-4"
        />
        <h1 className="mb-5 font-heading text-2xl font-bold text-slate-900">
          記事一覧
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TagFilter
            items={[
              { label: "すべて", href: "/blog/articles", isActive: !category },
              ...categories.map((c) => ({
                label: c.name,
                href: `/blog/articles?category=${encodeURIComponent(c.id)}`,
                isActive: c.id === category,
              })),
            ]}
          />
          <form
            action="/blog/articles"
            method="get"
            className="flex items-center gap-2"
          >
            {category ? (
              <input type="hidden" name="category" value={category} />
            ) : null}
            <Input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="記事を検索"
              aria-label="記事を検索"
              className="w-56"
            />
          </form>
        </div>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 py-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
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
      ) : (
        <p className="py-16 text-sm text-slate-500">
          {activeCategory
            ? `「${activeCategory.name}」に該当する記事はまだありません。`
            : "記事が見つかりませんでした。"}
        </p>
      )}

      <div className="pb-16">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hrefForPage={(p) => buildHref({ category, q, page: p })}
        />
      </div>
    </div>
  );
}
