import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { KineticHeadline, Eyebrow } from "../ui/KineticHeadline";

export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markS = spring({ frame, fps, config: { damping: 16, stiffness: 100 } });
  const taglineS = spring({ frame: frame - 35, fps, config: { damping: 18 } });
  const urlS = spring({ frame: frame - 90, fps, config: { damping: 22 } });

  // Push out at end
  const pushScale = interpolate(frame, [120, 180], [1, 1.08]);
  const fadeOut = interpolate(frame, [150, 180], [1, 0.7]);

  return (
    <AbsoluteFill style={{
      alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif",
      transform: `scale(${pushScale})`, opacity: fadeOut,
    }}>
      <div style={{
        width: 140, height: 140, borderRadius: 36,
        background: "linear-gradient(135deg, #1E6BFF, #00E5FF)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 80px rgba(0,229,255,0.5), 0 0 160px rgba(30,107,255,0.3)",
        opacity: markS, transform: `scale(${markS}) rotate(${(1 - markS) * 12}deg)`,
        color: "#fff", fontWeight: 900, fontSize: 64, letterSpacing: -2, marginBottom: 50,
      }}>3R</div>

      <div style={{ opacity: taglineS, transform: `translateY(${(1 - taglineS) * 20}px)`, textAlign: "center" }}>
        <KineticHeadline text="Get cited." startFrame={35} size={120} stagger={6} />
        <div style={{ marginTop: 8 }}>
          <KineticHeadline text="Get chosen." startFrame={55} size={120} color="#00E5FF" stagger={6} />
        </div>
      </div>

      <div style={{
        marginTop: 60, padding: "20px 40px", borderRadius: 100,
        background: "rgba(15,25,50,0.7)", border: "1px solid rgba(0,229,255,0.4)",
        boxShadow: "0 0 40px rgba(0,229,255,0.2)",
        opacity: urlS, transform: `translateY(${(1 - urlS) * 14}px)`,
        fontSize: 28, fontWeight: 600, color: "#fff", letterSpacing: 1,
      }}>
        threereach.ai
      </div>
    </AbsoluteFill>
  );
};
