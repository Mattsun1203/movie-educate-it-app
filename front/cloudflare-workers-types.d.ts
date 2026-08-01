// back/src/app.ts（AppTypeの定義元）がHyperdriveなどWorkers固有のグローバル型に
// 依存しているため、`back`をimportするfront側でも型解決できるよう参照しておく。
/// <reference types="@cloudflare/workers-types" />
