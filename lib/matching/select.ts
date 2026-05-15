// ============================================================
// SELECTION ENGINE — メイン3社 + ニアミス2社
// ============================================================

import type { Customer } from "@/types/customer"
import type { DiagnosisAnswers } from "@/types/diagnosis"
import { scoreCustomer, type ScoreBreakdown } from "./score"

export interface ScoredCustomer {
  customer:  Customer
  breakdown: ScoreBreakdown
}

export interface MatchResult {
  main:    ScoredCustomer[]   // 3件
  nearMiss: ScoredCustomer[]  // 2件
  seed:    number
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

const URGENCY_ORDER: Record<Customer["urgency"], number> = { 高: 3, 中: 2, 低: 1 }

function tiebreak(a: ScoredCustomer, b: ScoredCustomer, rand: () => number): number {
  const scoreDiff = b.breakdown.total - a.breakdown.total
  if (scoreDiff !== 0) return scoreDiff
  const urgencyDiff = URGENCY_ORDER[b.customer.urgency] - URGENCY_ORDER[a.customer.urgency]
  if (urgencyDiff !== 0) return urgencyDiff
  return rand() - 0.5
}

export function selectMatches(
  customers: Customer[],
  answers: DiagnosisAnswers,
  seed?: number,
): MatchResult {
  const usedSeed = seed ?? (Date.now() ^ Math.floor(Math.random() * 0xffff))
  const rand = seededRandom(usedSeed)

  // Step1: ハード除外なし（設計書では NG業種はフィルタ対象だが診断では選択不可のため全通過）

  // Step2: 全件スコア計算
  const scored: ScoredCustomer[] = customers.map(c => ({
    customer:  c,
    breakdown: scoreCustomer(c, answers),
  }))

  // Step3: 上位30%候補プール
  const sorted = [...scored].sort((a, b) => tiebreak(a, b, seededRandom(usedSeed)))
  const poolSize = Math.ceil(sorted.length * 0.3)
  const pool = sorted.slice(0, poolSize)

  // Step4: メイン3社
  const main: ScoredCustomer[] = []
  const rand2 = seededRandom(usedSeed + 1)

  // 1社目: 最高スコア
  const first = pool[0]
  main.push(first)

  // 2社目: 1社目と industry または region が異なる中で最高
  const second = pool.find(
    s => s.customer.industry !== first.customer.industry ||
         s.customer.region   !== first.customer.region
  ) ?? pool[1]
  if (second && second !== first) main.push(second)

  // 3社目: urgency=高 優先
  const used2 = new Set(main.map(s => s.customer.id))
  const urgentCandidates = pool.filter(s => !used2.has(s.customer.id) && s.customer.urgency === "高")
  const third = urgentCandidates[0]
    ?? pool.find(s => !used2.has(s.customer.id))
  if (third) main.push(third)

  // Step5: ニアミス2社（スコア50-79）
  const mainIds = new Set(main.map(s => s.customer.id))
  const nearMissCandidates = scored
    .filter(s => !mainIds.has(s.customer.id) && s.breakdown.total >= 50 && s.breakdown.total <= 79)
    .sort((a, b) => tiebreak(a, b, rand2))

  const nearMiss: ScoredCustomer[] = []
  for (const candidate of nearMissCandidates) {
    if (nearMiss.length >= 2) break
    const differsFrom = [...main, ...nearMiss].some(
      existing =>
        existing.customer.industry !== candidate.customer.industry ||
        existing.customer.region   !== candidate.customer.region   ||
        existing.customer.needType !== candidate.customer.needType,
    )
    if (differsFrom) nearMiss.push(candidate)
  }

  // 足りない場合は多様性条件を緩めて補充
  if (nearMiss.length < 2) {
    for (const candidate of nearMissCandidates) {
      if (nearMiss.length >= 2) break
      const alreadyIn = new Set([...main, ...nearMiss].map(s => s.customer.id))
      if (!alreadyIn.has(candidate.customer.id)) nearMiss.push(candidate)
    }
  }

  return { main: main.slice(0, 3), nearMiss: nearMiss.slice(0, 2), seed: usedSeed }
}
