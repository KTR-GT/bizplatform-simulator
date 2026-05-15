"use client"

import { useEffect } from "react"
import { useLenis } from "lenis/react"

/**
 * セクション内ではネイティブスクロールを許可し、
 * セクションの上端 / 下端に達した瞬間だけ前後の section[data-snap] へジャンプする。
 * Lenis でなめらかな切替 (1.4s)、ジャンプ後 1.4s は次の入力を抑制。
 * prefers-reduced-motion 環境では発火しない。
 */
export function useSectionSnap() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let lastJumpAt = 0
    const COOLDOWN       = 800
    const EDGE_THRESHOLD = 20
    const DELTA_MIN      = 10
    const JUMP_DURATION  = 0.6
    const jumpEasing     = (t: number) => 1 - Math.pow(1 - t, 4) // easeOutQuart

    const onWheel = (e: WheelEvent) => {
      const now = performance.now()
      if (now - lastJumpAt < COOLDOWN) {
        e.preventDefault()
        return
      }

      if (Math.abs(e.deltaY) < DELTA_MIN) return

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("section[data-snap]"),
      )
      if (!sections.length) return

      const vh = window.innerHeight
      const current = sections.find((s) => {
        const r = s.getBoundingClientRect()
        return r.top <= vh / 2 && r.bottom > vh / 2
      })
      if (!current) return

      const idx  = sections.indexOf(current)
      const rect = current.getBoundingClientRect()

      // 下向きスクロール: セクション下端に達していたら次のセクションへ
      if (e.deltaY > 0) {
        const atBottom = rect.bottom <= vh + EDGE_THRESHOLD
        if (atBottom && idx < sections.length - 1) {
          e.preventDefault()
          lenis.scrollTo(sections[idx + 1], { duration: JUMP_DURATION, easing: jumpEasing })
          lastJumpAt = now
        }
        return
      }

      // 上向きスクロール: セクション上端に達していたら前のセクションへ
      if (e.deltaY < 0) {
        const atTop = rect.top >= -EDGE_THRESHOLD
        if (atTop && idx > 0) {
          e.preventDefault()
          lenis.scrollTo(sections[idx - 1], { duration: JUMP_DURATION, easing: jumpEasing })
          lastJumpAt = now
        }
        return
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [lenis])
}
