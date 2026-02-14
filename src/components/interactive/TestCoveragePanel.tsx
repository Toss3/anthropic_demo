"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── Canned data ─────────────────────────────────────────────────── */

const BEFORE_TESTS = [
  { name: "checkout.test.ts", tests: 2, lines: 340, status: "sparse" as const },
  { name: "pricing.test.ts", tests: 0, lines: 180, status: "none" as const },
  { name: "subscriptions.test.ts", tests: 0, lines: 220, status: "none" as const },
];

const AFTER_TESTS = [
  { name: "checkout.test.ts", tests: 14, lines: 340, status: "full" as const },
  { name: "pricing.test.ts", tests: 8, lines: 180, status: "full" as const },
  { name: "subscriptions.test.ts", tests: 11, lines: 220, status: "full" as const },
];

const TEST_RUN_LINES = [
  { text: "Running test suite...", delay: 0 },
  { text: "", delay: 200 },
  { text: "PASS  checkout.test.ts", delay: 400, accent: true },
  { text: "  ✓ handles expired promotional pricing (12ms)", delay: 600 },
  { text: "  ✓ handles concurrent checkout race condition (45ms)", delay: 750 },
  { text: "  ✓ validates idempotency key (8ms)", delay: 850 },
  { text: "  ... +11 more tests passed", delay: 950, dim: true },
  { text: "", delay: 1050 },
  { text: "PASS  pricing.test.ts", delay: 1150, accent: true },
  { text: "  ✓ volume discount tiers (5ms)", delay: 1300 },
  { text: "  ✓ multi-currency conversion (9ms)", delay: 1400 },
  { text: "  ... +6 more tests passed", delay: 1500, dim: true },
  { text: "", delay: 1600 },
  { text: "PASS  subscriptions.test.ts", delay: 1700, accent: true },
  { text: "  ✓ upgrade/downgrade proration (15ms)", delay: 1850 },
  { text: "  ✓ cancellation with refund (11ms)", delay: 1950 },
  { text: "  ... +9 more tests passed", delay: 2050, dim: true },
  { text: "", delay: 2200 },
  { text: "Tests:    33 passed, 33 total", delay: 2400, accent: true },
  { text: "Coverage: 87.2%  (+67.0%)", delay: 2550, accent: true },
  { text: "Bugs:     3 found (race condition, tax rounding, expired promo)", delay: 2700, accent: true },
];

const TOTAL_ANIMATION_MS = 3000;

/* ── Types ────────────────────────────────────────────────────────── */

type View = "before" | "after";

/* ── Component ───────────────────────────────────────────────────── */

