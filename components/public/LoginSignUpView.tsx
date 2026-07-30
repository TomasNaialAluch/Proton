"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  safeDashboardCallbackUrl,
  safePublicReturnUrl,
  setDemoSessionCookie,
  setPublicDemoSessionCookie,
} from "@/lib/auth/demoSession";

type Tab = "signin" | "signup";

/** Once per browser session — an auto-retry that itself hangs shouldn't
 *  loop forever. A fresh tab/session gets to try the auto-retry again. */
const AUTO_RETRY_FLAG = "proton-login-auto-retry-used";

/** Falls back to a hard navigation if the original attempt (soft or hard)
 *  hasn't resolved after a while — same cold-start hang this whole flow is
 *  built around, see the comment in completeDashboardAccess. Retries at
 *  most once per session so a retry that also hangs doesn't loop. */
function scheduleAutoRetry(target: string) {
  window.setTimeout(() => {
    if (sessionStorage.getItem(AUTO_RETRY_FLAG)) return;
    sessionStorage.setItem(AUTO_RETRY_FLAG, "true");
    window.location.assign(target);
  }, 16000);
}

/** Shown once a pending navigation has run long enough to look stuck — see
 *  the slowLoad comment in LoginSignUpView. */
function SlowLoadHint() {
  return (
    <p className="text-center text-xs text-text-secondary">
      This is taking longer than usual — the server may be waking up from idle.
      We&apos;ll retry automatically in a few seconds. If nothing happens, try
      refreshing the page.
    </p>
  );
}

/**
 * Prototype auth: `/login` with tabs.
 * - With `callbackUrl` under `/dashboard` → sets dashboard demo cookie → For Artists.
 * - Otherwise → sets public demo cookie only → stay on public (`next` or `/`).
 */
