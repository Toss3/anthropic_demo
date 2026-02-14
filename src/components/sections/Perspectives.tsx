"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { FadeIn } from "@/components/ui/FadeIn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── Data ───────────────────────────────────────────────────────────── */

interface Metric {
  label: string;
  value: string;
  detail: string;
}

interface Perspective {
  id: string;
  tab: string;
  tagline: string;
  focus: string[];
  metrics: Metric[];
  accentClass: string;
  borderClass: string;
  bgClass: string;
  accentColor: string;
}

const perspectives: Perspective[] = [
  {
    id: "developer",
    tab: "Developer",
    tagline: "The pair programmer that actually keeps up",
    focus: ["Workflow speed", "Code quality", "Creative freedom"],
    metrics: [
      { label: "Cycle time", value: "-73%", detail: "From idea to merged PR" },
      { label: "Test coverage", value: "+67%", detail: "Automated test generation" },
      { label: "Iteration steps", value: "6 → 2", detail: "With project context via CLAUDE.md" },
    ],
    accentClass: "text-accent",
    borderClass: "border-accent/30",
    bgClass: "bg-accent/10",
    accentColor: "var(--accent)",
  },
  {
    id: "manager",
    tab: "Eng. Manager",
    tagline: "Your team ships more, burns out less",
    focus: ["Team velocity", "Toil reduction", "Adoption patterns"],
    metrics: [
      { label: "Tickets closed", value: "+40%", detail: "Per sprint, same team size" },
      { label: "Review time", value: "-55%", detail: "Higher first-pass quality" },
      { label: "Toil work done", value: "3× more", detail: "Tests, docs, migrations" },
    ],
    accentClass: "text-success",
    borderClass: "border-success/30",
    bgClass: "bg-success/10",
    accentColor: "var(--success)",
  },
  {
    id: "executive",
    tab: "Exec & Security",
    tagline: "Measurable value with enterprise-grade controls",
    focus: ["ROI", "Controls & compliance", "Data boundaries"],
    metrics: [
      { label: "Eng. cost savings", value: "$2.4M", detail: "Per 100 engineers annually" },
      { label: "Developer satisfaction", value: "92%", detail: "Would recommend to peers" },
      { label: "Audit coverage", value: "100%", detail: "Full action trace logging" },
    ],
    accentClass: "text-blue-400",
    borderClass: "border-blue-400/30",
    bgClass: "bg-blue-400/10",
    accentColor: "#60a5fa",
  },
];

/* ── Component ──────────────────────────────────────────────────────── */

