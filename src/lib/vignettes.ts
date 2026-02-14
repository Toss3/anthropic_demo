/**
 * Vignette data — lighter stories showing breadth.
 *
 * Each vignette: who, what they built, the outcome, and source attribution.
 * No interactive demo, no Trace View — just narrative + visual.
 */

export interface Vignette {
  id: string;
  title: string;
  who: string;
  summary: string;
  outcome: string;
  source: {
    label: string;
    url: string;
  };
}

export const vignettes: Vignette[] = [
  {
    id: "vignette-pm-tool",
    title: "PM Ships Internal Tool",
    who: "Product Manager",
    summary:
      "A product manager with no backend experience built and launched an internal dashboard for tracking feature requests \u2014 complete with database, auth, and a clean UI.",
    outcome: "Shipped in 2 days. Previously estimated at 2 sprints of engineering time.",
    source: {
      label: "Inspired by r/ClaudeAI community stories",
      url: "https://www.reddit.com/r/ClaudeAI/search/?q=non+engineer+built+app+claude",
    },
  },
  {
    id: "vignette-worktrees",
    title: "Solo Dev, Three Features",
    who: "Full-Stack Engineer",
    summary:
      "One engineer used Claude Code with Git worktrees to work on three features simultaneously across parallel branches \u2014 each with full context isolation.",
    outcome: "3x feature throughput without context-switching overhead.",
    source: {
      label: "Inspired by Git worktree + Claude Code workflows",
      url: "https://docs.anthropic.com/en/docs/claude-code/cli-usage",
    },
  },
  {
    id: "vignette-data-pipeline",
    title: "Researcher Builds Pipeline",
    who: "Data Scientist",
    summary:
      "A researcher who normally depends on data engineering built a complete ETL pipeline \u2014 ingestion, transformation, validation, and scheduling \u2014 without filing a single Jira ticket.",
    outcome: "Pipeline running in production within a week. Zero data engineering support needed.",
    source: {
      label: "Inspired by stories of non-engineers building with AI",
      url: "https://www.reddit.com/r/ClaudeAI/search/?q=data+scientist+pipeline+claude",
    },
  },
  {
    id: "vignette-agent-teams",
    title: "Agent Teams at Scale",
    who: "Platform Team Lead",
    summary:
      "A platform team coordinated multiple Claude Code agents across a large migration project \u2014 each agent handling a different service, all following the same CLAUDE.md conventions.",
    outcome: "40-service migration completed in 3 days instead of the estimated 3 weeks.",
    source: {
      label: "Inspired by multi-agent Claude Code workflows",
      url: "https://docs.anthropic.com/en/docs/claude-code/cli-usage#running-multiple-agents",
    },
  },
];
