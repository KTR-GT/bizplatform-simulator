"use client"

import { useCallback, useState } from "react"
import {
  type Act,
  type DiagnosisAnswers,
  type EngagementStyle,
  type Industry,
  type QuestionIndex,
  type Region,
  type Theme,
  INITIAL_ANSWERS,
  TOTAL_QUESTIONS,
} from "@/types/diagnosis"
import type { MatchResult } from "@/lib/matching/select"

// ============================================================
// use-diagnosis-flow — ② AI診断 顧客マッチング の状態管理
// ============================================================
// 役割:
//   - 幕(Act)の遷移
//   - 質問インデックス(QuestionIndex)の管理
//   - 回答(DiagnosisAnswers)の保持と更新
//   - 配列フィールドのトグル
//   - 各質問の進行可否(canAdvance)の判定

export function useDiagnosisFlow() {
  const [act,           setAct]           = useState<Act>(1)
  const [questionIndex, setQuestionIndex] = useState<QuestionIndex>(0)
  const [answers,       setAnswers]       = useState<DiagnosisAnswers>(INITIAL_ANSWERS)
  const [matchResult,   setMatchResult]   = useState<MatchResult | null>(null)

  // ── 幕の遷移 ─────────────────────────────────
  const startHearing = useCallback(() => {
    setAct(2)
    setQuestionIndex(0)
  }, [])

  const completeHearing = useCallback(() => {
    setAct(3)
  }, [])

  const goToAct = useCallback((next: Act) => {
    setAct(next)
  }, [])

  // ── 質問の遷移 ───────────────────────────────
  const goToNextQuestion = useCallback(() => {
    setQuestionIndex(prev => {
      const next = (prev + 1) as QuestionIndex
      if (next >= TOTAL_QUESTIONS) {
        // 最後の質問を超えたら自動で幕3 (Analyzing) へ
        setAct(3)
        return prev
      }
      return next
    })
  }, [])

  const goToPrevQuestion = useCallback(() => {
    setQuestionIndex(prev => (prev > 0 ? ((prev - 1) as QuestionIndex) : prev))
  }, [])

  const skipQuestion = useCallback(() => {
    // 任意の質問でスキップ。空のまま次へ進む。
    goToNextQuestion()
  }, [goToNextQuestion])

  // ── 回答の更新 ───────────────────────────────
  const updateAnswers = useCallback((patch: Partial<DiagnosisAnswers>) => {
    setAnswers(prev => ({ ...prev, ...patch }))
  }, [])

  // ── 配列フィールドのトグル ────────────────────
  const toggleTheme = useCallback((value: Theme) => {
    setAnswers(prev => ({
      ...prev,
      themes: prev.themes.includes(value)
        ? prev.themes.filter(t => t !== value)
        : [...prev.themes, value],
    }))
  }, [])

  const toggleIndustry = useCallback((value: Industry) => {
    setAnswers(prev => ({
      ...prev,
      industries: prev.industries.includes(value)
        ? prev.industries.filter(i => i !== value)
        : [...prev.industries, value],
    }))
  }, [])

  const toggleArea = useCallback((value: Region) => {
    setAnswers(prev => ({
      ...prev,
      areas: prev.areas.includes(value)
        ? prev.areas.filter(a => a !== value)
        : [...prev.areas, value],
    }))
  }, [])

  const toggleEngagementStyle = useCallback((value: EngagementStyle) => {
    setAnswers(prev => ({
      ...prev,
      engagementStyles: prev.engagementStyles.includes(value)
        ? prev.engagementStyles.filter(s => s !== value)
        : [...prev.engagementStyles, value],
    }))
  }, [])

  // ── 進行可否の判定 ──────────────────────────
  // 各質問について「次へ」を押せるかの判定。
  // ・必須項目が入力されているか
  // ・Q6 は任意なのでいつでも進める
  const canAdvance = (() => {
    switch (questionIndex) {
      case 0: return answers.phase !== null
      case 1: return true  // テーマは「幅広く」= 空配列でも OK
      case 2: return true  // 業種は「特になし」= 空配列でも OK
      case 3: return answers.areas.length > 0  // ★ 最低 1 つ必須
      case 4: return true  // 関与スタイルは空も許容（"指定なし"扱い）
      case 5: return true  // Q6 は任意
      default: return true
    }
  })()

  // 全ヒアリングが完了したか
  const isHearingComplete = questionIndex >= TOTAL_QUESTIONS - 1 && canAdvance

  // プログレス 0〜1
  const progress = (questionIndex + (canAdvance ? 1 : 0)) / TOTAL_QUESTIONS

  return {
    // 状態
    act,
    questionIndex,
    answers,
    matchResult,
    setMatchResult,
    canAdvance,
    isHearingComplete,
    progress,

    // 幕の遷移
    startHearing,
    completeHearing,
    goToAct,

    // 質問の遷移
    goToNextQuestion,
    goToPrevQuestion,
    skipQuestion,

    // 回答の更新
    updateAnswers,
    toggleTheme,
    toggleIndustry,
    toggleArea,
    toggleEngagementStyle,
  } as const
}

export type DiagnosisFlow = ReturnType<typeof useDiagnosisFlow>
