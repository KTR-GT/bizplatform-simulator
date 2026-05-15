"use client"

import { useState } from "react"
import {
  Hammer, Store, UtensilsCrossed, Factory,
  Cpu, Building2, HeartPulse, Truck,
  CheckCircle2, ArrowRight,
  type LucideIcon,
} from "lucide-react"
import type { DiagnosisFlow } from "@/hooks/use-diagnosis-flow"
import { buildReasons, buildNearMissComment, buildSpotFeeLabel } from "@/lib/matching/reveal-copy"
import type { ScoredCustomer } from "@/lib/matching/select"

// ============================================================
// ACT 4 — REVEAL (メイン3社フルスクリーン + ニアミス2社)
// ============================================================

interface Props { flow: DiagnosisFlow }

const INDUSTRY_ICON: Record<string, LucideIcon> = {
  建設: Hammer, 小売: Store, 飲食: UtensilsCrossed, 製造: Factory,
  IT: Cpu, 不動産: Building2, 医療福祉: HeartPulse, 運輸: Truck,
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

function NextButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      data-cursor
      onClick={onClick}
      className="group flex items-center justify-center gap-3 w-full bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors"
      style={{ padding: "16px 32px", fontSize: "clamp(13px, 1vw, 16px)" }}
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
    // 外枠: 100vh・縦中央寄せ・max-width 拡大
    <div
      data-dark-bg
      className="bg-[#0a0a0a] flex flex-col w-full mx-auto"
      style={{
        minHeight: "100vh",
        maxWidth: "1600px",
        padding: "40px clamp(24px, 5vw, 80px) 48px",
      }}
    >
      {/* ── ヘッダー ── */}
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <span className="text-white/35 text-[11px] tracking-[0.3em] uppercase">
          Match {index + 1} / {total}
        </span>
        <span className="text-white/25 text-[11px] tabular-nums">
          Score {breakdown.total} / 100
        </span>
      </div>

      {/* ── 中央寄せラッパー: 残高さを使って縦中央配置 ── */}
      <div className="flex-1 flex flex-col justify-center gap-8">

        {/* ── 2カラムグリッド ── */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 md:gap-16 lg:gap-24 items-start">

          {/* ━━ 左カラム ━━ */}
          <div className="flex flex-col gap-0">

            {/* アイコン */}
            <div className="mb-6">
              <Icon
                strokeWidth={1.25}
                className="text-white"
                style={{ width: "clamp(40px, 5vw, 64px)", height: "clamp(40px, 5vw, 64px)" }}
              />
            </div>

            {/* タグ群 */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              <span className="text-white/55 text-[11px] border border-white/20 rounded-full px-2.5 py-0.5">
                {customer.industry}
              </span>
              <span className={`text-[11px] border rounded-full px-2.5 py-0.5 ${URGENCY_BADGE[customer.urgency].color}`}>
                {URGENCY_BADGE[customer.urgency].label}
              </span>
              {/* spot-only バッジ */}
              {customer.needType === "spot-only" && (
                <span className="text-[11px] border border-amber-400/40 bg-amber-400/10 text-amber-300 rounded-full px-2.5 py-0.5">
                  スポット案件
                </span>
              )}
              <span className="text-white/35 text-[11px] border border-white/10 rounded-full px-2.5 py-0.5">
                {customer.customerType}
              </span>
              <span className="text-white/35 text-[11px] border border-white/10 rounded-full px-2.5 py-0.5">
                {customer.region}
              </span>
              <span className="text-white/25 text-[11px] border border-white/8 rounded-full px-2.5 py-0.5">
                {customer.prefecture}
              </span>
            </div>

            {/* 区切り線 */}
            <div className="border-t border-white/10 mb-6" />

            {/* 報酬表示 — spot-only と月額で分岐 */}
            {customer.needType === "spot-only" ? (
              <div className="mb-6">
                <p className="text-white/35 text-[10px] tracking-widest uppercase mb-2">
                  {buildSpotFeeLabel(customer).sub}
                </p>
                <p
                  className="font-serif-display text-white leading-none mb-1"
                  style={{ fontSize: "clamp(40px, 4.5vw, 64px)" }}
                >
                  {buildSpotFeeLabel(customer).label}
                </p>
                <p className="text-amber-300/60 text-[11px] mt-2">
                  月額顧問契約なし・スポット対応
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-white/35 text-[10px] tracking-widest uppercase mb-2">
                  想定月額顧問料
                </p>
                <p
                  className="font-serif-display text-white leading-none mb-4"
                  style={{ fontSize: "clamp(48px, 5vw, 72px)" }}
                >
                  ¥{customer.monthlyFeeTypical.toLocaleString()}
                </p>
              </div>
            )}

            {/* 区切り線 */}
            <div className="border-t border-white/10 mb-5" />

            {/* 規模情報テーブル */}
            <table className="w-full border-collapse">
              <tbody>
                {[
                  ["年商",   revenueLabel(customer.revenue)],
                  ["従業員", `${customer.employees}名`],
                  ["創業",   `${customer.foundedYears}年目`],
                  ["エリア", customer.prefecture],
                ].map(([label, value]) => (
                  <tr key={label} className="border-b border-white/6 last:border-0">
                    <td
                      className="text-white/30 py-2 pr-4 whitespace-nowrap"
                      style={{ fontSize: "clamp(11px, 0.85vw, 13px)" }}
                    >
                      {label}
                    </td>
                    <td
                      className="text-white/70 py-2 font-medium"
                      style={{ fontSize: "clamp(12px, 0.9vw, 14px)" }}
                    >
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ━━ 右カラム ━━ */}
          <div className="flex flex-col">

            {/* 顧客名 */}
            <h2
              className="text-white font-bold leading-tight mb-3"
              style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
            >
              {customer.displayName}
            </h2>

            {/* voice 引用 — DM Serif Display */}
            <p
              className="font-serif-display text-white/65 border-l-2 border-white/20 pl-5 mb-6"
              style={{ fontSize: "clamp(20px, 2vw, 28px)", lineHeight: 1.6 }}
            >
              「{customer.voice}」
            </p>

            {/* story */}
            <p
              className="text-white/50 mb-8"
              style={{ fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: 1.7 }}
            >
              {customer.story}
            </p>

            {/* Why It Matches */}
            <div>
              <p className="text-white/25 text-[10px] tracking-[0.25em] uppercase mb-5">
                Why It Matches
              </p>
              <ul className="space-y-4">
                {reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      size={17}
                      strokeWidth={1.75}
                      className="text-white/50 flex-shrink-0 mt-[3px]"
                    />
                    <div style={{ lineHeight: 1.6 }}>
                      <span
                        className="text-white"
                        style={{ fontSize: "clamp(15px, 1.2vw, 18px)" }}
                      >
                        {r.label}
                      </span>
                      {r.detail && (
                        <span
                          className="text-white/35 ml-2"
                          style={{ fontSize: "clamp(11px, 0.85vw, 13px)" }}
                        >
                          {r.detail}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── ボタン: グリッド直下・中央 ── */}
        <div className="w-full mx-auto" style={{ maxWidth: "360px" }}>
          {index + 1 < total ? (
            <NextButton label="次のマッチを見る" onClick={onNext} />
          ) : (
            <NextButton label="他の候補も見る" onClick={onFinish} />
          )}
        </div>
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
      className="bg-[#0a0a0a] flex flex-col w-full mx-auto"
      style={{
        minHeight: "100vh",
        maxWidth: "1600px",
        padding: "48px clamp(24px, 5vw, 80px) 56px",
      }}
    >
      <p className="text-white/35 text-[11px] tracking-[0.3em] uppercase mb-5">Near Miss</p>
      <h2
        className="text-white font-bold mb-3"
        style={{ fontSize: "clamp(24px, 3vw, 36px)" }}
      >
        他にも、こんな出会いがあります
      </h2>
      <p
        className="text-white/45 mb-10"
        style={{ fontSize: "clamp(14px, 1vw, 16px)" }}
      >
        条件が少し違いますが、可能性のある候補です。
      </p>

      {/* md以上で横 2列 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        {nearMiss.map(({ customer, breakdown }) => {
          const Icon = INDUSTRY_ICON[customer.industry] ?? Cpu
          return (
            <div
              key={customer.id}
              className="border border-white/10 rounded-2xl p-6 bg-white/[0.02] flex flex-col gap-4"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <Icon size={22} strokeWidth={1.5} className="text-white/60 flex-shrink-0" />
                <span className="text-white/40 text-[11px] border border-white/15 rounded-full px-2.5 py-0.5">
                  {customer.industry}
                </span>
                <span className={`text-[11px] border rounded-full px-2.5 py-0.5 ${URGENCY_BADGE[customer.urgency].color}`}>
                  {URGENCY_BADGE[customer.urgency].label}
                </span>
                {customer.needType === "spot-only" && (
                  <span className="text-[11px] border border-amber-400/40 bg-amber-400/10 text-amber-300 rounded-full px-2.5 py-0.5">
                    スポット案件
                  </span>
                )}
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight mb-1.5">
                  {customer.displayName}
                </p>
                <p className="text-white/45 text-sm italic" style={{ lineHeight: 1.6 }}>
                  「{customer.voice}」
                </p>
              </div>
              <p className="text-white/30 text-[11px]">
                Score {breakdown.total} / 100 · {customer.region} · {customer.customerType}
                {customer.needType === "spot-only" && customer.spotFeeTypical && (
                  <span className="text-amber-300/70 ml-2">
                    · {buildSpotFeeLabel(customer).label}
                  </span>
                )}
              </p>
              <p className="text-white/50 text-xs border-l border-white/15 pl-3" style={{ lineHeight: 1.6 }}>
                {buildNearMissComment(mainCustomers, customer)}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-auto text-center">
        <p className="text-white/40 text-sm mb-6">
          計 {main.length + nearMiss.length} 件のマッチ候補が見つかりました
        </p>
        <div className="w-full mx-auto" style={{ maxWidth: "360px" }}>
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
      <div data-dark-bg className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
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
