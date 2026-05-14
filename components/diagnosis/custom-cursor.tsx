"use client"

import { useEffect, useRef, useState } from "react"

// ============================================================
// CUSTOM CURSOR — ② AI診断 顧客マッチング 専用
// ============================================================
// 既存サイト (TopPage / GrowthSimulator) と同じ挙動:
//   - マウス追従の黒い円（暗背景上では白）
//   - ボタン/リンク/data-cursor 要素にホバーで拡大
//   - data-dark-bg 属性を持つ要素上では白に切替
// モバイル / Touch device では非表示 (app/globals.css の @media で制御)

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
      setHovering(
        !!t.closest("button, a, input, label, select, textarea, [data-cursor]")
      )
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
