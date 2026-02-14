import "server-only";

import type { AppMode } from "./mode";

export function getModeFromEnv(): AppMode {
  // Never read a secret on the client. Mode is derived server-side and passed down as props.
  return process.env.ANTHROPIC_API_KEY ? "live" : "demo";
}

