"use client";

import { useEffect, useState } from "react";
import { hasPublicDemoSession } from "@/lib/auth/demoSession";

/** Reads `PUBLIC_DEMO_SESSION_COOKIE` client-side; false during SSR/first paint to avoid a mismatch. */
export function usePublicDemoSession(): boolean {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(hasPublicDemoSession());
  }, []);

  return signedIn;
}
