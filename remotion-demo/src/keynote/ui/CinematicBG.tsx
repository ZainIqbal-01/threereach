import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const CinematicBG: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const drift1 = Math.sin(frame / 90) * 60;
  const drift2 = Math.cos(frame / 110) * 80;
  const pulse = 0.6 + Math.sin(frame / 50) * 0.1;

  return (
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse at 30% 20%, #0A1638 0%, #05070F 55%, #02030A 100%)",
      overflow: "hidden",
    }}>
      {/* Glow blobs */}
      <div style={{
        position: "absolute", left: 200 + drift1, top: 100 + drift2, width: 700, height: 700,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(30,107,255,0.35) 0%, transparent 60%)",
        opacity: pulse * intensity,
        filter: "blur(40px)",
      }} />
      <div style={{
        position: "absolute", right: 100 - drift1, bottom: 50 + drift2 * 0.5, width: 800, height: 800,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,229,255,0.18) 0%, transparent 60%)",
        opacity: pulse * intensity,
        filter: "blur(60px)",
      }} />

      {/* Grid */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.06 * intensity }}>
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#00E5FF" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Subtle particles */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = ((i * 173) % 1920);
        const y = ((i * 211) % 1080);
        const op = ((Math.sin((frame + i * 20) / 30) + 1) / 2) * 0.4;
        const size = 1 + (i % 3);
        return <div key={i} style={{
          position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%",
          background: i % 3 === 0 ? "#00E5FF" : "#1E6BFF", opacity: op * intensity,
        }} />;
      })}

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
