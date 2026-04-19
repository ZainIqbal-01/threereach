import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const FONT = "Inter, sans-serif";

export const Caption: React.FC<{
  eyebrow: string;
  title: string;
  body?: string;
  position?: "left" | "right" | "center";
}> = ({ eyebrow, title, body, position = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const s2 = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 110 } });
  const s3 = spring({ frame: frame - 16, fps, config: { damping: 18, stiffness: 110 } });

  const align = position === "right" ? "flex-end" : position === "center" ? "center" : "flex-start";
  const textAlign = position === "center" ? ("center" as const) : ("left" as const);

  return (
    <div style={{
      position: "absolute", left: 80, right: 80, bottom: 80,
      display: "flex", flexDirection: "column", alignItems: align,
      fontFamily: FONT, pointerEvents: "none",
    }}>
      <div style={{
        fontSize: 22, color: "#00E5FF", letterSpacing: 6, fontWeight: 700,
        opacity: s1, transform: `translateY(${(1 - s1) * 16}px)`, marginBottom: 12, textAlign,
      }}>
        {eyebrow}
      </div>
      <div style={{
        fontSize: 64, fontWeight: 900, color: "#fff", letterSpacing: -2, lineHeight: 1.05,
        opacity: s2, transform: `translateY(${(1 - s2) * 24}px)`, maxWidth: 1100, textAlign,
        textShadow: "0 4px 30px rgba(0,0,0,0.6)",
      }}>
        {title}
      </div>
      {body && (
        <div style={{
          fontSize: 26, color: "#C8D5EE", marginTop: 16, fontWeight: 500, maxWidth: 980,
          opacity: s3, transform: `translateY(${(1 - s3) * 16}px)`, lineHeight: 1.4, textAlign,
          textShadow: "0 2px 12px rgba(0,0,0,0.7)",
        }}>
          {body}
        </div>
      )}
    </div>
  );
};
