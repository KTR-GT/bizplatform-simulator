"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { type CommitPlan, commitPlans } from "@/data/commit-plans"
import { useSimulatorModel } from "@/hooks/use-simulator-model"
import { customerDatabase } from "@/data/customer-database"
import { marketStats } from "@/data/market-reference"
import { getInstallment } from "@/lib/simulator/installments"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts"

// データは @/data/* からインポート済み。ロジックは @/hooks/use-simulator-model へ移動。

const accountingSoftware        = ["freee", "マネーフォワード", "弥生", "TKC", "JDL", "その他"]
const industries                = ["建設", "小売", "飲食", "製造", "IT", "不動産", "医療福祉", "運輸"]
const areas                     = ["全国", "関東", "関西", "東海", "北海道・東北", "中国・四国", "九州・沖縄"]
const expansionOptions          = ["積極的に増やしたい", "慎重に検討中", "現状維持でよい"] as const
const aiUsageOptions            = ["積極活用している", "一部のみ活用", "ほぼ未活用"] as const
const preferredThemeOptions  = ["節税", "融資", "法人化", "事業承継", "インボイス", "記帳代行"] as const
const revenueRangeOptions    = ["〜500万", "500万〜1,000万", "1,000万〜3,000万", "3,000万〜5,000万", "5,000万〜1億", "1億〜3億", "3億〜"] as const
const accountingStyleOptions    = ["すべて", "月次訪問希望", "クラウド完結", "担当者任せ"] as const
const preferredTypeOptions      = ["すべて", "法人", "個人事業主"] as const
const digitalLevelOptions       = ["すべて", "デジタル初心者", "中程度", "デジタル得意"] as const

const TABS = [
  { id: "hearing",   label: "ヒアリング",         num: "01" },
  { id: "market",    label: "市場背景",           num: "02" },
  { id: "mechanism", label: "集客の仕組み",       num: "03" },
  { id: "diagnosis", label: "現状診断",           num: "04" },
  { id: "matching",  label: "AIマッチング",       num: "05" },
  { id: "plan",      label: "プラン提案",         num: "06" },
  { id: "roi",       label: "ROIシミュレーション", num: "07" },
  { id: "closing",   label: "ご契約・次のステップ", num: "08" },
]

// ============================================================
// CUSTOM CURSOR
// ============================================================
function CustomCursor({ isDark }: { isDark: boolean }) {
  const ref    = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`
        ref.current.style.top  = `${e.clientY}px`
      }
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovering(!!t.closest('button, a, input, label, select, textarea, [data-cursor]'))
    }
    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`custom-cursor${hovering ? ' is-hovering' : ''}${isDark ? ' is-dark' : ''}`}
    />
  )
}

// ============================================================
// ANIMATED NUMBER
// ============================================================
function AnimatedNumber({ value, prefix = "", suffix = "", className = "", duration = 1200 }: {
  value: number; prefix?: string; suffix?: string; className?: string; duration?: number
}) {
  const [displayed, setDisplayed] = useState(0)
  const ref   = useRef<HTMLSpanElement>(null)
  const fired = useRef(false)

  useEffect(() => { fired.current = false; setDisplayed(0) }, [value])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !fired.current) {
        fired.current = true
        const start = Date.now()
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1)
          setDisplayed(Math.round((1 - Math.pow(1 - p, 3)) * value))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        obs.disconnect()
      }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{displayed.toLocaleString("ja-JP")}{suffix}
    </span>
  )
}


// ============================================================
// MAIN COMPONENT
// ============================================================
export function GrowthSimulator() {
  const [activeTab, setActiveTab] = useState("hearing")
  const [animDir,   setAnimDir]   = useState<"right" | "left">("right")
  const [animKey,   setAnimKey]   = useState(0)

  // 01 Hearing
  const [officeName,       setOfficeName]       = useState("")
  const [clientCount,      setClientCount]      = useState("")
  const [capacity,         setCapacity]         = useState("")
  const [employees,        setEmployees]        = useState("")
  const [avgFee,           setAvgFee]           = useState("")
  const [naturalIncrease,  setNaturalIncrease]  = useState("")
  const [naturalDecrease,  setNaturalDecrease]  = useState("")
  const [expansionWill,    setExpansionWill]    = useState<typeof expansionOptions[number]>(expansionOptions[0])
  const [selectedArea,     setSelectedArea]     = useState<string[]>([])
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>([])
  const [ngIndustries,     setNgIndustries]     = useState<string[]>([])
  const [aiUsage,                setAiUsage]                = useState<typeof aiUsageOptions[number]>(aiUsageOptions[2])
  const [preferredAccountingStyle, setPreferredAccountingStyle] = useState<typeof accountingStyleOptions[number]>(accountingStyleOptions[0])
  const [preferredType,          setPreferredType]          = useState<typeof preferredTypeOptions[number]>(preferredTypeOptions[0])
  const [preferredDigitalLevel,  setPreferredDigitalLevel]  = useState<typeof digitalLevelOptions[number]>(digitalLevelOptions[0])
  const [goodThemes,         setGoodThemes]         = useState<string[]>([])
  const [goodIndustries,     setGoodIndustries]      = useState<string[]>([])
  const [preferredRevRanges, setPreferredRevRanges]   = useState<string[]>([])

  const displayName = officeName || "〇〇税理士事務所"

  const {
    capacityNum, avgFeeNum,
    recommendedPlanIndex, diagnosis, chartData, plan,
    totalInvestment, commitRevenue, roi, payback, matched,
  } = useSimulatorModel({
    clientCount, capacity, avgFee,
    naturalIncrease, naturalDecrease,
    selectedSoftware, ngIndustries, selectedArea,
    preferredAccountingStyle, preferredType, preferredDigitalLevel,
    goodThemes, goodIndustries, preferredRevRanges,
  })

  const [showAllPlans, setShowAllPlans] = useState(false)
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(recommendedPlanIndex)
  useEffect(() => { setSelectedPlanIndex(recommendedPlanIndex) }, [recommendedPlanIndex])

  const [simPace,   setSimPace]   = useState(2)
  const [simAvgFee, setSimAvgFee] = useState(0)

  const goToTab = useCallback((tabId: string) => {
    const cur  = TABS.findIndex(t => t.id === activeTab)
    const next = TABS.findIndex(t => t.id === tabId)
    setAnimDir(next >= cur ? "right" : "left")
    setActiveTab(tabId)
    setAnimKey(k => k + 1)
  }, [activeTab])

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  const isDarkTab = activeTab === "market" || activeTab === "closing"

  return (
    <div className={`min-h-screen ${isDarkTab ? "bg-[#0A0A0A]" : "bg-white"} transition-colors duration-500`}>
      <CustomCursor isDark={isDarkTab} />

      {/* HEADER */}
      <header className={`no-print border-b ${isDarkTab ? "border-white/10" : "border-black"} px-8 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-6">
          <span className="font-inter font-bold tracking-[0.18em] uppercase text-sm" style={{ color: isDarkTab ? "#fff" : "#0A0A0A" }}>
            BizplatForm
          </span>
          <span className="text-[10px] tracking-widest uppercase" style={{ color: isDarkTab ? "rgba(255,255,255,0.3)" : "#aaa" }}>
            コミットプラン AIシミュレーター
          </span>
        </div>
        <span className="font-inter text-xs tracking-widest" style={{ color: isDarkTab ? "rgba(255,255,255,0.25)" : "#ccc" }}>
          {displayName}
        </span>
      </header>

      {/* TAB NAV */}
      <nav className={`no-print border-b ${isDarkTab ? "border-white/10" : "border-black"}`}>
        <div className="flex">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                data-cursor
                onClick={() => goToTab(tab.id)}
                className={`
                  flex-1 flex flex-col items-start px-4 py-3 border-r transition-all duration-200
                  ${isDarkTab ? "border-white/10" : "border-black"}
                  ${isActive
                    ? isDarkTab ? "bg-white text-[#0A0A0A]" : "bg-[#0A0A0A] text-white"
                    : isDarkTab ? "bg-transparent text-white/35 hover:text-white/70" : "bg-white text-[#0A0A0A]/30 hover:text-[#0A0A0A]/70"
                  }
                `}
              >
                <span className="font-inter font-black text-[9px] tracking-[0.22em] uppercase tabular-nums mb-0.5">{tab.num}</span>
                <span className="text-[10px] whitespace-nowrap leading-tight">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* CONTENT */}
      <main key={animKey} className={animDir === "right" ? "tab-enter" : "tab-enter-left"}>
        {activeTab === "hearing"   && <HearingTab   {...{ officeName, setOfficeName, clientCount, setClientCount, capacity, setCapacity, employees, setEmployees, avgFee, setAvgFee, naturalIncrease, setNaturalIncrease, naturalDecrease, setNaturalDecrease, expansionWill, setExpansionWill, selectedArea, setSelectedArea, selectedSoftware, setSelectedSoftware, ngIndustries, setNgIndustries, aiUsage, setAiUsage, preferredAccountingStyle, setPreferredAccountingStyle, preferredType, setPreferredType, preferredDigitalLevel, setPreferredDigitalLevel, goodThemes, setGoodThemes, goodIndustries, setGoodIndustries, preferredRevRanges, setPreferredRevRanges, toggle }} />}
        {activeTab === "market"    && <MarketTab />}
        {activeTab === "diagnosis" && <DiagnosisTab diagnosis={diagnosis} capacityNum={capacityNum} avgFeeNum={avgFeeNum} naturalIncrease={naturalIncrease} naturalDecrease={naturalDecrease} />}
        {activeTab === "mechanism" && <MechanismTab />}
        {activeTab === "matching"  && <MatchingTab   matched={matched} hasInput={selectedSoftware.length > 0 || selectedArea.length > 0 || preferredAccountingStyle !== "すべて" || preferredType !== "すべて" || preferredDigitalLevel !== "すべて"} />}
        {activeTab === "plan"      && <PlanTab plan={commitPlans[selectedPlanIndex]} index={selectedPlanIndex} totalInvestment={totalInvestment} commitRevenue={commitRevenue} roi={roi} payback={payback} capacityNum={capacityNum} avgFeeNum={avgFeeNum} showAllPlans={showAllPlans} setShowAllPlans={setShowAllPlans} selectedPlanIndex={selectedPlanIndex} setSelectedPlanIndex={setSelectedPlanIndex} commitPlans={commitPlans} />}
        {activeTab === "roi"       && <ROITab plan={commitPlans[selectedPlanIndex]} roi={roi} payback={payback} totalInvestment={totalInvestment} commitRevenue={commitRevenue} simPace={simPace} setSimPace={setSimPace} simAvgFee={simAvgFee} setSimAvgFee={setSimAvgFee} avgFeeNum={avgFeeNum} matched={matched} />}
        {activeTab === "closing"   && <ClosingTab    displayName={displayName} plan={plan} />}
      </main>

      {/* PREV / NEXT ナビゲーション */}
      {(() => {
        const cur  = TABS.findIndex(t => t.id === activeTab)
        const prev = TABS[cur - 1]
        const next = TABS[cur + 1]
        return (
          <div className={`no-print border-t ${isDarkTab ? "border-white/10" : "border-black"} px-8 py-4 flex justify-between items-center`}>
            {prev ? (
              <button
                data-cursor
                onClick={() => goToTab(prev.id)}
                className={`font-inter font-bold text-[11px] tracking-[0.15em] uppercase flex items-center gap-2 transition-colors ${
                  isDarkTab ? "text-white/35 hover:text-white" : "text-black/30 hover:text-black"
                }`}
              >
                ← {prev.num} {prev.label}
              </button>
            ) : <span />}
            {next ? (
              <button
                data-cursor
                onClick={() => goToTab(next.id)}
                className={`font-inter font-bold text-[11px] tracking-[0.15em] uppercase flex items-center gap-2 transition-colors ${
                  isDarkTab ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"
                }`}
              >
                {next.num} {next.label} →
              </button>
            ) : <span />}
          </div>
        )
      })()}
    </div>
  )
}

