# Claude in the Loop: From Curiosity to Conviction

## Project Overview

An interactive scrollytelling web experience that showcases how Claude Code is transforming who can build software and what they can build. The site tells this story through real user stories with deep interactive demos, audience-tailored perspectives, and a sales enablement tool.

**Core thesis:** The barrier to building just collapsed. Claude Code doesn't just make engineers faster — it enables entirely new categories of builders.

**Target audience for the site:** Anthropic's Technical Product Marketing Lead hiring team — but designed as if it were a real production asset for Anthropic's marketing and sales enablement.

**Target audience within the site:** Developers, Engineering Managers, and Executives — each with a tailored lens on the same capabilities.

---

## Architecture

### Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (scroll-triggered transitions)
- **Data viz:** Recharts (prefer over D3 for bundle size and simplicity)
- **AI Integration:** Claude API (with demo/fallback mode for no-API-key visitors)
- **Deployment:** Vercel
- **Repository:** Public GitHub repo

### Key Technical Requirements

- Demo mode works without API key (canned responses for all interactive elements)
- Demo mode indicator: small, honest label — "Demo mode: using canned outputs"
- Fully responsive (desktop-first, graceful mobile degradation)
- Performance: Lighthouse 90+ (lazy-load assets, dynamic imports for heavy interactives, viewport-triggered rendering for code blocks)
- Clean, stage-ready UI: large typography, generous whitespace, one-click resets on interactive elements

---

## Reusable Components

### Trace View Component

A reusable step-by-step workflow visualization that gets dropped into multiple hero stories with customized content per story. This is the core "real-work artifact" component.

**Structure:**
1. **Understand** — Task description / ticket
2. **Plan** — Approach outline, files to touch
3. **Edit** — File diffs (multi-file)
4. **Test** — Test run output, coverage
5. **Ship** — Commit message + PR description

**Implementation:**
- Accepts story-specific content as props
- Each step animates in sequence (scroll-triggered or auto-play with manual override)
- Steps show realistic artifacts: actual diffs, terminal output, PR descriptions
- Compact enough to sit within a story section alongside the metric widget

**Why this matters:** Makes demos feel operational, not magical. Shows the process, not just the output.

### Demo Mode Indicator

Small persistent badge (bottom corner or top of interactive elements) that reads:
- "Demo mode — using canned outputs" (when no API key)
- "Live mode — powered by Claude API" (when API key present)

Honest, subtle, builds trust. Aligns with Anthropic's reliability brand without over-engineering it.

---

## Site Structure

### Section 1: Hero / Opening Frame

**Purpose:** Set the thesis. Hook the visitor.

**Content:**
- Headline: "The barrier to building just collapsed" (or refined variant)
- Subtext: 1–2 sentences framing the shift. Keep it bold — the next six sections will back it up with evidence.
- Subtle downward scroll indicator

**Visual:** Minimal, striking. Abstract animation of a single node becoming many, or a code editor that transforms into different applications.

**Interaction:** None — this is the setup. Clean and fast.

---

### Sections 2–5: Hero Stories (4 deep interactive stories)

These are the core of the experience. Each gets a full-screen section with real interactive depth, a Trace View instance, and a metric widget.

#### Hero Story Structure (per section):

1. **Who** — One line: role, context
2. **The Problem** — 1–2 sentences: what they needed
3. **Trace View** — Customized workflow showing plan → edit → test → ship
4. **Interactive Demo** — A hands-on element specific to the story
5. **Metric Widget** — One tangible, visual data point showing impact
6. **Source** — "Inspired by [link]" attribution

---

#### Hero Story 1: The CLAUDE.md Effect

**Theme:** How project context transforms output quality.

**Who:** A developer working on a complex codebase with domain-specific patterns.

**Problem:** Claude generates generic code without understanding the project's conventions, architecture, and constraints.

