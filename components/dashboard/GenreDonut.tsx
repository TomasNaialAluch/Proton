"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { ProtonTrack } from "@/lib/api/artist";
import { TRACK_STREAMS, TRACK_GENRES } from "@/lib/mock/performance";

interface Props {
  tracks: ProtonTrack[];
}

const GENRE_COLORS: Record<string, string> = {
  "Progressive":   "#E67E22",
  "Melodic House": "#1ABC9C",
};

const FALLBACK_COLORS = ["#9B59B6", "#E74C3C", "#3498DB"];

interface TooltipPayload {
  name: string;
  value: number;
  payload: { pct: number };
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-surface px-3 py-2">
      <p className="text-xs font-medium text-text-primary">{payload[0].name}</p>
      <p className="text-xs text-text-secondary mt-0.5">{payload[0].value} streams · {payload[0].payload.pct}%</p>
    </div>
  );
}

export default function GenreDonut({ tracks }: Props) {
  // Aggregate streams by genre
  const genreMap = new Map<string, number>();
  for (const track of tracks) {
    const genre  = TRACK_GENRES[track.id] ?? "Other";
    const streams = TRACK_STREAMS[track.id] ?? 0;
    genreMap.set(genre, (genreMap.get(genre) ?? 0) + streams);
  }

  const total = Array.from(genreMap.values()).reduce((s, v) => s + v, 0);
  const data = Array.from(genreMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, streams]) => ({
      name,
      value: streams,
      pct: Math.round((streams / total) * 100),
    }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={78}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map(({ name }, i) => (
            <Cell
              key={name}
              fill={GENRE_COLORS[name] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: "var(--color-text-secondary)", fontSize: 11 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
