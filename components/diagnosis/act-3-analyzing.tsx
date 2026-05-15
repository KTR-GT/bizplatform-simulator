"use client"

import { useEffect, useRef, useState } from "react"
import type { DiagnosisFlow } from "@/hooks/use-diagnosis-flow"
import { getCustomersForMatching } from "@/data/diagnosis-customers"
import { selectMatches } from "@/lib/matching/select"

// ============================================================
// ACT 3 — ANALYZING (8秒タメ演出 + バックグラウンドマッチング)
// ============================================================

const STEPS = [
  "全国 150 社のデータベースを照合しています",
  "テーマ適合性を分析しています",
  "エリア・関与スタイルを確認しています",
  "スコアを集計しています",
  "マッチング候補を選定しています",
]

interface Props {
  flow: DiagnosisFlow
}

export function Act3Analyzing({ flow }: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const [progress,  setProgress]  = useState(0)
  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    // バックグラウンドでマッチング計算
    const customers = getCustomersForMatching()
    const result = selectMatches(customers, flow.answers)
    flow.setMatchResult(result)

    // ステップ進行アニメーション
    const stepInterval = setInterval(() => {
      setStepIndex(i => {
        const next = i + 1
        if (next >= STEPS.length) clearInterval(stepInterval)
        return Math.min(next, STEPS.length - 1)
      })
    }, 1400)

    // プログレスバー
    const start = Date.now()
    const DURATION = 7800
    const raf = () => {
      const elapsed = Date.now() - start
      const pct = Math.min(elapsed / DURATION, 1)
      setProgress(pct)
      if (pct < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // 8秒後に幕4へ
    const timer = setTimeout(() => {
      flow.goToAct(4)
    }, 8000)

    return () => {
      clearInterval(stepInterval)
      clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      data-dark-bg
      className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6"
    >
      {/* タイトル */}
      <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-8 md:mb-10">
        Analyzing
      </p>
      <h2
        className="text-white text-center font-bold mb-12 md:mb-16"
        style={{ fontSize: "clamp(22px, 4.5vw, 42px)", lineHeight: 1.3 }}
      >
        全国 150 社のデータから<br />
        先生にマッチする顧客を<br />
        探しています
      </h2>

      {/* プログレスバー */}
      <div className="w-full max-w-sm h-[2px] bg-white/10 rounded-full mb-10 overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* ステップ表示 */}
      <div className="space-y-3 w-full max-w-sm">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 transition-opacity duration-500 ${
              i <= stepIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex-shrink-0 transition-colors duration-300 ${
                i < stepIndex
                  ? "bg-white"
                  : i === stepIndex
                  ? "bg-white/60 animate-pulse"
                  : "bg-white/20"
              }`}
            />
            <span
              className={`text-sm transition-colors duration-300 ${
                i < stepIndex
                  ? "text-white/70"
                  : i === stepIndex
                  ? "text-white"
                  : "text-white/30"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
