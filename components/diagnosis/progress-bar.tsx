"use client"

// ============================================================
// PROGRESS BAR — 幕2 ヒアリング進捗表示
// ============================================================

interface ProgressBarProps {
  /** 0〜1 の進捗値 */
  value: number
  /** "Question 2 / 6" 等の補助ラベル */
  label?: string
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 1)
  return (
    <div className="w-full">
      {label && (
        <p className="font-inter text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-black/45 mb-2">
          {label}
        </p>
      )}
      <div
        className="h-[2px] bg-black/10 relative overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(clamped * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="absolute inset-y-0 left-0 bg-[#0A0A0A] transition-[width] duration-500 ease-out"
          style={{ width: `${clamped * 100}%` }}
        />
      </div>
    </div>
  )
}
