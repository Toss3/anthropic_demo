# Handover Log

This file is updated at the end of every session.

Format:
- Date
- Ticket completed
- What changed (behavior + key files)
- How to validate (quick commands/checks)
- Next ticket (single, specific)

---

## 2026-02-14

Ticket completed:
- DOCS-001 - Project planning + workflow docs

What changed:
- Added `PLANNED_SPRINTS.md` with sprints/tickets ordered from infrastructure -> features -> polish.
- Added `CLAUDE.md` describing what we're building, why, how, and the one-ticket workflow.
- Added `HANDOVER.md` (this file) with the session-by-session update contract.

How to validate:
- Open and skim:
  - `PLANNED_SPRINTS.md`
  - `CLAUDE.md`
  - `HANDOVER.md`

Next ticket:
- INF-001 - Scaffold Next.js App (App Router)
  - Create the Next.js app in repo root with TypeScript + Tailwind configured.

---

## 2026-02-14 (Session 2)

Ticket completed:
- INF-001 - Scaffold Next.js App (App Router)

What changed:
- Scaffolded Next.js 16 with App Router, TypeScript, Tailwind CSS v4, ESLint.
- `src/app/` directory with `layout.tsx`, `page.tsx`, `globals.css`.
- `@/*` path alias configured in `tsconfig.json`.
- Updated metadata in `layout.tsx` to match project identity.
- Package name set to `claude-in-the-loop`.

How to validate:
- `npm run lint` — passes with no errors.
- `npm run build` — compiles and generates static pages successfully.
- `npm run dev` — starts dev server on localhost:3000.

Next ticket:
- INF-002 - Visual System Baseline
  - Establish design tokens (CSS variables), dark-mode primary aesthetic, deliberate font choice, type scale.

---

## 2026-02-14 (Session 2, continued)

Ticket completed:
- INF-002 - Visual System Baseline

What changed:
- `src/app/globals.css` — full design token system:
  - Background layers: `background`, `background-muted`, `panel`, `code-bg`
  - Foreground hierarchy: `foreground`, `foreground-muted`, `foreground-dim`
  - Accent: warm amber `#f59e0b` with hover and muted variants
  - Borders: `border`, `border-bright`
  - Semantic: `success`, `error`
  - Type scale with `clamp()` for responsive hero text
  - Section padding rhythm tokens
  - Tailwind `@theme inline` bridge for all tokens
  - Base typography rules for h1-h4, code/pre blocks
  - Custom scrollbar and selection styling
- `src/app/layout.tsx` — `<html className="dark">` for forced dark mode
- `src/app/page.tsx` — visual system test page exercising all tokens
- Fonts: Geist (sans) + Geist Mono loaded via `next/font/google`

How to validate:
- `npm run dev` — check localhost:3000, all tokens visible
- `npm run build` — passes
- `npm run lint` — passes
- Desktop and mobile layouts both look correct

Next ticket:
- INF-003 - Motion + Reduced Motion Guardrails
  - Install Framer Motion, create useReducedMotion hook, build a small demo.

---

## 2026-02-14 (Session 2, continued)

Ticket completed:
- INF-003 - Motion + Reduced Motion Guardrails

What changed:
- Installed `framer-motion` (^12.34.0)
- `src/hooks/useReducedMotion.ts` — hook using `useSyncExternalStore` to track `prefers-reduced-motion`; reacts to live OS changes
- `src/components/ui/FadeIn.tsx` — scroll-triggered fade+slide component; renders a plain `<div>` when reduced motion is active
- `src/app/page.tsx` — test page wrapped in `FadeIn` components to verify motion

How to validate:
- `npm run dev` — page loads with fade-in animations on scroll
- Toggle reduced motion in OS settings — animations disappear, content renders instantly
- `npm run lint` + `npm run build` — both pass

Next ticket:
- INF-004 - Demo/Live Mode Plumbing (No UI Yet)
  - Single source of truth for mode, library module returning canned or API outputs.

---

## 2026-02-14 (Session 2, continued)

Ticket completed:
- INF-004 - Demo/Live Mode Plumbing (No UI Yet)

What changed:
- `src/lib/mode.server.ts` — server-only `getModeFromEnv()` based on `ANTHROPIC_API_KEY` (keeps API key off the client bundle)
- `src/lib/canned.ts` — keyed store of canned outputs for all 4 hero stories + fallback
- `src/lib/claude.ts` — `query({ cannedKey, prompt })` returns canned or API output; graceful fallback on any API error

How to validate:
- `npm run build` — passes (no API key needed)
- Import `query()` from any component; in demo mode it returns canned output instantly
- Set `ANTHROPIC_API_KEY` env var to enable live mode

Next ticket:
- INF-005 - CI/Quality Baseline (Lightweight)
  - npm run lint works, npm run build works, minimal GitHub Actions workflow.

---

## 2026-02-14 (Session 2, continued)

Ticket completed:
- INF-005 - CI/Quality Baseline (Lightweight)

What changed:
- `.github/workflows/ci.yml` — GitHub Actions workflow: checkout, Node 20 + npm cache, lint, build
- Runs on push/PR to main

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- Push to GitHub to trigger CI

Next ticket:
- SHELL-001 - Full-Screen Section Framework
  - ScrollSection component for full-screen sections with smooth transitions.

---

## 2026-02-14 (Session 2, continued)

Ticket completed:
- SHELL-001 - Full-Screen Section Framework

What changed:
- `src/components/ui/ScrollSection.tsx` — full-screen section component with:
  - `min-h-screen` + flex centering
  - `max-w-6xl` container with responsive section padding
  - `muted` prop for alternating background surfaces
  - Fade-in transition with reduced-motion fallback
- `src/app/page.tsx` — 8 placeholder sections matching the narrative arc (hero, 4 stories, vignettes, perspectives, closing)

How to validate:
- `npm run dev` — scroll through all 8 full-screen sections
- Muted/default backgrounds alternate correctly
- Mobile stacks vertically without breaking
- `npm run lint` + `npm run build` — both pass

Next ticket:
- SHELL-002 - Main Page Skeleton (Sections 1-9 Placeholders)
  - Already partially done via this ticket; finalize section IDs and layout boundaries.

---

## 2026-02-14 (Session 2, continued)

Ticket completed:
- SHELL-002 - Main Page Skeleton (Sections 1-9 Placeholders)

What changed:
- `src/app/page.tsx` — expanded to 9 sections with full layout boundaries:
  1. `#hero` — thesis + scroll cue
  2. `#story-claudemd` — Hero Story 1 with Who/Problem + placeholder slots
  3. `#story-testing` — Hero Story 2
  4. `#story-mcp` — Hero Story 3
  5. `#story-legacy` — Hero Story 4
  6. `#vignettes` — vignette grid placeholder
  7. `#perspectives` — audience tabs placeholder
  8. `#sales-builder` — stretch goal placeholder
  9. `#closing` — thesis callback
- StoryHeader helper renders Who/Problem grid per hero story
- PlaceholderSlots helper renders Trace View / Interactive / Metric boxes

How to validate:
- `npm run dev` — scroll through all 9 sections, each with clear boundaries
- Hero stories show Who/Problem + 3 placeholder slots
- `npm run lint` + `npm run build` — both pass

Next ticket:
- SHELL-003 - Navigation/Progress (Minimal)
  - Subtle scroll progress indicator or section index.

---

## 2026-02-14 (Session 2, continued)

Ticket completed:
- SHELL-003 - Navigation/Progress (Minimal)

What changed:
- `src/components/ui/ScrollProgress.tsx` — thin accent progress bar, spring-animated, hidden on reduced motion
- `src/components/ui/SectionNav.tsx` — right-edge dot nav, active section highlighted, labels on hover, hidden on mobile
- `src/hooks/useActiveSection.ts` — IntersectionObserver-based active section tracking via useSyncExternalStore
- `src/app/layout.tsx` — wired ScrollProgress + SectionNav into layout, added scroll-smooth

How to validate:
- `npm run dev` — amber progress bar moves on scroll, dot nav tracks active section
- Dot labels appear on hover, clicking navigates via smooth scroll
- Hidden on mobile viewports (< lg)
- `npm run lint` + `npm run build` — both pass

Next ticket:
- COMP-001 - Demo Mode Indicator Component
  - Persistent subtle badge showing demo vs live mode.

---

## 2026-02-14 (Session 2, continued)

Ticket completed:
- COMP-001 - Demo Mode Indicator Component

What changed:
- `src/components/shared/DemoModeIndicator.tsx` — fixed bottom-left badge with:
  - Amber dot + "Demo mode — using canned outputs" (no API key)
  - Green pulsing dot + "Live mode — powered by Claude API" (API key set)
  - Backdrop blur, border, panel background, accessible (role=status)
- `src/app/layout.tsx` — wired DemoModeIndicator into layout

How to validate:
- `npm run dev` — badge visible bottom-left, shows demo mode
- Set `ANTHROPIC_API_KEY` to see live mode variant
- `npm run lint` + `npm run build` — both pass

Next ticket:
- COMP-002 - Trace View (Reusable Workflow Artifact)
  - 5-step workflow viewer (Understand/Plan/Edit/Test/Ship), story-specific content via props.

---

## 2026-02-14 (Session 2, continued)

Ticket completed:
- COMP-002 - Trace View (Reusable Workflow Artifact)

What changed:
- `src/components/shared/TraceView.tsx` — reusable 5-step workflow viewer:
  - Step tab bar with icons, accent underline, click-to-jump
  - 3 content variants: diff (green/red), terminal (colored), text
  - Autoplay (default 3s) with pause on manual interaction
  - Reset button, progress bar, AnimatePresence transitions
  - Reduced-motion fallback
- `src/app/page.tsx` — Hero Story 1 wired with realistic trace data (hs1TraceSteps)

