"use client"

import { useEffect } from "react"
import { useLenis } from "lenis/react"

/**
 * ホイール delta が一定以上溜まったら次の section[data-snap] に
 * Lenis でジャンプ。Apple 系のなめらかな切替を実現する。
 * prefers-reduced-motion 環境では発火しない。
 */
export function useSectionSnap() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let lastJumpAt = 0
    const COOLDOWN  = 1200
    const DELTA_MIN = 30

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
      const current = sections.find((s) => {
        const r = s.getBoundingClientRect()
        return r.top <= 100 && r.bottom > 100
      })
      if (!current) return

      const idx     = sections.indexOf(current)
      const nextIdx = e.deltaY > 0 ? idx + 1 : idx - 1
      const target  = sections[nextIdx]
      if (!target) return

      e.preventDefault()
      lenis.scrollTo(target, { duration: 1.6 })
      lastJumpAt = now
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [lenis])
}
