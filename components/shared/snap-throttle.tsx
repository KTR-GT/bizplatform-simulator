"use client"

import { useSnapThrottle } from "@/hooks/use-snap-throttle"

/**
 * Server Component から呼べる薄いラッパー。
 * page.tsx に <SnapThrottle /> を置くだけで snap cooldown が有効化される。
 */
export function SnapThrottle() {
  useSnapThrottle()
  return null
}
