"use client";

import type { AppMode } from "@/lib/mode";

/**
 * Persistent subtle badge showing current operating mode.
 * Fixed to the bottom-left corner, always visible but non-distracting.
 */
export function DemoModeIndicator({ mode }: { mode: AppMode }) {
  const isLive = mode === "live";

  return (
    <div
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-border bg-panel/90 px-3 py-1.5 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isLive ? "bg-success animate-pulse" : "bg-accent"
        }`}
      />
      <span className="text-xs font-mono text-foreground-muted">
        {isLive
          ? "Live mode — powered by Claude API"
          : "Demo mode — using canned outputs"}
      </span>
    </div>
  );
}
