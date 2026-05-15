"use client"

import { useState } from "react"
import type { DiagnosisFlow } from "@/hooks/use-diagnosis-flow"
import { buildReasons, buildNearMissComment } from "@/lib/matching/reveal-copy"
import type { ScoredCustomer } from "@/lib/matching/select"

// ============================================================
// ACT 4 — REVEAL (メイン3社フルスクリーン + ニアミス2社)
// ============================================================

interface Props {
  flow: DiagnosisFlow
}

const URGENCY_BADGE: Record<string, { label: string; color: string }> = {
  高: { label: "🔥 緊急度：高",   color: "bg-red-500/20 text-red-300 border-red-500/30" },
  中: { label: "📋 緊急度：中",   color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  低: { label: "📅 緊急度：低",   color: "bg-white/10 text-white/60 border-white/20" },
}

function MainCard({ scored, index, total, onNext, onFinish }: {
  scored: ScoredCustomer
  index: number
  total: number
  onNext: () => void
  onFinish: () => void
}) {
  const { customer, breakdown } = scored
  const reasons = buildReasons(breakdown, customer)

  return (
    <div
      data-dark-bg
      className="min-h-screen bg-[#0a0a0a] flex flex-col px-6 py-12 md:py-16 max-w-2xl mx-auto"
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-white/40 text-xs tracking-[0.3em] uppercase">
          Match {index + 1} / {total}
        </span>
        <span className="text-white/30 text-xs">
          Score {breakdown.total} / 100
        </span>
      </div>

      {/* 業種 + 緊急度バッジ */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-white/50 text-sm border border-white/20 rounded-full px-3 py-1">
          {customer.industry}
        </span>
        <span className={`text-xs border rounded-full px-3 py-1 ${URGENCY_BADGE[customer.urgency].color}`}>
          {URGENCY_BADGE[customer.urgency].label}
        </span>
        <span className="text-white/40 text-xs">
          {customer.customerType} · {customer.region}
        </span>
      </div>

      {/* displayName + voice */}
      <h2
        className="text-white font-bold mb-4"
        style={{ fontSize: "clamp(26px, 5vw, 48px)", lineHeight: 1.25 }}
      >
        {customer.displayName}
      </h2>
      <p className="text-white/70 text-lg italic mb-8 border-l-2 border-white/20 pl-4">
        「{customer.voice}」
      </p>

      {/* story */}
      <p className="text-white/60 text-sm leading-relaxed mb-8">
        {customer.story}
      </p>

      {/* マッチング理由 */}
      <div className="mb-8">
        <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
          Why it matches
        </p>
        <ul className="space-y-3">
          {reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0" />
              <div>
                <span className="text-white text-sm">{r.label}</span>
                {r.detail && (
                  <span className="text-white/40 text-xs ml-2">{r.detail}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 経済情報 */}
      <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
        <p className="text-white/40 text-xs mb-2">想定月額顧問料</p>
        <p className="text-white font-bold text-xl">
          ¥{customer.monthlyFeeTypical.toLocaleString()}
          <span className="text-white/40 text-sm font-normal ml-2">
            （年商 {(customer.revenue / 100).toFixed(0) === "0" ? customer.revenue : customer.revenue >= 10000 ? `${(customer.revenue / 10000).toFixed(1)}億` : `${customer.revenue}万`}円 / 従業員 {customer.employees}名）
          </span>
        </p>
      </div>

      {/* 次へボタン */}
      <div className="mt-auto">
        {index + 1 < total ? (
          <button
            data-cursor
            onClick={onNext}
            className="w-full py-4 bg-white text-black font-bold rounded-xl text-sm hover:bg-white/90 transition-colors"
          >
            次のマッチを見る →
          </button>
        ) : (
          <button
            data-cursor
            onClick={onFinish}
            className="w-full py-4 bg-white text-black font-bold rounded-xl text-sm hover:bg-white/90 transition-colors"
          >
            他の候補も見る →
          </button>
        )}
      </div>
    </div>
  )
}

function NearMissSection({ flow, nearMiss, main }: {
  flow: DiagnosisFlow
  nearMiss: ScoredCustomer[]
  main: ScoredCustomer[]
}) {
  const mainCustomers = main.map(s => s.customer)

  return (
    <div
      data-dark-bg
      className="min-h-screen bg-[#0a0a0a] px-6 py-12 md:py-16 max-w-2xl mx-auto flex flex-col"
    >
      <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-6">Near Miss</p>
      <h2
        className="text-white font-bold mb-4"
        style={{ fontSize: "clamp(20px, 3.5vw, 32px)" }}
      >
        他にも、こんな出会いがあります
      </h2>
      <p className="text-white/50 text-sm mb-10">
        条件が少し違いますが、可能性のある候補です。
      </p>

      <div className="space-y-4 mb-10">
        {nearMiss.map(({ customer, breakdown }) => (
          <div
            key={customer.id}
            className="border border-white/10 rounded-xl p-5 bg-white/3"
          >
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-white/40 text-xs border border-white/20 rounded-full px-2 py-0.5">
                {customer.industry}
              </span>
              <span className={`text-xs border rounded-full px-2 py-0.5 ${URGENCY_BADGE[customer.urgency].color}`}>
                {URGENCY_BADGE[customer.urgency].label}
              </span>
            </div>
            <p className="text-white font-bold text-lg mb-1">{customer.displayName}</p>
            <p className="text-white/50 text-sm italic mb-3">「{customer.voice}」</p>
            <p className="text-white/40 text-xs mb-3">
              スコア {breakdown.total} / 100 · {customer.region}
            </p>
            <p className="text-white/60 text-xs border-l border-white/20 pl-3">
              {buildNearMissComment(mainCustomers, customer)}
            </p>
          </div>
        ))}
      </div>

      {/* サマリー + CTA */}
      <div className="mt-auto text-center">
        <p className="text-white/60 text-sm mb-6">
          計 {main.length + nearMiss.length} 件のマッチ候補が見つかりました
        </p>
        <button
          data-cursor
          onClick={() => flow.goToAct(5)}
          className="w-full py-4 bg-white text-black font-bold rounded-xl text-sm hover:bg-white/90 transition-colors"
        >
          Zoom 相談を予約する →
        </button>
      </div>
    </div>
  )
}

export function Act4Reveal({ flow }: Props) {
  const [cardIndex, setCardIndex] = useState(0)
  const [showNearMiss, setShowNearMiss] = useState(false)

  const result = flow.matchResult
  if (!result) {
    // マッチング結果が未設定（直接アクセス等）
    return (
      <div
        data-dark-bg
        className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"
      >
        <p className="text-white/40">データを取得中...</p>
      </div>
    )
  }

  const { main, nearMiss } = result

  if (showNearMiss) {
    return <NearMissSection flow={flow} nearMiss={nearMiss} main={main} />
  }

  return (
    <MainCard
      key={cardIndex}
      scored={main[cardIndex]}
      index={cardIndex}
      total={main.length}
      onNext={() => setCardIndex(i => i + 1)}
      onFinish={() => setShowNearMiss(true)}
    />
  )
}
