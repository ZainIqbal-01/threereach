import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { ReelVideo } from "./ReelVideo";
import { WalkthroughVideo } from "./WalkthroughVideo";
import { KeynoteVideo } from "./keynote/KeynoteVideo";

// Sum of sequences minus overlapping transitions
// 250+510+300+270+310+300+330+310+360+360+310+360+210 = 4180
// minus 12 transitions ~ 18f each ≈ 216 → 3964. Add small buffer.
const KEYNOTE_FRAMES = 4000;

export const RemotionRoot = () => (
  <>
    <Composition
      id="main"
      component={MainVideo}
      durationInFrames={450}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="reel"
      component={ReelVideo}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="walkthrough"
      component={WalkthroughVideo}
      durationInFrames={5500}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="keynote"
      component={KeynoteVideo}
      durationInFrames={KEYNOTE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

