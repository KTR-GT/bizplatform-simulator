"use client"

import { useState } from "react"
import {
  Hammer, Store, UtensilsCrossed, Factory,
  Cpu, Building2, HeartPulse, Truck,
  CheckCircle2, ArrowRight,
  type LucideIcon,
} from "lucide-react"
import type { DiagnosisFlow } from "@/hooks/use-diagnosis-flow"
import { buildReasons, buildNearMissComment } from "@/lib/matching/reveal-copy"
import type { ScoredCustomer } from "@/lib/matching/select"

// ============================================================
// ACT 4 — REVEAL (メイン3社フルスクリーン + ニアミス2社)
// ============================================================

interface Props {
  flow: DiagnosisFlow
}

const INDUSTRY_ICON: Record<string, LucideIcon> = {
  建設: Hammer,
  小売: Store,
  飲食: UtensilsCrossed,
  製造: Factory,
  IT: Cpu,
  不動産: Building2,
  医療福祉: HeartPulse,
  運輸: Truck,
}

const URGENCY_BADGE: Record<string, { label: string; color: string }> = {
  高: { label: "緊急度：高", color: "bg-red-500/15 text-red-300 border-red-500/30" },
  中: { label: "緊急度：中", color: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30" },
  低: { label: "緊急度：低", color: "bg-white/8 text-white/50 border-white/15" },
}

function revenueLabel(revenue: number): string {
  if (revenue >= 10000) return `${(revenue / 10000).toFixed(1)}億円`
  return `${revenue.toLocaleString()}万円`
}

// ─── ボタン: hover で矢印アイコンが右へ ───
function NextButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      data-cursor
      onClick={onClick}
      className="group flex items-center justify-center gap-3 w-full py-4 bg-white text-black font-bold rounded-xl text-sm hover:bg-white/90 transition-colors"
    >
      {label}
      <ArrowRight
        size={16}
        strokeWidth={2.5}
        className="transition-transform duration-200 group-hover:translate-x-1.5"
      />
    </button>
  )
}

// ─── メインカード ───
function MainCard({ scored, index, total, onNext, onFinish }: {
  scored: ScoredCustomer
  index: number
  total: number
  onNext: () => void
  onFinish: () => void
}) {
  const { customer, breakdown } = scored
  const reasons = buildReasons(breakdown, customer)
  const Icon = INDUSTRY_ICON[customer.industry] ?? Cpu

  return (
    <div
      data-dark-bg
      className="min-h-screen bg-[#0a0a0a] flex flex-col px-5 py-8 md:py-10 mx-auto w-full"
      style={{ maxWidth: "1100px" }}
    >
      {/* ── ヘッダー: Match n/n + Score (右上) ── */}
      <div className="flex items-center justify-between mb-7">
        <span className="text-white/35 text-[11px] tracking-[0.3em] uppercase">
          Match {index + 1} / {total}
        </span>
        <span className="text-white/25 text-[11px] tabular-nums">
          Score {breakdown.total} / 100
        </span>
      </div>

      {/* ── 2カラムグリッド ── */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_2fr] md:gap-12 mb-7">

        {/* ━━ 左カラム ━━ */}
        <div className="flex flex-col mb-8 md:mb-0">

          {/* (a) アイコン + メタタグ群 */}
          <div className="flex md:flex-col gap-4 md:gap-5 mb-5 md:mb-6">
            {/* アイコン */}
            <div className="flex-shrink-0 flex items-start md:items-center">
              <Icon
                strokeWidth={1.25}
                className="text-white"
                style={{ width: "clamp(40px,6vw,56px)", height: "clamp(40px,6vw,56px)" }}
              />
            </div>

            {/* タグ群 */}
            <div className="flex flex-wrap gap-1.5 items-start content-start">
              {/* 業種 */}
              <span className="text-white/55 text-[11px] border border-white/20 rounded-full px-2.5 py-0.5">
                {customer.industry}
              </span>
              {/* 緊急度 */}
              <span className={`text-[11px] border rounded-full px-2.5 py-0.5 ${URGENCY_BADGE[customer.urgency].color}`}>
                {URGENCY_BADGE[customer.urgency].label}
              </span>
              {/* 法人/個人 */}
              <span className="text-white/35 text-[11px] border border-white/10 rounded-full px-2.5 py-0.5">
                {customer.customerType}
              </span>
              {/* エリア */}
              <span className="text-white/35 text-[11px] border border-white/10 rounded-full px-2.5 py-0.5">
                {customer.region}
              </span>
              {/* 都道府県 */}
              <span className="text-white/25 text-[11px] border border-white/8 rounded-full px-2.5 py-0.5">
                {customer.prefecture}
              </span>
            </div>
          </div>

          {/* (b) 区切り線 */}
          <div className="border-t border-white/10 mb-5 md:mb-6" />

          {/* (c) 月額顧問料 — 主役 */}
          <div>
            <p className="text-white/35 text-[10px] tracking-widest uppercase mb-2">
              想定月額顧問料
            </p>
            <p
              className="font-serif-display text-white leading-none mb-3"
              style={{ fontSize: "clamp(38px, 5vw, 54px)" }}
            >
              ¥{customer.monthlyFeeTypical.toLocaleString()}
            </p>
            <p className="text-white/35 text-xs leading-relaxed">
              年商 {revenueLabel(customer.revenue)}<br />
              従業員 {customer.employees}名 · 創業 {customer.foundedYears}年
            </p>
          </div>
        </div>

        {/* ━━ 右カラム ━━ */}
        <div className="flex flex-col">
          {/* 顧客名 */}
          <h2
            className="text-white font-bold leading-tight mb-3"
            style={{ fontSize: "clamp(26px, 4vw, 50px)" }}
          >
            {customer.displayName}
          </h2>

          {/* voice 引用 */}
          <p
            className="text-white/65 italic border-l-2 border-white/20 pl-4 leading-relaxed mb-7"
            style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}
          >
            「{customer.voice}」
          </p>

          {/* story */}
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            {customer.story}
          </p>

          {/* Why it matches */}
          <div>
            <p className="text-white/25 text-[10px] tracking-[0.25em] uppercase mb-4">
              Why it matches
            </p>
            <ul className="space-y-3.5">
              {reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.75}
                    className="text-white/50 flex-shrink-0 mt-[2px]"
                  />
                  <div className="leading-snug">
                    <span className="text-white text-sm">{r.label}</span>
                    {r.detail && (
                      <span className="text-white/35 text-xs ml-2">{r.detail}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── ボタン: 両カラム下部中央 ── */}
      <div className="w-full md:max-w-xs md:mx-auto">
        {index + 1 < total ? (
          <NextButton label="次のマッチを見る" onClick={onNext} />
        ) : (
          <NextButton label="他の候補も見る" onClick={onFinish} />
        )}
      </div>
    </div>
  )
}

