"use client"

import { useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Clock } from "lucide-react"

// ──────────────────────────────────────────────
// 入口カードデータ (Fix 2: 03 から ¥2,000 注記を削除)
// ──────────────────────────────────────────────
export const ENTRIES = [
  {
    num:     "01",
    badge:   null,
    title:   "BizplatFormについて",
    desc:    "サービスの仕組み・市場背景・提携事務所の実績をご覧いただけます。",
    minutes: 3,
    href:    "/about",
    soon:    true,
  },
  {
    num:     "02",
    badge:   "おすすめ",
    title:   "AI診断　顧客マッチング",
    desc:    "5問に答えるだけで、先生の事務所に来る顧客像が見えます。結果はすぐ表示。",
    minutes: 5,
    href:    "/diagnosis",
    soon:    false,
  },
  {
    num:     "03",
    badge:   null,
    title:   "コミットプランシミュレーター",
    desc:    "顧客紹介の件数・顧問料・ROI を数字で確認できます。",
    minutes: 10,
    href:    "/simulator",
    soon:    false,
  },
] as const

type Entry = typeof ENTRIES[number]

// ──────────────────────────────────────────────
// ドア演出オーバーレイの状態
// ──────────────────────────────────────────────
interface ExpandState {
  active:  boolean
  // カードの中心から全画面へ広がる起点 (0–1 の相対位置)
  originX: number
  originY: number
}

// ──────────────────────────────────────────────
// EntryCards (Client Component)
// ──────────────────────────────────────────────
export function EntryCards() {
  const router  = useRouter()
  const listRef = useRef<HTMLDivElement>(null)

  const [expand, setExpand] = useState<ExpandState>({
    active: false, originX: 0.5, originY: 0.5,
  })

  // モバイル判定: hover なし = タッチデバイス
  const isMobile = useCallback(() =>
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  , [])

  const handleCardClick = useCallback((
    href: string,
    e: React.MouseEvent<HTMLElement>,
  ) => {
    e.preventDefault()

    // 起点: クリック位置をビューポート全体に対する相対座標に変換
    const vw = window.innerWidth
    const vh = window.innerHeight
    const originX = e.clientX / vw
    const originY = e.clientY / vh

    if (isMobile()) {
      // モバイル: フェードのみ (軽量化)
      setExpand({ active: true, originX: 0.5, originY: 0.5 })
      setTimeout(() => router.push(href), 280)
    } else {
      // デスクトップ: ドア演出 (カード起点から全画面展開)
      setExpand({ active: true, originX, originY })
      setTimeout(() => router.push(href), 420)
    }
  }, [router, isMobile])

  return (
    <div className="relative w-full max-w-2xl">

      {/* ドア演出オーバーレイ */}
      <div
        aria-hidden
        className={`door-overlay${expand.active ? " door-overlay--active" : ""}`}
        style={{
          "--door-ox": expand.originX,
          "--door-oy": expand.originY,
        } as React.CSSProperties}
      />

      {/* カードリスト */}
      <div
        ref={listRef}
        className="flex flex-col gap-3 md:gap-4"
        role="list"
        aria-label="3つの入口"
      >
        {ENTRIES.map((entry) => (
          <EntryCard
            key={entry.num}
            entry={entry}
            onNavigate={handleCardClick}
          />
        ))}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// 単体カード
// ──────────────────────────────────────────────
function EntryCard({
  entry,
  onNavigate,
}: {
  entry: Entry
  onNavigate: (href: string, e: React.MouseEvent<HTMLElement>) => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  const baseClass = [
    "group relative flex items-start md:items-center gap-5 md:gap-8",
    "border rounded-2xl px-5 py-5 md:px-7 md:py-6",
    "transition-all duration-200",
    entry.soon
      ? "border-white/8 bg-white/[0.01] opacity-55 select-none cursor-default"
      : entry.badge
        ? "border-white/25 bg-white/[0.04] cursor-pointer hover:bg-white/[0.07] hover:border-white/45 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.15)]"
        : "border-white/12 bg-white/[0.02] cursor-pointer hover:bg-white/[0.05] hover:border-white/28 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
  ].join(" ")

  const inner = (
    <div ref={cardRef} role="listitem" className={baseClass}>

      {/* ★おすすめバッジ */}
      {entry.badge && (
        <span
          className="absolute -top-3 left-5 bg-white text-black text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full"
          aria-label="おすすめ"
        >
          {entry.badge}
        </span>
      )}

      {/* 序数 */}
      <span
        className="font-serif-display text-white/18 flex-shrink-0 leading-none"
        style={{ fontSize: "clamp(26px, 3.5vw, 38px)" }}
        aria-hidden
      >
        {entry.num}
      </span>

      {/* テキスト */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap mb-1.5">
          <h2
            className="text-white font-bold leading-tight"
            style={{ fontSize: "clamp(15px, 1.4vw, 17px)" }}
          >
            {entry.title}
          </h2>
          {entry.soon && (
            <span className="text-white/30 text-[10px] tracking-wider border border-white/15 rounded-full px-2 py-0.5 flex-shrink-0">
              準備中
            </span>
          )}
        </div>
        <p
          className="text-white/45 leading-relaxed"
          style={{ fontSize: "clamp(12px, 1.05vw, 13px)" }}
        >
          {entry.desc}
        </p>
      </div>

      {/* 右端: 所要時間 + 矢印 */}
      <div className="flex-shrink-0 flex flex-col items-end gap-2 ml-2">
        <span className="flex items-center gap-1 text-white/28 text-[11px] whitespace-nowrap">
          <Clock size={11} strokeWidth={1.75} aria-hidden />
          約{entry.minutes}分
        </span>
        {!entry.soon && (
          <ArrowRight
            size={15}
            strokeWidth={2}
            className="text-white/35 transition-transform duration-200 group-hover:translate-x-1.5 group-hover:text-white/70"
            aria-hidden
          />
        )}
      </div>

      {/* ホバー時: カード下部に伸びるアクセントライン */}
      {!entry.soon && (
        <span
          aria-hidden
          className="absolute bottom-0 left-5 right-5 h-[1px] bg-white/0 rounded-full
                     transition-all duration-300
                     group-hover:bg-white/15 group-hover:left-0 group-hover:right-0"
        />
      )}
    </div>
  )

  if (entry.soon) return inner

  return (
    <a
      href={entry.href}
      onClick={(e) => onNavigate(entry.href, e)}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-2xl"
      aria-label={`${entry.title}（約${entry.minutes}分）`}
    >
      {inner}
    </a>
  )
}
