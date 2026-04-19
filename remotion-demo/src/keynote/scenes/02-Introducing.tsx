import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Eyebrow } from "../ui/KineticHeadline";

export const Introducing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowS = spring({ frame, fps, config: { damping: 22 } });
  const markS = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 100 } });
  const nameS = spring({ frame: frame - 35, fps, config: { damping: 18, stiffness: 110 } });
  const tagS = spring({ frame: frame - 60, fps, config: { damping: 22 } });
  const lineW = interpolate(frame, [50, 90], [0, 480], { extrapolateRight: "clamp" });

  // Slow push in
  const pushScale = interpolate(frame, [0, 200], [1, 1.06]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", transform: `scale(${pushScale})` }}>
      <div style={{ opacity: eyebrowS, marginBottom: 50 }}>
        <Eyebrow text="Introducing" startFrame={0} />
      </div>
      <div style={{
        width: 180, height: 180, borderRadius: 44,
        background: "linear-gradient(135deg, #1E6BFF, #00E5FF)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 100px rgba(0,229,255,0.5), 0 0 200px rgba(30,107,255,0.3)",
        opacity: markS, transform: `scale(${markS}) rotate(${(1 - markS) * 20}deg)`,
        color: "#fff", fontWeight: 900, fontSize: 86, letterSpacing: -3,
      }}>3R</div>

      <div style={{
        fontSize: 144, fontWeight: 900, color: "#fff", letterSpacing: -5, marginTop: 40, lineHeight: 1,
        opacity: nameS, transform: `translateY(${(1 - nameS) * 30}px)`,
      }}>
        Three <span style={{
          background: "linear-gradient(135deg, #1E6BFF, #00E5FF)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Reach</span>
      </div>

      <div style={{ width: lineW, height: 2, background: "linear-gradient(90deg, transparent, #00E5FF, transparent)", marginTop: 32 }} />

      <div style={{
        fontSize: 32, color: "#9AB0D8", marginTop: 32, fontWeight: 400, letterSpacing: 2,
        opacity: tagS, transform: `translateY(${(1 - tagS) * 14}px)`,
      }}>
        The control system for AI visibility.
      </div>
    </AbsoluteFill>
  );
};
