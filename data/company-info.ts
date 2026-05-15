// ============================================================
// COMPANY INFO — 会社概要
// ============================================================

export interface OfficeInfo {
  name:       string
  postalCode: string
  address:    string
  tel:        string
}

export interface ExecutiveInfo {
  title: string
  name:  string
}

export const companyInfo = {
  name:     "株式会社BizPlatform",
  nameKana: "ビズプラットフォーム",
  url:      "https://www.bizplatform.co.jp/",
  founded:  "2006年5月18日",
  foundedYear: 2006,

  // Vision / Mission — Section 2 の hero
  vision:  "日本を代表するビジネスマッチング事業を創る",
  mission: "ビジネスマッチング事業を通じて、日本中すべての中小企業に変化を促し、【黒字化経営】を推進します。",

  representative: {
    title: "代表取締役社長",
    name:  "渡邉 洋之",
  } as ExecutiveInfo,

  business: "税理士事務所及び社会保険労務士事務所支援事業、税理士及び社会保険労務士紹介事業",

  offices: [
    { name: "本社",         postalCode: "330-0802", address: "埼玉県さいたま市大宮区宮町4-149-3 第8藤島ビル2F・5F", tel: "048-650-9901" },
    { name: "広島営業所",   postalCode: "730-0032", address: "広島県広島市中区立町2-25 IG石田学園ビル5F",          tel: "082-544-1355" },
    { name: "和歌山営業所", postalCode: "640-8343", address: "和歌山県和歌山市吉田386 和歌山プラザビル4F",         tel: "073-435-5680" },
  ] as OfficeInfo[],

  // KPI 4 指標
  kpiNumbers: [
    { value: "2,000+", label: "導入事務所",       note: "全国対応" },
    { value: "250",    label: "従業員数",         note: "オペレーター 220 名" },
    { value: "20年",   label: "創業から",         note: "2006 年設立" },
    { value: "3拠点",  label: "営業ネットワーク", note: "埼玉・広島・和歌山" },
  ],

  // 大手取引先
  notableClients: [
    "キヤノンマーケティングジャパン株式会社",
    "京セラドキュメントソリューションズジャパン株式会社",
  ],

  // 将来活用向け (現 Section 2 では非表示)
  capital:   "26,500,000円(準備金1億円)",
  employees: "250名(オペレーター220名)",
}
