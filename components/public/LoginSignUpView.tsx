"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  safeDashboardCallbackUrl,
  safePublicReturnUrl,
  setDemoSessionCookie,
  setPublicDemoSessionCookie,
} from "@/lib/auth/demoSession";

type Tab = "signin" | "signup";

/**
 * Prototype auth: `/login` with tabs.
 * - With `callbackUrl` under `/dashboard` → sets dashboard demo cookie → For Artists.
 * - Otherwise → sets public demo cookie only → stay on public (`next` or `/`).
 */
export default function LoginSignUpView() {
  const [tab, setTab] = useState<Tab>("signin");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackRaw = searchParams.get("callbackUrl");
  const returnPath = safeDashboardCallbackUrl(callbackRaw);
  const publicReturn = safePublicReturnUrl(searchParams.get("next")) ?? "/";
  const isDashboardGate = returnPath != null;

  function completeDashboardAccess() {
    setDemoSessionCookie();
    router.push(returnPath!);
  }

  function completePublicAccount() {
    setPublicDemoSessionCookie();
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
            <button type="submit" className="login-prototype-cta-btn">
              <span>
                {isDashboardGate ? "Continue to artist dashboard" : "Continue on Proton Radio"}
              </span>
              <span className="login-prototype-cta-btn-sub">Tap here · prototype</span>
            </button>
          </div>
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
              <button type="submit" className="login-prototype-cta-btn">
                <span>Create account & open dashboard</span>
                <span className="login-prototype-cta-btn-sub">Tap here · prototype</span>
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--color-accent)" }}
            >
              Create account & continue
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
