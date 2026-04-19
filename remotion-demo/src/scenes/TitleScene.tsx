import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const FONT = "Inter, sans-serif";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 16, stiffness: 100 } });
  const t1 = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 110 } });
  const t2 = spring({ frame: frame - 22, fps, config: { damping: 18, stiffness: 110 } });
  const sub = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      <div style={{
        opacity: logo, transform: `scale(${0.6 + logo * 0.4})`, marginBottom: 40,
      }}>
        <svg width={120} height={120} viewBox="0 0 100 100">
          <defs>
            <linearGradient id="dia" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E6BFF" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>
          </defs>
          <path d="M50 5 L90 50 L50 95 L10 50 Z" fill="url(#dia)" stroke="#fff" strokeWidth="2" />
          <path d="M50 5 L50 95 M10 50 L90 50" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        </svg>
      </div>
      <div style={{
        fontSize: 32, color: "#00E5FF", letterSpacing: 8, fontWeight: 700,
        opacity: t1, transform: `translateY(${(1 - t1) * 20}px)`, marginBottom: 20,
      }}>
        PRODUCT WALKTHROUGH
      </div>
      <div style={{
        fontSize: 140, fontWeight: 900, color: "#fff", letterSpacing: -4, lineHeight: 1, textAlign: "center",
        opacity: t2, transform: `scale(${0.9 + t2 * 0.1})`,
      }}>
        Three Reach <span style={{
          background: "linear-gradient(135deg,#1E6BFF,#00E5FF)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>AI</span>
      </div>
      <div style={{
        marginTop: 32, fontSize: 32, color: "#9AB0D8", fontWeight: 500, opacity: sub, textAlign: "center", maxWidth: 1200,
      }}>
        The AI Visibility Operating System — see how it works, end to end.
      </div>
    </AbsoluteFill>
  );
};
