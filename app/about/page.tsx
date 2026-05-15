import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { companyInfo } from "@/data/company-info"
import { marketStats } from "@/data/market-reference"
import { partnerCases } from "@/data/partner-cases"
import { RevealSection } from "@/components/shared/reveal-section"
import { KpiGrid } from "@/components/about/kpi-grid"

export const metadata: Metadata = {
  title:       "BizplatFormについて | サービスの仕組み・実績・市場背景",
  description: "全国 2,000 事務所が選んだ AI 顧客紹介サービス、BizplatForm の仕組み・市場背景・提携事務所の実績をご紹介します。",
}

// ── リージョン別集計 ────────────────────────────────────────
const REGION_ORDER = ["関東", "関西", "東海", "九州・沖縄", "北海道・東北", "中国・四国"] as const

function buildRegionStats() {
  const map = new Map<string, { offices: number; contracts: number }>()
  for (const c of partnerCases) {
    const r = map.get(c.region) ?? { offices: 0, contracts: 0 }
    map.set(c.region, { offices: r.offices + 1, contracts: r.contracts + c.contracts })
  }
  return REGION_ORDER.map(name => ({
    name, ...(map.get(name) ?? { offices: 0, contracts: 0 }),
  }))
}

const regionStats    = buildRegionStats()
const totalContracts = partnerCases.reduce((s, c) => s + c.contracts, 0)
const totalOffices   = partnerCases.length
const topCases       = [...partnerCases].sort((a, b) => b.monthlyFee - a.monthlyFee).slice(0, 6)

const MECHANISM_STEPS = [
  {
    num: "01", title: "コールセンターが\nアウトバウンド発信", tag: "顧客が動く前に接触",
    body: "専門オペレーターが潜在的ニーズを持つ企業に直接アプローチ。ホームページへのアクセスを待たずに接触します。",
    points: [
      "オペレーター × AI で 1日約 2 万件の圧倒的アプローチ",
      "「まだ税理士を探していない」潜在層をターゲット化",
      "40 万件以上の見込み顧客リストを保有",
      "競合との相見積もりを避けるブルーオーシャン市場を開拓",
    ],
  },
  {
    num: "02", title: "課題をヒアリング・\nニーズを確認", tag: "潜在ニーズを顕在化",
    body: "「税理士を探していない」段階でも、財務・税務の困りごとを引き出し、関心を醸成します。",
    points: [
      "業種・規模・現状の課題を丁寧にヒアリング",
      "紹介のタイミング・温度感を見極めてから紹介",
      "ミスマッチを事前に排除し、成約率を高める",
    ],
  },
  {
    num: "03", title: "先生の事務所に\nマッチング・紹介", tag: "競合なしで繋がる",
    body: "業種・ソフト・エリアの適合性を AI が判定し、最適な税理士事務所としてご紹介します。",
    points: [
      "AI が業種・地域・ニーズの 3 軸でスコアリング",
      "1 顧客に対し 1 事務所のみ紹介 (競合不在)",
      "月間約 3,500 件のマッチング、約 1,000 件が顧問契約へ",
    ],
  },
]

// --reveal-delay shorthand
const d = (ms: number): React.CSSProperties => ({ "--reveal-delay": `${ms}ms` } as React.CSSProperties)

