import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BizplatForm | 事務所の成長に、コミットします",
  description:
    "全国 2,000 事務所が選んだ AI 顧客紹介サービス。AI 診断・投資シミュレーターで、先生の事務所に来る顧客像を見てください。",
}

// ──────────────────────────────────────────────
// 入口カードのデータ
// ──────────────────────────────────────────────
const ENTRIES = [
  {
    num:        "01",
    badge:      null,
    title:      "BizplatFormについて",
    desc:       "サービスの仕組み・市場背景・提携事務所の実績をご覧いただけます。",
    cta:        "サービスを見る",
    minutes:    3,
    href:       "/about",
    note:       null,
    soon:       true,
  },
  {
    num:        "02",
    badge:      "おすすめ",
    title:      "AI診断　顧客マッチング",
    desc:       "5問に答えるだけで、先生の事務所に来る顧客像が見えます。結果はすぐ表示。",
    cta:        "診断を始める",
    minutes:    5,
    href:       "/diagnosis",
    note:       null,
    soon:       false,
  },
  {
    num:        "03",
    badge:      null,
    title:      "コミットプランシミュレーター",
    desc:       "顧客紹介の件数・顧問料・ROI を数字で確認できます。",
    cta:        "シミュレーターを開く",
    minutes:    10,
    href:       "/simulator",
    note:       "1ヶ月お試しプランあり（¥2,000）",
    soon:       false,
  },
] as const

