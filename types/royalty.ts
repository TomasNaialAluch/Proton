export interface Royalty {
  id: string;
  artistId: string;
  amount: number;
  currency: string;
  period: string;
  status: "pending" | "paid";
  paidAt: string | null;
}

export interface RoyaltySummary {
  totalAccumulated: number;
  pendingPayment: number;
  lastPaymentDate: string | null;
  currency: string;
}
