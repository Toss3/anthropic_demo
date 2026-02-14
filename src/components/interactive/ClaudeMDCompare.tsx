"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── Canned outputs ──────────────────────────────────────────────── */

const PROMPT = "Add a new API endpoint for user creation following our patterns";

const WITHOUT_OUTPUT = `// Generic Express.js CRUD — no project awareness
const express = require('express');
const router = express.Router();

router.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({
      name, email, password
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;`;

const WITH_OUTPUT = `// Context-aware — matches project conventions
import { Router } from '@/lib/router';
import { validateBody } from '@/middleware/validation';
import { requireAuth } from '@/middleware/auth';
import { CreateUserSchema } from '@/schemas/user';

export default Router()
  .use(requireAuth('admin'))
  .post('/', validateBody(CreateUserSchema),
    async (req, res) => {
      const user = await req.services.users
        .create(req.validated);
      req.audit.log('user.created', {
        userId: user.id
      });
      res.json({ data: user });
    }
  );`;

const CLAUDE_MD_CONTEXT = `# Project Conventions (from CLAUDE.md)

## API Endpoints
- All endpoints use \`requireAuth()\` middleware
- Request validation via Zod schemas in \`src/schemas/\`
- Error handling via \`AppError\` class with structured codes
- Audit logging: \`req.audit.log()\` on all mutations
- Response format: \`{ data: T }\` wrapper
- Router: import from \`@/lib/router\`

## File Structure
- Routes: \`src/routes/{resource}.ts\`
- Schemas: \`src/schemas/{resource}.ts\`
- Tests: \`src/routes/__tests__/{resource}.test.ts\``;

/* ── Types ────────────────────────────────────────────────────────── */

type ViewMode = "split" | "without" | "with";

/* ── Component ───────────────────────────────────────────────────── */

