import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const FONT = "Inter, sans-serif";
const AGENTS = [
  { code: "SC", name: "Scout", color: "#00E5FF" },
  { code: "SN", name: "Sentinel", color: "#1E6BFF" },
  { code: "SP", name: "Spark", color: "#FFD166" },
  { code: "SG", name: "Sage", color: "#06D6A0" },
  { code: "SH", name: "Shield", color: "#FF4D6D" },
  { code: "SI", name: "Signal", color: "#A78BFA" },
  { code: "ST", name: "Star", color: "#FF8AC7" },
];

export const Agents: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const title = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const radius = 280;
  const cx = width / 2;
  const cy = height / 2 + 60;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 100, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontSize: 28, color: "#00E5FF", letterSpacing: 6, fontWeight: 600, opacity: title }}>YOUR FLEET</div>
        <div style={{ fontSize: 84, fontWeight: 900, color: "#fff", marginTop: 12, opacity: title, letterSpacing: -2 }}>
          7 AI Agents. <span style={{ background: "linear-gradient(135deg,#1E6BFF,#00E5FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>24/7.</span>
        </div>
      </div>
      {/* center hub */}
      <div style={{
        position: "absolute", left: cx - 90, top: cy - 90, width: 180, height: 180,
        borderRadius: "50%",
        background: "radial-gradient(circle, #1E6BFF, #05070F)",
        border: "2px solid #00E5FF", display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 60px rgba(0,229,255,0.5)",
        opacity: title, transform: `scale(${0.5 + title * 0.5})`
      }}>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 22, textAlign: "center", lineHeight: 1.1 }}>THREE<br/>REACH</div>
      </div>
      {AGENTS.map((a, i) => {
        const angle = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
        const ax = cx + Math.cos(angle) * radius;
        const ay = cy + Math.sin(angle) * radius;
        const s = spring({ frame: frame - 18 - i * 4, fps, config: { damping: 16, stiffness: 130 } });
        const pulse = 1 + Math.sin((frame + i * 12) / 8) * 0.04;
        return (
          <div key={a.code}>
            <svg style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: s * 0.5 }}>
              <line x1={cx} y1={cy} x2={ax} y2={ay} stroke={a.color} strokeWidth="1.5" strokeDasharray="4 6" />
            </svg>
            <div style={{
              position: "absolute", left: ax - 60, top: ay - 60, width: 120, height: 120, borderRadius: "50%",
              background: `linear-gradient(135deg, ${a.color}, ${a.color}88)`,
              border: "3px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 900, fontSize: 32,
              boxShadow: `0 0 30px ${a.color}88`,
              opacity: s, transform: `scale(${s * pulse})`
            }}>{a.code}</div>
            <div style={{
              position: "absolute", left: ax - 80, top: ay + 70, width: 160, textAlign: "center",
              color: "#fff", fontSize: 22, fontWeight: 700, opacity: s
            }}>{a.name}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
