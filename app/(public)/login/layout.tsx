import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account — Proton",
  description:
    "Sign in or create an account (redesign prototype, no backend).",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
