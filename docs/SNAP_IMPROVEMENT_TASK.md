# SNAP_IMPROVEMENT_TASK — /about ページの体感改善 (a)(b)(c)

> 作成日: 2026-05-16
> 対象ブランチ: feat/diagnosis-page (もしくは別ブランチを切ってもよい)
> 実行担当: Claude Code

---

## 概要

`/about` ページのスライドショー型スクロールの体感問題を 3 点まとめて改善する。

| Step | 対象 | 内容 | リスク | 差分行数 |
|---|---|---|---|---|
| 1 | (c) | Lenis の二重制御を解消 | 極低 | +2 / -1 |
| 2 | (b) | スナップの速度・タイミング調整 | 低 | 4 箇所の値変更 |
| 3 | (a) | S2 Company を S2-a / S2-b に分割 | 中 | +1 セクション・以降の番号繰下げ |

**実行順:** Step 1 → Step 2 → Step 3 の順で実装し、各 Step 後に `npm run lint && npm run build` を通してから次へ進む。
**コミット:** 3 つすべて完了後、まとめて 1 コミットで OK(メッセージ例は最末尾)。

---

## Step 1. (c) Lenis 二重制御の解消

### ファイル
`components/shared/smooth-scroll-provider.tsx`

### 修正前

```tsx
return (
  <ReactLenis
    root
    options={{
      duration: 1.0,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 0.8,
      smoothWheel: true,
    }}
  >
    {children}
  </ReactLenis>
)
```

### 修正後

```tsx
return (
  <ReactLenis
    root
    options={{
      duration: 1.0,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 0.8,
      smoothWheel: false,   // ← useSectionSnap がホイールを完全制御するため OFF
      smoothTouch: false,   // ← タッチも useSectionSnap で完全制御
      syncTouch:   false,   // ← 同上
    }}
  >
    {children}
  </ReactLenis>
)
```

### 動作確認ポイント
- `/about` を開いてマウスホイール 1 回で次セクションへ 1 画面ジャンプするか
- ジャンプ中・直後にガタつきや二重発火がないか
- `lenis.scrollTo()` を使う既存箇所 (`useSectionSnap` 内) で滑らかに補間されるか

---

## Step 2. (b) パラメータ調整

### ファイル
`hooks/use-section-snap.ts`

### 修正箇所 4 つ

#### ① COOLDOWN

```ts
// 修正前
const COOLDOWN = 800

// 修正後
const COOLDOWN = 550
```

#### ② `lenis.scrollTo` の duration と easing

```ts
// 修正前
lenis.scrollTo(sections[nextIdx], {
  duration: 0.6,
  easing: (t: number) => 1 - Math.pow(1 - t, 4),
})

// 修正後
lenis.scrollTo(sections[nextIdx], {
  duration: 0.45,
  easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),  // easeOutExpo
})
```

#### ③ ホイール最小デルタ

```ts
// 修正前
if (Math.abs(e.deltaY) < 10) return

// 修正後
if (Math.abs(e.deltaY) < 5) return
```

#### ④ タッチ閾値

```ts
// 修正前
if (Math.abs(dy) < 50) return

// 修正後
if (Math.abs(dy) < 40) return
```

### 動作確認ポイント
- ホイール 1 回で 0.45 秒のキビキビした切替になるか
- トラックパッドの軽いフリックでも反応するか
- 連続スクロールで 2 ページ飛びにならないか (COOLDOWN 効いているか)
- スマホで縦スワイプ 40px 程度で発火するか

---

## Step 3. (a) S2 Company を S2-a / S2-b に分割

### ファイル
`app/about/page.tsx`

### 変更概要
- 旧 S2 (Company) を **S2-a (02 / Company: Vision + Mission + KPI)** と **S2-b (03 / Profile: 会社概要 + 拠点 + 主要取引先)** に分割
- 以降の S3〜S6 のセクション番号を **1 つずつ繰り下げ**(03 → 04, 04 → 05, 05 → 06, 06 → 07)

### セクション番号の最終形

| 旧 | 新 | 内容 |
|---|---|---|
| 01 / About | 01 / About | HERO |
| 02 / Company | **02 / Company** | Vision + Mission + KPI 4 枚 |
| (なし) | **03 / Profile** | 会社概要 + 拠点 + 主要取引先 ★新規 |
| 03 / Mechanism | 04 / Mechanism | 3 ステップ集客 |
| 04 / Market | 05 / Market | 市場規模 |
| 05 / Results | 06 / Results | 全国実績 |
| 06 / Next Step | 07 / Next Step | CTA |

### S2-a (新しい 02 / Company) の中身

```tsx
{/* ══════════════════════════════════════════════════
    S2-a: Vision / Mission / KPI
══════════════════════════════════════════════════ */}
<RevealSection>
  <section
    data-snap
    className="border-t border-black/8 h-[100dvh] overflow-hidden flex flex-col justify-center px-6 md:px-10 py-16 md:py-24"
  >
    <div className="max-w-5xl mx-auto w-full">

      <p data-reveal-pop="" style={d(0)}
        className="text-black/30 text-[10px] tracking-[0.35em] uppercase mb-3 font-inter font-black">
        02 / Company
      </p>
      <div aria-hidden data-reveal-border="" style={d(40)} className="h-px bg-black/10 mb-7" />

      <h2 className="font-black leading-[1.05] mb-4 tracking-tight"
        style={{ fontSize: "clamp(26px, 3.5vw, 52px)" }}>
        <span data-reveal-sm="" style={d(80)} className="block">{companyInfo.vision}</span>
      </h2>
      <p data-reveal="" style={{ ...d(180), fontSize: "clamp(14px, 1.2vw, 17px)" }}
        className="text-black/55 leading-relaxed mb-12 max-w-[60ch]">
        {companyInfo.mission}
      </p>

      {/* KPI カウントアップ */}
      <KpiGrid items={companyInfo.kpiNumbers} />
    </div>
  </section>
</RevealSection>
```

