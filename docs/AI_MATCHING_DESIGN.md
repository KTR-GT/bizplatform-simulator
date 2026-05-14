# AI 顧客マッチング 設計書

ブランチ: `feat/diagnosis-page`
最終更新: 2026-05-14

---

## 1. 全体コンセプト

### 1.1 サイト構造（将来像）

```
新トップページ（3 入口）
├─ ① BizplatFormについて      … サービス世界観・市場・実績
├─ ② AI診断 顧客マッチング    … 短時間体験 → Zoom アポ獲得装置 ★今回実装
└─ ③ コミットプランシミュレーター … 既存 8 タブ（並行運用）
```

今回スコープは **② の独立ページ追加**。
既存 `/`（事務所名入力 → 8 タブ）は変更せず、`/diagnosis` として新規追加する。

### 1.2 ② の役割と KPI

| 観点 | 内容 |
|---|---|
| 役割 | 「先生に紹介できる顧客像」を体験させ、**Zoom アポを獲得** |
| 滞在想定時間 | 3〜5 分 |
| KPI | **Zoom 予約フォーム送信率** |
| 営業シーン | Zoom 共有 / メール経由のセルフ閲覧 両対応 |

---

## 2. ストーリー（5 幕構成）

```
幕1 PROLOGUE (10秒)      期待の醸成 — 黒背景・大型コピー
幕2 SETUP (30〜90秒)     ヒアリング — 1質問1画面で 5問 + 任意 Q6
幕3 ANALYZING (8秒)      タメ演出 — 「全国500社を分析」
幕4 REVEAL (2〜3分)      核 — メイン 3 社 + ニアミス 2 社
幕5 CTA (30秒)           Zoom 予約フォーム（独立完結・アポ獲得装置）
```

---

## 3. ヒアリング項目

5 問 + 任意 Q6 で構成。

```
Q1: 「先生の事務所は、いまどんなフェーズですか？」(4択)
    [開業初期] [拡大期] [安定期] [次の一手を探している]
    用途: タイブレーカー / リビールのコピー差し込み

Q2: 「強みを発揮できるテーマは？」(複数選択 + 「幅広く」)
    [節税] [融資] [法人化] [事業承継] [インボイス] [記帳代行] [幅広く]
    用途: スコア A-1

Q3: 「強みを発揮できる業種は？」(複数選択 + 「特になし」)
    [建設] [小売] [飲食] [製造] [IT] [不動産] [医療福祉] [運輸] [特になし]
    用途: スコア A-2

Q4: 「対応できるエリアは？」(複数選択・最低 1 つ必須)
    [全国] [関東] [関西] [東海] [北海道・東北] [中国・四国] [九州・沖縄]
    ※ 「全国」のみも可、ただし得意エリアの併記推奨
    用途: スコア B

Q5: 「対応可能な関与スタイルは？」(複数選択)
    [月次訪問・伴走型]
    [クラウド完結・効率重視]
    [丸投げOK・記帳代行込み]
    [スポット対応・確定申告のみOK]
    [ニーズが固まっていない顧客OK]
    [切替案件OK・引継ぎ対応OK]
    用途: スコア A-3（先生の "受け皿の広さ" × 顧客の "ニーズタイプ" のマッチ）

──── オプション ────

Q6: 「最後に、先生の事務所の "らしさ" を一言で」(自由記述・任意)
    用途: リビールのコピー差し込み、Google Chat 通知に含む
          スコアには使わない
```

**取らない情報**：
- 先生の `avgFee`（平均顧問料）—— 全先生「高い方が良い」共通の好みなので、聞いても期待値ギャップを生むだけ
- 引受余力 —— マッチング軸ではなく紹介数のサイジング情報

---

## 4. スコアリング（100 点満点）