**Trace View content:**
- Understand: "Add a new API endpoint following our patterns"
- Plan: Without CLAUDE.md → generic REST. With CLAUDE.md → matches existing conventions, error handling, auth patterns
- Edit: Side-by-side diffs showing generic vs. context-aware output
- Test: Tests generated that match project's testing patterns vs. boilerplate
- Ship: PR description that references project architecture vs. generic description

**Interactive demo:** Side-by-side comparison panel. Same prompt, two outcomes — one without CLAUDE.md, one with. User can toggle between them or view simultaneously. Show the CLAUDE.md content that made the difference.

**Metric widget:** "Iteration steps to correct output" — bar chart showing 5–7 iterations without context vs. 1–2 with CLAUDE.md. Or: "Lines changed in review" as a proxy for first-attempt quality.

**Why this story:** It's native to Claude Code specifically (not generic "AI coding"). Shows the steerability thesis in action. Practical and immediately actionable for any developer.

**Research sources:** r/ClaudeAI threads about CLAUDE.md, Claude Code docs, developer blog posts about project configuration.

---

#### Hero Story 2: Testing Transformation

**Theme:** Going from minimal test coverage to comprehensive testing in hours, not weeks.

**Who:** An engineer inheriting a codebase with poor test coverage under pressure to ship.

**Problem:** Writing tests for existing code is tedious and deprioritized. Coverage sits at 20%. Bugs keep slipping through.

**Trace View content:**
- Understand: "Add comprehensive test coverage to the payments module"
- Plan: Identify untested paths, edge cases, error states
- Edit: Test files generated — unit tests, integration tests, edge cases
- Test: Test run output showing 20% → 87% coverage, 3 existing bugs caught
- Ship: PR with coverage report and summary of what's now protected

**Interactive demo:** Animated before/after panel. Left side: sparse test file with low coverage badge. Right side: comprehensive test suite with high coverage badge. Test run terminal animation showing tests executing and passing. Optionally: click individual test names to see what they cover.

**Metric widget:** Coverage gauge — animated from 20% to 87%. Secondary: "3 existing bugs caught" callout.

**Why this story:** Universally understood, immediately tangible. Every engineering manager has a coverage problem. Every exec understands "we found bugs before users did."

**Research sources:** Reddit stories about Claude Code generating test suites, HN discussions about AI-assisted testing.

---

#### Hero Story 3: MCP Orchestration

**Theme:** Connecting Claude to internal tools to create unified development workflows.

**Who:** An engineering team at a mid-size company with tools scattered across Jira, Slack, GitHub, and internal databases.

**Problem:** Context lives in five different systems. Engineers waste time copying information between tools. Nobody has a complete picture of any workstream.

**Trace View content:**
- Understand: "Get the full context for JIRA-1234, fix the bug, and update all systems"
- Plan: Pull ticket details from Jira → read linked Slack thread → check GitHub history → understand full context
- Edit: Code fix informed by complete context from all sources
- Test: Run tests, update Jira status, post Slack summary
- Ship: PR linked to Jira ticket, Slack thread auto-updated, all systems in sync

**Interactive demo:** MCP connection diagram. Visual node graph showing Claude at center, connected to Jira, Slack, GitHub, Database nodes. Click any node to see: what data flows in, what data flows out, what permissions are required. Animate the flow for the story's specific task — data moving between nodes through Claude.

**Metric widget:** "Context switches eliminated per task" — or "minutes spent gathering context: before (25 min) vs. after (0 min, automated)."

**Why this story:** Hits the enterprise/security audience. Shows Claude Code as infrastructure, not just an autocomplete. The permissions visualization subtly addresses the trust/controls angle without a dedicated panel.

**Research sources:** MCP documentation, Anthropic's MCP announcement post, developer community posts about MCP integrations.

---

#### Hero Story 4: Legacy Modernization

**Theme:** Refactoring a codebase the team was afraid to touch.

**Who:** A team maintaining a legacy monolith — everyone knows it needs refactoring, nobody wants to risk breaking it.

**Problem:** The codebase has years of accumulated complexity. Manual refactoring is risky and slow. The team ships around the problems instead of fixing them.

