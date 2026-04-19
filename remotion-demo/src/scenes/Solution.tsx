import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const FONT = "Inter, sans-serif";

export const Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const tag = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });
  const pillars = [0, 1, 2, 3].map(i => spring({ frame: frame - 35 - i * 6, fps, config: { damping: 18, stiffness: 130 } }));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: logo, transform: `scale(${0.7 + logo * 0.3})` }}>
        <Diamond size={84} />
        <div style={{ fontSize: 96, fontWeight: 900, color: "#fff", letterSpacing: -2 }}>
          Three Reach <span style={{ background: "linear-gradient(135deg,#1E6BFF,#00E5FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
        </div>
      </div>
      <div style={{ marginTop: 24, fontSize: 32, color: "#9AB0D8", opacity: tag, fontWeight: 500 }}>
        The AI Visibility Operating System
      </div>
      <div style={{ display: "flex", gap: 28, marginTop: 70 }}>
        {["SCAN", "BUILD", "DISTRIBUTE", "PROVE"].map((p, i) => (
          <div key={p} style={{
            opacity: pillars[i], transform: `translateY(${(1 - pillars[i]) * 30}px)`,
            padding: "24px 36px", borderRadius: 18,
            background: "linear-gradient(135deg, rgba(30,107,255,0.25), rgba(0,229,255,0.1))",
            border: "1px solid rgba(0,229,255,0.4)",
            color: "#fff", fontSize: 28, fontWeight: 700, letterSpacing: 2,
            boxShadow: "0 0 30px rgba(30,107,255,0.3)"
          }}>{p}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Diamond: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="d" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1E6BFF" />
        <stop offset="100%" stopColor="#00E5FF" />
      </linearGradient>
    </defs>
    <path d="M50 5 L90 50 L50 95 L10 50 Z" fill="url(#d)" stroke="#fff" strokeWidth="2" />
    <path d="M50 5 L50 95 M10 50 L90 50" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
  </svg>
);
