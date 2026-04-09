"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import type { ProtonTrack } from "@/lib/api/artist";
import { TRACK_STREAMS as MOCK_STREAMS } from "@/lib/mock/performance";

interface Props {
  tracks: ProtonTrack[];
}

interface TooltipPayload {
  value: number;
  payload: { release: string; tracks: number };
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-surface px-3 py-2">
      <p className="text-xs font-medium text-text-primary">{label}</p>
      <p className="text-xs text-accent mt-0.5">{payload[0].value} streams</p>
      <p className="text-[10px] text-text-secondary mt-0.5">
        {payload[0].payload.tracks} track{payload[0].payload.tracks !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

function useAccentColor() {
  const [color, setColor] = useState("#E67E22");
  useEffect(() => {
    const read = () => {
      const val = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent")
        .trim();
      if (val) setColor(val);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return color;
}

export default function ReleasesChart({ tracks }: Props) {
  const accent = useAccentColor();

  // Group tracks by release, sum mock streams
  const releaseMap = new Map<string, { name: string; streams: number; tracks: number }>();
  for (const track of tracks) {
    const { id, name } = track.release;
    const streams = MOCK_STREAMS[track.id] ?? 0;
    const existing = releaseMap.get(id);
    if (existing) {
      existing.streams += streams;
      existing.tracks += 1;
    } else {
      releaseMap.set(id, { name, streams, tracks: 1 });
    }
  }

  const data = Array.from(releaseMap.values())
    .sort((a, b) => b.streams - a.streams)
    .map(({ name, streams, tracks }) => ({
      release: name.length > 14 ? name.slice(0, 13) + "…" : name,
      streams,
      tracks,
    }));

  const maxStreams = Math.max(...data.map((d) => d.streams), 1);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
      >
        <XAxis
          type="number"
          domain={[0, maxStreams + 5]}
          tick={{ fill: "var(--color-text-secondary)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="release"
          width={90}
          tick={{ fill: "var(--color-text-secondary)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="streams" radius={[0, 6, 6, 0]} barSize={16}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={accent}
              fillOpacity={i === 0 ? 1 : 0.4 + (data.length - i) * 0.12}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
