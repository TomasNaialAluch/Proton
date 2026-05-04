import { protonQuery } from "./protonApi";
import { mockMixes } from "@/lib/mock/mixes";
import type { ProtonMix } from "@/types/mix";

// ── GraphQL (API pública: `mixes` / `mix` no existen; usar `radioMixes` / `radioMix`) ──

const RADIO_MIX_FIELDS = `
  id
  slug
  partNumber
  youtubeId
  showDate { date }
  artist {
    id
    name
    image { url }
  }
  show {
    id
    name
    slug
  }
`;

const LATEST_RADIO_MIXES_QUERY = `
  query GetLatestRadioMixes($limit: Int!) {
    radioMixes(last: $limit) {
      edges {
        node {
          ${RADIO_MIX_FIELDS.trim()}
        }
      }
    }
  }
`;

const LATEST_RADIO_MIXES_BY_GENRE_QUERY = `
  query GetLatestRadioMixesByGenre($limit: Int!, $genreName: String!) {
    radioMixes(last: $limit, filterBy: { genreName: { eq: $genreName } }) {
      edges {
        node {
          ${RADIO_MIX_FIELDS.trim()}
        }
      }
    }
  }
`;

const RADIO_MIX_BY_ID_QUERY = `
  query GetRadioMix($id: ID!) {
    radioMix(id: $id) {
      ${RADIO_MIX_FIELDS.trim()}
    }
  }
`;

type RadioMixGql = {
  id: string;
  slug: string;
  partNumber: number;
  youtubeId: string | null;
  showDate: { date: string } | null;
  artist: {
    id: string;
    name: string;
    image: { url: string } | null;
  };
  show: { id: string; name: string; slug: string };
};

type EdgeNode = { node: RadioMixGql };

/** La API a veces devuelve el mismo `node.id` en más de un edge; React necesita claves únicas. */
function dedupeByMixId(mixes: ProtonMix[]): ProtonMix[] {
  const seen = new Set<string>();
  return mixes.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

/** Slug de URL `/shows/progressive` → nombre de género que acepta `genreName.eq`. */
const GENRE_SLUG_TO_API_NAME: Record<string, string> = {
  breaks: "Breaks",
  downtempo: "Downtempo",
  "deep-house": "Deep House",
  electro: "Electro",
  electronica: "Electronica",
  progressive: "Progressive",
  "tech-house": "Tech House",
  techno: "Techno",
};

function formatShowDateUs(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`;
}

function mapRadioMixToProtonMix(node: RadioMixGql, genreLabel: string): ProtonMix {
  const showName = node.show?.name ?? "Show";
  const dateIso = node.showDate?.date ?? "";
  const dateDisplay = dateIso ? formatShowDateUs(dateIso) : "";
  const part = node.partNumber ?? 1;
  const title = dateDisplay
    ? `${showName} (${dateDisplay}) Part ${part}`
    : `${showName} Part ${part}`;

  return {
    id: String(node.id),
    title,
    date: dateIso ? dateIso.slice(0, 10) : "",
    youtubeId: node.youtubeId ?? "",
    genre: genreLabel,
    artist: {
      id: String(node.artist.id),
      name: node.artist.name,
      image: node.artist.image,
    },
  };
}

function edgesToMixes(edges: EdgeNode[] | undefined, genreLabel: string): ProtonMix[] {
  if (!edges?.length) return [];
  const rows = edges.map((e) => mapRadioMixToProtonMix(e.node, genreLabel));
  return dedupeByMixId(rows.reverse());
}

function resolveGenreFilter(genre?: string): string | undefined {
  if (!genre || genre === "all") return undefined;
  const key = genre.toLowerCase();
  return GENRE_SLUG_TO_API_NAME[key];
}

// ── Fetchers ───────────────────────────────────────────────────────────────

export async function fetchLatestMixes(
  limit = 12,
  genre?: string
): Promise<ProtonMix[]> {
  const apiGenre = resolveGenreFilter(genre);
  const genreLabel = apiGenre ?? "";

  try {
    if (apiGenre) {
      const data = await protonQuery<{
        radioMixes: { edges: EdgeNode[] };
      }>("GetLatestRadioMixesByGenre", LATEST_RADIO_MIXES_BY_GENRE_QUERY, {
        limit,
        genreName: apiGenre,
      });
      return edgesToMixes(data.radioMixes?.edges, genreLabel);
    }

    const data = await protonQuery<{
      radioMixes: { edges: EdgeNode[] };
    }>("GetLatestRadioMixes", LATEST_RADIO_MIXES_QUERY, { limit });
    return edgesToMixes(data.radioMixes?.edges, "");
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[fetchLatestMixes] Proton API failed, using mock:", err);
    }
    const mixes = genre
      ? mockMixes.filter((m) => m.genre.toLowerCase() === genre.toLowerCase())
      : mockMixes;
    return dedupeByMixId(mixes.slice(0, limit));
  }
}

export async function fetchMixById(id: string): Promise<ProtonMix | null> {
  try {
    const data = await protonQuery<{ radioMix: RadioMixGql | null }>(
      "GetRadioMix",
      RADIO_MIX_BY_ID_QUERY,
      { id }
    );
    if (!data.radioMix) return null;
    return mapRadioMixToProtonMix(data.radioMix, "");
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[fetchMixById] Proton API failed, using mock:", err);
    }
    return mockMixes.find((m) => m.id === id) ?? null;
  }
}
