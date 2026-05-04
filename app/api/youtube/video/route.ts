import { NextResponse } from "next/server";
import {
  hintsFromApiItem,
  hintsNotFound,
  type YoutubeApiVideoItem,
} from "@/lib/youtube/youtubeVideoHints";

const VIDEO_ID_RE = /^[\w-]{11}$/;

/**
 * GET /api/youtube/video?v=VIDEO_ID
 * Requiere `YOUTUBE_DATA_API_KEY` en el entorno. Sin clave devuelve `ok: false`
 * para degradar sin romper el cliente.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const v = searchParams.get("v")?.trim();
  if (!v || !VIDEO_ID_RE.test(v)) {
    return NextResponse.json(
      { ok: false as const, error: "bad_id" },
      { status: 400 }
    );
  }

  const key = process.env.YOUTUBE_DATA_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: false as const, reason: "no_api_key" });
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet,status,contentDetails,liveStreamingDetails");
  url.searchParams.set("id", v);
  url.searchParams.set("key", key);

  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate: 120 } });
  } catch {
    return NextResponse.json(
      { ok: false as const, error: "fetch_failed" },
      { status: 502 }
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { ok: false as const, error: "upstream", status: res.status },
      { status: 502 }
    );
  }

  const data = (await res.json()) as { items?: unknown[] };
  const item = data.items?.[0];
  if (!item) {
    return NextResponse.json({ ok: true as const, hints: hintsNotFound(v) });
  }

  return NextResponse.json({
    ok: true as const,
    hints: hintsFromApiItem(v, item as YoutubeApiVideoItem),
  });
}
