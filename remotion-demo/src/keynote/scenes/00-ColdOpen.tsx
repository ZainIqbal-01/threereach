import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Light line draws across at f=10
  const lineW = interpolate(frame, [10, 50], [0, 1200], { extrapolateRight: "clamp" });
  const lineFade = interpolate(frame, [80, 120], [1, 0], { extrapolateRight: "clamp" });

  // Whisper text
  const whisperOp = interpolate(frame, [60, 90, 150, 180], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  // Mark ignition
  const markS = spring({ frame: frame - 175, fps, config: { damping: 14, stiffness: 90 } });
  const markGlow = interpolate(frame, [175, 220], [0, 1], { extrapolateRight: "clamp" });
  const taglineS = spring({ frame: frame - 200, fps, config: { damping: 22 } });

  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: "Inter, sans-serif", alignItems: "center", justifyContent: "center" }}>
      {/* Light line */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: lineW, height: 2, transform: "translate(-50%, -50%)",
        background: "linear-gradient(90deg, transparent, #00E5FF, transparent)",
        opacity: lineFade,
        boxShadow: "0 0 40px #00E5FF, 0 0 80px #1E6BFF",
      }} />

      {/* Whisper line */}
      <div style={{
        position: "absolute", color: "rgba(255,255,255,0.85)",
        fontSize: 56, fontWeight: 300, letterSpacing: -1, opacity: whisperOp,
        textAlign: "center",
      }}>
        What if AI <em style={{ color: "#00E5FF", fontStyle: "italic", fontWeight: 500 }}>never</em> mentioned you?
      </div>

      {/* Mark */}
      <div style={{
        opacity: markS, transform: `scale(${0.6 + markS * 0.4})`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
      }}>
        <div style={{
          width: 120, height: 120, borderRadius: 30,
          background: "linear-gradient(135deg, #1E6BFF, #00E5FF)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 ${60 * markGlow}px #00E5FF, 0 0 ${120 * markGlow}px #1E6BFF`,
          color: "#fff", fontWeight: 900, fontSize: 56, letterSpacing: -2,
        }}>3R</div>
        <div style={{
          fontSize: 56, fontWeight: 900, color: "#fff", letterSpacing: -2,
          opacity: taglineS, transform: `translateY(${(1 - taglineS) * 14}px)`,
        }}>
          Three Reach
        </div>
      </div>
    </AbsoluteFill>
  );
};
