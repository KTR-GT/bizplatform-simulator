"use client"

// ============================================================
// ACT PLACEHOLDER — 幕3〜5 の仮ガラ（Phase 1 用）
// ============================================================
// Phase 2C / Phase 3 で本実装に差し替える。

interface ActPlaceholderProps {
  act:        3 | 4 | 5
  title:      string
  subtitle?:  string
  onAdvance?: () => void
  advanceLabel?: string
}

const ACT_NUM_LABEL: Record<3 | 4 | 5, string> = {
  3: "ACT 03",
  4: "ACT 04",
  5: "ACT 05",
}

export function ActPlaceholder({
  act,
  title,
  subtitle,
  onAdvance,
  advanceLabel = "次へ →",
}: ActPlaceholderProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6 py-16">
      <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-black/40 mb-4">
        {ACT_NUM_LABEL[act]} — Coming Soon
      </p>
      <h2
        className="font-serif-display italic text-black/85 mb-4"
        style={{ fontSize: "clamp(28px, 5vw, 44px)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-black/55 max-w-md mb-8 leading-relaxed">{subtitle}</p>
      )}
      {onAdvance && (
        <button
          onClick={onAdvance}
          data-cursor
          className="
            px-7 py-3.5 bg-[#0A0A0A] text-white
            font-inter font-bold tracking-[0.18em] uppercase text-xs
            hover:bg-black
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black
            transition-colors
            min-h-[48px]
          "
        >
          {advanceLabel}
        </button>
      )}
      <p className="text-[10px] font-inter tracking-[0.22em] uppercase text-black/30 mt-12">
        Phase 1 では幕2まで実装済み。本パートは後フェーズで実装します。
      </p>
    </div>
  )
}
