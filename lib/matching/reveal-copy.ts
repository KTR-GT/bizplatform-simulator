// ============================================================
// REVEAL COPY — スコア内訳を人語に翻訳
// ============================================================

import type { ScoreBreakdown } from "./score"
import type { Customer } from "@/types/customer"

export interface RevealReason {
  label:   string
  detail?: string
}

export function buildReasons(
  breakdown: ScoreBreakdown,
  customer: Customer,
): RevealReason[] {
  const reasons: RevealReason[] = []

  // A-1 テーマ
  if (breakdown.a1Theme >= 20) {
    reasons.push({ label: "先生の得意領域に深く合致", detail: `テーマ: ${customer.primaryTheme}` })
  } else if (breakdown.a1Theme >= 12) {
    reasons.push({ label: "テーマが重なる部分があります", detail: `主要テーマ: ${customer.primaryTheme}` })
  }

  // A-3 ニーズタイプ
  const needLabels: Record<Customer["needType"], string> = {
    "clear-theme":     "明確な相談テーマを持っています",
    "spot-only":       "スポット対応でOKな案件です",
    "full-delegation": "先生の「丸投げOK」がぴったりです",
    "switching":       "乗り換え案件・引継ぎ対応を求めています",
    "undefined-need":  "まだ要件が定まっていない顧客です",
  }
  if (breakdown.a3NeedType >= 25) {
    reasons.push({ label: needLabels[customer.needType] })
  }

  // B エリア
  if (breakdown.bArea === 30) {
    reasons.push({ label: "対応エリア内・物理的に近い" })
  } else if (breakdown.bArea === 20) {
    reasons.push({ label: "全国対応で問題なし" })
  } else if (breakdown.bArea === 18) {
    reasons.push({ label: "隣接エリア・リモート対応可能" })
  }

  // urgency
  if (customer.urgency === "高") {
    reasons.push({ label: "今すぐ動ける・緊急度が高い案件" })
  }

  return reasons.slice(0, 3)
}

export function buildNearMissComment(
  mainCustomers: Customer[],
  nearMiss: Customer,
): string {
  const diffIndustry = mainCustomers.every(m => m.industry !== nearMiss.industry)
  const diffRegion   = mainCustomers.every(m => m.region   !== nearMiss.region)
  const diffNeed     = mainCustomers.every(m => m.needType !== nearMiss.needType)

  if (diffIndustry) return `テーマは合いますが業種が異なります（${nearMiss.industry}）`
  if (diffRegion)   return `条件は近いですがエリアが異なります（${nearMiss.region}）`
  if (diffNeed)     return `ニーズタイプが少し異なるケースです`
  return "もう一歩でマッチの惜しい案件です"
}

// spot-only 顧客の報酬表示ラベルを生成
export function buildSpotFeeLabel(customer: Customer): { label: string; sub: string } {
  const fee = customer.spotFeeTypical ?? 80000
  if (fee >= 100000) {
    return {
      label: `年額 ¥${fee.toLocaleString()}`,
      sub:   "申告・決算スポット",
    }
  }
  return {
    label: `¥${fee.toLocaleString()}`,
    sub:   "1案件あたり想定",
  }
}