```
A. 業務適合性                65 点
  ├ A-1. テーマ一致                25
  │     - themes の重なり数 × 10（最大 25）
  │     - 先生「幅広く」 → 中央値 12
  │     - 顧客の primaryTheme が先生 themes に含まれる → +3 ボーナス
  │
  ├ A-2. 業種一致                  15
  │     - 先生 goodIndustries に顧客 industry → 15
  │     - 先生「特になし」 → 中央値 7
  │     - 不一致 → 0
  │
  └ A-3. ニーズタイプ受け皿一致     25  ★ 重要新軸
        先生 Q5 が顧客 needType を受け入れるか
        例: 顧客 needType=full-delegation
            先生 Q5 に "丸投げOK" 含む → 25 点
            含まない → 0 点

B. エリア・物理整合性        30 点
  ├ 完全一致 (先生 areas に顧客 region 含む)         30
  ├ 全国対応 (先生 areas に "全国" のみ)             20
  ├ 隣接エリア                                         18
  └ それ以外                                            0

C. ソフト整合補助             5 点
  - 顧客 softwareUsage.type=using で先生対応ソフトと一致 → 5
─────────────────────────────────────
合計                          100 点
```

### 4.1 ハード除外（フィルタ）

```
- NG業種に含まれる顧客 → 完全除外
```

### 4.2 タイブレーカー（同点時）

```
1. urgency:  高 > 中 > 低
2. weight:   大 > 小
3. ランダム（セッション内のシードで毎回違うセット）
```

---

## 5. データ構造（新顧客 DB）

### 5.1 顧客レコード

```ts
type Industry = '建設' | '小売' | '飲食' | '製造' | 'IT' | '不動産' | '医療福祉' | '運輸'
type CustomerType = '法人' | '個人事業主'
type AccountingStyle = '月次訪問希望' | 'クラウド完結' | '担当者任せ'
type DigitalLevel = 'デジタル初心者' | '中程度' | 'デジタル得意'
type Software = 'freee' | 'マネーフォワード' | '弥生' | 'TKC' | 'JDL' | 'なし'
type Region = '関東' | '関西' | '東海' | '北海道・東北' | '中国・四国' | '九州・沖縄'
type Urgency = '高' | '中' | '低'
type Theme = '節税' | '融資' | '法人化' | '事業承継' | 'インボイス' | '記帳代行'
              | '補助金' | '原価管理' | '給与' | '青色申告' | '多店舗' | '資金調達'

type CustomerNeedType =
  | 'clear-theme'        // 明確なテーマあり
  | 'spot-only'          // スポット案件
  | 'full-delegation'    // 丸投げ希望
  | 'switching'          // 切り替え動機
  | 'undefined-need'     // ニーズ不明確

type SoftwareUsage =
  | { type: 'using',         software: Software, note?: string }
  | { type: 'using-poorly',  software: Software, note: string }
  | { type: 'manual',        note: string }
  | { type: 'none',          note: string }

type SwitchingReason =
  | 'fee-too-high'
  | 'communication-bad'
  | 'predecessor-retired'
  | 'aging-firm'
  | 'service-mismatch'

interface Customer {
  // 識別
  id:              string                // "cust-001"
  archetype:       string                // ペルソナの呼称
  
  // 表示用基本属性
  displayName:     string                // 「飲食店 K 社」
  industry:        Industry
  customerType:    CustomerType
  
  // 規模情報
  revenue:         number                // 万円
  employees:       number
  foundedYears:    number
  prefecture:      string
  region:          Region                // 派生属性として保持
  
  // マッチング判定用
  themes:          Theme[]               // 複数値対応
  primaryTheme:    Theme
  needType:        CustomerNeedType      // 新規・重要
  desiredEngagement:
    | { type: 'specific', styles: AccountingStyle[] }
    | { type: 'flexible' }
    | { type: 'unknown' }
  digitalLevel:    DigitalLevel
  softwareUsage:   SoftwareUsage
  switchingReason?: SwitchingReason
  
  // 経済情報（表示用・スコア外）
  monthlyFeeRange:    [number, number]
  monthlyFeeTypical:  number
  
  // タイブレーカー・バッジ用
  urgency:         Urgency
  
  // 物語素材
  voice:           string                // 30字以内のセリフ
  story:           string                // 100字以内の状況
  bookkeepingNote: string
  
  // スコアリング補助
  weight:          number                // デフォルト 1.0
}
```

### 5.2 顧客分布の目標値

