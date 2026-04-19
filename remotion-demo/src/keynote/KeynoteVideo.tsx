import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont } from "@remotion/google-fonts/Inter";

import { CinematicBG } from "./ui/CinematicBG";
import { ColdOpen } from "./scenes/00-ColdOpen";
import { Problem } from "./scenes/01-Problem";
import { Introducing } from "./scenes/02-Introducing";
import { FourPillars } from "./scenes/03-FourPillars";
import { Onboarding } from "./scenes/04-Onboarding";
import { Score } from "./scenes/05-Score";
import { Scan } from "./scenes/06-Scan";
import { BrandIntel } from "./scenes/07-BrandIntel";
import { Footprint } from "./scenes/08-Footprint";
import { Distribution } from "./scenes/09-Distribution";
import { Proof } from "./scenes/10-Proof";
import { AgentFleet } from "./scenes/11-AgentFleet";
import { Closing } from "./scenes/12-Closing";

loadFont("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

const t = (d = 18) => springTiming({ config: { damping: 200 }, durationInFrames: d });

// Total target ≈ 5400 frames at 30fps = 3:00
// Account for transitions overlapping (each ~18f)
export const KeynoteVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#02030A", fontFamily: "Inter, sans-serif" }}>
      <CinematicBG />
      <TransitionSeries>
        {/* 0-240 Cold Open (~8s) */}
        <TransitionSeries.Sequence durationInFrames={250}>
          <ColdOpen />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(20)} />

        {/* Problem (~17s = 510f) */}
        <TransitionSeries.Sequence durationInFrames={510}>
          <Problem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(20)} />

        {/* Introducing (~10s) */}
        <TransitionSeries.Sequence durationInFrames={300}>
          <Introducing />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={t(22)} />

        {/* Four Pillars (~9s) */}
        <TransitionSeries.Sequence durationInFrames={270}>
          <FourPillars />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(18)} />

        {/* Onboarding (~10s) */}
        <TransitionSeries.Sequence durationInFrames={310}>
          <Onboarding />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(18)} />

        {/* Score (~10s) */}
        <TransitionSeries.Sequence durationInFrames={300}>
          <Score />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={t(20)} />

        {/* Scan (~11s) */}
        <TransitionSeries.Sequence durationInFrames={330}>
          <Scan />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(18)} />

        {/* Brand Intel (~10s) */}
        <TransitionSeries.Sequence durationInFrames={310}>
          <BrandIntel />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(18)} />

        {/* Footprint (~12s) */}
        <TransitionSeries.Sequence durationInFrames={360}>
          <Footprint />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={t(20)} />

        {/* Distribution (~12s) */}
        <TransitionSeries.Sequence durationInFrames={360}>
          <Distribution />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(18)} />

        {/* Proof (~10s) */}
        <TransitionSeries.Sequence durationInFrames={310}>
          <Proof />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(20)} />

        {/* Agent Fleet (~12s) */}
        <TransitionSeries.Sequence durationInFrames={360}>
          <AgentFleet />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t(22)} />

        {/* Closing (~7s) */}
        <TransitionSeries.Sequence durationInFrames={210}>
          <Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
