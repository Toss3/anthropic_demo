"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── Stage data ──────────────────────────────────────────────────── */

interface RefactorStage {
  title: string;
  module: string;
  linesExtracted: number;
  linesRemaining: number;
  tests: { total: number; passing: number };
  diff: string;
  safety: string;
}

const STAGES: RefactorStage[] = [
  {
    title: "Extract Credential Validation",
    module: "auth/validator.ts",
    linesExtracted: 380,
    linesRemaining: 2020,
    tests: { total: 164, passing: 164 },
    diff: `// auth/validator.ts — new module
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
+  if (!user || !await hashCompare(password, user.hash))
+    throw new InvalidCredentialsError();
+  return { userId: user.id, roles: user.roles };
+}

// auth.ts — delegates to new module
-function validateAndCreateSession(req, res) {
-  // 380 lines of credential handling...
-}
+import { validateCredentials } from './auth/validator';`,
    safety: "8 new unit tests + 156 existing tests passing. Zero behavior changes.",
  },
  {
    title: "Extract Session Management",
    module: "auth/sessions.ts",
    linesExtracted: 440,
    linesRemaining: 1580,
    tests: { total: 178, passing: 178 },
    diff: `// auth/sessions.ts — new module
+import { redis } from '@/lib/redis';
+import { signToken, verifyToken } from '@/lib/jwt';
+
+export async function createSession(
+  userId: string, roles: string[]
+): Promise<Session> {
+  const token = signToken({ userId, roles });
+  await redis.set(\`session:\${userId}\`, token, 'EX', 3600);
+  return { token, expiresIn: 3600 };
+}
+
+export async function validateSession(
+  token: string
+): Promise<SessionPayload | null> {
+  const payload = verifyToken(token);
+  if (!payload) return null;
+  const stored = await redis.get(\`session:\${payload.userId}\`);
+  return stored === token ? payload : null;
+}

// auth.ts — delegates
-class SessionManager {
-  // 440 lines of session logic...
-}
+import { createSession, validateSession } from './auth/sessions';`,
    safety: "14 new tests + 164 existing passing. Session API unchanged.",
  },
  {
    title: "Extract Permission Checking",
    module: "auth/permissions.ts",
    linesExtracted: 380,
    linesRemaining: 1200,
    tests: { total: 194, passing: 194 },
    diff: `// auth/permissions.ts — new module
+type Permission = 'read' | 'write' | 'admin' | 'delete';
+
+const ROLE_PERMISSIONS: Record<string, Permission[]> = {
+  viewer: ['read'],
+  editor: ['read', 'write'],
+  admin:  ['read', 'write', 'admin', 'delete'],
+};
+
+export function hasPermission(
+  roles: string[], required: Permission
+): boolean {
+  return roles.some(role =>
+    ROLE_PERMISSIONS[role]?.includes(required)
+  );
+}
+
+export function requirePermission(required: Permission) {
+  return (req, res, next) => {
+    if (!hasPermission(req.user.roles, required))
+      return res.status(403).json({ error: 'Forbidden' });
+    next();
+  };
+}

// auth.ts — delegates
-function checkPermissions(user, resource, action) {
-  // 380 lines of permission logic...
-}
+import { requirePermission } from './auth/permissions';`,
    safety: "16 new tests + 178 existing passing. Middleware API preserved.",
  },
  {
    title: "Extract Rate Limiting",
    module: "auth/rate-limiter.ts",
    linesExtracted: 300,
    linesRemaining: 900,
    tests: { total: 204, passing: 204 },
    diff: `// auth/rate-limiter.ts — new module
+import { redis } from '@/lib/redis';
+
+interface RateLimitConfig {
+  windowMs: number;
+  maxAttempts: number;
+}
+
+export function rateLimiter(config: RateLimitConfig) {
+  return async (req, res, next) => {
+    const key = \`rate:\${req.ip}:\${req.path}\`;
+    const count = await redis.incr(key);
+    if (count === 1)
+      await redis.expire(key, config.windowMs / 1000);
+    if (count > config.maxAttempts)
+      return res.status(429).json({
+        error: 'Too many requests',
+        retryAfter: config.windowMs / 1000,
+      });
+    next();
+  };
+}

// auth.ts — delegates
-function rateLimit(req, res, next) {
-  // 300 lines of rate limiting...
-}
+import { rateLimiter } from './auth/rate-limiter';`,
    safety: "10 new tests + 194 existing passing. Rate limit behavior identical.",
  },
  {
    title: "Extract Audit Logging",
    module: "auth/audit.ts",
    linesExtracted: 300,
    linesRemaining: 600,
    tests: { total: 216, passing: 216 },
    diff: `// auth/audit.ts — new module
+import { db } from '@/lib/database';
+
+interface AuditEvent {
+  action: string;
+  userId: string;
+  metadata?: Record<string, unknown>;
+  timestamp: Date;
+}
+
+export async function logAuditEvent(
+  event: AuditEvent
+): Promise<void> {
+  await db.auditLog.create({
+    data: {
+      ...event,
+      timestamp: event.timestamp ?? new Date(),
+    },
+  });
+}
+
+export function auditMiddleware(action: string) {
+  return async (req, res, next) => {
+    res.on('finish', () => {
+      if (res.statusCode < 400)
+        logAuditEvent({
+          action, userId: req.user.id,
+          metadata: { path: req.path, method: req.method },
+          timestamp: new Date(),
+        });
+    });
+    next();
+  };
+}

// auth.ts — delegates
-function logAuthAction(user, action, details) {
-  // 300 lines of audit logic...
-}
+import { auditMiddleware } from './auth/audit';`,
    safety: "12 new tests + 204 existing passing. Audit events format unchanged.",
  },
  {
    title: "Extract OAuth Integration",
    module: "auth/oauth.ts",
    linesExtracted: 480,
    linesRemaining: 120,
    tests: { total: 234, passing: 234 },
    diff: `// auth/oauth.ts — new module
+import { OAuth2Client } from '@/lib/oauth';
+
+const providers = {
+  google:  { clientId: process.env.GOOGLE_ID, ... },
+  github:  { clientId: process.env.GITHUB_ID, ... },
+};
+
+export async function handleOAuthCallback(
+  provider: string, code: string
+): Promise<AuthResult> {
+  const client = new OAuth2Client(providers[provider]);
+  const tokens = await client.exchangeCode(code);
+  const profile = await client.getUserProfile(tokens);
+  const user = await findOrCreateUser(profile);
+  return { user, isNewUser: !profile.existingId };
+}

// auth.ts — now a thin 120-line facade
-class OAuthManager {
-  // 480 lines of OAuth handling...
-}
+import { handleOAuthCallback } from './auth/oauth';
+
 // auth.ts is now a thin facade:
 //   - imports from 6 focused modules
 //   - configures middleware pipeline
 //   - no business logic remains here`,
    safety: "18 new tests + 216 existing passing. All OAuth flows verified end-to-end.",
  },
];

