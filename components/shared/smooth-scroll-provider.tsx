"use client"

import { ReactLenis } from "lenis/react"

interface Props {
  children: React.ReactNode
}

/**
 * Lenis によるスムーススクロール統括 (Apple / Stripe 系の感触)。
 * prefers-reduced-motion 環境ではブラウザ標準スクロールに退避。
 */
export function SmoothScrollProvider({ children }: Props) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (reduced) return <>{children}</>

  return (
    <ReactLenis
      root
      options={{
        duration: 1.0,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        wheelMultiplier: 0.8,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
