"use client"

import { useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Clock } from "lucide-react"

// ──────────────────────────────────────────────
// カードデータ
// ──────────────────────────────────────────────
interface EntryDef {
  num:      string
  badge:    string | null
  title:    string
  desc:     string
  minutes:  number
  href:     string
  soon:     boolean
  inverted: boolean  // true = 白背景・黒文字
}

const ENTRIES: EntryDef[] = [
  {
    num:      "01",
    badge:    null,
    title:    "BizplatFormについて",
    desc:     "サービスの仕組み・市場背景・提携事務所の実績をご覧いただけます。",
    minutes:  3,
    href:     "/about",
    soon:     true,
    inverted: false,
  },
  {
    num:      "02",
    badge:    "おすすめ",
    title:    "AI診断　顧客マッチング",
    desc:     "5問に答えるだけで、先生の事務所に来る顧客像が見えます。結果はすぐ表示。",
    minutes:  5,
    href:     "/diagnosis",
    soon:     false,
    inverted: true,
  },
  {
    num:      "03",
    badge:    null,
    title:    "コミットプランシミュレーター",
    desc:     "顧客紹介の件数・顧問料・ROI を数字で確認できます。",
    minutes:  10,
    href:     "/simulator",
    soon:     false,
    inverted: false,
  },
]

// ──────────────────────────────────────────────
// ドア演出オーバーレイ
// ──────────────────────────────────────────────
interface ExpandState {
  active:  boolean
  originX: number
  originY: number
}

// ──────────────────────────────────────────────
// EntryCards (Client Component)
// ──────────────────────────────────────────────
export function EntryCards() {
  const router = useRouter()
  const [expand, setExpand] = useState<ExpandState>({
    active: false, originX: 0.5, originY: 0.5,
  })

  const isMobile = useCallback(() =>
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  , [])

  const handleCardClick = useCallback((
    href:  string,
    e:     React.MouseEvent<HTMLElement>,
  ) => {
    e.preventDefault()
    const vw = window.innerWidth
    const vh = window.innerHeight

    if (isMobile()) {
      setExpand({ active: true, originX: 0.5, originY: 0.5 })
      setTimeout(() => router.push(href), 280)
    } else {
      setExpand({ active: true, originX: e.clientX / vw, originY: e.clientY / vh })
      setTimeout(() => router.push(href), 420)
    }
  }, [router, isMobile])

  return (
    <div className="relative w-full max-w-4xl px-0">

      {/* ドア演出オーバーレイ */}
      <div
        aria-hidden
        className={`door-overlay${expand.active ? " door-overlay--active" : ""}`}
        style={{ "--door-ox": expand.originX, "--door-oy": expand.originY } as React.CSSProperties}
      />

      {/* 3列グリッド */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-[2px] md:gap-[3px]"
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
// 単体カード — ドアのシルエット
// ──────────────────────────────────────────────
function EntryCard({
  entry,
  onNavigate,
}: {
  entry:      EntryDef
  onNavigate: (href: string, e: React.MouseEvent<HTMLElement>) => void
}) {
  const inv = entry.inverted

  // カラー変数
  const bg         = inv ? "bg-white"      : "bg-[#0a0a0a]"
  const borderBase = inv ? "border-black/12" : "border-white/10"
  const borderHov  = inv ? "hover:border-black/30" : "hover:border-white/25"
  const numCol     = inv ? "text-[#0a0a0a]"        : "text-white/12"
  const titleCol   = inv ? "text-[#0a0a0a]"        : "text-white"
  const descCol    = inv ? "text-black/45"          : "text-white/40"
  const metaCol    = inv ? "text-black/35"          : "text-white/28"
  const lineCol    = inv ? "bg-black/8"             : "bg-white/6"
  const knobBase   = inv
    ? "bg-black/18 group-hover:bg-black/55 group-hover:shadow-[0_0_10px_3px_rgba(0,0,0,0.25)]"
    : "bg-white/18 group-hover:bg-white/65 group-hover:shadow-[0_0_10px_3px_rgba(255,255,255,0.30)]"
  const shadowHov  = inv
    ? "hover:shadow-[0_12px_50px_rgba(0,0,0,0.18)]"
    : "hover:shadow-[0_12px_50px_rgba(0,0,0,0.9)]"

  const cardInner = (
    <div
      role="listitem"
      className={[
        "group relative flex flex-col overflow-hidden border",
        // 縦長比率: モバイル 380px, デスクトップ 520px
        "h-[380px] md:h-[520px]",
        bg,
        borderBase,
        entry.soon ? "opacity-50 select-none cursor-default" : `cursor-pointer ${borderHov} ${shadowHov}`,
        "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
      ].join(" ")}
    >
      {/* ── ドアノブ (右中央) ─────────────────────── */}
      {!entry.soon && (
        <div
          aria-hidden
          className={[
            "absolute right-4 top-1/2 -translate-y-1/2 z-20",
            "w-3.5 h-3.5 rounded-full",
            "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            knobBase,
          ].join(" ")}
        />
      )}

      {/* ── 縦線 (ホバー時に現れるドアの合わせ目) ── */}
      {!entry.soon && (
        <div
          aria-hidden
          className={[
            "absolute left-1/2 -translate-x-1/2 top-10 bottom-10",
            "w-px z-10 opacity-0 group-hover:opacity-100",
            lineCol,
            "transition-opacity duration-200",
          ].join(" ")}
        />
      )}

      {/* ── ★おすすめバッジ ──────────────────────── */}
      {entry.badge && (
        <span className="absolute top-4 left-4 z-20 bg-[#0a0a0a] text-white text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full">
          ★ {entry.badge}
        </span>
      )}

      {/* ── 番号 (上半分を占める章扉数字) ──────────── */}
      <div className="flex flex-1 items-center justify-center px-4 pt-10">
        <span
          aria-hidden
          className={[
            "font-serif-display leading-none select-none",
            numCol,
            "transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            entry.soon ? "" : "group-hover:-translate-y-1",
          ].join(" ")}
          style={{ fontSize: "clamp(100px, 10vw, 160px)" }}
        >
          {entry.num}
        </span>
      </div>

      {/* ── 下段: タイトル・説明・メタ ──────────── */}
      <div className="px-5 pb-6 pt-3">
        <div className="flex items-center gap-2 mb-1.5">
          <h2
            className={`font-bold leading-snug ${titleCol}`}
            style={{ fontSize: "clamp(13px, 1.2vw, 15px)" }}
          >
            {entry.title}
          </h2>
          {entry.soon && (
            <span className={`text-[9px] tracking-wider border rounded-full px-1.5 py-0.5 flex-shrink-0 ${inv ? "border-black/18 text-black/35" : "border-white/14 text-white/28"}`}>
              準備中
            </span>
          )}
        </div>
        <p
          className={`leading-relaxed ${descCol}`}
          style={{ fontSize: "clamp(10px, 0.9vw, 12px)" }}
        >
          {entry.desc}
        </p>
        {!entry.soon && (
          <p className={`mt-3 flex items-center gap-1 text-[10px] ${metaCol}`}>
            <Clock size={10} strokeWidth={1.75} aria-hidden />
            約{entry.minutes}分
          </p>
        )}
      </div>
    </div>
  )

  if (entry.soon) return cardInner

  return (
    <a
      href={entry.href}
      onClick={(e) => onNavigate(entry.href, e)}
      className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
      aria-label={`${entry.title}（約${entry.minutes}分）`}
    >
      {cardInner}
    </a>
  )
}
