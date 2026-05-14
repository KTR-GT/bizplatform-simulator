"use client"

import { useDiagnosisFlow } from "@/hooks/use-diagnosis-flow"
import { Act1Prologue } from "./act-1-prologue"
import { Act2Hearing } from "./act-2-hearing"
import { ActPlaceholder } from "./act-placeholder"

// ============================================================
// DIAGNOSIS FLOW — ② AI診断 顧客マッチング 全体オーケストレーション
// ============================================================
// Phase 1: 幕1・幕2 を本実装、幕3〜5 はプレースホルダー。

export function DiagnosisFlow() {
  const flow = useDiagnosisFlow()

  // 幕の遷移時にコンテナレベルでフェード演出（既存 .tab-enter を流用）
  return (
    <div key={flow.act} className="tab-enter">
      {flow.act === 1 && <Act1Prologue onStart={flow.startHearing} />}

      {flow.act === 2 && <Act2Hearing flow={flow} />}

      {flow.act === 3 && (
        <ActPlaceholder
          act={3}
          title="全国 500 社のデータベースを分析しています"
          subtitle="Phase 2C で 8 秒のタメ演出 + マッチング処理を実装します。"
          onAdvance={() => flow.goToAct(4)}
          advanceLabel="（仮）リビールへ →"
        />
      )}

      {flow.act === 4 && (
        <ActPlaceholder
          act={4}
          title="先生にマッチした 3 社"
          subtitle="Phase 2C でフルスクリーンカード + ニアミス 2 社を実装します。"
          onAdvance={() => flow.goToAct(5)}
          advanceLabel="（仮）予約へ →"
        />
      )}

      {flow.act === 5 && (
        <ActPlaceholder
          act={5}
          title="Zoom 相談を予約する"
          subtitle="Phase 3 で内製フォーム + Google Chat Webhook 通知を実装します。"
        />
      )}
    </div>
  )
}
