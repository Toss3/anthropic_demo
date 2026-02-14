"use client";

import { useActiveSection } from "@/hooks/useActiveSection";

interface SubSection {
  id: string;
  label: string;
}

interface NavSection {
  id: string;
  label: string;
  subSections?: SubSection[];
}

const SECTIONS: NavSection[] = [
  { id: "hero", label: "Intro" },
  {
    id: "story-claudemd",
    label: "CLAUDE.md",
    subSections: [
      { id: "story-claudemd-trace", label: "Trace" },
      { id: "story-claudemd-interactive", label: "Interactive" },
    ],
  },
  {
    id: "story-testing",
    label: "Testing",
    subSections: [
      { id: "story-testing-trace", label: "Trace" },
      { id: "story-testing-interactive", label: "Interactive" },
    ],
  },
  {
    id: "story-mcp",
    label: "MCP",
    subSections: [
      { id: "story-mcp-trace", label: "Trace" },
      { id: "story-mcp-interactive", label: "Interactive" },
    ],
  },
  {
    id: "story-legacy",
    label: "Legacy",
    subSections: [
      { id: "story-legacy-trace", label: "Trace" },
      { id: "story-legacy-interactive", label: "Interactive" },
    ],
  },
  { id: "vignettes", label: "Vignettes" },
  { id: "perspectives", label: "Perspectives" },
  { id: "sales-builder", label: "Talk Track" },
  { id: "closing", label: "Closing" },
];

/** All section IDs flattened for tracking. */
const allIds = SECTIONS.flatMap((s) =>
  s.subSections ? [s.id, ...s.subSections.map((sub) => sub.id)] : [s.id]
);

/** Map any sub-section ID back to its parent section ID. */
const parentMap = new Map<string, string>();
for (const s of SECTIONS) {
  parentMap.set(s.id, s.id);
  if (s.subSections) {
    for (const sub of s.subSections) {
      parentMap.set(sub.id, s.id);
    }
  }
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Grouped dot-nav fixed to the right edge.
 * Shows sub-dots for the currently active story group.
 * Hidden on mobile to save space.
 */
export function SectionNav() {
  const activeId = useActiveSection(allIds);
  const activeParent = parentMap.get(activeId) ?? "";

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-4 top-1/2 z-40 -translate-y-1/2 hidden lg:flex flex-col gap-2"
    >
      {SECTIONS.map(({ id, label, subSections }) => {
        const isParentActive = activeParent === id;
        const isExactActive = activeId === id;

        return (
          <div key={id} className="flex flex-col items-end gap-1.5">
            {/* Main dot */}
            <button
              onClick={() => scrollTo(id)}
              aria-label={label}
              title={label}
              className="group flex items-center gap-2 justify-end"
            >
              <span
                className={`text-xs font-mono transition-opacity ${
                  isParentActive
                    ? "opacity-100 text-accent"
                    : "opacity-0 group-hover:opacity-100 text-foreground-muted"
                }`}
              >
                {label}
              </span>
              <span
                className={`block rounded-full transition-all ${
                  isExactActive
                    ? "h-3 w-3 bg-accent"
                    : isParentActive
                      ? "h-2.5 w-2.5 bg-accent/50"
                      : "h-2 w-2 bg-border-bright group-hover:bg-foreground-muted"
                }`}
              />
            </button>

            {/* Sub-dots (only visible when this story group is active) */}
            {subSections && isParentActive && (
              <div className="flex flex-col items-end gap-1 mr-0.5">
                {subSections.map((sub) => {
                  const isSubActive = activeId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => scrollTo(sub.id)}
                      aria-label={sub.label}
                      title={sub.label}
                      className="group flex items-center gap-2 justify-end"
                    >
                      <span
                        className={`text-[10px] font-mono transition-opacity ${
                          isSubActive
                            ? "opacity-100 text-accent"
                            : "opacity-0 group-hover:opacity-100 text-foreground-dim"
                        }`}
                      >
                        {sub.label}
                      </span>
                      <span
                        className={`block rounded-full transition-all ${
                          isSubActive
                            ? "h-2 w-2 bg-accent"
                            : "h-1.5 w-1.5 bg-border-bright group-hover:bg-foreground-muted"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