export function TestCoveragePanel() {
  const reduced = useReducedMotion();
  const [view, setView] = useState<View>("before");
  const [running, setRunning] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [coverage, setCoverage] = useState(20);
  const [showTerminal, setShowTerminal] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const reset = () => {
    clearTimers();
    setView("before");
    setRunning(false);
    setVisibleLines(0);
    setCoverage(20);
    setShowTerminal(false);
  };

  const runTests = () => {
    if (running) return;
    setRunning(true);
    setShowTerminal(true);
    setVisibleLines(0);
    setCoverage(20);

    // Reveal terminal lines progressively
    TEST_RUN_LINES.forEach((line, i) => {
      const timer = setTimeout(() => {
        setVisibleLines(i + 1);
        // Auto-scroll terminal
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, line.delay);
      timersRef.current.push(timer);
    });

    // Animate coverage counter
    const coverageStart = setTimeout(() => {
      const steps = 30;
      const stepMs = 600 / steps;
      for (let i = 0; i <= steps; i++) {
        const t = setTimeout(() => {
          setCoverage(Math.round(20 + (87 - 20) * (i / steps)));
        }, i * stepMs);
        timersRef.current.push(t);
      }
    }, 2400);
    timersRef.current.push(coverageStart);

    // Switch to "after" view and mark done
    const done = setTimeout(() => {
      setView("after");
      setRunning(false);
    }, TOTAL_ANIMATION_MS);
    timersRef.current.push(done);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const tests = view === "before" ? BEFORE_TESTS : AFTER_TESTS;
  const coverageColor =
    coverage < 40 ? "var(--error)" : coverage < 70 ? "var(--accent)" : "var(--success)";

  return (
    <div className="rounded-lg border border-border bg-panel overflow-hidden">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="border-b border-border px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-md border border-border overflow-hidden text-xs">
            {(["before", "after"] as const).map((v) => (
              <button
                key={v}
                onClick={() => !running && setView(v)}
                className={`px-3 py-1.5 transition-colors capitalize ${
                  view === v
                    ? "bg-accent text-background font-medium"
                    : "bg-panel text-foreground-muted hover:text-foreground"
                } ${running ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Coverage badge */}
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 rounded-full bg-code-bg overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${coverage}%`,
                  backgroundColor: coverageColor,
                }}
              />
            </div>
            <span
              className="text-xs font-mono font-medium tabular-nums"
              style={{ color: coverageColor }}
            >
              {coverage}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runTests}
            disabled={running}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
              running
                ? "bg-accent-muted text-accent cursor-not-allowed"
                : "bg-accent text-background hover:bg-accent-hover"
            }`}
          >
            {running ? "Running..." : "Run Tests"}
          </button>
          <button
            onClick={reset}
            className="text-xs text-foreground-dim hover:text-foreground transition-colors px-2 py-1.5 border border-border rounded-md"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Test file list ───────────────────────────────── */}
      <div className="px-4 py-4">
        <p className="text-xs font-mono text-foreground-dim mb-3">
          src/payments/
        </p>
        <div className="space-y-2">
          {tests.map((t) => (
            <div
              key={t.name}
              className="flex items-center justify-between py-2 px-3 rounded-md bg-code-bg"
            >
              <div className="flex items-center gap-3 min-w-0">
                <StatusDot status={t.status} />
                <span className="text-sm font-mono text-foreground truncate">
                  {t.name}
                </span>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <span className="text-xs text-foreground-dim">
                  {t.lines} lines
                </span>
                <span
                  className={`text-xs font-mono font-medium ${
                    t.tests === 0
                      ? "text-error"
                      : t.tests <= 2
                        ? "text-foreground-dim"
                        : "text-success"
                  }`}
                >
                  {t.tests} {t.tests === 1 ? "test" : "tests"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Terminal output ──────────────────────────────── */}
      <AnimatePresence>
        {showTerminal && (
          <TerminalSection
            reduced={reduced}
            visibleLines={visibleLines}
            terminalRef={terminalRef}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

function StatusDot({ status }: { status: "none" | "sparse" | "full" }) {
  const color =
    status === "none"
      ? "bg-error"
      : status === "sparse"
        ? "bg-foreground-dim"
        : "bg-success";
  return <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} />;
}

function TerminalSection({
  reduced,
  visibleLines,
  terminalRef,
}: {
  reduced: boolean;
  visibleLines: number;
  terminalRef: React.RefObject<HTMLDivElement | null>;
}) {
  const Wrapper = reduced ? "div" : motion.div;
  const animProps = reduced
    ? {}
    : {
        initial: { height: 0, opacity: 0 },
        animate: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: { duration: 0.3 },
      };

  return (
    <Wrapper {...animProps} className="overflow-hidden border-t border-border">
      <div
        ref={terminalRef}
        className="px-4 py-3 max-h-52 overflow-y-auto font-mono text-xs leading-relaxed"
      >
        {TEST_RUN_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className={
              line.accent
                ? "text-accent"
                : line.dim
                  ? "text-foreground-dim"
                  : "text-foreground-muted"
            }
          >
            {line.text || "\u00A0"}
          </div>
        ))}
        {visibleLines < TEST_RUN_LINES.length && visibleLines > 0 && (
          <span className="inline-block w-1.5 h-3.5 bg-accent animate-pulse" />
        )}
      </div>
    </Wrapper>
  );
}
