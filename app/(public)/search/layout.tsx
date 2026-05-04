import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Búsqueda — Proton",
  description: "Buscá artistas, sellos y shows en Proton Radio.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
