import type { Royalty, RoyaltySummary, RoyaltyStatement } from "@/types/royalty";

export const mockRoyalties: Royalty[] = [
  { id: "r10", qid: 73, artistId: "naial", amount: 0.51,  currency: "USD", period: "2025 Q4", dateRange: "Oct 1 – Dec 31, 2025", status: "withheld", paidAt: null },
  { id: "r9",  qid: 72, artistId: "naial", amount: 0.84,  currency: "USD", period: "2025 Q3", dateRange: "Jul 1 – Sep 30, 2025", status: "withheld", paidAt: null },
  { id: "r8",  qid: 71, artistId: "naial", amount: 2.95,  currency: "USD", period: "2025 Q2", dateRange: "Apr 1 – Jun 30, 2025", status: "withheld", paidAt: null },
  { id: "r7",  qid: 70, artistId: "naial", amount: 3.60,  currency: "USD", period: "2025 Q1", dateRange: "Jan 1 – Mar 31, 2025", status: "withheld", paidAt: null },
  { id: "r6",  qid: 69, artistId: "naial", amount: 4.77,  currency: "USD", period: "2024 Q4", dateRange: "Oct 1 – Dec 31, 2024", status: "withheld", paidAt: null },
  { id: "r5",  qid: 68, artistId: "naial", amount: 26.21, currency: "USD", period: "2024 Q3", dateRange: "Jul 1 – Sep 30, 2024", status: "withheld", paidAt: null },
  { id: "r4",  qid: 67, artistId: "naial", amount: 0.11,  currency: "USD", period: "2024 Q2", dateRange: "Apr 1 – Jun 30, 2024", status: "withheld", paidAt: null },
  { id: "r3",  qid: 66, artistId: "naial", amount: 0.27,  currency: "USD", period: "2024 Q1", dateRange: "Jan 1 – Mar 31, 2024", status: "withheld", paidAt: null },
  { id: "r2",  qid: 65, artistId: "naial", amount: 1.15,  currency: "USD", period: "2023 Q4", dateRange: "Oct 1 – Dec 31, 2023", status: "withheld", paidAt: null },
  { id: "r1",  qid: 64, artistId: "naial", amount: 2.78,  currency: "USD", period: "2023 Q3", dateRange: "Jul 1 – Sep 30, 2023", status: "withheld", paidAt: null },
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
  network: "Ethereum",
  walletAddress: "0xd1...",
};

// ── Full statement detail for Q4 2025 (real data) ────────────────────────────

export const mockStatements: Record<number, RoyaltyStatement> = {
  73: {
    qid: 73,
    quarter: "2025 Q4",
    dateRange: "October 1 – December 31, 2025",
    totalAmount: 0.51,
    currency: "USD",
    status: "withheld",
    releases: [
      { name: "Ones to Watch 24",  trackCount: 6, soldThisQuarter: 2, streamedThisQuarter: 420,   soldTotal: 70, streamedTotal: 2230  },
      { name: "Mind Altered",       trackCount: 2, soldThisQuarter: 0, streamedThisQuarter: 26504, soldTotal: 6,  streamedTotal: 46087 },
      { name: "Balance",            trackCount: 3, soldThisQuarter: 0, streamedThisQuarter: 201,   soldTotal: 67, streamedTotal: 14983 },
      { name: "Beyond Living",      trackCount: 3, soldThisQuarter: 0, streamedThisQuarter: 125,   soldTotal: 12, streamedTotal: 1198  },
    ],
    trackEntries: [
      { trackTitle: "Back (Extended Mix)",              sold: 2, streams: 0,     store: "Beatport",           royaltyPercent: 50, royaltyAmount: 0.81 },
      { trackTitle: "Does This to My Mind (Original)", sold: 0, streams: 598,   store: "YouTube Content ID", royaltyPercent: 40, royaltyAmount: 0.30 },
      { trackTitle: "Back (Extended Mix)",              sold: 0, streams: 3,     store: "Beatport",           royaltyPercent: 50, royaltyAmount: 0.00 },
      { trackTitle: "Does This to My Mind (Original)", sold: 0, streams: 22789, store: "YouTube Content ID", royaltyPercent: 40, royaltyAmount: 0.11 },
      { trackTitle: "Empire (Original Mix)",            sold: 0, streams: 13,    store: "iTunes",             royaltyPercent: 40, royaltyAmount: 0.02 },
      { trackTitle: "Does This to My Mind (Original)", sold: 0, streams: 448,   store: "Facebook",           royaltyPercent: 40, royaltyAmount: 0.02 },
      { trackTitle: "Empire (Original Mix)",            sold: 0, streams: 47,    store: "Facebook",           royaltyPercent: 40, royaltyAmount: 0.01 },
      { trackTitle: "Back (Extended Mix)",              sold: 0, streams: 19,    store: "YouTube Content ID", royaltyPercent: 50, royaltyAmount: 0.01 },
    ],
    stores: [
      { name: "Beatport",           sold: 2, streams: 3,     royalties: 0.97 },
      { name: "YouTube Content ID", sold: 0, streams: 23827, royalties: 0.43 },
      { name: "TikTok",             sold: 0, streams: 2058,  royalties: 0.00 },
      { name: "Facebook",           sold: 0, streams: 582,   royalties: 0.03 },
      { name: "YouTube Publishing", sold: 0, streams: 220,   royalties: 0.02 },
      { name: "iTunes",             sold: 0, streams: 23,    royalties: 0.03 },
      { name: "Anghami",            sold: 0, streams: 19,    royalties: 0.01 },
      { name: "Amazon",             sold: 0, streams: 11,    royalties: 0.00 },
      { name: "Yandex",             sold: 0, streams: 9,     royalties: 0.00 },
      { name: "Tidal",              sold: 0, streams: 5,     royalties: 0.01 },
    ],
    expenses: [
      { catalog: "ASR990", trackName: "Back (Extended Mix)",  info: "Mastering, Visual Design and Promotion", amount: 0.99 },
      { catalog: "ASR890", trackName: "Back (Extended Mix)",  info: "Mastering, Visual Design and Promotion", amount: 0.99 },
      { catalog: "ASR890", trackName: "Empire (Original Mix)", info: "Mastering, Visual Design and Promotion", amount: 0.99 },
    ],
  },
};
