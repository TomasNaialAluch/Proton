/**
 * Prototype auth — not real sessions.
 * - `DEMO_SESSION_*`: gate for `/dashboard` (artists / labels tooling).
 * - `PUBLIC_DEMO_SESSION_*`: optional “signed in on public site” (listeners).
 */
export const DEMO_SESSION_COOKIE = "proton_demo_session";
export const DEMO_SESSION_VALUE = "1";

export const PUBLIC_DEMO_SESSION_COOKIE = "proton_demo_public";
export const PUBLIC_DEMO_SESSION_VALUE = "1";

const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

export function setDemoSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${DEMO_SESSION_COOKIE}=${DEMO_SESSION_VALUE}; Path=/; Max-Age=${MAX_AGE_SEC}; SameSite=Lax`;
}

export function clearDemoSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${DEMO_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function setPublicDemoSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${PUBLIC_DEMO_SESSION_COOKIE}=${PUBLIC_DEMO_SESSION_VALUE}; Path=/; Max-Age=${MAX_AGE_SEC}; SameSite=Lax`;
}

export function clearPublicDemoSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${PUBLIC_DEMO_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/**
 * Safe in-app return for public flows (`?next=`). Blocks open redirects and dashboard/login.
 */
export function safePublicReturnUrl(raw: string | null): string | null {
  if (raw == null) return null;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw.trim());
  } catch {
    return null;
  }
  if (!decoded.startsWith("/")) return null;
  if (decoded.startsWith("//")) return null;
  if (decoded.startsWith("/dashboard")) return null;
  if (decoded.startsWith("/login")) return null;
  if (decoded.includes("..")) return null;
  return decoded;
}

/**
 * Prevent open redirects: only same-site paths under `/dashboard`.
 */
export function safeDashboardCallbackUrl(raw: string | null): string | null {
  if (raw == null) return null;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw.trim());
  } catch {
    return null;
  }
  if (!decoded.startsWith("/")) return null;
  if (decoded.startsWith("//")) return null;
  if (!decoded.startsWith("/dashboard")) return null;
  if (decoded.includes("..")) return null;
  return decoded;
}