export function ClaudeMDCompare() {
  const reduced = useReducedMotion();
  const [view, setView] = useState<ViewMode>("split");
  const [showContext, setShowContext] = useState(false);

  const reset = () => {
    setView("split");
    setShowContext(false);
  };

  // Close modal on ESC
  useEffect(() => {
    if (!showContext) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowContext(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showContext]);

  const Wrapper = reduced ? "div" : motion.div;
  const animProps = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.25 },
      };

  return (
    <div className="rounded-lg border border-border bg-panel overflow-hidden">
      {/* ── Header: prompt + controls ───────────────────── */}
      <div className="border-b border-border px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono text-accent shrink-0">
            prompt
          </span>
          <span className="text-sm text-foreground-muted truncate">
            &quot;{PROMPT}&quot;
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* View toggle */}
          <div className="flex rounded-md border border-border overflow-hidden text-xs">
            {(["split", "without", "with"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                className={`px-3 py-1.5 transition-colors capitalize ${
                  view === mode
                    ? "bg-accent text-background font-medium"
                    : "bg-panel text-foreground-muted hover:text-foreground"
                }`}
              >
                {mode === "split"
                  ? "Split"
                  : mode === "without"
                    ? "Without"
                    : "With CLAUDE.md"}
              </button>
            ))}
          </div>
          {/* Reset */}
          <button
            onClick={reset}
            className="text-xs text-foreground-dim hover:text-foreground transition-colors px-2 py-1.5 border border-border rounded-md"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Code panels ─────────────────────────────────── */}
      {view === "split" ? (
        <div className="grid md:grid-cols-[1fr_1fr] md:items-stretch divide-y md:divide-y-0 md:divide-x divide-border">
          <CodePanel
            label="Without CLAUDE.md"
            labelColor="text-foreground-dim"
            code={WITHOUT_OUTPUT}
            annotations={[
              "No auth middleware",
              "No input validation",
              "No audit logging",
              "Generic error handling",
              "CommonJS (not project style)",
            ]}
          />
          <CodePanel
            label="With CLAUDE.md"
            labelColor="text-accent"
            code={WITH_OUTPUT}
            annotations={[
              "requireAuth('admin') ✓",
              "Zod validation ✓",
              "Audit logging ✓",
              "Structured response ✓",
              "Project conventions ✓",
            ]}
            highlighted
          />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {view === "without" && (
            <Wrapper key="without" {...animProps}>
              <CodePanel
                label="Without CLAUDE.md"
                labelColor="text-foreground-dim"
                code={WITHOUT_OUTPUT}
                annotations={[
                  "No auth middleware",
                  "No input validation",
                  "No audit logging",
                  "Generic error handling",
                  "CommonJS (not project style)",
                ]}
              />
            </Wrapper>
          )}
          {view === "with" && (
            <Wrapper key="with" {...animProps}>
              <CodePanel
                label="With CLAUDE.md"
                labelColor="text-accent"
                code={WITH_OUTPUT}
                annotations={[
                  "requireAuth('admin') ✓",
                  "Zod validation ✓",
                  "Audit logging ✓",
                  "Structured response ✓",
                  "Project conventions ✓",
                ]}
                highlighted
              />
            </Wrapper>
          )}
        </AnimatePresence>
      )}

      {/* ── Show CLAUDE.md context (opens modal) ──────── */}
      <div className="border-t border-border">
        <button
          onClick={() => setShowContext(true)}
          className="w-full px-4 py-2.5 text-left text-xs font-mono text-accent hover:bg-accent-muted transition-colors flex items-center gap-2"
        >
          <span>&#9654;</span>
          Show CLAUDE.md context
        </button>
      </div>

      {/* ── CLAUDE.md context modal (portaled to body) ── */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showContext && (
              <Wrapper
                key="context-modal"
                {...(reduced
                  ? {}
                  : {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      exit: { opacity: 0 },
                      transition: { duration: 0.2 },
                    })}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
                onClick={() => setShowContext(false)}
              >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

                {/* Modal content */}
                <Wrapper
                  {...(reduced
                    ? {}
                    : {
                        initial: { opacity: 0, scale: 0.95, y: 16 },
                        animate: { opacity: 1, scale: 1, y: 0 },
                        exit: { opacity: 0, scale: 0.95, y: 16 },
                        transition: { duration: 0.25, delay: 0.05 },
                      })}
                  className="relative w-full max-w-2xl max-h-[80vh] rounded-xl border border-accent/30 bg-panel shadow-2xl shadow-accent/10 overflow-hidden"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  {/* Modal header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-accent">CLAUDE.md</span>
                      <span className="text-xs text-foreground-dim">Project context file</span>
                    </div>
                    <button
                      onClick={() => setShowContext(false)}
                      className="text-foreground-dim hover:text-foreground transition-colors text-sm px-2 py-1 rounded hover:bg-accent-muted"
                    >
                      ESC
                    </button>
                  </div>

                  {/* Modal body */}
                  <div className="overflow-y-auto max-h-[calc(80vh-52px)] p-5">
                    <pre className="text-xs leading-relaxed text-foreground-muted whitespace-pre-wrap border-0 bg-transparent">
                      <code>{CLAUDE_MD_CONTEXT}</code>
                    </pre>
                  </div>
                </Wrapper>
              </Wrapper>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

/* ── Code panel sub-component ────────────────────────────────────── */

function CodePanel({
  label,
  labelColor,
  code,
  annotations,
  highlighted = false,
}: {
  label: string;
  labelColor: string;
  code: string;
  annotations: string[];
  highlighted?: boolean;
}) {
  return (
    <div className="flex flex-col min-w-0 flex-1">
      {/* Panel label */}
      <div className="px-4 py-2 border-b border-border flex items-center justify-between h-10">
        <span className={`text-xs font-mono font-medium ${labelColor}`}>
          {label}
        </span>
        {highlighted && (
          <span className="text-[10px] font-mono text-accent bg-accent-muted px-1.5 py-0.5 rounded">
            context-aware
          </span>
        )}
      </div>
      {/* Code block */}
      <pre
        className={`px-4 py-3 leading-relaxed overflow-x-auto border-0 bg-transparent flex-1 max-h-[200px] sm:max-h-none overflow-y-auto ${
          highlighted ? "text-foreground" : "text-foreground-muted"
        }`}
        style={{
          fontSize: "clamp(11px, 2.5vw, 14px)",
          ...(highlighted
            ? { boxShadow: "inset 0 0 60px 0 rgba(245, 158, 11, 0.08)" }
            : {}),
        }}
      >
        <code>{code}</code>
      </pre>
      {/* Annotations */}
      <div className="px-4 pt-3 pb-3 flex flex-wrap gap-1.5 border-t border-border/50 mt-auto">
        {annotations.map((a) => (
          <span
            key={a}
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              highlighted
                ? "border-accent/30 text-accent bg-accent-muted"
                : "border-border text-foreground-dim bg-code-bg"
            }`}
          >
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}
