"use client"

import { useEffect, useRef, useState } from "react"

interface Options {
  threshold?: number
  rootMargin?: string
}

/**
 * IntersectionObserver ベースの「一度だけ発火」フック。
 * - threshold: 0 → 1px でも見えたら発火
 * - rootMargin: "0px 0px -10% 0px" → viewport 下端より 10% 上で発火
 * - 100ms 遅延でハイドレーション完了後に observe 開始
 * - prefers-reduced-motion が有効な場合は即座に inView = true
 */
export function useInViewport({ threshold = 0, rootMargin = "0px 0px -25% 0px" }: Options = {}) {
  const ref    = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log("[reveal] intersecting →", el.className.slice(0, 60))
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    // ハイドレーション完了後に observe 開始
    const timer = setTimeout(() => observer.observe(el), 100)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  return { ref, inView }
}
