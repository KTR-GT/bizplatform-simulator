// ============================================================
// SCORING ENGINE — 4軸100点満点
// ============================================================
// A. 業務適合性 65点 (A-1 テーマ25 + A-2 業種15 + A-3 ニーズ25)
// B. エリア整合性 30点
// C. ソフト補助 5点

import type { Customer, CustomerTheme, Industry, Region } from "@/types/customer"
import type { DiagnosisAnswers, EngagementStyle } from "@/types/diagnosis"

// needType ↔ engagementStyle のマッピング
const NEED_TYPE_TO_ENGAGEMENT: Record<Customer["needType"], EngagementStyle> = {
  "clear-theme":     "monthly-visit",   // 明確テーマ → 伴走型
  "spot-only":       "spot-only",
  "full-delegation": "full-delegation",
  "switching":       "switching",
  "undefined-need":  "undefined-need",
}

// 隣接エリア定義
const ADJACENT_REGIONS: Record<Region, Region[]> = {
  "関東":       ["東海", "北海道・東北"],
  "関西":       ["東海", "中国・四国"],
  "東海":       ["関東", "関西"],
  "北海道・東北": ["関東"],
  "中国・四国": ["関西", "九州・沖縄"],
  "九州・沖縄": ["中国・四国"],
}

export interface ScoreBreakdown {
  a1Theme:      number  // 0-25
  a2Industry:   number  // 0-15
  a3NeedType:   number  // 0-25
  bArea:        number  // 0-30
  cSoftware:    number  // 0-5
  total:        number  // 0-100
}

export function scoreCustomer(
  customer: Customer,
  answers: DiagnosisAnswers,
): ScoreBreakdown {
  // ── A-1: テーマ一致 (0-25) ──
  let a1Theme = 0
  const teacherThemes = answers.themes as CustomerTheme[]
  const wideMode = teacherThemes.length === 0

  if (wideMode) {
    a1Theme = 12 // 「幅広く」中央値
  } else {
    const overlap = customer.themes.filter(t => teacherThemes.includes(t)).length
    a1Theme = Math.min(overlap * 10, 25)
    if (teacherThemes.includes(customer.primaryTheme)) {
      a1Theme = Math.min(a1Theme + 3, 25)
    }
  }

  // ── A-2: 業種一致 (0-15) ──
  let a2Industry = 0
  const teacherIndustries = answers.industries as Industry[]
  const anyIndustry = teacherIndustries.length === 0

  if (anyIndustry) {
    a2Industry = 7 // 「特になし」中央値
  } else if (teacherIndustries.includes(customer.industry)) {
    a2Industry = 15
  }

  // ── A-3: ニーズタイプ受け皿 (0-25) ──
  let a3NeedType = 0
  const requiredStyle = NEED_TYPE_TO_ENGAGEMENT[customer.needType]
  if (answers.engagementStyles.includes(requiredStyle)) {
    a3NeedType = 25
  } else if (answers.engagementStyles.length === 0) {
    a3NeedType = 10 // 未選択時の中央値
  }

  // ── B: エリア整合性 (0-30) ──
  let bArea = 0
  const teacherAreas = answers.areas as Region[]

  if (teacherAreas.includes("全国" as Region)) {
    bArea = 20
  } else if (teacherAreas.includes(customer.region)) {
    bArea = 30
  } else {
    const adjacent = ADJACENT_REGIONS[customer.region] ?? []
    if (teacherAreas.some(a => adjacent.includes(a))) {
      bArea = 18
    }
  }

  // ── C: ソフト補助 (0-5) ──
  let cSoftware = 0
  if (customer.softwareUsage.type === "using") {
    // 先生が同じソフトに対応しているかは診断では聞いていないので常に+5 (将来拡張用)
    cSoftware = 5
  }

  const total = a1Theme + a2Industry + a3NeedType + bArea + cSoftware

  return { a1Theme, a2Industry, a3NeedType, bArea, cSoftware, total }
}
