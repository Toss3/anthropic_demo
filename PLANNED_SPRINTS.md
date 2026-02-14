# Planned Sprints (Claude In The Loop)

This repository will become an interactive scrollytelling demo site:
"Claude in the Loop: From Curiosity to Conviction".

Goal: a production-grade, stage-ready marketing + sales enablement asset that
demonstrates (with real-work artifacts) how Claude Code changes who can build
software and what they can build.

Non-negotiables (hold these throughout):
- Interactive demo site, not a static landing page.
- Demo mode must work with no API key (canned outputs everywhere).
- Performance: target Lighthouse 90+ (lazy-load, dynamic imports, render-on-view).
- Responsive: desktop-first, graceful mobile degradation.
- Trust: honest labeling ("Demo mode - using canned outputs" vs "Live mode - powered by Claude API").
- Style: clean, minimal, dark-mode primary, warm amber/orange accent, large type,
  generous whitespace, purposeful motion (respect prefers-reduced-motion).

Process rules:
- One ticket at a time (finish it completely before starting the next).
- Each ticket should be shippable and include validation (manual + Playwright where useful).
- End of every session: update `HANDOVER.md` with (1) ticket completed and
  (2) the exact next ticket to pick up.

Definition of Done (per ticket):
- Acceptance criteria met.
- Demo mode behavior is correct (even if the feature is "stubbed", it must be honest).
- Mobile layout checked.
- Reduced motion checked (`prefers-reduced-motion`).
- No obvious perf foot-guns introduced (avoid rendering heavy interactives offscreen).

---

## Sprint -1 - Planning (Completed)

### DOCS-001 - Project Planning + Workflow Docs (Completed 2026-02-14)
Acceptance criteria:
- `PLANNED_SPRINTS.md` exists and is ordered infrastructure -> features -> polish.
- `CLAUDE.md` exists and describes what/how/why + workflow rules.
- `HANDOVER.md` exists and is updated at end of session.

---

## Sprint 0 - Repo + App Foundation

### INF-001 - Scaffold Next.js App (App Router)
Acceptance criteria:
- Next.js app created in repo root using App Router + TypeScript.
- Tailwind configured and working.
- ESLint configured; optional Prettier if it improves consistency.
- Basic `src/` layout (use `src/app`).

### INF-002 - Visual System Baseline
Acceptance criteria:
- Global styles and design tokens (CSS variables) established for:
  - Background/foreground, accent, muted, border, code, panel colors
  - Type scale for headings/body
- One deliberate font choice (avoid default stacks); loaded responsibly.
- Dark-mode primary aesthetic implemented.

### INF-003 - Motion + Reduced Motion Guardrails
Acceptance criteria:
- Framer Motion installed and working in a small example.
- `prefers-reduced-motion` respected globally (animations reduced/disabled).
- A small utility/hook exists for motion gating.

### INF-004 - Demo/Live Mode Plumbing (No UI Yet)
Acceptance criteria:
- A single place to determine mode:
  - Demo mode by default (no key).
  - Live mode only if API key exists.
- A small library module exists to return either canned outputs or Claude API results.
- No secrets are required to run locally.

### INF-005 - CI/Quality Baseline (Lightweight)
Acceptance criteria:
- `npm run lint` works.
- `npm run build` works.
- A minimal GitHub Actions workflow exists (lint + build) if repo is intended to be public.

---

## Sprint 1 - Scrollytelling Shell

### SHELL-001 - Full-Screen Section Framework
Acceptance criteria:
- A `ScrollSection` (or equivalent) component exists for full-screen sections.
- Smooth transitions between sections (simple but intentional).
- Mobile stacks sections vertically without breaking.

### SHELL-002 - Main Page Skeleton (Sections 1-9 Placeholders)
Acceptance criteria:
- `src/app/page.tsx` composes the full narrative arc as placeholders:
  - Hero, 4 hero-story slots, vignettes, audience perspectives, (optional sales builder placeholder), closing
- Each section has an `id` and clear layout boundaries for later.

### SHELL-003 - Navigation/Progress (Minimal)
Acceptance criteria:
- Subtle scroll progress indicator or section index.
- Does not distract from narrative.

---

## Sprint 2 - Reusable Building Blocks

### COMP-001 - Demo Mode Indicator Component
Acceptance criteria:
- `DemoModeIndicator` shows:
  - "Demo mode - using canned outputs" when no API key
  - "Live mode - powered by Claude API" when API key present
