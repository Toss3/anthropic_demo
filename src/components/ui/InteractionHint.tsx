"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface InteractionHintProps {
  children: ReactNode;
  /** Short instruction shown as overlay */
  hint: string;
  /** Delay before showing hint (ms) */
  delay?: number;
  /** How long the hint stays visible (ms) */
  duration?: number;
}

/**
 * Wraps an interactive component with a floating hint overlay.
 * Hint appears when the wrapper enters viewport, auto-dismisses after
 * `duration` ms, and dismisses immediately on any user interaction.
 */
export function InteractionHint({
  children,
  hint,
  delay = 800,
  duration = 4000,
}: InteractionHintProps) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (dismissed) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t1 = setTimeout(() => setVisible(true), delay);
          const t2 = setTimeout(() => {
            setVisible(false);
            setDismissed(true);
          }, delay + duration);
          timers.current = [t1, t2];
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.current.forEach(clearTimeout);
    };
  }, [delay, duration, dismissed]);

  const dismiss = () => {
    if (!dismissed) {
      setVisible(false);
      setDismissed(true);
      timers.current.forEach(clearTimeout);
    }
  };

  return (
    <div ref={ref} className="relative" onPointerDown={dismiss}>
      {children}
      <AnimatePresence>
        {visible && !dismissed && (
          reduced ? (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full border border-accent/40 text-xs text-accent font-mono shadow-lg">
                {hint}
              </div>
            </div>
          ) : (
            <motion.div
              className="absolute bottom-4 left-1/2 z-20 pointer-events-none"
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -6, x: "-50%" }}
              transition={{ duration: 0.35 }}
            >
              <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full border border-accent/40 text-xs text-accent font-mono shadow-lg flex items-center gap-2">
                <span className="inline-block animate-pulse">&#9757;</span>
                {hint}
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