```
ニーズタイプ分布:
  clear-theme        25%
  spot-only          15%
  full-delegation    25%
  switching          20%
  undefined-need     15%

ソフト使用状況分布:
  none           35%
  manual         25%
  using          25%
  using-poorly   15%

顧客タイプ:
  法人        40%
  個人事業主  60%

緊急度:
  高 30% / 中 50% / 低 20%
```

### 5.3 データ生成方針

**案 α: バッチ事前生成** を採用。

```
作業フロー:
1. ペルソナ 50 件を手動定義（data/personas.ts）
   ニーズタイプ 5 分類で多様化
2. AI で各ペルソナから 6 〜 12 事例を一括生成（合計 300〜600 件）
3. 検証・手動補正
4. data/customer-database.ts に静的コミット
```

「同じ事例が繰り返し出る」問題への対策：
- 各ペルソナから 12 事例生成
- ランダムシード適用で同条件でも違うセット
- weight 動的調整（セッション内）

将来の **案 β（準動的）への昇格** を視野に、データ層を抽象化（`getCustomersForMatching()` 関数）。

---

## 6. マッチング選定（メイン 3 + ニアミス 2）

```
Step 1: ハード除外
  - NG業種を完全除外

Step 2: 全顧客に 4 軸 100 点スコア計算

Step 3: 上位 30% を候補プール化

Step 4: メイン 3 社抽出
  - 1社目: 最高スコア（タイブレーカー適用）
  - 2社目: 1社目と industry または region が異なる中で最高
  - 3社目: urgency = "高" を優先（営業強化枠）

Step 5: ニアミス 2 社抽出（スコア 50-79）
  - メイン 3 社と業種・エリア・ニーズタイプの少なくとも 1 つが異なる
  - スコア順 + 多様性で 2 件

Step 6: ランダムシード適用
  - セッション ID + タイムスタンプでシード化
  - 同入力でも毎回違うセット
```

---

## 7. リビール構造

```
[第 1 部] メイン 3 社（フルスクリーン演出）
  - パーソナル呼びかけ（事務所名 / Q6 自由記述の引用）
  - 顧客の "声"（voice）の大きな引用
  - スコアの 3 つの理由（人語翻訳）
  - 想定月額顧問料表示
  - 緊急度バッジ
  - スクロール or 矢印で次へ

[第 2 部] ニアミス 2 社（コンパクトカード横並び）
  - 「他にも、こんな出会いがあります」
  - 各カードに「テーマは合うが業種は違う」等の一言

[サマリー]
  「計 5 件のマッチ候補が見つかりました」
  → Zoom 予約 CTA
```

### 7.1 スコア → 人語翻訳の例

```
スコア内訳                          → 表示コピー
A-1 themes 多数一致 (20+/25)        → "先生の得意領域に深く合致"
A-3 needType=full-delegation 一致   → "先生の "丸投げOK" がぴったり"
B 完全一致                          → "対応エリア内・物理的に近い"
urgency=高                          → "🔥 今すぐ動ける緊急度"
```

---

## 8. 期待値調整

「中小零細しか紹介できない」のに高単価期待をされる問題への対応。

ただし**「中小零細」というコピーは使わない**（営業上ネガティブに響くため）。

```
仕掛け 1: 幕1 で予告
  「全国 500 社の中から、先生にマッチする 3 社をご紹介します」

仕掛け 2: リビールで規模情報を併記
  「想定月額顧問料 ¥13,000（年商 1,200 万円 / 3 名規模）」

仕掛け 3: ① ページで全体像を提示（将来）
  紹介顧客の業種分布・規模分布・顧問料レンジを明示
```

---

## 9. Zoom 予約フォーム（幕5）

### 9.1 取得項目

```
[必須]
  - お名前
  - メールアドレス

[任意]
  - 電話番号
  - 希望日時（第1〜3希望）
  - ご質問・ご相談内容
```

### 9.2 送信先

**Google Chat Webhook** を採用。
セットアップ手順：
1. Google Chat でスペース作成
2. アプリと連携 → Webhook 追加
3. 環境変数 `GOOGLE_CHAT_WEBHOOK_URL` に格納

