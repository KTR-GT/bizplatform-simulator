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
    label:      "税理士1人あたり関与先数",
    value:      "約29社",
    note:       "296万法人 ÷ 税理士関与率90% ÷ 税理士人口（推計）",
    isEstimate: true,
  },
  {
    label:      "顕在的な乗り換え検討層",
    value:      "約10%前後",
    note:       "法人のみ対象。税理士を積極的に探している層の推計割合（参考）",
    isEstimate: true,
  },
]
