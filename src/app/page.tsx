import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { HeroStory } from "@/components/sections/HeroStory";
import { Closing } from "@/components/sections/Closing";
import { InteractionHint } from "@/components/ui/InteractionHint";
import {
  LazyClaudeMDCompare,
  LazyTestCoveragePanel,
  LazyMCPDiagram,
  LazyIncrementalDiffViewer,
} from "@/components/interactive/lazy";
import { heroStories } from "@/lib/stories";

/* ── Below-fold sections: code-split (keep SSR for HTML content) ── */

const Vignettes = dynamic(() =>
  import("@/components/sections/Vignettes").then((m) => ({
    default: m.Vignettes,
  }))
);

const Perspectives = dynamic(() =>
  import("@/components/sections/Perspectives").then((m) => ({
    default: m.Perspectives,
  }))
);

const SalesBuilder = dynamic(() =>
  import("@/components/sections/SalesBuilder").then((m) => ({
    default: m.SalesBuilder,
  }))
);

/* ── Interactive map ──────────────────────────────────────────────── */

const storyInteractives: Record<string, React.ReactNode> = {
  "story-claudemd": (
    <InteractionHint hint="Toggle views to compare output">
      <LazyClaudeMDCompare />
    </InteractionHint>
  ),
  "story-testing": (
    <InteractionHint hint="Click Run Tests to see the transformation">
      <LazyTestCoveragePanel />
    </InteractionHint>
  ),
  "story-mcp": (
    <InteractionHint hint="Click nodes or Run Flow to explore">
      <LazyMCPDiagram />
    </InteractionHint>
  ),
  "story-legacy": (
    <InteractionHint hint="Step through each refactoring stage">
      <LazyIncrementalDiffViewer />
    </InteractionHint>
  ),
};

export default function Home() {
  return (
    <main>
      {/* ── Section 1: Hero ───────────────────────────────────────── */}
      <Hero />

      {/* ── Sections 2-5: Hero Stories ────────────────────────────── */}
      {heroStories.map((story) => (
        <HeroStory
          key={story.id}
          story={story}
          interactive={storyInteractives[story.id]}
        />
      ))}

      {/* ── Section 6: Vignettes ──────────────────────────────────── */}
      <Vignettes />

      {/* ── Section 7: Audience Perspectives ──────────────────────── */}
      <Perspectives />

      {/* ── Section 8: Sales Story Builder ─────────────────────────── */}
      <SalesBuilder />

      {/* ── Section 9: Closing ────────────────────────────────────── */}
      <Closing />
    </main>
  );
}
