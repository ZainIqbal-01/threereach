import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont } from "@remotion/google-fonts/Inter";
import { BG } from "./components/BG";

loadFont("normal", { weights: ["400", "700", "800", "900"], subsets: ["latin"] });

const FONT = "Inter, sans-serif";

const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const s2 = spring({ frame: frame - 12, fps, config: { damping: 16, stiffness: 110 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: 60 }}>
      <div style={{ fontSize: 36, color: "#00E5FF", letterSpacing: 6, fontWeight: 700, opacity: s }}>STOP</div>
      <div style={{ fontSize: 140, fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1, marginTop: 24, opacity: s, letterSpacing: -3 }}>
        chasing
      </div>
      <div style={{
        fontSize: 180, fontWeight: 900, lineHeight: 1, textAlign: "center", letterSpacing: -5,
        background: "linear-gradient(135deg,#1E6BFF,#00E5FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        opacity: s2, transform: `scale(${0.8 + s2 * 0.2})`
      }}>Google.</div>
    </AbsoluteFill>
  );
};

const Beat2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const s2 = spring({ frame: frame - 12, fps, config: { damping: 16, stiffness: 110 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: 60 }}>
      <div style={{ fontSize: 36, color: "#00E5FF", letterSpacing: 6, fontWeight: 700, opacity: s }}>START</div>
      <div style={{ fontSize: 130, fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1, marginTop: 24, opacity: s, letterSpacing: -3 }}>
        getting cited
      </div>
      <div style={{
        fontSize: 100, fontWeight: 900, lineHeight: 1, textAlign: "center", marginTop: 16,
        background: "linear-gradient(135deg,#1E6BFF,#00E5FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        opacity: s2, transform: `scale(${0.85 + s2 * 0.15})`
      }}>by ChatGPT.</div>
    </AbsoluteFill>
  );
};

const Beat3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const score = interpolate(frame, [0, 50], [0, 87], { extrapolateRight: "clamp" });
  const ringFrac = score / 100;
  const r = 200;
  const c = 2 * Math.PI * r;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      <div style={{ fontSize: 36, color: "#9AB0D8", letterSpacing: 4, fontWeight: 600, marginBottom: 30 }}>VISIBILITY SCORE</div>
      <svg width={500} height={500} viewBox="0 0 500 500">
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E6BFF" /><stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
        </defs>
        <circle cx={250} cy={250} r={r} stroke="rgba(255,255,255,0.1)" strokeWidth="22" fill="none" />
        <circle cx={250} cy={250} r={r} stroke="url(#rg)" strokeWidth="22" fill="none"
          strokeLinecap="round" strokeDasharray={`${c * ringFrac} ${c}`} strokeDashoffset={0}
          transform="rotate(-90 250 250)" style={{ filter: "drop-shadow(0 0 12px #00E5FF)" }} />
        <text x="250" y="270" textAnchor="middle" fontSize="160" fontWeight="900" fill="#fff" fontFamily={FONT}>{Math.round(score)}</text>
      </svg>
      <div style={{ fontSize: 30, color: "#fff", marginTop: 20, fontWeight: 700 }}>+62 pts in 30 days</div>
    </AbsoluteFill>
  );
};

const Beat4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const cta = spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 100 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: 60 }}>
      <div style={{
        fontSize: 130, fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1, letterSpacing: -3,
        opacity: s, transform: `translateY(${(1 - s) * 30}px)`
      }}>
        Three<br/>Reach <span style={{ background: "linear-gradient(135deg,#1E6BFF,#00E5FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
      </div>
      <div style={{ fontSize: 36, color: "#9AB0D8", marginTop: 30, fontWeight: 600, opacity: s, textAlign: "center" }}>
        AI Visibility OS
      </div>
      <div style={{
        marginTop: 80, padding: "28px 60px", borderRadius: 100,
        background: "linear-gradient(135deg,#1E6BFF,#00E5FF)",
        color: "#fff", fontSize: 38, fontWeight: 800,
        opacity: cta, transform: `scale(${0.8 + cta * 0.2})`,
        boxShadow: "0 0 60px rgba(0,229,255,0.6)"
      }}>threereach.ai</div>
    </AbsoluteFill>
  );
};

export const ReelVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "#05070F" }}>
    <BG />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={70}><Beat1 /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 10 })} />
      <TransitionSeries.Sequence durationInFrames={70}><Beat2 /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 10 })} />
      <TransitionSeries.Sequence durationInFrames={80}><Beat3 /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: 10 })} />
      <TransitionSeries.Sequence durationInFrames={80}><Beat4 /></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