export default function LoginSignUpView() {
  const [tab, setTab] = useState<Tab>("signin");
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  /** Immediate feedback the moment the demo CTA is tapped — navigation + dashboard
   *  hydration take a couple seconds, and an unresponsive-looking button reads as
   *  broken rather than "still loading" (see docs/feature-skeletons-loading.md). */
  const [pending, setPending] = useState(false);
  /** Firebase App Hosting cold starts can take ~20s — long enough that a
   *  plain spinner reads as broken. Full-page navigation means this
   *  component keeps rendering (and this timer keeps running) right up
   *  until the new document actually replaces it, so it's safe to surface
   *  a "still with you, try refreshing" message if the wait drags on. See
   *  the cold-start comment in completeDashboardAccess. */
  const [slowLoad, setSlowLoad] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackRaw = searchParams.get("callbackUrl");
  const returnPath = safeDashboardCallbackUrl(callbackRaw);
  const publicReturn = safePublicReturnUrl(searchParams.get("next")) ?? "/";
  const isDashboardGate = returnPath != null;

  /** Focus the CTA on mount — matters most for the reload-and-try-again
   *  case (a stuck cold-start attempt landed back here): the button is
   *  already the focused element, so Enter/Space submits immediately
   *  without hunting for it with the mouse. Doesn't auto-submit on its
   *  own — the tap itself is the demo interaction this screen exists to
   *  show (see the copy below, "Tap the orange button"). */
  useEffect(() => {
    continueButtonRef.current?.focus();
  }, []);

  function completeDashboardAccess() {
    setPending(true);
    setDemoSessionCookie();
    /** See the slowLoad comment above — cold starts on the deployed site can
     *  run long enough that the plain spinner isn't reassuring on its own. */
    window.setTimeout(() => setSlowLoad(true), 6000);
    scheduleAutoRetry(returnPath!);
    /** Full-page navigation, deliberately NOT `router.push()`.
     *
     * `router.push()` asks the server for an RSC payload (special headers,
     * not a plain document request). On Firebase App Hosting that flavour of
     * request handles a cold start far worse than a normal document GET: the
     * button appeared to hang for minutes, while typing the same URL in the
     * address bar took the expected ~20s. Reproducible only on the deployed
     * site — never locally, where `next dev` is always warm and there is no
     * cold start to hit at all.
     *
     * The trade-off is losing the client-side transition on this one step,
     * which costs nothing here: `/dashboard` is a different shell (sidebar,
     * player, providers) than the public site, so it re-renders wholesale
     * either way. The prefetch below is dropped along with it — a full-page
     * navigation discards the client-side query cache, so warming it up
     * milliseconds before leaving the page is wasted work.
     */
    window.location.assign(returnPath!);
  }

  function completePublicAccount() {
    setPending(true);
    setPublicDemoSessionCookie();
    window.setTimeout(() => setSlowLoad(true), 6000);
    scheduleAutoRetry(publicReturn);
    router.push(publicReturn);
  }

  return (
    <div className="max-w-md mx-auto px-4 md:px-6 py-10 flex flex-col gap-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium w-fit transition-colors
          text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} aria-hidden />
        Back to home
      </Link>

      <div>
        <h1
          className="text-2xl md:text-3xl font-bold italic"
          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
        >
          Account
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
          Redesign prototype: sign-in and registration are not connected to a server. Pick a tab to
          preview the flow.
        </p>
        {isDashboardGate && (
          <p className="text-sm mt-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-text-primary">
            <span className="font-semibold text-accent">For Artists</span>
            {" — "}
            after you tap <span className="font-semibold">Continue</span> below you&apos;ll open the
            dashboard (demo session).
          </p>
        )}
        {!isDashboardGate && (
          <p className="text-sm mt-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-text-primary">
            <span className="font-semibold">Public account</span>
            {" — "}
            you stay on Proton Radio (no artist dashboard). Use{" "}
            <span className="font-semibold text-accent">For Artists</span> when you need the
            workspace.
          </p>
        )}
      </div>

      <div
        role="tablist"
        aria-label="Account access type"
        className="flex rounded-xl border p-1 gap-1"
        style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "signin"}
          id="tab-signin"
          aria-controls="panel-signin"
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            tab === "signin"
              ? "text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
          style={
            tab === "signin"
              ? { background: "var(--color-accent)" }
              : { background: "transparent" }
          }
          onClick={() => setTab("signin")}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "signup"}
          id="tab-signup"
          aria-controls="panel-signup"
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            tab === "signup"
              ? "text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
          style={
            tab === "signup"
              ? { background: "var(--color-accent)" }
              : { background: "transparent" }
          }
          onClick={() => setTab("signup")}
        >
          Create account
        </button>
      </div>

      <div
        role="tabpanel"
        id="panel-signin"
        aria-labelledby="tab-signin"
        hidden={tab !== "signin"}
        className="flex flex-col gap-4"
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (isDashboardGate) completeDashboardAccess();
            else completePublicAccount();
          }}
        >
          <p className="rounded-lg border border-emerald-600/25 bg-emerald-500/[0.08] px-3 py-2.5 text-center text-xs leading-relaxed text-text-primary">
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              Demo login
            </span>
            {" — "}
            Email and password are ignored.{" "}
            <strong className="text-text-primary">Tap the orange button</strong> with the{" "}
            <strong className="text-emerald-600 dark:text-emerald-400">moving green ring</strong>
            {isDashboardGate ? (
              <> to open the artist dashboard.</>
            ) : (
              <> to finish and stay on the public site.</>
            )}
          </p>
          <label className="flex flex-col gap-1.5 text-sm">
            <span style={{ color: "var(--color-text-secondary)" }}>Email</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-background)",
                color: "var(--color-text-primary)",
              }}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span style={{ color: "var(--color-text-secondary)" }}>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-background)",
                color: "var(--color-text-primary)",
              }}
            />
          </label>
          <div className="login-prototype-cta-ring">
            <button ref={continueButtonRef} type="submit" disabled={pending} className="login-prototype-cta-btn">
              <span className="flex items-center gap-2">
                {pending && <Loader2 size={16} className="animate-spin" aria-hidden />}
                {pending
                  ? isDashboardGate
                    ? "Opening dashboard…"
                    : "Continuing…"
                  : isDashboardGate
                    ? "Continue to artist dashboard"
                    : "Continue on Proton Radio"}
              </span>
              <span className="login-prototype-cta-btn-sub">Tap here · prototype</span>
            </button>
          </div>
          {pending && slowLoad && <SlowLoadHint />}
        </form>
      </div>

      <div
        role="tabpanel"
        id="panel-signup"
        aria-labelledby="tab-signup"
        hidden={tab !== "signup"}
        className="flex flex-col gap-4"
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (isDashboardGate) completeDashboardAccess();
            else completePublicAccount();
          }}
        >
          {!isDashboardGate && (
            <p className="rounded-lg border border-emerald-600/25 bg-emerald-500/[0.08] px-3 py-2.5 text-center text-xs leading-relaxed text-text-primary">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                Demo sign-up
              </span>
              {" — "}
              No server; you&apos;ll return to the public site after the button below.
            </p>
          )}
          {isDashboardGate && (
            <p className="rounded-lg border border-emerald-600/25 bg-emerald-500/[0.08] px-3 py-2.5 text-center text-xs leading-relaxed text-text-primary">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                Demo sign-up
              </span>
              {" — "}
              Same as sign-in: opens the artist dashboard (prototype).
            </p>
          )}
          <label className="flex flex-col gap-1.5 text-sm">
            <span style={{ color: "var(--color-text-secondary)" }}>Email</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-background)",
                color: "var(--color-text-primary)",
              }}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span style={{ color: "var(--color-text-secondary)" }}>Password</span>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-background)",
                color: "var(--color-text-primary)",
              }}
            />
          </label>
          {isDashboardGate ? (
            <div className="login-prototype-cta-ring">
              <button type="submit" disabled={pending} className="login-prototype-cta-btn">
                <span className="flex items-center gap-2">
                  {pending && <Loader2 size={16} className="animate-spin" aria-hidden />}
                  {pending ? "Opening dashboard…" : "Create account & open dashboard"}
                </span>
                <span className="login-prototype-cta-btn-sub">Tap here · prototype</span>
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ background: "var(--color-accent)" }}
            >
              {pending && <Loader2 size={16} className="animate-spin" aria-hidden />}
              {pending ? "Continuing…" : "Create account & continue"}
            </button>
          )}
          {pending && slowLoad && <SlowLoadHint />}
        </form>
      </div>
    </div>
  );
}
