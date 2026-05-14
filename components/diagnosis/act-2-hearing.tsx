"use client"

import { QuestionFullscreen } from "./question-fullscreen"
import {
  ENGAGEMENT_STYLE_LABELS,
  ENGAGEMENT_STYLE_OPTIONS,
  INDUSTRY_OPTIONS,
  OFFICE_PHASE_LABELS,
  QUESTION_META,
  REGION_OPTIONS,
  THEME_OPTIONS_FOR_HEARING,
  TOTAL_QUESTIONS,
  type OfficePhase,
} from "@/types/diagnosis"
import type { DiagnosisFlow } from "@/hooks/use-diagnosis-flow"

// ============================================================
// ACT 2 — HEARING
// ============================================================
// 5 問 + 任意 Q6 を 1 画面ずつ進めるフロー。

interface Act2HearingProps {
  flow: DiagnosisFlow
}

export function Act2Hearing({ flow }: Act2HearingProps) {
  const meta = QUESTION_META[flow.questionIndex]

  return (
    <QuestionFullscreen
      meta={meta}
      progress={flow.progress}
      canAdvance={flow.canAdvance}
      onNext={flow.goToNextQuestion}
      onPrev={flow.goToPrevQuestion}
      onSkip={flow.skipQuestion}
      isFirst={flow.questionIndex === 0}
      isLast={flow.questionIndex === TOTAL_QUESTIONS - 1}
      hint={getHint(flow.questionIndex)}
    >
      {renderQuestionBody(flow)}
    </QuestionFullscreen>
  )
}

// ============================================================
// HINTS
// ============================================================

function getHint(index: number): string | undefined {
  switch (index) {
    case 1: return "複数選択可。特に得意なものを。\"幅広く\" を選ぶと汎用評価になります。"
    case 2: return "複数選択可。特に得意な業種を。\"特になし\" でも構いません。"
    case 3: return "最低 1 つ選択してください。\"全国\" と特定エリアを併せて選ぶこともできます。"
    case 4: return "複数選択可。受け入れ可能なスタイルを幅広く選ぶほど、マッチする顧客が広がります。"
    case 5: return "例：\"対話を大切にしている\" \"節税の手筋に強い\" など。マッチング結果のコピーに反映されます。"
    default: return undefined
  }
}

// ============================================================
// QUESTION BODIES
// ============================================================

