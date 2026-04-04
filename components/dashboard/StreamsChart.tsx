"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { mockMonthlyStreams } from "@/lib/mock/streams";

interface TooltipPayload {
  value: number;
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
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="text-sm font-medium text-accent">{payload[0].value} streams</p>
    </div>
  );
}

function useAccentColor() {
  const [color, setColor] = useState("#E67E22"); // fallback

  useEffect(() => {
    const read = () => {
      const resolved = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent")
        .trim();
      if (resolved) setColor(resolved);
    };

    read(); // on mount

    // Re-read whenever data-theme changes
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return color;
}

export default function StreamsChart() {
  const accent = useAccentColor();

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={mockMonthlyStreams} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <defs>
          <linearGradient id="streamsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity={0.25} />
            <stop offset="100%" stopColor={accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={{ fill: "var(--color-text-secondary)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--color-text-secondary)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "var(--color-border)" }}
        />
        <Area
          type="monotone"
          dataKey="streams"
          stroke={accent}
          strokeWidth={2}
          fill="url(#streamsGradient)"
          dot={false}
          activeDot={{ r: 4, fill: accent, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
