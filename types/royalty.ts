export interface Royalty {
  id: string;
  qid: number;
  artistId: string;
  amount: number;
  currency: string;
  period: string;
  dateRange: string;
  status: "withheld" | "paid";
  paidAt: string | null;
}

export interface RoyaltySummary {
  totalAccumulated: number;
  pendingPayment: number;
  lastPaymentDate: string | null;
  currency: string;
}

// ── Statement detail ──────────────────────────────────────────────────────────

export interface StatementRelease {
  name: string;
  trackCount: number;
  soldThisQuarter: number;
  streamedThisQuarter: number;
  soldTotal: number;
  streamedTotal: number;
}

export interface StatementTrackEntry {
  trackTitle: string;
  sold: number;
  streams: number;
  store: string;
  royaltyPercent: number;
  royaltyAmount: number;
}

export interface StatementStore {
  name: string;
  sold: number;
  streams: number;
  royalties: number;
}

export interface StatementExpense {
  catalog: string;
  trackName: string;
  info: string;
  amount: number;
}

export interface RoyaltyStatement {
  qid: number;
  quarter: string;
  dateRange: string;
  totalAmount: number;
  currency: string;
  status: "withheld" | "paid";
  releases: StatementRelease[];
  trackEntries: StatementTrackEntry[];
  stores: StatementStore[];
  expenses: StatementExpense[];
}
