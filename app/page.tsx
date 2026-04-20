"use client"

import { useState } from "react"
import { GrowthSimulator } from "@/components/growth-simulator"
import { TopPage } from "@/components/top-page"

export default function Home() {
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
