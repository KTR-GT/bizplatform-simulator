// ============================================================
// MARKET REFERENCE — 市場参考データ
// 注意: 以下はすべて推計・参考値です。公的統計の解釈に基づくものであり、
//       確定的な数値を保証するものではありません。UIでは必ず「推計・参考」を明示してください。
// ============================================================

export interface MarketStat {
  label:   string
  value:   string
  note:    string   // 出典・補足
  isEstimate: boolean  // 推計値フラグ
}

/** 税理士市場の参考統計 */
export const marketStats: MarketStat[] = [
  {
    label:      "法人＋個人事業の母数",
    value:      "約756万",
    note:       "法人296万社（国税庁）＋個人事業主460万人（国税庁）の合計推計",
    isEstimate: true,
  },
  {
    label:      "法人 / 個人比",
    value:      "39% / 61%",
    note:       "296万法人 ÷ 756万 ≒ 39%。個人事業主が市場の過半数",
    isEstimate: true,
  },
  {
    label:      "税理士人口",
    value:      "約8万人超",
    note:       "日本税理士会連合会（2024年）",
    isEstimate: false,
  },
  {
    label:      "税理士事務所数",
    value:      "約3万事務所",
    note:       "国税庁・統計情報ベース（推計）",
    isEstimate: true,
  },
  {
    label:      "1顧客に対する競争率",
    value:      "約29社 / 人",
    note:       "法人税理士関与先 ÷ 税理士人口の単純推計。実態は事務所規模により大きく異なる",
    isEstimate: true,
  },
  {
    label:      "集客にコストをかけている開業事務所割合",
    value:      "約15%前後",
    note:       "業界調査ベースの参考値。大多数は紹介・口コミのみに依存（推計）",
    isEstimate: true,
  },
  {
    label:      "顕在的税理士検討層（法人＋個人）",
    value:      "約10%前後",
    note:       "756万（法人＋個人）× 10%前後の推計。1年以内に積極的に税理士を探している層（参考）",
    isEstimate: true,
  },
]
