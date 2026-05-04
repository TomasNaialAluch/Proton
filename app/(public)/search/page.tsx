import { Suspense } from "react";
import SearchView from "@/components/public/SearchView";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Cargando búsqueda…
          </p>
        </div>
      }
    >
      <SearchView />
    </Suspense>
  );
}
