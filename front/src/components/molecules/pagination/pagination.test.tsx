import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Pagination } from "./pagination";

const hrefForPage = (page: number) => `/blog/articles?page=${page}`;

describe("Pagination", () => {
  it("ページ数分のリンクを表示する", () => {
    render(
      <Pagination currentPage={1} totalPages={3} hrefForPage={hrefForPage} />,
    );

    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "href",
      "/blog/articles?page=2",
    );
  });

  it("最終ページより前では次のページへのリンクを表示する", () => {
    render(
      <Pagination currentPage={1} totalPages={3} hrefForPage={hrefForPage} />,
    );

    expect(screen.getByRole("link", { name: "次のページ" })).toHaveAttribute(
      "href",
      "/blog/articles?page=2",
    );
  });

  it("最終ページでは次のページへのリンクを表示しない", () => {
    render(
      <Pagination currentPage={3} totalPages={3} hrefForPage={hrefForPage} />,
    );

    expect(
      screen.queryByRole("link", { name: "次のページ" }),
    ).not.toBeInTheDocument();
  });

  it("totalPagesが1以下の場合は何も描画しない", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} hrefForPage={hrefForPage} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
