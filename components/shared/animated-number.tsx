"use client"

import { useEffect, useRef, useState } from "react"
import { useInViewport } from "@/hooks/use-in-viewport"

interface Props {
  to:         number
  from?:      number
  suffix?:    string
  prefix?:    string
  duration?:  number
  className?: string
}

/**
 * viewport に入った瞬間にカウントアップ + scale 登場アニメーション。
 * easeOutCubic / prefers-reduced-motion 対応。
 */
export function AnimatedNumber({
  to,
  from     = 0,
  suffix   = "",
  prefix   = "",
  duration = 1500,
  className,
}: Props) {
  const { ref, inView } = useInViewport({ threshold: 0, rootMargin: "0px 0px -25% 0px" })
  const [display, setDisplay] = useState(from)
  const fired = useRef(false)

  useEffect(() => {
    if (!inView || fired.current) return
    fired.current = true

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(to)
      return
    }

    const startTime = performance.now()
    const tick = (now: number) => {
      const t      = Math.min((now - startTime) / duration, 1)
      const eased  = 1 - Math.pow(1 - t, 3) // easeOutCubic
      const value  = Math.floor(from + (to - from) * eased)
      setDisplay(value)
      if (t < 1) requestAnimationFrame(tick)
      else setDisplay(to)
    }
    requestAnimationFrame(tick)
  }, [inView, from, to, duration])

  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      className={`inline-block transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${inView ? "scale-100" : "scale-[0.92]"} ${className ?? ""}`}
    >
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  )
}
