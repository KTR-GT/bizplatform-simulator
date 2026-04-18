// ============================================================
// PARTNER BENCHMARK — 提携事務所の統計ベンチマーク（静的参考値）
// ============================================================

export interface PartnerBenchmark {
  label:    string
  value:    string
  detail:   string
}

/** 提携事務所の平均的な指標（BizplatFormパートナー実績ベース） */
export const partnerBenchmarks: PartnerBenchmark[] = [
  {
    label:  "平均関与先数",
    value:  "52件",
    detail: "提携事務所の平均関与先数（2024年）",
  },
  {
    label:  "平均月額顧問料",
    value:  "¥31,200",
    detail: "提携事務所の平均月額顧問料（税抜）",
  },
  {
    label:  "年間自然増件数",
    value:  "3.2件",
    detail: "紹介・口コミによる年間平均自然増件数",
  },
  {
    label:  "年間自然減件数",
    value:  "2.1件",
    detail: "廃業・解約による年間平均自然減件数",
  },
]