**Trace View content:**
- Understand: "Refactor the user authentication module — currently 2,400 lines, 6 concerns mixed together"
- Plan: Identify separable concerns, dependency graph, incremental migration path
- Edit: Multi-file diff showing the monolith split into clean modules — step by step, not all at once
- Test: Existing tests still pass + new tests for extracted modules + integration tests for boundaries
- Ship: PR with incremental commits, each one safe to merge independently

**Interactive demo:** Incremental diff viewer. User scrolls or clicks through refactoring stages — the code transforms step by step. Each step shows: what changed, why it's safe, what's tested. Emphasis on the incremental nature — no "big bang" rewrite.

**Metric widget:** "Module complexity score" — a visualization showing complexity dropping through each refactoring step. Or: "Files touched per bug fix: before (12) vs. after (2)."

**Why this story:** Every established company has this problem. Shows Claude Code handling genuinely difficult, high-stakes engineering work — not just greenfield coding. The incremental approach resonates with senior engineers and managers who've been burned by rewrites.

**Research sources:** Reddit/HN stories about using AI for refactoring, blog posts about incremental modernization.

---

### Section 6: Vignettes (2–4 lighter stories)

**Purpose:** Show breadth without deep interaction. These are quick, skimmable, and source-linked. They fill out the narrative without competing with hero stories for attention.

**Format per vignette:**
- One visual (screenshot, diagram, or stylized illustration)
- 3–4 sentences: who, what they built, the outcome
- Source attribution link
- No interactive demo, no Trace View

**Layout:** Grid or horizontal scroll — multiple vignettes visible together, reinforcing breadth.

**Candidate vignettes (select 2–4 after research):**

| Theme | One-liner |
|-------|-----------|
| Non-developer ships a product | A product manager built and launched an internal tool without writing code manually |
| Solo dev + Git Worktrees | One engineer working on three features simultaneously across parallel branches |
| Agent Teams | Multiple Claude agents coordinating across a large project's tasks |
| Data pipeline automation | A researcher processed datasets they'd normally need a data engineer for |
| Your own story | "I'm an SEO strategist who builds AI measurement tools with Claude Code" |

**Note:** Your personal story works well as a vignette rather than a hero section — it's authentic without being self-aggrandizing. One among many builders.

---

### Section 7: Audience Perspectives (Interactive Tab Section)

**Purpose:** Show the same Claude Code capabilities through three different lenses. Demonstrates ability to tailor narrative to audience — directly maps to JD requirement.

**Implementation:** Tab or toggle UI. Clicking each role reshuffles the same underlying data into a different presentation. Transition between tabs should feel smooth (Framer Motion layout animations).

#### Developer View
- **Focus:** Workflow speed, code quality, creative freedom
- **Metrics:** Cycle time reduction, test coverage improvement, iteration steps saved
- **Tone:** Technical, peer-to-peer, show-don't-tell
- **Visual:** Code-centric — terminal output, diffs, test results
- **Key message:** "Claude Code is the pair programmer that actually keeps up"

#### Engineering Manager View
- **Focus:** Team velocity, toil reduction, adoption patterns
- **Metrics:** Tickets closed/week, time saved on reviews, "nice-to-have" work that now gets done
- **Tone:** Strategic, team-oriented, data-driven
- **Visual:** Dashboard — trend lines, team throughput charts, burndown
- **Key message:** "Your team ships more, burns out less"

#### Executive / Security View
- **Focus:** ROI, controls, data boundaries, compliance readiness
- **Metrics:** Cost savings, developer satisfaction, audit trail completeness
- **Tone:** Business outcome, risk-aware, measured
- **Visual:** ROI summary + controls/permissions overview + MCP security model
- **Key message:** "Measurable value with enterprise-grade controls"

**Data:** Synthetic but realistic. Label clearly as "illustrative data" to maintain credibility.

**Priority:** Developer view is highest priority (your strongest perspective and the most likely audience for the demo). Manager and Exec views should be polished but can be simpler.

