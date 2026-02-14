"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ReactNode } from "react";

interface ScrollSectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Use muted background instead of default. */
  muted?: boolean;
}

/**
 * Full-screen scroll-snap section with scroll-linked parallax transforms.
 *
 * As the section enters from below it scales up, fades in, and rises;
 * as it exits above it scales down and fades slightly. A subtle rotateX
 * adds depth perception (requires transformPerspective).
 *
 * Reduced-motion: static rendering, no transforms.
 */
export function ScrollSection({
  id,
  children,
  className = "",
  muted = false,
}: ScrollSectionProps) {
  const reduced = useReducedMotion();
  const bg = muted ? "bg-background-muted" : "bg-background";
  const ref = useRef<HTMLElement>(null);

  /* ── Scroll-linked transforms ──────────────────────────────────── */

  const { scrollYProgress } = useScroll({
    target: ref,
    // 0 = element top hits viewport bottom (entering)
    // 1 = element bottom hits viewport top  (exited)
    offset: ["start end", "end start"],
  });

  // Plateau from 0.3–0.7 keeps section stable when snapped in view
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [0.93, 1, 1, 1, 0.96]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [50, 0, 0, 0, -30]
  );
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [2, 0, 0, 0, -1]
  );

  const inner = (
    <div className="mx-auto my-auto w-full max-w-6xl px-[var(--section-pad-x)] py-[var(--section-pad-y)]">
      {children}
    </div>
  );

  if (reduced) {
    return (
      <section
        id={id}
        ref={ref}
        className={`relative min-h-[100dvh] flex flex-col overflow-y-auto ${bg} ${className}`}
        style={{ scrollSnapAlign: "start" }}
      >
        {inner}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      ref={ref}
      className={`relative min-h-[100dvh] flex flex-col overflow-y-auto ${bg} ${className}`}
      style={{
        scrollSnapAlign: "start",
        scale,
        y,
        rotateX,
        transformPerspective: 1200,
        willChange: "transform",
      }}
    >
      {inner}
    </motion.section>
  );
}
