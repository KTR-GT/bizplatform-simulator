import { CommitPlan, BASE_COMMIT, INSTALLMENT_BASE_1Y, INSTALLMENT_BASE_3Y } from "@/data/commit-plans"

export type InstallmentPeriod = "1y" | "3y" | "7y"

export interface Installment {
  monthly: number
  months:  number
  total:   number
}

/**
 * コミットプランの分割払い情報を返す。
 *
 * - 1年払い: Math.round(57800 × scale) × 12   (scale = commit / 100000)
 * - 3年払い: Math.round(26800 × scale) × 36
 * - 7年払い: plan.monthly × 84  （スケールしない・テーブル値そのまま）
 */
export function getInstallment(plan: CommitPlan, period: InstallmentPeriod): Installment {
  const scale = plan.commit / BASE_COMMIT

  switch (period) {
    case "1y": {
      const monthly = Math.round(INSTALLMENT_BASE_1Y * scale)
      return { monthly, months: 12, total: monthly * 12 }
    }
    case "3y": {
      const monthly = Math.round(INSTALLMENT_BASE_3Y * scale)
      return { monthly, months: 36, total: monthly * 36 }
    }
    case "7y": {
      return { monthly: plan.monthly, months: 84, total: plan.monthly * 84 }
    }
  }
}
