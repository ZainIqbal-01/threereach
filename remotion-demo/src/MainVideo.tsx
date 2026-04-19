import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Hook } from "./scenes/Hook";
import { Problem } from "./scenes/Problem";
import { Solution } from "./scenes/Solution";
import { Modules } from "./scenes/Modules";
import { Agents } from "./scenes/Agents";
import { Outro } from "./scenes/Outro";
import { BG } from "./components/BG";

loadFont("normal", { weights: ["400", "500", "700", "800", "900"], subsets: ["latin"] });

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#05070F" }}>
      <BG />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={75}>
          <Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 12 })} />
        <TransitionSeries.Sequence durationInFrames={75}>
          <Problem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 18 })} />
        <TransitionSeries.Sequence durationInFrames={75}>
          <Solution />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 12 })} />
        <TransitionSeries.Sequence durationInFrames={90}>
          <Modules />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 18 })} />
        <TransitionSeries.Sequence durationInFrames={75}>
          <Agents />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 12 })} />
        <TransitionSeries.Sequence durationInFrames={90}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
