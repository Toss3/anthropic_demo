"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
} from "recharts";

/* ── Types ─────────────────────────────────────────────────────────── */

interface CalloutMetric {
  variant: "callout";
  label: string;
  value: string;
  subtext?: string;
}

interface BarMetric {
  variant: "bar";
  label: string;
  bars: { name: string; value: number; highlight?: boolean }[];
  unit?: string;
}

interface GaugeMetric {
  variant: "gauge";
  label: string;
  from: number;
  to: number;
  unit?: string;
  subtext?: string;
}

export type MetricData = CalloutMetric | BarMetric | GaugeMetric;

interface MetricWidgetProps {
  data: MetricData;
  className?: string;
}

/* ── Component ─────────────────────────────────────────────────────── */

export function MetricWidget({ data, className = "" }: MetricWidgetProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-panel p-5 ${className}`}
    >
      <p className="text-xs font-mono text-foreground-dim mb-3 uppercase tracking-wider">
        {data.label}
      </p>

      {data.variant === "callout" && <Callout data={data} />}
      {data.variant === "bar" && <BarViz data={data} />}
      {data.variant === "gauge" && <Gauge data={data} />}

      <p className="text-[10px] text-foreground-dim mt-3 font-mono">
        Illustrative data
      </p>
    </div>
  );
}

/* ── Callout ───────────────────────────────────────────────────────── */

function Callout({ data }: { data: CalloutMetric }) {
  return (
    <div>
      <p className="text-3xl font-semibold text-accent tracking-tight">
        {data.value}
      </p>
      {data.subtext && (
        <p className="text-sm text-foreground-muted mt-1">{data.subtext}</p>
      )}
    </div>
  );
}

/* ── Bar chart ─────────────────────────────────────────────────────── */

function BarViz({ data }: { data: BarMetric }) {
  return (
    <div className="h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data.bars}
          margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--foreground-dim)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.bars.map((entry, idx) => (
              <Cell
                key={idx}
                fill={entry.highlight ? "var(--accent)" : "var(--border-bright)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {data.unit && (
        <p className="text-xs text-foreground-dim text-center -mt-1">
          {data.unit}
        </p>
      )}
    </div>
  );
}

/* ── Gauge (animated ring) ─────────────────────────────────────────── */

function Gauge({ data }: { data: GaugeMetric }) {
  const max = Math.max(data.from, data.to, 100);
  const pct = (data.to / max) * 100;

  return (
    <div className="flex items-center gap-4">
      {/* Ring */}
      <div className="relative h-20 w-20 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="var(--border)"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeDasharray={`${pct} ${100 - pct}`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-accent">
          {data.to}
          {data.unit ?? "%"}
        </span>
      </div>

      {/* Label */}
      <div>
        <p className="text-foreground-muted text-sm">
          <span className="text-foreground-dim">{data.from}{data.unit ?? "%"}</span>
          {" → "}
          <span className="text-accent font-semibold">{data.to}{data.unit ?? "%"}</span>
        </p>
        {data.subtext && (
          <p className="text-xs text-foreground-dim mt-1">{data.subtext}</p>
        )}
      </div>
    </div>
  );
}
