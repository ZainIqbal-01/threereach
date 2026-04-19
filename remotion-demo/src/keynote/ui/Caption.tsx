import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Eyebrow } from "./KineticHeadline";

export const SideCaption: React.FC<{
  eyebrow: string;
  title: string;
  body: string;
  position?: "left" | "right";
  startFrame?: number;
}> = ({ eyebrow, title, body, position = "left", startFrame = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sT = spring({ frame: frame - startFrame - 8, fps, config: { damping: 18, stiffness: 110 } });
  const sB = spring({ frame: frame - startFrame - 22, fps, config: { damping: 20, stiffness: 100 } });
  const align = position === "left" ? "flex-start" : "flex-end";
  const left = position === "left" ? 90 : undefined;
  const right = position === "right" ? 90 : undefined;
  return (
    <div style={{
      position: "absolute", bottom: 90, left, right, maxWidth: 720,
      display: "flex", flexDirection: "column", alignItems: align, gap: 18,
      fontFamily: "Inter, sans-serif",
    }}>
      <Eyebrow text={eyebrow} startFrame={startFrame} />
      <div style={{
        fontSize: 64, fontWeight: 900, color: "#fff", letterSpacing: -1.5, lineHeight: 1.05,
        opacity: sT, transform: `translateY(${(1 - sT) * 22}px)`,
        textAlign: position,
      }}>{title}</div>
      <div style={{
        fontSize: 22, color: "#9AB0D8", fontWeight: 500, lineHeight: 1.5, maxWidth: 640,
        opacity: sB, transform: `translateY(${(1 - sB) * 14}px)`,
        textAlign: position,
      }}>{body}</div>
    </div>
  );
};
