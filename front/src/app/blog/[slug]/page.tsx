import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import type { BadgeVariant } from "@/components/atoms/badge";
import { Breadcrumb } from "@/components/molecules/breadcrumb";
import { formatArticleDate } from "@/lib/microcms/format-article-date";
import { getArticle } from "@/lib/microcms/get-article";
import { getArticles } from "@/lib/microcms/get-articles";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

const categoryVariant: Record<string, BadgeVariant> = {
  フロントエンド: "practice",
  学習法: "basic",
  お知らせ: "advanced",
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "記事が見つかりません | ブログ | CodeStep" };
  }

  return {
    title: `${article.title} | ブログ | CodeStep`,
    description: article.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const { articles: categoryArticles } = await getArticles({
    categoryId: article.category.id,
    limit: 100,
  });

  const currentIndex = categoryArticles.findIndex((a) => a.id === article.id);
  const prevArticle =
    currentIndex > 0 ? categoryArticles[currentIndex - 1] : undefined;
  const nextArticle =
    currentIndex >= 0 && currentIndex < categoryArticles.length - 1
      ? categoryArticles[currentIndex + 1]
      : undefined;
  const relatedArticles = categoryArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-10 px-6 py-10 md:px-16 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <Breadcrumb
          items={[
            { label: "ブログ", href: "/blog" },
            {
              label: article.category.name,
              href: `/blog/articles?category=${encodeURIComponent(article.category.id)}`,
            },
            { label: "記事詳細" },
          ]}
          className="mb-4"
        />
        <div className="mb-3.5 flex items-center gap-2.5">
          <Badge variant={categoryVariant[article.category.name] ?? "neutral"}>
            {article.category.name}
          </Badge>
          <span className="text-xs text-slate-400">
            {formatArticleDate(article.publishedAt)}
          </span>
        </div>
        <h1 className="mb-4 font-heading text-2xl font-bold leading-snug text-slate-900 md:text-3xl">
          {article.title}
        </h1>
        <div className="mb-7 flex items-center gap-2.5">
          <Avatar initials="C" size="sm" />
          <div>
            <div className="text-xs font-semibold text-slate-900">
              {article.authorName ?? "CodeStep編集部"}
            </div>
            {article.readingMinutes ? (
              <div className="text-[11px] text-slate-400">
                読了時間 約{article.readingMinutes}分
              </div>
            ) : null}
          </div>
        </div>
        {article.thumbnail ? (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={article.thumbnail.url}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        ) : null}
        <div
          className="text-sm leading-loose text-slate-700 [&_h2]:mb-3.5 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_p]:mb-5"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: microCMSのリッチエディタから受け取るHTMLをそのまま描画する
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        {article.tags && article.tags.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2.5 border-t border-slate-200 pt-6">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        {prevArticle || nextArticle ? (
          <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
            {prevArticle ? (
              <Link
                href={`/blog/${prevArticle.id}`}
                className="flex-1 rounded-xl border border-slate-200 p-4 text-xs text-slate-700"
              >
                <div className="mb-1 text-slate-400">← 前の記事</div>
                <div className="font-semibold">{prevArticle.title}</div>
              </Link>
            ) : null}
            {nextArticle ? (
              <Link
                href={`/blog/${nextArticle.id}`}
                className="flex-1 rounded-xl border border-slate-200 p-4 text-right text-xs text-slate-700"
              >
                <div className="mb-1 text-slate-400">次の記事 →</div>
                <div className="font-semibold">{nextArticle.title}</div>
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>

      {relatedArticles.length > 0 ? (
        <div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-3.5 text-xs font-bold text-slate-900">
              関連記事
            </div>
            <div className="flex flex-col gap-3.5">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.id}`}
                  className="flex items-center gap-2.5"
                >
                  <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md bg-slate-100">
                    {related.thumbnail ? (
                      <Image
                        src={related.thumbnail.url}
                        alt={related.title}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <span className="text-xs font-semibold leading-snug text-slate-900">
                    {related.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
