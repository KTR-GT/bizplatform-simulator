import { useMemo } from "react"
import { commitPlans } from "@/data/commit-plans"
import { customerDatabase } from "@/data/customer-database"

const prefectureToArea: Record<string, string> = {
  "北海道": "北海道・東北", "青森県": "北海道・東北", "岩手県": "北海道・東北",
  "宮城県": "北海道・東北", "秋田県": "北海道・東北", "山形県": "北海道・東北", "福島県": "北海道・東北",
  "茨城県": "関東", "栃木県": "関東", "群馬県": "関東", "埼玉県": "関東",
  "千葉県": "関東", "東京都": "関東", "神奈川県": "関東",
  "新潟県": "関東", "山梨県": "関東", "長野県": "関東",
  "静岡県": "東海", "愛知県": "東海", "岐阜県": "東海", "三重県": "東海",
  "富山県": "東海", "石川県": "東海", "福井県": "東海",
  "滋賀県": "関西", "京都府": "関西", "大阪府": "関西",
  "兵庫県": "関西", "奈良県": "関西", "和歌山県": "関西",
  "鳥取県": "中国・四国", "島根県": "中国・四国", "岡山県": "中国・四国",
  "広島県": "中国・四国", "山口県": "中国・四国",
  "徳島県": "中国・四国", "香川県": "中国・四国", "愛媛県": "中国・四国", "高知県": "中国・四国",
  "福岡県": "九州・沖縄", "佐賀県": "九州・沖縄", "長崎県": "九州・沖縄",
  "熊本県": "九州・沖縄", "大分県": "九州・沖縄", "宮崎県": "九州・沖縄",
  "鹿児島県": "九州・沖縄", "沖縄県": "九州・沖縄",
}

function areaMatch(selectedArea: string, prefecture: string): boolean {
  if (selectedArea === "全国") return true
  return prefectureToArea[prefecture] === selectedArea
}

export interface SimulatorInputs {
  clientCount:              string
  capacity:                 string
  avgFee:                   string
  naturalIncrease:          string
  naturalDecrease:          string
  selectedSoftware:         string[]
  ngIndustries:             string[]
  selectedArea:             string[]
  preferredAccountingStyle: string
  preferredType:            string
  preferredDigitalLevel:    string
  goodThemes:               string[]
  goodIndustries:           string[]
  preferredRevRange:        string
}

export function useSimulatorModel(inputs: SimulatorInputs) {
  const clientNum        = parseInt(inputs.clientCount)   || 30
  const capacityNum      = parseInt(inputs.capacity)      || 20
  const avgFeeNum        = parseInt(inputs.avgFee)        || 25000
  const naturalIncreaseNum = parseInt(inputs.naturalIncrease) || 0
  const naturalDecreaseNum = parseInt(inputs.naturalDecrease) || 0

  const recommendedPlanIndex = useMemo(() => {
    const potential = capacityNum * avgFeeNum
    return commitPlans.reduce((best, plan, idx) =>
      Math.abs(plan.commit - potential) < Math.abs(commitPlans[best].commit - potential) ? idx : best
    , 0)
  }, [capacityNum, avgFeeNum])

  const diagnosis = useMemo(() => {
    const monthly   = clientNum * avgFeeNum
    const annual    = monthly * 12
    const churnRisk = Math.round(clientNum * 0.065)
    let y3 = annual
    for (let i = 0; i < 3; i++) y3 *= (1 - 0.065)
    return { monthly, annual, churnRisk, y3, diff: annual - y3 }
  }, [clientNum, avgFeeNum])

  const chartData = useMemo(() => {
    const plan = commitPlans[recommendedPlanIndex]
    let cur = diagnosis.annual
    // 自然増減を年換算顧問料に換算
    const netNaturalAnnual = (naturalIncreaseNum - naturalDecreaseNum) * avgFeeNum * 12
    return Array.from({ length: 8 }, (_, y) => {
      if (y > 0) cur *= (1 - 0.065)
      return {
        year: `${y}年目`,
        現状維持: Math.round((cur + netNaturalAnnual * y) / 10000),
        改善後:   Math.round((diagnosis.annual + netNaturalAnnual * y + (plan.commit * 12 * y) / 7) / 10000),
      }
    })
  }, [diagnosis.annual, recommendedPlanIndex, naturalIncreaseNum, naturalDecreaseNum, avgFeeNum])

  const plan            = commitPlans[recommendedPlanIndex]
  const totalInvestment = plan.monthly * 84
  const commitRevenue   = plan.commit * 12 * 7
  const roi             = ((commitRevenue - totalInvestment) / totalInvestment) * 100
  const payback         = Math.ceil(totalInvestment / plan.commit)

  const matched = useMemo(() =>
    customerDatabase
      .filter(c => !inputs.ngIndustries.includes(c.industry))
      .map(c => ({
        ...c,
        score:
          (inputs.selectedSoftware.includes(c.software) ? 30 : inputs.selectedSoftware.length === 0 ? 10 : 0)
        + (inputs.selectedArea.length === 0 || inputs.selectedArea.includes("全国") ? 15 :
           inputs.selectedArea.some(a => areaMatch(a, c.prefecture)) ? 15 : 0)
        + ((inputs.preferredAccountingStyle as string) === "どちらでも" ? 0 :
           (inputs.preferredAccountingStyle as string) === "丸投げ歓迎" && c.accountingStyle === "丸投げ" ? 20 :
           (inputs.preferredAccountingStyle as string) === "クラウド推奨" && (c.accountingStyle === "クラウド自力" || c.accountingStyle === "クラウド移行中") ? 20 : 0)
        + ((inputs.preferredType as string) === "どちらでも" ? 0 :
           (inputs.preferredType as string) === "法人メイン" && c.type === "法人" ? 15 :
           (inputs.preferredType as string) === "個人メイン" && c.type === "個人事業主" ? 15 : 0)
        + ((inputs.preferredDigitalLevel as string) === "どちらでも" ? 0 :
           (inputs.preferredDigitalLevel as string) === c.digitalLevel ? 15 : 0)
        + (inputs.goodThemes.length > 0 && inputs.goodThemes.includes(c.theme) ? 25 : 0)
        + (inputs.goodIndustries.length > 0 && inputs.goodIndustries.includes(c.industry) ? 15 : 0)
        + (inputs.preferredRevRange === "" ? 0 :
           inputs.preferredRevRange === "小規模（〜3,000万）" && c.revenue < 3000 ? 15 :
           inputs.preferredRevRange === "中規模（3,000万〜1億）" && c.revenue >= 3000 && c.revenue < 10000 ? 15 :
           inputs.preferredRevRange === "大規模（1億〜）" && c.revenue >= 10000 ? 15 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
  , [inputs.selectedSoftware, inputs.ngIndustries, inputs.selectedArea, inputs.preferredAccountingStyle,
     inputs.preferredType, inputs.preferredDigitalLevel, inputs.goodThemes, inputs.goodIndustries, inputs.preferredRevRange])

  return {
    clientNum, capacityNum, avgFeeNum, naturalIncreaseNum, naturalDecreaseNum,
    recommendedPlanIndex, diagnosis, chartData, plan,
    totalInvestment, commitRevenue, roi, payback, matched,
  }
}