- Placement is subtle and persistent (corner/badge).

### COMP-002 - Trace View (Reusable Workflow Artifact)
Acceptance criteria:
- `TraceView` supports the 5 steps:
  - Understand, Plan, Edit, Test, Ship
- Takes story-specific content via props/data.
- Steps animate in sequence with scroll-trigger or autoplay + manual override.
- Can render realistic artifacts: diffs, terminal output, PR text (mocked data ok).

### COMP-003 - Metric Widget (Reusable)
Acceptance criteria:
- A compact metric widget component exists and looks "stage-ready".
- Supports simple visualizations (bar/gauge/callout), using Recharts where relevant.

### COMP-004 - Content/Data Model
Acceptance criteria:
- A structured data model exists for hero stories and vignettes.
- Data is synthetic but realistic; clearly labeled as illustrative where needed.
- Sources/attributions are part of the model.

---

## Sprint 3 - Section 1 (Hero) + Section 9 (Closing)

### SEC1-001 - Hero Opening Frame
Acceptance criteria:
- Headline + subtext rendered in final typography direction.
- Minimal striking visual/animation (no interaction).
- Downward scroll cue.

### SEC9-001 - Closing Frame
Acceptance criteria:
- Callback to thesis + brief "why I built this" note.
- "Built in X days using Claude Code" placeholder.
- Link to repo placeholder.
- Visual pullback (grid/constellation of story thumbnails).

---

## Sprint 4 - Hero Story 1: The CLAUDE.md Effect

### HS1-001 - Story Section Wrapper + Trace View Instance
Acceptance criteria:
- A hero story wrapper layout exists ("Who / Problem / Trace / Interactive / Metric / Source").
- TraceView populated with HS1-specific content.

### HS1-002 - Interactive: Side-by-Side Compare (With vs Without CLAUDE.md)
Acceptance criteria:
- Two outcomes shown for the same prompt (canned outputs ok).
- Toggle view (split vs single) and "show context" for the CLAUDE.md snippet.
- One-click reset.

### HS1-003 - Metric: Iterations Saved
Acceptance criteria:
- A simple chart/callout showing iteration steps (e.g., 6 vs 2).
- Labeled as illustrative.

---

## Sprint 5 - Hero Story 2: Testing Transformation

### HS2-001 - Interactive: Before/After Coverage Panel
Acceptance criteria:
- Before/after test suite view (canned).
- Terminal-like test run animation tied to scroll or trigger.
- Coverage gauge (20% -> 87%) using Recharts or a custom lightweight gauge.

### HS2-002 - Trace + Metric + Source
Acceptance criteria:
- TraceView content reflects testing work.
- Metric widget includes "bugs caught" callout.
- Source attribution slot present.

---

## Sprint 6 - Hero Story 3: MCP Orchestration

### HS3-001 - Interactive: MCP Connection Diagram
Acceptance criteria:
- Node graph with Claude at center connected to Jira/Slack/GitHub/DB (visual-only is ok initially).
- Click any node to see "data in/out" + permissions note.
- Flow animation for the story path (synthetic).

### HS3-002 - Trace + Metric + Source
Acceptance criteria:
- TraceView shows context gathering -> fix -> update systems.
- Metric: context switches eliminated / minutes saved (illustrative).

---

## Sprint 7 - Hero Story 4: Legacy Modernization

### HS4-001 - Interactive: Incremental Diff Viewer
Acceptance criteria:
- Step-through refactor stages (click/scroll).
- Each stage shows what changed and why it is safe (tests/boundary).
- Emphasis: incremental, not a rewrite.

### HS4-002 - Trace + Metric + Source
Acceptance criteria:
- TraceView includes multi-commit safe merges (mock).
- Metric: complexity score down or "files touched per bug fix" down (illustrative).

---

## Sprint 8 - Vignettes + Audience Perspectives

### VIG-001 - Vignettes Section (2-4)
Acceptance criteria:
- Grid or horizontal scroll layout.
- Each vignette includes: visual placeholder, 3-4 sentences, source link.

### AUD-001 - Audience Perspectives Tabs
Acceptance criteria:
- Tabs for Developer / Engineering Manager / Executive-Security.
- Same underlying capability data presented differently per tab.
- Smooth layout transitions (Framer Motion).

