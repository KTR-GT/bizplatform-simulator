import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// ============================================================
// POST /api/booking — Zoom 予約フォーム受付 + Google Chat 通知
// ============================================================

const bodySchema = z.object({
  name:     z.string().min(1).max(100),
  email:    z.string().email(),
  phone:    z.string().max(20).optional(),
  date1:    z.string().max(100).optional(),
  date2:    z.string().max(100).optional(),
  date3:    z.string().max(100).optional(),
  message:  z.string().max(1000).optional(),
  honeypot: z.string().max(0),  // bot trap
  answers:  z.object({
    phase:            z.string().nullable(),
    themes:           z.array(z.string()),
    industries:       z.array(z.string()),
    areas:            z.array(z.string()),
    engagementStyles: z.array(z.string()),
    identity:         z.string(),
  }).optional(),
  matchResult: z.object({
    main:     z.array(z.object({
      id: z.string(), displayName: z.string(), industry: z.string(),
      urgency: z.string(), score: z.number(),
    })),
    nearMiss: z.array(z.object({
      id: z.string(), displayName: z.string(), industry: z.string(),
      urgency: z.string(), score: z.number(),
    })),
  }).nullable().optional(),
  source: z.string().max(50).optional(),
})

// シンプルな IP ベースレート制限（インメモリ）
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const RATE_WINDOW_MS = 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

function buildChatMessage(data: z.infer<typeof bodySchema>): string {
  const dates = [data.date1, data.date2, data.date3].filter(Boolean).join(" / ") || "未記入"
  const urgentCount = data.matchResult
    ? [...data.matchResult.main, ...data.matchResult.nearMiss].filter(m => m.urgency === "高").length
    : 0

  const matchLines = data.matchResult
    ? [
        "*【マッチ結果 メイン3社】*",
        ...data.matchResult.main.map(
          (m, i) => `${i + 1}. ${m.displayName}（${m.industry}）スコア ${m.score} 緊急度:${m.urgency}`,
        ),
        ...(data.matchResult.nearMiss.length > 0
          ? ["*【ニアミス2社】*", ...data.matchResult.nearMiss.map(
              m => `・${m.displayName}（${m.industry}）スコア ${m.score}`,
            )]
          : []),
      ].join("\n")
    : "（診断結果なし）"

  const hearingLines = data.answers
    ? [
        `フェーズ: ${data.answers.phase ?? "未回答"}`,
        `テーマ: ${data.answers.themes.join("・") || "幅広く"}`,
        `業種: ${data.answers.industries.join("・") || "特になし"}`,
        `エリア: ${data.answers.areas.join("・")}`,
        `関与スタイル: ${data.answers.engagementStyles.join("・") || "未指定"}`,
        `自由記述: ${data.answers.identity || "なし"}`,
      ].join("\n")
    : "（ヒアリングデータなし）"

  return [
    "━━━━━━━━━━━━━━━━━━━━━━",
    `📋 *新規 Zoom 相談申し込み* （流入: ${data.source ?? "direct"}）`,
    "━━━━━━━━━━━━━━━━━━━━━━",
    `*お名前:* ${data.name}`,
    `*メール:* ${data.email}`,
    `*電話:* ${data.phone || "未記入"}`,
    `*希望日時:* ${dates}`,
    `*ご相談:* ${data.message || "なし"}`,
    "",
    "*【ヒアリング回答】*",
    hearingLines,
    "",
    matchLines,
    "",
    urgentCount > 0 ? `🔥 緊急度「高」 ${urgentCount} 件あり` : "",
    "━━━━━━━━━━━━━━━━━━━━━━",
  ].filter(l => l !== undefined).join("\n")
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "送信が多すぎます。しばらくしてからお試しください。" }, { status: 429 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: "入力値が不正です", details: parsed.error.flatten() }, { status: 422 })
  }

  const data = parsed.data

  // Google Chat Webhook 送信
  const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: buildChatMessage(data) }),
      })
    } catch (err) {
      console.error("Google Chat webhook failed:", err)
      // Webhook 失敗でもフォーム送信は成功扱い
    }
  } else {
    console.warn("GOOGLE_CHAT_WEBHOOK_URL is not set")
  }

  return NextResponse.json({ ok: true })
}
