"use client";

import { ScrollSection } from "@/components/ui/ScrollSection";
import { FadeIn } from "@/components/ui/FadeIn";
import { vignettes, type Vignette } from "@/lib/vignettes";

/* ── Persona icons (monospace glyphs per role) ───────────────────── */

const PERSONA_ICONS: Record<string, string> = {
  "Product Manager": "PM",
  "Full-Stack Engineer": "FS",
  "Data Scientist": "DS",
  "Platform Team Lead": "TL",
};

const PERSONA_COLORS: Record<string, string> = {
  "Product Manager": "from-accent/20 to-accent/5",
  "Full-Stack Engineer": "from-success/20 to-success/5",
  "Data Scientist": "from-purple-500/20 to-purple-500/5",
  "Platform Team Lead": "from-blue-500/20 to-blue-500/5",
};

const PERSONA_ACCENT: Record<string, string> = {
  "Product Manager": "text-accent border-accent/30",
  "Full-Stack Engineer": "text-success border-success/30",
  "Data Scientist": "text-purple-400 border-purple-400/30",
  "Platform Team Lead": "text-blue-400 border-blue-400/30",
};

/* ── Component ───────────────────────────────────────────────────── */

export function Vignettes() {
  return (
    <ScrollSection id="vignettes" muted>
      <FadeIn>
        <p className="text-sm font-mono text-accent mb-3">
          More builders, more stories
        </p>
        <h2 className="mb-2">Vignettes</h2>
        <p className="text-foreground-muted max-w-xl mb-8 sm:mb-10">
          Quick stories showing the breadth of what becomes possible when the
          barrier to building collapses.
        </p>
      </FadeIn>

      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
        {vignettes.map((v, i) => (
          <FadeIn key={v.id} delay={0.08 * (i + 1)}>
            <div className={i >= 2 ? "hidden sm:block" : undefined}>
              <VignetteCard vignette={v} />
            </div>
          </FadeIn>
        ))}
      </div>
    </ScrollSection>
  );
}

/* ── Card sub-component ──────────────────────────────────────────── */

function VignetteCard({ vignette }: { vignette: Vignette }) {
  const icon = PERSONA_ICONS[vignette.who] ?? "??";
  const gradient = PERSONA_COLORS[vignette.who] ?? "from-accent/20 to-accent/5";
  const accent = PERSONA_ACCENT[vignette.who] ?? "text-accent border-accent/30";

  return (
    <div className="rounded-lg border border-border bg-panel overflow-hidden flex flex-col h-full">
      {/* Gradient header strip */}
      <div className={`bg-gradient-to-r ${gradient} px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3`}>
        {/* Persona badge */}
        <span
          className={`flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg border font-mono text-xs sm:text-sm font-bold bg-panel ${accent}`}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h4 className="text-sm sm:text-base font-semibold text-foreground truncate">
            {vignette.title}
          </h4>
          <p className="text-[11px] sm:text-xs font-mono text-foreground-dim">
            {vignette.who}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 sm:px-5 sm:py-4 flex flex-col gap-3 flex-1">
        <p className="text-xs sm:text-sm leading-relaxed text-foreground-muted">
          {vignette.summary}
        </p>

        {/* Outcome callout */}
        <div className="bg-code-bg rounded-md px-3 py-2 border border-border">
          <p className="text-[11px] sm:text-xs text-foreground-muted">
            <span className="text-accent font-medium">Outcome:</span>{" "}
            {vignette.outcome}
          </p>
        </div>

        {/* Source */}
        <p className="text-[10px] sm:text-[11px] text-foreground-dim mt-auto">
          {vignette.source.label}
        </p>
      </div>
    </div>
  );
}
