"use client"

import { type ReactNode, useEffect } from "react"
import { ProgressBar } from "./progress-bar"
import type { QuestionMeta } from "@/types/diagnosis"

// ============================================================
// QUESTION FULLSCREEN — 1 質問 1 画面の共通レイアウト
// ============================================================
// 質問固有の入力 UI は children で受け取る。

interface QuestionFullscreenProps {
  meta:         QuestionMeta
  progress:     number
  canAdvance:   boolean
  onNext:       () => void
  onPrev:       () => void
  onSkip:       () => void
  isFirst:      boolean
  isLast:       boolean
  hint?:        string   // タイトル下の補助文
  children:     ReactNode
}

export function QuestionFullscreen({
  meta,
  progress,
  canAdvance,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
  hint,
  children,
}: QuestionFullscreenProps) {
  // Enter で次へ進めるショートカット（テキストエリア中は除外）
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "TEXTAREA")) return
      if (canAdvance) {
        e.preventDefault()
        onNext()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [canAdvance, onNext])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER: progress */}
      <header className="px-6 sm:px-10 pt-6 sm:pt-8">
        <div className="max-w-3xl mx-auto">
          <ProgressBar value={progress} label={meta.label} />
        </div>
      </header>

      {/* MAIN: title + input */}
      <main className="flex-1 px-6 sm:px-10 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <h2
            className="font-serif-display italic text-[#0A0A0A] leading-[1.15] mb-3 sm:mb-4 stagger-1"
            style={{ fontSize: "clamp(28px, 5.5vw, 48px)" }}
          >
            {meta.title}
            {meta.optional && (
              <span className="ml-3 align-middle text-xs font-inter not-italic font-bold tracking-[0.18em] uppercase text-black/40">
                任意
              </span>
            )}
          </h2>

          {hint && (
            <p className="text-sm text-black/55 leading-relaxed mb-8 sm:mb-10 stagger-2">
              {hint}
            </p>
          )}

          <div className="stagger-3">{children}</div>
        </div>
      </main>

      {/* FOOTER: navigation */}
      <footer className="px-6 sm:px-10 py-6 sm:py-8 border-t border-black/10">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onPrev}
            disabled={isFirst}
            data-cursor
            className="
              font-inter font-bold text-[11px] sm:text-xs tracking-[0.18em] uppercase
              text-black/55 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed
              transition-colors min-h-[44px] px-2
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
            "
            aria-label="前の質問へ"
          >
            ← 戻る
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            {meta.optional && (
              <button
                onClick={onSkip}
                data-cursor
                className="
                  font-inter font-bold text-[11px] sm:text-xs tracking-[0.18em] uppercase
                  text-black/55 hover:text-black
                  transition-colors min-h-[44px] px-2
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
                "
              >
                スキップ
              </button>
            )}
            <button
              onClick={onNext}
              disabled={!canAdvance}
              data-cursor
              className="
                px-6 sm:px-7 py-3 sm:py-3.5
                bg-[#0A0A0A] text-white
                font-inter font-bold tracking-[0.18em] uppercase text-xs sm:text-sm
                hover:bg-black disabled:bg-black/20 disabled:cursor-not-allowed
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black
                transition-colors min-h-[48px]
              "
            >
              {isLast ? "診断を見る →" : "次へ →"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
