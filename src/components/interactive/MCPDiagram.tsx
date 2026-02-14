"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── Node data ────────────────────────────────────────────────────── */

interface ToolNode {
  id: string;
  label: string;
  icon: string;
  /** Position as percentage of container (cx, cy). */
  cx: number;
  cy: number;
  dataIn: string;
  dataOut: string;
  permissions: string;
  /** Index in the flow animation sequence (0 = first). */
  flowOrder: number;
}

interface FlowStep {
  toolId: string;
  direction: "in" | "out";
  label: string;
}

type Variant = "engineering" | "executive";

/* ── Engineering variant (original) ───────────────────────────────── */

const ENG_TOOLS: ToolNode[] = [
  {
    id: "jira",
    label: "Jira",
    icon: "\u{1F4CB}",
    cx: 18,
    cy: 22,
    dataIn: "Ticket PROJ-1234: priority, description, assignee, linked issues",
    dataOut: "Status \u2192 Done, resolution: Fixed, linked PR #892",
    permissions: "Read tickets, write status updates (project-scoped)",
    flowOrder: 0,
  },
  {
    id: "slack",
    label: "Slack",
    icon: "\u{1F4AC}",
    cx: 82,
    cy: 22,
    dataIn: "Thread #incident-db-timeout: 12 messages, timestamps, participants",
    dataOut: "Resolution summary posted to channel",
    permissions: "Read channels, post messages (bot-scoped)",
    flowOrder: 1,
  },
  {
    id: "github",
    label: "GitHub",
    icon: "\u{1F500}",
    cx: 18,
    cy: 78,
    dataIn: "Blame for src/db/pool.ts, commit history, CI status",
    dataOut: "PR #892 created with fix + tests, linked to PROJ-1234",
    permissions: "Read repos, create PRs, read CI (org-scoped)",
    flowOrder: 2,
  },
  {
    id: "database",
    label: "Database",
    icon: "\u{1F5C4}\u{FE0F}",
    cx: 82,
    cy: 78,
    dataIn: "Connection pool metrics, error logs, query latency",
    dataOut: "Health check query validation",
    permissions: "Read-only access to metrics schema",
    flowOrder: 3,
  },
];

const ENG_FLOW: FlowStep[] = [
  { toolId: "jira", direction: "in", label: "Reading ticket context..." },
  { toolId: "slack", direction: "in", label: "Pulling Slack thread..." },
  { toolId: "github", direction: "in", label: "Checking git blame..." },
  { toolId: "database", direction: "in", label: "Querying pool metrics..." },
  { toolId: "github", direction: "out", label: "Creating PR with fix..." },
  { toolId: "jira", direction: "out", label: "Updating ticket status..." },
  { toolId: "slack", direction: "out", label: "Posting resolution..." },
];

/* ── Executive variant ────────────────────────────────────────────── */

const EXEC_TOOLS: ToolNode[] = [
  {
    id: "crm",
    label: "CRM",
    icon: "\u{1F4C8}",
    cx: 18,
    cy: 22,
    dataIn: "Pipeline deals, customer health scores, recent interactions",
    dataOut: "Updated deal stages, auto-generated follow-up tasks",
    permissions: "Read deals, write tasks (CRM-scoped)",
    flowOrder: 0,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "\u{1F4CA}",
    cx: 82,
    cy: 22,
    dataIn: "Revenue dashboards, user engagement metrics, churn signals",
    dataOut: "Executive summary report, KPI highlights",
    permissions: "Read-only analytics views (role-restricted)",
    flowOrder: 1,
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: "\u{1F4E3}",
    cx: 18,
    cy: 78,
    dataIn: "Campaign performance, lead attribution, content metrics",
    dataOut: "Campaign ROI summary, recommended budget shifts",
    permissions: "Read campaigns, read attribution data",
    flowOrder: 2,
  },
  {
    id: "finance",
    label: "Finance",
    icon: "\u{1F4B0}",
    cx: 82,
    cy: 78,
    dataIn: "Q4 revenue actuals, budget vs forecast, cost center data",
    dataOut: "Board-ready financial summary, variance analysis",
    permissions: "Read-only financial reporting (role-restricted)",
    flowOrder: 3,
  },
];

const EXEC_FLOW: FlowStep[] = [
  { toolId: "crm", direction: "in", label: "Reading pipeline data..." },
  { toolId: "analytics", direction: "in", label: "Pulling revenue dashboards..." },
  { toolId: "marketing", direction: "in", label: "Checking campaign ROI..." },
  { toolId: "finance", direction: "in", label: "Querying financial actuals..." },
  { toolId: "analytics", direction: "out", label: "Generating exec summary..." },
  { toolId: "crm", direction: "out", label: "Creating follow-up tasks..." },
  { toolId: "finance", direction: "out", label: "Preparing board report..." },
];

