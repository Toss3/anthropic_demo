/**
 * Templated talk track generator for the Sales Story Builder.
 *
 * All outputs are canned/template-based (demo mode).
 * Keyed by audience, with industry and goal modifiers.
 */

export type Audience = "developer" | "manager" | "executive";
export type Industry = "saas" | "fintech" | "healthcare" | "ecommerce";
export type Goal = "ship-faster" | "improve-quality" | "reduce-toil" | "scale-team";

export interface DemoStep {
  label: string;
  anchor: string;
}

export interface TalkTrackResult {
  pitch: string;
  demoPath: DemoStep[];
  proofPoints: string[];
}

/* ── Labels for display ─────────────────────────────────────────────── */

export const AUDIENCES: { value: Audience; label: string }[] = [
  { value: "developer", label: "Developer" },
  { value: "manager", label: "Eng. Manager" },
  { value: "executive", label: "Executive" },
];

export const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: "saas", label: "SaaS" },
  { value: "fintech", label: "FinTech" },
  { value: "healthcare", label: "Healthcare" },
  { value: "ecommerce", label: "E-commerce" },
];

export const GOALS: { value: Goal; label: string }[] = [
  { value: "ship-faster", label: "Ship Faster" },
  { value: "improve-quality", label: "Improve Quality" },
  { value: "reduce-toil", label: "Reduce Toil" },
  { value: "scale-team", label: "Scale Team" },
];

/* ── Industry context fragments ─────────────────────────────────────── */

const industryContext: Record<Industry, string> = {
  saas: "rapid feature iteration and multi-tenant complexity",
  fintech: "regulatory compliance, audit trails, and zero-downtime deployments",
  healthcare: "HIPAA-sensitive data handling and strict access controls",
  ecommerce: "high-traffic seasonal spikes and payment system reliability",
};

/* ── Goal-specific emphasis ─────────────────────────────────────────── */

const goalEmphasis: Record<Goal, string> = {
  "ship-faster": "cutting cycle time from idea to merged PR",
  "improve-quality": "raising test coverage and catching bugs before production",
  "reduce-toil": "automating repetitive work so engineers focus on creative problems",
  "scale-team": "letting smaller teams deliver what used to require twice the headcount",
};

/* ── Demo paths by audience ─────────────────────────────────────────── */

const demoPaths: Record<Audience, Record<Goal, DemoStep[]>> = {
  developer: {
    "ship-faster": [
      { label: "The CLAUDE.md Effect — 6 iterations → 2", anchor: "story-claudemd" },
      { label: "MCP Orchestration — zero context switches", anchor: "story-mcp" },
      { label: "Developer perspective — cycle time -73%", anchor: "perspectives" },
    ],
    "improve-quality": [
      { label: "Testing Transformation — 20% → 87% coverage", anchor: "story-testing" },
      { label: "The CLAUDE.md Effect — conventions on first try", anchor: "story-claudemd" },
      { label: "Legacy Modernization — safe, incremental refactoring", anchor: "story-legacy" },
    ],
    "reduce-toil": [
      { label: "Testing Transformation — 33 tests auto-generated", anchor: "story-testing" },
      { label: "MCP Orchestration — 4 systems, zero manual handoff", anchor: "story-mcp" },
      { label: "Vignettes — PM ships tool without engineering", anchor: "vignettes" },
    ],
    "scale-team": [
      { label: "Vignettes — solo dev, 3 features in parallel", anchor: "vignettes" },
      { label: "The CLAUDE.md Effect — project context scales", anchor: "story-claudemd" },
      { label: "Vignettes — agent teams at scale (40 services)", anchor: "vignettes" },
    ],
  },
  manager: {
    "ship-faster": [
      { label: "Testing Transformation — coverage jumps free up shipping", anchor: "story-testing" },
      { label: "Manager perspective — +40% tickets per sprint", anchor: "perspectives" },
      { label: "MCP Orchestration — cross-tool automation", anchor: "story-mcp" },
    ],
    "improve-quality": [
      { label: "Testing Transformation — 3 bugs caught pre-production", anchor: "story-testing" },
      { label: "The CLAUDE.md Effect — consistent code quality", anchor: "story-claudemd" },
      { label: "Manager perspective — review time -55%", anchor: "perspectives" },
    ],
    "reduce-toil": [
      { label: "Manager perspective — 3× more toil work shipped", anchor: "perspectives" },
      { label: "Legacy Modernization — automated refactoring", anchor: "story-legacy" },
      { label: "Vignettes — researcher builds own pipeline", anchor: "vignettes" },
    ],
    "scale-team": [
      { label: "Vignettes — agent teams migrate 40 services in 3 days", anchor: "vignettes" },
      { label: "Manager perspective — team adoption & velocity", anchor: "perspectives" },
      { label: "The CLAUDE.md Effect — onboard faster with conventions", anchor: "story-claudemd" },
    ],
  },
  executive: {
    "ship-faster": [
      { label: "Executive perspective — $2.4M annual value", anchor: "perspectives" },
      { label: "MCP Orchestration — enterprise tool integration", anchor: "story-mcp" },
      { label: "Manager perspective — velocity chart", anchor: "perspectives" },
    ],
    "improve-quality": [
      { label: "Testing Transformation — risk reduction at scale", anchor: "story-testing" },
      { label: "Executive perspective — enterprise controls", anchor: "perspectives" },
      { label: "Legacy Modernization — safe modernization path", anchor: "story-legacy" },
    ],
    "reduce-toil": [
      { label: "Executive perspective — $2.4M ROI breakdown", anchor: "perspectives" },
      { label: "MCP Orchestration — eliminate context switching", anchor: "story-mcp" },
      { label: "Manager perspective — net toil reduction -62%", anchor: "perspectives" },
    ],
    "scale-team": [
      { label: "Vignettes — non-engineers shipping production code", anchor: "vignettes" },
      { label: "Executive perspective — developer satisfaction 92%", anchor: "perspectives" },
      { label: "Vignettes — 40-service migration in 3 days", anchor: "vignettes" },
    ],
  },
};

