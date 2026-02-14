"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

interface LazyLoadProps {
  children: ReactNode;
  /** Placeholder shown before the component enters viewport */
  fallback?: ReactNode;
  /** How far before viewport entry to start rendering (default: 200px) */
  rootMargin?: string;
  className?: string;
}

/**
 * Viewport-gated renderer. Children mount only when the wrapper
 * enters (or is about to enter) the viewport. Once mounted, stays mounted.
 */
export function LazyLoad({
  children,
  fallback = null,
  rootMargin = "200px",
  className,
}: LazyLoadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : fallback}
    </div>
  );
}
