import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { CountUp } from "../ui/CountUp";
import { KineticHeadline, Eyebrow } from "../ui/KineticHeadline";

const ENGINES = [
  { name: "ChatGPT", color: "#10A37F" },
  { name: "Gemini", color: "#1E6BFF" },
  { name: "Perplexity", color: "#20B2AA" },
  { name: "Claude", color: "#D97757" },
  { name: "Copilot", color: "#0078D4" },
];

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: "Inter, sans-serif", padding: "100px 120px" }}>
      <div style={{ marginBottom: 30 }}>
        <Eyebrow text="The Reality" startFrame={0} />
      </div>
      <KineticHeadline text="Your customers stopped Googling." startFrame={6} size={92} align="left" />
      <div style={{ marginTop: 16 }}>
        <KineticHeadline text="They're asking AI." startFrame={28} size={92} align="left" color="#00E5FF" />
      </div>

      {/* Engine chips appearing */}
      <div style={{ display: "flex", gap: 18, marginTop: 70, flexWrap: "wrap" }}>
        {ENGINES.map((e, i) => {
          const s = spring({ frame: frame - 60 - i * 6, fps, config: { damping: 18 } });
          const pulse = 0.95 + Math.sin((frame + i * 20) / 12) * 0.04;
          return (
            <div key={e.name} style={{
              padding: "16px 28px", borderRadius: 16,
              background: "rgba(15,25,50,0.7)", border: `1px solid ${e.color}55`,
              boxShadow: `0 0 30px ${e.color}33`,
              display: "flex", alignItems: "center", gap: 12,
              opacity: s, transform: `translateY(${(1 - s) * 20}px) scale(${pulse})`,
            }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: e.color, boxShadow: `0 0 12px ${e.color}` }} />
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 600 }}>{e.name}</span>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 50, marginTop: 90 }}>
        {[
          { v: 73, suffix: "%", label: "of B2B searches in AI by 2026", color: "#00E5FF", start: 110 },
          { v: 40, suffix: "%", label: "of clicks lost to AI answers", color: "#1E6BFF", start: 130 },
          { v: 8, suffix: "%", label: "of brands optimized for AI", color: "#FF4D6D", start: 150 },
        ].map((s, i) => {
          const op = interpolate(frame, [s.start, s.start + 20], [0, 1], { extrapolateRight: "clamp" });
          const ty = interpolate(frame, [s.start, s.start + 20], [30, 0], { extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ opacity: op, transform: `translateY(${ty}px)` }}>
              <div style={{ fontSize: 130, fontWeight: 900, color: s.color, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: -4 }}>
                <CountUp to={s.v} startFrame={s.start} duration={50} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 18, color: "#9AB0D8", marginTop: 10, fontWeight: 500, maxWidth: 280 }}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