/* ── Proof points by audience × goal ────────────────────────────────── */

const proofPoints: Record<Audience, Record<Goal, string[]>> = {
  developer: {
    "ship-faster": [
      "73% reduction in cycle time from idea to merged PR",
      "Iteration steps cut from 6 to 2 with project context",
      "Context gathering automated across Jira, Slack, GitHub",
    ],
    "improve-quality": [
      "Test coverage improved from 20% to 87% in one session",
      "3 production bugs caught before deployment",
      "Code matches team conventions on first generation",
    ],
    "reduce-toil": [
      "33 tests auto-generated across 3 payment modules",
      "4 tool systems synchronized without manual handoff",
      "PM shipped internal dashboard without engineering support",
    ],
    "scale-team": [
      "3× feature throughput with Git worktree parallelism",
      "40-service migration completed in 3 days (est. 3 weeks)",
      "Junior engineers ramp 1.8× faster with CLAUDE.md context",
    ],
  },
  manager: {
    "ship-faster": [
      "+40% tickets closed per sprint, same team size",
      "Review time reduced 55% with higher first-pass quality",
      "Cross-tool automation eliminates 25+ min context gathering",
    ],
    "improve-quality": [
      "Test coverage gains of +67% without dedicated QA sprints",
      "3 bugs caught pre-production in a single review session",
      "Review time down 55% — code arrives closer to shippable",
    ],
    "reduce-toil": [
      "3× more toil work (tests, docs, migrations) shipped alongside features",
      "Net toil reduction of 62% across all engineering teams",
      "Non-engineers self-serve: PM shipped tool in 2 days vs 2 sprints",
    ],
    "scale-team": [
      "94% adoption among senior engineers, 82% among juniors",
      "40-service migration: 3 days instead of estimated 3 weeks",
      "Junior engineers productive 1.8× faster with project context",
    ],
  },
  executive: {
    "ship-faster": [
      "$2.4M annual value per 100 engineers (productivity + quality + automation)",
      "73% cycle time reduction measured across development workflows",
      "Developer satisfaction at 92% — retention signal",
    ],
    "improve-quality": [
      "$340K saved in reduced bug remediation costs annually",
      "100% audit coverage with full action trace logging",
      "Human-in-the-loop code review maintained throughout",
    ],
    "reduce-toil": [
      "$2.4M total ROI: $1.8M productivity + $340K quality + $260K automation",
      "62% toil reduction lets teams focus on strategic work",
      "$260K saved from eliminated context switching via MCP",
    ],
    "scale-team": [
      "Smaller teams deliver 40%+ more per sprint without new hires",
      "Non-engineers (PMs, researchers) self-serve production-grade tooling",
      "SOC 2 ready with granular MCP permissions and configurable data residency",
    ],
  },
};

/* ── Generator ──────────────────────────────────────────────────────── */

export function generateTalkTrack(
  audience: Audience,
  industry: Industry,
  goal: Goal,
): TalkTrackResult {
  const ctx = industryContext[industry];
  const emphasis = goalEmphasis[goal];
  const audienceLabel =
    audience === "developer"
      ? "developers"
      : audience === "manager"
        ? "engineering leaders"
        : "technical executives";

  const pitch = `For ${audienceLabel} in ${ctx} — Claude Code is the fastest path to ${emphasis}. It understands your codebase through CLAUDE.md conventions, orchestrates across your existing tools via MCP, and ships production-grade code with full test coverage and audit trails.`;

  return {
    pitch,
    demoPath: demoPaths[audience][goal],
    proofPoints: proofPoints[audience][goal],
  };
}
