// ============================================================
// COMMIT PLANS — マスタ定数
// ============================================================

/** 基準コミット額（月間） */
export const BASE_COMMIT = 100_000

/** 1年払いの基準月額（BASE_COMMIT 時） */
export const INSTALLMENT_BASE_1Y = 57_800

/** 3年払いの基準月額（BASE_COMMIT 時） */
export const INSTALLMENT_BASE_3Y = 26_800

export interface CommitPlan {
  monthly: number  // サービス月額
  commit:  number  // 月間コミット額（保証）
}

export const commitPlans: CommitPlan[] = [
  { monthly: 19800,  commit: 100000  },
  { monthly: 29800,  commit: 200000  },
  { monthly: 39800,  commit: 300000  },
  { monthly: 49800,  commit: 400000  },
  { monthly: 59800,  commit: 500000  },
  { monthly: 69800,  commit: 600000  },
  { monthly: 79800,  commit: 700000  },
  { monthly: 89800,  commit: 800000  },
  { monthly: 99800,  commit: 900000  },
  { monthly: 109800, commit: 1000000 },
]
