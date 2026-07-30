import { mockReceivedFeedback } from "@/lib/mock/feedback";
import type { Feedback } from "@/types/feedback";

// Simulates network delay — replace the body with a real fetch() call when the API is ready
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchReceivedFeedback(): Promise<Feedback[]> {
  await delay(250);
  return mockReceivedFeedback;
}
