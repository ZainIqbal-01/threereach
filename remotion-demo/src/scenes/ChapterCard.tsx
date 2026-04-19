import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const FONT = "Inter, sans-serif";

export const ChapterCard: React.FC<{ number: string; title: string; subtitle: string }> = ({ number, title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame, fps, config: { damping: 16, stiffness: 100 } });
  const s2 = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 110 } });
  const s3 = spring({ frame: frame - 18, fps, config: { damping: 18, stiffness: 110 } });
  const lineW = interpolate(spring({ frame: frame - 4, fps, config: { damping: 200 } }), [0, 1], [0, 220]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      <div style={{
        fontSize: 220, fontWeight: 900, color: "transparent",
        WebkitTextStroke: "2px rgba(0,229,255,0.4)",
        opacity: s1, transform: `translateY(${(1 - s1) * 30}px)`, lineHeight: 1, letterSpacing: -8,
      }}>
        {number}
      </div>
      <div style={{ width: lineW, height: 3, background: "linear-gradient(90deg,#1E6BFF,#00E5FF)", margin: "20px 0 30px", borderRadius: 4 }} />
      <div style={{
        fontSize: 84, fontWeight: 900, color: "#fff", letterSpacing: -2, textAlign: "center",
        opacity: s2, transform: `translateY(${(1 - s2) * 24}px)`,
      }}>
        {title}
      </div>
      <div style={{
        fontSize: 28, color: "#9AB0D8", marginTop: 18, fontWeight: 500, textAlign: "center", maxWidth: 1100,
        opacity: s3, transform: `translateY(${(1 - s3) * 16}px)`,
      }}>
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};
