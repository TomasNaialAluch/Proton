import { mockCharts, type ChartEntry } from "@/lib/mock/charts";

// La API de Proton no expone charts públicamente — usamos mock permanente.
// Si en el futuro existe la query, reemplazar el cuerpo con protonQuery().

export async function fetchCharts(genre: string): Promise<ChartEntry[]> {
  const slug = genre.toLowerCase().replace(/\s+/g, "-");
  return mockCharts[slug] ?? mockCharts["progressive"];
}

export type { ChartEntry };
