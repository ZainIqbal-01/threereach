import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont } from "@remotion/google-fonts/Inter";
import { BG } from "./components/BG";
import { TitleScene } from "./scenes/TitleScene";
import { ChapterCard } from "./scenes/ChapterCard";
import { ModuleScene } from "./scenes/ModuleScene";
import { FinalCTA } from "./scenes/FinalCTA";

loadFont("normal", { weights: ["400", "500", "700", "800", "900"], subsets: ["latin"] });

const t = (d = 14) => springTiming({ config: { damping: 200 }, durationInFrames: d });

export const WalkthroughVideo: React.FC = () => {
  // Module duration: 9s = 270 frames each
  const M = 270;
  // Chapter cards: 3s = 90 frames
  const C = 90;

  return (
    <AbsoluteFill style={{ background: "#05070F" }}>
      <BG />
      <TransitionSeries>
        {/* Intro */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <TitleScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(14)} />

        {/* Step 1: Onboarding */}
        <TransitionSeries.Sequence durationInFrames={C}>
          <ChapterCard number="01" title="Tell us about your brand" subtitle="One short form. Sixty seconds. Zero credit card." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={t(18)} />
        <TransitionSeries.Sequence durationInFrames={M}>
          <ModuleScene
            src="screens/01-onboarding.png"
            durationInFrames={M}
            eyebrow="STEP 01 · ONBOARDING"
            title="Plug in your brand context"
            body="Your URL, name, and value prop. Three Reach builds a complete AI knowledge identity from this — schema, entity graph, the works."
            zoom="in"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(14)} />

        {/* Step 2: Overview / Visibility Score */}
        <TransitionSeries.Sequence durationInFrames={C}>
          <ChapterCard number="02" title="See how AI sees you" subtitle="One score. Every engine. Updated daily." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={t(18)} />
        <TransitionSeries.Sequence durationInFrames={M + 60}>
          <ModuleScene
            src="screens/02-overview.png"
            durationInFrames={M + 60}
            eyebrow="MODULE · OVERVIEW"
            title="Your AI Visibility Score"
            body="Live score across ChatGPT, Gemini, Perplexity, Claude & Copilot — with engine confidence, weekly trend, and a 30-day visibility roadmap."
            zoom="in"
            pan="down"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(14)} />

        {/* Step 3: AI Visibility Scan */}
        <TransitionSeries.Sequence durationInFrames={C}>
          <ChapterCard number="03" title="Scan every engine, daily" subtitle="Real queries. Real answers. Real proof." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={t(18)} />
        <TransitionSeries.Sequence durationInFrames={M}>
          <ModuleScene
            src="screens/04-scan.png"
            durationInFrames={M}
            eyebrow="MODULE · AI VISIBILITY SCAN"
            title="Detect mentions on autopilot"
            body="Scout runs query simulations against every major AI engine — tracks position, captures the exact response, and flags missed mentions."
            zoom="out"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(14)} />

        {/* Step 4: Brand Intelligence */}
        <TransitionSeries.Sequence durationInFrames={C}>
          <ChapterCard number="04" title="Decode AI perception" subtitle="Sentiment · positioning · gaps · competitors." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={t(18)} />
        <TransitionSeries.Sequence durationInFrames={M}>
          <ModuleScene
            src="screens/05-brand-intel.png"
            durationInFrames={M}
            eyebrow="MODULE · BRAND INTELLIGENCE"
            title="What AI thinks of your brand"
            body="Oracle benchmarks you against competitors, surfaces narrative drift, and turns AI sentiment into a prioritized action plan."
            zoom="in"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(14)} />

        {/* Step 5: Build Footprint */}
        <TransitionSeries.Sequence durationInFrames={C}>
          <ChapterCard number="05" title="Build the AI footprint" subtitle="GEO + AEO + E-E-A-T, generated for you." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={t(18)} />
        <TransitionSeries.Sequence durationInFrames={M + 60}>
          <ModuleScene
            src="screens/06-footprint.png"
            durationInFrames={M + 60}
            eyebrow="MODULE · BUILD AI FOOTPRINT"
            title="Generative Engine Optimization, automated"
            body="Atlas writes GEO landing copy, ships JSON-LD schema, and stacks E-E-A-T signals — every piece engineered for AI extraction."
            zoom="in"
            pan="down"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(14)} />

        {/* Step 6: Distribution */}
        <TransitionSeries.Sequence durationInFrames={C}>
          <ChapterCard number="06" title="Distribute everywhere" subtitle="Reddit · Quora · LinkedIn · Medium · X · Hacker News." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={t(18)} />
        <TransitionSeries.Sequence durationInFrames={M}>
          <ModuleScene
            src="screens/07-distribution.png"
            durationInFrames={M}
            eyebrow="MODULE · DISTRIBUTION ENGINE"
            title="One brief. Six platforms. Auto-shipped."
            body="Spark generates AI-optimized posts for the platforms LLMs actually crawl — then schedules and tracks reach in one feed."
            zoom="out"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(14)} />

        {/* Step 7: Proof Tracking */}
        <TransitionSeries.Sequence durationInFrames={C}>
          <ChapterCard number="07" title="Prove every citation" subtitle="Verified screenshots. Timestamped. Exportable." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={t(18)} />
        <TransitionSeries.Sequence durationInFrames={M}>
          <ModuleScene
            src="screens/08-proof.png"
            durationInFrames={M}
            eyebrow="MODULE · PROOF & TRACKING"
            title="Receipts for every AI mention"
            body="Sentinel verifies, captures, and timestamps every citation — across ChatGPT, Gemini and Perplexity. Audit-ready proof, on demand."
            zoom="in"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(14)} />

        {/* Step 8: Agent Command Center */}
        <TransitionSeries.Sequence durationInFrames={C}>
          <ChapterCard number="08" title="Your 7-agent fleet" subtitle="Working 24/7. Always on. Never tired." />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={t(18)} />
        <TransitionSeries.Sequence durationInFrames={M + 60}>
          <ModuleScene
            src="screens/03-agents.png"
            durationInFrames={M + 60}
            eyebrow="MODULE · AGENT COMMAND CENTER"
            title="Orchestrate the entire fleet"
            body="Nova, Scout, Oracle, Atlas, Spark, Sentinel & Sage — deploy, schedule and chain them into workflows that run while you sleep."
            zoom="in"
            pan="down"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(14)} />

        {/* Step 9: Agent analytics */}
        <TransitionSeries.Sequence durationInFrames={M}>
          <ModuleScene
            src="screens/09-agent-analytics.png"
            durationInFrames={M}
            eyebrow="FLEET · ANALYTICS"
            title="Measure the machine"
            body="1,614 tasks last month. 95% success rate. Top performer: Spark. Every agent decision, tracked and visible."
            zoom="out"
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(18)} />

        {/* Outro */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <FinalCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
