import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const FONT = "Inter, sans-serif";

export const FinalCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = spring({ frame, fps, config: { damping: 16, stiffness: 100 } });
  const t2 = spring({ frame: frame - 18, fps, config: { damping: 16, stiffness: 100 } });
  const t3 = spring({ frame: frame - 38, fps, config: { damping: 16, stiffness: 100 } });
  const url = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      <div style={{
        fontSize: 32, color: "#00E5FF", letterSpacing: 8, fontWeight: 700,
        opacity: t1, transform: `translateY(${(1 - t1) * 16}px)`, marginBottom: 20,
      }}>
        YOUR AI VISIBILITY OS
      </div>
      <div style={{
        fontSize: 130, fontWeight: 900, color: "#fff", letterSpacing: -4, lineHeight: 1, textAlign: "center",
        opacity: t1, transform: `translateY(${(1 - t1) * 30}px)`,
      }}>
        Get cited.
      </div>
      <div style={{
        fontSize: 150, fontWeight: 900, lineHeight: 1, textAlign: "center", letterSpacing: -5, marginTop: 8,
        background: "linear-gradient(135deg, #1E6BFF, #00E5FF)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        opacity: t2, transform: `scale(${0.85 + t2 * 0.15})`,
      }}>
        Get chosen.
      </div>
      <div style={{
        marginTop: 60, padding: "26px 64px", borderRadius: 100,
        background: "linear-gradient(135deg, #1E6BFF, #00E5FF)",
        color: "#fff", fontSize: 38, fontWeight: 800, letterSpacing: 1,
        opacity: t3, transform: `scale(${0.8 + t3 * 0.2})`,
        boxShadow: "0 0 60px rgba(0,229,255,0.6)",
      }}>
        Start free at threereach.ai
      </div>
      <div style={{ marginTop: 28, fontSize: 24, color: "#9AB0D8", opacity: url, letterSpacing: 4, fontWeight: 600 }}>
        SCAN · BUILD · DISTRIBUTE · PROVE
      </div>
    </AbsoluteFill>
  );
};
