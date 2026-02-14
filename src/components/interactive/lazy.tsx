"use client";

import dynamic from "next/dynamic";

/* ── Loading skeleton for interactive panels ──────────────────────── */

function InteractiveSkeleton() {
  return (
    <div className="w-full h-64 rounded-lg bg-panel border border-border animate-pulse" />
  );
}

/* ── Dynamic imports: code-split heavy interactives (client-only) ── */

export const LazyClaudeMDCompare = dynamic(
  () =>
    import("./ClaudeMDCompare").then((m) => ({
      default: m.ClaudeMDCompare,
    })),
  { ssr: false, loading: () => <InteractiveSkeleton /> }
);

export const LazyTestCoveragePanel = dynamic(
  () =>
    import("./TestCoveragePanel").then((m) => ({
      default: m.TestCoveragePanel,
    })),
  { ssr: false, loading: () => <InteractiveSkeleton /> }
);

export const LazyMCPDiagram = dynamic(
  () =>
    import("./MCPDiagram").then((m) => ({
      default: m.MCPDiagram,
    })),
  { ssr: false, loading: () => <InteractiveSkeleton /> }
);

export const LazyIncrementalDiffViewer = dynamic(
  () =>
    import("./IncrementalDiffViewer").then((m) => ({
      default: m.IncrementalDiffViewer,
    })),
  { ssr: false, loading: () => <InteractiveSkeleton /> }
);
