import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CourseCard } from "./course-card";

describe("CourseCard", () => {
  it("タイトル・説明・所要時間・難易度バッジを表示する", () => {
    render(
      <CourseCard
        href="/courses/react-practice"
        title="React実践開発 コンポーネント設計"
        description="状態管理・API連携まで実務水準で構築する。"
        level="実務"
        duration="全20回"
      />,
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/courses/react-practice",
    );
    expect(
      screen.getByText("React実践開発 コンポーネント設計"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("状態管理・API連携まで実務水準で構築する。"),
    ).toBeInTheDocument();
    expect(screen.getByText("実務")).toBeInTheDocument();
    expect(screen.getByText("全20回")).toBeInTheDocument();
  });

  it("isFreeがtrueのとき「無料あり」バッジを表示する", () => {
    render(
      <CourseCard
        href="/courses/html-css"
        title="HTML/CSSではじめるWebサイト制作"
        description="マークアップとスタイリングの基本を実践形式で習得。"
        level="基礎"
        duration="全12回"
        isFree
      />,
    );

    expect(screen.getByText("無料あり")).toBeInTheDocument();
  });

  it("isFreeを指定しない場合は「無料あり」バッジを表示しない", () => {
    render(
      <CourseCard
        href="/courses/typescript"
        title="TypeScriptで安全なフロントエンド"
        description="型設計の考え方と大規模開発での活用法。"
        level="実務"
        duration="全16回"
      />,
    );

    expect(screen.queryByText("無料あり")).not.toBeInTheDocument();
  });

  it("progressを指定すると進捗バーと進捗率を表示する", () => {
    render(
      <CourseCard
        href="/courses/js-basic"
        title="JavaScript基礎からDOM操作まで"
        description="変数・関数から画面操作まで、手を動かして学ぶ。"
        level="基礎"
        duration="全15回"
        progress={40}
      />,
    );

    expect(screen.getByText("受講進捗 40%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "40",
    );
  });

  it("progress未指定の場合は進捗バーを表示しない", () => {
    render(
      <CourseCard
        href="/courses/js-basic"
        title="JavaScript基礎からDOM操作まで"
        description="変数・関数から画面操作まで、手を動かして学ぶ。"
        level="基礎"
        duration="全15回"
      />,
    );

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
