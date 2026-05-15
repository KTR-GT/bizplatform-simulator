"use client"

import { useEffect } from "react"

// ============================================================
// ACT 1 — PROLOGUE (白背景: ドアを開けた直後の明るさ)
// ============================================================

interface Act1PrologueProps {
  onStart: () => void
}

export function Act1Prologue({ onStart }: Act1PrologueProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") onStart()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onStart])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6 py-16 md:py-24">

      <p className="text-black/30 text-[10px] sm:text-[11px] font-inter font-black tracking-[0.3em] uppercase mb-6 sm:mb-8 stagger-1">
        AI 顧客マッチング
      </p>

      <h1
        className="text-[#0a0a0a] font-inter font-black leading-[1.1] mb-6 sm:mb-8 stagger-2"
        style={{ fontSize: "clamp(28px, 6vw, 56px)" }}
      >
        あなたの事務所に、
        <br />
        どんな顧客が来るのか。
      </h1>

      <p className="text-black/50 text-sm font-inter leading-relaxed mb-10 sm:mb-12 stagger-3">
        6 つの質問に、答えてください。
        <br className="hidden sm:block" />
        <span className="sm:hidden"> </span>
        全国 500 社から、先生にマッチする 3 社をご紹介します。
      </p>

      <button
        onClick={onStart}
        data-cursor
        className="
          px-7 sm:px-8 py-3.5 sm:py-4
          bg-[#0a0a0a] text-white
          font-inter font-bold tracking-[0.18em] uppercase text-xs sm:text-sm
          hover:bg-black/85
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black
          transition-colors stagger-4
          min-h-[48px]
        "
        autoFocus
      >
        はじめる →
      </button>

      <p className="text-black/28 text-[11px] font-inter tracking-[0.22em] uppercase mt-10 sm:mt-14 stagger-5">
        所要時間 約 3 分
      </p>
    </div>
  )
}
