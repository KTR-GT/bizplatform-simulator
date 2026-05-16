"use client"

import { useEffect } from "react"
import { useLenis } from "lenis/react"

/**
 * スライドショー型ナビゲーション。
 * ホイール 1 回 / 矢印キー / スワイプで前後の section[data-snap] へジャンプ。
 * スクロール量は無視、方向のみ参照。
 * 800ms cooldown で連発抑制。prefers-reduced-motion 環境では無効。
 */
export function useSectionSnap() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis || typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let lastJumpAt = 0
    const COOLDOWN = 550

    const goTo = (delta: 1 | -1) => {
      const now = performance.now()
      if (now - lastJumpAt < COOLDOWN) return

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("section[data-snap]"),
      )
      if (!sections.length) return

      const vh = window.innerHeight
      let currentIdx = sections.findIndex((s) => {
        const r = s.getBoundingClientRect()
        return r.top <= vh / 2 && r.bottom > vh / 2
      })
      if (currentIdx === -1) currentIdx = 0

      const nextIdx = Math.min(Math.max(currentIdx + delta, 0), sections.length - 1)
      if (nextIdx === currentIdx) return

      lenis.scrollTo(sections[nextIdx], {
        duration: 0.45,
        easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      })
      lastJumpAt = now
    }

    const onWheel = (e: WheelEvent) => {
      // S5 のテーブル等、スクロール許可エリアでは透過させる
      const allow = (e.target as HTMLElement | null)?.closest?.("[data-snap-scrollable]")
      if (allow) return

      e.preventDefault()
      if (Math.abs(e.deltaY) < 5) return
      goTo(e.deltaY > 0 ? 1 : -1)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault()
        goTo(1)
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault()
        goTo(-1)
      }
    }

    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(dy) < 40) return
      const allow = (e.target as HTMLElement | null)?.closest?.("[data-snap-scrollable]")
      if (allow) return
      goTo(dy > 0 ? 1 : -1)
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("keydown", onKey)
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchend", onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchend", onTouchEnd)
    }
  }, [lenis])
}