How to validate:
- `npm run dev` — scroll to Hero Story 1, watch autoplay through 5 steps
- Click any step tab to jump + pause, click Reset to restart
- Diff view shows green lines, terminal view shows colored output
- `npm run lint` + `npm run build` — both pass

Next ticket:
- COMP-003 - Metric Widget (Reusable)
  - Compact metric display with simple visualizations (bar/gauge/callout).

---

## 2026-02-14 (Session 2, continued)

Ticket completed:
- COMP-003 - Metric Widget (Reusable)

What changed:
- Installed `recharts` (^2)
- `src/components/shared/MetricWidget.tsx` — 3 visualization variants:
  - Callout: large accent value + subtext
  - Bar: Recharts bar chart with highlight cells
  - Gauge: SVG ring with from→to display
  - All include "Illustrative data" label
- `src/app/page.tsx` — Hero Story 1 now has TraceView + MetricWidget side by side

How to validate:
- `npm run dev` — Hero Story 1 shows bar chart (6 vs 2 iterations) beside TraceView
- `npm run lint` + `npm run build` — both pass

Next ticket:
- COMP-004 - Content/Data Model
  - Structured data model for hero stories and vignettes with synthetic but realistic data.

---

## 2026-02-14 (Session 2, final)

Ticket completed:
- COMP-004 - Content/Data Model

What changed:
- `src/lib/stories.ts` — HeroStory type + full data for all 4 stories (trace, metric, source)
- `src/lib/vignettes.ts` — Vignette type + 4 vignette entries with attributions
- `src/app/page.tsx` — refactored to consume data model via .map() (287→144 lines)
  All 4 hero stories now render TraceView + MetricWidget from structured data

How to validate:
- `npm run dev` — all 4 hero stories have working TraceViews + MetricWidgets
- Each story shows source attribution
- `npm run lint` + `npm run build` — both pass

---

## Session 2 Summary (2026-02-14)

**12 tickets completed in one session:**

Sprint -1: DOCS-001 (prior session)
Sprint 0 (Infrastructure):
- INF-001: Next.js 16 scaffold (App Router, TypeScript, Tailwind v4)
- INF-002: Design tokens, dark-mode primary, Geist fonts, type scale
- INF-003: Framer Motion + useReducedMotion hook + FadeIn component
- INF-004: Demo/live mode plumbing (mode.ts, canned.ts, claude.ts)
- INF-005: GitHub Actions CI (lint + build)

Sprint 1 (Scrollytelling Shell):
- SHELL-001: ScrollSection component (full-screen, muted variant, fade-in)
- SHELL-002: 9-section page skeleton with layout boundaries
- SHELL-003: Scroll progress bar + section dot-nav

Sprint 2 (Reusable Components):
- COMP-001: DemoModeIndicator (persistent bottom-left badge)
- COMP-002: TraceView (5-step workflow, 3 content variants, autoplay)
- COMP-003: MetricWidget (bar/gauge/callout via Recharts)
- COMP-004: Content data model (stories.ts + vignettes.ts)

**Key files:**
- `src/app/page.tsx` — main page consuming data model
- `src/app/layout.tsx` — layout with ScrollProgress, SectionNav, DemoModeIndicator
- `src/app/globals.css` — full design token system
- `src/components/shared/` — TraceView, MetricWidget, DemoModeIndicator
- `src/components/ui/` — ScrollSection, FadeIn, ScrollProgress, SectionNav
- `src/hooks/` — useReducedMotion, useActiveSection
- `src/lib/` — mode.ts, claude.ts, canned.ts, stories.ts, vignettes.ts

**Next ticket to pick up:**
- SEC1-001 - Hero Opening Frame (Sprint 3)
  - Finalize hero headline + subtext in final typography
  - Minimal striking visual/animation
  - Downward scroll cue (already partially done)

---

## 2026-02-14 (Session 3)

Ticket completed:
- SEC1-001 - Hero Opening Frame (Sprint 3)

What changed:
- `src/components/sections/Hero.tsx` — new dedicated hero section component with:
  - "CLAUDE IN THE LOOP" monospace eyebrow label in accent amber
  - "The barrier to building / just collapsed" headline with accent emphasis
  - Subtext in muted foreground with em-dash
  - Ambient SVG constellation: 36 deterministic nodes (seeded PRNG) with connecting lines
  - Nodes drift slowly via Framer Motion; ~30% amber accent, rest foreground
  - Radial vignette overlay fades constellation toward edges for depth
  - Staggered entrance animation: eyebrow → headline → subtext → scroll cue
  - Bouncing arrow scroll cue (SVG chevron)
  - Full reduced-motion fallback (static constellation, instant text render)
- `src/app/page.tsx` — replaced inline hero section with `<Hero />` component import

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- `npm run dev` — hero fills viewport with constellation animation + staggered text entrance
- Mobile (390px): text wraps cleanly, constellation remains ambient
- Reduced motion: constellation renders as static dots, text appears instantly
- Demo mode indicator visible bottom-left

Deployment status: Not deployed

Next ticket:
- SEC9-001 - Closing Frame (Sprint 3)
  - Callback to thesis + brief "why I built this" note
  - "Built in X days using Claude Code" placeholder
  - Link to repo placeholder
  - Visual pullback (grid/constellation of story thumbnails)

---

## 2026-02-14 (Session 3, continued)

Ticket completed:
- SEC9-001 - Closing Frame (Sprint 3)

What changed:
- `src/components/sections/Closing.tsx` — new closing section component with:
  - Visual pullback: 4 story thumbnail cards (2x2 mobile, 4-col desktop) linking back to hero stories
  - Each card has a monospace icon, title, and truncated "who" text
  - Thesis callback: "The barrier to building / just collapsed" with accent emphasis
  - Thin divider + personal note explaining the meta proof point
  - "Built with Claude Code" monospace accent label
  - "View source on GitHub" placeholder link
  - Staggered card entrance + text fade-in via Framer Motion
  - Full reduced-motion fallback (static rendering)
- `src/app/page.tsx` — replaced inline closing section with `<Closing />` component import

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- `npm run dev` → scroll to #closing: story thumbnails grid + thesis callback + meta proof
- Mobile (390px): 2x2 card grid, clean text stacking
- Story cards link back to their respective hero story sections
- Reduced motion: static rendering, no animations
- Demo mode indicator visible bottom-left

Deployment status: Not deployed

Next ticket:
- HS1-001 - Story Section Wrapper + Trace View Instance (Sprint 4)
  - Hero story wrapper layout ("Who / Problem / Trace / Interactive / Metric / Source")
  - TraceView populated with HS1-specific content

---

## 2026-02-14 (Session 3, continued)

Ticket completed:
- HS1-001 - Story Section Wrapper + Trace View Instance (Sprint 4)

What changed:
- `src/components/sections/HeroStory.tsx` — reusable hero story wrapper with:
  - Full layout: label + title → Who/Problem grid → TraceView+MetricWidget → Interactive slot → Source
  - `interactive` prop (ReactNode) for plugging in story-specific demos
  - FadeIn transitions with staggered delays
  - Uses ScrollSection with muted alternation based on story index
- `src/app/page.tsx` — refactored: replaced inline hero story rendering with `<HeroStory story={story} />`
  - Removed direct imports of TraceView and MetricWidget (now encapsulated in HeroStory)
  - All 4 stories render identically to before via data-driven mapping

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- `npm run dev` → all 4 hero stories render with Who/Problem + TraceView + MetricWidget + Source
- Layout unchanged from before (clean refactor)
- Interactive slot ready for HS1-002

Deployment status: Not deployed

Next ticket:
- HS1-002 - Interactive: Side-by-Side Compare (With vs Without CLAUDE.md) (Sprint 4)
  - Two outcomes shown for the same prompt (canned outputs ok)
  - Toggle view (split vs single) and "show context" for the CLAUDE.md snippet
  - One-click reset

---

## 2026-02-14 (Session 3, continued)

Ticket completed:
- HS1-002 - Interactive: Side-by-Side Compare (With vs Without CLAUDE.md) (Sprint 4)

What changed:
- `src/components/interactive/ClaudeMDCompare.tsx` — new interactive component with:
  - Split/Without/With CLAUDE.md view toggle (3-button bar)
  - Two code panels: generic Express CRUD vs context-aware project-convention code
  - Annotation pills on each panel (gray for "without", amber for "with")
  - "context-aware" badge on the CLAUDE.md panel
  - Collapsible "Show CLAUDE.md context" section revealing the project conventions
  - One-click Reset returning to split view + context hidden
  - AnimatePresence transitions between views
  - Reduced-motion fallback (static rendering)
- `src/app/page.tsx` — wired ClaudeMDCompare into Hero Story 1 via storyInteractives map

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- `npm run dev` → scroll to Hero Story 1: interactive appears below TraceView+Metric
- Click Split/Without/With toggles — views switch correctly
- Click "Show CLAUDE.md context" — reveals project conventions, toggles to "Hide"
- Click Reset — returns to split view, hides context
- Mobile (390px): panels stack vertically, controls wrap cleanly
- Demo mode indicator visible

Deployment status: Not deployed

Next ticket:
- HS1-003 - Metric: Iterations Saved (Sprint 4)
  - Simple chart/callout showing iteration steps (e.g., 6 vs 2)
  - Labeled as illustrative

---

## 2026-02-14 (Session 3, continued)

Ticket completed:
- HS2-001 - Interactive: Before/After Coverage Panel (Sprint 5)

What changed:
- `src/components/interactive/TestCoveragePanel.tsx` — new interactive with:
  - Before/After toggle showing test file list with status dots + test counts
  - Animated coverage progress bar (red 20% → green 87%)
  - "Run Tests" button triggering terminal-like test run animation (~3s)
  - Terminal output reveals progressively with blinking cursor
  - Coverage counter animates from 20% to 87% during run
  - Auto-switches to "After" view on completion
  - One-click Reset (clears terminal, resets to Before/20%)
  - Reduced-motion fallback
