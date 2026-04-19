import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { KineticHeadline, Eyebrow } from "../ui/KineticHeadline";

const AGENTS = [
  { code: "NV", name: "Nova", color: "#00E5FF", role: "Strategist" },
  { code: "SC", name: "Scout", color: "#1E6BFF", role: "Scanner" },
  { code: "OR", name: "Oracle", color: "#A78BFA", role: "Analyst" },
  { code: "AT", name: "Atlas", color: "#06D6A0", role: "Builder" },
  { code: "SP", name: "Spark", color: "#FFD166", role: "Distributor" },
  { code: "SN", name: "Sentinel", color: "#FF4D6D", role: "Verifier" },
  { code: "SG", name: "Sage", color: "#FF8AC7", role: "Optimizer" },
];

export const AgentFleet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cx = 960;
  const cy = 600;
  const radius = 280;

  const titleS = spring({ frame, fps, config: { damping: 18 } });
  const hubS = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 100 } });
  // Slow rotation
  const rot = (frame / 4) * (Math.PI / 180);

  return (
    <AbsoluteFill style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Title */}
      <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center" }}>
        <Eyebrow text="Your Fleet" startFrame={0} />
        <div style={{ marginTop: 18 }}>
          <KineticHeadline text="7 AI agents. 24/7." startFrame={6} size={84} />
        </div>
      </div>

      {/* Connection lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r="200" fill="url(#hubGlow)" opacity={hubS} />
        {AGENTS.map((a, i) => {
          const baseAngle = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
          const angle = baseAngle + rot * 0.3;
          const ax = cx + Math.cos(angle) * radius;
          const ay = cy + Math.sin(angle) * radius;
          const s = spring({ frame: frame - 24 - i * 5, fps, config: { damping: 16 } });
          // Pulse beam
          const pulseT = ((frame - 50 - i * 14) % 90) / 90;
          const pulseOp = pulseT > 0 && pulseT < 1 ? Math.sin(pulseT * Math.PI) * 0.7 : 0;
          return (
            <g key={a.code}>
              <line x1={cx} y1={cy} x2={ax} y2={ay} stroke={a.color} strokeWidth="1" strokeDasharray="3 6" opacity={s * 0.4} />
              {pulseOp > 0 && (
                <circle cx={cx + (ax - cx) * pulseT} cy={cy + (ay - cy) * pulseT} r="6" fill={a.color} opacity={pulseOp}>
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Hub */}
      <div style={{
        position: "absolute", left: cx - 90, top: cy - 90, width: 180, height: 180, borderRadius: "50%",
        background: "radial-gradient(circle, #1E6BFF, #05070F 80%)",
        border: "2px solid #00E5FF",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 ${60 + Math.sin(frame / 12) * 20}px rgba(0,229,255,0.6)`,
        opacity: hubS, transform: `scale(${0.5 + hubS * 0.5})`,
      }}>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 22, textAlign: "center", lineHeight: 1.1, letterSpacing: -0.5 }}>
          THREE<br/>REACH<br/><span style={{ fontSize: 11, letterSpacing: 4, color: "#00E5FF" }}>CORE</span>
        </div>
      </div>

      {/* Agent orbs */}
      {AGENTS.map((a, i) => {
        const baseAngle = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
        const angle = baseAngle + rot * 0.3;
        const ax = cx + Math.cos(angle) * radius;
        const ay = cy + Math.sin(angle) * radius;
        const s = spring({ frame: frame - 24 - i * 5, fps, config: { damping: 16 } });
        // Activate pulse
        const activeT = ((frame + i * 10) / 24) % 6;
        const isActive = activeT < 1.2;
        const pulse = 1 + (isActive ? Math.sin(activeT * Math.PI / 1.2) * 0.08 : 0);
        return (
          <div key={a.code}>
            <div style={{
              position: "absolute", left: ax - 60, top: ay - 60, width: 120, height: 120, borderRadius: "50%",
              background: `linear-gradient(135deg, ${a.color}, ${a.color}88)`,
              border: "3px solid rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 900, fontSize: 30, letterSpacing: -1,
              boxShadow: `0 0 ${30 + (isActive ? 30 : 0)}px ${a.color}`,
              opacity: s, transform: `scale(${s * pulse})`,
            }}>{a.code}</div>
            <div style={{
              position: "absolute", left: ax - 100, top: ay + 70, width: 200, textAlign: "center",
              opacity: s,
            }}>
              <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>{a.name}</div>
              <div style={{ color: a.color, fontSize: 12, letterSpacing: 3, fontWeight: 600, marginTop: 2 }}>{a.role.toUpperCase()}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
