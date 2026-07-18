import { mockReceivedFeedback, mockPendingToReview } from "@/lib/mock/feedback";
import type { Feedback, PendingFeedbackRequest } from "@/types/feedback";

// Simulates network delay — replace the body with a real fetch() call when the API is ready
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchReceivedFeedback(): Promise<Feedback[]> {
  await delay(250);
  return mockReceivedFeedback;
}

export async function fetchPendingToReview(): Promise<PendingFeedbackRequest[]> {
  await delay(250);
  return mockPendingToReview;
}
