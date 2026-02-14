"use client";

import { useState, useCallback, type ReactNode } from "react";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { FadeIn } from "@/components/ui/FadeIn";
import { LazyLoad } from "@/components/ui/LazyLoad";
import { TraceView } from "@/components/shared/TraceView";
import { MetricWidget } from "@/components/shared/MetricWidget";
import type { HeroStory as HeroStoryData } from "@/lib/stories";

interface HeroStoryProps {
  story: HeroStoryData;
  /** Optional interactive demo element rendered in its own snap frame. */
  interactive?: ReactNode;
}

/**
 * Hero story rendered as 2–3 full-viewport snap frames:
 *   Frame 1: Header (who / problem)
 *   Frame 2: Trace + Metric (+ source if no interactive)
 *   Frame 3: Interactive + Source (only when interactive exists)
 */
export function HeroStory({ story, interactive }: HeroStoryProps) {
  const muted = story.index % 2 === 1;
  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = useCallback((step: number) => {
    setActiveStep(step);
  }, []);

  // Use step-specific metric if available, otherwise fall back to story metric
  const currentMetric =
    story.stepMetrics?.[activeStep] ?? story.metric;

  return (
    <>
      {/* ── Frame 1: Header ─────────────────────────────────── */}
      <ScrollSection id={story.id} muted={muted}>
        <FadeIn>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-mono text-accent mb-4">
              Hero Story {story.index}
            </p>
            <h2 className="mb-6">{story.title}</h2>
            <div className="grid gap-6 sm:grid-cols-2 max-w-3xl">
              <div>
                <h4 className="text-foreground-dim text-sm mb-1">Who</h4>
                <p className="text-foreground-muted">{story.who}</p>
              </div>
              <div>
                <h4 className="text-foreground-dim text-sm mb-1">The Problem</h4>
                <p className="text-foreground-muted">{story.problem}</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </ScrollSection>

      {/* ── Frame 2: Trace + Metric ────────────────────────── */}
      <ScrollSection id={`${story.id}-trace`} muted={muted}>
        <FadeIn>
          <p className="text-sm font-mono text-accent mb-4">{story.title}</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <TraceView steps={story.trace} onStepChange={handleStepChange} />
            <div className="hidden lg:block">
              <MetricWidget data={currentMetric} />
            </div>
          </div>
        </FadeIn>
        {!interactive && (
          <FadeIn delay={0.2}>
            <p className="mt-6 text-xs text-foreground-dim">
              {story.source.label}
            </p>
          </FadeIn>
        )}
      </ScrollSection>

      {/* ── Frame 3: Interactive + Source (conditional) ──── */}
      {interactive && (
        <ScrollSection id={`${story.id}-interactive`} muted={muted}>
          <FadeIn>
            <p className="text-sm font-mono text-accent mb-4">{story.title}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <LazyLoad
              rootMargin="400px"
              fallback={
                <div className="w-full h-64 rounded-lg bg-panel border border-border animate-pulse" />
              }
            >
              {interactive}
            </LazyLoad>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-xs text-foreground-dim">
              {story.source.label}
            </p>
          </FadeIn>
        </ScrollSection>
      )}
    </>
  );
}