// ============================================================
// 01 HEARING
// ============================================================
function HearingTab({ officeName, setOfficeName, clientCount, setClientCount, capacity, setCapacity, employees, setEmployees, avgFee, setAvgFee, naturalIncrease, setNaturalIncrease, naturalDecrease, setNaturalDecrease, expansionWill, setExpansionWill, selectedArea, setSelectedArea, selectedSoftware, setSelectedSoftware, ngIndustries, setNgIndustries, aiUsage, setAiUsage, preferredAccountingStyle, setPreferredAccountingStyle, preferredType, setPreferredType, preferredDigitalLevel, setPreferredDigitalLevel, goodThemes, setGoodThemes, goodIndustries, setGoodIndustries, preferredRevRanges, setPreferredRevRanges, toggle }: any) {
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-12 stagger-1">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-black/30 mb-3">Step 01</p>
        <h1 className="font-serif-display italic text-5xl text-[#0A0A0A] leading-tight">
          先生の事務所を、<br />
          <em className="not-italic font-inter font-black">数字</em>で教えてください。
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-12">
        {/* 左 */}
        <div className="space-y-8">
          <div className="stagger-2">
            <label className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/35 block mb-3">事務所名</label>
            <input type="text" value={officeName} onChange={e => setOfficeName(e.target.value)} placeholder="〇〇税理士事務所"
              className="w-full border-b-2 border-black bg-transparent pb-2 text-2xl font-bold text-[#0A0A0A] outline-none placeholder:text-black/20" />
          </div>

          <div className="grid grid-cols-2 gap-6 stagger-3">
            {[
              { label: "関与先数",      unit: "件", val: clientCount,    set: setClientCount,    ph: "30"    },
              { label: "引受可能数",    unit: "件", val: capacity,       set: setCapacity,       ph: "20"    },
              { label: "従業員数",      unit: "名", val: employees,      set: setEmployees,      ph: "5"     },
              { label: "平均月額顧問料", unit: "円", val: avgFee,         set: setAvgFee,         ph: "25000" },
              { label: "自然増件数（年）", unit: "件", val: naturalIncrease, set: setNaturalIncrease, ph: "0" },
              { label: "自然減件数（年）", unit: "件", val: naturalDecrease, set: setNaturalDecrease, ph: "0" },
            ].map(({ label, unit, val, set, ph }) => (
              <div key={label}>
                <label className="font-inter text-[9px] tracking-[0.18em] uppercase text-black/35 block mb-2">{label}</label>
                <div className="flex items-baseline gap-1 border-b border-black/20 pb-1">
                  <input type="number" value={val} onChange={e => set(e.target.value)} placeholder={ph}
                    className="w-full bg-transparent text-2xl font-inter font-black text-[#0A0A0A] outline-none tabular-nums placeholder:text-black/20" />
                  <span className="text-sm text-black/35">{unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="stagger-4">
            <label className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/35 block mb-3">拡大意欲</label>
            <div className="space-y-2">
              {expansionOptions.map(opt => (
                <label key={opt} className="flex items-center gap-3" data-cursor onClick={() => setExpansionWill(opt)}>
                  <span className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all ${expansionWill === opt ? "border-black bg-black" : "border-black/25"}`}>
                    {expansionWill === opt && <span className="text-white text-[8px]">✓</span>}
                  </span>
                  <span className="text-sm text-[#0A0A0A]">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="stagger-5">
            <label className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/35 block mb-3">AI・デジタルツール活用状況</label>
            <div className="space-y-2">
              {aiUsageOptions.map(opt => (
                <label key={opt} className="flex items-center gap-3" data-cursor onClick={() => setAiUsage(opt)}>
                  <span className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all ${aiUsage === opt ? "border-black bg-black" : "border-black/25"}`}>
                    {aiUsage === opt && <span className="text-white text-[8px]">✓</span>}
                  </span>
                  <span className="text-sm text-[#0A0A0A]">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 右 */}
        <div className="space-y-8">
          <div className="stagger-3">
            <label className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/35 block mb-3">対応エリア</label>
            <div className="flex flex-wrap gap-2">
              {areas.map(area => {
                const on = selectedArea.includes(area)
                return (
                  <button key={area} data-cursor onClick={() => toggle(selectedArea, area, setSelectedArea)}
                    className={`px-3 py-1.5 border text-xs font-inter font-bold uppercase tracking-wider transition-all ${on ? "bg-black text-white border-black" : "bg-white text-black/35 border-black/20 hover:border-black hover:text-black"}`}>
                    {area}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 得意テーマ */}
          <div className="stagger-4">
            <label className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/35 block mb-3">
              得意テーマ <span className="normal-case tracking-normal text-black/25">（複数選択可）</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {preferredThemeOptions.map(t => {
                const on = goodThemes.includes(t)
                return (
                  <button key={t} data-cursor onClick={() => toggle(goodThemes, t, setGoodThemes)}
                    className={`py-2 border text-xs font-bold transition-all ${on ? "bg-black text-white border-black" : "bg-white text-black/35 border-black/20 hover:border-black hover:text-black"}`}>
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 得意業種（加点） */}
          <div className="stagger-5">
            <label className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/35 block mb-1">
              得意業種 <span className="normal-case tracking-normal text-black/25">（マッチ加点）</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {industries.map(ind => {
                const on = goodIndustries.includes(ind)
                return (
                  <button key={ind} data-cursor onClick={() => toggle(goodIndustries, ind, setGoodIndustries)}
                    className={`px-3 py-2 border text-xs font-bold text-left transition-all ${on ? "bg-black text-white border-black" : "bg-white text-black/30 border-black/10 hover:border-black/40 hover:text-black"}`}>
                    {on && "★ "}{ind}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 得意年商レンジ */}
          <div className="stagger-6">
            <label className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/35 block mb-3">得意な年商規模<span className="ml-2 normal-case tracking-normal text-black/25">複数選択可</span></label>
            <div className="space-y-2">
              {/* 指定なし */}
              <label key="all" className="flex items-center gap-3 cursor-pointer" data-cursor
                onClick={() => setPreferredRevRanges([])}>
                <span className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all ${preferredRevRanges.length === 0 ? "border-black bg-black" : "border-black/25"}`}>
                  {preferredRevRanges.length === 0 && <span className="text-white text-[8px]">✓</span>}
                </span>
                <span className="text-sm text-[#0A0A0A]">指定なし</span>
              </label>
              {revenueRangeOptions.map(opt => {
                const on = preferredRevRanges.includes(opt)
                return (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer" data-cursor
                    onClick={() => setPreferredRevRanges(on
                      ? preferredRevRanges.filter((r: string) => r !== opt)
                      : [...preferredRevRanges, opt]
                    )}>
                    <span className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all ${on ? "border-black bg-black" : "border-black/25"}`}>
                      {on && <span className="text-white text-[8px]">✓</span>}
                    </span>
                    <span className="text-sm text-[#0A0A0A]">{opt}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="stagger-4">
            <label className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/35 block mb-3">対応会計ソフト</label>
            <div className="grid grid-cols-3 gap-2">
              {accountingSoftware.map(sw => {
                const on = selectedSoftware.includes(sw)
                return (
                  <button key={sw} data-cursor onClick={() => toggle(selectedSoftware, sw, setSelectedSoftware)}
                    className={`py-2 border text-xs font-bold transition-all ${on ? "bg-black text-white border-black" : "bg-white text-black/35 border-black/20 hover:border-black hover:text-black"}`}>
                    {sw}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="stagger-5">
            <label className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/35 block mb-1">
              NG業種 <span className="normal-case tracking-normal text-black/25">（紹介不要な業種）</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {industries.map(ind => {
                const on = ngIndustries.includes(ind)
                return (
                  <button key={ind} data-cursor onClick={() => toggle(ngIndustries, ind, setNgIndustries)}
                    className={`px-3 py-2 border text-xs font-bold text-left transition-all ${on ? "bg-black text-white border-black" : "bg-white text-black/30 border-black/10 hover:border-black/40 hover:text-black"}`}>
                    {on && "✕ "}{ind}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="stagger-5">
            <label className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/35 block mb-3">
              希望する関与スタイル
            </label>
            <div className="flex flex-wrap gap-2">
              {accountingStyleOptions.map(opt => (
                <button key={opt} data-cursor onClick={() => setPreferredAccountingStyle(opt)}
                  className={`px-3 py-1.5 border text-xs font-inter font-bold tracking-wide transition-all ${preferredAccountingStyle === opt ? "bg-black text-white border-black" : "bg-white text-black/35 border-black/20 hover:border-black hover:text-black"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="stagger-5">
            <label className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/35 block mb-3">
              希望する顧客属性
            </label>
            <div className="flex gap-2">
              {preferredTypeOptions.map(opt => (
                <button key={opt} data-cursor onClick={() => setPreferredType(opt)}
                  className={`px-3 py-1.5 border text-xs font-inter font-bold tracking-wide transition-all ${preferredType === opt ? "bg-black text-white border-black" : "bg-white text-black/35 border-black/20 hover:border-black hover:text-black"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="stagger-5">
            <label className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/35 block mb-3">
              希望するデジタルレベル
            </label>
            <div className="flex flex-wrap gap-2">
              {digitalLevelOptions.map(opt => (
                <button key={opt} data-cursor onClick={() => setPreferredDigitalLevel(opt)}
                  className={`px-3 py-1.5 border text-xs font-inter font-bold tracking-wide transition-all ${preferredDigitalLevel === opt ? "bg-black text-white border-black" : "bg-white text-black/35 border-black/20 hover:border-black hover:text-black"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 02 MARKET
// ============================================================
function MarketTab() {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const [revealedStats, setRevealedStats] = useState<Set<string>>(new Set())
  const toggleReveal = (label: string) => setRevealedStats(prev => {
    const next = new Set(prev)
    next.has(label) ? next.delete(label) : next.add(label)
    return next
  })

  // -------------------------------------------------------
  // 1本バー — 左: アプローチ不可（暗）/ 右: アプローチ可能（明）
  //
  // 左側 (dark) ≈ 20%
  //   大変満足: 20% × 55% = 11%
  //   顕在層:   10% × 55% =  6%  ← 競合他社が対応
  //   明確探索:  7% × 45% =  3%  ← 競合他社が対応
  //
  // 右側 (bright) ≈ 80%
  //   普通・まあ満足: 35% × 55% = 19%
  //   不満あり（潜在）: 35% × 55% = 19%
  //   未検討層:       80% × 45% = 36%
  //   潜在的な検討層: 13% × 45% =  6%
  // -------------------------------------------------------
  type Seg = { key: string; label: string; barW: number; bright: boolean; desc: string }
  const segs: Seg[] = [
    // ── 左: 暗い（アプローチ不可） ──
    { key:"a1", label:"大変満足",           barW: 11, bright:false,
      desc:"現状の顧問税理士に非常に満足。変更意向なし。年商規模が大きい法人に多い層。" },
    { key:"a4", label:"顕在層",             barW:  6, bright:false,
      desc:"すでに税理士を探してアクションしている層。他の紹介サービスや広告にも問い合わせが集中するほど、ニーズが顕在化している。競合が多いことが、この市場の需要の大きさを証明している。" },
    { key:"b3", label:"明確な探索層",       barW:  3, bright:false,
      desc:"マッチングサイト等で具体的にアクション中。競合他社と正面衝突になる領域。" },
    // ── 右: 明るい（BizplatFormがアプローチ可能） ──
    { key:"a2", label:"普通・まあ満足",     barW: 19, bright:true,
      desc:"特段の不満はないが積極的な提案も受けていない層。変更のきっかけがあれば動く可能性がある。BizplatFormのターゲット。" },
    { key:"a3", label:"不満あり（潜在層）", barW: 19, bright:true,
      desc:"レスポンスの遅さ・提案不足・クラウド未対応などに不満。しかし「変えよう」とは自分から動かない。BizplatFormの主力ターゲット。" },
    { key:"b1", label:"未検討層",           barW: 36, bright:true,
      desc:"税理士契約をまだ検討していない層。インボイス対応・法人成り・代替わりなどのタイミングでニーズが顕在化する。BizplatFormのターゲット。" },
    { key:"b2", label:"潜在的な検討層",     barW:  6, bright:true,
      desc:"インボイス対応・売上1,000万円突破（消費税課税）をきっかけに税理士を検討し始めた層。BizplatFormのサブターゲット。" },
  ]

  // 境界位置（左ブロック合計 = 20%）
  const dividerAt = 20

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">

      {/* HERO */}
      <div className="mb-10 stagger-1">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">Step 02</p>
        <div className="flex items-end gap-6">
          <div>
            <h1 className="font-serif-display italic text-white leading-none">
              <span className="font-inter font-black text-[110px] leading-none tabular-nums">83.8</span>
              <span className="text-4xl text-white/60 ml-1">%</span>
            </h1>
            <p className="font-serif-display italic text-white text-3xl mt-1">が、年商1億円以下。</p>
          </div>
          <div className="mb-4 border-l border-white/15 pl-6">
            <p className="text-white/40 text-sm leading-relaxed">国税庁・会社標本調査より推計<br />中小企業の大多数は年商数千万円規模。<br />これが<span className="text-white font-bold">コミットプランの主戦場</span>だ。</p>
          </div>
        </div>
      </div>


      {/* SINGLE BAR */}
      <div className="stagger-3 mb-10">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/25 mb-6">
          Market Structure — 誰に届けるか
          <span className="normal-case tracking-normal text-white/20 ml-3">（各セグメントにカーソルを当てると詳細表示）</span>
        </p>

        {/* 上部ラベル行 */}
        <div className="flex mb-1 w-full">
          <div style={{ width: `${dividerAt}%` }}>
            <p className="font-inter text-[9px] text-white/25">明確に探している顕在層等</p>
          </div>
          <div style={{ width: `${100 - dividerAt}%` }}>
            <p className="font-inter text-[9px] text-white/60 text-right">← BizplatFormだからこそアプローチが可能な領域</p>
          </div>
        </div>

        {/* バー本体 */}
        <div className="relative w-full flex h-20" style={{ gap: "1px" }}>
          {segs.map((seg, i) => {
            const isHov = hoveredKey === seg.key
            // 明暗境界の直後に区切り線
            const isDividerBefore = i === 3
            const bg = seg.bright
              ? (isHov ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.58)")
              : (isHov ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.09)")
            return (
              <div
                key={seg.key}
                style={{
                  width: `${seg.barW}%`,
                  background: bg,
                  transition: "background 0.15s ease",
                  position: "relative",
                  ...(isDividerBefore ? { marginLeft: "3px", borderLeft: "2px solid rgba(255,255,255,0.5)" } : {}),
                }}
                onMouseEnter={() => setHoveredKey(seg.key)}
                onMouseLeave={() => setHoveredKey(null)}
              >
                {/* % テキスト（幅が十分ある時のみ） */}
                {seg.barW >= 5 && (
                  <span
                    className="absolute inset-0 flex items-center justify-center font-inter font-black tabular-nums select-none"
                    style={{
                      fontSize: seg.barW >= 12 ? "13px" : "10px",
                      color: seg.bright ? "#0A0A0A" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    {seg.barW}%
                  </span>
                )}

                {/* ツールチップ */}
                {isHov && (
                  <div
                    className="absolute z-50 bg-white text-[#0A0A0A] shadow-2xl pointer-events-none"
                    style={{
                      bottom: "calc(100% + 10px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "230px",
                      padding: "14px 16px",
                    }}
                  >
                    <p className="font-inter font-black text-[11px] mb-1">{seg.label} — {seg.barW}%</p>
                    <p className="text-[10px] leading-relaxed text-black/60">{seg.desc}</p>
                    {seg.bright && (
                      <span className="inline-block mt-2 bg-[#0A0A0A] text-white text-[8px] px-2 py-0.5 uppercase tracking-widest font-inter font-bold">
                        BizplatForm Target
                      </span>
                    )}
                    <div style={{
                      position:"absolute", bottom:"-6px", left:"50%", transform:"translateX(-50%)",
                      width:0, height:0,
                      borderLeft:"6px solid transparent", borderRight:"6px solid transparent",
                      borderTop:"6px solid white",
                    }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* セグメントラベル（バー下） */}
        <div className="flex mt-1 w-full" style={{ gap: "1px" }}>
          {segs.map((seg, i) => (
            <div
              key={seg.key}
              style={{
                width: `${seg.barW}%`,
                ...(i === 3 ? { marginLeft: "3px" } : {}),
              }}
            >
              <p
                className="font-inter text-[9px] truncate px-0.5"
                style={{ color: seg.bright ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.22)" }}
              >
                {seg.label}
              </p>
            </div>
          ))}
        </div>

        {/* 凡例 */}
        <div className="mt-5 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3" style={{ background: "rgba(255,255,255,0.58)" }} />
            <span className="text-white/50 text-[10px] font-inter">BizplatFormだからこそアプローチが可能な領域（約80%）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3" style={{ background: "rgba(255,255,255,0.09)" }} />
            <span className="text-white/25 text-[10px] font-inter">明確に探している顕在層等（約20%）</span>
          </div>
        </div>
      </div>

      {/* FEE TABLE + KEY STAT */}
      <div className="grid grid-cols-2 gap-4 stagger-4">
        <div className="border border-white/10 px-8 py-6">
          <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/25 mb-4">月額顧問料の相場（年商規模別）</p>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/10">
              {[
                { range: "〜1,000万円",    fee: "1.0万 〜 2.0万" },
                { range: "1,000〜3,000万", fee: "1.7万 〜 3.0万" },
                { range: "3,000〜5,000万", fee: "2.0万 〜 4.0万" },
                { range: "5,000万〜1億",   fee: "3.2万 〜 6.0万" },
              ].map(({ range, fee }) => (
                <tr key={range}>
                  <td className="py-2 text-white/40 font-inter text-[11px]">{range}円</td>
                  <td className="py-2 text-white font-inter font-bold text-right tabular-nums">{fee}円</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border border-white/10 px-8 py-6 flex flex-col justify-between">
          <div>
            <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/25 mb-4">変更・乗り換えのトリガー</p>
            <ul className="space-y-2 text-white/50 text-sm">
              {[
                "個人事業主 → 法人成りのタイミング",
                "税務調査後の対応への不信感",
                "代替わり（事業承継）で方針変更",
                "クラウド会計・IT対応を求めた時",
              ].map(t => (
                <li key={t} className="flex items-start gap-2">
                  <span className="text-white/20 mt-0.5">—</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="font-inter font-black text-white text-2xl mt-6">
            50.3<span className="text-base font-normal text-white/40 ml-1">% が一度も変更したことがない</span>
          </p>
          <p className="text-white/25 text-[10px] mt-1 font-inter">船井総研 2023年調査</p>
        </div>
      </div>

      {/* 顧問料 × 企業数 横棒グラフ */}
      <div className="stagger-5 mt-4">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/25 mb-5">
          Fee × Volume — 顧問料帯ごとの法人数（296万社ベース）
        </p>
        <div className="space-y-3">
          {[
            { range: "〜1,000万円",    fee: "月額 1.0〜2.0万円", companies: 105, pct: 35.5 },
            { range: "1,000〜3,000万円", fee: "月額 1.7〜3.0万円", companies:  80, pct: 26.9 },
            { range: "3,000〜5,000万円", fee: "月額 2.0〜4.0万円", companies:  36, pct: 12.0 },
            { range: "5,000万〜1億円",   fee: "月額 3.2〜6.0万円", companies:  28, pct:  9.4 },
          ].map(({ range, fee, companies, pct }) => (
            <div key={range} className="flex items-center gap-4">
              {/* 年商ラベル */}
              <span className="font-inter text-[11px] text-white/35 w-28 shrink-0 tabular-nums">{range}</span>
              {/* バー */}
              <div className="flex-1 relative h-8 bg-white/5">
                <div
                  className="absolute left-0 top-0 h-full bg-white/30 flex items-center"
                  style={{ width: `${(companies / 105) * 100}%` }}
                >
                  <span className="font-inter font-black text-[11px] text-white tabular-nums pl-3 whitespace-nowrap">
                    約{companies}万社
                  </span>
                </div>
              </div>
              {/* 顧問料 + 割合 */}
              <div className="shrink-0 text-right w-36">
                <p className="font-inter font-bold text-white text-[12px]">{fee}</p>
                <p className="font-inter text-white/30 text-[10px] tabular-nums">全体の {pct}%</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-white/20 text-[10px] mt-4 font-inter">
          ※ 国税庁・会社標本調査の年商分布を296万社に適用した推計値
        </p>
      </div>

      {/* 税理士市場 参考統計（ヒーロー表示） */}
      <div className="stagger-5 mt-4">
        <div className="flex items-baseline justify-between mb-6">
          <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/40">
            Tax Industry Reference — 税理士市場の参考データ
          </p>
          <span className="text-white/20 text-[9px] font-inter">以下は推計・参考値</span>
        </div>
        <div className="grid grid-cols-3 gap-px bg-white/10">
          {marketStats.slice(0, 6).map((s) => {
            const revealed = revealedStats.has(s.label)
            return (
              <div key={s.label}
                data-cursor
                onClick={() => toggleReveal(s.label)}
                className="bg-[#0A0A0A] px-8 py-10 cursor-pointer transition-all duration-300 relative overflow-hidden group"
                style={{ boxShadow: revealed ? "inset 0 0 0 1px rgba(255,255,255,0.12)" : "none" }}
              >
                {/* 数値（ブラー→クリアアニメ） */}
                <div className="mb-4">
                  <p
                    className="font-inter font-black leading-none tabular-nums transition-all duration-500"
                    style={{
                      fontSize: "clamp(28px, 3.5vw, 48px)",
                      color: revealed ? "#ffffff" : "transparent",
                      textShadow: revealed ? "none" : "0 0 18px rgba(255,255,255,0.6)",
                      filter: revealed ? "none" : "blur(8px)",
                    }}
                  >
                    {s.value}
                  </p>
                  {s.isEstimate && revealed && (
                    <span className="text-[8px] text-white/30 font-inter border border-white/15 px-1 mt-1 inline-block">推計</span>
                  )}
                </div>
                {/* タップ促し */}
                {!revealed && (
                  <p className="font-inter text-white/30 text-[10px] uppercase tracking-widest mb-3 group-hover:text-white/50 transition-colors">
                    タップして確認 →
                  </p>
                )}
                <p className="text-white/60 text-sm font-bold leading-snug">{s.label}</p>
                <p className="text-white/25 text-[10px] mt-2 font-inter leading-relaxed">{s.note}</p>
              </div>
            )
          })}
        </div>
        {/* 最後の1件（顕在層）は全幅で強調 */}
        {marketStats[6] && (() => {
          const s = marketStats[6]
          const revealed = revealedStats.has(s.label)
          return (
            <div
              data-cursor
              onClick={() => toggleReveal(s.label)}
              className="mt-px bg-[#0A0A0A] px-8 py-10 cursor-pointer transition-all duration-300 flex items-center gap-12 group"
              style={{ boxShadow: revealed ? "inset 0 0 0 1px rgba(255,255,255,0.12)" : "none" }}
            >
              <div className="flex-shrink-0">
                <p
                  className="font-inter font-black tabular-nums transition-all duration-500"
                  style={{
                    fontSize: "clamp(40px, 5vw, 72px)",
                    lineHeight: 1,
                    color: revealed ? "#ffffff" : "transparent",
                    textShadow: revealed ? "none" : "0 0 24px rgba(255,255,255,0.6)",
                    filter: revealed ? "none" : "blur(10px)",
                  }}
                >
                  {s.value}
                </p>
                {!revealed && (
                  <p className="font-inter text-white/30 text-[10px] uppercase tracking-widest mt-2 group-hover:text-white/50 transition-colors">タップして確認 →</p>
                )}
              </div>
              <div>
                <p className="text-white/70 text-lg font-bold">{s.label}</p>
                <p className="text-white/30 text-xs mt-1 font-inter leading-relaxed max-w-xl">{s.note}</p>
                {s.isEstimate && revealed && (
                  <span className="text-[8px] text-white/30 font-inter border border-white/15 px-1 mt-2 inline-block">推計</span>
                )}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

// ============================================================
// 03 DIAGNOSIS（刷新版）
// ============================================================
function DiagnosisTab({ diagnosis, capacityNum, avgFeeNum, naturalIncrease, naturalDecrease }: any) {
  const naturalIncreaseNum = parseInt(naturalIncrease) || 0
  const naturalDecreaseNum = parseInt(naturalDecrease) || 0
  const netGrowth          = naturalIncreaseNum - naturalDecreaseNum
  const unusedRevenue      = capacityNum * avgFeeNum
  const yearsToFill        = netGrowth > 0 ? Math.ceil(capacityNum / netGrowth) : null

  // 提携事務所ベンチマーク（固定参考値）
  const benchIncrease    = 3.2
  const benchDecrease    = 2.1
  const benchBizplatForm = 12  // BizplatForm経由年間新規成約（参考）

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      {/* ヘッダー */}
      <div className="mb-10 stagger-1">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-black/30 mb-3">Step 04</p>
        <h1 className="font-serif-display italic text-4xl text-[#0A0A0A] leading-tight">
          先生の事務所の現在地と、<br />
          <span className="not-italic font-inter font-black">未活用の余白。</span>
        </h1>
        <p className="text-black/35 text-xs mt-3">※ ヒアリング値を入力すると自動反映されます</p>
      </div>

      {/* ブロック①：現在の売上力 */}
      <div className="grid grid-cols-3 gap-px bg-black mb-8 stagger-2">
        {[
          { label: "月間売上",   value: diagnosis.monthly, prefix: "¥", suffix: "",    size: "text-4xl" },
          { label: "年間売上",   value: diagnosis.annual,  prefix: "¥", suffix: "",    size: "text-4xl" },
          { label: "引受余力",   value: capacityNum,       prefix: "",  suffix: "件",  size: "text-5xl" },
        ].map(({ label, value, prefix, suffix, size }) => (
          <div key={label} className="bg-white px-6 py-8">
            <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">{label}</p>
            <p className={`font-inter font-black ${size} leading-none tabular-nums text-[#0A0A0A]`}>
              <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
            </p>
          </div>
        ))}
      </div>

      {/* ブロック②：自力での増減バランス */}
      <div className="grid grid-cols-3 gap-px bg-black mb-8 stagger-3">
        <div className="bg-white px-6 py-7">
          <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">自然に増える顧客（年）</p>
          <p className="font-inter font-black text-4xl leading-none tabular-nums text-[#0A0A0A]">
            +<AnimatedNumber value={naturalIncreaseNum} suffix="件" />
          </p>
          <p className="text-black/30 text-xs mt-2">口コミ・紹介など</p>
        </div>
        <div className="bg-white px-6 py-7">
          <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">自然に離れる顧客（年）</p>
          <p className="font-inter font-black text-4xl leading-none tabular-nums text-[#0A0A0A]">
            −<AnimatedNumber value={naturalDecreaseNum} suffix="件" />
          </p>
          <p className="text-black/30 text-xs mt-2">廃業・解約など</p>
        </div>
        <div className={`px-6 py-7 ${netGrowth >= 0 ? "bg-white" : "bg-[#F4F4F4]"}`}>
          <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">差し引き純増（年）</p>
          <p className={`font-inter font-black text-4xl leading-none tabular-nums ${netGrowth >= 0 ? "text-[#0A0A0A]" : "text-black/40"}`}>
            {netGrowth >= 0 ? "+" : ""}{netGrowth}件
          </p>
          <p className="text-black/30 text-xs mt-2">
            {yearsToFill
              ? `このペースで引受余力を埋めるには約${yearsToFill}年`
              : naturalIncreaseNum === 0 && naturalDecreaseNum === 0
              ? "Step01で自然増減を入力すると表示されます"
              : "自力での純増がない状態です"}
          </p>
        </div>
      </div>

      {/* ブロック③：未活用キャパシティ（前向き） */}
      <div className="border-l-4 border-black bg-[#0A0A0A] px-8 py-8 mb-8 stagger-4">
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-white/35 mb-3">Unused Capacity — 未活用の売上余地</p>
        <div className="flex items-baseline gap-4 flex-wrap">
          <div>
            <p className="font-inter font-black text-[72px] leading-none tabular-nums text-white">
              ¥<AnimatedNumber value={unusedRevenue} />
            </p>
            <p className="text-white/40 text-sm mt-1">/月 — 今すぐ受けられる余力の月額換算</p>
          </div>
        </div>
        <p className="text-white/25 text-xs mt-4">
          引受余力{capacityNum}件 × 平均顧問料¥{avgFeeNum.toLocaleString("ja-JP")} = ¥{unusedRevenue.toLocaleString("ja-JP")}/月
        </p>
      </div>

      {/* ブロック④：提携事務所との比較 */}
      <div className="stagger-5">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-black/25 mb-4">Partner Benchmark — 提携事務所との比較</p>
        <div className="grid grid-cols-3 gap-px bg-black mb-2">
          {[
            {
              label:  "年間自然増",
              mine:   `${naturalIncreaseNum}件`,
              bench:  `${benchIncrease}件`,
              diff:   naturalIncreaseNum - benchIncrease,
            },
            {
              label:  "年間自然減",
              mine:   `${naturalDecreaseNum}件`,
              bench:  `${benchDecrease}件`,
              diff:   benchDecrease - naturalDecreaseNum,  // 少ない方が良い
            },
            {
              label:  "BizplatForm経由 年間新規成約（参考）",
              mine:   "—",
              bench:  `${benchBizplatForm}件`,
              diff:   null,
            },
          ].map(({ label, mine, bench, diff }) => (
            <div key={label} className="bg-white px-6 py-6">
              <p className="font-inter text-[9px] uppercase tracking-wider text-black/30 mb-4">{label}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-inter text-[9px] text-black/25 mb-1">先生（現状）</p>
                  <p className="font-inter font-black text-2xl text-[#0A0A0A] tabular-nums">{mine}</p>
                </div>
                <div className="text-right">
                  <p className="font-inter text-[9px] text-black/25 mb-1">提携事務所平均</p>
                  <p className="font-inter font-black text-2xl text-[#0A0A0A] tabular-nums">{bench}</p>
                </div>
              </div>
              {diff !== null && (
                <div className={`mt-3 px-2 py-1 text-[10px] font-inter font-bold inline-block ${diff >= 0 ? "bg-[#0A0A0A] text-white" : "bg-[#F4F4F4] text-black/40"}`}>
                  {diff >= 0 ? `+${diff.toFixed(1)}件 上回っています` : `${diff.toFixed(1)}件 下回っています`}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-black/20 text-[10px] font-inter">※ BizplatFormパートナー事務所の実績平均値（参考）</p>
      </div>
    </div>
  )
}

// ============================================================
// 04 MECHANISM
// ============================================================
function MechanismTab() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-12 stagger-1">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-black/30 mb-3">Step 03</p>
        <h1 className="font-serif-display italic text-5xl text-[#0A0A0A] leading-tight">
          問い合わせが来る前の、<br />
          <span className="not-italic font-inter font-black">気づいていないお客様</span>に届ける。
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-px bg-black mb-12 stagger-2">
        {[
          { step: "01", title: "コールセンターが\nアウトバウンド発信", body: "専門オペレーターが潜在的ニーズを持つ企業に直接アプローチ。ホームページへのアクセスを待たずに接触します。", tag: "顧客が動く前に接触" },
          { step: "02", title: "課題をヒアリング・\nニーズを確認",      body: "「税理士を探していない」段階でも、財務・税務の困りごとを引き出し、関心を醸成します。",                   tag: "潜在ニーズを顕在化" },
          { step: "03", title: "先生の事務所に\nマッチング・紹介",     body: "業種・ソフト・エリアの適合性をAIが判定し、最適な税理士事務所として先生をご紹介します。",               tag: "競合なしで繋がる" },
        ].map(({ step, title, body, tag }) => (
          <div key={step} className="bg-white px-8 py-10 relative overflow-hidden">
            <span className="absolute bottom-3 right-5 font-inter font-black text-[80px] leading-none text-black/5 tabular-nums select-none">{step}</span>
            <p className="font-inter font-black text-[9px] tracking-[0.2em] uppercase text-black/25 mb-4">Step {step}</p>
            <h3 className="font-bold text-[#0A0A0A] text-lg leading-snug mb-4 whitespace-pre-line">{title}</h3>
            <p className="text-black/45 text-sm leading-relaxed mb-6">{body}</p>
            <span className="inline-block border border-black text-[#0A0A0A] text-[9px] px-2 py-1 uppercase tracking-widest font-inter font-bold">{tag}</span>
          </div>
        ))}
      </div>

      <div className="stagger-3 mb-12">
        <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/25 mb-5">他社との違い</p>
        <div className="border border-black">
          <div className="grid grid-cols-3 border-b border-black bg-[#F4F4F4]">
            {["比較項目", "一般的な紹介サービス", "BizplatForm コミットプラン"].map((h, i) => (
              <div key={h} className={`px-6 py-3 ${i > 0 ? "border-l border-black" : ""} font-inter text-[10px] uppercase tracking-wider ${i === 2 ? "font-black text-[#0A0A0A]" : "text-black/35"}`}>{h}</div>
            ))}
          </div>
          {[
            ["顧客の状態",     "すでに探している顕在層",   "気づいていない潜在層"],
            ["競合との戦い",   "WEB上で競合と取り合い",   "競合のいないブルーオーシャン"],
            ["アプローチ手法", "受動的（問い合わせ待ち）", "能動的（コールセンター発信）"],
            ["成果の保証",     "紹介のみ・成果不問",       "月間コミット件数を保証"],
            ["業種・ソフト指定","対応不可が多い",           "業種・ソフト・エリアを指定可"],
          ].map(([item, other, biz], i) => (
            <div key={item} className={`grid grid-cols-3 border-b border-black/15 last:border-b-0 ${i % 2 ? "bg-[#FAFAFA]" : "bg-white"}`}>
              <div className="px-6 py-4 text-sm font-bold text-[#0A0A0A]">{item}</div>
              <div className="px-6 py-4 border-l border-black/10 text-sm text-black/35">{other}</div>
              <div className="px-6 py-4 border-l border-black text-sm font-bold text-[#0A0A0A]"><span className="mr-2">✓</span>{biz}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0A0A0A] text-white px-10 py-10 stagger-4">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/25 mb-4">Blue Ocean Scale</p>
        <div className="flex items-baseline gap-3 mb-3">
          <span className="font-inter font-black text-[80px] leading-none tabular-nums">約400</span>
          <span className="font-bold text-3xl">万件</span>
        </div>
        <p className="text-white/50 text-base max-w-xl leading-relaxed">
          WEB上に出てこない、潜在的な税理士ニーズを持つ企業数（推計）。<br />
          BizplatFormはこの市場に<span className="text-white font-bold">専門のコールセンター</span>で直接アプローチしています。
        </p>
        <p className="text-white/30 text-sm mt-4">
          ↓ Step 04 では、先生の事務所へのインパクトを数字で確認します。
        </p>
      </div>
    </div>
  )
}

// ============================================================
// 05 MATCHING
// ============================================================
function MatchingTab({ matched, hasInput }: { matched: (typeof customerDatabase[0] & { score: number })[]; hasInput: boolean }) {
  const digitalBadgeStyle = (d: string) =>
    d === "デジタル得意" ? "bg-[#0A0A0A] text-white" : d === "中程度" ? "border border-black text-[#0A0A0A]" : "border border-black/20 text-black/35"

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-10 stagger-1">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-black/30 mb-3">Step 05</p>
        <h1 className="font-serif-display italic text-5xl text-[#0A0A0A] leading-tight">
          AIが選んだ、<br />
          <span className="not-italic font-inter font-black">先生への紹介候補。</span>
        </h1>
      </div>

      {!hasInput ? (
        <div className="border border-black/10 px-8 py-20 text-center stagger-2">
          <p className="font-serif-display italic text-2xl text-black/25">Step 01 でソフト・エリア・条件を選択すると</p>
          <p className="font-inter font-black text-base text-black/15 mt-2">マッチング候補が表示されます</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matched.map((c, i) => (
            <div key={c.id} className={`border border-black stagger-${Math.min(i + 2, 8)} hover:bg-[#FAFAFA] transition-colors`}>
              <div className="grid grid-cols-12">
                <div className="col-span-1 bg-[#0A0A0A] flex flex-col items-center justify-center py-6">
                  <span className="font-inter font-black text-white text-2xl tabular-nums leading-none">{c.score}</span>
                  <span className="text-white/35 text-[9px] uppercase tracking-wider mt-1">pt</span>
                </div>
                <div className="col-span-8 px-6 py-5 border-r border-black/10">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-bold text-[#0A0A0A] text-base">{c.name}</span>
                    <span className="font-inter text-[9px] uppercase tracking-wider border border-black px-2 py-0.5 text-black/55">{c.industry}</span>
                    <span className="font-inter text-[9px] uppercase tracking-wider border border-black/20 px-2 py-0.5 text-black/35">{c.type}</span>
                    <span className="font-inter text-[9px] tracking-wide border border-black/20 px-2 py-0.5 text-black/40">{c.accountingStyle}</span>
                  </div>
                  <p className="text-[#0A0A0A] text-sm mb-2">{c.situation}</p>
                  <p className="text-black/35 text-xs">{c.bookkeeping}</p>
                  <div className="flex gap-4 mt-3 text-xs text-black/35 font-inter">
                    <span>年商 <strong className="text-[#0A0A0A] tabular-nums">{c.revenue.toLocaleString("ja-JP")}万円</strong></span>
                    <span>従業員 <strong className="text-[#0A0A0A] tabular-nums">{c.employees}名</strong></span>
                    <span>創業 <strong className="text-[#0A0A0A] tabular-nums">{c.founded}年目</strong></span>
                    <span>{c.prefecture}</span>
                  </div>
                </div>
                <div className="col-span-3 px-5 py-5 flex flex-col justify-between">
                  <div>
                    <p className="font-inter text-[9px] uppercase tracking-wider text-black/25 mb-1">想定月額顧問料</p>
                    <p className="font-inter font-black text-3xl tabular-nums text-[#0A0A0A]">¥{c.fee.toLocaleString("ja-JP")}</p>
                  </div>
                  <div className="space-y-1">
                    <span className={`inline-block text-[9px] px-2 py-1 font-inter font-bold tracking-wider ${digitalBadgeStyle(c.digitalLevel)}`}>
                      {c.digitalLevel}
                    </span>
                    <p className="text-black/25 text-[10px]">{c.software}</p>
                    <p className="text-black/20 text-[9px]">{c.theme}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// 06 PLAN
// ============================================================
function PlanTab({ plan, index, totalInvestment, commitRevenue, roi, payback, capacityNum, avgFeeNum, showAllPlans, setShowAllPlans, selectedPlanIndex, setSelectedPlanIndex, commitPlans }: any) {
  const activePlan = commitPlans[selectedPlanIndex]
  const activeInst1y = getInstallment(activePlan, "1y")
  const activeInst3y = getInstallment(activePlan, "3y")
  const activeInst7y = getInstallment(activePlan, "7y")
  const annual = activePlan.commit * 12
  const total7y = activePlan.commit * 84
  const potential = capacityNum * avgFeeNum

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-10 stagger-1">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-black/30 mb-3">Step 06</p>
        <h1 className="font-serif-display italic text-4xl text-[#0A0A0A] leading-tight">
          先生には、<br />
          <span className="not-italic font-inter font-black">このプランが最適です。</span>
        </h1>
      </div>

      <div className="grid grid-cols-5 gap-px bg-black mb-8 stagger-2">
        {/* LEFT: Commit hero */}
        <div className="col-span-3 bg-[#0A0A0A] px-10 py-10 flex flex-col justify-between">
          <div>
            <p className="font-inter text-[9px] uppercase tracking-[0.3em] text-white/60 mb-2">
              Commit Plan {String(selectedPlanIndex + 1).padStart(2, "0")} — 月間コミット顧問料
            </p>
            <p className="font-inter font-black text-[96px] leading-none tabular-nums text-white">
              ¥{activePlan.commit.toLocaleString("ja-JP")}
            </p>
            <p className="text-white/50 text-base mt-1 font-inter">毎月この金額分の新規顧問料が積み上がる</p>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
            <div>
              <p className="text-white/35 text-[11px] uppercase tracking-wider font-inter mb-1">年間換算コミット</p>
              <p className="font-inter font-black text-3xl text-white tabular-nums">¥{annual.toLocaleString("ja-JP")}</p>
              <p className="text-white/25 text-xs mt-1">月間コミット × 12ヶ月</p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/20 text-[11px] uppercase tracking-wider font-inter mb-1">月額サービス料</p>
              <p className="font-inter text-white/40 text-xl tabular-nums">¥{activePlan.monthly.toLocaleString("ja-JP")} / 月</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Plan description card + Dialog */}
        <div className="col-span-2 bg-white px-8 py-10 flex flex-col justify-between">
          <div className="space-y-4">
            <p className="font-inter text-[9px] uppercase tracking-[0.3em] text-black/30 mb-5">プランの内容</p>

            {/* 保証内容 */}
            <div className="bg-[#F7F7F7] px-5 py-4 border-l-4 border-black">
              <p className="font-inter text-[9px] uppercase tracking-wider text-black/40 mb-1">7年間の成約保証</p>
              <p className="font-inter font-black text-base text-[#0A0A0A]">
                月間コミット ¥{activePlan.commit.toLocaleString("ja-JP")} 分の<br />
                新規顧客を7年以内に紹介
              </p>
            </div>

            {/* AIマッチング */}
            <div className="bg-[#F7F7F7] px-5 py-4 border-l-4 border-black/20">
              <p className="font-inter text-[9px] uppercase tracking-wider text-black/40 mb-1">AIマッチング</p>
              <p className="font-inter font-bold text-sm text-[#0A0A0A]">
                希望条件に合った法人・個人事業主を<br />優先的にマッチング
              </p>
            </div>

            {/* 月額サービス料 */}
            <div className="bg-[#F7F7F7] px-5 py-4 border-l-4 border-black/10">
              <p className="font-inter text-[9px] uppercase tracking-wider text-black/40 mb-1">月額サービス料</p>
              <p className="font-inter font-bold text-sm text-[#0A0A0A]">
                ¥{activePlan.monthly.toLocaleString("ja-JP")} / 月
              </p>
              <p className="text-[10px] text-black/30 mt-0.5">1年・3年・7年払いあり</p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button data-cursor className="mt-6 w-full bg-black text-white font-inter text-[12px] font-bold tracking-[0.15em] uppercase px-6 py-4 hover:bg-black/80 transition-colors flex items-center justify-between">
                <span>料金体系を確認する</span>
                <span className="text-white/60">→</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-inter font-black text-xl tracking-wide">料金体系 — お支払い方式</DialogTitle>
              </DialogHeader>
              <p className="text-black/50 text-sm mb-4">
                月間コミット <strong className="text-[#0A0A0A]">¥{activePlan.commit.toLocaleString("ja-JP")}</strong> プランの各払い方式
              </p>
              <Tabs defaultValue="1y">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="1y" className="font-inter font-bold text-xs">1年払い</TabsTrigger>
                  <TabsTrigger value="3y" className="font-inter font-bold text-xs">3年払い</TabsTrigger>
                  <TabsTrigger value="7y" className="font-inter font-bold text-xs">7年払い</TabsTrigger>
                </TabsList>
                {([
                  { key: "1y", inst: activeInst1y, label: "1年払い" },
                  { key: "3y", inst: activeInst3y, label: "3年払い" },
                  { key: "7y", inst: activeInst7y, label: "7年払い" },
                ] as const).map(({ key, inst, label }) => (
                  <TabsContent key={key} value={key} className="border border-black p-6">
                    <p className="font-inter text-[9px] uppercase tracking-wider text-black/35 mb-4">{label}</p>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-[10px] text-black/30 mb-1">月額</p>
                        <p className="font-inter font-black text-2xl tabular-nums">¥{inst.monthly.toLocaleString("ja-JP")}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-black/30 mb-1">支払回数</p>
                        <p className="font-inter font-black text-2xl tabular-nums">{inst.months}回</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-black/30 mb-1">総額</p>
                        <p className="font-inter font-black text-2xl tabular-nums">¥{inst.total.toLocaleString("ja-JP")}</p>
                      </div>
                    </div>
                    <p className="text-black/30 text-[10px] border-t border-black/10 pt-3">※ 税抜表示</p>
                  </TabsContent>
                ))}
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Other plans toggle */}
      <div className="stagger-3 mb-8">
        <button data-cursor onClick={() => setShowAllPlans(!showAllPlans)}
          className="font-inter text-[11px] uppercase tracking-wider text-black/35 hover:text-black transition-colors flex items-center gap-2">
          <span className="border border-black/20 px-2 py-0.5">{showAllPlans ? "▲" : "▼"}</span>
          {showAllPlans ? "他のプランを閉じる" : "他のプランを見る"}
        </button>
        {showAllPlans && (
          <div className="mt-4 grid grid-cols-5 gap-px bg-black">
            {commitPlans.map((p: any, i: number) => (
              <button key={i} data-cursor onClick={() => setSelectedPlanIndex(i)}
                className={`px-4 py-5 text-left transition-colors ${selectedPlanIndex === i ? "bg-[#0A0A0A] text-white" : "bg-white hover:bg-[#F4F4F4] text-[#0A0A0A]"}`}>
                <p className={`font-inter text-[9px] uppercase tracking-wider mb-2 ${selectedPlanIndex === i ? "text-white/40" : "text-black/30"}`}>Plan {String(i+1).padStart(2,"0")}</p>
                <p className="font-inter font-black text-lg tabular-nums">¥{p.commit.toLocaleString("ja-JP")}</p>
                <p className={`text-[10px] mt-1 ${selectedPlanIndex === i ? "text-white/30" : "text-black/25"}`}>¥{p.monthly.toLocaleString("ja-JP")}/月</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Included items */}
      <div className="border border-black stagger-4">
        <div className="px-8 py-4 border-b border-black bg-[#F4F4F4]">
          <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-black/35">このプランに含まれるもの</p>
        </div>
        <div className="grid grid-cols-3">
          {[
            ["月間コミット紹介", "保証件数まで継続"],
            ["業種・ソフト指定", "完全対応"],
            ["エリア指定",       "全国対応"],
            ["初回設定サポート", "無料"],
            ["マッチング精度",   "AI自動判定"],
            ["月次面談",         "担当者との案件すり合わせ"],
          ].map(([label, value]) => (
            <div key={label} className="px-8 py-5 border-b border-r border-black/10 last:border-r-0 flex justify-between items-center">
              <span className="text-sm text-black/45">{label}</span>
              <span className="font-bold text-[#0A0A0A] text-sm">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 07 ROI
// ============================================================
function ROITab({ plan, roi, payback, totalInvestment, commitRevenue, simPace, setSimPace, simAvgFee, setSimAvgFee, avgFeeNum, matched }: any) {
  const effectiveAvgFee = simAvgFee > 0 ? simAvgFee : (avgFeeNum || 30000)
  const neededClients   = Math.ceil(plan.commit / effectiveAvgFee)
  const achieveMonth    = Math.ceil(neededClients / simPace)
  const cappedAchieve   = Math.min(achieveMonth, 84)

  // Graph data: monthly advisory income accumulation over 84 months
  const graphData = Array.from({ length: 85 }, (_, m) => {
    const clientsSoFar = Math.min(m * simPace, neededClients)
    const monthlyIncome = clientsSoFar * effectiveAvgFee
    const serviceFee    = plan.monthly
    const ratio         = monthlyIncome > 0 ? Math.round((serviceFee / monthlyIncome) * 100) : 100
    return {
      month: `${m}ヶ月`,
      顧問料収入: Math.round(monthlyIncome / 10000),
      サービス料: Math.round(serviceFee / 10000),
      ratio,
    }
  })

  const finalRatio = Math.round((plan.monthly / plan.commit) * 100)

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-10 stagger-1">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-black/30 mb-3">Step 07</p>
        <h1 className="font-serif-display italic text-4xl text-[#0A0A0A] leading-tight">
          受注ペースを動かして、<br />
          <span className="not-italic font-inter font-black">収益性の変化を確認する。</span>
        </h1>
      </div>

      {/* Simulator inputs */}
      <div className="border border-black p-8 mb-8 stagger-2">
        <p className="font-inter text-[9px] uppercase tracking-[0.3em] text-black/25 mb-6">シミュレーター入力</p>
        <div className="grid grid-cols-2 gap-12">
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <label className="font-inter text-[10px] uppercase tracking-wider text-black/35">月間受入ペース</label>
              <span className="font-inter font-black text-2xl text-[#0A0A0A]">{simPace}<span className="text-sm font-normal text-black/35 ml-1">件/月</span></span>
            </div>
            <input type="range" min={1} max={10} value={simPace} onChange={e => setSimPace(Number(e.target.value))}
              className="w-full accent-black" />
            <div className="flex justify-between text-[9px] text-black/25 font-inter mt-1">
              <span>1件</span><span>10件</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <label className="font-inter text-[10px] uppercase tracking-wider text-black/35">平均顧問料</label>
              <span className="font-inter font-black text-2xl text-[#0A0A0A]">¥{effectiveAvgFee.toLocaleString("ja-JP")}<span className="text-sm font-normal text-black/35 ml-1">/月</span></span>
            </div>
            <input type="range" min={10000} max={100000} step={5000} value={effectiveAvgFee}
              onChange={e => setSimAvgFee(Number(e.target.value))}
              className="w-full accent-black" />
            <div className="flex justify-between text-[9px] text-black/25 font-inter mt-1">
              <span>¥10,000</span><span>¥100,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key metrics from simulation */}
      <div className="grid grid-cols-4 gap-px bg-black mb-8 stagger-3">
        {[
          { label: "必要成約件数",    value: `${neededClients}件`,                    sub: `¥${plan.commit.toLocaleString("ja-JP")} ÷ ¥${effectiveAvgFee.toLocaleString("ja-JP")}` },
          { label: "コミット達成月",  value: `${cappedAchieve}ヶ月目`,               sub: cappedAchieve < 84 ? "7年以内に達成" : "7年（最終保証）" },
          { label: "達成後のコスト率",value: `${finalRatio}%`,                        sub: `月額¥${plan.monthly.toLocaleString("ja-JP")} ÷ 顧問料¥${plan.commit.toLocaleString("ja-JP")}` },
          { label: "月間コミット顧問料", value: `¥${plan.commit.toLocaleString("ja-JP")}`, sub: "コミット達成後に毎月積み上がる" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white px-6 py-8">
            <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-black/25 mb-3">{label}</p>
            <p className="font-inter font-black text-2xl leading-none text-[#0A0A0A] tabular-nums">{value}</p>
            <p className="text-black/25 text-[10px] mt-2 leading-tight">{sub}</p>
          </div>
        ))}
      </div>

      {/* Graph */}
      <div className="mb-8 stagger-4">
        <div className="flex items-baseline justify-between mb-4">
          <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-black/35">月別 顧問料収入 vs サービス料（万円）</p>
          <p className="text-[10px] text-black/25 font-inter">ペース {simPace}件/月 · {cappedAchieve}ヶ月で達成</p>
        </div>
        <div className="h-64 border border-black/10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData.filter((_, i) => i % 6 === 0 || i === cappedAchieve)} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEB" />
              <XAxis dataKey="month" tick={{ fontFamily: "Inter", fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${v}万`} tick={{ fontFamily: "Inter", fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`${v}万円`, ""]}
                contentStyle={{ border: "1px solid #0A0A0A", borderRadius: 0, background: "#fff", fontFamily: "Inter", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontFamily: "Inter", fontSize: 12 }} />
              <Line type="monotone" dataKey="顧問料収入" stroke="#0A0A0A" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="サービス料" stroke="#D0D0D0" strokeDasharray="6 3" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-black/25 text-[10px] mt-2 font-inter">
          ※ 顧問料収入はペース通りに成約が積み上がった場合の推計。実際の達成タイミングはBizplatFormが7年以内を保証。
        </p>
      </div>

      {/* Cost ratio message */}
      <div className="border-l-4 border-black bg-[#F4F4F4] px-6 py-5 mb-8 stagger-5">
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-black/35 mb-1">コスト構造の変化</p>
        <p className="text-lg font-bold text-[#0A0A0A]">
          コミット達成後、月額サービス料は顧問料収入の
          <span className="font-inter font-black text-[40px] leading-none tabular-nums mx-2">{finalRatio}%</span>
          に過ぎない。
        </p>
        <p className="text-black/35 text-xs mt-2">新規成約が積み上がるほど、BizplatFormへの月額の比重は薄れていく。</p>
      </div>

      {/* Matched companies preview */}
      {matched && matched.length > 0 && (
        <div className="stagger-6">
          <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-black/35 mb-4">
            対象となる企業イメージ — AIマッチング候補より
          </p>
          <div className="grid grid-cols-3 gap-px bg-black">
            {matched.slice(0, 3).map((c: any) => (
              <div key={c.id} className="bg-white px-6 py-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-sm text-[#0A0A0A]">{c.name}</span>
                  <span className="font-inter text-[9px] border border-black px-1.5 py-0.5 text-black/50">{c.industry}</span>
                </div>
                <p className="text-black/50 text-xs mb-3 leading-relaxed">{c.situation}</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-inter font-black text-xl text-[#0A0A0A] tabular-nums">¥{c.fee.toLocaleString("ja-JP")}</span>
                  <span className="text-black/30 text-xs">/月</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// 08 CLOSING
// ============================================================
function ClosingTab({ displayName, plan }: { displayName: string; plan: CommitPlan }) {
  const handlePDF = () => window.print()

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#0A0A0A] text-white px-8 py-16 flex flex-col justify-between max-w-5xl mx-auto">
      <div>
        <div className="stagger-1 mb-16">
          <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/25 mb-6">Step 08</p>
          <h1 className="font-serif-display italic leading-[0.9] text-white">
            <span className="text-[72px]">あとは、</span><br />
            <span className="not-italic font-inter font-black text-[80px]">はじめるだけ。</span>
          </h1>
          <p className="text-white/35 text-xl mt-8">{displayName} 様</p>
        </div>

        <div className="grid grid-cols-3 gap-px bg-white/8 stagger-2 mb-12">
          {[
            { num: "01", title: "本日のご確認",    body: "ご不明点・ご要望を確認。内容は柔軟に調整できます。",          timing: "本日" },
            { num: "02", title: "契約書の送付",    body: "翌営業日にメールにて電子契約書をお送りします。",              timing: "翌営業日" },
            { num: "03", title: "初回マッチング開始", body: "ご契約翌月より、AIマッチングと紹介を開始します。",         timing: "ご契約翌月" },
          ].map(({ num, title, body, timing }) => (
            <div key={num} className="bg-[#0A0A0A] border border-white/10 px-8 py-8 relative overflow-hidden">
              <span className="absolute bottom-3 right-5 font-inter font-black text-[80px] leading-none text-white/4 tabular-nums select-none">{num}</span>
              <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-white/25 mb-3">{timing}</p>
              <h3 className="font-bold text-white text-base mb-3">{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="border border-white/10 px-8 py-6 stagger-3 flex items-center justify-between">
          <div>
            <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-white/25 mb-1">選定プラン</p>
            <p className="font-inter font-black text-4xl tabular-nums text-white">
              ¥{plan.monthly.toLocaleString("ja-JP")}<span className="text-lg font-normal text-white/35 ml-1">/ 月</span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-white/25 mb-1">月間コミット</p>
            <p className="font-inter font-black text-2xl tabular-nums text-white">¥{plan.commit.toLocaleString("ja-JP")}</p>
          </div>
        </div>
      </div>

      <div className="stagger-4 flex items-end justify-between mt-16">
        <div>
          <p className="font-inter font-black text-lg tracking-[0.15em] uppercase text-white mb-1">BizplatForm</p>
          <p className="text-white/25 text-xs font-inter">株式会社BizplatForm — コミットプラン事業部</p>
        </div>
        <button
          data-cursor
          onClick={handlePDF}
          className="no-print border border-white/30 text-white/50 hover:border-white hover:text-white px-8 py-3 font-inter font-bold uppercase tracking-[0.15em] text-[11px] transition-all duration-200"
        >
          PDF をダウンロード
        </button>
      </div>
    </div>
  )
}
