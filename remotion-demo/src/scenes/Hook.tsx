import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const FONT = "Inter, sans-serif";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const s2 = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 120 } });
  const s3 = spring({ frame: frame - 22, fps, config: { damping: 16, stiffness: 110 } });
  const subOp = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: "clamp" });
  const blur = interpolate(s1, [0, 1], [12, 0]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      <div style={{
        fontSize: 36, color: "#00E5FF", letterSpacing: 8, fontWeight: 600,
        opacity: s1, transform: `translateY(${(1 - s1) * 20}px)`, marginBottom: 30
      }}>
        THE NEW SEARCH
      </div>
      <div style={{
        fontSize: 180, fontWeight: 900, color: "#fff", lineHeight: 1, textAlign: "center",
        filter: `blur(${blur}px)`, opacity: s1, letterSpacing: -4
      }}>
        AI is the
      </div>
      <div style={{
        fontSize: 220, fontWeight: 900, lineHeight: 1, textAlign: "center", letterSpacing: -6,
        opacity: s2, transform: `scale(${0.8 + s2 * 0.2})`,
        background: "linear-gradient(135deg, #1E6BFF 0%, #00E5FF 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textShadow: "0 0 60px rgba(0,229,255,0.4)"
      }}>
        new Google.
      </div>
      <div style={{ marginTop: 40, fontSize: 28, color: "#9AB0D8", opacity: subOp, fontWeight: 500 }}>
        Are you visible to ChatGPT, Gemini & Perplexity?
      </div>
    </AbsoluteFill>
  );
};