export function Perspectives() {
  const [activeTab, setActiveTab] = useState(0);
  const reduced = useReducedMotion();
  const current = perspectives[activeTab];

  return (
    <ScrollSection id="perspectives">
      <FadeIn>
        <p className="text-sm font-mono text-accent mb-2 sm:mb-3">
          Same capabilities, different lenses
        </p>
        <h2 className="mb-1 sm:mb-2">Audience Perspectives</h2>
        <p className="text-foreground-muted max-w-xl text-sm sm:text-base mb-4 sm:mb-6">
          Every stakeholder sees Claude Code through their own priorities.
          The value is the same — the framing shifts.
        </p>
      </FadeIn>

      {/* Tab bar */}
      <FadeIn delay={0.1}>
        <div className="flex gap-1 p-1 bg-panel rounded-lg border border-border w-fit mb-3 sm:mb-5">
          {perspectives.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveTab(i)}
              className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === i
                  ? "text-foreground"
                  : "text-foreground-dim hover:text-foreground-muted"
              }`}
            >
              {activeTab === i && (
                <motion.div
                  layoutId={reduced ? undefined : "tab-bg"}
                  className="absolute inset-0 bg-background-muted border border-border-bright rounded-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{p.tab}</span>
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Tab content */}
      <FadeIn delay={0.15}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Tagline + Focus badges — compact row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
              <p className={`text-base sm:text-lg font-semibold ${current.accentClass} shrink-0`}>
                &ldquo;{current.tagline}&rdquo;
              </p>
              <div className="flex flex-wrap gap-1.5">
                {current.focus.map((f) => (
                  <span
                    key={f}
                    className={`px-2.5 py-0.5 text-[11px] font-mono rounded-full border ${current.borderClass} ${current.bgClass}`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-5">
              {current.metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-panel border border-border rounded-lg p-3 sm:p-4"
                >
                  <p className="text-[11px] font-mono text-foreground-dim mb-1">
                    {m.label}
                  </p>
                  <p className={`text-xl sm:text-2xl font-bold ${current.accentClass}`}>
                    {m.value}
                  </p>
                  <p className="text-[11px] text-foreground-muted mt-0.5">
                    {m.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Dashboard — role-specific visual (hidden on mobile to fit viewport) */}
            <div className="hidden sm:block">
              {current.id === "developer" && <DeveloperDash />}
              {current.id === "manager" && <ManagerDash accent={current.accentColor} />}
              {current.id === "executive" && <ExecDash />}
            </div>

            {/* Illustrative label */}
            <p className="text-[10px] text-foreground-dim font-mono mt-3">
              Illustrative data
            </p>
          </motion.div>
        </AnimatePresence>
      </FadeIn>
    </ScrollSection>
  );
}

/* ── Developer Dashboard ────────────────────────────────────────────── */

const DEV_ACTIVITY = [
  { prefix: "✓", text: "PR #247 merged — user creation endpoint (CLAUDE.md-aware)", accent: true },
  { prefix: "✓", text: "33 tests generated for payments module (+67% coverage)", accent: true },
  { prefix: "✓", text: "auth.ts refactored: 2,400 → 6 focused modules", accent: true },
  { prefix: "$", text: "claude \"Add rate limiting to /api/upload\" — 4 files, 1 commit", accent: false },
  { prefix: ">", text: "All 164 tests passing · 0 type errors · lint clean", accent: false },
];

function DeveloperDash() {
  return (
    <div className="bg-code-bg border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <span className="h-2.5 w-2.5 rounded-full bg-error/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        <span className="text-[11px] font-mono text-foreground-dim ml-2">
          recent activity — claude-code
        </span>
      </div>
      <div className="px-3 py-2.5 space-y-1.5 font-mono text-xs sm:text-sm">
        {DEV_ACTIVITY.map((line, i) => (
          <div key={i} className="flex gap-2">
            <span className={line.accent ? "text-accent" : "text-foreground-dim"}>
              {line.prefix}
            </span>
            <span className={line.accent ? "text-foreground-muted" : "text-foreground-dim"}>
              {line.text}
            </span>
          </div>
        ))}
        <div className="flex gap-2 mt-1">
          <span className="text-accent">▊</span>
          <span className="text-foreground-dim opacity-50">_</span>
        </div>
      </div>
    </div>
  );
}

/* ── Manager Dashboard ──────────────────────────────────────────────── */

const VELOCITY_DATA = [
  { sprint: "S1", before: 12, after: 12 },
  { sprint: "S2", before: 14, after: 16 },
  { sprint: "S3", before: 13, after: 19 },
  { sprint: "S4", before: 15, after: 22 },
  { sprint: "S5", before: 14, after: 24 },
  { sprint: "S6", before: 13, after: 26 },
];

const TEAM_BREAKDOWN = [
  { role: "Senior engineers", adoption: "94%", impact: "2.1× PR throughput" },
  { role: "Mid-level engineers", adoption: "88%", impact: "3.4× test coverage" },
  { role: "Junior engineers", adoption: "82%", impact: "1.8× ramp speed" },
];

function ManagerDash({ accent }: { accent: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Velocity chart */}
      <div className="bg-panel border border-border rounded-lg p-3 sm:p-4">
        <p className="text-[11px] font-mono text-foreground-dim mb-2">
          Sprint velocity (tickets closed)
        </p>
        <div className="h-[110px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={VELOCITY_DATA}
              margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
            >
              <XAxis
                dataKey="sprint"
                tick={{ fill: "var(--foreground-dim)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Bar dataKey="before" radius={[2, 2, 0, 0]} maxBarSize={16}>
                {VELOCITY_DATA.map((_, i) => (
                  <Cell key={i} fill="var(--border-bright)" />
                ))}
              </Bar>
              <Bar dataKey="after" radius={[2, 2, 0, 0]} maxBarSize={16}>
                {VELOCITY_DATA.map((_, i) => (
                  <Cell key={i} fill={accent} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-1.5">
          <span className="flex items-center gap-1.5 text-[10px] text-foreground-dim">
            <span className="h-2 w-2 rounded-sm bg-border-bright" /> Before
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-success">
            <span className="h-2 w-2 rounded-sm bg-success" /> With Claude Code
          </span>
        </div>
      </div>

      {/* Team adoption table */}
      <div className="bg-panel border border-border rounded-lg p-3 sm:p-4">
        <p className="text-[11px] font-mono text-foreground-dim mb-2">
          Team adoption & impact
        </p>
        <div className="space-y-2">
          {TEAM_BREAKDOWN.map((row) => (
            <div key={row.role} className="flex items-center justify-between gap-2">
              <span className="text-xs text-foreground-muted truncate">{row.role}</span>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-success font-medium">
                  {row.adoption}
                </span>
                <span className="text-[11px] text-foreground-dim font-mono">
                  {row.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2.5 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-foreground-dim">Net toil reduction</span>
            <span className="text-sm font-bold text-success">-62%</span>
          </div>
          <p className="text-[10px] text-foreground-dim mt-0.5">
            Tests, docs, migrations now ship alongside features
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Executive Dashboard ────────────────────────────────────────────── */

const ROI_ROWS = [
  { item: "Developer productivity gain", value: "$1.8M", note: "73% cycle time reduction" },
  { item: "Reduced bug remediation", value: "$340K", note: "67% coverage improvement" },
  { item: "Eliminated context switching", value: "$260K", note: "MCP automation" },
];

const CONTROLS = [
  { label: "MCP permissions", status: "Granular" },
  { label: "Audit logging", status: "Full trace" },
  { label: "Data residency", status: "Configurable" },
  { label: "SSO / RBAC", status: "Supported" },
  { label: "Code review", status: "Human-in-loop" },
  { label: "Compliance", status: "SOC 2 ready" },
];

function ExecDash() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* ROI breakdown */}
      <div className="bg-panel border border-border rounded-lg p-3 sm:p-4">
        <p className="text-[11px] font-mono text-foreground-dim mb-2">
          ROI breakdown (per 100 engineers/yr)
        </p>
        <div className="space-y-2">
          {ROI_ROWS.map((row) => (
            <div key={row.item} className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-foreground-muted truncate">{row.item}</p>
                <p className="text-[10px] text-foreground-dim">{row.note}</p>
              </div>
              <span className="text-sm font-bold text-blue-400 shrink-0 font-mono">
                {row.value}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-border flex items-center justify-between">
          <span className="text-xs font-medium text-foreground-muted">
            Total annual value
          </span>
          <span className="text-base font-bold text-blue-400 font-mono">
            $2.4M
          </span>
        </div>
      </div>

      {/* Controls & permissions grid */}
      <div className="bg-panel border border-border rounded-lg p-3 sm:p-4">
        <p className="text-[11px] font-mono text-foreground-dim mb-2">
          Enterprise controls
        </p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {CONTROLS.map((c) => (
            <div key={c.label} className="flex items-start gap-1.5">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
              <div>
                <p className="text-[11px] text-foreground-muted leading-tight">
                  {c.label}
                </p>
                <p className="text-[10px] font-mono text-blue-400">
                  {c.status}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-border">
          <p className="text-[10px] text-foreground-dim">
            All actions logged with full trace. No data leaves your environment
            without explicit MCP permission grants.
          </p>
        </div>
      </div>
    </div>
  );
}
