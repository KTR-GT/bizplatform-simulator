import Link from "next/link"
import type { Metadata } from "next"
import { EntryCards } from "@/components/top-page/entry-cards"

export const metadata: Metadata = {
  title: "BizplatForm | 事務所の成長に、コミットします",
  description:
    "全国 2,000 事務所が選んだ AI 顧客紹介サービス。AI 診断・投資シミュレーターで、先生の事務所に来る顧客像を見てください。",
}

export default function TopPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col" data-dark-bg>

      {/* ── ヘッダー ─────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-5 md:px-10 md:py-7 border-b border-white/8 flex-shrink-0">
        <span className="font-inter font-black text-white text-sm tracking-[0.22em] uppercase select-none">
          BizplatForm
        </span>

        {/* デスクトップ: 薄いグローバルナビ (原則 3.6) */}
        <nav className="hidden md:flex items-center gap-7" aria-label="グローバルナビ">
          {[
            { href: "/about",             label: "About",        dim: true  },
            { href: "/diagnosis",         label: "AI Diagnosis", dim: false },
            { href: "/simulator",         label: "Simulator",    dim: true  },
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

        {/* モバイル: AI診断ショートカット (Phase 7 でハンバーガー化) */}
        <Link
          href="/diagnosis"
          className="md:hidden text-white/55 text-xs tracking-widest border border-white/20 rounded-full px-3 py-1.5 hover:text-white/80 transition-colors"
        >
          AI診断
        </Link>
      </header>

      {/* ── メイン ───────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12 md:py-16">

        {/* ヒーロー */}
        <div className="w-full max-w-2xl mb-12 md:mb-14 text-center md:text-left">
          <p className="text-white/30 text-[11px] tracking-[0.3em] uppercase mb-4 md:mb-5 stagger-1">
            Proposal
          </p>
          <h1
            className="text-white font-black leading-[1.1] mb-4 stagger-2"
            style={{ fontSize: "clamp(32px, 5.5vw, 60px)" }}
          >
            事務所の成長に、<br className="hidden md:block" />
            コミットします。
          </h1>
          <p
            className="text-white/50 leading-relaxed max-w-[46ch] stagger-3"
            style={{ fontSize: "clamp(14px, 1.3vw, 16px)" }}
          >
            全国 2,000 事務所が選んだ、AI 顧客紹介サービス。<br className="hidden md:inline" />
            どこから始めるか、選んでください。
          </p>
        </div>

        {/* 3入口カード (Client Component — ドア演出含む) */}
        <div className="stagger-4 w-full">
          <EntryCards />
        </div>

        {/* 補助テキスト: 脱出口 (原則 3.1・3.5) */}
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