export default function TopPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col" data-dark-bg>

      {/* ── ヘッダー ─────────────────────────────── */}
      {/* セルフサーブ原則 3.6: ナビは常に近くに */}
      <header className="flex items-center justify-between px-6 py-5 md:px-10 md:py-7 border-b border-white/8 flex-shrink-0">
        <span className="font-inter font-black text-white text-sm tracking-[0.22em] uppercase select-none">
          BizplatForm
        </span>

        {/* デスクトップ: グローバルナビ（薄め） */}
        <nav className="hidden md:flex items-center gap-7" aria-label="グローバルナビ">
          {[
            { href: "/about",            label: "About",        dim: true  },
            { href: "/diagnosis",        label: "AI Diagnosis", dim: false },
            { href: "/simulator",        label: "Simulator",    dim: true  },
            { href: "/diagnosis#booking", label: "お問い合わせ", dim: true  },
          ].map(({ href, label, dim }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs tracking-wide transition-colors ${
                dim ? "text-white/35 hover:text-white/70" : "text-white/70 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* モバイル: AI診断ショートカット（Phase 7 でハンバーガー化） */}
        <Link
          href="/diagnosis"
          className="md:hidden text-white/55 text-xs tracking-widest border border-white/20 rounded-full px-3 py-1.5 hover:text-white/80 transition-colors"
        >
          AI診断
        </Link>
      </header>

      {/* ── メイン ───────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-12 md:py-16">

        {/* ヒーロー */}
        <div className="w-full max-w-2xl mb-12 md:mb-14 text-center md:text-left">
          <p className="text-white/30 text-[11px] tracking-[0.3em] uppercase mb-4 md:mb-5">
            Proposal
          </p>
          <h1
            className="text-white font-black leading-[1.1] mb-4"
            style={{ fontSize: "clamp(32px, 5.5vw, 60px)" }}
          >
            事務所の成長に、<wbr />コミットします。
          </h1>
          {/* セルフサーブ原則 3.5: コピーが営業の代わり */}
          <p
            className="text-white/50 leading-relaxed"
            style={{ fontSize: "clamp(14px, 1.3vw, 16px)" }}
          >
            全国 2,000 事務所が選んだ、AI 顧客紹介サービス。<br className="hidden md:inline" />
            どこから始めるか、選んでください。
          </p>
        </div>

        {/* 3入口カード */}
        <div
          className="w-full max-w-2xl flex flex-col gap-3 md:gap-4"
          role="list"
          aria-label="3つの入口"
        >
          {ENTRIES.map((entry) => (
            <EntryCard key={entry.num} entry={entry} />
          ))}
        </div>

        {/* 補助テキスト: 脱出口・ヘルプへの案内 (原則 3.1・3.5) */}
        <p className="mt-10 text-white/22 text-xs text-center max-w-sm leading-relaxed">
          ご質問は{" "}
          <Link
            href="/diagnosis#booking"
            className="underline underline-offset-2 hover:text-white/50 transition-colors"
          >
            Zoom 相談フォーム
          </Link>
          {" "}からいつでもどうぞ。返信は 1〜2 営業日以内。
        </p>
      </main>

      {/* ── フッター ─────────────────────────────── */}
      <footer className="px-6 py-5 md:px-10 border-t border-white/8 flex-shrink-0">
        <p className="text-white/20 text-[11px] text-center">
          © 2026 株式会社BizplatForm
        </p>
      </footer>
    </div>
  )
}

// ──────────────────────────────────────────────
// 入口カードコンポーネント
// ──────────────────────────────────────────────
type Entry = typeof ENTRIES[number]

function EntryCard({ entry }: { entry: Entry }) {
  const content = (
    <div
      role="listitem"
      className={[
        "group relative flex items-start md:items-center gap-5 md:gap-8",
        "border rounded-2xl px-5 py-5 md:px-7 md:py-6",
        "transition-all duration-200",
        entry.soon
          ? "border-white/8 bg-white/[0.01] cursor-default opacity-55 select-none"
          : entry.badge
            ? "border-white/25 bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/40"
            : "border-white/12 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25",
      ].join(" ")}
    >
      {/* ★おすすめバッジ — 視線誘導 */}
      {entry.badge && (
        <span
          className="absolute -top-3 left-5 bg-white text-black text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full"
          aria-label="おすすめ"
        >
          {entry.badge}
        </span>
      )}

      {/* 序数 */}
      <span
        className="font-serif-display text-white/18 flex-shrink-0 leading-none"
        style={{ fontSize: "clamp(26px, 3.5vw, 38px)" }}
        aria-hidden
      >
        {entry.num}
      </span>

      {/* テキスト本体 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap mb-1.5">
          <h2
            className="text-white font-bold leading-tight"
            style={{ fontSize: "clamp(15px, 1.4vw, 17px)" }}
          >
            {entry.title}
          </h2>
          {entry.soon && (
            <span className="text-white/30 text-[10px] tracking-wider border border-white/15 rounded-full px-2 py-0.5 flex-shrink-0">
              準備中
            </span>
          )}
        </div>
        {/* 説明コピー: 意図・メリットを明示 (原則 3.5) */}
        <p
          className="text-white/45 leading-relaxed mb-1.5"
          style={{ fontSize: "clamp(12px, 1.05vw, 13px)" }}
        >
          {entry.desc}
        </p>
        {entry.note && (
          <p className="text-white/28 text-[11px]">{entry.note}</p>
        )}
      </div>

      {/* 右端: 所要時間 + 矢印 */}
      <div className="flex-shrink-0 flex flex-col items-end gap-2 ml-2">
        {/* 所要時間明示: 原則 3.3 進捗の見える化 */}
        <span className="flex items-center gap-1 text-white/28 text-[11px] whitespace-nowrap">
          <Clock size={11} strokeWidth={1.75} aria-hidden />
          約{entry.minutes}分
        </span>
        {!entry.soon && (
          <ArrowRight
            size={15}
            strokeWidth={2}
            className="text-white/35 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white/65"
            aria-hidden
          />
        )}
      </div>
    </div>
  )

  if (entry.soon) return content

  return (
    <Link
      href={entry.href}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-2xl"
      aria-label={`${entry.title}（約${entry.minutes}分）`}
    >
      {content}
    </Link>
  )
}