### S2-b (新しい 03 / Profile) の中身

```tsx
{/* ══════════════════════════════════════════════════
    S2-b: 会社概要 / 拠点 / 主要取引先
══════════════════════════════════════════════════ */}
<RevealSection>
  <section
    data-snap
    className="border-t border-black/8 h-[100dvh] overflow-hidden flex flex-col justify-center px-6 md:px-10 py-16 md:py-24"
  >
    <div className="max-w-5xl mx-auto w-full">

      <p data-reveal-pop="" style={d(0)}
        className="text-black/30 text-[10px] tracking-[0.35em] uppercase mb-3 font-inter font-black">
        03 / Profile
      </p>
      <div aria-hidden data-reveal-border="" style={d(40)} className="h-px bg-black/10 mb-7" />

      <h2 className="font-black leading-[1.1] mb-10 tracking-tight"
        style={{ fontSize: "clamp(22px, 2.4vw, 36px)" }}>
        <span data-reveal-sm="" style={d(80)} className="block">会社情報</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">

        {/* 会社概要 */}
        <div>
          <p data-reveal-sm="" style={d(160)} className="text-[10px] text-black/30 tracking-[0.25em] uppercase mb-4 font-inter font-black">会社概要</p>
          <dl className="divide-y divide-black/6">
            {[
              { dt: "会社名",   dd: companyInfo.name },
              { dt: "設立",     dd: companyInfo.founded },
              { dt: "代表者",   dd: `${companyInfo.representative.title} ${companyInfo.representative.name}` },
              { dt: "事業内容", dd: companyInfo.business },
            ].map(({ dt, dd }, i) => (
              <div key={dt} data-reveal-pop="" style={d(200 + i * 60)} className="flex gap-6 py-3.5">
                <dt className="text-[12px] text-black/40 w-20 flex-shrink-0 font-inter">{dt}</dt>
                <dd className="text-[12px] text-[#0a0a0a] leading-relaxed">{dd}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 拠点 */}
        <div>
          <p data-reveal-sm="" style={d(340)} className="text-[10px] text-black/30 tracking-[0.25em] uppercase mb-4 font-inter font-black">拠点</p>
          <div className="flex flex-col gap-3">
            {companyInfo.offices.map((office, i) => (
              <div key={office.name} data-reveal-pop="" style={d(380 + i * 80)} className="border border-black/8 px-4 py-4">
                <p className="text-[10px] text-black/38 tracking-[0.2em] uppercase font-inter mb-3">{office.name}</p>
                <p className="text-[12px] text-[#0a0a0a] leading-relaxed mb-2">〒{office.postalCode}<br />{office.address}</p>
                <p className="text-[12px] text-black/50 font-inter">{office.tel}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 主要取引先 */}
        <div>
          <p data-reveal-sm="" style={d(560)} className="text-[10px] text-black/30 tracking-[0.25em] uppercase mb-4 font-inter font-black">主要取引先</p>
          <ul className="flex flex-col gap-2.5">
            {companyInfo.notableClients.map((client, i) => (
              <li key={client} data-reveal-pop="" style={d(600 + i * 80)} className="border border-black/8 px-3 py-2.5 text-[12px] text-[#0a0a0a]">{client}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
</RevealSection>
```

### 以降のセクション番号の繰り下げ

`app/about/page.tsx` 内、テキスト置換で対応:

```diff
- 03 / Mechanism
+ 04 / Mechanism

- 04 / Market
+ 05 / Market

- 05 / Results
+ 06 / Results

- 06 / Next Step
+ 07 / Next Step
```

### 動作確認ポイント
- `/about` を開いて、合計 **7 セクション** に増えているか
- 旧 S2 で見切れていた「主要取引先」が完全に表示されるか
- 02 / Company と 03 / Profile の上下スクロールが破綻していないか
- 以降の Mechanism / Market / Results / Next Step が番号 4〜7 になっているか

---

## 🚨 共通の注意点

1. **`overflow-hidden` は外さないこと**(セクション境界をクリアに保つため)
2. (a) の変更後、`<RevealSection>` を必ず付けること(reveal アニメが効かなくなる)
3. (b) の easing は **easeOutExpo の式** `t === 1 ? 1 : 1 - Math.pow(2, -10 * t)` を正しく書く(t=1 の端点を明示しないと NaN になる場合あり)
4. ステップ完了ごとに `npm run lint && npm run build` でエラーがないか確認
5. ステップごとにブラウザで動作確認できれば理想だが、難しい場合は最後にまとめて確認

---

## 📦 コミットメッセージ推奨例

```
fix(about): improve snap scroll UX

- Disable Lenis smoothWheel to avoid conflict with useSectionSnap
- Tune snap timing: duration 0.6s → 0.45s, cooldown 800ms → 550ms,
  easing easeOutQuart → easeOutExpo
- Split S2 Company into S2-a (Vision/KPI) and S2-b (Profile)
  to fix overflow on standard laptop screens
- Renumber subsequent sections (03→04 Mechanism etc.)
```

---

## 完了後の報告

実装完了後、以下を吉田さんに報告:

1. 変更したファイル一覧
2. `npm run lint` / `npm run build` の結果
3. コミット & プッシュ完了の確認
4. Vercel プレビュー URL
5. 動作確認で気づいた懸念点があれば(任意)
