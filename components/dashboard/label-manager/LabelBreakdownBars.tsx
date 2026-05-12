"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { useEffect, useState } from "react";
import type { BreakdownPoint } from "@/lib/mock/label-manager/labelRevenue";

interface TooltipPayload {
  value: number;
  payload: BreakdownPoint;
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
      <p className="text-xs text-accent mt-0.5">{payload[0].value}%</p>
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

export default function LabelBreakdownBars({
  data,
  label,
}: {
  data: BreakdownPoint[];
  label: string;
}) {
  const accent = useAccentColor();
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-primary">{label}</h3>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">
          Mock
        </span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            type="number"
            domain={[0, Math.max(100, max)]}
            tick={{ fill: "var(--color-text-secondary)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={90}
            tick={{ fill: "var(--color-text-secondary)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={accent}
                fillOpacity={i === 0 ? 1 : 0.38 + (data.length - i) * 0.1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
