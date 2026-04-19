import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const AppFrame: React.FC<{
  children: React.ReactNode;
  url?: string;
  width?: number;
  height?: number;
  startFrame?: number;
  floatY?: boolean;
  parallax?: boolean;
}> = ({ children, url = "app.threereach.ai", width = 1280, height = 760, startFrame = 0, floatY = true, parallax = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - startFrame, fps, config: { damping: 22, stiffness: 70 } });
  const yFloat = floatY ? Math.sin(frame / 30) * 6 : 0;
  const px = parallax ? interpolate(frame, [0, 300], [0, -8]) : 0;

  return (
    <div style={{
      position: "relative",
      width,
      height,
      borderRadius: 22,
      overflow: "hidden",
      background: "linear-gradient(180deg, #0B1226 0%, #060914 100%)",
      border: "1px solid rgba(0,229,255,0.18)",
      boxShadow: "0 50px 140px rgba(0,0,0,0.7), 0 0 100px rgba(30,107,255,0.22), inset 0 1px 0 rgba(255,255,255,0.05)",
      opacity: enter,
      transform: `translateY(${(1 - enter) * 40 + yFloat}px) translateX(${px}px) scale(${0.96 + enter * 0.04})`,
      transformOrigin: "center center",
    }}>
      {/* Chrome */}
      <div style={{
        height: 38, background: "rgba(10,18,38,0.85)", display: "flex", alignItems: "center",
        paddingLeft: 16, gap: 8, borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
        <div style={{
          marginLeft: 24, padding: "5px 18px", borderRadius: 8, background: "rgba(255,255,255,0.05)",
          color: "#9AB0D8", fontSize: 13, fontFamily: "Inter, sans-serif", letterSpacing: 0.5,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ color: "#00E5FF" }}>●</span> {url}
        </div>
      </div>
      {/* Body */}
      <div style={{ position: "relative", width: "100%", height: height - 38, overflow: "hidden", background: "#0A1226" }}>
        {children}
      </div>
    </div>
  );
};
