"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { commitPlans } from "@/data/commit-plans"

function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`
        ref.current.style.top  = `${e.clientY}px`
      }
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovering(!!t.closest('button, a, input, label, select, textarea, [data-cursor]'))
    }
    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`custom-cursor is-dark${hovering ? ' is-hovering' : ''}`}
    />
  )
}

// 背景に浮かぶパーティクル用データ
const PARTICLES = [
  { text: "¥",      x: 8,  y: 12, size: 96,  opacity: 0.04, delay: 0    },
  { text: "%",      x: 88, y: 8,  size: 72,  opacity: 0.035,delay: 1.2  },
  { text: "¥",      x: 72, y: 75, size: 120, opacity: 0.03, delay: 0.6  },
  { text: "+",      x: 18, y: 68, size: 80,  opacity: 0.045,delay: 2.1  },
  { text: "%",      x: 52, y: 88, size: 64,  opacity: 0.04, delay: 1.8  },
  { text: "¥",      x: 42, y: 20, size: 56,  opacity: 0.025,delay: 0.9  },
  { text: "+",      x: 90, y: 50, size: 88,  opacity: 0.03, delay: 2.7  },
  { text: "月",     x: 6,  y: 45, size: 60,  opacity: 0.04, delay: 1.5  },
  { text: "¥",      x: 65, y: 38, size: 44,  opacity: 0.035,delay: 3.0  },
  { text: "%",      x: 30, y: 90, size: 76,  opacity: 0.03, delay: 0.3  },
]

// タイマーで積み上がる「機会損失」の最終値
// 中央値プラン（commitPlans の中央）の年間コミット額を参照
const MID_PLAN      = commitPlans[Math.floor(commitPlans.length / 2)]
const LOSS_TARGET   = MID_PLAN.commit * 12   // 月間コミット × 12ヶ月
const TIMER_DURATION_MS = 28_000             // 28秒で最終値に到達

interface TopPageProps {
  onStart: (officeName: string) => void
}

export function TopPage({ onStart }: TopPageProps) {
  const [officeName, setOfficeName]   = useState("")
  const [lossValue, setLossValue]     = useState(0)
  const [entered, setEntered]         = useState(false)
  const startTimeRef                  = useRef<number | null>(null)
  const rafRef                        = useRef<number | null>(null)

  // カウンターアニメーション (easeOut)
  useEffect(() => {
    startTimeRef.current = performance.now()
    const tick = (now: number) => {
      const elapsed = now - (startTimeRef.current ?? now)
      const progress = Math.min(elapsed / TIMER_DURATION_MS, 1)
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4)
      setLossValue(Math.round(LOSS_TARGET * eased))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  const handleStart = () => {
    if (!officeName.trim()) return
    setEntered(true)
    setTimeout(() => onStart(officeName.trim()), 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleStart()
  }

  return (
    <>
    <CustomCursor />
    <div
      className="relative w-full h-screen overflow-hidden bg-[#0A0A0A] flex flex-col items-center justify-center"
      style={{ opacity: entered ? 0 : 1, transition: "opacity 0.5s ease" }}
      data-dark-bg
    >
      {/* ── 背景パーティクル ── */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute select-none pointer-events-none font-inter font-black"
          style={{
            left:      `${p.x}%`,
            top:       `${p.y}%`,
            fontSize:  p.size,
            opacity:   p.opacity,
            color:     "#FFFFFF",
            animation: `floatDot ${6 + p.delay}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          {p.text}
        </span>
      ))}

      {/* ── タイマーブロック ── */}
      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-lg px-8">

        {/* 機会損失カウンター */}
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-white/35 text-xs tracking-[0.2em] uppercase font-inter">
            何もしない1年間で失われる売上
          </p>
          <p
            className="font-inter font-black tabular-nums text-white leading-none"
            style={{ fontSize: "clamp(48px, 10vw, 80px)" }}
          >
            ¥{lossValue.toLocaleString("ja-JP")}
          </p>
          <div className="w-px h-8 bg-white/15 mt-1" />
        </div>

        {/* キャッチコピー */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1
            className="text-white font-inter font-black leading-tight"
            style={{ fontSize: "clamp(22px, 4.5vw, 36px)" }}
          >
            あなたの事務所の、<br />5年後を見せます。
          </h1>
          <p className="text-white/40 text-sm font-inter">
            所要時間 約10分 — 一緒に確認しましょう。
          </p>
        </div>

        {/* 事務所名入力 */}
        <div className="flex flex-col gap-3 w-full">
          <Input
            value={officeName}
            onChange={e => setOfficeName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="事務所名を入力してください"
            className="
              bg-transparent border-0 border-b border-white/25 rounded-none
              text-white placeholder:text-white/25
              text-base font-inter px-0 py-3 h-auto
              focus-visible:ring-0 focus-visible:border-white/70
              transition-colors duration-200
            "
          />
          <Button
            onClick={handleStart}
            disabled={!officeName.trim()}
            className="
              w-full h-12 rounded-none font-inter font-black text-sm tracking-widest uppercase
              bg-white text-[#0A0A0A]
              disabled:bg-white/10 disabled:text-white/20
              hover:bg-white/90
              transition-all duration-200
            "
          >
            はじめる &nbsp;→
          </Button>
        </div>

        {/* フッター注記 */}
        <p className="text-white/20 text-xs font-inter text-center">
          導入事務所 100社超 &nbsp;·&nbsp; 全国対応
        </p>
      </div>
    </div>
    </>
  )
}