// ─── ニアミスセクション ───
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
      <p className="text-white/35 text-[11px] tracking-[0.3em] uppercase mb-5">Near Miss</p>
      <h2
        className="text-white font-bold mb-3"
        style={{ fontSize: "clamp(20px, 3.5vw, 30px)" }}
      >
        他にも、こんな出会いがあります
      </h2>
      <p className="text-white/45 text-sm mb-8">
        条件が少し違いますが、可能性のある候補です。
      </p>

      {/* md以上で横 2列 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {nearMiss.map(({ customer, breakdown }) => {
          const Icon = INDUSTRY_ICON[customer.industry] ?? Cpu
          return (
            <div
              key={customer.id}
              className="border border-white/10 rounded-xl p-5 bg-white/[0.02] flex flex-col gap-3"
            >
              {/* アイコン + バッジ */}
              <div className="flex items-center gap-3 flex-wrap">
                <Icon size={20} strokeWidth={1.5} className="text-white/60 flex-shrink-0" />
                <span className="text-white/40 text-[11px] border border-white/15 rounded-full px-2 py-0.5">
                  {customer.industry}
                </span>
                <span className={`text-[11px] border rounded-full px-2 py-0.5 ${URGENCY_BADGE[customer.urgency].color}`}>
                  {URGENCY_BADGE[customer.urgency].label}
                </span>
              </div>

              {/* 顧客名 + voice */}
              <div>
                <p className="text-white font-bold text-base leading-tight mb-1">
                  {customer.displayName}
                </p>
                <p className="text-white/45 text-sm italic">「{customer.voice}」</p>
              </div>

              {/* スコア + エリア */}
              <p className="text-white/30 text-[11px]">
                Score {breakdown.total} / 100 · {customer.region} · {customer.customerType}
              </p>

              {/* コメント */}
              <p className="text-white/50 text-xs border-l border-white/15 pl-3 leading-relaxed">
                {buildNearMissComment(mainCustomers, customer)}
              </p>
            </div>
          )
        })}
      </div>

      {/* サマリー + CTA */}
      <div className="mt-auto text-center">
        <p className="text-white/40 text-sm mb-6">
          計 {main.length + nearMiss.length} 件のマッチ候補が見つかりました
        </p>
        <div className="w-full md:max-w-xs md:mx-auto">
          <NextButton label="Zoom 相談を予約する" onClick={() => flow.goToAct(5)} />
        </div>
      </div>
    </div>
  )
}

// ─── エクスポート ───
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
