"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { heroStories } from "@/lib/stories";

/* ── Story thumbnail icons (mapped by index) ─────────────────────── */

const storyIcons: Record<number, string> = {
  1: "{}",   // CLAUDE.md
  2: "✓",    // Testing
  3: "⇌",    // MCP
  4: "△",    // Legacy
};

const storyAccents: Record<number, string> = {
  1: "var(--accent)",
  2: "var(--success)",
  3: "var(--accent)",
  4: "var(--foreground-muted)",
};

/* ── Animation variants ──────────────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

const EASE_OUT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/* ── Component ───────────────────────────────────────────────────── */

export function Closing() {
  const reduced = useReducedMotion();

  const stories = heroStories.map((s) => ({
    id: s.id,
    index: s.index,
    title: s.title,
    who: s.who,
  }));

  return (
    <section
      id="closing"
      className="relative min-h-[100dvh] flex flex-col overflow-y-auto bg-background"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative z-10 w-full max-w-4xl mx-auto my-auto px-[var(--section-pad-x)] py-[var(--section-pad-y)] pb-16 text-center">
        {/* ── Visual pullback: story thumbnail grid ────────── */}
        {reduced ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-10 max-w-2xl mx-auto">
            {stories.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group rounded-lg border border-border bg-panel p-3 sm:p-4 text-left transition-colors hover:border-border-bright"
              >
                <span
                  className="block text-base sm:text-lg font-mono mb-1 sm:mb-2"
                  style={{ color: storyAccents[s.index] }}
                >
                  {storyIcons[s.index]}
                </span>
                <span className="block text-xs sm:text-sm font-medium text-foreground leading-tight">
                  {s.title}
                </span>
                <span className="hidden sm:block text-xs text-foreground-dim mt-1">
                  {s.who.split(" ").slice(0, 4).join(" ")}...
                </span>
              </a>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-10 max-w-2xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
          >
            {stories.map((s) => (
              <motion.a
                key={s.id}
                href={`#${s.id}`}
                className="group rounded-lg border border-border bg-panel p-3 sm:p-4 text-left transition-colors hover:border-border-bright"
                variants={cardVariants}
              >
                <span
                  className="block text-base sm:text-lg font-mono mb-1 sm:mb-2"
                  style={{ color: storyAccents[s.index] }}
                >
                  {storyIcons[s.index]}
                </span>
                <span className="block text-xs sm:text-sm font-medium text-foreground leading-tight">
                  {s.title}
                </span>
                <span className="hidden sm:block text-xs text-foreground-dim mt-1">
                  {s.who.split(" ").slice(0, 4).join(" ")}...
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* ── Thesis callback ──────────────────────────────── */}
        {reduced ? (
          <>
            <h2 className="mb-4">
              The barrier to building
              <br />
              <span className="text-accent">just collapsed</span>
            </h2>
            <p className="text-foreground-muted max-w-xl mx-auto mb-6 leading-relaxed">
              Every story above is evidence of the same shift: Claude Code
              changes who can build software and what they can build.
            </p>
          </>
        ) : (
          <>
            <motion.h2
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT }}
            >
              The barrier to building
              <br />
              <span className="text-accent">just collapsed</span>
            </motion.h2>
            <motion.p
              className="text-foreground-muted max-w-xl mx-auto mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT }}
            >
              Every story above is evidence of the same shift: Claude Code
              changes who can build software and what they can build.
            </motion.p>
          </>
        )}

        {/* ── Divider ──────────────────────────────────────── */}
        <div className="w-12 h-px bg-border-bright mx-auto mb-4 sm:mb-6" />

        {/* ── Personal note + meta proof point ─────────────── */}
        {reduced ? (
          <div className="space-y-4">
            <p className="text-foreground-dim text-sm max-w-lg mx-auto leading-relaxed">
              This site is itself proof of the thesis. Built as a solo project
              using Claude Code &mdash; from planning to deployment &mdash; to
              demonstrate what becomes possible when the barrier to building
              collapses.
            </p>
            <p className="text-sm font-mono text-accent">
              Built with Claude Code
            </p>
            <p className="text-xs text-foreground-dim">
              <a
                href="https://github.com/Toss3/anthropic_demo"
                className="underline underline-offset-4 hover:text-foreground-muted transition-colors"
              >
                View source on GitHub
              </a>
            </p>
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <p className="text-foreground-dim text-sm max-w-lg mx-auto leading-relaxed">
              This site is itself proof of the thesis. Built as a solo project
              using Claude Code &mdash; from planning to deployment &mdash; to
              demonstrate what becomes possible when the barrier to building
              collapses.
            </p>
            <p className="text-sm font-mono text-accent">
              Built with Claude Code
            </p>
            <p className="text-xs text-foreground-dim">
              <a
                href="https://github.com/Toss3/anthropic_demo"
                className="underline underline-offset-4 hover:text-foreground-muted transition-colors"
              >
                View source on GitHub
              </a>
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
