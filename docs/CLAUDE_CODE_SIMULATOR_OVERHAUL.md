# Claude Code 向け：コミットプランシミュレーター全体改修

このファイルを Claude Code の最初のメッセージに **そのまま貼り付けて** 実装を進めてください。  
ブランチ例: `feat/simulator-overhaul`。フェーズ完了ごとに `npm run lint` と `npm run build`。

---

## 確定ビジネスルール（支払い）

- **基準段**: 月間コミット **100,000円** のプラン。
- **1年払い**: 月額 **57,800円** × **12回**（マスタ定数）。
- **3年払い**: 月額 **26,800円** × **36回**（マスタ定数）。
- **7年払い**: 月額は **`commitPlans[].monthly` を公式の分割月額**として使う × **84回**。

**他 `commit`（方式A）** — 1年・3年のみ `scale = commit / 100000` を掛ける:

- 1年: `Math.round(57800 * scale)` × 12
- 3年: `Math.round(26800 * scale)` × 36
- 7年: **`plan.monthly` は scale しない**（テーブル値そのまま）

実装は `data/commit-plans.ts` と `lib/simulator/installments.ts` の純関数 `getInstallment(plan, '1y'|'3y'|'7y')` → `{ monthly, months, total }` から開始すると安全。

---

## リポジトリ現状（確認済み）

- エントリ: `app/page.tsx` → `@/components/growth-simulator` の `GrowthSimulator` のみ。
- メイン実装: `components/growth-simulator.tsx`（全タブ・DB・計算が同居・大容量）。
- グローバルCSS: `app/layout.tsx` は `app/globals.css` のみ import。**`styles/globals.css` は未使用の可能性** — スタイル追加は `app/globals.css` へ。
- UI: `components/ui/dialog.tsx`, `components/ui/tabs.tsx` が利用可能。
- **PDF**: `package.json` に PDF ライブラリなし。Step08 の真の PDF は **後フェーズで依存追加**（詳細は後で確認でよい）。

---

## 目標ディレクトリ構成（到達イメージ）

```
data/
  customer-database.ts
  commit-plans.ts          # commitPlans + INSTALLMENT_BASE_1Y/3Y, BASE_COMMIT
  market-reference.ts      # 税理士人口8万超・事務所約3万・1人あたり約29社・顕在約10%等（推計・参考の注釈付き）
  partner-benchmark.ts     # 提携事務所ベンチ（静的で可）
lib/
  simulator/
    installments.ts        # getInstallment
  pdf/                     # Step08 用（後フェーズ）
hooks/
  use-simulator-model.ts
components/
  simulator/
    growth-simulator.tsx   # state, タブ, Prev/Next, 子の組み立て
    hearing-tab.tsx
    market-tab.tsx
    diagnosis-tab.tsx
    mechanism-tab.tsx
    matching-tab.tsx
    plan-tab.tsx
    pricing-structure-dialog.tsx
    roi-tab.tsx
    closing-tab.tsx
```

`app/page.tsx` の import は最終的に `@/components/simulator/growth-simulator` へ。移行中は `components/growth-simulator.tsx` を re-export のみにしてもよい。

---

## プロダクト要件（要約）

