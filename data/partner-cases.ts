// ============================================================
// PARTNER CASES — 提携事務所の実績事例
// 出典: BizplatForm公式サイト 顧問料合計ランキング（参考）
// ============================================================

export interface PartnerCase {
  name:        string   // 事務所名
  area:        string   // 都道府県
  region:      string   // 地域ブロック
  contracts:   number   // 累計成約件数
  monthlyFee:  number   // 月間顧問料合計（円）
  annualFee:   number   // 年商換算（円）
  avgFeePerClient: number // 1件あたり平均顧問料（円）
  note:        string   // 一言コメント
}

export const partnerCases: PartnerCase[] = [
  {
    name: "越智聖税理士事務所",
    area: "愛媛県", region: "中国・四国",
    contracts: 225, monthlyFee: 4352691, annualFee: 52232292,
    avgFeePerClient: 19345,
    note: "地方事務所ながらトップの成約数。紹介型で着実に積み上げ。",
  },
  {
    name: "山本聡公認会計士事務所",
    area: "埼玉県", region: "関東",
    contracts: 77, monthlyFee: 3511583, annualFee: 42138996,
    avgFeePerClient: 45605,
    note: "高単価路線。77件で月額350万超を達成。",
  },
  {
    name: "SOLA公認会計士事務所",
    area: "東京都", region: "関東",
    contracts: 57, monthlyFee: 2853868, annualFee: 34246416,
    avgFeePerClient: 50068,
    note: "少数精鋭・高単価型。57件でも月額285万を実現。",
  },
  {
    name: "K税理士事務所",
    area: "東京都", region: "関東",
    contracts: 144, monthlyFee: 2512337, annualFee: 30148044,
    avgFeePerClient: 17447,
    note: "中小規模顧客を量で積み上げる戦略。",
  },
  {
    name: "吉永公認会計士事務所",
    area: "大阪府", region: "関西",
    contracts: 82, monthlyFee: 2417018, annualFee: 29004216,
    avgFeePerClient: 29476,
    note: "関西エリアでのトップ実績。バランス型の成約構成。",
  },
  {
    name: "大谷聡税理士事務所",
    area: "埼玉県", region: "関東",
    contracts: 42, monthlyFee: 2178915, annualFee: 26146980,
    avgFeePerClient: 51879,
    note: "42件・高単価で月額200万超。質重視型の好事例。",
  },
  {
    name: "税理士法人AtoY",
    area: "愛知県", region: "東海",
    contracts: 92, monthlyFee: 2039989, annualFee: 24479868,
    avgFeePerClient: 22174,
    note: "東海エリアのトップ。法人メインで安定した積み上げ。",
  },
  {
    name: "萩原史彦税理士事務所",
    area: "埼玉県", region: "関東",
    contracts: 69, monthlyFee: 2025830, annualFee: 24309960,
    avgFeePerClient: 29360,
    note: "中堅事務所が提携で一気に成長。",
  },
  {
    name: "管豪邦公認会計士事務所",
    area: "大分県", region: "九州・沖縄",
    contracts: 72, monthlyFee: 1836842, annualFee: 22042104,
    avgFeePerClient: 25512,
    note: "地方都市でも72件・月額180万を達成。",
  },
  {
    name: "森下教史税理士事務所",
    area: "東京都", region: "関東",
    contracts: 44, monthlyFee: 1794807, annualFee: 21537684,
    avgFeePerClient: 40791,
    note: "少数・高単価型。44件で安定した高収益を実現。",
  },
  {
    name: "LOTUS会計事務所",
    area: "千葉県", region: "関東",
    contracts: 78, monthlyFee: 1766672, annualFee: 21200064,
    avgFeePerClient: 22649,
    note: "郊外エリアでコツコツ積み上げ。78件達成。",
  },
]

/** ヒアリング値をもとに最も響く事例を3件選定 */
export function selectResonantCases(
  selectedArea: string[],   // 対応エリア
  avgFeeNum:    number,     // 平均顧問料
  capacityNum:  number,     // 引受余力
): PartnerCase[] {
  // エリア→地域ブロックの変換
  const prefectureToRegion: Record<string, string> = {
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

  const myRegions = new Set(
    selectedArea.flatMap(a => prefectureToRegion[a] ? [prefectureToRegion[a]] : [])
  )

  const scored = partnerCases.map(c => {
    let score = 0

    // エリア一致（最重要）
    if (myRegions.size === 0 || myRegions.has(c.region)) score += 40

    // 平均顧問料の近さ（近いほど高スコア）
    const feeDiff = Math.abs(c.avgFeePerClient - avgFeeNum)
    if (feeDiff < 5000)       score += 30
    else if (feeDiff < 15000) score += 20
    else if (feeDiff < 30000) score += 10

    // 成約件数が引受余力に近い事例を優先（同規模感）
    const contractDiff = Math.abs(c.contracts - capacityNum * 3)
    if (contractDiff < 20)  score += 20
    else if (contractDiff < 50) score += 10

    return { ...c, score }
  })

  // スコア降順でソート、同点は月額顧問料で差をつける
  scored.sort((a, b) => b.score - a.score || b.monthlyFee - a.monthlyFee)

  // 地域の多様性を確保（同じ地域から2件以上選ばない）
  const selected: typeof scored = []
  const usedRegions = new Set<string>()
  for (const c of scored) {
    if (selected.length >= 3) break
    if (!usedRegions.has(c.region) || myRegions.has(c.region)) {
      selected.push(c)
      usedRegions.add(c.region)
    }
  }
  // 足りない場合は補充
  if (selected.length < 3) {
    for (const c of scored) {
      if (selected.length >= 3) break
      if (!selected.find(s => s.name === c.name)) selected.push(c)
    }
  }

  return selected.slice(0, 3)
}
