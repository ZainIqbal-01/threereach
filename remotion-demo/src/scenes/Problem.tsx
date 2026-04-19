import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const FONT = "Inter, sans-serif";

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headline = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const stat = interpolate(frame, [15, 60], [0, 78], { extrapolateRight: "clamp" });
  const cardOp = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: 80 }}>
      <div style={{
        fontSize: 64, fontWeight: 800, color: "#fff", textAlign: "center",
        opacity: headline, transform: `translateY(${(1 - headline) * 30}px)`, maxWidth: 1400, lineHeight: 1.1
      }}>
        Your customers are asking AI.
      </div>
      <div style={{ display: "flex", gap: 40, marginTop: 80, opacity: cardOp }}>
        <Stat label="of B2B searches in AI by 2026" value={`${Math.round(stat)}%`} accent="#00E5FF" />
        <Stat label="of clicks lost to AI answers" value={`${Math.round(stat * 0.5)}%`} accent="#1E6BFF" />
        <Stat label="brands ready" value={`${Math.round(8 - stat * 0.05)}%`} accent="#FF4D6D" />
      </div>
    </AbsoluteFill>
  );
};

const Stat: React.FC<{ label: string; value: string; accent: string }> = ({ label, value, accent }) => (
  <div style={{
    width: 380, padding: 36, borderRadius: 24,
    background: "rgba(15,25,50,0.7)", border: `1px solid ${accent}55`,
    boxShadow: `0 0 40px ${accent}22`, backdropFilter: "blur(8px)"
  }}>
    <div style={{ fontSize: 110, fontWeight: 900, color: accent, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    <div style={{ fontSize: 20, color: "#B6C7E8", marginTop: 12, fontWeight: 500 }}>{label}</div>
  </div>
);