- `src/app/page.tsx` — wired TestCoveragePanel into Hero Story 2 via storyInteractives map
- `CLAUDE.md` — added spacing/whitespace constraints as non-negotiable + updated Definition of Done

Note: HS1-003 and HS2-002 were already complete from session 2 (MetricWidget + TraceView data model).
Sprint 4 and Sprint 5 are both complete.

How to validate:
- `npm run lint` — passes (clean)
- `npm run build` — passes
- `npm run dev` → Hero Story 2: Before/After toggle, Run Tests animation, coverage gauge
- Reset returns to initial state
- Demo mode indicator visible

Deployment status: Not deployed

---

## Session 3 Summary (2026-02-14)

**7 tickets completed:**

Sprint 3 (Hero + Closing):
- SEC1-001: Hero opening frame (SVG constellation, staggered text entrance)
- SEC9-001: Closing frame (story pullback grid, thesis callback, meta proof)

Sprint 4 (Hero Story 1: CLAUDE.md Effect):
- HS1-001: HeroStory reusable section wrapper with interactive slot
- HS1-002: ClaudeMDCompare interactive (split/single toggle, context reveal, reset)
- HS1-003: Already complete (MetricWidget bar chart from session 2)

Sprint 5 (Hero Story 2: Testing Transformation):
- HS2-001: TestCoveragePanel interactive (before/after, terminal animation, coverage gauge)
- HS2-002: Already complete (TraceView + MetricWidget from session 2)

Also: Added spacing/whitespace constraints to CLAUDE.md as non-negotiable.

**Key files added this session:**
- `src/components/sections/Hero.tsx` — hero with constellation
- `src/components/sections/Closing.tsx` — closing with story pullback
- `src/components/sections/HeroStory.tsx` — reusable story wrapper
- `src/components/interactive/ClaudeMDCompare.tsx` — HS1 interactive
- `src/components/interactive/TestCoveragePanel.tsx` — HS2 interactive

**Next ticket to pick up:**

PRIORITY: Before continuing with HS3-001, implement scroll-snap story stages:
- Rearchitect hero stories so each one fills the full viewport
- Use scroll-snap or Framer Motion scroll-linked animations
- Each story scrolls through its steps: Who/Problem → Trace steps → Interactive → Metric/Source
- Transition between stories is a full-viewport animation
- This solves spacing/overflow issues structurally — content always fits the viewport
- Plan this as a dedicated ticket before building more interactives
- Key files to rework: ScrollSection, HeroStory, page.tsx layout

After the scroll-snap rearchitect, resume with:
- HS3-001 - Interactive: MCP Connection Diagram (Sprint 6)
  - Node graph with Claude at center connected to Jira/Slack/GitHub/DB
  - Click any node to see data in/out + permissions note
  - Flow animation for the story path

---

## 2026-02-14 (Session 4)

Ticket completed:
- SNAP-001 - Scroll-Snap Story Stage Rearchitect (Architecture ticket, pre-Sprint 6)

What changed:
- `src/app/globals.css` — Added `scroll-snap-type: y mandatory` on `html` element; disabled snap for `prefers-reduced-motion`
- `src/app/layout.tsx` — Removed `scroll-smooth` from `<html>` (conflicts with scroll-snap)
- `src/components/ui/ScrollSection.tsx` — Added `scroll-snap-align: start`, changed `min-h-screen` to `min-h-[100dvh]`, added `overflow-y: auto` for content safety
- `src/components/sections/Hero.tsx` — Added `scroll-snap-align: start` + `min-h-[100dvh]`
- `src/components/sections/Closing.tsx` — Same snap alignment as Hero
- `src/components/sections/HeroStory.tsx` — **Core change**: split monolithic section into 2–3 `ScrollSection` snap frames per story:
  - Frame 1 (`story.id`): Header — label, title, who/problem
  - Frame 2 (`story.id-trace`): TraceView + MetricWidget (+ source if no interactive)
  - Frame 3 (`story.id-interactive`): Interactive + Source (only for stories 1 & 2)
  - Each frame repeats story title as context label
  - Total: 15 snap frames across the site
- `src/hooks/useActiveSection.ts` — Lowered IntersectionObserver threshold from 0.3 to 0.15 (viewport-sized frames need less overlap)
- `src/components/ui/SectionNav.tsx` — Grouped hierarchical dot navigation:
  - `NavSection` type with optional `subSections`
  - Sub-dots appear/collapse per active story group
  - Replaced `<a href>` anchors with `<button onClick={scrollIntoView}>` (compatible with snap)
  - 3 visual states: exact active (large accent), parent active (medium accent/50%), inactive (small dim)

No changes to:
- TraceView, MetricWidget, ClaudeMDCompare, TestCoveragePanel (all self-contained)
- FadeIn, DemoModeIndicator, ScrollProgress
- stories.ts, vignettes.ts, mode/canned/claude libs
- page.tsx (HeroStory handles frame splitting internally)

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- `npm run dev` → scroll through all 15 snap frames on desktop
- Nav dots expand/collapse sub-dots per story group
- Clicking nav dots navigates smoothly
- Mobile (390px): frames snap, content fits or scrolls within frame
- Reduced motion: snap disabled, free-scroll restored
- Demo mode indicator visible and honest

Deployment status: Not deployed

Next ticket:
- HS3-001 - Interactive: MCP Connection Diagram (Sprint 6)
  - Node graph with Claude at center connected to Jira/Slack/GitHub/DB
  - Click any node to see data in/out + permissions note
  - Flow animation for the story path

---

## 2026-02-14 (Session 4, continued)

Ticket completed:
- HS3-001 - Interactive: MCP Connection Diagram (Sprint 6)

What changed:
- `src/components/interactive/MCPDiagram.tsx` — new MCP connection diagram interactive:
  - SVG node graph with Claude at center, 4 tool nodes (Jira, Slack, GitHub, Database)
  - Dashed connection lines that highlight amber on active
  - Click any node: reveals detail panel with DATA IN, DATA OUT, PERMISSIONS (lock icon)
  - "Run Flow" button: 7-step animated sequence showing data flowing between tools
    - Steps: Jira←, Slack←, GitHub←, DB← (gather context), then GitHub→, Jira→, Slack→ (update systems)
    - Animated dot particle travels along connections
    - Status label shows current step (e.g., "← Reading ticket context...")
    - Button disabled during flow ("Running...")
  - One-click Reset clears selection and stops flow
  - Reduced-motion fallback (no particle animation)
  - Responsive: SVG scales proportionally on mobile
- `src/app/page.tsx` — added MCPDiagram to storyInteractives map for `story-mcp`
- `src/components/ui/SectionNav.tsx` — added `story-mcp-interactive` sub-section (MCP now has 3 frames)

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- `npm run dev` → scroll to MCP story interactive frame
- Click any node: detail panel shows data in/out + permissions
- Click "Run Flow": watch 7-step animation with dot particle + status labels
- Click Reset: clears state
- Mobile (390px): diagram scales, detail panel stacks cleanly
- Demo mode indicator visible

Deployment status: Not deployed

---

## Session 4 Summary (2026-02-14)

**2 tickets completed:**

Sprint (Architecture):
- SNAP-001: Scroll-snap rearchitect — split hero stories into 2-3 full-viewport snap frames (15 total), grouped hierarchical dot nav, CSS scroll-snap on html, reduced-motion fallback

Sprint 6 (Hero Story 3: MCP Orchestration):
- HS3-001: MCP connection diagram interactive — SVG node graph, click-to-reveal data panels, 7-step flow animation, reset, reduced-motion fallback

**Key files added/changed this session:**
- `src/components/interactive/MCPDiagram.tsx` — new MCP diagram interactive
- `src/components/sections/HeroStory.tsx` — multi-frame snap layout (core rearchitect)
- `src/components/ui/SectionNav.tsx` — grouped hierarchical dots with sub-sections
- `src/components/ui/ScrollSection.tsx` — snap alignment + dvh height
- `src/app/globals.css` — scroll-snap CSS
- `src/app/layout.tsx` — removed scroll-smooth
- `src/components/sections/Hero.tsx` + `Closing.tsx` — snap classes
- `src/hooks/useActiveSection.ts` — threshold adjustment

**Current state:**
- All 4 hero stories have header + trace frames; stories 1-3 have interactive frames
- 16 total snap frames (hero + 4×stories + vignettes + perspectives + sales + closing)
- SectionNav tracks all sub-frames with expand/collapse
- Sprints 0-5 complete, Sprint 6 partially complete (HS3-001 done, HS3-002 next)

**Next ticket to pick up:**
- HS4-001 - Interactive: Incremental Diff Viewer (Sprint 7) — see Session 5 below

---

## 2026-02-14 (Session 5)

Ticket completed:
- HS4-001 - Interactive: Incremental Diff Viewer (Sprint 7, Hero Story 4: Legacy Modernization)

What changed:
- `src/components/interactive/IncrementalDiffViewer.tsx` — new interactive component with:
  - 6-stage step-through refactoring viewer for extracting a 2,400-line auth.ts monolith
  - Stage stepper with numbered circles, green checkmarks for completed stages
  - Each stage shows: color-coded diff (green additions, red removals), test counts, lines extracted/remaining, safety note
  - Animated auth.ts shrinking gauge (progress bar with percentage)
  - Prev/Next navigation buttons + one-click Reset
  - AnimatePresence slide transitions between stages
  - Mobile-optimized: tighter spacing, smaller circles, shorter diff max-height (140px vs 240px)
  - Consistent number formatting via `fmt()` helper (avoids toLocaleString hydration mismatch)
  - Reduced-motion fallback (instant transitions)
  - "Illustrative data" label
