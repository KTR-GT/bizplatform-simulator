"use client"

import { useState } from "react"
import { GrowthSimulator } from "@/components/growth-simulator"
import { TopPage } from "@/components/top-page"

// Phase 4: 旧 / の内容をそのまま /simulator に移設。
// Phase 6 でリブランド（グローバルナビ統合・物理分割・お試しプラン）を行う。

export default function SimulatorPage() {
  const [phase, setPhase]           = useState<"top" | "simulator">("top")
  const [officeName, setOfficeName] = useState("")

  const handleStart = (name: string) => {
    setOfficeName(name)
    setPhase("simulator")
  }

  if (phase === "top") {
    return <TopPage onStart={handleStart} />
  }

  return <GrowthSimulator initialDisplayName={officeName} />
}
