"use client";

import { useSyncExternalStore, useCallback } from "react";

/**
 * Tracks which section is currently most visible in the viewport
 * using IntersectionObserver via useSyncExternalStore.
 */
export function useActiveSection(sectionIds: string[]): string {
  const subscribe = useCallback(
    (callback: () => void) => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              currentId = entry.target.id;
              callback();
            }
          }
        },
        { threshold: 0.15 }
      );

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }

      return () => observer.disconnect();
    },
    [sectionIds]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

let currentId = "";

function getSnapshot() {
  return currentId;
}

function getServerSnapshot() {
  return "";
}
