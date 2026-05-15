"use client"

import { useState } from "react"
import { z } from "zod"
import type { DiagnosisFlow } from "@/hooks/use-diagnosis-flow"

// ============================================================
// ACT 5 — BOOKING (Zoom 予約フォーム)
// ============================================================

const formSchema = z.object({
  name:     z.string().min(1, "お名前を入力してください"),
  email:    z.string().email("正しいメールアドレスを入力してください"),
  phone:    z.string().optional(),
  date1:    z.string().optional(),
  date2:    z.string().optional(),
  date3:    z.string().optional(),
  message:  z.string().max(1000).optional(),
  honeypot: z.string().max(0, ""),  // bot trap
})

type FormData = z.infer<typeof formSchema>

interface Props {
  flow: DiagnosisFlow
}

export function Act5Booking({ flow }: Props) {
  const [form,       setForm]       = useState<FormData>({
    name: "", email: "", phone: "", date1: "", date2: "", date3: "", message: "", honeypot: "",
  })
  const [errors,     setErrors]     = useState<Partial<Record<keyof FormData, string>>>({})
  const [status,     setStatus]     = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMsg,   setErrorMsg]   = useState("")

  const set = (key: keyof FormData, value: string) => {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    setErrorMsg("")

    const parsed = formSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: typeof errors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormData
        fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      setStatus("idle")
      return
    }

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          answers:     flow.answers,
          matchResult: flow.matchResult
            ? {
                main:     flow.matchResult.main.map(s => ({
                  id:           s.customer.id,
                  displayName:  s.customer.displayName,
                  industry:     s.customer.industry,
                  urgency:      s.customer.urgency,
                  score:        s.breakdown.total,
                })),
                nearMiss: flow.matchResult.nearMiss.map(s => ({
                  id:           s.customer.id,
                  displayName:  s.customer.displayName,
                  industry:     s.customer.industry,
                  urgency:      s.customer.urgency,
                  score:        s.breakdown.total,
                })),
              }
            : null,
          source: typeof window !== "undefined"
            ? sessionStorage.getItem("diagnosis_source") ?? "direct"
            : "direct",
        }),
      })
      if (res.ok) {
        setStatus("success")
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error ?? "送信に失敗しました。しばらくしてからお試しください。")
        setStatus("error")
      }
    } catch {
      setErrorMsg("ネットワークエラーが発生しました。")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div
        data-dark-bg
        className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="text-5xl mb-6">✓</div>
        <h2
          className="text-white font-bold mb-4"
          style={{ fontSize: "clamp(22px, 4vw, 36px)" }}
        >
          お申し込みありがとうございます
        </h2>
        <p className="text-white/60 text-sm max-w-md leading-relaxed">
          ご入力いただいたメールアドレスに確認のご連絡をお送りします。
          通常 1〜2 営業日以内にご連絡いたします。
        </p>
      </div>
    )
  }

  const urgentCount = flow.matchResult
    ? [...flow.matchResult.main, ...flow.matchResult.nearMiss].filter(
        s => s.customer.urgency === "高"
      ).length
    : 0

  return (
    <div
      data-dark-bg
      className="min-h-screen bg-[#0a0a0a] px-6 py-12 md:py-16 max-w-lg mx-auto"
    >
      <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-6">Step 5 / 5</p>
      <h2
        className="text-white font-bold mb-3"
        style={{ fontSize: "clamp(22px, 4vw, 36px)" }}
      >
        Zoom 相談を予約する
      </h2>
      <p className="text-white/50 text-sm mb-8 leading-relaxed">
        {urgentCount > 0 && (
          <span className="text-red-400">
            緊急度「高」の案件が {urgentCount} 件あります。
            お早めにご相談ください。{" "}
          </span>
        )}
        30 分の無料 Zoom でマッチした顧客の詳細をご説明します。
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* honeypot — hidden */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          aria-hidden
          className="hidden"
          value={form.honeypot}
          onChange={e => set("honeypot", e.target.value)}
          autoComplete="off"
        />

        {/* お名前 */}
        <div>
          <label className="text-white/70 text-xs block mb-1">
            お名前 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            autoComplete="name"
            className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-white/50 transition-colors ${errors.name ? "border-red-500/60" : "border-white/20"}`}
            placeholder="山田 太郎"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* メールアドレス */}
        <div>
          <label className="text-white/70 text-xs block mb-1">
            メールアドレス <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={e => set("email", e.target.value)}
            autoComplete="email"
            inputMode="email"
            className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-white/50 transition-colors ${errors.email ? "border-red-500/60" : "border-white/20"}`}
            placeholder="taro@example.com"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* 電話番号（任意） */}
        <div>
          <label className="text-white/70 text-xs block mb-1">
            電話番号 <span className="text-white/30">任意</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => set("phone", e.target.value)}
            autoComplete="tel"
            inputMode="tel"
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-white/50 transition-colors"
            placeholder="090-0000-0000"
          />
        </div>

        {/* 希望日時 */}
        <div>
          <label className="text-white/70 text-xs block mb-2">
            ご希望の日時 <span className="text-white/30">任意・第3希望まで</span>
          </label>
          <div className="space-y-2">
            {(["date1", "date2", "date3"] as const).map((key, i) => (
              <input
                key={key}
                type="text"
                value={form[key]}
                onChange={e => set(key, e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-white/50 transition-colors"
                placeholder={`第${i + 1}希望（例：5月20日 14時〜）`}
              />
            ))}
          </div>
        </div>

        {/* ご質問 */}
        <div>
          <label className="text-white/70 text-xs block mb-1">
            ご質問・ご相談内容 <span className="text-white/30">任意</span>
          </label>
          <textarea
            value={form.message}
            onChange={e => set("message", e.target.value)}
            rows={3}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-white/50 transition-colors resize-none"
            placeholder="気になることがあればご記入ください"
          />
        </div>

        {status === "error" && (
          <p className="text-red-400 text-sm">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          data-cursor
          className="w-full py-4 bg-white text-black font-bold rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "送信中..." : "Zoom 相談を申し込む"}
        </button>

        <p className="text-white/30 text-xs text-center">
          送信された情報はZoom相談のスケジュール調整にのみ使用します。
        </p>
      </form>
    </div>
  )
}
