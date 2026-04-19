import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const FONT = "Inter, sans-serif";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headline = spring({ frame, fps, config: { damping: 16, stiffness: 100 } });
  const sub = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });
  const cta = spring({ frame: frame - 40, fps, config: { damping: 14, stiffness: 100 } });
  const url = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      <div style={{
        fontSize: 140, fontWeight: 900, color: "#fff", letterSpacing: -4, lineHeight: 1, textAlign: "center",
        opacity: headline, transform: `translateY(${(1 - headline) * 30}px)`
      }}>
        Get cited.
      </div>
      <div style={{
        fontSize: 160, fontWeight: 900, lineHeight: 1, textAlign: "center", letterSpacing: -5,
        background: "linear-gradient(135deg, #1E6BFF, #00E5FF)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        opacity: sub, transform: `scale(${0.85 + sub * 0.15})`,
        textShadow: "0 0 80px rgba(0,229,255,0.5)"
      }}>
        Get chosen.
      </div>
      <div style={{
        marginTop: 60, padding: "28px 64px", borderRadius: 100,
        background: "linear-gradient(135deg, #1E6BFF, #00E5FF)",
        color: "#fff", fontSize: 36, fontWeight: 800, letterSpacing: 1,
        opacity: cta, transform: `scale(${0.8 + cta * 0.2})`,
        boxShadow: "0 0 60px rgba(0,229,255,0.6)"
      }}>
        Start free →
      </div>
      <div style={{ marginTop: 28, fontSize: 28, color: "#9AB0D8", opacity: url, letterSpacing: 4, fontWeight: 600 }}>
        THREEREACH.AI
      </div>
    </AbsoluteFill>
  );
};