1. **Step01**: 自然増件数・自然減件数をヒアリング。**Step03** の診断・グラフと連動。他事務所比較は **提携事務所ベンチ** と比較。
2. **Step02**: 全国規模・法人/個人・税理士人口・事務所数・規模帯（Step01 の従業員帯と連動）・開業事務所の集客コスト意識など。数字はクリックで軽いアニメ（`app/globals.css`）。Market Structure は **20%/80% の概要＋クリックで内訳**。
3. **Step03**: Step01 連動のグラフ・KPI。タブ順は後述どおり **仕組みの次** に来るストーリー向けに調整。
4. **タブ順**: **「集客の仕組み」(mechanism) を「現状診断」(diagnosis) より先**にし、Blue Ocean を **約400万件** に変更。コピーで Step03 へ接続。
5. **Step05**: **ロジック変更なし**（ファイル移動のみ可）。
6. **Step06**: コミット全面押し出し。「料金体系を確認」→ Dialog、**1年 / 3年 / 7年** タブで上記 `getInstallment` を表示。月間コミットと **年換算コミット（commit×12）** も併記。
7. **Step07**: **刷新**（現行の強化ではない）。**キャッシュアウト等、先生にネガティブな曲線は載せない**。前向きな累積・マイルストーン中心。
8. **Step08**: 文言どおり **PDF をパソコンにダウンロード**（実装は依存導入後。ビルド・バンドルは **後で確認**）。
9. **全体**: **← 前へ / 次へ →** ボタン（`TABS` インデックスベース）。

---

## フェーズ別実装（この順で実行）

### P0 — 仕様ロック（短時間）

- 自然増減の定義（件/年）、Step03 数式。
- 「顕在10%前後」の定義スコープ（法人のみ等）を1行で固定。
- PDF の章立て（任意・P10 ででも可）。

### P1 — `commit-plans` + `installments.ts`

- `data/commit-plans.ts`: 既存配列移動、定数 57800 / 26800 / BASE 100000。
- `lib/simulator/installments.ts`: `getInstallment` 実装。
- `growth-simulator.tsx` から `commitPlans` を import に差し替え。
- **完了**: `npm run build` OK。

### P2 — `customer-database.ts` 切り出し

- `data/customer-database.ts` に移動、型 export。
- **完了**: マッチング挙動不変、`build` OK。

### P3 — `useSimulatorModel`

- `hooks/use-simulator-model.ts` に `recommendedPlanIndex`, `diagnosis`, `chartData`, `plan`, `roi` 等を集約（現 `useMemo` と同値）。
- **完了**: UI 数値が変わらない。

### P4 — Step01 自然増減 + 規模帯

- state 追加、P3 の model に接続。
- **完了**: Step01 変更 → Step03 連動。

### P5 — Step03 ベンチ比較 UI

- `partner-benchmark.ts` + `diagnosis-tab` に比較ブロック。

### P6 — Step02 拡張

- `market-reference.ts`、市場ブロック、規模帯連動、クリック内訳、CSS アニメ。

### P7 — タブ順 + Mechanism

- `TABS` と `main` の `activeTab` 分岐順を入れ替え。
- Blue Ocean **約400万件**、Step03 への接続文。

### P8 — Step06 + `pricing-structure-dialog`

- コミット強調、Dialog + Tabs（1y/3y/7y）、`getInstallment` 表示と注釈。

### P9 — Step07 刷新

- ネガ曲線削除。前向きレイアウトのみ。

### P10 — Step08 PDF（依存追加）

- `@react-pdf/renderer` 等はプロジェクト方針で選定。**ビルド・バンドルは別タスクで後確認**。

### P11 — Prev/Next + 仕上げ

- ナビボタン、任意で URL クエリ同期。

### P12（任意）— 物理分割

- `components/simulator/*` へタブコンポーネント分割、`page.tsx` import 更新。

---

## 気になること（対応メモ）

- **（元3）** `styles/globals.css` が未使用なら、スタイルは `app/globals.css` に統一する。
- **（元5）** 市場の「29社/人」「10%」等は炎上しやすいので、UI では **推計・参考** を同じブロック内に必ず表示し、デザイン上も本丸KPIと差別化する。

**除外（ユーザー指示により記載不要）**: 旧まとめの 1・2・6。  
**4（PDFバンドル）**: 実装タイミングで依存を入れたうえで、**後で `build` / サイズを確認**でよい。

---

## 完了の定義（全体）

- 上記フェーズがすべて満たされ、`npm run lint` / `npm run build` が通る。
- Step05 のマッチングロジックは意図的に未変更。
- 主要フローが Zoom 共有想定で読める。
