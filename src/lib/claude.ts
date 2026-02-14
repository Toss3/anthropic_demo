/**
 * Claude API integration with demo-mode fallback.
 *
 * In demo mode (default): returns canned outputs instantly.
 * In live mode: calls the Claude API and returns the response.
 *
 * Every caller gets back a string regardless of mode — the interactives
 * do not need to know which mode they're in.
 */

import "server-only";

import type { AppMode } from "./mode";
import { getCannedOutput } from "./canned";

interface ClaudeRequest {
  /** Canned output key used in demo mode. */
  cannedKey: string;
  /** Prompt sent to Claude API in live mode. */
  prompt: string;
  /** Optional system prompt for live mode. */
  system?: string;
  /** Max tokens for live mode response. Default 1024. */
  maxTokens?: number;
}

interface ClaudeResponse {
  mode: AppMode;
  output: string;
}

/**
 * Main entry point: returns either a canned output or a live Claude response.
 */
export async function query(req: ClaudeRequest): Promise<ClaudeResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      mode: "demo",
      output: getCannedOutput(req.cannedKey),
    };
  }

  return {
    mode: "live",
    output: await callClaudeAPI(req),
  };
}

/**
 * Calls the Claude API. Only invoked in live mode.
 * Falls back to canned output on any error so the UI never breaks.
 */
async function callClaudeAPI(req: ClaudeRequest): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return getCannedOutput(req.cannedKey);
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: req.maxTokens ?? 1024,
        system: req.system,
        messages: [{ role: "user", content: req.prompt }],
      }),
    });

    if (!res.ok) {
      console.error(`Claude API error: ${res.status}`);
      return getCannedOutput(req.cannedKey);
    }

    const data = await res.json();
    const textBlock = data.content?.find(
      (b: { type: string }) => b.type === "text"
    );
    return textBlock?.text ?? getCannedOutput(req.cannedKey);
  } catch (err) {
    console.error("Claude API call failed:", err);
    return getCannedOutput(req.cannedKey);
  }
}
