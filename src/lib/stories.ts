/**
 * Structured data model for hero stories.
 *
 * Each story includes: identity, narrative, trace steps, metric, and source.
 * Data is synthetic but realistic. Sources are attributed.
 */

import type { TraceStep } from "@/components/shared/TraceView";
import type { MetricData } from "@/components/shared/MetricWidget";

export interface HeroStory {
  id: string;
  index: number;
  title: string;
  who: string;
  problem: string;
  trace: TraceStep[];
  metric: MetricData;
  /** Per-step metric overrides (indexed by step). Falls back to `metric`. */
  stepMetrics?: (MetricData | null)[];
  source: {
    label: string;
    url: string;
  };
}

export const heroStories: HeroStory[] = [
  /* ── Story 1: The CLAUDE.md Effect ──────────────────────────────── */
  {
    id: "story-claudemd",
    index: 1,
    title: "The CLAUDE.md Effect",
    who: "A developer working on a complex codebase with domain-specific patterns.",
    problem:
      "Claude generates generic code without understanding the project\u2019s conventions, architecture, and constraints.",
    trace: [
      {
        label: "Understand",
        icon: "\u{1F50D}",
        variant: "terminal",
        description:
          "Claude reads the project\u2019s CLAUDE.md file to learn the team\u2019s coding standards before writing a single line. This eliminates back-and-forth code review cycles.",
        content: `Task: "Add a new API endpoint for user creation following our patterns"

Reading CLAUDE.md...
  \u2192 Auth: all endpoints use requireAuth() middleware
  \u2192 Validation: Zod schemas in src/schemas/
  \u2192 Error handling: AppError class with structured codes
  \u2192 Audit logging: req.audit.log() on mutations
  \u2192 Response format: { data: T } wrapper`,
      },
      {
        label: "Plan",
        icon: "\u{1F4CB}",
        variant: "text",
        description:
          "With project context, Claude creates a plan that matches existing conventions exactly \u2014 reducing iteration from 6 rounds to 2.",
        content: `Without CLAUDE.md \u2192 generic Express CRUD, no auth, no validation
With CLAUDE.md    \u2192 matches existing conventions exactly

Files to create:
  src/routes/users.ts        (route handler)
  src/schemas/user.ts        (Zod validation)
  src/routes/__tests__/users.test.ts

Files to reference:
  src/middleware/auth.ts      (requireAuth pattern)
  src/middleware/validation.ts (validateBody pattern)
  src/lib/errors.ts          (AppError class)`,
      },
      {
        label: "Edit",
        icon: "\u{270F}\u{FE0F}",
        variant: "diff",
        description:
          "The generated code includes authentication, input validation, audit logging, and error handling \u2014 all matching the team\u2019s standards on the first try.",
        content: `// src/routes/users.ts \u2014 context-aware, follows conventions
+import { Router } from '@/lib/router';
+import { validateBody } from '@/middleware/validation';
+import { requireAuth } from '@/middleware/auth';
+import { CreateUserSchema } from '@/schemas/user';
+
+export default Router()
+  .use(requireAuth('admin'))
+  .post(
+    '/',
+    validateBody(CreateUserSchema),
+    async (req, res) => {
+      const user = await req.services.users.create(req.validated);
+      req.audit.log('user.created', { userId: user.id });
+      res.status(201).json({ data: user });
+    }
+  );`,
      },
      {
        label: "Test",
        icon: "\u{2705}",
        variant: "terminal",
        description:
          "6 tests auto-generated covering security, validation, and edge cases. 100% coverage on new code \u2014 no manual test writing needed.",
        content: `PASS  src/routes/__tests__/users.test.ts (6 tests)
  \u2713 rejects unauthenticated requests (401)
  \u2713 rejects non-admin users (403)
  \u2713 validates request body with CreateUserSchema
  \u2713 creates user and returns { data: user }
  \u2713 logs audit event on success
  \u2713 returns structured AppError on duplicate email

Tests:    6 passed, 6 total
Coverage: 100% of new code`,
      },
      {
        label: "Ship",
        icon: "\u{1F680}",
        variant: "text",
        description:
          "Ready for review. The pull request follows all conventions, includes full test coverage, and was completed in one iteration instead of multiple review rounds.",
        content: `PR #247: Add user creation endpoint

Adds POST /api/users with:
- Admin-only auth via requireAuth('admin')
- Zod validation via CreateUserSchema
- Audit logging on successful creation
- Structured error responses via AppError

All 6 tests passing. Follows project conventions
documented in CLAUDE.md.

Reviewers: @backend-team`,
      },
    ],
    metric: {
      variant: "bar",
      label: "Iterations to correct output",
      bars: [
        { name: "Without", value: 6 },
        { name: "With CLAUDE.md", value: 2, highlight: true },
      ],
      unit: "iterations",
    },
    stepMetrics: [
      { variant: "callout", label: "Conventions loaded", value: "6 rules", subtext: "Auth, validation, errors, logging, format, routing" },
      { variant: "callout", label: "Files planned", value: "3 new", subtext: "Route handler, schema, test file" },
      { variant: "callout", label: "Conventions matched", value: "5/5", subtext: "Auth, validation, audit, response, routing" },
      { variant: "callout", label: "Tests generated", value: "6 tests", subtext: "100% coverage on new code" },
      { variant: "bar", label: "Iterations to correct output", bars: [{ name: "Without", value: 6 }, { name: "With CLAUDE.md", value: 2, highlight: true }], unit: "iterations" },
    ],
    source: {
      label: "Based on CLAUDE.md workflows from Anthropic docs and r/ClaudeAI",
      url: "https://docs.anthropic.com/en/docs/claude-code/claude-md",
    },
  },

  /* ── Story 2: Testing Transformation ────────────────────────────── */
  {
    id: "story-testing",
    index: 2,
    title: "Testing Transformation",
    who: "An engineer inheriting a codebase with poor test coverage under pressure to ship.",
    problem:
      "Writing tests for existing code is tedious and deprioritized. Coverage sits at 20%. Bugs keep slipping through.",
    trace: [
      {
        label: "Understand",
        icon: "\u{1F50D}",
        variant: "terminal",
        description:
          "Claude scans the payments module and finds 740 lines of business-critical code with only 20% test coverage \u2014 a major risk for the team.",
        content: `Task: "Add comprehensive test coverage to the payments module"

Scanning src/payments/...
  \u2192 checkout.ts       — 340 lines, 2 tests
  \u2192 pricing.ts        — 180 lines, 0 tests
  \u2192 subscriptions.ts  — 220 lines, 0 tests
  Current coverage: 20.3%`,
      },
      {
        label: "Plan",
        icon: "\u{1F4CB}",
        variant: "text",
        description:
          "Test strategy prioritized by risk: edge cases from production error logs first, then cross-module integration. No human had time to write these.",
        content: `Untested paths identified:
  - Checkout: expired promo, concurrent race, idempotency
  - Pricing: volume discount, multi-currency, tax regions
  - Subscriptions: upgrade/downgrade, cancellation, proration

Strategy: unit tests first, then integration tests for
cross-module interactions. Edge cases prioritized by
production error logs.`,
      },
      {
        label: "Edit",
        icon: "\u{270F}\u{FE0F}",
        variant: "diff",
        description:
          "Tests written for real-world failure scenarios: what happens during simultaneous checkouts? When promos expire mid-session? These catch bugs before users do.",
        content: `// src/payments/__tests__/checkout.test.ts
+describe('checkout edge cases', () => {
+  it('handles expired promotional pricing', async () => {
+    const promo = createExpiredPromo();
+    await expect(checkout({ promo }))
+      .rejects.toThrow(PromoExpiredError);
+  });
+
+  it('handles concurrent checkout race condition', async () => {
+    const [result1, result2] = await Promise.all([
+      checkout({ productId: 'p1', userId: 'u1' }),
+      checkout({ productId: 'p1', userId: 'u1' }),
+    ]);
+    expect(result1.success).toBe(true);
+    expect(result2.error).toBe('DUPLICATE_CHECKOUT');
+  });
+});`,
      },
      {
        label: "Test",
        icon: "\u{2705}",
        variant: "terminal",
        description:
          "33 tests pass. Coverage jumps from 20% to 87%. Three existing bugs discovered and fixed \u2014 including a race condition that could cause duplicate charges.",
        content: `PASS  src/payments/__tests__/checkout.test.ts (14 tests)
PASS  src/payments/__tests__/pricing.test.ts (8 tests)
PASS  src/payments/__tests__/subscriptions.test.ts (11 tests)

Tests:       33 passed, 33 total
Coverage:    87.2%  (+67.0%)
Bugs found:  3 (race condition, tax rounding, expired promo)`,
      },
      {
        label: "Ship",
        icon: "\u{1F680}",
        variant: "text",
        description:
          "Coverage increased 4x. Three production bugs caught before they reached users. Work that would take a developer days was completed in minutes.",
        content: `PR #312: Add comprehensive payment module tests

Coverage: 20.3% \u2192 87.2%
- 33 new tests across checkout, pricing, subscriptions
- 3 existing bugs caught and fixed:
  \u2022 Race condition in concurrent checkout
  \u2022 Tax rounding error for JPY (0-decimal currency)
  \u2022 Expired promo codes accepted silently

Reviewers: @payments-team`,
      },
    ],
    metric: {
      variant: "gauge",
      label: "Test coverage",
      from: 20,
      to: 87,
      unit: "%",
      subtext: "3 existing bugs caught",
    },
    stepMetrics: [
      { variant: "callout", label: "Current coverage", value: "20.3%", subtext: "740 lines across 3 files, only 2 tests" },
      { variant: "callout", label: "Untested paths", value: "9 critical", subtext: "Prioritized by production error logs" },
      { variant: "callout", label: "Tests written", value: "33 new", subtext: "Unit + integration across 3 modules" },
      { variant: "gauge", label: "Test coverage", from: 20, to: 87, unit: "%", subtext: "3 existing bugs caught" },
      { variant: "callout", label: "Bugs caught", value: "3", subtext: "Race condition, tax rounding, expired promo" },
    ],
    source: {
      label: "Inspired by developer stories about AI-assisted test generation",
      url: "https://www.reddit.com/r/ClaudeAI/search/?q=test+coverage+claude+code",
    },
  },

  /* ── Story 3: MCP Orchestration ─────────────────────────────────── */
  {
    id: "story-mcp",
    index: 3,
    title: "MCP Orchestration",
    who: "An engineering team with tools scattered across Jira, Slack, GitHub, and internal databases.",
    problem:
      "Context lives in five different systems. Engineers waste time copying information between tools. Nobody has a complete picture.",
    trace: [
      {
        label: "Understand",
        icon: "\u{1F50D}",
        variant: "terminal",
        description:
          "Claude gathers context from 4 different systems simultaneously \u2014 work that normally takes an engineer 25+ minutes of switching between tools.",
        content: `[context] Reading Jira ticket PROJ-1234...
  \u2192 Priority: P1, assigned to backend team
  \u2192 Description: "DB connection timeouts under load"

[context] Pulling linked Slack thread #incident-db-timeout...
  \u2192 12 messages, 3 participants
  \u2192 Key insight: "started after deploy 2024-01-15"

[context] Checking GitHub blame for src/db/pool.ts...
  \u2192 Last modified: 2024-01-15 (deploy match)
  \u2192 Change: pool config updated`,
      },
      {
        label: "Plan",
        icon: "\u{1F4CB}",
        variant: "text",
        description:
          "Root cause identified by cross-referencing deploy dates, code changes, and incident discussion. Zero context switches required from the engineer.",
        content: `Root cause: connection pool max was reduced from 20 to 5
in the Jan 15 deploy (commit abc123).

Fix: restore pool.max to 20, add connection health check
to prevent silent failures.

Systems to update after fix:
  - GitHub: PR with fix + tests
  - Jira: move ticket to Done, link PR
  - Slack: post resolution summary`,
      },
      {
        label: "Edit",
        icon: "\u{270F}\u{FE0F}",
        variant: "diff",
        description:
          "A targeted 4-line fix with an added health check to prevent silent failures. Small change, high impact.",
        content: `// src/db/pool.ts
 const pool = new Pool({
-  max: 5,
+  max: 20,
   idleTimeoutMillis: 30000,
+  connectionTimeoutMillis: 5000,
 });

+// Health check: verify connections are alive
+pool.on('connect', (client) => {
+  client.query('SELECT 1');
+});`,
      },
      {
        label: "Test",
        icon: "\u{2705}",
        variant: "terminal",
        description:
          "5 new tests including a load test simulating 50 concurrent queries. All 47 existing tests still pass \u2014 confirming the fix doesn\u2019t break anything else.",
        content: `PASS  src/db/__tests__/pool.test.ts (5 tests)
  \u2713 maintains 20 max connections
  \u2713 health check runs on connect
  \u2713 times out after 5000ms
  \u2713 handles connection failure gracefully
  \u2713 load test: 50 concurrent queries succeed

All 47 existing tests passing
Load test confirms fix under simulated traffic`,
      },
      {
        label: "Ship",
        icon: "\u{1F680}",
        variant: "terminal",
        description:
          "Fix deployed, Jira ticket closed, Slack thread resolved \u2014 all updated automatically. 3 systems synchronized without any manual handoff.",
        content: `[git]    PR #892 created, linked to PROJ-1234
[jira]   PROJ-1234 \u2192 Done, resolution: Fixed
[slack]  #incident-db-timeout \u2192 posted summary:
         "Fix deployed: pool.max restored to 20,
          added health check. Monitoring."
[github] All checks passing, ready for review`,
      },
    ],
    metric: {
      variant: "callout",
      label: "Context gathering time",
      value: "25 min \u2192 0",
      subtext: "Automated across Jira, Slack, GitHub",
    },
    stepMetrics: [
      { variant: "callout", label: "Systems queried", value: "4", subtext: "Jira, Slack, GitHub, Database" },
      { variant: "callout", label: "Root cause found", value: "1 commit", subtext: "Pool config change on Jan 15 deploy" },
      { variant: "callout", label: "Lines changed", value: "4", subtext: "Small fix, high impact" },
      { variant: "callout", label: "Tests added", value: "5 new", subtext: "Including load test with 50 concurrent queries" },
      { variant: "callout", label: "Context gathering time", value: "25 min \u2192 0", subtext: "3 systems updated automatically" },
    ],
    source: {
      label: "Inspired by MCP documentation and integration stories",
      url: "https://modelcontextprotocol.io/",
    },
  },

  /* ── Story 4: Legacy Modernization ──────────────────────────────── */
  {
    id: "story-legacy",
    index: 4,
    title: "Legacy Modernization",
    who: "A team maintaining a legacy monolith \u2014 everyone knows it needs refactoring.",
    problem:
      "The codebase has years of accumulated complexity. Manual refactoring is risky and slow. The team ships around the problems.",
    trace: [
      {
        label: "Understand",
        icon: "\u{1F50D}",
        variant: "terminal",
        description:
          "Claude analyzes a 2,400-line file that the team has been afraid to touch. It identifies 6 distinct responsibilities tangled together \u2014 the root cause of slow bug fixes.",
        content: `Analyzing src/auth.ts (2,400 lines)...

Concerns detected:
  1. Credential validation    (lines 1-380)
  2. Session management       (lines 381-820)
  3. Permission checking      (lines 821-1200)
  4. Rate limiting            (lines 1201-1500)
  5. Audit logging            (lines 1501-1800)
  6. OAuth integration        (lines 1801-2400)

Dependency graph: 14 internal imports, 8 external`,
      },
      {
        label: "Plan",
        icon: "\u{1F4CB}",
        variant: "text",
        description:
          "Instead of a risky rewrite, Claude plans 6 incremental extraction stages. Each stage is independently deployable and testable \u2014 zero risk of breaking production.",
        content: `Incremental extraction plan (6 stages):

Stage 1: Extract credential validation \u2192 auth/validator.ts
Stage 2: Extract session management \u2192 auth/sessions.ts
Stage 3: Extract permission checking \u2192 auth/permissions.ts
Stage 4: Extract rate limiting \u2192 auth/rate-limiter.ts
Stage 5: Extract audit logging \u2192 auth/audit.ts
Stage 6: Extract OAuth \u2192 auth/oauth.ts

Each stage: extract \u2192 test \u2192 verify \u2192 commit
Original auth.ts becomes a thin facade.`,
      },
      {
        label: "Edit",
        icon: "\u{270F}\u{FE0F}",
        variant: "diff",
        description:
          "Stage 1 extracts credential validation into its own module. 380 lines moved cleanly \u2014 the original file now delegates to the new module.",
        content: `// Stage 1: Extract credential validation
+// auth/validator.ts — single responsibility
+import { z } from 'zod';
+import { hashCompare } from '@/lib/crypto';
+
+const LoginSchema = z.object({
+  email: z.string().email(),
+  password: z.string().min(8),
+});
+
+export async function validateCredentials(
+  input: unknown
+): Promise<ValidatedAuth> {
+  const { email, password } = LoginSchema.parse(input);
+  const user = await findUserByEmail(email);
+  if (!user || !await hashCompare(password, user.hash)) {
+    throw new InvalidCredentialsError();
+  }
+  return { userId: user.id, roles: user.roles };
+}

// auth.ts — updated to delegate
-function validateAndCreateSession(req, res) {
-  // 400 lines of mixed concerns...
-}
+import { validateCredentials } from './auth/validator';`,
      },
      {
        label: "Test",
        icon: "\u{2705}",
        variant: "terminal",
        description:
          "All 156 existing tests still pass after the extraction. 8 new tests added. Zero behavior changes \u2014 the refactoring is provably safe.",
        content: `Stage 1 complete: auth/validator.ts extracted

PASS  src/auth/__tests__/validator.test.ts (8 tests)
PASS  src/auth/__tests__/integration.test.ts (12 tests)

All 156 existing tests still passing
No behavior changes detected
Lines in auth.ts: 2,400 \u2192 2,020 (-380)`,
      },
      {
        label: "Ship",
        icon: "\u{1F680}",
        variant: "text",
        description:
          "After all 6 stages: auth.ts shrinks from 2,400 lines to 120. Bug fix scope drops from 12 files to 2. The team can now move fast and safely.",
        content: `PR #445: Refactor auth — Stage 1/6: Extract validator

Extracts credential validation into auth/validator.ts.
- 380 lines moved, 8 new unit tests
- All 156 existing tests passing
- Zero behavior changes (verified by integration tests)
- auth.ts delegates to new module via facade

Safe to merge independently. Stages 2-6 follow
in separate PRs.

Reviewers: @platform-team`,
      },
    ],
    metric: {
      variant: "bar",
      label: "Files touched per bug fix",
      bars: [
        { name: "Before", value: 12 },
        { name: "After", value: 2, highlight: true },
      ],
      unit: "files",
    },
    stepMetrics: [
      { variant: "callout", label: "Tangled concerns", value: "6", subtext: "In a single 2,400-line file" },
      { variant: "callout", label: "Extraction stages", value: "6", subtext: "Each independently deployable" },
      { variant: "callout", label: "Lines extracted", value: "380", subtext: "Stage 1: credential validation" },
      { variant: "callout", label: "Existing tests", value: "156 pass", subtext: "Zero behavior changes after extraction" },
      { variant: "bar", label: "Files touched per bug fix", bars: [{ name: "Before", value: 12 }, { name: "After", value: 2, highlight: true }], unit: "files" },
    ],
    source: {
      label: "Inspired by stories about incremental AI-assisted refactoring",
      url: "https://www.reddit.com/r/ClaudeAI/search/?q=refactor+legacy+claude+code",
    },
  },
];
