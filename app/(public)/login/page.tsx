import { Suspense } from "react";
import LoginSignUpView from "@/components/public/LoginSignUpView";

/** Dedicated §8.7 route: single navbar link → tabbed login/sign-up (no API). */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-16 text-center text-sm text-text-secondary">
          Loading…
        </div>
      }
    >
      <LoginSignUpView />
    </Suspense>
  );
}
