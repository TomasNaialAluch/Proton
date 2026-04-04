import type { Royalty, RoyaltySummary } from "@/types/royalty";

export const mockRoyalties: Royalty[] = [
  { id: "r10", artistId: "naial", amount: 0.51,  currency: "USD", period: "2025 Q4 (Oct–Dec)", status: "pending", paidAt: null },
  { id: "r9",  artistId: "naial", amount: 0.84,  currency: "USD", period: "2025 Q3 (Jul–Sep)", status: "pending", paidAt: null },
  { id: "r8",  artistId: "naial", amount: 2.95,  currency: "USD", period: "2025 Q2 (Apr–Jun)", status: "pending", paidAt: null },
  { id: "r7",  artistId: "naial", amount: 3.60,  currency: "USD", period: "2025 Q1 (Jan–Mar)", status: "pending", paidAt: null },
  { id: "r6",  artistId: "naial", amount: 4.77,  currency: "USD", period: "2024 Q4 (Oct–Dec)", status: "pending", paidAt: null },
  { id: "r5",  artistId: "naial", amount: 26.21, currency: "USD", period: "2024 Q3 (Jul–Sep)", status: "pending", paidAt: null },
  { id: "r4",  artistId: "naial", amount: 0.11,  currency: "USD", period: "2024 Q2 (Apr–Jun)", status: "pending", paidAt: null },
  { id: "r3",  artistId: "naial", amount: 0.27,  currency: "USD", period: "2024 Q1 (Jan–Mar)", status: "pending", paidAt: null },
  { id: "r2",  artistId: "naial", amount: 1.15,  currency: "USD", period: "2023 Q4 (Oct–Dec)", status: "pending", paidAt: null },
  { id: "r1",  artistId: "naial", amount: 2.78,  currency: "USD", period: "2023 Q3 (Jul–Sep)", status: "pending", paidAt: null },
];

export const mockRoyaltySummary: RoyaltySummary = {
  totalAccumulated: 43.19,
  pendingPayment: 43.19,
  lastPaymentDate: null,
  currency: "USD",
};

export const payoutConfig = {
  threshold: 100.00,
  nextStatementDate: "2026-06-01",
  nextStatementPeriod: "Q1 2026",
  paymentMethod: "Crypto",
  token: "USDC",
};
