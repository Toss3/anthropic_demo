"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── Types ─────────────────────────────────────────────────────────── */

export interface TraceStep {
  /** Label shown in the step indicator (e.g. "Understand"). */
  label: string;
  /** Icon character or emoji (kept simple, no extra deps). */
  icon: string;
  /** Main content — rendered inside a code/pre block. */
  content: string;
  /** Optional: "diff" | "terminal" | "text". Default "text". */
  variant?: "diff" | "terminal" | "text";
  /** Plain-English summary for non-technical audiences. */
  description?: string;
}

interface TraceViewProps {
  steps: TraceStep[];
  className?: string;
  /** Called when the active step changes (index 0-based). */
  onStepChange?: (step: number) => void;
}

const STEP_ICONS_DEFAULT: Record<string, string> = {
  Understand: "\u{1F50D}",
  Plan: "\u{1F4CB}",
  Edit: "\u{270F}\u{FE0F}",
  Test: "\u{2705}",
  Ship: "\u{1F680}",
};

/** Debounce interval between scroll-driven step changes (ms). */
const SCROLL_DEBOUNCE = 400;
/** Minimum wheel delta to trigger a step change. */
const WHEEL_THRESHOLD = 30;
/** Minimum touch swipe distance (px) to trigger a step change. */
const TOUCH_THRESHOLD = 40;

/* ── Component ─────────────────────────────────────────────────────── */

