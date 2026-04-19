import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const KineticHeadline: React.FC<{
  text: string;
  startFrame?: number;
  size?: number;
  color?: string;
  weight?: number;
  stagger?: number;
  align?: "left" | "center" | "right";
  style?: React.CSSProperties;
}> = ({ text, startFrame = 0, size = 96, color = "#fff", weight = 900, stagger = 4, align = "center", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.22}px`,
      justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
      lineHeight: 1.05, ...style,
    }}>
      {words.map((w, i) => {
        const s = spring({
          frame: frame - startFrame - i * stagger,
          fps,
          config: { damping: 18, stiffness: 110 },
        });
        const blur = interpolate(s, [0, 1], [16, 0]);
        const ty = (1 - s) * 30;
        return (
          <span key={i} style={{
            display: "inline-block",
            fontSize: size,
            fontWeight: weight,
            color,
            letterSpacing: -size * 0.02,
            opacity: s,
            transform: `translateY(${ty}px)`,
            filter: `blur(${blur}px)`,
          }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Eyebrow: React.FC<{ text: string; startFrame?: number; color?: string }> = ({ text, startFrame = 0, color = "#00E5FF" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - startFrame, fps, config: { damping: 20 } });
  return (
    <div style={{
      fontSize: 22, color, letterSpacing: 7, fontWeight: 700, textTransform: "uppercase",
      opacity: s, transform: `translateY(${(1 - s) * 12}px)`,
    }}>{text}</div>
  );
};