### AUD-002 - Dashboards (Synthetic Data)
Acceptance criteria:
- Developer view: code-centric artifacts.
- Manager view: throughput/velocity dashboard (simple).
- Exec view: ROI + controls/permissions overview (simple).
- Clearly labeled as illustrative data.

---

## Sprint 9 - Polish, QA, Deploy

### POLISH-001 - Responsive Pass
Acceptance criteria:
- Desktop polish.
- Tablet adjustments (simplify parallax).
- Mobile: stack + touch-friendly, complex interactives degrade gracefully.

### POLISH-002 - Performance Pass
Acceptance criteria:
- Dynamic imports for heavy interactives.
- Viewport-triggered rendering for code/diff blocks.
- Basic bundle/perf check documented.
- Lighthouse targets tracked.

---

## Sprint 9b - Visual Polish + UX Improvements

### VFX-001 - Hero Constellation: Increase Motion
Acceptance criteria:
- Background dots/nodes in the Hero section move noticeably more (larger drift range, faster speed).
- Motion still feels ambient, not distracting — but clearly visible.
- Reduced-motion fallback unchanged (static dots).

### VFX-002 - Scroll-Driven Interaction Hints
Acceptance criteria:
- Interactive frames show a subtle hint/overlay on first view (e.g. "Click to explore" or interaction affordance).
- Consider auto-advancing interactives on a timer or scroll trigger so passive scrollers still see the demo in action.
- Hint disappears after first user interaction or after a few seconds.

### VFX-003 - Code Compare: Equal Panels + Smaller Code
Acceptance criteria:
- ClaudeMDCompare split view: both "Without" and "With CLAUDE.md" panels are equal width.
- Code font size reduced so all code fits without horizontal scrolling on desktop (1440px).
- Visually cleaner — no horizontal overflow in either panel.

### VFX-004 - Parallax / 3D Transition Effects Between Stories
Acceptance criteria:
- Add a parallax or 3D-style transition effect when snapping between story frames.
- Could be: depth scaling, layered parallax, subtle rotation, or z-axis movement.
- Effect is noticeable and visually striking but not nauseating.
- Reduced-motion fallback: instant snap, no 3D effects.

### VFX-005 - MCP Section: Executive Data Variant
Acceptance criteria:
- Add an alternative MCP diagram scenario for exec/C-suite audience.
- Central node connects to marketing data, financial systems, CRM, analytics (instead of Jira/Slack/GitHub/DB).
- Toggle or second tab to switch between "Engineering" and "Executive" MCP views.
- Click-to-explore detail panels with relevant data in/out for business tools.
- "Illustrative data" label.

---

## Sprint 9c - QA + Deploy

### QA-001 - Playwright Smoke Tests + Snapshots
Acceptance criteria:
- Playwright configured.
- Smoke test: load page, scroll through sections, ensure key elements visible.
- At least one mobile and one desktop snapshot (or screenshot) baseline.

### DEPLOY-001 - Vercel Deployment
Acceptance criteria:
- Deployed with demo mode working by default.
- Live mode documented (env var).
- Public URL recorded in README (later ticket if needed).

---

## Sprint 9d - Post-Deploy Fixes

### FIX-001 - Remove Dark Overlay on Production
Acceptance criteria:
- Scroll-linked opacity transform removed from ScrollSection parallax.
- Sections render at full brightness on initial load (no dimming).
- Scale/Y/rotateX parallax still active for depth effect.
- Status: **COMPLETED** (commit 9ad7d20)

### UX-007 - Scroll-Driven TraceView Steps (Replace Autoplay)
Acceptance criteria:
- TraceView steps advance on scroll instead of auto-playing on a timer.
- Each step occupies its own scroll position so users read at their own pace.
- Manual step-clicking still works as an alternative.
- Autoplay removed (no timer-based advancement).
- Reduced-motion fallback: all steps visible/accessible without scroll animation.
- Reset button still works.

---

## Sprint 10 (Stretch) - Sales Story Builder

### SALES-001 - Builder UI (3 Selectors)
Acceptance criteria:
- Audience / Industry / Goal selectors.
- Output panel showing:
  - suggested demo path
  - short talk track (template-based in demo mode)
  - 3 proof points pulled from synthetic dashboard data

### SALES-002 - Claude API Talk Track (Optional)
Acceptance criteria:
- Live mode uses Claude API to generate talk track.
- Demo mode uses templates; both clearly labeled.
- No broken UX if API is unavailable.
