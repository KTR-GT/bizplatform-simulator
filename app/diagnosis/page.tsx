import type { Metadata } from "next"
import { DiagnosisFlow } from "@/components/diagnosis/diagnosis-flow"

// ============================================================
// /diagnosis — ② AI診断 顧客マッチング
// ============================================================
// Phase 1 では幕1・幕2 を本実装。幕3〜5 はプレースホルダー。

export const metadata: Metadata = {
  title: "AI診断 顧客マッチング | BizplatForm",
  description: "あなたの事務所に、どんな顧客が来るのか。6 つの質問に答えるだけで、全国 500 社から先生にマッチする顧客像をご紹介します。",
}

export default function DiagnosisPage() {
  return <DiagnosisFlow />
}
