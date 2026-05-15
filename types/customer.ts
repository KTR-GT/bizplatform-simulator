// ============================================================
// CUSTOMER TYPE — Phase 2A マッチング用顧客スキーマ
// ============================================================

export type Industry = '建設' | '小売' | '飲食' | '製造' | 'IT' | '不動産' | '医療福祉' | '運輸'
export type CustomerType = '法人' | '個人事業主'
export type AccountingStyle = '月次訪問希望' | 'クラウド完結' | '担当者任せ'
export type DigitalLevel = 'デジタル初心者' | '中程度' | 'デジタル得意'
export type Software = 'freee' | 'マネーフォワード' | '弥生' | 'TKC' | 'JDL' | 'なし'
export type Region = '関東' | '関西' | '東海' | '北海道・東北' | '中国・四国' | '九州・沖縄'
export type Urgency = '高' | '中' | '低'

export type CustomerTheme =
  | '節税' | '融資' | '法人化' | '事業承継' | 'インボイス' | '記帳代行'
  | '補助金' | '原価管理' | '給与' | '青色申告' | '多店舗' | '資金調達'

export type CustomerNeedType =
  | 'clear-theme'      // 明確なテーマあり
  | 'spot-only'        // スポット案件
  | 'full-delegation'  // 丸投げ希望
  | 'switching'        // 切り替え動機
  | 'undefined-need'   // ニーズ不明確

export type SoftwareUsage =
  | { type: 'using';         software: Software; note?: string }
  | { type: 'using-poorly';  software: Software; note: string }
  | { type: 'manual';        note: string }
  | { type: 'none';          note: string }

export type SwitchingReason =
  | 'fee-too-high'
  | 'communication-bad'
  | 'predecessor-retired'
  | 'aging-firm'
  | 'service-mismatch'

export interface Customer {
  id:               string
  archetype:        string
  displayName:      string
  industry:         Industry
  customerType:     CustomerType
  revenue:          number
  employees:        number
  foundedYears:     number
  prefecture:       string
  region:           Region
  themes:           CustomerTheme[]
  primaryTheme:     CustomerTheme
  needType:         CustomerNeedType
  desiredEngagement:
    | { type: 'specific'; styles: AccountingStyle[] }
    | { type: 'flexible' }
    | { type: 'unknown' }
  digitalLevel:     DigitalLevel
  softwareUsage:    SoftwareUsage
  switchingReason?: SwitchingReason
  monthlyFeeRange:   [number, number]
  monthlyFeeTypical: number
  spotFeeTypical?:   number  // spot-only 専用: 年額または1案件想定報酬（円）
  urgency:          Urgency
  voice:            string
  story:            string
  bookkeepingNote:  string
  weight:           number
}
