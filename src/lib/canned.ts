/**
 * Canned outputs for demo mode.
 *
 * Keyed by a short identifier that each interactive will reference.
 * Content is synthetic but realistic; labeled as illustrative in the UI.
 */

const cannedOutputs: Record<string, string> = {
  // Hero Story 1: CLAUDE.md Effect — side-by-side compare
  "hs1-without-claude-md": `// Generic API endpoint — no project context
import express from 'express';

const router = express.Router();

router.post('/users', async (req, res) => {
  try {
    const user = await db.users.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});`,

  "hs1-with-claude-md": `// Context-aware endpoint — follows project conventions from CLAUDE.md
import { Router } from '@/lib/router';
import { validateBody } from '@/middleware/validation';
import { requireAuth } from '@/middleware/auth';
import { CreateUserSchema } from '@/schemas/user';
import { AppError } from '@/lib/errors';

export default Router()
  .use(requireAuth('admin'))
  .post(
    '/',
    validateBody(CreateUserSchema),
    async (req, res) => {
      const user = await req.services.users.create(req.validated);
      req.audit.log('user.created', { userId: user.id });
      res.status(201).json({ data: user });
    }
  );`,

  // Hero Story 2: Testing Transformation
  "hs2-before-tests": `PASS  src/payments/__tests__/checkout.test.ts (2 tests)
  ✓ creates a checkout session
  ✓ handles missing product ID

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Coverage:    20.3%`,

  "hs2-after-tests": `PASS  src/payments/__tests__/checkout.test.ts (14 tests)
  ✓ creates a checkout session with valid card
  ✓ creates a checkout session with saved payment method
  ✓ handles missing product ID
  ✓ handles invalid currency code
  ✓ handles expired promotional pricing
  ✓ applies volume discount correctly
  ✓ rejects negative quantities
  ✓ calculates tax for each supported region
  ✓ retries on transient payment gateway failure
  ✓ rolls back on partial fulfillment error
  ✓ emits checkout.completed event on success
  ✓ rate-limits checkout attempts per user
  ✓ validates idempotency key format
  ✓ handles concurrent checkout race condition

Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
Coverage:    87.2%  (+67.0%)
Bugs found:  3 (race condition, tax rounding, expired promo)`,

  // Hero Story 3: MCP Orchestration
  "hs3-mcp-flow": `[context] Reading Jira ticket PROJ-1234...
[context] Pulling linked Slack thread #incident-db-timeout...
[context] Checking GitHub blame for src/db/pool.ts...
[plan]    Root cause: connection pool max set to 5, needs 20 under load
[edit]    Updated src/db/pool.ts — pool.max: 5 → 20, added health check
[test]    All 47 tests passing, load test confirms fix
[update]  Jira PROJ-1234 → Done, linked PR #892
[update]  Slack #incident-db-timeout → "Fix deployed, monitoring"`,

  // Hero Story 4: Legacy Modernization
  "hs4-diff-stage-1": `// Stage 1: Extract authentication concerns
// Before: auth.ts (2,400 lines, 6 mixed concerns)
// After:  auth/validator.ts (180 lines) — extracted

- function validateAndCreateSession(req, res) {
-   // 400 lines of validation, session creation, logging, rate limiting...
- }

+ // auth/validator.ts — single responsibility
+ export function validateCredentials(credentials: LoginInput): Result<ValidatedAuth> {
+   // 60 lines — validation only, fully tested
+ }`,

  // Generic fallback
  "fallback": "Demo output — this interactive is using canned data.",
};

/**
 * Retrieve a canned output by key.
 * Returns the fallback string if the key is not found.
 */
export function getCannedOutput(key: string): string {
  return cannedOutputs[key] ?? cannedOutputs["fallback"]!;
}

/**
 * List all available canned output keys (useful for debugging).
 */
export function listCannedKeys(): string[] {
  return Object.keys(cannedOutputs);
}
