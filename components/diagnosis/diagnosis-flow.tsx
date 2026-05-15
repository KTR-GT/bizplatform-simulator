"use client"

import { useDiagnosisFlow } from "@/hooks/use-diagnosis-flow"
import { Act1Prologue } from "./act-1-prologue"
import { Act2Hearing } from "./act-2-hearing"
import { Act3Analyzing } from "./act-3-analyzing"
import { Act4Reveal } from "./act-4-reveal"
import { Act5Booking } from "./act-5-booking"
import { ActPlaceholder } from "./act-placeholder"
import { CustomCursor } from "./custom-cursor"

export function DiagnosisFlow() {
  const flow = useDiagnosisFlow()

  return (
    <>
      <CustomCursor />
      <div key={flow.act} className="tab-enter">
        {flow.act === 1 && <Act1Prologue onStart={flow.startHearing} />}

        {flow.act === 2 && <Act2Hearing flow={flow} />}

        {flow.act === 3 && <Act3Analyzing flow={flow} />}

        {flow.act === 4 && <Act4Reveal flow={flow} />}

        {flow.act === 5 && <Act5Booking flow={flow} />}
      </div>
    </>
  )
}