---

### Section 8: Sales Story Builder (Stretch Goal)

**Priority:** Build only if Sections 1–7 are polished. Cut without hesitation if time runs short.

**Purpose:** Directly addresses JD requirement "develop frameworks and tools that help our sales team tell compelling stories tailored to different audiences."

**Implementation:** Three dropdown selectors:
1. **Audience:** CTO / Engineering Manager / Product Lead / Security Lead
2. **Industry:** Fintech / Healthcare / E-commerce / Internal Tools / SaaS
3. **Goal:** Ship faster / Reduce incidents / Automate ops / Modernize legacy / Enable non-devs

**Output:**
- Suggested demo path through the site (which stories to show in what order)
- A short talk track (3–4 sentences tailored to the combination)
- 3 proof points pulled from the dashboard section

**AI integration:** Claude API generates the talk track dynamically. Demo mode falls back to pre-written templates per common combination.

---

### Section 9: Closing Frame

**Purpose:** Land the thesis. Create a lasting impression.

**Content:**
- Callback to the opening — reference the breadth of what was just shown
- Brief personal note: why you built this, what Claude Code means to you as a builder
- "Built in X days using Claude Code" — the meta proof point
- Link to GitHub repo

**Visual:** Pull back — show all the story thumbnails together in a grid or constellation. The breadth becomes visible in one frame.

---

## Design Principles