// ============================================================
// PAGE
// ============================================================
export default function AboutPage() {
  return (
    <div className="bg-white text-[#0a0a0a]">

      {/* ── ヘッダー ──────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-5 md:px-10 md:py-7 border-b border-black/8">
        <Link href="/" className="font-inter font-black text-[#0a0a0a] text-sm tracking-[0.22em] uppercase select-none hover:opacity-60 transition-opacity">
          BizplatForm
        </Link>
        <nav className="hidden md:flex items-center gap-7" aria-label="グローバルナビ">
          {[
            { href: "/about",     label: "About",        active: true  },
            { href: "/diagnosis", label: "AI Diagnosis", active: false },
            { href: "/simulator", label: "Simulator",    active: false },
          ].map(({ href, label, active }) => (
            <Link key={href} href={href}
              className={`text-xs tracking-wide transition-colors ${active ? "text-[#0a0a0a]" : "text-black/35 hover:text-black/70"}`}
            >{label}</Link>
          ))}
        </nav>
        <Link href="/diagnosis" className="md:hidden text-[#0a0a0a]/55 text-xs tracking-widest border border-black/20 rounded-full px-3 py-1.5 hover:text-[#0a0a0a]/80 transition-colors">
          AI診断
        </Link>
      </header>

      <main>

        {/* ══════════════════════════════════════════════════
            S1: HERO — ページロード stagger
        ══════════════════════════════════════════════════ */}
        <section
          data-snap
          className="min-h-[90vh] md:min-h-screen flex flex-col justify-center px-6 md:px-10 py-16 md:py-20 max-w-5xl mx-auto w-full"
        >
          <p className="text-black/30 text-[10px] tracking-[0.35em] uppercase mb-6 font-inter font-black stagger-1">
            01 / About
          </p>
          <h1
            className="font-black leading-[1.1] mb-8 tracking-tight"
            style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
          >
            <span className="block stagger-2">先生は、</span>
            <span className="block stagger-3">どんなお客様を選びますか?</span>
          </h1>
          <p
            className="text-black/55 max-w-[52ch] stagger-4"
            style={{ fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: 1.8 }}
          >
            営業時間ゼロで、本業に集中する先生のもとへ、<br />
            私たちが先生に合うお客様を届けます。<br />
            全国 2,000 事務所が選んだ仕組みです。
          </p>
        </section>

        {/* ══════════════════════════════════════════════════
            S2: Company
        ══════════════════════════════════════════════════ */}
        <RevealSection>
          <section
            data-snap
            className="border-t border-black/8 min-h-[90vh] md:min-h-screen flex flex-col justify-center px-6 md:px-10 py-16 md:py-24"
          >
            <div className="max-w-5xl mx-auto w-full">

              <p data-reveal-pop="" style={d(0)}
                className="text-black/30 text-[10px] tracking-[0.35em] uppercase mb-3 font-inter font-black">
                02 / Company
              </p>
              <div aria-hidden data-reveal-border="" style={d(40)} className="h-px bg-black/10 mb-7" />

              <h2 className="font-black leading-[1.05] mb-6 tracking-tight"
                style={{ fontSize: "clamp(30px, 4.5vw, 64px)" }}>
                <span data-reveal-sm="" style={d(80)} className="block">{companyInfo.vision}</span>
              </h2>
              <p data-reveal="" style={{ ...d(180), fontSize: "clamp(14px, 1.2vw, 17px)" }}
                className="text-black/55 leading-relaxed mb-14 max-w-[60ch]">
                {companyInfo.mission}
              </p>

              {/* KPI カウントアップ */}
              <KpiGrid items={companyInfo.kpiNumbers} />

              {/* 会社概要 */}
              <div className="mb-14 max-w-2xl">
                <p data-reveal-sm="" style={d(280)} className="text-[10px] text-black/30 tracking-[0.25em] uppercase mb-5 font-inter font-black">会社概要</p>
                <dl className="divide-y divide-black/6">
                  {[
                    { dt: "会社名",   dd: companyInfo.name },
                    { dt: "設立",     dd: companyInfo.founded },
                    { dt: "代表者",   dd: `${companyInfo.representative.title} ${companyInfo.representative.name}` },
                    { dt: "事業内容", dd: companyInfo.business },
                  ].map(({ dt, dd }, i) => (
                    <div key={dt} data-reveal-pop="" style={d(320 + i * 60)} className="flex gap-6 py-3.5">
                      <dt className="text-[12px] text-black/40 w-20 flex-shrink-0 font-inter">{dt}</dt>
                      <dd className="text-[12px] text-[#0a0a0a] leading-relaxed">{dd}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* 拠点 */}
              <div className="mb-14">
                <p data-reveal-sm="" style={d(460)} className="text-[10px] text-black/30 tracking-[0.25em] uppercase mb-5 font-inter font-black">拠点</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  {companyInfo.offices.map((office, i) => (
                    <div key={office.name} data-reveal-pop="" style={d(500 + i * 80)} className="border border-black/8 px-5 py-5">
                      <p className="text-[10px] text-black/38 tracking-[0.2em] uppercase font-inter mb-3">{office.name}</p>
                      <p className="text-[12px] text-[#0a0a0a] leading-relaxed mb-2">〒{office.postalCode}<br />{office.address}</p>
                      <p className="text-[12px] text-black/50 font-inter">{office.tel}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 主要取引先 */}
              <div>
                <p data-reveal-sm="" style={d(680)} className="text-[10px] text-black/30 tracking-[0.25em] uppercase mb-4 font-inter font-black">主要取引先</p>
                <ul className="flex flex-col sm:flex-row gap-3">
                  {companyInfo.notableClients.map((client, i) => (
                    <li key={client} data-reveal-pop="" style={d(720 + i * 80)} className="border border-black/8 px-4 py-3 text-[12px] text-[#0a0a0a]">{client}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </RevealSection>

        {/* ══════════════════════════════════════════════════
            S3: Mechanism (黒背景)
        ══════════════════════════════════════════════════ */}
        <RevealSection>
          <section
            data-snap
            className="border-t border-black/8 bg-[#0a0a0a] text-white min-h-[90vh] md:min-h-screen flex flex-col justify-center px-6 md:px-10 py-16 md:py-24"
          >
            <div className="max-w-5xl mx-auto w-full">
              <p data-reveal-pop="" style={d(0)}
                className="text-white/30 text-[10px] tracking-[0.35em] uppercase mb-3 font-inter font-black">
                03 / Mechanism
              </p>
              <div aria-hidden data-reveal-border="" style={d(40)} className="h-px bg-white/12 mb-7" />

              <h2 className="font-black leading-[1.1] mb-12 tracking-tight"
                style={{ fontSize: "clamp(24px, 3vw, 44px)" }}>
                <span data-reveal-sm="" style={d(80)} className="block">口コミに頼らない、</span>
                <span data-reveal-sm="" style={d(160)} className="block">3 ステップの集客構造</span>
              </h2>

              <div className="grid md:grid-cols-3 gap-px bg-white/8">
                {MECHANISM_STEPS.map((step, i) => (
                  <div key={step.num} data-reveal-pop="" style={d(200 + i * 100)} className="bg-[#0a0a0a] p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="font-serif-display text-white/20 leading-none" style={{ fontSize: "clamp(36px, 3.5vw, 52px)" }}>
                        {step.num}
                      </span>
                      <span className="text-[10px] text-white/40 border border-white/20 rounded-full px-2.5 py-1 font-inter tracking-wider">
                        {step.tag}
                      </span>
                    </div>
                    <h3 className="font-black text-white leading-snug mb-4 whitespace-pre-line" style={{ fontSize: "clamp(16px, 1.5vw, 20px)" }}>
                      {step.title}
                    </h3>
                    <p className="text-white/50 text-[13px] leading-relaxed mb-6">{step.body}</p>
                    <ul className="space-y-2.5">
                      {step.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-white/40 flex-shrink-0 mt-0.5" strokeWidth={2} />
                          <span className="text-[12px] text-white/60 leading-snug">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </RevealSection>

        {/* ══════════════════════════════════════════════════
            S4: Market
        ══════════════════════════════════════════════════ */}
        <RevealSection>
          <section
            data-snap
            className="border-t border-black/8 min-h-[90vh] md:min-h-screen flex flex-col justify-center px-6 md:px-10 py-16 md:py-24"
          >
            <div className="max-w-5xl mx-auto w-full">
              <p data-reveal-pop="" style={d(0)}
                className="text-black/30 text-[10px] tracking-[0.35em] uppercase mb-3 font-inter font-black">
                04 / Market
              </p>
              <div aria-hidden data-reveal-border="" style={d(40)} className="h-px bg-black/10 mb-7" />

              <h2 className="font-black leading-[1.1] mb-4 tracking-tight"
                style={{ fontSize: "clamp(24px, 3vw, 44px)" }}>
                <span data-reveal-sm="" style={d(80)} className="block">なぜ今、このサービスが必要か。</span>
              </h2>
              <p data-reveal="" style={d(160)} className="text-black/50 text-[13px] mb-10 max-w-[60ch] leading-relaxed">
                以下の数字はすべて推計・参考値です。公的統計に基づく解釈であり、確定的な数値を保証するものではありません。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/8 border border-black/8">
                {marketStats.map((stat, i) => (
                  <div key={stat.label} data-reveal-pop="" style={d(220 + i * 60)} className="bg-white px-5 py-6 md:px-7 md:py-7">
                    <div className="flex items-start gap-2 mb-3">
                      <p className="text-[11px] text-black/40 leading-snug flex-1">{stat.label}</p>
                      {stat.isEstimate && (
                        <span className="text-[9px] text-black/30 border border-black/15 rounded px-1.5 py-0.5 flex-shrink-0 tracking-wide">推計</span>
                      )}
                    </div>
                    <p className="font-black text-[#0a0a0a] leading-none mb-2" style={{ fontSize: "clamp(24px, 2.5vw, 36px)" }}>{stat.value}</p>
                    <p className="text-[11px] text-black/38 leading-snug">{stat.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </RevealSection>

        {/* ══════════════════════════════════════════════════
            S5: Results
        ══════════════════════════════════════════════════ */}
        <RevealSection>
          <section
            data-snap
            className="border-t border-black/8 min-h-[90vh] md:min-h-screen flex flex-col justify-center px-6 md:px-10 py-16 md:py-24 bg-[#fafafa]"
          >
            <div className="max-w-5xl mx-auto w-full">
              <p data-reveal-pop="" style={d(0)}
                className="text-black/30 text-[10px] tracking-[0.35em] uppercase mb-3 font-inter font-black">
                05 / Results
              </p>
              <div aria-hidden data-reveal-border="" style={d(40)} className="h-px bg-black/10 mb-7" />

              <h2 className="font-black leading-[1.1] mb-4 tracking-tight"
                style={{ fontSize: "clamp(24px, 3vw, 44px)" }}>
                <span data-reveal-sm="" style={d(80)} className="block">全国 {totalOffices} 事務所・</span>
                <span data-reveal-sm="" style={d(160)} className="block">累計 {totalContracts.toLocaleString()} 件の実績</span>
              </h2>
              <p data-reveal="" style={d(240)} className="text-black/45 text-[13px] mb-12 max-w-[60ch] leading-relaxed">
                提携事務所の月間顧問料合計・成約件数の一部をご紹介します。
                地方都市でも、少数精鋭型でも、それぞれの戦略で成果を上げています。
              </p>

              {/* エリア別 */}
              <div className="mb-14">
                <p data-reveal-sm="" style={d(280)} className="text-[10px] text-black/30 tracking-[0.25em] uppercase mb-5 font-inter font-black">エリア別 提携状況</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-black/8 border border-black/8">
                  {regionStats.map((r, i) => (
                    <div key={r.name} data-reveal-pop="" style={d(320 + i * 60)} className="bg-white px-5 py-5 md:px-6 md:py-6">
                      <p className="text-[11px] text-black/40 mb-2 font-inter">{r.name}</p>
                      <p className="font-black text-[#0a0a0a] leading-none mb-1" style={{ fontSize: "clamp(22px, 2.2vw, 32px)" }}>
                        {r.offices}<span className="text-[13px] font-bold ml-1">事務所</span>
                      </p>
                      <p className="text-[11px] text-black/40">累計 {r.contracts.toLocaleString()} 件</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* テーブル */}
              <div>
                <p data-reveal-sm="" style={d(640)} className="text-[10px] text-black/30 tracking-[0.25em] uppercase mb-5 font-inter font-black">月間顧問料 上位事務所 (一部抜粋)</p>
                <div className="overflow-x-auto -mx-6 md:mx-0">
                  <table className="min-w-full border-collapse text-[13px]">
                    <thead>
                      <tr data-reveal-sm="" style={d(680)} className="border-b border-black/8">
                        <th className="text-left py-3 px-6 md:px-4 text-[10px] text-black/35 font-inter tracking-[0.15em] uppercase font-medium w-full">事務所名</th>
                        <th className="text-right py-3 px-4 text-[10px] text-black/35 font-inter tracking-[0.15em] uppercase font-medium whitespace-nowrap">エリア</th>
                        <th className="text-right py-3 px-4 text-[10px] text-black/35 font-inter tracking-[0.15em] uppercase font-medium whitespace-nowrap">成約件数</th>
                        <th className="text-right py-3 pl-4 pr-6 md:pr-4 text-[10px] text-black/35 font-inter tracking-[0.15em] uppercase font-medium whitespace-nowrap">月間顧問料計</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {topCases.map((c, i) => (
                        <tr key={c.name} data-reveal-sm="" style={d(720 + i * 50)} className="hover:bg-black/[0.02] transition-colors">
                          <td className="py-3.5 px-6 md:px-4">
                            <div className="flex items-center gap-2.5">
                              <span className="text-[10px] text-black/25 font-inter w-4 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                              <span className="text-[#0a0a0a] font-medium">{c.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right text-black/50 whitespace-nowrap">{c.area}</td>
                          <td className="py-3.5 px-4 text-right font-medium tabular-nums whitespace-nowrap">{c.contracts} 件</td>
                          <td className="py-3.5 pl-4 pr-6 md:pr-4 text-right font-bold tabular-nums whitespace-nowrap">¥{(c.monthlyFee / 10000).toFixed(1)}万</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p data-reveal-sm="" style={d(1020)} className="text-[11px] text-black/30 mt-4">
                  ※ 上記は公開情報をもとにした参考事例の一部抜粋です。成果を保証するものではありません。
                </p>
              </div>
            </div>
          </section>
        </RevealSection>

        {/* ══════════════════════════════════════════════════
            S6: CTA
        ══════════════════════════════════════════════════ */}
        <RevealSection>
          <section
            data-snap
            className="border-t border-black/8 min-h-[60vh] md:min-h-[70vh] flex flex-col justify-center px-6 md:px-10 py-16 md:py-24"
          >
            <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row md:items-end md:justify-between gap-10">
              <div>
                <p data-reveal-pop="" style={d(0)}
                  className="text-black/30 text-[10px] tracking-[0.35em] uppercase mb-3 font-inter font-black">
                  06 / Next Step
                </p>
                <div aria-hidden data-reveal-border="" style={d(40)} className="h-px bg-black/10 mb-7" />

                <h2 className="font-black leading-[1.1] mb-5 tracking-tight"
                  style={{ fontSize: "clamp(24px, 3vw, 44px)" }}>
                  <span data-reveal-sm="" style={d(80)} className="block">先生の事務所に、</span>
                  <span data-reveal-sm="" style={d(160)} className="block">どんな顧客が来るのか。</span>
                </h2>
                <p data-reveal="" style={d(240)} className="text-black/50 text-[14px] max-w-[44ch] leading-relaxed">
                  AI 診断は 5 分。設問に答えるだけで、あなたの事務所にマッチする顧客像が見えます。
                </p>
              </div>
              <Link
                href="/diagnosis"
                data-reveal-pop=""
                style={d(320)}
                className="group inline-flex items-center gap-3 bg-[#0a0a0a] text-white px-7 py-4 text-[13px] font-bold tracking-[0.18em] uppercase hover:bg-black/80 transition-colors self-start md:self-auto flex-shrink-0"
              >
                AI 診断をはじめる
                <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </section>
        </RevealSection>

      </main>

      <footer className="px-6 py-5 md:px-10 border-t border-black/8">
        <p className="text-black/20 text-[11px] text-center">© 2026 株式会社BizplatForm</p>
      </footer>
    </div>
  )
}