export function TraceView({
  steps,
  className = "",
  onStepChange,
}: TraceViewProps) {
  const [active, setActive] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const activeRef = useRef(active);

  const stepCount = steps.length;

  // Keep ref in sync for event handlers (avoids stale closures)
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Fire onStepChange whenever active step changes
  useEffect(() => {
    onStepChange?.(active);
  }, [active, onStepChange]);

  // Dismiss scroll hint after first interaction or after 6s
  useEffect(() => {
    const timer = setTimeout(() => setShowScrollHint(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const dismissHint = useCallback(() => {
    setShowScrollHint(false);
  }, []);

  const goTo = useCallback((idx: number) => {
    setActive(idx);
    dismissHint();
  }, [dismissHint]);

  const reset = useCallback(() => {
    setActive(0);
  }, []);

  /* ── Scroll-driven step advancement (wheel events) ────────────── */

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      const cur = activeRef.current;

      // Ignore small deltas (trackpad noise)
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      // At boundary: let scroll pass through to snap to next/prev frame
      if (scrollingDown && cur >= stepCount - 1) return;
      if (scrollingUp && cur <= 0) return;

      // Consume scroll event — advance step instead
      e.preventDefault();
      e.stopPropagation();

      // Debounce rapid scrolls
      if (now - lastScrollTime.current < SCROLL_DEBOUNCE) return;
      lastScrollTime.current = now;

      if (scrollingDown) {
        setActive((prev) => Math.min(prev + 1, stepCount - 1));
      } else {
        setActive((prev) => Math.max(prev - 1, 0));
      }
      dismissHint();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [stepCount, dismissHint]);

  /* ── Touch-driven step advancement (mobile swipe) ─────────────── */

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;

      if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;

      const now = Date.now();
      const cur = activeRef.current;
      const swipingUp = deltaY > 0; // finger moves up = scroll down
      const swipingDown = deltaY < 0;

      // At boundary: let through
      if (swipingUp && cur >= stepCount - 1) return;
      if (swipingDown && cur <= 0) return;

      // Debounce
      if (now - lastScrollTime.current < SCROLL_DEBOUNCE) return;
      lastScrollTime.current = now;

      if (swipingUp) {
        setActive((prev) => Math.min(prev + 1, stepCount - 1));
      } else {
        setActive((prev) => Math.max(prev - 1, 0));
      }
      dismissHint();
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [stepCount, dismissHint]);

  /* ── Keyboard support (arrow keys when focused) ───────────────── */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setActive((prev) => Math.min(prev + 1, stepCount - 1));
        dismissHint();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setActive((prev) => Math.max(prev - 1, 0));
        dismissHint();
      }
    },
    [stepCount, dismissHint]
  );

  const currentStep = steps[active]!;
  const variant = currentStep.variant ?? "text";
  const isFirst = active === 0;
  const isLast = active === stepCount - 1;

  return (
    <div
      ref={containerRef}
      className={`rounded-lg border border-border bg-panel overflow-hidden ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Workflow trace — scroll or use arrow keys to navigate steps"
    >
      {/* Step indicators */}
      <div className="flex items-center border-b border-border overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {steps.map((step, idx) => {
          const isActive = idx === active;
          const isDone = idx < active;
          const icon = step.icon || STEP_ICONS_DEFAULT[step.label] || "";
          return (
            <button
              key={step.label}
              onClick={() => goTo(idx)}
              className={`flex items-center gap-1.5 px-3 py-3 text-sm font-mono whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? "border-accent text-accent bg-accent-muted"
                  : isDone
                  ? "border-transparent text-foreground-muted"
                  : "border-transparent text-foreground-dim"
              }`}
              aria-label={`Step ${idx + 1}: ${step.label}`}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="text-base">{icon}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          );
        })}

        {/* Reset + navigation hint */}
        <div className="ml-auto flex items-center gap-1">
          {/* Prev/Next buttons (always visible, especially useful on mobile) */}
          <button
            onClick={() => goTo(Math.max(active - 1, 0))}
            disabled={isFirst}
            className="px-2 py-3 text-xs font-mono text-foreground-dim hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-default"
            aria-label="Previous step"
          >
            &larr;
          </button>
          <span className="text-[10px] font-mono text-foreground-dim">
            {active + 1}/{stepCount}
          </span>
          <button
            onClick={() => goTo(Math.min(active + 1, stepCount - 1))}
            disabled={isLast}
            className="px-2 py-3 text-xs font-mono text-foreground-dim hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-default"
            aria-label="Next step"
          >
            &rarr;
          </button>
          <button
            onClick={reset}
            className="px-3 py-3 text-xs font-mono text-foreground-dim hover:text-foreground-muted transition-colors"
            aria-label="Reset trace"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduced ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="p-5"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-mono text-foreground-dim">
                Step {active + 1}/{stepCount}
              </span>
              <span className="text-xs font-mono text-accent">
                {currentStep.label}
              </span>
            </div>
            {currentStep.description && (
              <div className="hidden sm:block mb-3 rounded bg-accent-muted/30 border border-accent/20 px-3 py-2">
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {currentStep.description}
                </p>
              </div>
            )}
            <StepContent content={currentStep.content} variant={variant} />
          </motion.div>
        </AnimatePresence>

        {/* Scroll hint overlay (auto-dismisses) */}
        {showScrollHint && !reduced && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 border border-border backdrop-blur-sm pointer-events-none"
          >
            <span className="text-[10px] font-mono text-foreground-dim">
              Scroll to explore steps
            </span>
            <motion.span
              animate={{ y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-accent text-xs"
            >
              &#8595;
            </motion.span>
          </motion.div>
        )}
      </div>

      {/* Progress bar (static, based on current step) */}
      <div className="flex h-1 bg-background-muted">
        {steps.map((_, idx) => (
          <div key={idx} className="flex-1 relative">
            {idx <= active && (
              <div className="absolute inset-0 bg-accent" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Step content renderer ─────────────────────────────────────────── */

function StepContent({
  content,
  variant,
}: {
  content: string;
  variant: "diff" | "terminal" | "text";
}) {
  if (variant === "diff") {
    return (
      <pre className="text-xs sm:text-sm leading-relaxed overflow-x-auto max-h-[180px] sm:max-h-none overflow-y-auto">
        <code className="block w-max min-w-full">
          {content.split("\n").map((line, i) => {
            let color = "text-foreground-muted";
            if (line.startsWith("+")) color = "text-success";
            else if (line.startsWith("-")) color = "text-error";
            else if (line.startsWith("//") || line.startsWith("#"))
              color = "text-foreground-dim";
            return (
              <span key={i} className={`block ${color}`}>
                {line}
              </span>
            );
          })}
        </code>
      </pre>
    );
  }

  if (variant === "terminal") {
    return (
      <pre className="text-xs sm:text-sm leading-relaxed overflow-x-auto max-h-[180px] sm:max-h-none overflow-y-auto font-mono">
        <code className="block w-max min-w-full">
          {content.split("\n").map((line, i) => {
            let color = "text-foreground-muted";
            if (line.includes("PASS") || line.includes("\u2713") || line.includes("passing"))
              color = "text-success";
            else if (line.includes("FAIL") || line.includes("\u2717") || line.includes("error"))
              color = "text-error";
            else if (line.startsWith("[") || line.includes("Coverage"))
              color = "text-accent";
            return (
              <span key={i} className={`block ${color}`}>
                {line}
              </span>
            );
          })}
        </code>
      </pre>
    );
  }

  // Default: text
  return (
    <pre className="text-xs sm:text-sm leading-relaxed overflow-x-auto max-h-[180px] sm:max-h-none overflow-y-auto whitespace-pre-wrap">
      <code className="text-foreground-muted">{content}</code>
    </pre>
  );
}
