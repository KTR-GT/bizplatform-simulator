"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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

interface TopPageProps {
  onStart: (officeName: string) => void
}

export function TopPage({ onStart }: TopPageProps) {
  const [officeName, setOfficeName] = useState("")
  const [entered,    setEntered]    = useState(false)

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
        className="w-full h-screen bg-[#0A0A0A] flex flex-col"
        style={{ opacity: entered ? 0 : 1, transition: "opacity 0.5s ease" }}
        data-dark-bg
      >
        {/* ── ヘッダー：ブランド名 ── */}
        <header className="px-10 py-8 flex items-center justify-center">
          <span className="font-inter font-black text-white text-sm tracking-[0.22em] uppercase">
            BizplatForm
          </span>
        </header>

        {/* ── メイン ── */}
        <main className="flex-1 flex flex-col items-center justify-center px-10 pb-16 text-center">

          {/* キャッチ */}
          <div className="mb-14">
            <p className="text-white/30 text-xs font-inter tracking-[0.2em] uppercase mb-6">
              Proposal
            </p>
            <h1
              className="text-white font-inter font-black leading-[1.1] mb-6"
              style={{ fontSize: "clamp(36px, 5.5vw, 56px)" }}
            >
              あなたの事務所の<br />
              売上成長に、<br />
              コミットします。
            </h1>
            <p className="text-white/35 text-sm font-inter leading-relaxed">
              事務所名を入力すると、あなたの事務所に向けた<br />
              提案書が始まります。
            </p>
          </div>

          {/* 入力 */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <Input
              value={officeName}
              onChange={e => setOfficeName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="事務所名を入力してください"
              autoFocus
              className="
                bg-transparent border-0 border-b border-white/20 rounded-none
                text-white placeholder:text-white/20 text-center
                text-base font-inter px-0 py-3 h-auto
                focus-visible:ring-0 focus-visible:border-white/60
                transition-colors duration-200
              "
            />
            <Button
              onClick={handleStart}
              disabled={!officeName.trim()}
              className="
                w-full h-11 rounded-none font-inter font-bold text-sm tracking-widest uppercase
                bg-white text-[#0A0A0A]
                disabled:bg-white/8 disabled:text-white/20
                hover:bg-white/90
                transition-all duration-200
              "
            >
              はじめる →
            </Button>
          </div>
        </main>

        {/* ── フッター ── */}
        <footer className="px-10 py-6 flex items-center justify-between border-t border-white/8">
          <p className="text-white/20 text-xs font-inter">所要時間 約10分</p>
          <p className="text-white/20 text-xs font-inter">導入事務所 約2,000事務所 · 全国対応</p>
        </footer>
      </div>
    </>
  )
}