- `src/app/page.tsx` — wired IncrementalDiffViewer into storyInteractives map for `story-legacy`
- `src/components/ui/SectionNav.tsx` — added `story-legacy-interactive` sub-section

How to validate:
- `npm run lint` — passes (clean)
- `npm run build` — passes
- `npm run dev` → scroll to Hero Story 4 interactive frame
- Click stage circles 1-6: each shows unique diff, test counts, safety note
- Click Next/Prev: navigates sequentially with slide animation
- Click Reset: returns to Stage 1, clears all checkmarks, resets gauge
- Auth.ts gauge animates as stages progress (2,400 → 120 lines)
- Mobile (390px): stacks cleanly, diff scrollable, gauge + nav visible
- No hydration errors on fresh load (0 console errors)
- Demo mode indicator visible

Deployment status: Not deployed

---

## Session 5 Summary (2026-02-14)

**1 ticket completed:**

Sprint 7 (Hero Story 4: Legacy Modernization):
- HS4-001: Incremental Diff Viewer interactive — 6-stage step-through, color-coded diffs, safety indicators, shrinking gauge, mobile-optimized, reduced-motion fallback

**Key files added this session:**
- `src/components/interactive/IncrementalDiffViewer.tsx` — new HS4 interactive

**Current state:**
- All 4 hero stories now have complete interactives:
  1. ClaudeMDCompare (split/single toggle, context reveal)
  2. TestCoveragePanel (before/after, terminal animation, coverage gauge)
  3. MCPDiagram (SVG node graph, click panels, flow animation)
  4. IncrementalDiffViewer (6-stage stepper, diffs, shrinking gauge)
- 17 total snap frames (hero + 4×stories with 3 frames each + vignettes + perspectives + sales + closing)
- Sprints 0-7 complete

**Next ticket to pick up:**
- VIG-001 - Vignettes Section (Sprint 8) — see below

---

## 2026-02-14 (Session 5, continued)

Ticket completed:
- VIG-001 - Vignettes Section (Sprint 8)

What changed:
- `src/components/sections/Vignettes.tsx` — new section component with:
  - 2x2 grid of vignette cards (single-column on mobile)
  - Each card: gradient header strip per persona color, badge (PM/FS/DS/TL), title, role
  - Body: summary text, "Outcome:" callout in code-bg box, source attribution
  - 4 persona colors: amber (PM), green (FS), purple (DS), blue (TL)
  - Staggered FadeIn entrance animations
  - Scrollable within snap frame on mobile
- `src/app/page.tsx` — replaced vignettes placeholder with `<Vignettes />` component

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- `npm run dev` → scroll to Vignettes section: 4 cards in 2x2 grid
- Each card shows persona badge, title, summary, outcome, source
- Mobile (390px): stacks to single column, all 4 cards accessible via scroll
- 0 console errors
- Demo mode indicator visible

Deployment status: Not deployed

---

## Session 5 Summary (2026-02-14)

**2 tickets completed, both merged to main:**

| Ticket  | What                                                                        |
|---------|-----------------------------------------------------------------------------|
| HS4-001 | Incremental Diff Viewer: 6-stage step-through refactor, diffs, gauge, reset |
| VIG-001 | Vignettes section: 2x2 persona card grid with gradient headers              |

**Key files added:**
- `src/components/interactive/IncrementalDiffViewer.tsx`
- `src/components/sections/Vignettes.tsx`

**Key fixes:**
- Hydration mismatch from `toLocaleString()` — replaced with deterministic `fmt()` helper

**Current state:**
- All 4 hero stories have complete interactives + trace + metric
- Vignettes section complete (4 cards from vignettes.ts)
- Sprints 0-7 complete, Sprint 8 partially complete (VIG-001 done)
- 17 snap frames across the site

**Also this session:**
- Documented scroll-snap architecture in CLAUDE.md as non-negotiable constraint

**PRIORITY for next session (before new features):**
- Verify scroll-snap is working correctly — each story should snap frame-by-frame through
  Header → Trace → Interactive as full-viewport transitions. Debug if broken.

**Next ticket after snap verification: AUD-001 — Audience Perspectives Tabs (Sprint 8).**
  - Tabs for Developer / Engineering Manager / Executive-Security
  - Same underlying capability data presented differently per tab
  - Smooth layout transitions (Framer Motion)
  - Then AUD-002 (dashboards) and Sprint 9 (polish, QA, deploy)

---

## 2026-02-14 (Session 6)

Tickets completed:
- SNAP-FIX — Scroll-snap CSS fix (bug fix, not a planned ticket)
- AUD-001 — Audience Perspectives Tabs (Sprint 8)

What changed:

