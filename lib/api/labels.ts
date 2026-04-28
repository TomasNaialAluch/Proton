import { protonQuery } from "./protonApi";
import { mockLabels } from "@/lib/mock/labels";
import type { ProtonLabel } from "@/types/label";

// ── Queries ────────────────────────────────────────────────────────────────

const LABELS_QUERY = `
  query GetLabels {
    labels {
      id
      name
      slug
      artistCount
      image { url }
    }
  }
`;

const LABEL_BY_ID_QUERY = `
  query GetLabel($id: ID!) {
    label(id: $id) {
      id
      name
      slug
      artistCount
      image { url }
      artists { id name slug image { url } }
    }
  }
`;

// ── Fetchers ───────────────────────────────────────────────────────────────

export async function fetchLabels(): Promise<ProtonLabel[]> {
  try {
    const data = await protonQuery<{ labels: ProtonLabel[] }>(
      "GetLabels",
      LABELS_QUERY
    );
    return data.labels;
  } catch {
    return mockLabels;
  }
}

export async function fetchLabelById(id: string): Promise<ProtonLabel | null> {
  try {
    const data = await protonQuery<{ label: ProtonLabel }>(
      "GetLabel",
      LABEL_BY_ID_QUERY,
      { id }
    );
    return data.label;
  } catch {
    return mockLabels.find((l) => l.id === id) ?? null;
  }
}
