"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── Deterministic PRNG (mulberry32) ─────────────────────────────── */

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Constellation types + generation ────────────────────────────── */

interface StarNode {
  id: number;
  cx: number; // 0–100 (%)
  cy: number;
  r: number; // px
  opacity: number;
  accent: boolean;
  dx: number; // drift %
  dy: number;
  dx2: number; // second waypoint drift %
  dy2: number;
  dur: number; // seconds
}

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

const NODE_COUNT = 36;
const EDGE_THRESHOLD = 20;

function buildConstellation(): { stars: StarNode[]; edges: Edge[] } {
  const rand = mulberry32(7);

  const stars: StarNode[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
    id: i,
    cx: 5 + rand() * 90,
    cy: 5 + rand() * 90,
    r: 1.5 + rand() * 2.5,
    opacity: 0.15 + rand() * 0.45,
    accent: rand() < 0.3,
    dx: (rand() - 0.5) * 10,
    dy: (rand() - 0.5) * 10,
    dx2: (rand() - 0.5) * 8,
    dy2: (rand() - 0.5) * 8,
    dur: 6 + rand() * 10,
  }));

  const edges: Edge[] = [];
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const ddx = stars[i].cx - stars[j].cx;
      const ddy = stars[i].cy - stars[j].cy;
      const d = Math.sqrt(ddx * ddx + ddy * ddy);
      if (d < EDGE_THRESHOLD) {
        edges.push({
          x1: stars[i].cx,
          y1: stars[i].cy,
          x2: stars[j].cx,
          y2: stars[j].cy,
          opacity: 0.08 * (1 - d / EDGE_THRESHOLD),
        });
      }
    }
  }

  return { stars, edges };
}

/* ── Easing ──────────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/* ── Component ───────────────────────────────────────────────────── */

export function Hero() {
  const reduced = useReducedMotion();
  const { stars, edges } = useMemo(() => buildConstellation(), []);

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-background"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* ── Constellation background ─────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {/* Connection lines */}
        {edges.map((e, i) => (
          <line
            key={`e${i}`}
            x1={`${e.x1}%`}
            y1={`${e.y1}%`}
            x2={`${e.x2}%`}
            y2={`${e.y2}%`}
            stroke="var(--accent)"
            strokeWidth="0.5"
            opacity={e.opacity}
          />
        ))}

        {/* Star nodes */}
        {stars.map((s) =>
          reduced ? (
            <circle
              key={s.id}
              cx={`${s.cx}%`}
              cy={`${s.cy}%`}
              r={s.r}
              fill={s.accent ? "var(--accent)" : "var(--foreground)"}
              opacity={s.opacity * 0.5}
            />
          ) : (
            <motion.circle
              key={s.id}
              r={s.r}
              fill={s.accent ? "var(--accent)" : "var(--foreground)"}
              initial={{ opacity: 0, cx: `${s.cx}%`, cy: `${s.cy}%` }}
              animate={{
                opacity: [0, s.opacity, s.opacity * 0.5, s.opacity * 0.8, s.opacity],
                cx: [`${s.cx}%`, `${s.cx + s.dx}%`, `${s.cx + s.dx2}%`, `${s.cx - s.dx * 0.3}%`, `${s.cx}%`],
                cy: [`${s.cy}%`, `${s.cy + s.dy}%`, `${s.cy + s.dy2}%`, `${s.cy - s.dy * 0.3}%`, `${s.cy}%`],
              }}
              transition={{
                duration: s.dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: s.id * 0.04,
              }}
            />
          )
        )}
      </svg>

      {/* ── Radial vignette (fades constellation toward edges) ──── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, var(--background) 100%)",
        }}
      />

      {/* ── Text content ─────────────────────────────────── */}
      <div className="relative z-10 text-center px-[var(--section-pad-x)] max-w-4xl mx-auto my-auto">
        {reduced ? (
          <>
            <p className="text-sm font-mono text-accent mb-6 tracking-widest uppercase">
              Claude in the Loop
            </p>
            <h1 className="mb-6">
              The barrier to building
              <br />
              <span className="text-accent">just collapsed</span>
            </h1>
            <p className="text-foreground-muted text-lg max-w-2xl mx-auto leading-relaxed">
              Claude Code doesn&apos;t just make engineers faster&mdash;it
              enables entirely new categories of builders. Scroll to see how.
            </p>
            <div className="mt-16 text-foreground-dim text-sm">&#8595;</div>
          </>
        ) : (
          <>
            {/* Eyebrow */}
            <motion.p
              className="text-sm font-mono text-accent mb-6 tracking-widest uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Claude in the Loop
            </motion.p>

            {/* Headline */}
            <motion.h1
              className="mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE_OUT }}
            >
              The barrier to building
              <br />
              <span className="text-accent">just collapsed</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="text-foreground-muted text-lg max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: EASE_OUT }}
            >
              Claude Code doesn&apos;t just make engineers faster&mdash;it
              enables entirely new categories of builders. Scroll to see how.
            </motion.p>

            {/* Scroll cue */}
            <motion.div
              className="mt-16 text-foreground-dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 6, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: 1.2 },
                y: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                },
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <path d="M10 3v14M4 11l6 6 6-6" />
              </svg>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
