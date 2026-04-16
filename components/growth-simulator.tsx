"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
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

// ============================================================
// CUSTOMER DATABASE (50社)
// ============================================================
const customerDatabase = [
  // 建設
  { id: 1,  name: "山田工務店",             industry: "建設",    type: "法人",      revenue: 3800,  employees: 8,  founded: 2, software: "弥生",            prefecture: "東京都",   fee: 38000, situation: "創業2年。融資審査のため決算書の精度向上が急務。",             bookkeeping: "領収書を封筒で保管、月末に持参希望。",                       urgency: "高" },
  { id: 2,  name: "北川建設",               industry: "建設",    type: "個人事業主", revenue: 1800,  employees: 4,  founded: 2, software: "なし",            prefecture: "埼玉県",   fee: 25000, situation: "一人親方から従業員を雇い始めた。給与計算が全くわからない。",   bookkeeping: "紙の帳簿に手書き。記帳を全部任せたい。",                       urgency: "高" },
  { id: 3,  name: "東和リフォーム",         industry: "建設",    type: "法人",      revenue: 5200,  employees: 12, founded: 5, software: "弥生",            prefecture: "神奈川県", fee: 42000, situation: "工事別原価管理を強化したい。利益率が把握できていない。",       bookkeeping: "弥生使用中だが入力は月1回まとめて。",                         urgency: "中" },
  { id: 4,  name: "松本内装",               industry: "建設",    type: "個人事業主", revenue: 2200,  employees: 3,  founded: 3, software: "freee",           prefecture: "千葉県",   fee: 28000, situation: "法人成りのタイミングを相談したい。売上が安定してきた。",       bookkeeping: "freeeを最近導入。使い方に不安がある。",                       urgency: "中" },
  { id: 5,  name: "サンライズ建設",         industry: "建設",    type: "法人",      revenue: 7200,  employees: 20, founded: 7, software: "JDL",             prefecture: "愛知県",   fee: 52000, situation: "事業承継を5年以内に検討中。株式移転方法を知りたい。",         bookkeeping: "JDLで経理担当が処理。月次チェックを依頼したい。",             urgency: "低" },
  { id: 6,  name: "田中板金工業",           industry: "建設",    type: "法人",      revenue: 4100,  employees: 9,  founded: 4, software: "マネーフォワード", prefecture: "大阪府",   fee: 35000, situation: "設備投資を検討。補助金活用と節税の両立を相談したい。",       bookkeeping: "マネーフォワード連携済み。確認作業のみ依頼希望。",             urgency: "中" },
  // 飲食
  { id: 7,  name: "cafe&bar KUBO",          industry: "飲食",    type: "個人事業主", revenue: 1200,  employees: 3,  founded: 2, software: "freee",           prefecture: "東京都",   fee: 22000, situation: "freeeを入れたが放置状態。インボイス対応も不安。",             bookkeeping: "freeeアプリは入れたが未使用。レシートは袋に保管。",           urgency: "高" },
  { id: 8,  name: "ラーメン工房 麺道",      industry: "飲食",    type: "法人",      revenue: 2800,  employees: 8,  founded: 3, software: "なし",            prefecture: "福岡県",   fee: 30000, situation: "3店舗目を出店予定。店舗別の収支管理が必要になった。",         bookkeeping: "手書き帳簿。レジデータをExcelに転記している。",               urgency: "高" },
  { id: 9,  name: "ベルパエーゼ",           industry: "飲食",    type: "法人",      revenue: 3800,  employees: 12, founded: 4, software: "マネーフォワード", prefecture: "神奈川県", fee: 38000, situation: "食材原価率が把握できていない。改善策を相談したい。",           bookkeeping: "マネーフォワード使用中。月次分析を依頼したい。",               urgency: "中" },
  { id: 10, name: "パン工房 麦の穂",        industry: "飲食",    type: "個人事業主", revenue: 900,   employees: 2,  founded: 1, software: "なし",            prefecture: "長野県",   fee: 18000, situation: "開業1年目。青色申告の届出すら出し忘れていた。",               bookkeeping: "売上ノートのみ。経費はレシートを箱に入れている。",             urgency: "高" },
  { id: 11, name: "居酒屋 和楽",            industry: "飲食",    type: "法人",      revenue: 2100,  employees: 6,  founded: 3, software: "なし",            prefecture: "大阪府",   fee: 28000, situation: "コロナ補助金の処理が未完了。今年中に整理が必要。",             bookkeeping: "手書き。前の税理士が突然連絡を絶った。",                       urgency: "高" },
  { id: 12, name: "Bistro SAKAMOTO",        industry: "飲食",    type: "法人",      revenue: 4500,  employees: 15, founded: 5, software: "freee",           prefecture: "京都府",   fee: 42000, situation: "フランチャイズ展開を検討中。財務DDが必要。",                   bookkeeping: "freeeで店舗ごとに管理。精度確認を依頼したい。",               urgency: "中" },
  // IT
  { id: 13, name: "TechSeed",               industry: "IT",      type: "法人",      revenue: 1500,  employees: 3,  founded: 2, software: "マネーフォワード", prefecture: "東京都",   fee: 35000, situation: "SaaS事業。VCからの資金調達前に財務整理が必要。",             bookkeeping: "マネーフォワード自動連携。月次精度が低い。",                   urgency: "高" },
  { id: 14, name: "デジタルクラフト",       industry: "IT",      type: "法人",      revenue: 3200,  employees: 7,  founded: 3, software: "freee",           prefecture: "大阪府",   fee: 42000, situation: "研究開発税制の適用を検討したい。",                           bookkeeping: "freeeで自動仕訳。経費精算フローを整備したい。",               urgency: "中" },
  { id: 15, name: "Webデザイン工房 ピクセル",industry: "IT",      type: "個人事業主", revenue: 1200,  employees: 1,  founded: 2, software: "マネーフォワード", prefecture: "福岡県",   fee: 20000, situation: "法人化を検討中。役員報酬の設定方法がわからない。",             bookkeeping: "マネーフォワードで最低限の管理のみ。",                         urgency: "中" },
  { id: 16, name: "AIソリューションズ",     industry: "IT",      type: "法人",      revenue: 4800,  employees: 10, founded: 4, software: "マネーフォワード", prefecture: "東京都",   fee: 50000, situation: "ストックオプション導入を検討。最適スキームを知りたい。",       bookkeeping: "マネーフォワード＋経理担当在籍。",                             urgency: "中" },
  { id: 17, name: "Appレボリューション",    industry: "IT",      type: "法人",      revenue: 2200,  employees: 5,  founded: 3, software: "freee",           prefecture: "東京都",   fee: 38000, situation: "アプリ課金収入の消費税処理に困っている。",                   bookkeeping: "freeeで管理。国際取引の処理が複雑。",                         urgency: "高" },
  { id: 18, name: "グリーンエナジー",       industry: "IT",      type: "法人",      revenue: 5500,  employees: 12, founded: 5, software: "マネーフォワード", prefecture: "大阪府",   fee: 48000, situation: "太陽光発電事業の税務処理を整理したい。",                     bookkeeping: "マネーフォワードで管理。エネルギー事業の専門論点あり。",     urgency: "中" },
  // 小売
  { id: 19, name: "雑貨店 ことり屋",        industry: "小売",    type: "個人事業主", revenue: 850,   employees: 2,  founded: 2, software: "freee",           prefecture: "東京都",   fee: 18000, situation: "ネット販売が急増。インボイス対応急ぎ。",                       bookkeeping: "freeeで売上管理。経費の計上方法が不明点だらけ。",             urgency: "高" },
  { id: 20, name: "ファッションハウスODA",  industry: "小売",    type: "法人",      revenue: 4200,  employees: 8,  founded: 5, software: "弥生",            prefecture: "大阪府",   fee: 38000, situation: "在庫管理と棚卸評価が課題。EC・実店舗の計上処理が複雑。",       bookkeeping: "弥生使用中。EC連携ができていない。",                           urgency: "中" },
  { id: 21, name: "スーパー石田",           industry: "小売",    type: "法人",      revenue: 9500,  employees: 30, founded: 10,software: "TKC",             prefecture: "埼玉県",   fee: 55000, situation: "先代から継いだ事業。相続税評価と自社株評価を整理したい。",     bookkeeping: "TKCで完全管理。相続対策に特化したアドバイスが必要。",         urgency: "低" },
  { id: 22, name: "ハンドメイド工房 てしごと",industry: "小売",  type: "個人事業主", revenue: 720,   employees: 1,  founded: 1, software: "なし",            prefecture: "京都府",   fee: 15000, situation: "Creema・minne販売が急増。確定申告のやり方がわからない。",       bookkeeping: "売上と経費をExcelに記録。仕訳知識なし。",                     urgency: "高" },
  { id: 23, name: "ペットショップ モフモフ", industry: "小売",   type: "法人",      revenue: 3100,  employees: 6,  founded: 4, software: "マネーフォワード", prefecture: "神奈川県", fee: 32000, situation: "2店舗目の出店資金を借入予定。融資のための財務改善が必要。",     bookkeeping: "マネーフォワード連携済み。月次レポートの読み方がわからない。",urgency: "中" },
  { id: 24, name: "輸入雑貨 MONDE",         industry: "小売",    type: "法人",      revenue: 2800,  employees: 5,  founded: 3, software: "弥生",            prefecture: "東京都",   fee: 32000, situation: "輸入関税の費用処理と外貨建取引の換算方法を整理したい。",       bookkeeping: "弥生で管理。国際取引の処理に困っている。",                     urgency: "中" },
  // 不動産
  { id: 25, name: "安藤不動産",             industry: "不動産",  type: "個人事業主", revenue: 4200,  employees: 2,  founded: 5, software: "弥生",            prefecture: "東京都",   fee: 45000, situation: "複数物件の減価償却計算が煩雑。節税スキームを見直したい。",     bookkeeping: "弥生で自己流入力。計算の正確性に自信がない。",                 urgency: "中" },
  { id: 26, name: "フォレストホーム",       industry: "不動産",  type: "法人",      revenue: 6800,  employees: 8,  founded: 6, software: "JDL",             prefecture: "神奈川県", fee: 52000, situation: "オーナー向け収支報告書の作成支援が必要。物件数が増加中。",     bookkeeping: "JDLで物件別管理。データ出力に時間がかかっている。",           urgency: "低" },
  { id: 27, name: "渡辺賃貸管理",           industry: "不動産",  type: "法人",      revenue: 3500,  employees: 4,  founded: 3, software: "なし",            prefecture: "大阪府",   fee: 35000, situation: "前任税理士が急逝。確定申告の期限が迫っている。",               bookkeeping: "手書き台帳のみ。急いで対応できる税理士を探している。",         urgency: "高" },
  { id: 28, name: "不動産投資家 中村",      industry: "不動産",  type: "個人事業主", revenue: 2800,  employees: 1,  founded: 4, software: "マネーフォワード", prefecture: "愛知県",   fee: 30000, situation: "法人化の検討中。個人・法人の税負担シミュレーションを依頼したい。",bookkeeping: "マネーフォワードで物件別管理。専門的な確認が必要。",         urgency: "中" },
  { id: 29, name: "民泊 里山の宿",          industry: "不動産",  type: "個人事業主", revenue: 1500,  employees: 2,  founded: 2, software: "マネーフォワード", prefecture: "長野県",   fee: 22000, situation: "Airbnb収入の税務処理。住宅宿泊事業法への対応も心配。",         bookkeeping: "マネーフォワード使用。専門的な確認を依頼したい。",             urgency: "高" },
  // 製造
  { id: 30, name: "三和金属加工",           industry: "製造",    type: "法人",      revenue: 5800,  employees: 15, founded: 6, software: "弥生",            prefecture: "愛知県",   fee: 45000, situation: "CNC旋盤導入を計画。補助金と減価償却の両立方法を知りたい。",   bookkeeping: "弥生で月次処理。製造原価計算の精度向上が必要。",               urgency: "中" },
  { id: 31, name: "木工家具 職人堂",        industry: "製造",    type: "個人事業主", revenue: 1800,  employees: 3,  founded: 3, software: "freee",           prefecture: "静岡県",   fee: 22000, situation: "BtoC通販と工務店向けBtoBの二刀流。消費税の計上が複雑。",       bookkeeping: "freeeで管理。受注ごとの原価計算ができていない。",             urgency: "高" },
  { id: 32, name: "ニッコー工業",           industry: "製造",    type: "法人",      revenue: 12000, employees: 40, founded: 15,software: "TKC",             prefecture: "新潟県",   fee: 55000, situation: "海外展開を検討。移転価格税制への対応が必要。",                 bookkeeping: "TKCで経理部門が処理。国際税務の専門アドバイスが必要。",       urgency: "低" },
  { id: 33, name: "食品加工 山の幸",        industry: "製造",    type: "法人",      revenue: 3200,  employees: 9,  founded: 4, software: "マネーフォワード", prefecture: "長野県",   fee: 32000, situation: "農産物の加工販売。農業法人との兼業税務が複雑。",               bookkeeping: "マネーフォワードで管理。農業収入との区分けが不明確。",         urgency: "中" },
  { id: 34, name: "農業法人 緑の大地",      industry: "製造",    type: "法人",      revenue: 2800,  employees: 6,  founded: 4, software: "なし",            prefecture: "茨城県",   fee: 28000, situation: "農業収入と加工品販売の消費税区分が複雑。補助金処理も未対応。", bookkeeping: "手書き台帳。農業専門の税理士を探している。",                   urgency: "中" },
  // 医療福祉
  { id: 35, name: "やまびこ訪問看護",       industry: "医療福祉", type: "法人",     revenue: 2800,  employees: 12, founded: 2, software: "マネーフォワード", prefecture: "埼玉県",   fee: 32000, situation: "開業2年目。処遇改善加算の計算が複雑で困っている。",           bookkeeping: "マネーフォワードで自動仕訳。加算の処理方法がわからない。",   urgency: "高" },
  { id: 36, name: "介護施設 さくら園",      industry: "医療福祉", type: "法人",     revenue: 8500,  employees: 35, founded: 8, software: "その他",          prefecture: "神奈川県", fee: 52000, situation: "医療法人への移行を検討中。定款変更と税務の影響を知りたい。",   bookkeeping: "専用介護ソフト使用。税務申告のみ依頼したい。",                 urgency: "中" },
  { id: 37, name: "岡田内科クリニック",     industry: "医療福祉", type: "個人事業主",revenue: 5500,  employees: 5,  founded: 3, software: "その他",          prefecture: "大阪府",   fee: 45000, situation: "自由診療を追加。保険診療との消費税区分に困っている。",         bookkeeping: "医療専用ソフト使用。税務相談のみ依頼したい。",                 urgency: "高" },
  { id: 38, name: "放課後デイ ゆめ",        industry: "医療福祉", type: "法人",     revenue: 1800,  employees: 8,  founded: 1, software: "なし",            prefecture: "福岡県",   fee: 22000, situation: "新規開業。設立から半年で会計処理が追いついていない。",           bookkeeping: "紙の帳簿のみ。早急に体制を整えたい。",                         urgency: "高" },
  { id: 39, name: "保育園 ひまわりキッズ",  industry: "医療福祉", type: "法人",     revenue: 6200,  employees: 22, founded: 6, software: "その他",          prefecture: "千葉県",   fee: 45000, situation: "社会福祉法人への移行を検討中。補助金処理と決算書様式の変更が必要。",bookkeeping: "保育専用ソフト使用。税務申告は外部に依頼したい。",         urgency: "中" },
  // 運輸
  { id: 40, name: "軽貨物ドライバー 鈴木",  industry: "運輸",    type: "個人事業主", revenue: 820,   employees: 1,  founded: 1, software: "なし",            prefecture: "東京都",   fee: 15000, situation: "軽貨物ドライバー。青色申告を始めたいが何もわからない。",         bookkeeping: "売上はアプリで確認できるが経費管理なし。",                     urgency: "高" },
  { id: 41, name: "橋本運送",               industry: "運輸",    type: "法人",      revenue: 5200,  employees: 18, founded: 8, software: "弥生",            prefecture: "愛知県",   fee: 42000, situation: "燃料費高騰で利益率が急落。資金繰り改善の相談がしたい。",         bookkeeping: "弥生で月次処理。経費分析を詳しくしてほしい。",                 urgency: "高" },
  { id: 42, name: "物流センター 丸栄",      industry: "運輸",    type: "法人",      revenue: 9800,  employees: 32, founded: 12,software: "TKC",             prefecture: "埼玉県",   fee: 55000, situation: "M&Aによる事業拡大を検討。企業評価と税務DDを依頼したい。",       bookkeeping: "TKCで経理部門完結。戦略的アドバイスが必要。",                 urgency: "低" },
  // バリエーション追加
  { id: 43, name: "hair salon MOCA",        industry: "小売",    type: "個人事業主", revenue: 980,   employees: 2,  founded: 2, software: "freee",           prefecture: "東京都",   fee: 20000, situation: "業務委託スタッフと雇用の違いがわからない。確定申告も不安。",   bookkeeping: "freeeアプリ使用。入力の正確性に自信がない。",                 urgency: "中" },
  { id: 44, name: "たけした接骨院",         industry: "医療福祉", type: "個人事業主",revenue: 2200,  employees: 3,  founded: 3, software: "なし",            prefecture: "大阪府",   fee: 25000, situation: "自費施術を増やしたい。消費税課税事業者への影響を知りたい。",   bookkeeping: "売上帳のみ。記帳代行を希望。",                                 urgency: "中" },
  { id: 45, name: "みらい進学塾",           industry: "小売",    type: "法人",      revenue: 3800,  employees: 10, founded: 5, software: "マネーフォワード", prefecture: "千葉県",   fee: 35000, situation: "授業料の前受金処理と非課税判定を正確に行いたい。",               bookkeeping: "マネーフォワードで管理。教育事業特有の論点に詳しい税理士を探している。",urgency: "中" },
  { id: 46, name: "建築設計事務所 空間工房", industry: "IT",      type: "個人事業主", revenue: 2100,  employees: 2,  founded: 3, software: "freee",           prefecture: "東京都",   fee: 28000, situation: "設計料と工事監理費の区分、消費税の判定が複雑。法人化も検討中。",bookkeeping: "freeeで管理。専門知識のある税理士に依頼したい。",             urgency: "中" },
  { id: 47, name: "IRON BODY GYM",          industry: "小売",    type: "法人",      revenue: 2400,  employees: 5,  founded: 2, software: "マネーフォワード", prefecture: "福岡県",   fee: 28000, situation: "会費収入の前受金処理とシステム投資の減価償却を整理したい。",   bookkeeping: "マネーフォワード使用。月次確認を依頼したい。",                 urgency: "中" },
  { id: 48, name: "ドリームプランニング",    industry: "IT",      type: "法人",      revenue: 1800,  employees: 4,  founded: 2, software: "freee",           prefecture: "東京都",   fee: 32000, situation: "チケット販売の収益認識と外注費の源泉徴収を整理したい。",         bookkeeping: "freeeで管理。イベント業特有の税務論点に困っている。",         urgency: "高" },
  { id: 49, name: "ヨガスタジオ ANANDA",    industry: "小売",    type: "個人事業主", revenue: 1200,  employees: 2,  founded: 2, software: "freee",           prefecture: "神奈川県", fee: 20000, situation: "インストラクターへの業務委託費と雇用の境界線が不明確。",         bookkeeping: "freeeで売上管理。経費の仕訳が正しいか不安。",                 urgency: "中" },
  { id: 50, name: "コンサルティング ストラテジクス",industry: "IT",type: "法人",   revenue: 8500,  employees: 15, founded: 7, software: "マネーフォワード", prefecture: "東京都",   fee: 55000, situation: "役員報酬の最適化と法人税の節税対策を包括的に相談したい。",     bookkeeping: "マネーフォワード＋経理担当在籍。高度な節税アドバイスを求めている。",urgency: "低" },
]