**SNAP-FIX: Scroll-snap CSS fix**
- `src/app/layout.tsx` — Added `snap-y snap-mandatory motion-reduce:snap-none` Tailwind utility classes to `<html>` element
- `src/app/globals.css` — Removed the `html { scroll-snap-type: y mandatory }` CSS rule and its `prefers-reduced-motion` media query (the rule was not surviving Tailwind v4's CSS processing; utility classes on the element work correctly)
- Root cause: Tailwind v4's CSS engine was stripping the custom `html` scroll-snap-type rule from globals.css. Inline Tailwind utilities on the html element bypass this issue.
- Verified: all 17 snap frames align to viewport top (0px offset), snapping works correctly

**AUD-001: Audience Perspectives Tabs**
- `src/components/sections/Perspectives.tsx` — new section component with:
  - 3-tab bar (Developer / Eng. Manager / Exec & Security) with Framer Motion `layoutId` animated tab indicator
  - Each tab shows: tagline, focus area badges, 3 metric cards, key highlights list
  - Per-tab accent colors: amber (Developer), green (Manager), blue (Exec)
  - AnimatePresence transitions between tabs (fade + slide)
  - "Illustrative data" label on all views
  - Reduced-motion fallback (static transitions)
  - Mobile: tabs wrap cleanly, metrics stack to single column, content scrollable within snap frame
- `src/app/page.tsx` — replaced perspectives placeholder with `<Perspectives />` component

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- `npm run dev` → scroll to Perspectives section
- Click Developer/Manager/Exec tabs — smooth transitions, different data per tab
- Mobile (390px): tabs, metrics, highlights all render cleanly
- 0 console errors
- Demo mode indicator visible

Deployment status: Not deployed

---

## Session 6 Summary (2026-02-14)

**2 items completed:**

| Ticket   | What                                                                                  |
|----------|---------------------------------------------------------------------------------------|
| SNAP-FIX | Scroll-snap CSS fix — moved scroll-snap-type from globals.css to Tailwind utilities  |
| AUD-001  | Audience Perspectives Tabs — 3-tab section with per-audience metrics and highlights   |

**Key files added/changed:**
- `src/components/sections/Perspectives.tsx` — new section component
- `src/app/layout.tsx` — snap utility classes on html
- `src/app/globals.css` — removed dead snap CSS rule
- `src/app/page.tsx` — wired Perspectives component

**Current state:**
- All 4 hero stories have complete interactives + trace + metric
- Vignettes section complete
- Audience Perspectives section complete (AUD-001)
- Scroll-snap working correctly across all 17 frames
- Sprints 0-8 nearly complete (AUD-002 remaining)
- Sales Builder section still placeholder (stretch goal)

**Next ticket to pick up:**
- AUD-002 — Dashboards (Synthetic Data) (Sprint 8, final ticket)
  - Developer view: code-centric artifacts
  - Manager view: throughput/velocity dashboard (simple)
  - Exec view: ROI + controls/permissions overview (simple)
  - Clearly labeled as illustrative data
  - Then Sprint 9: POLISH-001, POLISH-002, QA-001, DEPLOY-001

---

## 2026-02-14 (Session 6, continued)

Ticket completed:
- AUD-002 — Dashboards (Synthetic Data) (Sprint 8, final ticket)

What changed:
- `src/components/sections/Perspectives.tsx` — replaced generic "Key highlights" text list with role-specific visual dashboards:
  - **DeveloperDash**: Terminal window with traffic-light dots, recent Claude Code activity log (5 entries with checkmarks, commands, test results), blinking cursor
  - **ManagerDash**: Two-panel layout — left: Recharts grouped bar chart showing sprint velocity (before/after across S1-S6, gray vs green bars) with legend; right: team adoption table (3 roles × adoption % × impact metric) with net toil reduction summary (-62%)
  - **ExecDash**: Two-panel layout — left: ROI breakdown table (3 line items: $1.8M + $340K + $260K = $2.4M total); right: enterprise controls grid (6 items: MCP permissions, audit logging, data residency, SSO/RBAC, code review, compliance) with blue accents and summary note
  - Compact spacing throughout to fit within snap frame viewport
  - Tagline + focus badges merged into single row on desktop
  - All data labeled as "Illustrative data"

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- `npm run dev` → scroll to Perspectives section
- Developer tab: terminal activity log with amber accents
- Manager tab: velocity bar chart + adoption table
- Exec tab: ROI breakdown + controls grid
- Mobile (390px): panels stack vertically, all content accessible via scroll
- 0 console errors
- Demo mode indicator visible

Deployment status: Not deployed

---

## Session 6 Final Summary (2026-02-14)

**3 items completed:**

| Ticket   | What                                                                                 |
|----------|--------------------------------------------------------------------------------------|
| SNAP-FIX | Scroll-snap CSS fix — Tailwind v4 wasn't applying html snap rule from globals.css   |
| AUD-001  | Audience Perspectives Tabs — 3-tab section with animated tab indicator               |
| AUD-002  | Dashboards — terminal (dev), velocity chart + adoption table (mgr), ROI + controls (exec) |

**Key files changed this session:**
- `src/components/sections/Perspectives.tsx` — new section with tabs + dashboards
- `src/app/layout.tsx` — snap utility classes on html
- `src/app/globals.css` — removed dead snap CSS rule
- `src/app/page.tsx` — wired Perspectives component

**Current state:**
- Sprint 8 complete (VIG-001, AUD-001, AUD-002 all done)
- All 4 hero stories have complete interactives + trace + metric
- Vignettes section complete
- Audience Perspectives section complete with role-specific dashboards
- Scroll-snap working correctly across all 17 frames
- Sales Builder section still placeholder (stretch goal)
- Sprints 0-8 fully complete

**Next ticket to pick up:**
- Sprint 9: POLISH-001 — Responsive Pass
  - Desktop polish
  - Tablet adjustments
  - Mobile: stack + touch-friendly, complex interactives degrade gracefully
  - Then POLISH-002, QA-001, DEPLOY-001

---

## 2026-02-14 (Session 7)

Ticket completed:
- POLISH-001 — Responsive Pass (Sprint 9)

What changed:

**ScrollSection vertical centering fix (all sections)**
- `src/components/ui/ScrollSection.tsx` — Changed `flex items-center` to `flex flex-col` with `my-auto` on inner div. This prevents content from being clipped at the top when it exceeds viewport height on mobile/tablet. Content centers when short, aligns to top when tall.

**TraceView horizontal scroll fix (all 4 story traces)**
- `src/components/shared/TraceView.tsx` — Added `block w-max min-w-full` to `<code>` elements in diff and terminal variants. Code blocks now scroll horizontally on mobile instead of clipping.

**Closing section overflow fix (desktop + mobile)**
- `src/components/sections/Closing.tsx` — Applied same `flex flex-col` + `my-auto` centering pattern. Reduced spacing (`mb-16→mb-10`, `mb-8→mb-6`, `mb-6→mb-4`). Added `pb-16` to clear DemoModeIndicator. All content (meta proof, "Built with Claude Code", GitHub link) now visible at 1440×900 desktop.

**Hero section centering fix**
- `src/components/sections/Hero.tsx` — Applied same `flex flex-col` + `my-auto` pattern for consistency with ScrollSection.

**ClaudeMDCompare code panel fix (tablet)**
- `src/components/interactive/ClaudeMDCompare.tsx` — Added `min-w-0` to CodePanel flex container so `overflow-x-auto` on `<pre>` works correctly within grid columns.

**MCP diagram size increase (mobile)**
- `src/components/interactive/MCPDiagram.tsx` — Increased aspect ratio on mobile: `pb-[80%] sm:pb-[60%]`. Nodes and labels significantly more readable at 390px.

**Sales Builder placeholder removed**
- `src/app/page.tsx` — Removed unfinished Sales Builder placeholder section (stretch goal). Removed unused PlaceholderSlots/Slot components and imports.
- `src/components/ui/SectionNav.tsx` — Removed "Sales" dot from nav.

How to validate:
- `npm run lint` — passes (clean)
- `npm run build` — passes
- `npm run dev` → check at 3 breakpoints:
  - Desktop (1440×900): all sections render, closing shows full content
  - Tablet (768×1024): code panels scroll, sections fit
  - Mobile (390×844): content starts from top, internal scroll works, MCP diagram readable
- Reduced motion: snap disabled, static rendering, all content visible
- Demo mode indicator visible and honest at all sizes

Deployment status: Not deployed

---

## Session 7 Summary (2026-02-14)

**1 ticket completed:**

| Ticket     | What                                                                          |
|------------|-------------------------------------------------------------------------------|
| POLISH-001 | Responsive pass — 7 fixes across 7 files, validated at 3 breakpoints         |

**Key files changed this session:**
- `src/components/ui/ScrollSection.tsx` — flex-col + my-auto centering
- `src/components/shared/TraceView.tsx` — code block horizontal scroll
- `src/components/sections/Closing.tsx` — spacing + centering fixes
- `src/components/sections/Hero.tsx` — centering consistency
- `src/components/interactive/ClaudeMDCompare.tsx` — min-w-0 for grid panels
- `src/components/interactive/MCPDiagram.tsx` — larger mobile aspect ratio
- `src/app/page.tsx` — removed Sales Builder placeholder
- `src/components/ui/SectionNav.tsx` — removed Sales dot

**Current state:**
- Sprint 9 partially complete (POLISH-001 done)
- All snap frames render correctly at desktop, tablet, and mobile
- Sales Builder section removed (stretch goal, not implemented)
- Reduced motion works correctly
- 0 console errors

**Next ticket to pick up:**
- POLISH-002 — Performance Pass (Sprint 9)
  - Dynamic imports for heavy interactives
  - Viewport-triggered rendering for code/diff blocks
  - Basic bundle/perf check documented
  - Lighthouse targets tracked
- Then QA-001, DEPLOY-001

---

## 2026-02-14 (Session 8)

Ticket completed:
- POLISH-002 — Performance Pass (Sprint 9)

What changed:

**Dynamic imports for heavy interactives (code splitting)**
- `src/components/interactive/lazy.tsx` — new client component barrel with `next/dynamic` + `ssr: false` for all 4 interactive components (ClaudeMDCompare, TestCoveragePanel, MCPDiagram, IncrementalDiffViewer). Each gets its own JS chunk, loaded only on client when needed. Loading skeleton (animate-pulse panel) shown during load.
- `src/app/page.tsx` — refactored to use lazy imports from `lazy.tsx` for interactives, and `next/dynamic` (with SSR) for Vignettes and Perspectives sections. All below-fold components are now code-split into separate chunks.

**Viewport-gated rendering (LazyLoad)**
- `src/components/ui/LazyLoad.tsx` — new IntersectionObserver-based wrapper that delays mounting children until within 400px of viewport. Once mounted, stays mounted. Fallback placeholder shown until then.
- `src/components/sections/HeroStory.tsx` — interactive slot wrapped in `LazyLoad` with skeleton fallback. Components deep in the page don't mount until the user scrolls near them.

**Gitignore cleanup**
- `.gitignore` — added `*.png` and `.playwright-mcp/` to ignore Playwright screenshots and artifacts.

**Bundle analysis (production build):**

| Metric | Value |
|--------|-------|
| Total JS (raw) | 1,048 KB across 14 chunks |
| Total JS (gzip) | 318 KB |
| CSS | 37 KB |
| Largest chunk (gzip) | 88 KB (framework) |
| Build time | ~1.5s (Turbopack) |

**Verified behavior:**
- `npm run lint` — passes
- `npm run build` — passes
- All 4 interactives load correctly on scroll (verified via Playwright)
- LazyLoad defers rendering: stories 2-4 interactives show skeleton until near viewport
- Mobile (390px): all sections render cleanly, 0 errors
- Desktop (1440x900): scroll-snap active (`y mandatory`), all content visible
- Reduced motion: snap disabled via Tailwind utility, static rendering
- Demo mode indicator visible and honest
- 0 console errors (warnings only: Recharts SSG sizing + Framer Motion AnimatePresence)

Deployment status: Not deployed

---

## Session 8 Summary (2026-02-14)

**2 items completed:**

| Item | What |
|------|------|
| Commit | Sessions 6-7 work committed (2fb5610) |
| POLISH-002 | Performance pass — dynamic imports, viewport gating, bundle documented |

**Key files added/changed:**
- `src/components/interactive/lazy.tsx` — dynamic import barrel (new)
- `src/components/ui/LazyLoad.tsx` — viewport-gated renderer (new)
- `src/app/page.tsx` — dynamic imports for 6 components
- `src/components/sections/HeroStory.tsx` — LazyLoad wrapper for interactives
- `.gitignore` — ignore screenshots + Playwright artifacts

**Sprint Progress:**

| Sprint | Status |
|--------|--------|
| Sprint 0-8 | Complete |
| Sprint 9: POLISH-001 | Complete |
| Sprint 9: POLISH-002 | Complete |
| Sprint 9: QA-001 | Next |
| Sprint 9: DEPLOY-001 | After QA |
| Sprint 10 (stretch) | Skipped |

**Next ticket to pick up:**
- Sprint 9b (Visual Polish) inserted before QA:
  1. VFX-001 — Hero constellation: increase motion
  2. VFX-002 — Scroll-driven interaction hints
  3. VFX-003 — Code compare: equal panels + smaller code
  4. VFX-004 — Parallax/3D transition effects between stories
  5. VFX-005 — MCP section: executive data variant
- Then QA-001, DEPLOY-001

---

## 2026-02-14 (Session 8, continued)

Tickets completed:
- VFX-001 — Hero constellation: increase motion
- VFX-003 — Code compare: equal panels + smaller code (PARTIAL — see feedback below)

Tickets in progress:
- VFX-002 — Scroll-driven interaction hints (InteractionHint.tsx created, not yet wired in)

What changed:

**VFX-001: Hero constellation motion increased**
- `src/components/sections/Hero.tsx`:
  - Drift range: `±1.5%` → `±5%` (from `*3` to `*10`)
  - Duration: `12-30s` → `6-16s` (from `12+rand()*18` to `6+rand()*10`)
  - Added second waypoint (`dx2`/`dy2`) for organic looping motion (4 keyframes instead of 3)
  - Stagger delay reduced: `0.06` → `0.04` for faster entrance
  - Reduced-motion fallback unchanged (static dots)

**VFX-003: Code compare panels (partial fix)**
- `src/components/interactive/ClaudeMDCompare.tsx`:
  - Code font: `text-xs` (12px) → `text-[11px]`
  - Grid: `md:grid-cols-2` → `md:grid-cols-[1fr_1fr]` (explicit equal widths)
  - "With CLAUDE.md" code reformatted: shorter lines, no horizontal overflow
  - Horizontal scrollbar eliminated on desktop 1440px

**VFX-002: InteractionHint component (created, not wired)**
- `src/components/ui/InteractionHint.tsx` — new component with:
  - IntersectionObserver-based: hint appears when element enters viewport
  - Auto-dismiss after 4 seconds (configurable)
  - Dismiss on any user interaction (pointerDown)
  - Animated float-up with pointing hand icon
  - Reduced-motion fallback (static, no animation)
  - NOT yet wired into page.tsx or HeroStory

**Sprint 9b planning**
- `PLANNED_SPRINTS.md` — added Sprint 9b (VFX-001 through VFX-005) before QA/Deploy

**Other**
- `.gitignore` — added `*.png` and `.playwright-mcp/`

**Outstanding user feedback (address next session):**
1. Code compare panels: need **equal HEIGHT** too (not just width), and font should be **even smaller** — "quite a bit too big in relation to the rest of the elements"
2. Code compare panels: annotation pills need **more whitespace above** to separate them from the code block
3. VFX-002: Wire InteractionHint into the 4 interactive frames
4. VFX-004: Parallax/3D transitions between story frames
5. VFX-005: MCP exec/C-suite data variant

Deployment status: Not deployed

---

## Session 8 Final Summary (2026-02-14)

**Items completed this session:**

| Item | What |
|------|------|
| Commit (2fb5610) | Sessions 6-7 work (SNAP-FIX + AUD-001/002 + POLISH-001) |
| POLISH-002 | Performance pass: dynamic imports, LazyLoad, bundle analysis |
| VFX-001 | Hero constellation: 3x drift, 2x speed, organic looping |
| VFX-003 (partial) | Code compare: smaller font, equal width, no h-scroll |

**Sprint Progress:**

| Sprint | Status |
|--------|--------|
| Sprint 0-8 | Complete |
| Sprint 9: POLISH-001 | Complete |
| Sprint 9: POLISH-002 | Complete |
| Sprint 9b: VFX-001 | Complete |
| Sprint 9b: VFX-002 | Component created, not wired |
| Sprint 9b: VFX-003 | Partial — needs smaller font + equal height |
| Sprint 9b: VFX-004 | Not started |
| Sprint 9b: VFX-005 | Not started |
| Sprint 9c: QA-001 | After 9b |
| Sprint 9c: DEPLOY-001 | After QA |

**All changes this session are UNCOMMITTED on main.**

**Next session priority order:**
1. VFX-003 fix: make code panels equal height + even smaller font
2. VFX-002: wire InteractionHint into HeroStory for all 4 interactives
3. VFX-004: parallax/3D transitions between snap frames
4. VFX-005: MCP exec data variant
5. Commit all Sprint 9b work
6. QA-001, DEPLOY-001

---

## 2026-02-14 (Session 9)

Ticket completed:
- VFX-003 — Code compare: equal panels + smaller code (completed in prior session, see notes above)
- VFX-002 — Scroll-Driven Interaction Hints

What changed:

**VFX-002: InteractionHint wired into all 4 interactives**
- `src/app/page.tsx` — each interactive in `storyInteractives` map wrapped with `<InteractionHint>`:
  - Story 1 (ClaudeMDCompare): "Toggle views to compare output"
  - Story 2 (TestCoveragePanel): "Click Run Tests to see the transformation"
  - Story 3 (MCPDiagram): "Click nodes or Run Flow to explore"
  - Story 4 (IncrementalDiffViewer): "Step through each refactoring stage"
- `InteractionHint` component (`src/components/ui/InteractionHint.tsx`) was already built in session 8 — no changes needed
- Hint behavior: appears 800ms after interactive enters viewport, auto-dismisses after 4s, dismisses immediately on user click
- Reduced-motion fallback: static hint pill (no animation, no pointing hand emoji)

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- `npm run dev` → scroll to any hero story interactive frame: hint pill appears at bottom center with amber accent
- Click anywhere on the interactive: hint dismisses immediately
- Wait 4 seconds: hint auto-dismisses
- Mobile (390px): hints render and wrap text cleanly
- Reduced motion: hint appears as static pill without animation
- 0 console errors

Deployment status: Not deployed

**Sprint Progress:**

| Sprint | Status |
|--------|--------|
| Sprint 0-8 | Complete |
| Sprint 9: POLISH-001 | Complete |
| Sprint 9: POLISH-002 | Complete |
| Sprint 9b: VFX-001 | Complete |
| Sprint 9b: VFX-002 | Complete |
| Sprint 9b: VFX-003 | Complete |
| Sprint 9b: VFX-004 | Not started |
| Sprint 9b: VFX-005 | Not started |
| Sprint 9c: QA-001 | After 9b |
| Sprint 9c: DEPLOY-001 | After QA |

**All changes remain UNCOMMITTED on main.**

**Next ticket to pick up:**
- VFX-004 — Parallax / 3D Transition Effects Between Stories
  - Add parallax or 3D-style transition when snapping between story frames
  - Reduced-motion fallback: instant snap, no 3D effects
- Then VFX-005, commit all 9b work, QA-001, DEPLOY-001

---

## 2026-02-14 (Session 9, continued)

Tickets completed:
- VFX-004 — Parallax / 3D Transition Effects Between Stories

What changed:

**VFX-004: Scroll-linked parallax transforms on ScrollSection**
- `src/components/ui/ScrollSection.tsx` — replaced one-time `whileInView` fade with continuous scroll-linked transforms via `useScroll` + `useTransform`:
  - **Scale**: 0.93 (entering) → 1 (in view) → 0.96 (exiting) — card-stack depth effect
  - **Opacity**: 0 (entering) → 1 (in view) → 0.4 (exiting) — natural reveal/fade
  - **Y translate**: +50px (entering) → 0 (in view) → -30px (exiting) — rising/sinking
  - **RotateX**: +2deg (entering) → 0 (in view) → -1deg (exiting) — subtle 3D tilt
  - **transformPerspective: 1200px** for depth perception
  - **will-change: transform, opacity** for GPU acceleration
  - Plateau from 0.3–0.7 scroll progress keeps sections stable when snapped
  - Reduced-motion fallback: static `<section>` with no transforms (unchanged)
- All ScrollSection-based frames (hero stories, vignettes, perspectives) get the effect automatically
- Hero and Closing sections (custom components, not using ScrollSection) are unaffected

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- `npm run dev` → scroll between frames: sections scale up/rise as they enter, scale down/fade as they exit
- Snapped sections appear at full scale/opacity (no residual artifacts)
- Desktop (1440x900): parallax visible during snap transitions
- Mobile (390x844): transforms work, no layout issues, content readable
- Reduced motion: `transform: none`, `opacity: 1` — confirmed via computed styles
- 0 console errors

Deployment status: Not deployed

**Sprint Progress:**

| Sprint | Status |
|--------|--------|
| Sprint 0-8 | Complete |
| Sprint 9: POLISH-001 | Complete |
| Sprint 9: POLISH-002 | Complete |
| Sprint 9b: VFX-001 | Complete |
| Sprint 9b: VFX-002 | Complete |
| Sprint 9b: VFX-003 | Complete |
| Sprint 9b: VFX-004 | Complete |
| Sprint 9b: VFX-005 | Not started |
| Sprint 9c: QA-001 | After 9b |
| Sprint 9c: DEPLOY-001 | After QA |

**All changes remain UNCOMMITTED on main.**

**Next ticket to pick up:**
- VFX-005 — MCP Section: Executive Data Variant
  - Alternative MCP diagram for exec/C-suite (marketing data, CRM, analytics instead of Jira/Slack/GitHub/DB)
  - Toggle between "Engineering" and "Executive" views
  - Click-to-explore detail panels, "Illustrative data" label
- Then commit all Sprint 9b work, QA-001, DEPLOY-001

---

## 2026-02-14 (Session 9, continued)

Tickets completed:
- VFX-005 — MCP Section: Executive Data Variant

What changed:

**VFX-005: Executive variant added to MCPDiagram**
- `src/components/interactive/MCPDiagram.tsx` — major enhancement:
  - Added Engineering/Executive toggle bar below header
  - Engineering variant (unchanged): Jira, Slack, GitHub, Database
  - Executive variant (new): CRM, Analytics, Marketing, Finance
  - Each exec node has business-relevant DATA IN/OUT/PERMISSIONS:
    - CRM: pipeline deals, health scores → deal stages, follow-up tasks
    - Analytics: revenue dashboards, churn signals → exec summary, KPI highlights
    - Marketing: campaign performance, attribution → ROI summary, budget shifts
    - Finance: Q4 actuals, budget vs forecast → board report, variance analysis
  - Separate flow animation sequences for each variant (7 steps each)
  - Toggle resets state (selection, flow) when switching
  - Toggle disabled during flow animation
  - "Illustrative data" label in toggle bar
  - All existing Engineering functionality preserved

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- `npm run dev` → scroll to MCP interactive frame
- Engineering tab: Jira/Slack/GitHub/Database (original behavior)
- Executive tab: CRM/Analytics/Marketing/Finance with business data
- Click any exec node: detail panel with DATA IN/OUT/PERMISSIONS
- Run Flow on Executive: 7-step business flow animation
- Reset clears all state
- Mobile (390px): toggle wraps, diagram scales, all readable
- 0 console errors

---

## Session 9 Summary (2026-02-14)

**4 tickets completed:**

| Ticket | What |
|--------|------|
| VFX-002 | Interaction hints wired into all 4 interactives (800ms delay, 4s auto-dismiss, click dismiss) |
| VFX-004 | Scroll-linked parallax on ScrollSection (scale, opacity, Y, rotateX with 1200px perspective) |
| VFX-005 | MCP Executive variant (CRM/Analytics/Marketing/Finance with toggle) |
| VFX-003 | Completed in prior session (equal panels + smaller font) |

**Key files changed this session:**
- `src/app/page.tsx` — InteractionHint wrappers on all 4 interactives
- `src/components/ui/ScrollSection.tsx` — scroll-linked parallax transforms
- `src/components/interactive/MCPDiagram.tsx` — Engineering/Executive toggle + exec data

**Sprint 9b: COMPLETE (all 5 VFX tickets done)**

**Sprint Progress:**

| Sprint | Status |
|--------|--------|
| Sprint 0-8 | Complete |
| Sprint 9: POLISH-001 | Complete |
| Sprint 9: POLISH-002 | Complete |
| Sprint 9b: VFX-001 | Complete |
| Sprint 9b: VFX-002 | Complete |
| Sprint 9b: VFX-003 | Complete |
| Sprint 9b: VFX-004 | Complete |
| Sprint 9b: VFX-005 | Complete |
| Sprint 9c: QA-001 | **Next** |
| Sprint 9c: DEPLOY-001 | After QA |

**All changes remain UNCOMMITTED on main.**

Deployment status: Not deployed

**Next session priority:**
1. Commit all Sprint 9b work (VFX-001 through VFX-005 + POLISH-002 + InteractionHint + LazyLoad)
2. QA-001 — Playwright Smoke Tests + Snapshots
3. DEPLOY-001 — Vercel Deployment

---

## 2026-02-14 (Session 10)

**6 UX improvements completed (user-requested, overriding sprint order):**

| Item | What |
|------|------|
| UX-001 | CLAUDE.md "Show context" converted from inline dropdown to modal popup (portal to body, ESC to close, backdrop blur, 3D focus effect) |
| UX-002 | MCP flow result summary — after Run Flow completes, shows stats panel (systems queried, context switches, time, systems updated) + outcome text. Separate data for Engineering/Executive variants |
| UX-003 | Executive-friendly descriptions added to all 20 TraceView steps (4 stories × 5 steps). Plain-English summary in amber-tinted box above code content |
| UX-004 | TraceView scroll-driven progression — viewport-aware autoplay (pauses when off-screen), animated progress bar fill, Play/auto indicator, resume button |
| UX-005 | Step-aware MetricWidget — side panel now updates per TraceView step with step-specific metrics (e.g., "6 rules loaded" → "3 files planned" → "5/5 conventions matched") |
| UX-006 | (NOT YET DONE) Mobile layout overflow pass + code font size reduction |

**Key files changed:**
- `src/components/interactive/ClaudeMDCompare.tsx` — modal via createPortal, ESC key handler
- `src/components/interactive/MCPDiagram.tsx` — flowComplete state, FlowResult data, result panel
- `src/components/shared/TraceView.tsx` — description field, onStepChange callback, viewport-aware autoplay, animated progress bar
- `src/components/shared/MetricWidget.tsx` — unchanged (already supports all variants)
- `src/components/sections/HeroStory.tsx` — activeStep state, step-aware metric selection
- `src/lib/stories.ts` — description field on all 20 trace steps, stepMetrics arrays on all 4 stories

**Known issues to fix next session:**
1. **Console error**: "Cannot update a component while rendering" — the `onStepChange` callback in TraceView's `advance()` function fires setState during a setState updater. Fix: use `useEffect` to fire `onStepChange` when `active` changes instead of calling it inside the updater.
2. **Mobile code font size**: 14px code in TraceView causes horizontal overflow on 390px. Reduce to `text-xs` (12px) or `text-[11px]` on mobile.
3. **Mobile layout overflow**: General pass still needed — check all sections at 390px width.
4. **All changes UNCOMMITTED on main.**

**Sprint Progress:**

| Sprint | Status |
|--------|--------|
| Sprint 0-9b | Complete |
| Session 10 UX | 5/6 done (mobile pass remaining) |
| Sprint 9c: QA-001 | After UX fixes |
| Sprint 9c: DEPLOY-001 | After QA |

Deployment status: Not deployed

---

## 2026-02-14 (Session 11)

**All remaining bugs fixed + mobile layout pass + QA + commit:**

| Item | What |
|------|------|
| Bug fix | `onStepChange` console error — moved callback from `setActive` updater to `useEffect` |
| Bug fix | Mobile code font overflow — `text-sm` → `text-xs sm:text-sm` on all 3 TraceView variants |
| Mobile pass | TraceView: hide descriptions on mobile (`hidden sm:block`), cap code height to 180px |
| Mobile pass | HeroStory trace frame: hide MetricWidget on mobile (`hidden lg:block`) |
| Mobile pass | ClaudeMDCompare: cap code panel height to 200px, responsive font size via clamp |
| Mobile pass | Vignettes: show only 2 cards on mobile (`hidden sm:block` on cards 3-4) |
| Mobile pass | Perspectives: hide dashboard on mobile (`hidden sm:block`), tighter spacing |
| Mobile pass | Closing: compact cards (smaller padding, hide "who" text), tighter gaps |
| Mobile pass | Section padding reduced on mobile (--section-pad-y: clamp 1.5rem→8rem) |
| Mobile pass | Horizontal scrollbars hidden on mobile code blocks (CSS scrollbar-width: none) |
| QA-001 | Playwright smoke tests: 10 tests × 2 viewports (Desktop + Mobile Chrome), all passing |

**Commits:**
- `c8120f2` — Sprint 9b VFX + POLISH-002 + UX improvements + mobile layout pass
- `53f3c45` — QA-001: Playwright smoke tests

**Key files changed this session:**
- `src/components/shared/TraceView.tsx` — onStepChange fix, mobile font, hide descriptions, cap code height
- `src/components/sections/HeroStory.tsx` — hide MetricWidget on mobile
- `src/components/interactive/ClaudeMDCompare.tsx` — cap code height, responsive font
- `src/components/sections/Vignettes.tsx` — show 2 cards on mobile
- `src/components/sections/Perspectives.tsx` — hide dashboard on mobile, tighter spacing
- `src/components/sections/Closing.tsx` — compact mobile cards
- `src/app/globals.css` — reduced section padding, hidden mobile scrollbars
- `playwright.config.ts` + `tests/smoke.spec.ts` — new QA setup

**Mobile overflow results (390×844):**

| Section | Before | After |
|---------|--------|-------|
| story-claudemd-trace | +47% | 0% |
| story-claudemd-interactive | +86% | 0% |
| story-testing-trace | +23% | 0% |
| vignettes | +73% | 3% |
| perspectives | +49% | 8% |
| closing | +10% | 0% |

**Sprint Progress:**

| Sprint | Status |
|--------|--------|
| Sprint 0-9b | Complete |
| Session 10 UX | Complete (all 6 items) |
| Sprint 9c: QA-001 | Complete (20/20 tests passing) |
| Sprint 9c: DEPLOY-001 | Pending (needs Vercel account setup) |

Deployment status: Deployed to Vercel (user deployed manually after CLI auth)

**Post-deploy fix:**
- Commit `9ad7d20` — removed scroll-linked opacity from ScrollSection parallax (caused dark overlay on production SSR)
- Needs redeploy: `npx vercel --prod`

---

## 2026-02-14 (Session 12)

Ticket completed:
- UX-007 — Scroll-Driven TraceView Steps (Replace Autoplay)

What changed:

**TraceView: autoplay removed, scroll-driven step progression added**
- `src/components/shared/TraceView.tsx` — major rewrite:
  - Removed: `autoPlayMs` prop, `paused` state, `isVisible` for autoplay, interval timer, "Play"/"auto" indicators, animated progress bar fill
  - Added: wheel event handler (desktop) — captures scroll events on the TraceView container; advances/retreats steps on scroll. At boundaries (first/last step), scroll passes through to snap to next/prev frame. Debounced at 400ms with 30px wheel threshold
  - Added: touch event handler (mobile) — touchstart/touchend swipe detection with 40px threshold. Same boundary passthrough behavior
  - Added: keyboard support — ArrowDown/Right advances, ArrowUp/Left retreats (when TraceView is focused via tabIndex)
  - Added: prev/next arrow buttons in the header bar (always visible, useful on mobile and for accessibility). Disabled at boundaries
  - Added: step counter (e.g. "3/5") between arrows
  - Added: "Scroll to explore steps" hint overlay with bouncing arrow — auto-dismisses after 6s or on first interaction
  - Progress bar is now static (fills segments based on current step, no animation)
  - Added: `role="region"` + `aria-label` for accessibility
  - Added: `aria-current="step"` on active tab, `aria-label` on all step tabs
  - Kept: click-to-jump on step tabs, Reset button, onStepChange callback, AnimatePresence transitions, reduced-motion fallback, description boxes

**No changes to:**
- HeroStory.tsx (compatible — was already not passing autoPlayMs)
- page.tsx, stories.ts, SectionNav, ScrollSection, or any other file
- All existing functionality preserved (step-aware MetricWidget, InteractionHints, etc.)

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- `npx playwright test` — 20/20 tests passing (desktop + mobile)
- `npm run dev` → scroll to any trace frame:
  - Scroll down on TraceView: steps advance one at a time
  - Scroll up: steps retreat
  - At last step, scroll down passes through to next snap frame
  - At first step, scroll up passes through to previous snap frame
  - Click step tabs: jumps to step
  - Click prev/next arrows: advances/retreats
  - Click Reset: returns to step 1
  - Arrow keys work when TraceView is focused
  - "Scroll to explore steps" hint appears briefly
- Mobile (390px): touch swipe advances steps, arrows visible, no overflow
- Reduced motion: transitions disabled, scroll/click navigation still works
- 0 console errors

Deployment status: Needs redeploy (`npx vercel --prod`)

---

## Session 12 Summary (2026-02-14)

**Completed this session:**

| Item | What |
|------|------|
| UX-007 | Scroll-driven TraceView steps — wheel/touch/keyboard nav, no autoplay, prev/next buttons |
| Scrollbar fix | Hidden horizontal scrollbar on TraceView tab bar, tightened tab padding |
| GitHub prep | Fresh repo init, security audit, proper README, correct .gitignore |

**Key files changed:**
- `src/components/shared/TraceView.tsx` — rewrite (autoplay → scroll-driven + scrollbar fix)
- `.gitignore` — added `.claude/`, `/test-results`, `*.jpeg`; added `!.env.example`
- `README.md` — replaced boilerplate with proper project description

**Git state:**
- Fresh single-commit repo on `main` (commit `bed925c`)
- Author: Tobias Vuorelma <tobias.vuorelma@gmail.com>
- Remote NOT yet added — needs `git remote add origin https://github.com/Toss3/anthropic_demo.git`
- Security audit passed: no keys, tokens, secrets, or sensitive data in commit

**Next session priority:**
1. Push to GitHub: `git remote add origin https://github.com/Toss3/anthropic_demo.git && git push -u origin main`
2. Redeploy to Vercel: `npx vercel --prod`
3. Any remaining polish or new tickets from PLANNED_SPRINTS.md

---

## 2026-02-14 (Session 13)

Tickets completed:
- SEC-001 — Security hardening + GitHub push + Vercel redeploy

What changed:

**Security hardening (commit c0d346b):**
- `src/lib/mode.server.ts` — new server-only module with `getModeFromEnv()` (reads `ANTHROPIC_API_KEY` server-side only)
- `src/lib/mode.ts` — stripped to type export only (`AppMode`); removed `NEXT_PUBLIC_CLAUDE_API_KEY` usage
- `src/lib/claude.ts` — added `import "server-only"`; switched from `NEXT_PUBLIC_CLAUDE_API_KEY` to `ANTHROPIC_API_KEY`
- `src/app/layout.tsx` — calls `getModeFromEnv()` server-side, passes mode as prop to DemoModeIndicator
- `src/components/shared/DemoModeIndicator.tsx` — receives `mode` as prop instead of reading env directly
- `.github/workflows/ci.yml` — added Gitleaks secret scanning job + `permissions: contents: read`
- `.env.example` — new file documenting the optional `ANTHROPIC_API_KEY` env var

**GitHub link fix (commit bc90d22):**
- `src/components/sections/Closing.tsx` — updated placeholder `https://github.com` to actual repo URL `https://github.com/Toss3/anthropic_demo`

**Security audit results:**
- Full codebase scan: no API keys, tokens, secrets, or credentials in tracked files
- `.gitignore` correctly excludes: `.env*` (except `.env.example`), `.claude/`, `.vercel/`, `node_modules/`, `*.pem`, `*.png`, `*.jpeg`
- `NEXT_PUBLIC_` exposure eliminated — API key now server-only
- GitHub secret scanning automatically active (public repo)
- Gitleaks CI job added for push/PR scanning
- Note: Vercel token in `.claude/settings.local.json` is gitignored but should be rotated

**Infrastructure:**
- Remote added: `origin` → `https://github.com/Toss3/anthropic_demo.git`
- Pushed to GitHub (commits `5747386`, `c0d346b`, `bc90d22`)
- Redeployed to Vercel: `https://anthropic-demo-ebon.vercel.app`
- Production verified via Playwright: hero renders, demo mode indicator visible, all sections present

How to validate:
- GitHub repo: https://github.com/Toss3/anthropic_demo (public, 3 commits)
- Production: https://anthropic-demo-ebon.vercel.app
- CI: Gitleaks + lint + build workflow runs on push/PR
- `npm run build` — passes
- `npm run lint` — passes

Deployment status: Deployed
- Vercel URL: https://anthropic-demo-ebon.vercel.app
- GitHub: https://github.com/Toss3/anthropic_demo
- Commit: bc90d22

---

## Session 13 Summary (2026-02-14)

**Completed:**

| Item | What |
|------|------|
| Security audit | Full codebase scan — no secrets in tracked files |
| Security hardening | API key moved server-only, NEXT_PUBLIC_ exposure eliminated |
| CI enhancement | Gitleaks secret scanning added to GitHub Actions |
| GitHub push | Repo live at https://github.com/Toss3/anthropic_demo |
| Vercel deploy | Production at https://anthropic-demo-ebon.vercel.app |
| GitHub link fix | Closing section now links to actual repo |

**Sprint Progress:**

| Sprint | Status |
|--------|--------|
| Sprint 0-9b | Complete |
| Sprint 9c: QA-001 | Complete (from session 11) |
| Sprint 9c: DEPLOY-001 | Complete |
| Sprint 9d: FIX-001 | Complete (from session 11) |
| Sprint 9d: UX-007 | Complete (from session 12) |
| Session 13: SEC-001 | Complete |

**Next session — remaining polish options:**
1. Rotate the Vercel token in `.claude/settings.local.json` (manual — Vercel dashboard)
2. Any additional polish, new features, or stretch goals from PLANNED_SPRINTS.md (Sprint 10: Sales Story Builder)
3. Consider: custom domain, Open Graph meta tags, analytics

---

## 2026-02-14 (Session 13, continued)

Tickets completed:
- SALES-001 — Sales Story Builder (minimal templated version)
- SOURCE-001 — Real source links on stories and vignettes
- README rewrite — Pitch-optimized README with correct URL + 3-minute tour

What changed:

**Sales Story Builder (commit c46ff62):**
- `src/lib/talkTracks.ts` — new data model + templated generator:
  - 3 audience types × 4 industries × 4 goals
  - Industry context fragments (HIPAA, multi-tenant, seasonal spikes, compliance)
  - Goal emphasis phrases (cycle time, test coverage, toil reduction, headcount scaling)
  - Demo path arrays (3 section links per audience×goal, 36 combinations)
  - Proof points arrays (3 metrics per audience×goal, 36 combinations)
- `src/components/sections/SalesBuilder.tsx` — new section component:
  - 3 PillGroup selectors with Framer Motion animated indicator (reuses Perspectives tab pattern)
  - Output panel: talk track pitch, demo path with anchor links, proof points
  - Reset button (hidden when defaults selected), "Illustrative data" label
  - AnimatePresence transitions between selector changes
  - Reduced-motion fallback, mobile-responsive (selectors stack vertically)
- `src/app/page.tsx` — dynamic import for SalesBuilder, placed between Perspectives and Closing
- `src/components/ui/SectionNav.tsx` — added "Talk Track" dot between Perspectives and Closing

**Source links (commit c46ff62):**
- `src/lib/stories.ts` — updated source URLs:
  - Story 1: `docs.anthropic.com/en/docs/claude-code/claude-md` (CLAUDE.md docs)
  - Story 2: `reddit.com/r/ClaudeAI/search/?q=test+coverage+claude+code`
  - Story 3: `modelcontextprotocol.io/` (unchanged, already real)
  - Story 4: `reddit.com/r/ClaudeAI/search/?q=refactor+legacy+claude+code`
- `src/lib/vignettes.ts` — updated source URLs:
  - PM: `reddit.com/r/ClaudeAI/search/?q=non+engineer+built+app+claude`
  - Worktrees: `docs.anthropic.com/en/docs/claude-code/cli-usage`
  - Pipeline: `reddit.com/r/ClaudeAI/search/?q=data+scientist+pipeline+claude`
  - Agent teams: `docs.anthropic.com/en/docs/claude-code/cli-usage#running-multiple-agents`

**README rewrite (commit e38b2cb):**
- Fixed stale Vercel URL (lyart → ebon)
- Added 3-minute tour with section-by-section walkthrough
- Added capability table mapping demo features to skills
- Added Story Sources section with real links
- Restructured for 15-second skimmability

**Test fix:**
- `tests/smoke.spec.ts` — scoped Perspectives tab test locator to `#perspectives` section (SalesBuilder now also has "Developer" button)

How to validate:
- `npm run lint` — passes
- `npm run build` — passes
- `npx playwright test` — 20/20 passing
- Production: https://anthropic-demo-ebon.vercel.app → scroll to "Build a Talk Track" section
- Switch Audience/Industry/Goal: output panel updates with tailored content
- Click demo path links: scroll to correct sections
- Click Reset: returns to Developer/SaaS/Ship Faster defaults
- Mobile (390px): selectors stack, content scrollable within frame
- 0 console errors

Deployment status: Deployed
- Vercel URL: https://anthropic-demo-ebon.vercel.app
- GitHub: https://github.com/Toss3/anthropic_demo
- Commit: c46ff62

---

## Session 13 Final Summary (2026-02-14)

**All items completed:**

| Item | What |
|------|------|
| Security audit + hardening | API key server-only, Gitleaks CI, full codebase scan |
| GitHub push | Repo live at https://github.com/Toss3/anthropic_demo |
| README rewrite | Pitch doc with correct URL, 3-min tour, capability table |
| SALES-001 | Sales Story Builder — 3 selectors, talk track, demo path, proof points |
| SOURCE-001 | Real source links on stories + vignettes (r/ClaudeAI, MCP docs, Anthropic docs) |
| GitHub link fix | Closing section → actual repo URL |
| Vercel deploy | Production at https://anthropic-demo-ebon.vercel.app |

**Sprint Progress:**

| Sprint | Status |
|--------|--------|
| Sprint 0-9d | Complete |
| Sprint 10: SALES-001 | Complete (minimal version) |
| Sprint 10: SALES-002 | Not started (live mode API talk track — stretch) |

**Next session priority:**
1. Recreate GitHub repo as a clean single-commit repo:
   - Squash all 7 commits into 1 fresh commit
   - Delete and recreate the remote repo (or force-push a new root)
   - Ensure `.claude/`, `.vercel/`, `.env*` (except `.env.example`) are excluded
   - Security audit the final single commit before pushing
2. Deploy to Vercel from the fresh single-commit repo (`npx vercel --prod`)
3. Verify production URL still works: https://anthropic-demo-ebon.vercel.app

**After deploy — remaining stretch options:**
- Rotate the Vercel token (manual — Vercel dashboard)
- SALES-002: live mode API-generated talk tracks (stretch, requires API key)
- Open Graph meta tags for social sharing previews
- Loom/GIF recording for README
