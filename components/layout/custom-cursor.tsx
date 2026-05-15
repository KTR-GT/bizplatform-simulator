"use client"

import { useEffect, useRef, useState } from "react"

// グローバルカーソル — 全ページで使用 (app/layout.tsx でマウント)
// - マウス追従の円
// - button/a/input/[data-cursor] にホバーで拡大
// - [data-dark-bg] 上では白に切り替え
// - touch デバイスは globals.css の @media で非表示

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [onDark,   setOnDark]   = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`
        ref.current.style.top  = `${e.clientY}px`
      }
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovering(!!t.closest("button, a, input, label, select, textarea, [data-cursor]"))
      setOnDark(!!t.closest("[data-dark-bg]"))
    }
    window.addEventListener("mousemove", move, { passive: true })
    document.addEventListener("mouseover", over)
    return () => {
      window.removeEventListener("mousemove", move)
      document.removeEventListener("mouseover", over)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className={`custom-cursor${hovering ? " is-hovering" : ""}${onDark ? " is-dark" : ""}`}
    />
  )
}