const commitPlans = [
  { monthly: 19800,  commit: 100000 },
  { monthly: 29800,  commit: 200000 },
  { monthly: 39800,  commit: 300000 },
  { monthly: 49800,  commit: 400000 },
  { monthly: 59800,  commit: 500000 },
  { monthly: 69800,  commit: 600000 },
  { monthly: 79800,  commit: 700000 },
  { monthly: 89800,  commit: 800000 },
  { monthly: 99800,  commit: 900000 },
  { monthly: 109800, commit: 1000000 },
]

const accountingSoftware = ["freee", "マネーフォワード", "弥生", "TKC", "JDL", "その他"]
const industries         = ["建設", "小売", "飲食", "製造", "IT", "不動産", "医療福祉", "運輸"]
const areas              = ["全国", "関東", "関西", "東海", "北海道・東北", "中国・四国", "九州・沖縄"]
const expansionOptions   = ["積極的に増やしたい", "慎重に検討中", "現状維持でよい"] as const
const aiUsageOptions     = ["積極活用している", "一部のみ活用", "ほぼ未活用"] as const

const TABS = [
  { id: "hearing",   label: "ヒアリング",         num: "01" },
  { id: "market",    label: "市場背景",           num: "02" },
  { id: "diagnosis", label: "現状診断",           num: "03" },
  { id: "mechanism", label: "集客の仕組み",       num: "04" },
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
  const [expansionWill,    setExpansionWill]    = useState<typeof expansionOptions[number]>(expansionOptions[0])
  const [selectedArea,     setSelectedArea]     = useState<string[]>([])
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>([])
  const [ngIndustries,     setNgIndustries]     = useState<string[]>([])
  const [aiUsage,          setAiUsage]          = useState<typeof aiUsageOptions[number]>(aiUsageOptions[2])

  const clientNum   = parseInt(clientCount)  || 30
  const capacityNum = parseInt(capacity)     || 20
  const avgFeeNum   = parseInt(avgFee)       || 30000
  const displayName = officeName || "〇〇税理士事務所"

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
    return Array.from({ length: 8 }, (_, y) => {
      if (y > 0) cur *= (1 - 0.065)
      return {
        year: `${y}年目`,
        現状維持: Math.round(cur / 10000),
        改善後:   Math.round((diagnosis.annual + (plan.commit * 12 * y) / 7) / 10000),
      }
    })
  }, [diagnosis.annual, recommendedPlanIndex])

  const matched = useMemo(() =>
    customerDatabase
      .filter(c => !ngIndustries.includes(c.industry))
      .map(c => ({
        ...c,
        score: (selectedSoftware.includes(c.software) ? 30 : selectedSoftware.length === 0 ? 15 : 0)
             + (c.founded <= 3     ? 20 : 0)
             + (c.urgency === "高" ? 25 : c.urgency === "中" ? 10 : 0)
             + (selectedArea.includes("全国") || selectedArea.length === 0 ? 10 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
  , [selectedSoftware, ngIndustries, selectedArea])

  const plan            = commitPlans[recommendedPlanIndex]
  const totalInvestment = plan.monthly * 84
  const commitRevenue   = plan.commit * 12 * 7
  const roi             = ((commitRevenue - totalInvestment) / totalInvestment) * 100
  const payback         = Math.ceil(totalInvestment / plan.commit)

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
        {activeTab === "hearing"   && <HearingTab   {...{ officeName, setOfficeName, clientCount, setClientCount, capacity, setCapacity, employees, setEmployees, avgFee, setAvgFee, expansionWill, setExpansionWill, selectedArea, setSelectedArea, selectedSoftware, setSelectedSoftware, ngIndustries, setNgIndustries, aiUsage, setAiUsage, toggle }} />}
        {activeTab === "market"    && <MarketTab />}
        {activeTab === "diagnosis" && <DiagnosisTab  diagnosis={diagnosis} chartData={chartData} displayName={displayName} planLabel={`¥${plan.monthly.toLocaleString("ja-JP")}`} />}
        {activeTab === "mechanism" && <MechanismTab />}
        {activeTab === "matching"  && <MatchingTab   matched={matched} hasInput={selectedSoftware.length > 0 || selectedArea.length > 0} />}
        {activeTab === "plan"      && <PlanTab       plan={plan} index={recommendedPlanIndex} totalInvestment={totalInvestment} commitRevenue={commitRevenue} roi={roi} payback={payback} capacityNum={capacityNum} avgFeeNum={avgFeeNum} />}
        {activeTab === "roi"       && <ROITab        plan={plan} chartData={chartData} roi={roi} payback={payback} totalInvestment={totalInvestment} commitRevenue={commitRevenue} />}
        {activeTab === "closing"   && <ClosingTab    displayName={displayName} plan={plan} />}
      </main>
    </div>
  )
}

// ============================================================
// 01 HEARING
// ============================================================
function HearingTab({ officeName, setOfficeName, clientCount, setClientCount, capacity, setCapacity, employees, setEmployees, avgFee, setAvgFee, expansionWill, setExpansionWill, selectedArea, setSelectedArea, selectedSoftware, setSelectedSoftware, ngIndustries, setNgIndustries, aiUsage, setAiUsage, toggle }: any) {
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
              { label: "関与先数",      unit: "件", val: clientCount, set: setClientCount, ph: "30"    },
              { label: "引受可能数",    unit: "件", val: capacity,    set: setCapacity,    ph: "20"    },
              { label: "従業員数",      unit: "名", val: employees,   set: setEmployees,   ph: "5"     },
              { label: "平均月額顧問料", unit: "円", val: avgFee,      set: setAvgFee,      ph: "30000" },
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
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 02 MARKET
// ============================================================
function MarketTab() {
  // Revenue distribution bar data
  const revBars = [
    { label: "〜500万",       pct: 18.6, width: "w-[22%]" },
    { label: "500〜1,000万",  pct: 16.9, width: "w-[20%]" },
    { label: "1,000〜3,000万",pct: 26.9, width: "w-[32%]" },
    { label: "3,000〜5,000万",pct: 12.0, width: "w-[14%]" },
    { label: "5,000万〜1億",  pct:  9.4, width: "w-[11%]" },
  ]
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
            <p className="font-serif-display italic text-white text-3xl mt-1">が、年商3,000万円以下。</p>
          </div>
          <div className="mb-4 border-l border-white/15 pl-6">
            <p className="text-white/40 text-sm leading-relaxed">国税庁・会社標本調査より推計<br />中小企業の大多数は年商数千万円規模。<br />これが<span className="text-white font-bold">コミットプランの主戦場</span>だ。</p>
          </div>
        </div>
      </div>

      {/* REVENUE DISTRIBUTION */}
      <div className="mb-10 stagger-2">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/25 mb-5">Revenue Distribution — 年商規模の分布</p>
        <div className="space-y-3">
          {revBars.map(({ label, pct, width }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="font-inter text-[11px] text-white/40 w-28 shrink-0 tabular-nums">{label}円</span>
              <div className="flex-1 h-px bg-white/10 relative">
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-white ${width}`}
                  style={{ width: `${pct / 30 * 100}%` }}
                />
              </div>
              <span className="font-inter font-black text-white tabular-nums text-sm w-12 text-right">{pct}%</span>
            </div>
          ))}
          <div className="flex items-center gap-4 pt-2 border-t border-white/10">
            <span className="font-inter text-[11px] text-white w-28 shrink-0 font-bold">合計（〜1億）</span>
            <div className="flex-1" />
            <span className="font-inter font-black text-white tabular-nums text-lg w-12 text-right">83.8%</span>
          </div>
        </div>
        <p className="text-white/20 text-[10px] mt-3 font-inter">中央値：年商 約1,500万円</p>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-4 gap-px bg-white/10 mb-10 stagger-3">
        {[
          { num: 296, unit: "万社", label: "国内の法人総数",           sub: "国税庁・令和5年度会社標本調査" },
          { num: 90,  unit: "%",    label: "法人の税理士関与率",       sub: "申告関与ベース（業界推計）" },
          { num: 460, unit: "万人", label: "個人事業主（青色申告者）", sub: "国税庁統計" },
          { num: 15,  unit: "万社", label: "年間の新設法人数",         sub: "法務省統計（2024年・過去最高）" },
        ].map(({ num, unit, label, sub }) => (
          <div key={label} className="bg-[#0A0A0A] px-6 py-10">
            <div className="font-inter font-black text-[54px] leading-none tabular-nums text-white">
              <AnimatedNumber value={num} suffix={unit} />
            </div>
            <p className="text-white/50 text-sm mt-3">{label}</p>
            <p className="text-white/25 text-[10px] mt-1 font-inter uppercase tracking-wider">{sub}</p>
          </div>
        ))}
      </div>

      {/* BLUE OCEAN — 顕在 vs 潜在 */}
      <div className="stagger-4 mb-10">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/25 mb-5">Market Structure — 誰に届けるか</p>
        <div className="grid grid-cols-5 border border-white/10">
          <div className="col-span-1 border-r border-white/10 p-6 flex flex-col justify-between">
            <div>
              <p className="font-inter font-black text-[42px] leading-none tabular-nums text-white/30">5<span className="text-lg">〜</span>10<span className="text-xl">%</span></p>
              <p className="text-white/25 text-xs mt-2">顕在層</p>
              <p className="text-white/20 text-[11px] mt-2 leading-relaxed">WEB検索・税理士紹介サービスなど<br />「今すぐ探している」層</p>
            </div>
            <span className="inline-block border border-white/15 text-white/25 text-[9px] px-2 py-1 uppercase tracking-wider font-inter mt-4">競合多数</span>
          </div>
          <div className="col-span-4 p-8 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full border border-white/8 pulse-ring" />
            </div>
            <p className="font-inter font-black text-[80px] leading-none tabular-nums text-white relative z-10">30<span className="text-[40px]">〜</span>40<span className="text-[40px]">%</span></p>
            <p className="text-white text-lg font-bold mt-1 relative z-10">不満を抱えているが、動いていない層</p>
            <p className="text-white/45 text-sm mt-3 max-w-lg leading-relaxed relative z-10">
              レスポンスが遅い、提案がない、クラウド未対応——<br />
              <span className="font-inter font-bold text-white">不満はあっても「変えよう」とは動かない</span>。<br />
              こちらから接触しなければ、永遠に出会えない。
            </p>
            <div className="mt-5 relative z-10 flex gap-3">
              <span className="inline-block bg-white text-[#0A0A0A] text-[9px] px-3 py-1.5 uppercase tracking-widest font-inter font-bold">
                BizplatFormがアプローチする領域
              </span>
              <span className="inline-block border border-white/30 text-white/50 text-[9px] px-3 py-1.5 uppercase tracking-widest font-inter">
                ＋ 法人成り・代替わり・税務調査後
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FEE TABLE + KEY STAT */}
      <div className="grid grid-cols-2 gap-4 stagger-5">
        {/* Fee table */}
        <div className="border border-white/10 px-8 py-6">
          <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-white/25 mb-4">月額顧問料の相場（年商規模別）</p>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/10">
              {[
                { range: "〜1,000万円",   fee: "1.0万 〜 2.0万" },
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
        {/* Key stat */}
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
    </div>
  )
}

// ============================================================
// 03 DIAGNOSIS
// ============================================================
function DiagnosisTab({ diagnosis, chartData, displayName, planLabel }: any) {
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-10 stagger-1">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-black/30 mb-3">Step 03</p>
        <h1 className="font-serif-display italic text-4xl text-[#0A0A0A] leading-tight">
          同規模の事務所で、<br />
          <span className="not-italic font-inter font-black">いま何が起きているか。</span>
        </h1>
        <p className="text-black/35 text-xs mt-3">※ 関与先30件・月額顧問料¥25,000のモデルケース（ヒアリング値を入力すると自動反映）</p>
      </div>

      <div className="grid grid-cols-4 gap-px bg-black mb-10 stagger-2">
        {[
          { label: "月間売上",   value: diagnosis.monthly,          prefix: "¥", suffix: "",  size: "text-4xl" },
          { label: "年間売上",   value: diagnosis.annual,           prefix: "¥", suffix: "",  size: "text-4xl" },
          { label: "年間離脱リスク", value: diagnosis.churnRisk,    prefix: "",  suffix: "件", size: "text-6xl" },
          { label: "3年後の予測年商", value: Math.round(diagnosis.y3), prefix: "¥", suffix: "", size: "text-4xl" },
        ].map(({ label, value, prefix, suffix, size }) => (
          <div key={label} className="bg-white px-6 py-8">
            <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-black/30 mb-3">{label}</p>
            <p className={`font-inter font-black ${size} leading-none tabular-nums text-[#0A0A0A]`}>
              <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
            </p>
          </div>
        ))}
      </div>

      <div className="border-l-4 border-black bg-[#F4F4F4] px-6 py-5 mb-10 stagger-3">
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-black/35 mb-1">Churn Risk — 離脱リスク</p>
        <p className="text-lg font-bold text-[#0A0A0A]">
          何もしなければ3年後に年間売上が
          <span className="font-inter font-black text-[32px] leading-none tabular-nums mx-2">
            ▼¥<AnimatedNumber value={Math.round(diagnosis.diff)} />
          </span>
          減少。
        </p>
        <p className="text-black/35 text-xs mt-2">年間離脱率6.5%（業界平均）× 3年間の複利計算</p>
      </div>

      <div className="stagger-4 mb-10">
        <div className="flex items-baseline justify-between mb-4">
          <p className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/35">7年間の収益推移（万円）</p>
          <p className="text-[10px] text-black/25">{planLabel}コミットプラン適用時</p>
        </div>
        <div className="h-72 border border-black/10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEB" />
              <XAxis dataKey="year" tick={{ fontFamily: "Inter", fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${v}万`} tick={{ fontFamily: "Inter", fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString("ja-JP")}万円`, ""]}
                contentStyle={{ border: "1px solid #0A0A0A", borderRadius: 0, background: "#fff", fontFamily: "Inter", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontFamily: "Inter", fontSize: 12 }} />
              <Line type="monotone" dataKey="現状維持" stroke="#D0D0D0" strokeDasharray="6 3" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="改善後"   stroke="#0A0A0A" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px bg-black stagger-5">
        {[
          { num: "97%",   label: "年商1億円未満の法人割合", detail: "中小規模が市場の大多数" },
          { num: "約31万社", label: "税理士未関与の法人数",   detail: "潜在的な顧客市場" },
          { num: "6.5%", label: "年間の顧客離脱率（業界平均）", detail: "放置すれば確実に減少" },
        ].map(({ num, label, detail }) => (
          <div key={label} className="bg-white px-8 py-8 text-center">
            <p className="font-inter font-black text-[40px] leading-none text-[#0A0A0A] mb-2">{num}</p>
            <p className="text-[#0A0A0A] text-sm font-bold">{label}</p>
            <p className="text-black/30 text-xs mt-1">{detail}</p>
          </div>
        ))}
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
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-black/30 mb-3">Step 04</p>
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
          <span className="font-inter font-black text-[80px] leading-none tabular-nums">210</span>
          <span className="font-bold text-3xl">万件</span>
        </div>
        <p className="text-white/50 text-base max-w-xl leading-relaxed">
          WEB上に出てこない、潜在的な税理士ニーズを持つ企業数（推計）。<br />
          BizplatFormはこの市場に<span className="text-white font-bold">専門のコールセンター</span>で直接アプローチしています。
        </p>
      </div>
    </div>
  )
}

// ============================================================
// 05 MATCHING
// ============================================================
function MatchingTab({ matched, hasInput }: { matched: (typeof customerDatabase[0] & { score: number })[]; hasInput: boolean }) {
  const urgencyStyle = (u: string) =>
    u === "高" ? "bg-[#0A0A0A] text-white" : u === "中" ? "border border-black text-[#0A0A0A]" : "border border-black/20 text-black/35"

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
          <p className="font-serif-display italic text-2xl text-black/25">Step 01 でソフト・エリアを選択すると</p>
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
                  <div>
                    <span className={`inline-block text-[9px] px-2 py-1 font-inter font-bold uppercase tracking-wider ${urgencyStyle(c.urgency)}`}>
                      緊急度 {c.urgency}
                    </span>
                    <p className="text-black/25 text-[10px] mt-1">{c.software}</p>
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
function PlanTab({ plan, index, totalInvestment, commitRevenue, roi, payback, capacityNum, avgFeeNum }: any) {
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
        <div className="col-span-3 bg-[#0A0A0A] px-10 py-10 flex flex-col justify-between">
          <div>
            <p className="font-inter text-[9px] uppercase tracking-[0.3em] text-white/25 mb-6">
              Commit Plan {String(index + 1).padStart(2, "0")}
            </p>
            <p className="font-inter font-black text-[96px] leading-none tabular-nums text-white">
              ¥{plan.monthly.toLocaleString("ja-JP")}
            </p>
            <p className="text-white/35 text-lg mt-1 font-inter">/ 月（税抜）</p>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-white/35 text-[11px] uppercase tracking-wider font-inter mb-2">月間コミット</p>
            <p className="font-inter font-black text-4xl text-white tabular-nums">¥{plan.commit.toLocaleString("ja-JP")}</p>
            <p className="text-white/25 text-xs mt-1">の新規顧問料をコミット（保証）</p>
          </div>
        </div>

        <div className="col-span-2 bg-white px-8 py-10 flex flex-col justify-between">
          <div>
            <p className="font-inter text-[9px] uppercase tracking-[0.3em] text-black/25 mb-6">なぜこのプランか</p>
            <div className="space-y-5">
              <div className="border-l-2 border-black pl-4">
                <p className="text-[9px] text-black/35 font-inter uppercase tracking-wider mb-1">引受可能数 × 平均顧問料</p>
                <p className="font-inter font-black text-xl tabular-nums text-[#0A0A0A]">¥{potential.toLocaleString("ja-JP")} / 月</p>
                <p className="text-[10px] text-black/30 mt-0.5">先生の新規売上ポテンシャル</p>
              </div>
              <div className="border-l-2 border-black/20 pl-4">
                <p className="text-[9px] text-black/35 font-inter uppercase tracking-wider mb-1">最適コミット額</p>
                <p className="font-inter font-bold text-lg tabular-nums text-[#0A0A0A]">¥{plan.commit.toLocaleString("ja-JP")} / 月</p>
                <p className="text-[10px] text-black/30 mt-0.5">ポテンシャルに最も近いプランを自動選定</p>
              </div>
              <div className="border-l-2 border-black/10 pl-4">
                <p className="text-[9px] text-black/35 font-inter uppercase tracking-wider mb-1">投資回収まで</p>
                <p className="font-inter font-bold text-lg tabular-nums text-[#0A0A0A]">約{payback}ヶ月</p>
                <p className="text-[10px] text-black/30 mt-0.5">投資回収完了の目安</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-black/25 font-inter mt-6 pt-5 border-t border-black/10">他のプランを検討する場合は Step 07 をご参照ください</p>
        </div>
      </div>

      <div className="border border-black stagger-3">
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
function ROITab({ plan, chartData, roi, payback, totalInvestment, commitRevenue }: any) {
  const diff = commitRevenue - totalInvestment
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-10 stagger-1">
        <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-black/30 mb-3">Step 07</p>
        <h1 className="font-serif-display italic text-4xl text-[#0A0A0A] leading-tight">
          投資すれば、<br />
          <span className="not-italic font-inter font-black">何倍になるか。</span>
        </h1>
      </div>

      <div className="border-b border-black mb-10 pb-10 stagger-2">
        <p className="font-inter text-[9px] uppercase tracking-[0.3em] text-black/25 mb-2">7年間 ROI</p>
        <div className="flex items-baseline gap-2">
          <span className="font-inter font-black text-[130px] leading-none tabular-nums text-[#0A0A0A]">
            <AnimatedNumber value={Math.round(roi)} duration={1500} />
          </span>
          <span className="font-inter font-black text-[56px] leading-none text-[#0A0A0A]">%</span>
        </div>
        <p className="text-black/30 text-xs mt-2">（7年間コミット売上 − 総投資額）÷ 総投資額 × 100</p>
      </div>

      <div className="grid grid-cols-3 gap-px bg-black mb-10 stagger-3">
        {[
          { label: "7年間の総投資額",     value: totalInvestment, prefix: "¥", suffix: "",  size: "text-3xl" },
          { label: "7年間のコミット売上",  value: commitRevenue,   prefix: "¥", suffix: "",  size: "text-3xl" },
          { label: "投資回収期間",        value: payback,         prefix: "",  suffix: "ヶ月", size: "text-5xl" },
        ].map(({ label, value, prefix, suffix, size }) => (
          <div key={label} className="bg-white px-6 py-8">
            <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-black/25 mb-3">{label}</p>
            <p className={`font-inter font-black ${size} leading-none tabular-nums text-[#0A0A0A]`}>
              <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
            </p>
          </div>
        ))}
      </div>

      <div className="mb-10 stagger-4">
        <p className="font-inter text-[9px] uppercase tracking-[0.2em] text-black/35 mb-4">収益推移グラフ（万円）</p>
        <div className="h-72 border border-black/10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0A0A0A" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#0A0A0A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEB" />
              <XAxis dataKey="year" tick={{ fontFamily: "Inter", fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${v}万`} tick={{ fontFamily: "Inter", fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString("ja-JP")}万円`, ""]}
                contentStyle={{ border: "1px solid #0A0A0A", borderRadius: 0, background: "#fff", fontFamily: "Inter", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontFamily: "Inter", fontSize: 12 }} />
              <Area type="monotone" dataKey="現状維持" stroke="#CCCCCC" strokeDasharray="6 3" strokeWidth={2} fill="none" dot={false} />
              <Area type="monotone" dataKey="改善後"   stroke="#0A0A0A" strokeWidth={3} fill="url(#grad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#0A0A0A] text-white px-10 py-8 stagger-5 flex items-center justify-between">
        <div>
          <p className="font-inter text-[9px] uppercase tracking-[0.3em] text-white/25 mb-2">改善後と現状維持の7年間差額</p>
          <p className="font-inter font-black text-[52px] leading-none tabular-nums text-white">
            ＋¥<AnimatedNumber value={diff} />
          </p>
        </div>
        <p className="text-white/40 text-sm max-w-xs leading-relaxed text-right">
          このまま何もしない選択と、<br />
          コミットプランを始める選択。<br />
          <span className="text-white font-bold">差は、7年後に現れます。</span>
        </p>
      </div>
    </div>
  )
}

// ============================================================
// 08 CLOSING
// ============================================================
function ClosingTab({ displayName, plan }: { displayName: string; plan: typeof commitPlans[0] }) {
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