function renderQuestionBody(flow: DiagnosisFlow) {
  const { answers } = flow

  switch (flow.questionIndex) {
    // ── Q1: 事務所のフェーズ ──────────────────────
    case 0:
      return (
        <div className="space-y-3">
          {(Object.keys(OFFICE_PHASE_LABELS) as OfficePhase[]).map((phase) => {
            const on = answers.phase === phase
            return (
              <button
                key={phase}
                type="button"
                data-cursor
                onClick={() => flow.updateAnswers({ phase })}
                aria-pressed={on}
                className={`
                  w-full text-left px-5 py-4
                  border transition-all min-h-[56px]
                  font-inter font-bold text-base
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
                  ${on
                    ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                    : "bg-white text-[#0A0A0A] border-black/15 hover:border-[#0A0A0A]"
                  }
                `}
              >
                {OFFICE_PHASE_LABELS[phase]}
              </button>
            )
          })}
        </div>
      )

    // ── Q2: 得意テーマ（複数選択 + 幅広く） ──────────
    case 1:
      return (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
            {THEME_OPTIONS_FOR_HEARING.map((theme) => {
              const on = answers.themes.includes(theme)
              return (
                <button
                  key={theme}
                  type="button"
                  data-cursor
                  onClick={() => flow.toggleTheme(theme)}
                  aria-pressed={on}
                  className={`
                    px-4 py-3 border font-inter font-bold text-sm
                    transition-all min-h-[48px]
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
                    ${on
                      ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                      : "bg-white text-[#0A0A0A]/85 border-black/15 hover:border-[#0A0A0A]"
                    }
                  `}
                >
                  {on && "★ "}{theme}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            data-cursor
            onClick={() => flow.updateAnswers({ themes: [] })}
            aria-pressed={answers.themes.length === 0}
            className={`
              px-4 py-2.5 border font-inter font-bold text-xs uppercase tracking-[0.12em]
              transition-all min-h-[44px]
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
              ${answers.themes.length === 0
                ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                : "bg-white text-black/55 border-black/15 hover:border-[#0A0A0A]"
              }
            `}
          >
            幅広く（指定なし）
          </button>
        </div>
      )

    // ── Q3: 得意業種（複数選択 + 特になし） ──────────
    case 2:
      return (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
            {INDUSTRY_OPTIONS.map((ind) => {
              const on = answers.industries.includes(ind)
              return (
                <button
                  key={ind}
                  type="button"
                  data-cursor
                  onClick={() => flow.toggleIndustry(ind)}
                  aria-pressed={on}
                  className={`
                    px-4 py-3 border font-inter font-bold text-sm
                    transition-all min-h-[48px]
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
                    ${on
                      ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                      : "bg-white text-[#0A0A0A]/85 border-black/15 hover:border-[#0A0A0A]"
                    }
                  `}
                >
                  {on && "★ "}{ind}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            data-cursor
            onClick={() => flow.updateAnswers({ industries: [] })}
            aria-pressed={answers.industries.length === 0}
            className={`
              px-4 py-2.5 border font-inter font-bold text-xs uppercase tracking-[0.12em]
              transition-all min-h-[44px]
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
              ${answers.industries.length === 0
                ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                : "bg-white text-black/55 border-black/15 hover:border-[#0A0A0A]"
              }
            `}
          >
            特になし（業種指定なし）
          </button>
        </div>
      )

    // ── Q4: 対応エリア（最低 1 つ必須） ───────────────
    case 3:
      return (
        <div>
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
            {REGION_OPTIONS.map((area) => {
              const on = answers.areas.includes(area)
              return (
                <button
                  key={area}
                  type="button"
                  data-cursor
                  onClick={() => flow.toggleArea(area)}
                  aria-pressed={on}
                  className={`
                    px-4 sm:px-5 py-3 border font-inter font-bold text-sm
                    transition-all min-h-[48px]
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
                    ${on
                      ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                      : "bg-white text-[#0A0A0A]/85 border-black/15 hover:border-[#0A0A0A]"
                    }
                  `}
                >
                  {area}
                </button>
              )
            })}
          </div>
          {answers.areas.length === 0 && (
            <p className="text-xs text-black/45 font-inter">
              最低 1 つ選択してください。
            </p>
          )}
        </div>
      )

    // ── Q5: 関与スタイル（複数選択） ──────────────────
    case 4:
      return (
        <div className="space-y-2 sm:space-y-3">
          {ENGAGEMENT_STYLE_OPTIONS.map((style) => {
            const on = answers.engagementStyles.includes(style)
            return (
              <button
                key={style}
                type="button"
                data-cursor
                onClick={() => flow.toggleEngagementStyle(style)}
                aria-pressed={on}
                className={`
                  w-full text-left px-5 py-4 border
                  font-inter font-bold text-sm sm:text-base
                  transition-all min-h-[56px] flex items-center gap-3
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
                  ${on
                    ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                    : "bg-white text-[#0A0A0A] border-black/15 hover:border-[#0A0A0A]"
                  }
                `}
              >
                <span
                  className={`
                    flex-shrink-0 w-5 h-5 border flex items-center justify-center
                    ${on ? "border-white bg-white" : "border-black/30"}
                  `}
                  aria-hidden
                >
                  {on && <span className="text-[#0A0A0A] text-[10px] font-black">✓</span>}
                </span>
                {ENGAGEMENT_STYLE_LABELS[style]}
              </button>
            )
          })}
        </div>
      )

    // ── Q6: 自由記述（任意） ──────────────────────────
    case 5:
      return (
        <div>
          <label htmlFor="identity-textarea" className="sr-only">
            事務所のらしさ
          </label>
          <textarea
            id="identity-textarea"
            value={answers.identity}
            onChange={(e) => flow.updateAnswers({ identity: e.target.value })}
            placeholder={"例：\n対話を大切にしている、伴走型の事務所です。\n節税の手筋に強く、攻めの提案を得意としています。"}
            rows={5}
            maxLength={300}
            className="
              w-full px-5 py-4 border border-black/15
              text-base font-inter text-[#0A0A0A]
              placeholder:text-black/35 placeholder:whitespace-pre-line
              focus:outline-none focus:border-[#0A0A0A]
              transition-colors resize-y min-h-[140px]
            "
          />
          <div className="mt-2 flex justify-between items-center text-[11px] font-inter text-black/40">
            <span>※ マッチング結果に反映されます（任意）</span>
            <span className="tabular-nums">{answers.identity.length} / 300</span>
          </div>
        </div>
      )

    default:
      return null
  }
}
