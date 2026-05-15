"use client"

import { useEffect } from "react"

/**
 * scroll-snap mandatory の発火を少しだけゆっくりに。
 * 連続したホイールイベントを 800ms 単位でグルーピングする。
 */
export function useSnapThrottle(enabled = true) {
  useEffect(() => {
    if (!enabled) return
    if (typeof window === "undefined") return

    let lastSnapAt = 0
    const COOLDOWN_MS = 800

    const onScroll = () => {
      const now = performance.now()
      if (now - lastSnapAt < COOLDOWN_MS) return
      lastSnapAt = now
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [enabled])
}
