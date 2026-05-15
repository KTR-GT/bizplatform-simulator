"use client"

import { useSectionSnap } from "@/hooks/use-section-snap"

/**
 * Server Component から呼べる薄いラッパー。
 * <SectionSnap /> を置くだけで section[data-snap] へのホイール吸着が有効化。
 */
export function SectionSnap() {
  useSectionSnap()
  return null
}
