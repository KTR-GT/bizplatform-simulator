"use client"

import { useEffect, useRef, useState } from "react"

interface Options {
  threshold?: number
  rootMargin?: string
}

/**
 * IntersectionObserver ベースの「一度だけ発火」フック。
 * prefers-reduced-motion が有効な場合は即座に inView = true。
 */
export function useInViewport({ threshold = 0.08, rootMargin = "0px 0px -60px 0px" }: Options = {}) {
  const ref  = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    // モーション低減設定のユーザーには即表示
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, inView }
}
