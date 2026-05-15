"use client"

import { useInViewport } from "@/hooks/use-in-viewport"

interface Props {
  children:    React.ReactNode
  className?:  string
  threshold?:  number
  rootMargin?: string
  as?: "div" | "section"
}

/**
 * スクロール連動フェードイン。
 * 内側の [data-reveal] / [data-reveal-left] 要素にアニメーションが適用される。
 * globals.css の .reveal-section / .is-visible と対応。
 */
export function RevealSection({
  children,
  className  = "",
  threshold  = 0,
  rootMargin = "0px 0px -80px 0px",
  as: Tag    = "div",
}: Props) {
  const { ref, inView } = useInViewport({ threshold, rootMargin })

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement & HTMLElement>}
      className={`reveal-section${inView ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </Tag>
  )
}
