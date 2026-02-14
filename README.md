# Claude in the Loop: From Curiosity to Conviction

**Live demo:** [anthropic-demo-ebon.vercel.app](https://anthropic-demo-ebon.vercel.app/)
**Source:** [github.com/Toss3/anthropic_demo](https://github.com/Toss3/anthropic_demo)

An interactive, scroll-driven web experience that tells the story of Claude Code through real-work artifacts — diffs, terminal output, connection diagrams, and audience-specific dashboards. Designed as a stage-ready marketing and sales enablement asset.

## 3-Minute Tour

Open the [live demo](https://anthropic-demo-ebon.vercel.app/) and scroll through:

1. **Hero** — thesis statement and ambient constellation
2. **The CLAUDE.md Effect** — scroll through the 5-step trace, then toggle between "Without" and "With CLAUDE.md" code output
3. **Testing Transformation** — click "Run Tests" and watch the terminal animation + coverage gauge
4. **MCP Orchestration** — click any node in the diagram, then hit "Run Flow." Switch to the Executive tab for a business-tool variant
5. **Legacy Modernization** — step through 6 incremental refactoring stages with the diff viewer
6. **Vignettes** — four quick stories (PM, full-stack, data scientist, platform lead)
7. **Audience Perspectives** — switch between Developer / Eng. Manager / Exec & Security tabs to see the same capabilities reframed per audience
8. **Closing** — thesis callback + meta proof point

Every interactive has a one-click reset. Every data point is labeled as illustrative. The "Demo mode" badge in the bottom-left is always honest.

## What This Demonstrates

| Capability | Where it shows up |
|---|---|
| Engineer interactive experiences that explain product impact | 4 hero story interactives with step-through traces, animated terminals, SVG diagrams |
| Translate complex technical concepts into tangible models | MCP connection diagram (click-to-explore, flow animation, eng/exec variants) |
| Reframe the same capability for different audiences | Perspectives section: Dev terminal log, Manager velocity chart, Exec ROI + controls |
| Build with narrative craft and visual storytelling | Scroll-snap architecture, parallax transitions, staggered reveals, constellation hero |
| Maintain credibility and trust signals | Demo/live mode labeling, "illustrative data" tags, source attributions per story |

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** with custom design tokens (dark-mode primary, warm amber accent)
- **Framer Motion** (scroll-linked parallax, AnimatePresence, staggered entrances)
- **Recharts** (bar charts, data visualizations)
- **Playwright** (20 smoke tests across desktop + mobile viewports)
- **Vercel** (production deployment)

## Key Design Decisions

- **Scroll-snap navigation**: CSS `scroll-snap-type: y mandatory` splits each story into full-viewport frames (header, trace, interactive). Content advances one frame at a time
- **Demo mode first**: Every interactive works with zero API keys. Canned outputs are served instantly; live mode is opt-in via `ANTHROPIC_API_KEY`
- **Reduced motion**: Full `prefers-reduced-motion` support — snap disabled, animations removed, content still fully accessible
- **Performance**: Dynamic imports for all interactives, viewport-gated rendering via IntersectionObserver, code-split into 14 chunks (318 KB gzipped total)
- **Server-only secrets**: API key never touches the client bundle (`import "server-only"` guard)

## How It Was Built

This entire project was built using Claude Code across 13 sessions. The process itself is documented in the repo:

- [`CLAUDE.md`](CLAUDE.md) — project context, conventions, and constraints that Claude Code followed throughout
- [`PLANNED_SPRINTS.md`](PLANNED_SPRINTS.md) — the full sprint plan, from infrastructure through polish
- [`HANDOVER.md`](HANDOVER.md) — session-by-session log of what was built, what changed, and what came next

The one-ticket-at-a-time workflow, the honest labeling, and the site itself are all part of the same thesis: Claude Code changes what one person can build.

## Story Sources

Each hero story is inspired by real patterns from the Claude Code community:

1. **The CLAUDE.md Effect** — CLAUDE.md workflows discussed across [r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/) and Anthropic's own documentation
2. **Testing Transformation** — developer stories about AI-assisted test generation and coverage improvement
3. **MCP Orchestration** — [Model Context Protocol documentation](https://modelcontextprotocol.io/) and integration patterns
4. **Legacy Modernization** — stories of incremental, AI-assisted refactoring of legacy codebases

## Running Locally

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Runs in demo mode by default — no API key needed.

```bash
npm run build           # Production build
npm run lint            # ESLint
npx playwright test     # 20 smoke tests (desktop + mobile)
```

## Project Structure

```
src/
  app/              # Next.js App Router (page, layout, globals)
  components/
    sections/       # Full-page sections (Hero, HeroStory, Vignettes, Perspectives, Closing)
    interactive/    # Story-specific demos (ClaudeMDCompare, TestCoveragePanel, MCPDiagram, IncrementalDiffViewer)
    shared/         # Reusable (TraceView, MetricWidget, DemoModeIndicator)
    ui/             # Primitives (ScrollSection, FadeIn, LazyLoad, InteractionHint)
  hooks/            # useReducedMotion, useActiveSection
  lib/              # Data models, mode/API plumbing, canned outputs
tests/              # Playwright smoke tests
```