### 9.3 通知に含める情報

```
- 先生の入力（ヒアリング 5 問 + 自由記述）
- マッチした 5 社（メイン 3 + ニアミス 2）
- 緊急度「高」の件数
- 自由記述 Q6 の内容
- 流入経路（?source=xxx クエリ）
- セッション ID（再診断時の追跡用）
```

### 9.4 セキュリティ

```
- honeypot フィールド（hidden input、bot 対策）
- Rate limiting（同一 IP からの連続送信制限）
- zod による入力検証
- 環境変数バリデーション
```

---

## 10. モバイル対応

**モバイルファースト**で書く。`md:` `lg:` で拡張。

```
- デフォルト CSS = モバイル用
- フォントサイズ clamp(28px, 6vw, 56px)
- タッチターゲット最小 48px
- カスタムカーソルは @media (hover: hover) でのみ有効
- Touch device 判定: matchMedia('(hover: none)')
- ローディング演出はモバイル時 6 秒に短縮
- フォーム入力に inputmode / autocomplete 最適化
```

---

## 11. フェーズ計画

```
Phase 1（骨組み + 幕1・2）  ★今回スコープ
  - app/diagnosis/ 構造
  - 幕1 Prologue
  - 幕2 Hearing（5 問 + 任意 Q6）
  - use-diagnosis-flow hook
  - 並行: 既存問題の修正（cursor, globals.css, strict TS）
  完了条件: lint, build 通過 + 幕2 まで動作

Phase 2A（データ刷新）
  - types/customer.ts
  - data/personas.ts（50 件）
  - scripts/generate-customers.ts
  - data/customer-database.ts（300〜600 件で再構築）
  完了条件: 型が通る、分布の偏りがない

Phase 2B（スコアリング刷新）
  - lib/matching/score.ts
  - lib/matching/select.ts（メイン3 + ニアミス2）
  - lib/matching/reveal-copy.ts
  完了条件: ユニットテスト通過

Phase 2C（UI 演出）
  - 幕3 Analyzing
  - 幕4 Reveal（メイン + ニアミス）
  完了条件: 幕1〜4 通しで動作

Phase 3（フォーム + 計測 + セキュリティ）
  - 幕5 Booking フォーム
  - app/api/booking/route.ts
  - Google Chat Webhook 送信
  - Vercel Analytics マウント + イベント送信
  - honeypot, rate limit, zod 検証
  完了条件: 5 幕通しで動作、フォーム送信成功
```

---

## 12. 計測

**Vercel Analytics**（既存依存）を活用。

```
イベント:
  - diagnosis_started (source)
  - diagnosis_hearing_answered (question, value)
  - diagnosis_act_completed (act, duration)
  - diagnosis_revealed (customer_id, position)
  - diagnosis_booking_submitted (source, urgent_count)
  - diagnosis_abandoned (act, duration)

URL クエリ:
  /diagnosis?source=email
  /diagnosis?source=zoom
  /diagnosis?source=ad
  → sessionStorage に保存し、フォーム送信時に通知に含める
```

---

## 13. 既存システムの並行見直し

| 優先 | 課題 | 対応 |
|---|---|---|
| ★★★ | カスタムカーソル `cursor: none !important` が a11y 違反 | Touch device + キーボードユーザーで無効化 |
| ★★★ | `styles/globals.css` 未使用 | 削除 |
| ★★ | `growth-simulator.tsx` 1662 行 / `any` 型多数 | 周辺だけでも型付け |
| ★★ | `next.config.mjs` の `ignoreBuildErrors: true` | 新規ファイルは strict で書く |
| ★ | ESLint / Prettier 設定不在 | 後フェーズで整備 |
| ★ | フォント weight 過多 | 後フェーズで整理 |
| ★ | `customerDatabase` 全クライアント送信 | 後フェーズで Server 処理化 |

---

## 14. 命名規則

```
ファイル: kebab-case
コンポーネント: PascalCase
型: PascalCase
hook: camelCase（use 接頭）
定数: UPPER_SNAKE_CASE
```

---

