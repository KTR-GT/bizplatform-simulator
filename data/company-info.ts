// ============================================================
// COMPANY INFO — 会社概要 (プレースホルダー: 正式情報は吉田氏より入手予定)
// ============================================================

export interface CompanyInfo {
  name:          string
  nameEn:        string
  founded:       string
  ceo:           string
  address:       string
  capital:       string
  business:      string[]
  mission:       string
  vision:        string
}

export const companyInfo: CompanyInfo = {
  name:     "株式会社BizplatForm",
  nameEn:   "BizplatForm Inc.",
  founded:  "2020年（※正式な設立年月は要確認）",
  ceo:      "吉田 耕太郎（※正式な代表者名は要確認）",
  address:  "東京都（※正式な住所は要確認）",
  capital:  "（※資本金は要確認）",
  business: [
    "税理士事務所向け顧客紹介サービス",
    "AI マッチングシステムの開発・運営",
    "税務・会計業界向けマーケティング支援",
  ],
  mission:  "全国の税理士事務所の成長に、コミットする。",
  vision:   "紹介依存から脱却し、すべての事務所が能動的に顧客を選べる業界へ。",
}

// ── ハイライト数字 (トップに掲載する主要 KPI) ────────────────
export interface KeyMetric {
  label:  string
  value:  string
  unit?:  string
  note?:  string
}

export const keyMetrics: KeyMetric[] = [
  {
    label:  "提携事務所数",
    value:  "2,000",
    unit:   "事務所以上",
    note:   "全国 47 都道府県",
  },
  {
    label:  "月間マッチング件数",
    value:  "3,500",
    unit:   "件以上",
    note:   "うち約 1,000 件が顧問契約へ",
  },
  {
    label:  "見込み顧客リスト",
    value:  "40万",
    unit:   "件以上",
    note:   "アウトバウンド対象の潜在層",
  },
  {
    label:  "日次アプローチ件数",
    value:  "2万",
    unit:   "件／日",
    note:   "オペレーター × AI による接触数",
  },
]
