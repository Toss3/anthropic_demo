"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { FadeIn } from "@/components/ui/FadeIn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  generateTalkTrack,
  AUDIENCES,
  INDUSTRIES,
  GOALS,
  type Audience,
  type Industry,
  type Goal,
} from "@/lib/talkTracks";

/* ── Pill selector group ─────────────────────────────────────────────── */

function PillGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  reduced,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  reduced: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-mono text-foreground-dim mb-1.5">
        {label}
      </p>
      <div className="flex flex-wrap gap-1 p-1 bg-panel rounded-lg border border-border">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`relative px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
              value === opt.value
                ? "text-foreground"
                : "text-foreground-dim hover:text-foreground-muted"
            }`}
          >
            {value === opt.value && (
              <motion.div
                layoutId={reduced ? undefined : `pill-${label}`}
                className="absolute inset-0 bg-background-muted border border-border-bright rounded-md"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────────────── */

export function SalesBuilder() {
  const reduced = useReducedMotion();

  const [audience, setAudience] = useState<Audience>("developer");
  const [industry, setIndustry] = useState<Industry>("saas");
  const [goal, setGoal] = useState<Goal>("ship-faster");

  const result = generateTalkTrack(audience, industry, goal);

  const reset = useCallback(() => {
    setAudience("developer");
    setIndustry("saas");
    setGoal("ship-faster");
  }, []);

  const isDefault =
    audience === "developer" && industry === "saas" && goal === "ship-faster";

  return (
    <ScrollSection id="sales-builder">
      <FadeIn>
        <p className="text-sm font-mono text-accent mb-2 sm:mb-3">
          Sales enablement
        </p>
        <h2 className="mb-1 sm:mb-2">Build a Talk Track</h2>
        <p className="text-foreground-muted max-w-xl text-sm sm:text-base mb-4 sm:mb-5">
          Choose your audience, industry, and goal — get a tailored demo path
          with proof points you can use in the next conversation.
        </p>
      </FadeIn>

      {/* ── Selectors ─────────────────────────────────────────────── */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5">
          <PillGroup
            label="Audience"
            options={AUDIENCES}
            value={audience}
            onChange={setAudience}
            reduced={reduced}
          />
          <PillGroup
            label="Industry"
            options={INDUSTRIES}
            value={industry}
            onChange={setIndustry}
            reduced={reduced}
          />
          <PillGroup
            label="Goal"
            options={GOALS}
            value={goal}
            onChange={setGoal}
            reduced={reduced}
          />
        </div>

        {/* Reset */}
        {!isDefault && (
          <button
            onClick={reset}
            className="text-xs font-mono text-foreground-dim hover:text-foreground-muted transition-colors mb-3 sm:mb-4"
          >
            ↺ Reset
          </button>
        )}
      </FadeIn>

      {/* ── Output panel ──────────────────────────────────────────── */}
      <FadeIn delay={0.15}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${audience}-${industry}-${goal}`}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-panel border border-border rounded-lg p-4 sm:p-5"
          >
            {/* Talk track pitch */}
            <div className="mb-4">
              <p className="text-[11px] font-mono text-accent mb-2">
                Talk track
              </p>
              <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
                {result.pitch}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Demo path */}
              <div>
                <p className="text-[11px] font-mono text-accent mb-2">
                  Demo path — show them
                </p>
                <ol className="space-y-2">
                  {result.demoPath.map((step, i) => (
                    <li key={step.anchor + i} className="flex gap-2">
                      <span className="text-xs font-mono text-foreground-dim mt-0.5 shrink-0">
                        {i + 1}.
                      </span>
                      <a
                        href={`#${step.anchor}`}
                        className="text-sm text-foreground-muted hover:text-accent transition-colors underline underline-offset-4 decoration-border-bright hover:decoration-accent"
                      >
                        {step.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Proof points */}
              <div>
                <p className="text-[11px] font-mono text-accent mb-2">
                  Proof points
                </p>
                <ul className="space-y-2">
                  {result.proofPoints.map((point, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-accent mt-0.5 shrink-0">•</span>
                      <span className="text-sm text-foreground-muted">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Illustrative label */}
            <p className="text-[10px] text-foreground-dim font-mono mt-4">
              Illustrative data
            </p>
          </motion.div>
        </AnimatePresence>
      </FadeIn>
    </ScrollSection>
  );
}
