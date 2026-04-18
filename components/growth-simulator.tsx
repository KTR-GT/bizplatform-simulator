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
  // accountingStyle: "月次訪問希望" | "クラウド完結" | "担当者任せ"
  // digitalLevel:    "デジタル初心者" | "中程度" | "デジタル得意"
  // theme:           main topic tag
  // 建設
  { id: 1,  name: "山田工務店",              industry: "建設",    type: "法人",       revenue: 3800,  employees: 8,  founded: 2,  software: "弥生",            prefecture: "東京都",   fee: 38000, situation: "創業2年。融資審査のため決算書の精度向上が急務。",              bookkeeping: "領収書を封筒で保管、月末に持参希望。",              accountingStyle: "月次訪問希望", digitalLevel: "デジタル初心者", theme: "融資" },
  { id: 2,  name: "北川建設",                industry: "建設",    type: "個人事業主", revenue: 1800,  employees: 4,  founded: 2,  software: "なし",            prefecture: "埼玉県",   fee: 25000, situation: "一人親方から従業員を雇い始めた。給与計算が全くわからない。",  bookkeeping: "紙の帳簿に手書き。記帳を全部任せたい。",            accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "給与" },
  { id: 3,  name: "東和リフォーム",          industry: "建設",    type: "法人",       revenue: 5200,  employees: 12, founded: 5,  software: "弥生",            prefecture: "神奈川県", fee: 42000, situation: "工事別原価管理を強化したい。利益率が把握できていない。",    bookkeeping: "弥生使用中だが入力は月1回まとめて。",               accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "原価管理" },
  { id: 4,  name: "松本内装",                industry: "建設",    type: "個人事業主", revenue: 2200,  employees: 3,  founded: 3,  software: "freee",           prefecture: "千葉県",   fee: 28000, situation: "法人成りのタイミングを相談したい。売上が安定してきた。",    bookkeeping: "freeeを最近導入。使い方に不安がある。",              accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "法人成り" },
  { id: 5,  name: "サンライズ建設",          industry: "建設",    type: "法人",       revenue: 7200,  employees: 20, founded: 7,  software: "JDL",             prefecture: "愛知県",   fee: 52000, situation: "事業承継を5年以内に検討中。株式移転方法を知りたい。",      bookkeeping: "JDLで経理担当が処理。月次チェックを依頼したい。",   accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "事業承継" },
  { id: 6,  name: "田中板金工業",            industry: "建設",    type: "法人",       revenue: 4100,  employees: 9,  founded: 4,  software: "マネーフォワード", prefecture: "大阪府",   fee: 35000, situation: "設備投資を検討。補助金活用と節税の両立を相談したい。",    bookkeeping: "マネーフォワード連携済み。確認作業のみ依頼希望。",  accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "補助金" },
  // 飲食
  { id: 7,  name: "cafe&bar KUBO",           industry: "飲食",    type: "個人事業主", revenue: 1200,  employees: 3,  founded: 2,  software: "freee",           prefecture: "東京都",   fee: 22000, situation: "freeeを入れたが放置状態。インボイス対応も不安。",          bookkeeping: "freeeアプリは入れたが未使用。レシートは袋に保管。",  accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "インボイス" },
  { id: 8,  name: "ラーメン工房 麺道",       industry: "飲食",    type: "法人",       revenue: 2800,  employees: 8,  founded: 3,  software: "なし",            prefecture: "福岡県",   fee: 30000, situation: "3店舗目を出店予定。店舗別の収支管理が必要になった。",      bookkeeping: "手書き帳簿。レジデータをExcelに転記している。",      accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "多店舗" },
  { id: 9,  name: "ベルパエーゼ",            industry: "飲食",    type: "法人",       revenue: 3800,  employees: 12, founded: 4,  software: "マネーフォワード", prefecture: "神奈川県", fee: 38000, situation: "食材原価率が把握できていない。改善策を相談したい。",      bookkeeping: "マネーフォワード使用中。月次分析を依頼したい。",     accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "原価管理" },
  { id: 10, name: "パン工房 麦の穂",         industry: "飲食",    type: "個人事業主", revenue: 900,   employees: 2,  founded: 1,  software: "なし",            prefecture: "長野県",   fee: 18000, situation: "開業1年目。青色申告の届出すら出し忘れていた。",            bookkeeping: "売上ノートのみ。経費はレシートを箱に入れている。",   accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "青色申告" },
  { id: 11, name: "居酒屋 和楽",             industry: "飲食",    type: "法人",       revenue: 2100,  employees: 6,  founded: 3,  software: "なし",            prefecture: "大阪府",   fee: 28000, situation: "コロナ補助金の処理が未完了。今年中に整理が必要。",        bookkeeping: "手書き。前の税理士が突然連絡を絶った。",             accountingStyle: "月次訪問希望", digitalLevel: "デジタル初心者", theme: "補助金" },
  { id: 12, name: "Bistro SAKAMOTO",         industry: "飲食",    type: "法人",       revenue: 4500,  employees: 15, founded: 5,  software: "freee",           prefecture: "京都府",   fee: 42000, situation: "フランチャイズ展開を検討中。財務DDが必要。",              bookkeeping: "freeeで店舗ごとに管理。精度確認を依頼したい。",      accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "FC展開" },
  // IT
  { id: 13, name: "TechSeed",                industry: "IT",      type: "法人",       revenue: 1500,  employees: 3,  founded: 2,  software: "マネーフォワード", prefecture: "東京都",   fee: 35000, situation: "SaaS事業。VCからの資金調達前に財務整理が必要。",          bookkeeping: "マネーフォワード自動連携。月次精度が低い。",          accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "資金調達" },
  { id: 14, name: "デジタルクラフト",        industry: "IT",      type: "法人",       revenue: 3200,  employees: 7,  founded: 3,  software: "freee",           prefecture: "大阪府",   fee: 42000, situation: "研究開発税制の適用を検討したい。",                        bookkeeping: "freeeで自動仕訳。経費精算フローを整備したい。",      accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "節税" },
  { id: 15, name: "Webデザイン工房 ピクセル", industry: "IT",     type: "個人事業主", revenue: 1200,  employees: 1,  founded: 2,  software: "マネーフォワード", prefecture: "福岡県",   fee: 20000, situation: "法人化を検討中。役員報酬の設定方法がわからない。",        bookkeeping: "マネーフォワードで最低限の管理のみ。",               accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "法人成り" },
  { id: 16, name: "AIソリューションズ",      industry: "IT",      type: "法人",       revenue: 4800,  employees: 10, founded: 4,  software: "マネーフォワード", prefecture: "東京都",   fee: 50000, situation: "ストックオプション導入を検討。最適スキームを知りたい。",  bookkeeping: "マネーフォワード＋経理担当在籍。",                   accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "SO" },
  { id: 17, name: "Appレボリューション",     industry: "IT",      type: "法人",       revenue: 2200,  employees: 5,  founded: 3,  software: "freee",           prefecture: "東京都",   fee: 38000, situation: "アプリ課金収入の消費税処理に困っている。",               bookkeeping: "freeeで管理。国際取引の処理が複雑。",                accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "消費税" },
  { id: 18, name: "グリーンエナジー",        industry: "IT",      type: "法人",       revenue: 5500,  employees: 12, founded: 5,  software: "マネーフォワード", prefecture: "大阪府",   fee: 48000, situation: "太陽光発電事業の税務処理を整理したい。",                 bookkeeping: "マネーフォワードで管理。エネルギー事業の専門論点あり。", accountingStyle: "クラウド完結", digitalLevel: "デジタル得意", theme: "節税" },
  // 小売
  { id: 19, name: "雑貨店 ことり屋",         industry: "小売",    type: "個人事業主", revenue: 850,   employees: 2,  founded: 2,  software: "freee",           prefecture: "東京都",   fee: 18000, situation: "ネット販売が急増。インボイス対応急ぎ。",                  bookkeeping: "freeeで売上管理。経費の計上方法が不明点だらけ。",   accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "インボイス" },
  { id: 20, name: "ファッションハウスODA",   industry: "小売",    type: "法人",       revenue: 4200,  employees: 8,  founded: 5,  software: "弥生",            prefecture: "大阪府",   fee: 38000, situation: "在庫管理と棚卸評価が課題。EC・実店舗の計上処理が複雑。",  bookkeeping: "弥生使用中。EC連携ができていない。",                accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "在庫" },
  { id: 21, name: "スーパー石田",            industry: "小売",    type: "法人",       revenue: 9500,  employees: 30, founded: 10, software: "TKC",             prefecture: "埼玉県",   fee: 55000, situation: "先代から継いだ事業。相続税評価と自社株評価を整理したい。", bookkeeping: "TKCで完全管理。相続対策に特化したアドバイスが必要。", accountingStyle: "月次訪問希望", digitalLevel: "中程度",        theme: "事業承継" },
  { id: 22, name: "ハンドメイド工房 てしごと", industry: "小売", type: "個人事業主", revenue: 720,   employees: 1,  founded: 1,  software: "なし",            prefecture: "京都府",   fee: 15000, situation: "Creema・minne販売が急増。確定申告のやり方がわからない。",  bookkeeping: "売上と経費をExcelに記録。仕訳知識なし。",           accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "青色申告" },
  { id: 23, name: "ペットショップ モフモフ",  industry: "小売",   type: "法人",       revenue: 3100,  employees: 6,  founded: 4,  software: "マネーフォワード", prefecture: "神奈川県", fee: 32000, situation: "2店舗目の出店資金を借入予定。融資のための財務改善が必要。", bookkeeping: "マネーフォワード連携済み。月次レポートの読み方がわからない。", accountingStyle: "クラウド完結", digitalLevel: "中程度",        theme: "融資" },
  { id: 24, name: "輸入雑貨 MONDE",          industry: "小売",    type: "法人",       revenue: 2800,  employees: 5,  founded: 3,  software: "弥生",            prefecture: "東京都",   fee: 32000, situation: "輸入関税の費用処理と外貨建取引の換算方法を整理したい。",  bookkeeping: "弥生で管理。国際取引の処理に困っている。",           accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "国際" },
  // 不動産
  { id: 25, name: "安藤不動産",              industry: "不動産",  type: "個人事業主", revenue: 4200,  employees: 2,  founded: 5,  software: "弥生",            prefecture: "東京都",   fee: 45000, situation: "複数物件の減価償却計算が煩雑。節税スキームを見直したい。",  bookkeeping: "弥生で自己流入力。計算の正確性に自信がない。",       accountingStyle: "月次訪問希望", digitalLevel: "デジタル初心者", theme: "節税" },
  { id: 26, name: "フォレストホーム",        industry: "不動産",  type: "法人",       revenue: 6800,  employees: 8,  founded: 6,  software: "JDL",             prefecture: "神奈川県", fee: 52000, situation: "オーナー向け収支報告書の作成支援が必要。物件数が増加中。",  bookkeeping: "JDLで物件別管理。データ出力に時間がかかっている。",  accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "賃貸" },
  { id: 27, name: "渡辺賃貸管理",            industry: "不動産",  type: "法人",       revenue: 3500,  employees: 4,  founded: 3,  software: "なし",            prefecture: "大阪府",   fee: 35000, situation: "前任税理士が急逝。確定申告の期限が迫っている。",          bookkeeping: "手書き台帳のみ。急いで対応できる税理士を探している。", accountingStyle: "担当者任せ",  digitalLevel: "デジタル初心者", theme: "申告" },
  { id: 28, name: "不動産投資家 中村",       industry: "不動産",  type: "個人事業主", revenue: 2800,  employees: 1,  founded: 4,  software: "マネーフォワード", prefecture: "愛知県",   fee: 30000, situation: "法人化の検討中。個人・法人の税負担シミュレーションを依頼したい。", bookkeeping: "マネーフォワードで物件別管理。専門的な確認が必要。", accountingStyle: "クラウド完結", digitalLevel: "中程度",        theme: "法人成り" },
  { id: 29, name: "民泊 里山の宿",           industry: "不動産",  type: "個人事業主", revenue: 1500,  employees: 2,  founded: 2,  software: "マネーフォワード", prefecture: "長野県",   fee: 22000, situation: "Airbnb収入の税務処理。住宅宿泊事業法への対応も心配。",    bookkeeping: "マネーフォワード使用。専門的な確認を依頼したい。",   accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "民泊" },
  // 製造
  { id: 30, name: "三和金属加工",            industry: "製造",    type: "法人",       revenue: 5800,  employees: 15, founded: 6,  software: "弥生",            prefecture: "愛知県",   fee: 45000, situation: "CNC旋盤導入を計画。補助金と減価償却の両立方法を知りたい。", bookkeeping: "弥生で月次処理。製造原価計算の精度向上が必要。",     accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "補助金" },
  { id: 31, name: "木工家具 職人堂",         industry: "製造",    type: "個人事業主", revenue: 1800,  employees: 3,  founded: 3,  software: "freee",           prefecture: "静岡県",   fee: 22000, situation: "BtoC通販と工務店向けBtoBの二刀流。消費税の計上が複雑。",  bookkeeping: "freeeで管理。受注ごとの原価計算ができていない。",    accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "消費税" },
  { id: 32, name: "ニッコー工業",            industry: "製造",    type: "法人",       revenue: 12000, employees: 40, founded: 15, software: "TKC",             prefecture: "新潟県",   fee: 55000, situation: "海外展開を検討。移転価格税制への対応が必要。",            bookkeeping: "TKCで経理部門が処理。国際税務の専門アドバイスが必要。", accountingStyle: "月次訪問希望", digitalLevel: "デジタル得意",  theme: "国際" },
  { id: 33, name: "食品加工 山の幸",         industry: "製造",    type: "法人",       revenue: 3200,  employees: 9,  founded: 4,  software: "マネーフォワード", prefecture: "長野県",   fee: 32000, situation: "農産物の加工販売。農業法人との兼業税務が複雑。",          bookkeeping: "マネーフォワードで管理。農業収入との区分けが不明確。", accountingStyle: "クラウド完結", digitalLevel: "中程度",        theme: "農業" },
  { id: 34, name: "農業法人 緑の大地",       industry: "製造",    type: "法人",       revenue: 2800,  employees: 6,  founded: 4,  software: "なし",            prefecture: "茨城県",   fee: 28000, situation: "農業収入と加工品販売の消費税区分が複雑。補助金処理も未対応。", bookkeeping: "手書き台帳。農業専門の税理士を探している。",         accountingStyle: "担当者任せ",  digitalLevel: "デジタル初心者", theme: "農業" },
  // 医療福祉
  { id: 35, name: "やまびこ訪問看護",        industry: "医療福祉", type: "法人",      revenue: 2800,  employees: 12, founded: 2,  software: "マネーフォワード", prefecture: "埼玉県",   fee: 32000, situation: "開業2年目。処遇改善加算の計算が複雑で困っている。",        bookkeeping: "マネーフォワードで自動仕訳。加算の処理方法がわからない。", accountingStyle: "クラウド完結", digitalLevel: "中程度",        theme: "加算" },
  { id: 36, name: "介護施設 さくら園",       industry: "医療福祉", type: "法人",      revenue: 8500,  employees: 35, founded: 8,  software: "その他",          prefecture: "神奈川県", fee: 52000, situation: "医療法人への移行を検討中。定款変更と税務の影響を知りたい。", bookkeeping: "専用介護ソフト使用。税務申告のみ依頼したい。",        accountingStyle: "担当者任せ",   digitalLevel: "中程度",         theme: "法人移行" },
  { id: 37, name: "岡田内科クリニック",      industry: "医療福祉", type: "個人事業主",revenue: 5500,  employees: 5,  founded: 3,  software: "その他",          prefecture: "大阪府",   fee: 45000, situation: "自由診療を追加。保険診療との消費税区分に困っている。",    bookkeeping: "医療専用ソフト使用。税務相談のみ依頼したい。",        accountingStyle: "担当者任せ",   digitalLevel: "中程度",         theme: "消費税" },
  { id: 38, name: "放課後デイ ゆめ",         industry: "医療福祉", type: "法人",      revenue: 1800,  employees: 8,  founded: 1,  software: "なし",            prefecture: "福岡県",   fee: 22000, situation: "新規開業。設立から半年で会計処理が追いついていない。",    bookkeeping: "紙の帳簿のみ。早急に体制を整えたい。",               accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "開業" },
  { id: 39, name: "保育園 ひまわりキッズ",   industry: "医療福祉", type: "法人",      revenue: 6200,  employees: 22, founded: 6,  software: "その他",          prefecture: "千葉県",   fee: 45000, situation: "社会福祉法人への移行を検討中。補助金処理と決算書様式の変更が必要。", bookkeeping: "保育専用ソフト使用。税務申告は外部に依頼したい。",  accountingStyle: "担当者任せ",   digitalLevel: "中程度",         theme: "法人移行" },
  // 運輸
  { id: 40, name: "軽貨物ドライバー 鈴木",   industry: "運輸",    type: "個人事業主", revenue: 820,   employees: 1,  founded: 1,  software: "なし",            prefecture: "東京都",   fee: 15000, situation: "軽貨物ドライバー。青色申告を始めたいが何もわからない。",    bookkeeping: "売上はアプリで確認できるが経費管理なし。",            accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "青色申告" },
  { id: 41, name: "橋本運送",                industry: "運輸",    type: "法人",       revenue: 5200,  employees: 18, founded: 8,  software: "弥生",            prefecture: "愛知県",   fee: 42000, situation: "燃料費高騰で利益率が急落。資金繰り改善の相談がしたい。",    bookkeeping: "弥生で月次処理。経費分析を詳しくしてほしい。",       accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "資金繰り" },
  { id: 42, name: "物流センター 丸栄",       industry: "運輸",    type: "法人",       revenue: 9800,  employees: 32, founded: 12, software: "TKC",             prefecture: "埼玉県",   fee: 55000, situation: "M&Aによる事業拡大を検討。企業評価と税務DDを依頼したい。",  bookkeeping: "TKCで経理部門完結。戦略的アドバイスが必要。",        accountingStyle: "月次訪問希望", digitalLevel: "デジタル得意",   theme: "M&A" },
  // バリエーション
  { id: 43, name: "hair salon MOCA",         industry: "小売",    type: "個人事業主", revenue: 980,   employees: 2,  founded: 2,  software: "freee",           prefecture: "東京都",   fee: 20000, situation: "業務委託スタッフと雇用の違いがわからない。確定申告も不安。", bookkeeping: "freeeアプリ使用。入力の正確性に自信がない。",        accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "給与" },
  { id: 44, name: "たけした接骨院",          industry: "医療福祉", type: "個人事業主",revenue: 2200,  employees: 3,  founded: 3,  software: "なし",            prefecture: "大阪府",   fee: 25000, situation: "自費施術を増やしたい。消費税課税事業者への影響を知りたい。", bookkeeping: "売上帳のみ。記帳代行を希望。",                        accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "消費税" },
  { id: 45, name: "みらい進学塾",            industry: "小売",    type: "法人",       revenue: 3800,  employees: 10, founded: 5,  software: "マネーフォワード", prefecture: "千葉県",   fee: 35000, situation: "授業料の前受金処理と非課税判定を正確に行いたい。",        bookkeeping: "マネーフォワードで管理。教育事業特有の論点に詳しい税理士を探している。", accountingStyle: "クラウド完結", digitalLevel: "中程度",        theme: "消費税" },
  { id: 46, name: "建築設計事務所 空間工房",  industry: "IT",      type: "個人事業主", revenue: 2100,  employees: 2,  founded: 3,  software: "freee",           prefecture: "東京都",   fee: 28000, situation: "設計料と工事監理費の区分、消費税の判定が複雑。法人化も検討中。", bookkeeping: "freeeで管理。専門知識のある税理士に依頼したい。",   accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "法人成り" },
  { id: 47, name: "IRON BODY GYM",           industry: "小売",    type: "法人",       revenue: 2400,  employees: 5,  founded: 2,  software: "マネーフォワード", prefecture: "福岡県",   fee: 28000, situation: "会費収入の前受金処理とシステム投資の減価償却を整理したい。", bookkeeping: "マネーフォワード使用。月次確認を依頼したい。",        accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "節税" },
  { id: 48, name: "ドリームプランニング",     industry: "IT",      type: "法人",       revenue: 1800,  employees: 4,  founded: 2,  software: "freee",           prefecture: "東京都",   fee: 32000, situation: "チケット販売の収益認識と外注費の源泉徴収を整理したい。",   bookkeeping: "freeeで管理。イベント業特有の税務論点に困っている。", accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",  theme: "源泉" },
  { id: 49, name: "ヨガスタジオ ANANDA",     industry: "小売",    type: "個人事業主", revenue: 1200,  employees: 2,  founded: 2,  software: "freee",           prefecture: "神奈川県", fee: 20000, situation: "インストラクターへの業務委託費と雇用の境界線が不明確。",    bookkeeping: "freeeで売上管理。経費の仕訳が正しいか不安。",        accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "給与" },
  { id: 50, name: "コンサルティング ストラテジクス", industry: "IT", type: "法人",   revenue: 8500,  employees: 15, founded: 7,  software: "マネーフォワード", prefecture: "東京都",   fee: 55000, situation: "役員報酬の最適化と法人税の節税対策を包括的に相談したい。",  bookkeeping: "マネーフォワード＋経理担当在籍。高度な節税アドバイスを求めている。", accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",  theme: "節税" },
  // 追加 51–100
  { id: 51,  name: "岩本塗装",               industry: "建設",    type: "個人事業主", revenue: 1600,  employees: 2,  founded: 2,  software: "なし",            prefecture: "埼玉県",   fee: 22000, situation: "外壁塗装の一人親方。インボイス登録を迷っている。",          bookkeeping: "レシートを袋に入れるだけ。",                         accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "インボイス" },
  { id: 52,  name: "藤原電気工事",           industry: "建設",    type: "法人",       revenue: 3100,  employees: 7,  founded: 4,  software: "弥生",            prefecture: "神奈川県", fee: 32000, situation: "工事受注が増加。原価計算と利益管理を強化したい。",          bookkeeping: "弥生で月次入力。",                                   accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "原価管理" },
  { id: 53,  name: "タカハシ左官",           industry: "建設",    type: "個人事業主", revenue: 1400,  employees: 1,  founded: 3,  software: "なし",            prefecture: "千葉県",   fee: 18000, situation: "青色申告控除65万円を取れていない。帳簿整備が必要。",        bookkeeping: "ノートに手書き。",                                   accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "青色申告" },
  { id: 54,  name: "ミライ住建",             industry: "建設",    type: "法人",       revenue: 6200,  employees: 16, founded: 6,  software: "マネーフォワード", prefecture: "愛知県",   fee: 48000, situation: "新規事業（リフォーム部門）の分社化を検討中。",              bookkeeping: "マネーフォワード連携。月次確認希望。",                accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "法人成り" },
  { id: 55,  name: "坂本水道設備",           industry: "建設",    type: "法人",       revenue: 2900,  employees: 6,  founded: 3,  software: "freee",           prefecture: "大阪府",   fee: 28000, situation: "融資申込のため試算表の精度を上げたい。",                   bookkeeping: "freeeで管理中。",                                    accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "融資" },
  { id: 56,  name: "麺屋 武蔵坊",           industry: "飲食",    type: "法人",       revenue: 3500,  employees: 10, founded: 4,  software: "なし",            prefecture: "東京都",   fee: 32000, situation: "EC販売を始めた。売上区分と消費税が複雑になってきた。",       bookkeeping: "Excelで手入力。",                                    accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "消費税" },
  { id: 57,  name: "スパイスカレー KIKU",    industry: "飲食",    type: "個人事業主", revenue: 980,   employees: 2,  founded: 1,  software: "freee",           prefecture: "大阪府",   fee: 18000, situation: "開業初年度。青色申告の届出と節税方法を知りたい。",          bookkeeping: "freee入門中。",                                      accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "青色申告" },
  { id: 58,  name: "焼き鳥 炎上",           industry: "飲食",    type: "法人",       revenue: 2400,  employees: 7,  founded: 3,  software: "マネーフォワード", prefecture: "福岡県",   fee: 28000, situation: "深夜営業の人件費が高騰。利益改善策を相談したい。",          bookkeeping: "マネーフォワード使用。月次レポートを依頼したい。",   accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "資金繰り" },
  { id: 59,  name: "カフェ アンサンブル",    industry: "飲食",    type: "個人事業主", revenue: 1100,  employees: 3,  founded: 2,  software: "freee",           prefecture: "京都府",   fee: 20000, situation: "コーヒー豆のネット販売も開始。本業との区分が不明確。",       bookkeeping: "freeeで管理。",                                      accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "インボイス" },
  { id: 60,  name: "うどん処 讃岐屋",       industry: "飲食",    type: "法人",       revenue: 1900,  employees: 5,  founded: 2,  software: "なし",            prefecture: "香川県",   fee: 22000, situation: "コロナ後に売上が戻ってきた。設備投資の減価償却を整理したい。", bookkeeping: "手書き帳簿。",                                        accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "節税" },
  { id: 61,  name: "ネクスト・ベンチャーズ", industry: "IT",      type: "法人",       revenue: 2200,  employees: 4,  founded: 2,  software: "マネーフォワード", prefecture: "東京都",   fee: 38000, situation: "シードVC投資後の初決算。エクイティ会計が不明確。",           bookkeeping: "マネーフォワード自動連携。",                          accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "資金調達" },
  { id: 62,  name: "データブリッジ",         industry: "IT",      type: "法人",       revenue: 3800,  employees: 8,  founded: 3,  software: "freee",           prefecture: "大阪府",   fee: 42000, situation: "SaaS課金のARRと売上計上タイミングを整理したい。",            bookkeeping: "freeeで管理。",                                      accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "消費税" },
  { id: 63,  name: "クリエイティブラボ",     industry: "IT",      type: "個人事業主", revenue: 1800,  employees: 1,  founded: 3,  software: "マネーフォワード", prefecture: "東京都",   fee: 25000, situation: "フリーランスエンジニア。法人化の節税効果をシミュレーションしたい。", bookkeeping: "マネーフォワード使用。",                              accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",  theme: "法人成り" },
  { id: 64,  name: "サイバーキャスト",       industry: "IT",      type: "法人",       revenue: 5200,  employees: 11, founded: 5,  software: "マネーフォワード", prefecture: "東京都",   fee: 48000, situation: "海外子会社設立を計画。移転価格リスクを事前に確認したい。",   bookkeeping: "マネーフォワード＋経理担当。",                        accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "国際" },
  { id: 65,  name: "ピクセルワークス",       industry: "IT",      type: "法人",       revenue: 2800,  employees: 6,  founded: 3,  software: "freee",           prefecture: "福岡県",   fee: 35000, situation: "ゲームアプリの売上が急増。消費税の課税事業者判定が必要。",   bookkeeping: "freee使用。",                                        accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "消費税" },
  { id: 66,  name: "ネイチャーマート",       industry: "小売",    type: "法人",       revenue: 4800,  employees: 12, founded: 5,  software: "マネーフォワード", prefecture: "東京都",   fee: 40000, situation: "オーガニック食品の定期購入モデル。前受金処理が課題。",        bookkeeping: "マネーフォワード連携済み。",                          accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "在庫" },
  { id: 67,  name: "スタイルアップ",         industry: "小売",    type: "個人事業主", revenue: 1500,  employees: 2,  founded: 3,  software: "freee",           prefecture: "大阪府",   fee: 22000, situation: "アパレルのInstagram販売が急増。本業との分離が必要。",         bookkeeping: "freeeで売上管理。",                                  accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "インボイス" },
  { id: 68,  name: "Book&Brew",             industry: "小売",    type: "個人事業主", revenue: 900,   employees: 2,  founded: 1,  software: "freee",           prefecture: "京都府",   fee: 18000, situation: "本とコーヒーの複合店。混合業態の消費税区分を整理したい。",   bookkeeping: "freeeで入力中。",                                    accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "消費税" },
  { id: 69,  name: "エコライフ用品",         industry: "小売",    type: "法人",       revenue: 3600,  employees: 8,  founded: 4,  software: "弥生",            prefecture: "埼玉県",   fee: 35000, situation: "環境配慮製品の補助金を活用したい。申請と会計処理を支援してほしい。", bookkeeping: "弥生で月次処理。",                                    accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "補助金" },
  { id: 70,  name: "スポーツショップ 速星",  industry: "小売",    type: "法人",       revenue: 5500,  employees: 14, founded: 7,  software: "弥生",            prefecture: "愛知県",   fee: 42000, situation: "棚卸評価の見直しで利益を適正化したい。",                    bookkeeping: "弥生で管理。在庫管理ソフトと連携したい。",           accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "在庫" },
  { id: 71,  name: "グリーン土地建物",       industry: "不動産",  type: "法人",       revenue: 7500,  employees: 10, founded: 7,  software: "JDL",             prefecture: "東京都",   fee: 55000, situation: "相続で取得した物件の売却益課税を最小化したい。",              bookkeeping: "JDLで物件別管理。",                                  accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "節税" },
  { id: 72,  name: "ルーフトップ不動産",     industry: "不動産",  type: "個人事業主", revenue: 3200,  employees: 1,  founded: 5,  software: "マネーフォワード", prefecture: "神奈川県", fee: 35000, situation: "物件が5棟に増えた。法人化を本格検討したい。",                bookkeeping: "マネーフォワード使用。",                              accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "法人成り" },
  { id: 73,  name: "シティホーム管理",       industry: "不動産",  type: "法人",       revenue: 4500,  employees: 5,  founded: 4,  software: "弥生",            prefecture: "大阪府",   fee: 38000, situation: "管理手数料収入と賃貸収入の区分が複雑。",                    bookkeeping: "弥生で月次処理。",                                   accountingStyle: "月次訪問希望", digitalLevel: "デジタル初心者", theme: "賃貸" },
  { id: 74,  name: "土地活用 山下",          industry: "不動産",  type: "個人事業主", revenue: 2100,  employees: 1,  founded: 3,  software: "なし",            prefecture: "愛知県",   fee: 25000, situation: "駐車場収入の申告方法を整理したい。青色申告65万控除を取りたい。", bookkeeping: "Excelで管理。",                                       accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "青色申告" },
  { id: 75,  name: "投資用マンション 木下",  industry: "不動産",  type: "個人事業主", revenue: 4800,  employees: 1,  founded: 8,  software: "マネーフォワード", prefecture: "東京都",   fee: 40000, situation: "10棟保有。法人と個人の最適な所有バランスを見直したい。",     bookkeeping: "マネーフォワードで物件別管理。",                      accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "節税" },
  { id: 76,  name: "マルヤマ精機",           industry: "製造",    type: "法人",       revenue: 4200,  employees: 11, founded: 5,  software: "弥生",            prefecture: "愛知県",   fee: 38000, situation: "設備投資を検討。即時償却と補助金の組み合わせを相談したい。",  bookkeeping: "弥生で月次処理。",                                   accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "補助金" },
  { id: 77,  name: "城山プラスチック",       industry: "製造",    type: "法人",       revenue: 6800,  employees: 18, founded: 8,  software: "TKC",             prefecture: "静岡県",   fee: 48000, situation: "海外販路を開拓中。輸出免税の処理を整理したい。",              bookkeeping: "TKCで経理部門が処理。",                              accountingStyle: "月次訪問希望", digitalLevel: "デジタル得意",   theme: "国際" },
  { id: 78,  name: "桜木縫製",               industry: "製造",    type: "法人",       revenue: 3100,  employees: 9,  founded: 4,  software: "マネーフォワード", prefecture: "岐阜県",   fee: 32000, situation: "外注加工費と直接工費の区分整理が必要。",                    bookkeeping: "マネーフォワードで管理。",                            accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "原価管理" },
  { id: 79,  name: "ナカムラ鋳造",           industry: "製造",    type: "法人",       revenue: 5500,  employees: 14, founded: 7,  software: "弥生",            prefecture: "富山県",   fee: 42000, situation: "事業承継を3年以内に予定。後継者への株式移転スキームを相談したい。", bookkeeping: "弥生で月次処理。",                                    accountingStyle: "月次訪問希望", digitalLevel: "デジタル初心者", theme: "事業承継" },
  { id: 80,  name: "グリーンファーム 山田",  industry: "製造",    type: "個人事業主", revenue: 2200,  employees: 4,  founded: 4,  software: "freee",           prefecture: "茨城県",   fee: 25000, situation: "直売所とネット販売を開始。農業収入との区分が不明確。",        bookkeeping: "freeeで管理中。",                                    accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "農業" },
  { id: 81,  name: "あおぞら歯科クリニック",  industry: "医療福祉", type: "個人事業主",revenue: 4800,  employees: 6,  founded: 4,  software: "その他",          prefecture: "東京都",   fee: 42000, situation: "自由診療割合が増加。消費税課税事業者の判定が必要。",          bookkeeping: "医療ソフト使用。",                                   accountingStyle: "担当者任せ",   digitalLevel: "中程度",         theme: "消費税" },
  { id: 82,  name: "のぞみ介護サービス",      industry: "医療福祉", type: "法人",      revenue: 3500,  employees: 15, founded: 3,  software: "マネーフォワード", prefecture: "大阪府",   fee: 35000, situation: "処遇改善加算の計算と給与配分で悩んでいる。",                  bookkeeping: "マネーフォワード連携。",                              accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "加算" },
  { id: 83,  name: "みどり病院",             industry: "医療福祉", type: "法人",       revenue: 18000, employees: 80, founded: 20, software: "その他",          prefecture: "埼玉県",   fee: 65000, situation: "医療法人の決算書監査対応と消費税の申告が複雑。",              bookkeeping: "専用ソフト使用。外部に申告のみ依頼。",               accountingStyle: "担当者任せ",   digitalLevel: "中程度",         theme: "医療法人" },
  { id: 84,  name: "ともだち保育",            industry: "医療福祉", type: "法人",       revenue: 4200,  employees: 18, founded: 5,  software: "その他",          prefecture: "神奈川県", fee: 38000, situation: "施設型給付の会計処理と補助金申請を支援してほしい。",          bookkeeping: "保育専用ソフト使用。",                               accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "補助金" },
  { id: 85,  name: "ひだまり整骨院",          industry: "医療福祉", type: "個人事業主",revenue: 1900,  employees: 2,  founded: 2,  software: "freee",           prefecture: "千葉県",   fee: 22000, situation: "柔道整復師の保険収入と自費収入の按分計算が必要。",            bookkeeping: "freeeで管理中。",                                    accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "消費税" },
  { id: 86,  name: "速達便 ハヤシ",          industry: "運輸",    type: "個人事業主", revenue: 750,   employees: 1,  founded: 1,  software: "なし",            prefecture: "大阪府",   fee: 15000, situation: "副業から独立。確定申告の基礎から教えてほしい。",              bookkeeping: "売上メモのみ。",                                     accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "青色申告" },
  { id: 87,  name: "トラック野郎 野田",       industry: "運輸",    type: "個人事業主", revenue: 1200,  employees: 1,  founded: 2,  software: "なし",            prefecture: "埼玉県",   fee: 18000, situation: "燃料費・高速代などの経費計上を整理したい。",                  bookkeeping: "ガソリンスタンドの領収書のみ保管。",                 accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "青色申告" },
  { id: 88,  name: "丸山運輸",               industry: "運輸",    type: "法人",       revenue: 4200,  employees: 14, founded: 6,  software: "弥生",            prefecture: "愛知県",   fee: 38000, situation: "ドライバーの労務管理と社会保険料が増加。資金繰りを改善したい。", bookkeeping: "弥生で月次処理。",                                    accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "資金繰り" },
  { id: 89,  name: "スカイ航空サービス",      industry: "運輸",    type: "法人",       revenue: 8500,  employees: 25, founded: 10, software: "マネーフォワード", prefecture: "千葉県",   fee: 52000, situation: "グランドハンドリング事業の分社を検討中。",                    bookkeeping: "マネーフォワード＋経理担当。",                        accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "法人成り" },
  { id: 90,  name: "ロジスティクス 白鳥",    industry: "運輸",    type: "法人",       revenue: 6200,  employees: 20, founded: 8,  software: "弥生",            prefecture: "神奈川県", fee: 45000, situation: "物流拠点の土地取得を計画。借入と減価償却を整理したい。",      bookkeeping: "弥生で月次処理。",                                   accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "融資" },
  // 追加 91–150
  { id: 91,  name: "アサヒ工務店",            industry: "建設",    type: "法人",       revenue: 4500,  employees: 10, founded: 5,  software: "マネーフォワード", prefecture: "大阪府",   fee: 38000, situation: "リフォーム部門の収益改善。工事別損益を見える化したい。",      bookkeeping: "マネーフォワード連携。",                              accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "原価管理" },
  { id: 92,  name: "イワタ基礎工事",          industry: "建設",    type: "個人事業主", revenue: 2100,  employees: 3,  founded: 3,  software: "freee",           prefecture: "静岡県",   fee: 25000, situation: "従業員を初めて雇用。社会保険手続きと給与計算が不安。",        bookkeeping: "freeeで管理中。",                                    accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "給与" },
  { id: 93,  name: "トミタ設備",              industry: "建設",    type: "法人",       revenue: 3600,  employees: 8,  founded: 4,  software: "弥生",            prefecture: "兵庫県",   fee: 33000, situation: "公共工事受注が増加。入札参加資格の財務要件を整えたい。",      bookkeeping: "弥生で月次処理。",                                   accountingStyle: "月次訪問希望", digitalLevel: "デジタル初心者", theme: "融資" },
  { id: 94,  name: "スミダ建材",              industry: "建設",    type: "法人",       revenue: 5800,  employees: 13, founded: 6,  software: "JDL",             prefecture: "埼玉県",   fee: 44000, situation: "建材輸入コストが増加。原価率を正確に把握したい。",            bookkeeping: "JDL使用。",                                          accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "原価管理" },
  { id: 95,  name: "ナカガワ防水",            industry: "建設",    type: "個人事業主", revenue: 1900,  employees: 2,  founded: 2,  software: "なし",            prefecture: "神奈川県", fee: 22000, situation: "工事の完成基準と進行基準の選択で迷っている。",               bookkeeping: "ノートに手書き。",                                   accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "消費税" },
  { id: 96,  name: "ビストロ 丸の内",         industry: "飲食",    type: "法人",       revenue: 5200,  employees: 18, founded: 6,  software: "マネーフォワード", prefecture: "東京都",   fee: 45000, situation: "テイクアウトとイートインの消費税区分を整理したい。",           bookkeeping: "マネーフォワード使用。",                              accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "消費税" },
  { id: 97,  name: "串焼き どんき",           industry: "飲食",    type: "個人事業主", revenue: 1400,  employees: 3,  founded: 2,  software: "freee",           prefecture: "福岡県",   fee: 20000, situation: "副業から独立。前職の退職金課税と今後の節税を相談したい。",   bookkeeping: "freeeで管理。",                                      accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "節税" },
  { id: 98,  name: "讃岐製麺 本店",           industry: "飲食",    type: "法人",       revenue: 7200,  employees: 22, founded: 9,  software: "弥生",            prefecture: "大阪府",   fee: 50000, situation: "FC展開を計画。ロイヤリティ収入の会計処理を整理したい。",      bookkeeping: "弥生で月次処理。",                                   accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "FC展開" },
  { id: 99,  name: "スイーツ工房 ル・シェル",  industry: "飲食",   type: "個人事業主", revenue: 1200,  employees: 2,  founded: 2,  software: "なし",            prefecture: "兵庫県",   fee: 18000, situation: "ネット販売が急増。売上1,000万を超えそうで消費税の準備が必要。", bookkeeping: "売上帳のみ。",                                        accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "消費税" },
  { id: 100, name: "BBQレストラン 炭火亭",    industry: "飲食",    type: "法人",       revenue: 3800,  employees: 12, founded: 4,  software: "freee",           prefecture: "埼玉県",   fee: 35000, situation: "食材ロスが多く原価率が改善されない。数字で見える化したい。",  bookkeeping: "freeeで管理中。",                                    accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "原価管理" },
  { id: 101, name: "クラウドパートナーズ",     industry: "IT",      type: "法人",       revenue: 4200,  employees: 9,  founded: 4,  software: "マネーフォワード", prefecture: "東京都",   fee: 42000, situation: "BPO事業の売上認識基準を整理したい。",                       bookkeeping: "マネーフォワード自動連携。",                          accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "消費税" },
  { id: 102, name: "モバイルテック",           industry: "IT",      type: "法人",       revenue: 3100,  employees: 7,  founded: 3,  software: "freee",           prefecture: "大阪府",   fee: 38000, situation: "スマホアプリのサブスク収益。前受金処理を正確に行いたい。",   bookkeeping: "freee使用。",                                        accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "消費税" },
  { id: 103, name: "ハイパーロジック",         industry: "IT",      type: "法人",       revenue: 6800,  employees: 15, founded: 6,  software: "マネーフォワード", prefecture: "東京都",   fee: 52000, situation: "シリーズA調達後の管理会計体制を整備したい。",                bookkeeping: "マネーフォワード＋経理担当。",                        accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "資金調達" },
  { id: 104, name: "エッジアナリティクス",     industry: "IT",      type: "法人",       revenue: 2500,  employees: 5,  founded: 2,  software: "freee",           prefecture: "東京都",   fee: 35000, situation: "AIサービス開発費の資産計上判断に困っている。",               bookkeeping: "freee使用。",                                        accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "節税" },
  { id: 105, name: "スマートセキュリティ",     industry: "IT",      type: "法人",       revenue: 5500,  employees: 12, founded: 5,  software: "マネーフォワード", prefecture: "神奈川県", fee: 48000, situation: "サービス保守費の売上計上時期を整理したい。",                  bookkeeping: "マネーフォワード連携。",                              accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "消費税" },
  { id: 106, name: "アウトドアベース",         industry: "小売",    type: "法人",       revenue: 6200,  employees: 16, founded: 7,  software: "弥生",            prefecture: "長野県",   fee: 46000, situation: "キャンプ用品の仕入原価管理と棚卸評価を強化したい。",          bookkeeping: "弥生で月次処理。",                                   accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "在庫" },
  { id: 107, name: "デザインハウス 葵",        industry: "小売",    type: "個人事業主", revenue: 1100,  employees: 2,  founded: 2,  software: "freee",           prefecture: "京都府",   fee: 18000, situation: "ハンドメイド作家。minne・Instagramの売上が急増。",             bookkeeping: "freeeで管理。",                                      accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "インボイス" },
  { id: 108, name: "ファームマーケット 直",    industry: "小売",    type: "法人",       revenue: 4100,  employees: 10, founded: 5,  software: "マネーフォワード", prefecture: "茨城県",   fee: 36000, situation: "農産物の軽減税率と加工品8%/10%の区分管理が複雑。",            bookkeeping: "マネーフォワード連携。",                              accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "消費税" },
  { id: 109, name: "ペガサス書店",             industry: "小売",    type: "法人",       revenue: 7800,  employees: 20, founded: 10, software: "TKC",             prefecture: "東京都",   fee: 52000, situation: "電子書籍販売の消費税処理と国境を越えた役務提供の判定が必要。", bookkeeping: "TKCで完全管理。",                                     accountingStyle: "月次訪問希望", digitalLevel: "デジタル得意",   theme: "国際" },
  { id: 110, name: "ランニングギア 疾走",      industry: "小売",    type: "個人事業主", revenue: 1800,  employees: 2,  founded: 3,  software: "freee",           prefecture: "愛知県",   fee: 22000, situation: "マラソングッズのネット販売。返品・交換処理の会計が不明確。",   bookkeeping: "freee使用。",                                        accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "インボイス" },
  { id: 111, name: "東海不動産開発",           industry: "不動産",  type: "法人",       revenue: 9200,  employees: 12, founded: 9,  software: "JDL",             prefecture: "愛知県",   fee: 58000, situation: "土地販売業の棚卸資産評価と消費税の還付申告を整理したい。",   bookkeeping: "JDL使用。",                                          accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "消費税" },
  { id: 112, name: "空き家再生 スマイルホーム", industry: "不動産", type: "法人",       revenue: 3800,  employees: 6,  founded: 3,  software: "マネーフォワード", prefecture: "大阪府",   fee: 35000, situation: "空き家リノベの補助金と家賃収入の税務を整理したい。",          bookkeeping: "マネーフォワード連携。",                              accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "補助金" },
  { id: 113, name: "プレミアム民泊 京の宿",    industry: "不動産",  type: "個人事業主", revenue: 2200,  employees: 2,  founded: 3,  software: "freee",           prefecture: "京都府",   fee: 28000, situation: "民泊収入の消費税と所得税の申告方法を整理したい。",            bookkeeping: "freeeで売上管理。",                                  accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "民泊" },
  { id: 114, name: "オフィスビル 関西管理",    industry: "不動産",  type: "法人",       revenue: 5500,  employees: 7,  founded: 6,  software: "弥生",            prefecture: "大阪府",   fee: 44000, situation: "テナント退去に伴う原状回復費用の会計処理を整理したい。",      bookkeeping: "弥生で月次処理。",                                   accountingStyle: "月次訪問希望", digitalLevel: "デジタル初心者", theme: "賃貸" },
  { id: 115, name: "マンション投資 福田",      industry: "不動産",  type: "個人事業主", revenue: 3600,  employees: 1,  founded: 6,  software: "マネーフォワード", prefecture: "東京都",   fee: 35000, situation: "区分所有7室。修繕費と資本的支出の判断で毎年悩んでいる。",    bookkeeping: "マネーフォワードで物件別管理。",                      accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "節税" },
  { id: 116, name: "ホクリク鍛造",             industry: "製造",    type: "法人",       revenue: 7200,  employees: 20, founded: 9,  software: "弥生",            prefecture: "富山県",   fee: 50000, situation: "設備老朽化。更新投資と補助金申請をセットで支援してほしい。",  bookkeeping: "弥生で月次処理。",                                   accountingStyle: "月次訪問希望", digitalLevel: "デジタル初心者", theme: "補助金" },
  { id: 117, name: "光和紙工",                 industry: "製造",    type: "法人",       revenue: 3800,  employees: 10, founded: 5,  software: "マネーフォワード", prefecture: "岐阜県",   fee: 35000, situation: "伝統工芸の後継者育成と事業承継税制の活用を相談したい。",      bookkeeping: "マネーフォワード連携。",                              accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "事業承継" },
  { id: 118, name: "タイヨウ食品",              industry: "製造",    type: "法人",       revenue: 5100,  employees: 14, founded: 6,  software: "弥生",            prefecture: "愛知県",   fee: 42000, situation: "HACCP対応の設備投資費用を節税スキームと組み合わせたい。",      bookkeeping: "弥生で月次処理。",                                   accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "補助金" },
  { id: 119, name: "ニシヤマ印刷",              industry: "製造",    type: "法人",       revenue: 4400,  employees: 12, founded: 7,  software: "TKC",             prefecture: "大阪府",   fee: 40000, situation: "デジタル印刷への設備転換。リース vs 購入の税務比較をしたい。", bookkeeping: "TKCで経理処理。",                                     accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "節税" },
  { id: 120, name: "ヤマザキ醸造",              industry: "製造",    type: "法人",       revenue: 6500,  employees: 16, founded: 10, software: "弥生",            prefecture: "長野県",   fee: 48000, situation: "酒類製造免許の更新と蔵元の事業承継を同時に進めたい。",        bookkeeping: "弥生で月次処理。",                                   accountingStyle: "月次訪問希望", digitalLevel: "デジタル初心者", theme: "事業承継" },
  { id: 121, name: "ハピネス訪問介護",          industry: "医療福祉", type: "法人",      revenue: 3200,  employees: 14, founded: 3,  software: "マネーフォワード", prefecture: "福岡県",   fee: 33000, situation: "事業所追加のための財務要件を整理したい。",                    bookkeeping: "マネーフォワード連携。",                              accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "加算" },
  { id: 122, name: "ひかり歯科",                industry: "医療福祉", type: "個人事業主",revenue: 6200,  employees: 8,  founded: 7,  software: "その他",          prefecture: "東京都",   fee: 50000, situation: "医療法人化を検討中。設立スキームと税負担をシミュレーションしたい。", bookkeeping: "医療ソフト使用。",                                    accountingStyle: "担当者任せ",   digitalLevel: "中程度",         theme: "法人移行" },
  { id: 123, name: "コスモス薬局",              industry: "医療福祉", type: "法人",       revenue: 8500,  employees: 25, founded: 9,  software: "その他",          prefecture: "神奈川県", fee: 55000, situation: "調剤報酬の改定に伴う収益シミュレーションと節税対策。",        bookkeeping: "専用ソフト使用。",                                   accountingStyle: "担当者任せ",   digitalLevel: "中程度",         theme: "節税" },
  { id: 124, name: "リハビリ施設 空",           industry: "医療福祉", type: "法人",       revenue: 4500,  employees: 18, founded: 5,  software: "マネーフォワード", prefecture: "大阪府",   fee: 40000, situation: "加算取得のための体制整備と会計処理を支援してほしい。",        bookkeeping: "マネーフォワード連携。",                              accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "加算" },
  { id: 125, name: "たんぽぽ障害福祉",          industry: "医療福祉", type: "法人",       revenue: 2800,  employees: 12, founded: 2,  software: "なし",            prefecture: "埼玉県",   fee: 28000, situation: "新規開業。補助金申請と会計体制を同時に整備したい。",          bookkeeping: "紙の帳簿のみ。",                                     accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "開業" },
  { id: 126, name: "スターカーゴ",              industry: "運輸",    type: "法人",       revenue: 7200,  employees: 22, founded: 9,  software: "マネーフォワード", prefecture: "大阪府",   fee: 50000, situation: "冷凍冷蔵車の入れ替えで多額の設備投資。税務上の最適処理を知りたい。", bookkeeping: "マネーフォワード連携。",                              accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",  theme: "節税" },
  { id: 127, name: "フジタ宅配",                industry: "運輸",    type: "法人",       revenue: 5100,  employees: 16, founded: 6,  software: "弥生",            prefecture: "愛知県",   fee: 42000, situation: "EC需要拡大で業務委託ドライバーが増加。源泉徴収の整理が必要。", bookkeeping: "弥生で月次処理。",                                   accountingStyle: "月次訪問希望", digitalLevel: "中程度",         theme: "源泉" },
  { id: 128, name: "オーシャン海運",            industry: "運輸",    type: "法人",       revenue: 12000, employees: 35, founded: 15, software: "TKC",             prefecture: "神奈川県", fee: 60000, situation: "外航船の国際税務と消費税の輸出免税処理を整理したい。",        bookkeeping: "TKCで経理部門。",                                    accountingStyle: "月次訪問希望", digitalLevel: "デジタル得意",   theme: "国際" },
  { id: 129, name: "アルプス観光バス",           industry: "運輸",    type: "法人",       revenue: 4800,  employees: 15, founded: 5,  software: "弥生",            prefecture: "長野県",   fee: 40000, situation: "観光需要回復。設備投資の補助金と節税を組み合わせたい。",      bookkeeping: "弥生で月次処理。",                                   accountingStyle: "月次訪問希望", digitalLevel: "デジタル初心者", theme: "補助金" },
  { id: 130, name: "フリート管理 九州",          industry: "運輸",    type: "法人",       revenue: 6500,  employees: 20, founded: 8,  software: "マネーフォワード", prefecture: "福岡県",   fee: 46000, situation: "車両リースの費用処理と購入比較の税務シミュレーションをしたい。", bookkeeping: "マネーフォワード連携。",                              accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "節税" },
  { id: 131, name: "ムサシ工業",                industry: "建設",    type: "法人",       revenue: 8500,  employees: 22, founded: 10, software: "TKC",             prefecture: "埼玉県",   fee: 55000, situation: "大型案件受注で外注費が急増。原価と利益の見える化を依頼したい。", bookkeeping: "TKCで経理。",                                         accountingStyle: "月次訪問希望", digitalLevel: "デジタル得意",   theme: "原価管理" },
  { id: 132, name: "ケイワ電設",                industry: "建設",    type: "法人",       revenue: 3200,  employees: 8,  founded: 4,  software: "freee",           prefecture: "千葉県",   fee: 32000, situation: "電気工事業の許可更新のための財務改善が必要。",                bookkeeping: "freee使用。",                                        accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "融資" },
  { id: 133, name: "ソラ造園",                  industry: "建設",    type: "個人事業主", revenue: 1700,  employees: 2,  founded: 2,  software: "なし",            prefecture: "神奈川県", fee: 20000, situation: "造園業の一人親方。確定申告と消費税の基本を教えてほしい。",    bookkeeping: "領収書のみ保管。",                                   accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "青色申告" },
  { id: 134, name: "フタバ管工事",              industry: "建設",    type: "法人",       revenue: 4600,  employees: 11, founded: 5,  software: "マネーフォワード", prefecture: "大阪府",   fee: 39000, situation: "工事保証引当金の計上方法を整理したい。",                     bookkeeping: "マネーフォワード連携。",                              accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "原価管理" },
  { id: 135, name: "シンワ足場",                industry: "建設",    type: "個人事業主", revenue: 2400,  employees: 4,  founded: 3,  software: "freee",           prefecture: "愛知県",   fee: 27000, situation: "法人成りを検討。役員報酬と社会保険料のシミュレーションをしたい。", bookkeeping: "freeeで管理。",                                       accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "法人成り" },
  { id: 136, name: "ナインスター焼肉",           industry: "飲食",    type: "法人",       revenue: 6800,  employees: 20, founded: 7,  software: "マネーフォワード", prefecture: "東京都",   fee: 50000, situation: "フランチャイズ本部設立を計画。ロイヤリティ課税と会計を整理したい。", bookkeeping: "マネーフォワード＋経理担当。",                        accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "FC展開" },
  { id: 137, name: "タピオカ天国",               industry: "飲食",    type: "個人事業主", revenue: 850,   employees: 2,  founded: 1,  software: "freee",           prefecture: "大阪府",   fee: 18000, situation: "開業1年目。売上が伸びてきたが税金の仕組みが全くわからない。",  bookkeeping: "freeeを入れたが入力が進んでいない。",                accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "青色申告" },
  { id: 138, name: "高原リゾートホテル",         industry: "飲食",    type: "法人",       revenue: 9500,  employees: 30, founded: 12, software: "TKC",             prefecture: "長野県",   fee: 58000, situation: "インバウンド需要回復で売上急増。消費税の課税事業者判定が急務。", bookkeeping: "TKCで経理部門。",                                    accountingStyle: "月次訪問希望", digitalLevel: "デジタル得意",   theme: "消費税" },
  { id: 139, name: "島料理 琉球",               industry: "飲食",    type: "個人事業主", revenue: 1100,  employees: 3,  founded: 2,  software: "なし",            prefecture: "沖縄県",   fee: 18000, situation: "観光客向け体験料理教室を開始。収入区分と消費税を整理したい。", bookkeeping: "レシートをファイルに収集。",                          accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "消費税" },
  { id: 140, name: "ストリートフード 坂本",      industry: "飲食",    type: "個人事業主", revenue: 680,   employees: 1,  founded: 1,  software: "なし",            prefecture: "福岡県",   fee: 14000, situation: "キッチンカー開業。必要経費と按分計算を教えてほしい。",        bookkeeping: "メモ帳のみ。",                                       accountingStyle: "担当者任せ",   digitalLevel: "デジタル初心者", theme: "青色申告" },
  { id: 141, name: "ライズシステムズ",           industry: "IT",      type: "法人",       revenue: 7500,  employees: 18, founded: 8,  software: "マネーフォワード", prefecture: "東京都",   fee: 55000, situation: "DX推進コンサル事業。役員報酬の最適化と節税対策を包括的に相談したい。", bookkeeping: "マネーフォワード＋経理担当。",                        accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",  theme: "節税" },
  { id: 142, name: "メタバースラボ",             industry: "IT",      type: "法人",       revenue: 1800,  employees: 4,  founded: 1,  software: "freee",           prefecture: "東京都",   fee: 32000, situation: "NFT・暗号資産の売却益課税を整理したい。",                    bookkeeping: "freee使用。",                                        accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "節税" },
  { id: 143, name: "ヘルステック 未来",          industry: "IT",      type: "法人",       revenue: 3500,  employees: 8,  founded: 3,  software: "マネーフォワード", prefecture: "大阪府",   fee: 40000, situation: "医療機器SaaSの売上認識とR&D費の資産計上判断が複雑。",         bookkeeping: "マネーフォワード連携。",                              accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "消費税" },
  { id: 144, name: "ブロードキャスト",           industry: "IT",      type: "法人",       revenue: 4800,  employees: 10, founded: 4,  software: "freee",           prefecture: "東京都",   fee: 44000, situation: "ライブ配信プラットフォームの消費税（国境を越えた役務）を整理したい。", bookkeeping: "freee使用。",                                        accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",  theme: "国際" },
  { id: 145, name: "サイバーフィンテック",        industry: "IT",      type: "法人",       revenue: 9200,  employees: 22, founded: 9,  software: "マネーフォワード", prefecture: "東京都",   fee: 60000, situation: "資金移動業の登録後、会計処理の整備と内部統制構築を相談したい。", bookkeeping: "マネーフォワード＋経理部門。",                        accountingStyle: "クラウド完結", digitalLevel: "デジタル得意",   theme: "資金調達" },
  { id: 146, name: "グロースリテール",           industry: "小売",    type: "法人",       revenue: 8200,  employees: 25, founded: 9,  software: "TKC",             prefecture: "東京都",   fee: 55000, situation: "EC・実店舗・卸の3チャネル。チャネル別損益管理を依頼したい。",  bookkeeping: "TKCで経理部門。",                                    accountingStyle: "月次訪問希望", digitalLevel: "デジタル得意",   theme: "在庫" },
  { id: 147, name: "アニメグッズ 夢工場",        industry: "小売",    type: "法人",       revenue: 5500,  employees: 14, founded: 6,  software: "マネーフォワード", prefecture: "大阪府",   fee: 44000, situation: "版権料の源泉徴収と外国法人への支払い税務を整理したい。",      bookkeeping: "マネーフォワード連携。",                              accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "国際" },
  { id: 148, name: "ビューティー 美神",          industry: "小売",    type: "個人事業主", revenue: 1600,  employees: 2,  founded: 3,  software: "freee",           prefecture: "東京都",   fee: 22000, situation: "エステサロン。施術と物販の消費税区分を正確に処理したい。",    bookkeeping: "freeeで管理。",                                      accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "消費税" },
  { id: 149, name: "ホームファニチャー 和",       industry: "小売",    type: "法人",       revenue: 7100,  employees: 19, founded: 8,  software: "弥生",            prefecture: "神奈川県", fee: 50000, situation: "家具の割賦販売の収益認識と在庫評価を整理したい。",            bookkeeping: "弥生で月次処理。",                                   accountingStyle: "月次訪問希望", digitalLevel: "デジタル初心者", theme: "在庫" },
  { id: 150, name: "サクラコスメ",               industry: "小売",    type: "法人",       revenue: 4300,  employees: 11, founded: 5,  software: "マネーフォワード", prefecture: "福岡県",   fee: 38000, situation: "化粧品OEM製造と小売の兼業。原価計算と棚卸管理を強化したい。",  bookkeeping: "マネーフォワード連携。",                              accountingStyle: "クラウド完結", digitalLevel: "中程度",         theme: "在庫" },
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

const accountingSoftware        = ["freee", "マネーフォワード", "弥生", "TKC", "JDL", "その他"]
const industries                = ["建設", "小売", "飲食", "製造", "IT", "不動産", "医療福祉", "運輸"]
const areas                     = ["全国", "関東", "関西", "東海", "北海道・東北", "中国・四国", "九州・沖縄"]
const expansionOptions          = ["積極的に増やしたい", "慎重に検討中", "現状維持でよい"] as const
const aiUsageOptions            = ["積極活用している", "一部のみ活用", "ほぼ未活用"] as const
const preferredThemeOptions  = ["節税", "融資", "法人化", "事業承継", "インボイス", "記帳代行"] as const
const revenueRangeOptions    = ["小規模（〜3,000万）", "中規模（3,000万〜1億）", "大規模（1億〜）"] as const
const accountingStyleOptions    = ["すべて", "月次訪問希望", "クラウド完結", "担当者任せ"] as const
const preferredTypeOptions      = ["すべて", "法人", "個人事業主"] as const
const digitalLevelOptions       = ["すべて", "デジタル初心者", "中程度", "デジタル得意"] as const

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
// AREA MATCH HELPER
// ============================================================
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
  const area = prefectureToArea[prefecture]
  return area === selectedArea
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
  const [aiUsage,                setAiUsage]                = useState<typeof aiUsageOptions[number]>(aiUsageOptions[2])
  const [preferredAccountingStyle, setPreferredAccountingStyle] = useState<typeof accountingStyleOptions[number]>(accountingStyleOptions[0])
  const [preferredType,          setPreferredType]          = useState<typeof preferredTypeOptions[number]>(preferredTypeOptions[0])
  const [preferredDigitalLevel,  setPreferredDigitalLevel]  = useState<typeof digitalLevelOptions[number]>(digitalLevelOptions[0])
  const [goodThemes,         setGoodThemes]         = useState<string[]>([])
  const [goodIndustries,     setGoodIndustries]      = useState<string[]>([])
  const [preferredRevRange,  setPreferredRevRange]   = useState<typeof revenueRangeOptions[number] | "">("")

  const clientNum   = parseInt(clientCount)  || 30
  const capacityNum = parseInt(capacity)     || 20
  const avgFeeNum   = parseInt(avgFee)       || 25000
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
        score:
          (selectedSoftware.includes(c.software) ? 30 : selectedSoftware.length === 0 ? 10 : 0)
        + (selectedArea.length === 0 || selectedArea.includes("全国") ? 15 :
           selectedArea.some(a => areaMatch(a, c.prefecture)) ? 15 : 0)
        + ((preferredAccountingStyle as string) === "どちらでも" ? 0 :
           (preferredAccountingStyle as string) === "丸投げ歓迎" && c.accountingStyle === "丸投げ" ? 20 :
           (preferredAccountingStyle as string) === "クラウド推奨" && (c.accountingStyle === "クラウド自力" || c.accountingStyle === "クラウド移行中") ? 20 : 0)
        + ((preferredType as string) === "どちらでも" ? 0 :
           (preferredType as string) === "法人メイン" && c.type === "法人" ? 15 :
           (preferredType as string) === "個人メイン" && c.type === "個人事業主" ? 15 : 0)
        + ((preferredDigitalLevel as string) === "どちらでも" ? 0 :
           (preferredDigitalLevel as string) === c.digitalLevel ? 15 : 0)
        + (goodThemes.length > 0 && goodThemes.includes(c.theme) ? 25 : 0)
        + (goodIndustries.length > 0 && goodIndustries.includes(c.industry) ? 15 : 0)
        + (preferredRevRange === "" ? 0 :
           preferredRevRange === "小規模（〜3,000万）" && c.revenue < 3000 ? 15 :
           preferredRevRange === "中規模（3,000万〜1億）" && c.revenue >= 3000 && c.revenue < 10000 ? 15 :
           preferredRevRange === "大規模（1億〜）" && c.revenue >= 10000 ? 15 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
  , [selectedSoftware, ngIndustries, selectedArea, preferredAccountingStyle, preferredType, preferredDigitalLevel, goodThemes, goodIndustries, preferredRevRange])

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
        {activeTab === "hearing"   && <HearingTab   {...{ officeName, setOfficeName, clientCount, setClientCount, capacity, setCapacity, employees, setEmployees, avgFee, setAvgFee, expansionWill, setExpansionWill, selectedArea, setSelectedArea, selectedSoftware, setSelectedSoftware, ngIndustries, setNgIndustries, aiUsage, setAiUsage, preferredAccountingStyle, setPreferredAccountingStyle, preferredType, setPreferredType, preferredDigitalLevel, setPreferredDigitalLevel, goodThemes, setGoodThemes, goodIndustries, setGoodIndustries, preferredRevRange, setPreferredRevRange, toggle }} />}
        {activeTab === "market"    && <MarketTab />}
        {activeTab === "diagnosis" && <DiagnosisTab  diagnosis={diagnosis} chartData={chartData} displayName={displayName} planLabel={`¥${plan.monthly.toLocaleString("ja-JP")}`} />}
        {activeTab === "mechanism" && <MechanismTab />}
        {activeTab === "matching"  && <MatchingTab   matched={matched} hasInput={selectedSoftware.length > 0 || selectedArea.length > 0 || preferredAccountingStyle !== "すべて" || preferredType !== "すべて" || preferredDigitalLevel !== "すべて"} />}
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
function HearingTab({ officeName, setOfficeName, clientCount, setClientCount, capacity, setCapacity, employees, setEmployees, avgFee, setAvgFee, expansionWill, setExpansionWill, selectedArea, setSelectedArea, selectedSoftware, setSelectedSoftware, ngIndustries, setNgIndustries, aiUsage, setAiUsage, preferredAccountingStyle, setPreferredAccountingStyle, preferredType, setPreferredType, preferredDigitalLevel, setPreferredDigitalLevel, goodThemes, setGoodThemes, goodIndustries, setGoodIndustries, preferredRevRange, setPreferredRevRange, toggle }: any) {
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
              { label: "平均月額顧問料", unit: "円", val: avgFee,      set: setAvgFee,      ph: "25000" },
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
            <label className="font-inter text-[10px] tracking-[0.2em] uppercase text-black/35 block mb-3">得意な年商規模</label>
            <div className="space-y-2">
              {(["", ...revenueRangeOptions] as const).map(opt => (
                <label key={opt} className="flex items-center gap-3" data-cursor onClick={() => setPreferredRevRange(opt as any)}>
                  <span className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all ${preferredRevRange === opt ? "border-black bg-black" : "border-black/25"}`}>
                    {preferredRevRange === opt && <span className="text-white text-[8px]">✓</span>}
                  </span>
                  <span className="text-sm text-[#0A0A0A]">{opt === "" ? "指定なし" : opt}</span>
                </label>
              ))}
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

      {/* 4 KPIs */}
      <div className="grid grid-cols-4 gap-px bg-white/10 mb-10 stagger-2">
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
