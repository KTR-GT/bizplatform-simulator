"use client"

import { AnimatedNumber } from "@/components/shared/animated-number"

interface KpiItem {
  value: string
  label: string
  note:  string
}

/** "2,000+" → { num: 2000, prefix: "", suffix: "+" } */
function parseValue(v: string): { num: number; prefix: string; suffix: string } {
  const m = v.match(/^([^0-9]*)([0-9,]+)(.*)$/)
  if (!m) return { num: 0, prefix: "", suffix: v }
  return {
    prefix: m[1],
    num:    parseInt(m[2].replace(/,/g, ""), 10),
    suffix: m[3],
  }
}

export function KpiGrid({ items }: { items: KpiItem[] }) {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/8 border border-black/8 mb-16"
      data-reveal=""
      style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
    >
      {items.map((kpi, i) => {
        const { num, prefix, suffix } = parseValue(kpi.value)
        return (
          <div
            key={kpi.label}
            className="bg-white px-5 py-7 md:px-7 md:py-9"
          >
            <p
              className="font-serif-display leading-none text-[#0a0a0a] mb-2"
              style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
            >
              <AnimatedNumber
                to={num}
                prefix={prefix}
                suffix={suffix}
                duration={1400 + i * 80}
              />
            </p>
            <p className="text-[12px] font-bold text-[#0a0a0a] mb-1">{kpi.label}</p>
            <p className="text-[11px] text-black/38">{kpi.note}</p>
          </div>
        )
      })}
    </div>
  )
}