const INITIAL_LINES = 2400;

/** Consistent number formatting to avoid hydration mismatches from toLocaleString(). */
function fmt(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* ── Component ───────────────────────────────────────────────────── */

export function IncrementalDiffViewer() {
  const reduced = useReducedMotion();
  const [activeStage, setActiveStage] = useState(0);
  const [direction, setDirection] = useState(1);

  const stage = STAGES[activeStage];

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > activeStage ? 1 : -1);
      setActiveStage(idx);
    },
    [activeStage],
  );

  const reset = useCallback(() => {
    setDirection(-1);
    setActiveStage(0);
  }, []);

  const pct = ((INITIAL_LINES - stage.linesRemaining) / INITIAL_LINES) * 100;

  const contentVariants = {
    initial: (d: number) => (reduced ? {} : { opacity: 0, x: d > 0 ? 40 : -40 }),
    animate: reduced ? {} : { opacity: 1, x: 0 },
    exit: (d: number) => (reduced ? {} : { opacity: 0, x: d > 0 ? -40 : 40 }),
  };

  return (
    <div className="rounded-lg border border-border bg-panel overflow-hidden">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="border-b border-border px-3 py-2 sm:px-5 sm:py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono text-accent shrink-0">
            incremental refactor
          </span>
          <span className="text-xs sm:text-sm text-foreground-muted truncate">
            auth.ts &mdash; 2,400 &rarr; 6 modules
          </span>
        </div>
        <button
          onClick={reset}
          className="text-xs text-foreground-dim hover:text-foreground transition-colors px-2 py-1 sm:px-3 sm:py-1.5 border border-border rounded-md shrink-0"
        >
          Reset
        </button>
      </div>

      {/* ── Stage stepper ─────────────────────────────────── */}
      <div className="border-b border-border px-3 py-2 sm:px-5 sm:py-4">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {STAGES.map((s, i) => {
            const done = i < activeStage;
            const active = i === activeStage;
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="group flex flex-col items-center gap-1 flex-1 min-w-0"
                aria-label={`Stage ${i + 1}: ${s.title}`}
                aria-current={active ? "step" : undefined}
              >
                {/* Circle */}
                <span
                  className={`
                    flex items-center justify-center rounded-full text-[10px] sm:text-xs font-mono font-medium
                    transition-all duration-200
                    ${active
                      ? "h-7 w-7 sm:h-9 sm:w-9 bg-accent text-background ring-2 ring-accent/30"
                      : done
                        ? "h-6 w-6 sm:h-8 sm:w-8 bg-success/20 text-success border border-success/40"
                        : "h-6 w-6 sm:h-8 sm:w-8 bg-code-bg text-foreground-dim border border-border group-hover:border-foreground-muted"
                    }
                  `}
                >
                  {done ? (
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                {/* Label (hidden on small screens) */}
                <span
                  className={`hidden sm:block text-[10px] font-mono leading-tight text-center truncate max-w-full px-0.5 ${
                    active ? "text-accent" : done ? "text-success" : "text-foreground-dim"
                  }`}
                >
                  {s.module.replace("auth/", "")}
                </span>
              </button>
            );
          })}
        </div>

        {/* Connecting line behind circles */}
        <div className="mt-2 relative h-1 rounded-full bg-code-bg overflow-hidden mx-3 sm:mx-4">
          <motion.div
            className="absolute inset-y-0 left-0 bg-accent rounded-full"
            initial={false}
            animate={{ width: `${(activeStage / (STAGES.length - 1)) * 100}%` }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* ── Stage content ─────────────────────────────────── */}
      <div className="relative min-h-[260px] sm:min-h-[380px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeStage}
            custom={direction}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={reduced ? { duration: 0 } : { duration: 0.25, ease: "easeInOut" }}
            className="p-3 sm:p-5"
          >
            {/* Stage title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <h4 className="text-sm sm:text-lg font-semibold text-foreground">
                Stage {activeStage + 1}: {stage.title}
              </h4>
              <span className="text-xs font-mono text-accent bg-accent-muted px-2 py-0.5 rounded self-start">
                {stage.module}
              </span>
            </div>

            {/* Diff */}
            <pre className="text-[11px] sm:text-sm leading-relaxed overflow-x-auto bg-code-bg rounded-md p-2.5 sm:p-4 border border-border max-h-[140px] sm:max-h-[240px] overflow-y-auto">
              <code>
                {stage.diff.split("\n").map((line, i) => (
                  <span
                    key={i}
                    className={`block ${
                      line.startsWith("+")
                        ? "text-success"
                        : line.startsWith("-")
                          ? "text-error"
                          : line.startsWith("//")
                            ? "text-foreground-dim"
                            : "text-foreground-muted"
                    }`}
                  >
                    {line}
                  </span>
                ))}
              </code>
            </pre>

            {/* Safety + stats bar */}
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:grid sm:grid-cols-3 sm:gap-3">
              {/* Tests passing */}
              <div className="flex items-center gap-1.5 bg-code-bg rounded-md px-2 py-1.5 sm:px-3 sm:py-2 border border-border">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-success shrink-0" />
                <span className="text-[11px] sm:text-xs text-foreground-muted">
                  <span className="text-foreground font-medium">{stage.tests.passing}</span>
                  /{stage.tests.total} tests passing
                </span>
              </div>

              {/* Lines extracted */}
              <div className="flex items-center gap-1.5 bg-code-bg rounded-md px-2 py-1.5 sm:px-3 sm:py-2 border border-border">
                <span className="text-[11px] sm:text-xs text-accent font-mono">-{stage.linesExtracted}</span>
                <span className="text-[11px] sm:text-xs text-foreground-muted">lines extracted</span>
              </div>

              {/* Lines remaining */}
              <div className="flex items-center gap-1.5 bg-code-bg rounded-md px-2 py-1.5 sm:px-3 sm:py-2 border border-border">
                <span className="text-[11px] sm:text-xs font-mono text-foreground">{stage.linesRemaining}</span>
                <span className="text-[11px] sm:text-xs text-foreground-muted">lines remain</span>
              </div>
            </div>

            {/* Safety note */}
            <div className="mt-2 sm:mt-3 flex items-start gap-2 text-[11px] sm:text-xs text-foreground-muted">
              <svg className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm3.78-9.72a.75.75 0 0 0-1.06-1.06L6 9.94 5.28 9.22a.75.75 0 0 0-1.06 1.06l1.25 1.25a.75.75 0 0 0 1.06 0l5.25-5.25Z" clipRule="evenodd" />
              </svg>
              <span>{stage.safety}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom bar: auth.ts shrink gauge + nav ──────── */}
      <div className="border-t border-border px-3 py-2 sm:px-5 sm:py-4">
        {/* auth.ts shrink gauge */}
        <div className="mb-2 sm:mb-3">
          <div className="flex items-center justify-between text-[11px] sm:text-xs mb-1">
            <span className="font-mono text-foreground-muted">
              auth.ts
            </span>
            <span className="font-mono">
              <span className="text-foreground">{fmt(stage.linesRemaining)}</span>
              <span className="text-foreground-dim"> / {fmt(INITIAL_LINES)} lines</span>
            </span>
          </div>
          <div className="h-2 sm:h-2.5 rounded-full bg-code-bg overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, var(--color-accent) 0%, var(--color-success) 100%)`,
              }}
              initial={false}
              animate={{ width: `${100 - pct}%` }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 25 }}
            />
          </div>
          <p className="text-[9px] sm:text-[10px] text-foreground-dim mt-0.5">
            {pct > 0 ? `${Math.round(pct)}% extracted into focused modules` : "Original monolith"}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => goTo(Math.max(0, activeStage - 1))}
            disabled={activeStage === 0}
            className="text-xs font-mono px-3 py-1.5 rounded-md border border-border transition-colors
              enabled:hover:border-foreground-muted enabled:hover:text-foreground
              disabled:opacity-30 disabled:cursor-not-allowed text-foreground-muted"
          >
            &larr; Prev
          </button>

          <span className="text-xs font-mono text-foreground-dim">
            {activeStage + 1} / {STAGES.length}
          </span>

          <button
            onClick={() => goTo(Math.min(STAGES.length - 1, activeStage + 1))}
            disabled={activeStage === STAGES.length - 1}
            className="text-xs font-mono px-3 py-1.5 rounded-md border border-border transition-colors
              enabled:hover:border-accent enabled:hover:text-accent
              disabled:opacity-30 disabled:cursor-not-allowed text-foreground-muted"
          >
            Next &rarr;
          </button>
        </div>
      </div>

      {/* Illustrative label */}
      <div className="border-t border-border px-3 py-1.5 sm:px-5 sm:py-2">
        <p className="text-[9px] sm:text-[10px] text-foreground-dim font-mono">
          Illustrative data
        </p>
      </div>
    </div>
  );
}
