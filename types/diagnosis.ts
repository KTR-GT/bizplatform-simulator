// ============================================================
// DIAGNOSIS (② AI診断 顧客マッチング) - 型定義
// ============================================================

/** 幕番号（1=Prologue, 2=Hearing, 3=Analyzing, 4=Reveal, 5=Booking） */
export type Act = 1 | 2 | 3 | 4 | 5

/** 事務所のフェーズ（Q1） */
export type OfficePhase = "opening" | "expanding" | "stable" | "next"

export const OFFICE_PHASE_LABELS: Record<OfficePhase, string> = {
  opening:   "開業初期",
  expanding: "拡大期",
  stable:    "安定期",
  next:      "次の一手を探している",
}

/** 得意テーマ（Q2 / 顧客 themes） */
export type Theme =
  | "節税"
  | "融資"
  | "法人化"
  | "事業承継"
  | "インボイス"
  | "記帳代行"
  | "補助金"
  | "原価管理"
  | "給与"
  | "青色申告"
  | "多店舗"
  | "資金調達"

/** Q2 で先生に提示するテーマ（コアのみ） */
export const THEME_OPTIONS_FOR_HEARING: Theme[] = [
  "節税",
  "融資",
  "法人化",
  "事業承継",
  "インボイス",
  "記帳代行",
]

/** 業種（Q3 / 顧客 industry） */
export type Industry =
  | "建設"
  | "小売"
  | "飲食"
  | "製造"
  | "IT"
  | "不動産"
  | "医療福祉"
  | "運輸"

export const INDUSTRY_OPTIONS: Industry[] = [
  "建設", "小売", "飲食", "製造", "IT", "不動産", "医療福祉", "運輸",
]

/** 対応エリア（Q4 / 顧客 region） */
export type Region =
  | "全国"
  | "関東"
  | "関西"
  | "東海"
  | "北海道・東北"
  | "中国・四国"
  | "九州・沖縄"

export const REGION_OPTIONS: Region[] = [
  "全国", "関東", "関西", "東海", "北海道・東北", "中国・四国", "九州・沖縄",
]

/** 対応可能な関与スタイル（Q5・複数選択） */
export type EngagementStyle =
  | "monthly-visit"      // 月次訪問・伴走型
  | "cloud-complete"     // クラウド完結・効率重視
  | "full-delegation"    // 丸投げOK・記帳代行込み
  | "spot-only"          // スポット対応・確定申告のみOK
  | "undefined-need"     // ニーズが固まっていない顧客OK
  | "switching"          // 切替案件OK・引継ぎ対応OK

export const ENGAGEMENT_STYLE_LABELS: Record<EngagementStyle, string> = {
  "monthly-visit":     "月次訪問・伴走型",
  "cloud-complete":    "クラウド完結・効率重視",
  "full-delegation":   "丸投げOK・記帳代行込み",
  "spot-only":         "スポット対応・確定申告のみOK",
  "undefined-need":    "ニーズが固まっていない顧客OK",
  "switching":         "切替案件OK・引継ぎ対応OK",
}

export const ENGAGEMENT_STYLE_OPTIONS: EngagementStyle[] = [
  "monthly-visit",
  "cloud-complete",
  "full-delegation",
  "spot-only",
  "undefined-need",
  "switching",
]

/**
 * ヒアリング 5 問 + 任意 Q6 の回答スキーマ
 *
 * - themes が空配列 → 「幅広く」を選択したと解釈
 * - industries が空配列 → 「特になし」を選択したと解釈
 * - areas は最低 1 つ必須（バリデーションは UI 側）
 */
export interface DiagnosisAnswers {
  phase:            OfficePhase | null
  themes:           Theme[]
  industries:       Industry[]
  areas:            Region[]
  engagementStyles: EngagementStyle[]
  identity:         string
}

/** ヒアリング初期値 */
export const INITIAL_ANSWERS: DiagnosisAnswers = {
  phase:            null,
  themes:           [],
  industries:       [],
  areas:            [],
  engagementStyles: [],
  identity:         "",
}

/** 質問番号（0=Q1, 1=Q2, …, 5=Q6） */
export type QuestionIndex = 0 | 1 | 2 | 3 | 4 | 5

export const TOTAL_QUESTIONS = 6

/** 質問のメタ情報（プログレスバー・スキップ可否などに利用） */
export interface QuestionMeta {
  index:       QuestionIndex
  label:       string         // "Question 1 / 6"
  title:       string         // 質問の本文
  optional:    boolean        // Q6 のみ true
}

export const QUESTION_META: QuestionMeta[] = [
  { index: 0, label: "Question 1 / 6", title: "先生の事務所は、いまどんなフェーズですか？",       optional: false },
  { index: 1, label: "Question 2 / 6", title: "強みを発揮できるテーマは？",                       optional: false },
  { index: 2, label: "Question 3 / 6", title: "強みを発揮できる業種は？",                         optional: false },
  { index: 3, label: "Question 4 / 6", title: "対応できるエリアは？",                              optional: false },
  { index: 4, label: "Question 5 / 6", title: "対応可能な関与スタイルは？",                       optional: false },
  { index: 5, label: "Question 6 / 6", title: "最後に、先生の事務所の \"らしさ\" を一言で",       optional: true  },
]
