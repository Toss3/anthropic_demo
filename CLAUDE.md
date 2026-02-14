# Claude In The Loop (Project Context)

## What We Are Building

An interactive, scrollytelling web experience that demonstrates how Claude Code
collapses the barrier to building software.

The site is designed like a real production marketing + sales enablement asset:
- Deep, hands-on interactive demos (not just claims).
- "Real-work artifacts" (diffs, terminal output, PR text) so it feels operational, not magical.
- Multiple audience lenses (Developer, Engineering Manager, Executive/Security).

Core thesis (keep consistent across all copy and visuals):
- The barrier to building just collapsed.
- Claude Code does not just make engineers faster; it enables new categories of builders.

## Why We Are Building It

This project is a portfolio-grade demo for Anthropic-style technical product marketing:
it proves technical depth and narrative craft in the same artifact.

## How We Are Building It

Tech stack:
- Next.js (App Router)
- Tailwind CSS
- Framer Motion (scroll-triggered transitions)
- Recharts (preferred over D3 for bundle size/simplicity)
- Claude API integration with a strict demo-mode fallback (no API key required)
- Deploy: Vercel

Operating modes:
- Demo mode (default): no API key required; all interactives use canned outputs.
- Live mode (optional): enabled only when a Claude API key is present.
- UI must always label the current mode honestly.

Performance + UX constraints:
- Target Lighthouse 90+.
- Heavy components must be dynamically imported and/or rendered only when in viewport.
- Fully responsive (desktop-first; mobile degrades gracefully).
- Every interactive must have a one-click reset.
- Respect `prefers-reduced-motion`.

Scroll-snap architecture (non-negotiable):
- The site uses CSS `scroll-snap-type: y mandatory` on `html` for full-viewport snapping.
- Each section/frame has `scroll-snap-align: start` and `min-h-[100dvh]`.
- Hero stories are split into 2-3 snap frames: Header → Trace+Metric → Interactive+Source.
- Scrolling advances one full-viewport frame at a time through the narrative.
- On mobile, frames that overflow vertically use `overflow-y: auto` for internal scrolling.
- `prefers-reduced-motion` disables snap (`scroll-snap-type: none`) for free-scroll fallback.
- Key files: `globals.css` (snap on html), `ScrollSection.tsx` (snap-align), `HeroStory.tsx` (frame splitting).
- Do NOT remove or break this architecture — it is the core navigation model.

Spacing + layout constraints (non-negotiable):
- Generous whitespace everywhere. Text and elements must never overlap or crowd each other.
- All content must fit within its viewport/container — no clipping, no overflow hiding important content.
- On mobile, check that stacked elements have sufficient vertical spacing and that nothing is cut off.
- Interactive panels, code blocks, and cards need breathing room (padding + margin) on all sides.
- When validating with Playwright, actively check for spacing issues: text touching borders,
  elements too close together, content extending beyond its container.

## Visual Direction (Do Not Drift)

Style keywords: clean, minimal, dark-mode primary, generous whitespace, large type,
warm amber/orange accent, crisp code/terminal visuals.

Motion guidelines:
- Motion must serve the narrative (no decorative micro-animations).
- Prefer scroll-triggered reveals and sequence-based storytelling.
- Provide reduced-motion fallbacks that still communicate structure.

Credibility guidelines:
- Synthetic metrics/data are allowed but must be labeled as illustrative.
- Source attributions are part of the experience (per story/vignette).

## Workflow Rules (One Ticket At A Time)

This repo is intentionally built using a strict ticket workflow.

Rules:
- Pick exactly one ticket from `PLANNED_SPRINTS.md`.
- Implement it fully (including validation).
- Do not start a second ticket in the same session.
- End of session: update `HANDOVER.md` with:
  - the ticket completed
  - what changed (files/behavior)
  - the single next ticket to do next session

Definition of Done (per ticket):
- Acceptance criteria met.
- Demo mode behavior correct.
- Mobile check complete (no overflow, no overlap, sufficient spacing).
- Reduced motion check complete.
- Spacing/whitespace check complete (no crowded elements, no clipped content).
- No obvious perf regressions (avoid rendering heavy content offscreen).

## Testing Expectations

Use Playwright for smoke coverage when it becomes useful (Sprint 9):
- Page loads.
- Key sections render.
- Basic scroll-through works on desktop and mobile viewports.

Manual checks that must happen frequently:
- Desktop and mobile layout.
- Demo mode labeling.
- Reset behavior on interactives.
- Reduced motion behavior.

## Tooling Available To Claude Code

- Playwright MCP: use for real-browser validation (snapshots, scroll flows, responsiveness).
- Frontend design skill: use to keep the site visually distinctive and non-generic while
  staying within the project's visual direction.

## Content/Section Structure (Target)

1. Hero opening frame (thesis, minimal visual).
2-5. Four hero stories (each: Who, Problem, Trace View, Interactive, Metric, Source).
6. Vignettes (2-4 quick stories, source-linked).
7. Audience perspectives (tabs: Developer/Manager/Exec-Security).
8. Sales story builder (stretch goal; ship only if everything else is polished).
9. Closing frame (callback + why + meta proof point).

## Component Canon

These components are first-class and reused:
- TraceView: step-by-step workflow artifact viewer (Understand/Plan/Edit/Test/Ship).
- DemoModeIndicator: persistent honest label.
- MetricWidget: compact chart/callout for impact metrics.

## Notes For Agents/Contributors

- If in doubt, cut scope; polish beats breadth.
- Hero stories are priority; Sales Story Builder is optional.
- Do not add complex libraries unless clearly justified (bundle size matters).
- Keep file/prop names boring and explicit; keep the magic in the experience, not the code.
