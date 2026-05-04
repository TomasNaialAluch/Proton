"use client";

import { useEffect } from "react";
import { initFirebaseAnalytics } from "@/lib/firebase/client";

/**
 * Registers Firebase Analytics once in the browser (after hydration).
 * Requires NEXT_PUBLIC_FIREBASE_* in `.env.local` or the host env (e.g. Vercel).
 */
export default function FirebaseInit() {
  useEffect(() => {
    void initFirebaseAnalytics();
  }, []);
  return null;
}
