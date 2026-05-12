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
import type { RevenuePoint } from "@/lib/mock/label-manager/labelRevenue";

interface TooltipPayload {
  value: number;
  payload: RevenuePoint;
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
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-surface px-3 py-2">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="text-sm font-medium text-accent">
        ${p.revenue.toLocaleString("en-US")} revenue
      </p>
      <p className="mt-0.5 text-[11px] text-text-secondary">
        {p.streams.toLocaleString("en-US")} streams
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

export default function LabelRevenueTrendChart({ data }: { data: RevenuePoint[] }) {
  const accent = useAccentColor();
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 6, left: -22, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
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
          domain={[0, maxRevenue]}
          tick={{ fill: "var(--color-text-secondary)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--color-border)" }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={accent}
          strokeWidth={2}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{ r: 4, fill: accent, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
