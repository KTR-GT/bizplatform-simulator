"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Clock } from "lucide-react"

// ──────────────────────────────────────────────
// カードデータ
// ──────────────────────────────────────────────
interface EntryDef {
  num:     string
  title:   string
  desc:    string
  minutes: number
  href:    string
  soon:    boolean
}

const ENTRIES: EntryDef[] = [
  {
    num:     "01",
    title:   "BizplatFormについて",
    desc:    "会社の仕組み・市場背景・提携実績を見る",
    minutes: 3,
    href:    "/about",
    soon:    false,
  },
  {
    num:     "02",
    title:   "AI顧客診断",
    desc:    "あなたの事務所に来る顧客像を AI が診断",
    minutes: 5,
    href:    "/diagnosis",
    soon:    false,
  },
  {
    num:     "03",
    title:   "プランシミュレーター",
    desc:    "顧客紹介の件数・顧問料・ROI を数字で確認",
    minutes: 10,
    href:    "/simulator",
    soon:    false,
  },
]

// ──────────────────────────────────────────────
// EntryCards
// ──────────────────────────────────────────────
interface ExpandState {
  active:  boolean
  originX: number
  originY: number
}

export function EntryCards() {
  const router = useRouter()
  const [expand, setExpand] = useState<ExpandState>({
    active: false, originX: 0.5, originY: 0.5,
  })

  const isMobile = useCallback(() =>
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  , [])

  const handleCardClick = useCallback((
    href: string,
    e:    React.MouseEvent<HTMLElement>,
  ) => {
    e.preventDefault()
    const vw = window.innerWidth
    const vh = window.innerHeight

    if (isMobile()) {
      setExpand({ active: true, originX: 0.5, originY: 0.5 })
      setTimeout(() => router.push(href), 300)
    } else {
      setExpand({ active: true, originX: e.clientX / vw, originY: e.clientY / vh })
      setTimeout(() => router.push(href), 480)
    }
  }, [router, isMobile])

  return (
    <div className="relative w-full max-w-4xl">

      {/* ドア演出オーバーレイ: 黒→白 */}
      <div
        aria-hidden
        className={`door-overlay${expand.active ? " door-overlay--active" : ""}`}
        style={{
          "--door-ox": expand.originX,
          "--door-oy": expand.originY,
          "--door-bg": "#ffffff",
        } as React.CSSProperties}
      />

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-[2px] md:gap-[3px]"
        role="list"
        aria-label="3つの入口"
      >
        {ENTRIES.map((entry) => (
          <EntryCard key={entry.num} entry={entry} onNavigate={handleCardClick} />
        ))}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// 単体カード — ドアシルエット
// ──────────────────────────────────────────────
function EntryCard({
  entry,
  onNavigate,
}: {
  entry:      EntryDef
  onNavigate: (href: string, e: React.MouseEvent<HTMLElement>) => void
}) {
  const { soon } = entry

  const cardBody = (
    <div
      role="listitem"
      className={[
        "group relative flex flex-col overflow-hidden border border-white/10",
        "bg-[#0a0a0a]",
        "h-[400px] md:h-[520px]",
        soon
          ? "opacity-45 select-none cursor-default"
          : [
              "cursor-pointer",
              "hover:border-white/20",
              "hover:shadow-[0_20px_70px_rgba(0,0,0,0.98)]",
            ].join(" "),
        "transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
      ].join(" ")}
    >

      {/* ── 右側グロー: ドアの隙間から光が漏れる ────── */}
      {!soon && (
        <div
          aria-hidden
          className="
            pointer-events-none absolute inset-0 z-20
            opacity-0 group-hover:opacity-100
            transition-opacity duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          "
          style={{
            background:
              "linear-gradient(to left, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 42%)",
          }}
        />
      )}

      {/* ── ドアノブ (右中央, 14-18px) ───────────────── */}
      {!soon && (
        <div
          aria-hidden
          className="
            pointer-events-none absolute right-7 top-1/2 -translate-y-1/2 z-40
            w-4 h-4 rounded-full
            bg-white/45
            transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]
            group-hover:bg-white group-hover:opacity-100
            group-hover:rotate-[8deg]
            group-hover:shadow-[0_0_0_4px_rgba(255,255,255,0.20),0_0_24px_8px_rgba(255,255,255,0.40)]
          "
        />
      )}

      {/* ── コンテンツ本体 ──────────────────────────── */}
      <div className="relative z-10 flex flex-col h-full">

        {/* 上段: タイトル + サブテキスト (縦中央) */}
        <div className="flex-1 flex flex-col items-start justify-center px-7 pt-10 pb-4">

          {/* タイトル — 最大要素 */}
          <h2
            className="text-white font-black leading-[1.1] mb-4 tracking-tight"
            style={{ fontSize: "clamp(26px, 3vw, 44px)" }}
          >
            {entry.title}
          </h2>

          {/* サブテキスト */}
          <p
            className="text-white/45 leading-relaxed"
            style={{ fontSize: "clamp(13px, 1vw, 15px)" }}
          >
            {entry.desc}
          </p>

          {/* 準備中バッジ */}
          {soon && (
            <span className="mt-5 text-[9px] tracking-[0.2em] uppercase border border-white/14 text-white/28 rounded-full px-2.5 py-1">
              準備中
            </span>
          )}
        </div>

        {/* 下段: 番号 (補助) + 所要時間 */}
        <div className="flex items-end justify-between px-7 pb-6">
          <span
            aria-hidden
            className="
              font-serif-display leading-none select-none text-white/40
              transition-transform duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]
              group-hover:-translate-y-0.5
            "
            style={{ fontSize: "clamp(40px, 4vw, 64px)" }}
          >
            {entry.num}
          </span>

          {!soon && (
            <span className="flex items-center gap-1 text-white/25 text-[11px] mb-0.5">
              <Clock size={10} strokeWidth={1.75} aria-hidden />
              約{entry.minutes}分
            </span>
          )}
        </div>
      </div>
    </div>
  )

  if (soon) return cardBody

  return (
    <a
      href={entry.href}
      onClick={(e) => onNavigate(entry.href, e)}
      className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/35"
      aria-label={`${entry.title}（約${entry.minutes}分）`}
    >
      {cardBody}
    </a>
  )
}