/* ── Flow result summaries ────────────────────────────────────────── */

interface FlowResult {
  headline: string;
  stats: { label: string; value: string }[];
  outcome: string;
}

const ENG_RESULT: FlowResult = {
  headline: "Issue resolved end-to-end",
  stats: [
    { label: "Systems queried", value: "4" },
    { label: "Context switches", value: "0" },
    { label: "Time to resolution", value: "~3 min" },
    { label: "Systems updated", value: "3" },
  ],
  outcome:
    "PR #892 created with fix + tests. Jira ticket closed. Slack thread resolved. Zero manual copy-paste between tools.",
};

const EXEC_RESULT: FlowResult = {
  headline: "Board report assembled automatically",
  stats: [
    { label: "Data sources", value: "4" },
    { label: "Manual steps saved", value: "12" },
    { label: "Report generation", value: "~2 min" },
    { label: "Deliverables", value: "3" },
  ],
  outcome:
    "Executive summary, financial variance report, and CRM follow-up tasks generated. All data cross-referenced automatically.",
};

const CLAUDE_CX = 50;
const CLAUDE_CY = 50;

/* ── Component ───────────────────────────────────────────────────── */

export function MCPDiagram() {
  const reduced = useReducedMotion();
  const [variant, setVariant] = useState<Variant>("engineering");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [flowIndex, setFlowIndex] = useState<number>(-1);
  const [isFlowing, setIsFlowing] = useState(false);
  const [flowComplete, setFlowComplete] = useState(false);

  const tools = variant === "engineering" ? ENG_TOOLS : EXEC_TOOLS;
  const flowSteps = variant === "engineering" ? ENG_FLOW : EXEC_FLOW;
  const flowResult = variant === "engineering" ? ENG_RESULT : EXEC_RESULT;

  const selectedTool = tools.find((t) => t.id === selectedNode) ?? null;
  const currentStep = flowIndex >= 0 && flowIndex < flowSteps.length ? flowSteps[flowIndex] : null;

  const startFlow = useCallback(() => {
    setSelectedNode(null);
    setFlowIndex(0);
    setIsFlowing(true);
    setFlowComplete(false);

    const steps = variant === "engineering" ? ENG_FLOW : EXEC_FLOW;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= steps.length) {
        clearInterval(interval);
        setIsFlowing(false);
        setFlowIndex(-1);
        setFlowComplete(true);
      } else {
        setFlowIndex(step);
      }
    }, 1200);
  }, [variant]);

  const reset = useCallback(() => {
    setSelectedNode(null);
    setFlowIndex(-1);
    setIsFlowing(false);
    setFlowComplete(false);
  }, []);

  const switchVariant = useCallback(
    (v: Variant) => {
      if (v === variant || isFlowing) return;
      reset();
      setFlowComplete(false);
      setVariant(v);
    },
    [variant, isFlowing, reset]
  );

  const handleNodeClick = useCallback(
    (id: string) => {
      if (isFlowing) return;
      setSelectedNode((prev) => (prev === id ? null : id));
    },
    [isFlowing]
  );

  return (
    <div className="rounded-lg border border-border bg-panel overflow-hidden">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-accent">MCP</span>
          <span className="text-sm text-foreground-muted">Connection Diagram</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={startFlow}
            disabled={isFlowing}
            className="px-3 py-1 text-xs font-mono rounded bg-accent text-background hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFlowing ? "Running..." : "Run Flow"}
          </button>
          <button
            onClick={reset}
            className="px-3 py-1 text-xs font-mono rounded border border-border text-foreground-muted hover:text-foreground hover:border-border-bright transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Variant toggle ───────────────────────────────── */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-background/50">
        {(["engineering", "executive"] as const).map((v) => (
          <button
            key={v}
            onClick={() => switchVariant(v)}
            disabled={isFlowing}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
              variant === v
                ? "bg-accent/15 text-accent border border-accent/30"
                : "text-foreground-dim hover:text-foreground-muted border border-transparent"
            } disabled:cursor-not-allowed`}
          >
            {v === "engineering" ? "Engineering" : "Executive"}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-foreground-dim font-mono">
          Illustrative data
        </span>
      </div>

      {/* ── Diagram ─────────────────────────────────────── */}
      <div className="relative pb-[80%] sm:pb-[60%]">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Connection lines */}
          {tools.map((tool) => {
            const isActive =
              currentStep?.toolId === tool.id || selectedNode === tool.id;
            return (
              <line
                key={`line-${tool.id}`}
                x1={CLAUDE_CX}
                y1={CLAUDE_CY}
                x2={tool.cx}
                y2={tool.cy}
                stroke={isActive ? "var(--accent)" : "var(--border-bright)"}
                strokeWidth={isActive ? 0.4 : 0.2}
                strokeDasharray={isActive ? "none" : "1 0.8"}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Flow particle (animated dot traveling along connection) */}
          {!reduced && currentStep && (() => {
            const tool = tools.find((t) => t.id === currentStep.toolId);
            if (!tool) return null;
            const fromX = currentStep.direction === "in" ? tool.cx : CLAUDE_CX;
            const fromY = currentStep.direction === "in" ? tool.cy : CLAUDE_CY;
            const toX = currentStep.direction === "in" ? CLAUDE_CX : tool.cx;
            const toY = currentStep.direction === "in" ? CLAUDE_CY : tool.cy;
            return (
              <motion.circle
                key={`particle-${variant}-${flowIndex}`}
                r={1}
                fill="var(--accent)"
                initial={{ cx: fromX, cy: fromY, opacity: 1 }}
                animate={{ cx: toX, cy: toY, opacity: [1, 1, 0.3] }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            );
          })()}

          {/* Claude center node */}
          <circle
            cx={CLAUDE_CX}
            cy={CLAUDE_CY}
            r={7}
            fill="var(--panel)"
            stroke="var(--accent)"
            strokeWidth={0.5}
          />
          <text
            x={CLAUDE_CX}
            y={CLAUDE_CY - 1}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--accent)"
            fontSize={3.5}
            fontFamily="var(--font-geist-mono)"
            fontWeight={600}
          >
            Claude
          </text>
          <text
            x={CLAUDE_CX}
            y={CLAUDE_CY + 3}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--foreground-dim)"
            fontSize={2}
            fontFamily="var(--font-geist-mono)"
          >
            MCP Hub
          </text>

          {/* Tool nodes */}
          {tools.map((tool) => {
            const isActive =
              currentStep?.toolId === tool.id || selectedNode === tool.id;
            return (
              <g
                key={tool.id}
                onClick={() => handleNodeClick(tool.id)}
                className="cursor-pointer"
              >
                <circle
                  cx={tool.cx}
                  cy={tool.cy}
                  r={5.5}
                  fill={isActive ? "var(--accent-muted)" : "var(--code-bg)"}
                  stroke={isActive ? "var(--accent)" : "var(--border-bright)"}
                  strokeWidth={isActive ? 0.5 : 0.3}
                  className="transition-all duration-300"
                />
                <text
                  x={tool.cx}
                  y={tool.cy - 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={4}
                >
                  {tool.icon}
                </text>
                <text
                  x={tool.cx}
                  y={tool.cy + 3.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isActive ? "var(--accent)" : "var(--foreground-muted)"}
                  fontSize={2.2}
                  fontFamily="var(--font-geist-mono)"
                  className="transition-colors duration-300"
                >
                  {tool.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Flow status label */}
        <AnimatePresence mode="wait">
          {currentStep && (
            <motion.div
              key={`${variant}-${flowIndex}`}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-accent-muted border border-accent/30 text-xs font-mono text-accent whitespace-nowrap"
              initial={reduced ? undefined : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="inline-block mr-1">
                {currentStep.direction === "in" ? "\u2190" : "\u2192"}
              </span>
              {currentStep.label}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Detail panel (click a node) ─────────────────── */}
      <AnimatePresence mode="wait">
        {selectedTool && !isFlowing && !flowComplete && (
          <motion.div
            key={selectedTool.id}
            className="border-t border-border px-4 py-3 space-y-2"
            initial={reduced ? undefined : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{selectedTool.icon}</span>
              <span className="text-sm font-mono text-accent">
                {selectedTool.label}
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded bg-code-bg p-2.5">
                <p className="text-[10px] font-mono text-accent mb-1">
                  DATA IN
                </p>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {selectedTool.dataIn}
                </p>
              </div>
              <div className="rounded bg-code-bg p-2.5">
                <p className="text-[10px] font-mono text-accent mb-1">
                  DATA OUT
                </p>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {selectedTool.dataOut}
                </p>
              </div>
            </div>
            <div className="rounded bg-code-bg p-2.5">
              <p className="text-[10px] font-mono text-foreground-dim mb-1">
                PERMISSIONS
              </p>
              <p className="text-xs text-foreground-muted leading-relaxed">
                {"\u{1F512}"} {selectedTool.permissions}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Flow result summary ──────────────────────────── */}
      <AnimatePresence>
        {flowComplete && (
          <motion.div
            key={`result-${variant}`}
            className="border-t border-accent/30 bg-accent-muted/30"
            initial={reduced ? undefined : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-3 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-accent font-medium">
                  RESULT
                </span>
                <span className="text-sm text-foreground">
                  {flowResult.headline}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {flowResult.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded bg-panel border border-border p-2 text-center"
                  >
                    <p className="text-lg font-mono text-accent font-semibold leading-tight">
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-foreground-dim mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-foreground-muted leading-relaxed">
                {flowResult.outcome}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