### Visual Language
- Clean, minimal, generous whitespace
- Dark mode primary (aligns with developer aesthetic and Anthropic's brand)
- Accent color: warm orange or amber (evokes Claude brand without copying)
- Typography: large, confident headings (Inter or similar); readable body text
- Code elements use monospace with subtle syntax highlighting

### Animation Guidelines
- Every animation serves the narrative — no decoration
- Scroll-triggered fade-ins and transforms for section transitions
- Parallax depth on layered elements (subtle)
- Code/terminal animations timed to scroll position
- All animations respect `prefers-reduced-motion`

### Responsive Strategy
- Desktop-first (portfolio piece, most reviewers on desktop)
- Tablet: maintain layout, simplify parallax
- Mobile: stack vertically, replace complex animations with fade-ins, touch-friendly interactives

### Performance
- Dynamic imports for all heavy interactive components (each hero story's demo)
- Viewport-triggered rendering for code blocks and diff viewers
- Prefer Recharts over D3 for charts (smaller bundle, simpler API)
- Lazy-load all images and visual assets
- Target: Lighthouse 90+ across all categories

---

## README Structure

1. **What this is** — 2 sentences: an interactive experience exploring how Claude Code is changing who can build software
2. **Why I built it** — 2 sentences: portfolio piece for Anthropic's Technical Product Marketing Lead role, demonstrating the intersection of engineering and storytelling
3. **Live demo** — URL, prominent
4. **Tech stack** — Brief list
5. **Build timeline** — "Built in X days using Claude Code"
6. **How I'd use this in a sales moment** — 2–3 sentences on adapting for customer events, sales enablement, or conference demos
7. **Story sources** — Attribution list for all referenced user stories

---

## Build Plan

### Day 1: Research + Scaffold
- [ ] Research and collect candidate stories from Reddit, HN, Twitter, blogs
- [ ] Select 4 hero stories and 2–4 vignettes with source attribution
- [ ] Scaffold Next.js project with Tailwind, Framer Motion
- [ ] Build the scroll framework — full-screen sections with transitions
- [ ] Build the Trace View reusable component
- [ ] Implement Hero section

### Day 2: Hero Stories 1 & 2
- [ ] Build CLAUDE.md Effect — side-by-side comparison + Trace View + metric widget
- [ ] Build Testing Transformation — before/after panel + test animation + coverage gauge
- [ ] Write story content for both sections
- [ ] Implement demo mode with canned content for both interactives

### Day 3: Hero Stories 3 & 4
- [ ] Build MCP Orchestration — connection diagram + flow animation + metric widget
- [ ] Build Legacy Modernization — incremental diff viewer + Trace View + complexity chart
- [ ] Write story content for both sections
- [ ] Implement demo mode with canned content for both interactives

### Day 4: Vignettes + Audience Perspectives
- [ ] Build vignette grid section with 2–4 lighter stories
- [ ] Build Audience Perspectives tab section
- [ ] Developer view (highest priority — polish this)
- [ ] Manager view (dashboard with synthetic data)
- [ ] Exec view (ROI + controls overview)
- [ ] Implement Closing section

### Day 5: Polish + Deploy
- [ ] Responsive testing and fixes
- [ ] Performance optimization (dynamic imports, lazy loading, bundle audit)
- [ ] Lighthouse audit — target 90+
- [ ] Cross-browser testing
- [ ] Deploy to Vercel
- [ ] Write README with build timeline
- [ ] Final review — cut anything that isn't polished

### Day 6 (if available): Sales Story Builder
- [ ] Build dropdown UI
- [ ] Write template talk tracks per combination
- [ ] Wire up Claude API with demo mode fallback
- [ ] Integration test and polish

---

## Success Criteria

The project succeeds if a hiring manager:

1. **Spends more than 3 minutes exploring** — the experience holds attention
2. **Understands the thesis without explanation** — the narrative is clear through the experience
3. **Sees both technical depth and storytelling ability** — real-work artifacts in the demos, clear narrative arc in the structure
4. **Thinks "this person gets it"** — genuine understanding of Claude Code, Anthropic's brand, and the target audiences
5. **Notices it was built in days** — the README makes this clear, reinforcing the thesis

---

## File Structure

```
claude-in-the-loop/
├── public/
│   ├── images/                    # Story visuals, screenshots
│   └── data/                      # Synthetic dashboard data (JSON)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Main scrollytelling page
│   │   └── globals.css
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── HeroStory.tsx      # Wrapper for hero story sections
│   │   │   ├── Vignettes.tsx      # Grid of lighter stories
│   │   │   ├── AudiencePerspectives.tsx
│   │   │   ├── SalesStoryBuilder.tsx  # Stretch goal
│   │   │   └── Closing.tsx
│   │   ├── interactive/
│   │   │   ├── ClaudeMDCompare.tsx    # Hero 1: side-by-side
│   │   │   ├── TestCoveragePanel.tsx  # Hero 2: before/after + gauge
│   │   │   ├── MCPDiagram.tsx         # Hero 3: connection graph
│   │   │   └── DiffViewer.tsx         # Hero 4: incremental refactor
│   │   ├── shared/
│   │   │   ├── TraceView.tsx          # Reusable workflow component
│   │   │   ├── MetricWidget.tsx       # Reusable metric display
│   │   │   └── DemoModeIndicator.tsx  # Persistent demo/live badge
│   │   ├── dashboards/
│   │   │   ├── DeveloperDash.tsx
│   │   │   ├── ManagerDash.tsx
│   │   │   └── ExecDash.tsx
│   │   └── ui/
│   │       ├── ScrollSection.tsx      # Full-screen scroll wrapper
│   │       └── TabToggle.tsx
│   ├── lib/
│   │   ├── claude.ts              # API integration + demo fallback
│   │   ├── stories.ts             # Hero story content data
│   │   └── vignettes.ts           # Vignette content data
│   └── hooks/
│       └── useScrollProgress.ts
├── README.md
├── package.json
└── next.config.js
```

---

## Scope Rules

- **If in doubt, cut it.** Polish beats breadth every time.
- **Hero stories are the priority.** If time runs short, vignettes can be reduced to 2. Audience Perspectives can ship with Developer view only. Sales Story Builder gets cut entirely.
- **Every interactive must work in demo mode.** If the API integration isn't ready, the demo mode version is the ship version.
- **The site should feel like something Anthropic would actually use** — not a student project, not a startup MVP, not a marketing agency landing page.
- **You are proof of the thesis.** You're building this with Claude Code, in days. That's the story. Document the build timeline honestly.