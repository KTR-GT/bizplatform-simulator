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
  高: { label: "🔥 緊急度：高", color: "bg-red-500/20 text-red-300 border-red-500/30" },
  中: { label: "📋 緊急度：中", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  低: { label: "📅 緊急度：低", color: "bg-white/10 text-white/60 border-white/20" },
}

// 業種絵文字マップ
const INDUSTRY_ICON: Record<string, string> = {
  建設: "🏗️", 小売: "🛍️", 飲食: "🍽️", 製造: "🏭",
  IT: "💻", 不動産: "🏢", 医療福祉: "🏥", 運輸: "🚚",
}

function revenueLabel(revenue: number): string {
  if (revenue >= 10000) return `${(revenue / 10000).toFixed(1)}億円`
  return `${revenue}万円`
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
  const icon = INDUSTRY_ICON[customer.industry] ?? "📋"

  return (
    // 外枠: min-h-screen, max-w を 1100px に拡大、縦 flex でボタンを最下部に固定
    <div
      data-dark-bg
      className="min-h-screen bg-[#0a0a0a] flex flex-col px-5 py-8 md:py-10 mx-auto w-full"
      style={{ maxWidth: "1100px" }}
    >
      {/* ── ヘッダー行 ── */}
      <div className="flex items-center justify-between mb-6 md:mb-7">
        <span className="text-white/40 text-xs tracking-[0.3em] uppercase">
          Match {index + 1} / {total}
        </span>
        <span className="text-white/30 text-xs">
          Score {breakdown.total} / 100
        </span>
      </div>

      {/* ── 2カラムグリッド (md以上) ── */}
      <div className="flex-1 flex flex-col md:grid md:grid-cols-[1fr_2fr] md:gap-10 mb-6 md:mb-8">

        {/* ━━ 左カラム ━━ */}
        <div className="flex flex-col mb-6 md:mb-0">
          {/* 業種アイコン 特大 */}
          <div
            className="hidden md:flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] mb-6"
            style={{ aspectRatio: "1/1", maxHeight: "200px" }}
          >
            <span style={{ fontSize: "clamp(56px, 8vw, 80px)" }}>{icon}</span>
          </div>

          {/* バッジ群 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* モバイルでは業種アイコン小さく inline 表示 */}
            <span className="md:hidden text-xl">{icon}</span>
            <span className="text-white/50 text-xs border border-white/20 rounded-full px-3 py-1">
              {customer.industry}
            </span>
            <span className={`text-xs border rounded-full px-3 py-1 ${URGENCY_BADGE[customer.urgency].color}`}>
              {URGENCY_BADGE[customer.urgency].label}
            </span>
          </div>

          {/* タグ: 顧客タイプ・エリア・needType */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-white/40 text-xs border border-white/10 rounded-full px-2.5 py-0.5">
              {customer.customerType}
            </span>
            <span className="text-white/40 text-xs border border-white/10 rounded-full px-2.5 py-0.5">
              {customer.region}
            </span>
            <span className="text-white/40 text-xs border border-white/10 rounded-full px-2.5 py-0.5">
              {customer.prefecture}
            </span>
          </div>

          {/* 想定月額顧問料 */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-white/40 text-xs mb-2">想定月額顧問料</p>
            <p className="text-white font-bold text-xl mb-1">
              ¥{customer.monthlyFeeTypical.toLocaleString()}
            </p>
            <p className="text-white/40 text-xs leading-relaxed">
              年商 {revenueLabel(customer.revenue)}<br />
              従業員 {customer.employees}名 · 創業 {customer.foundedYears}年
            </p>
          </div>
        </div>

        {/* ━━ 右カラム ━━ */}
        <div className="flex flex-col">
          {/* 顧客名 */}
          <h2
            className="text-white font-bold mb-4"
            style={{ fontSize: "clamp(26px, 4vw, 52px)", lineHeight: 1.2 }}
          >
            {customer.displayName}
          </h2>

          {/* voice 引用 */}
          <p
            className="text-white/70 italic mb-5 border-l-2 border-white/20 pl-4 leading-relaxed"
            style={{ fontSize: "clamp(15px, 2vw, 19px)" }}
          >
            「{customer.voice}」
          </p>

          {/* story */}
          <p className="text-white/55 text-sm leading-relaxed mb-8">
            {customer.story}
          </p>

          {/* Why it matches */}
          <div>
            <p className="text-white/35 text-[10px] tracking-[0.25em] uppercase mb-4">
              Why it matches
            </p>
            <ul className="space-y-4">
              {reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white mt-[6px] flex-shrink-0" />
                  <div>
                    <span className="text-white text-sm leading-snug">{r.label}</span>
                    {r.detail && (
                      <span className="text-white/40 text-xs ml-2">{r.detail}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── ボタン: 両カラム下部中央 ── */}
      <div className="w-full md:max-w-sm md:mx-auto">
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
      className="min-h-screen bg-[#0a0a0a] px-5 py-10 mx-auto w-full flex flex-col"
      style={{ maxWidth: "1100px" }}
    >
      <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-5">Near Miss</p>
      <h2
        className="text-white font-bold mb-3"
        style={{ fontSize: "clamp(20px, 3.5vw, 32px)" }}
      >
        他にも、こんな出会いがあります
      </h2>
      <p className="text-white/50 text-sm mb-8">
        条件が少し違いますが、可能性のある候補です。
      </p>

      {/* ニアミスカード: md以上で横 2列 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {nearMiss.map(({ customer, breakdown }) => (
          <div
            key={customer.id}
            className="border border-white/10 rounded-xl p-5 bg-white/[0.02] flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg">{INDUSTRY_ICON[customer.industry] ?? "📋"}</span>
              <span className="text-white/40 text-xs border border-white/20 rounded-full px-2 py-0.5">
                {customer.industry}
              </span>
              <span className={`text-xs border rounded-full px-2 py-0.5 ${URGENCY_BADGE[customer.urgency].color}`}>
                {URGENCY_BADGE[customer.urgency].label}
              </span>
            </div>

            <div>
              <p className="text-white font-bold text-lg leading-tight mb-1">
                {customer.displayName}
              </p>
              <p className="text-white/50 text-sm italic">「{customer.voice}」</p>
            </div>

            <p className="text-white/40 text-xs">
              スコア {breakdown.total} / 100 · {customer.region} · {customer.customerType}
            </p>

            <p className="text-white/55 text-xs border-l border-white/20 pl-3 leading-relaxed">
              {buildNearMissComment(mainCustomers, customer)}
            </p>
          </div>
        ))}
      </div>

      {/* サマリー + CTA */}
      <div className="mt-auto text-center">
        <p className="text-white/50 text-sm mb-6">
          計 {main.length + nearMiss.length} 件のマッチ候補が見つかりました
        </p>
        <button
          data-cursor
          onClick={() => flow.goToAct(5)}
          className="w-full md:max-w-sm md:mx-auto block py-4 bg-white text-black font-bold rounded-xl text-sm hover:bg-white/90 transition-colors"
        >
          Zoom 相談を予約する →
        </button>
      </div>
    </div>
  )
}

export function Act4Reveal({ flow }: Props) {
  const [cardIndex,    setCardIndex]    = useState(0)
  const [showNearMiss, setShowNearMiss] = useState(false)

  const result = flow.matchResult
  if (!result) {
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
