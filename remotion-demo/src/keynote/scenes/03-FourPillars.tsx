import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { KineticHeadline, Eyebrow } from "../ui/KineticHeadline";

const PILLARS = [
  { icon: "◉", title: "Scan", desc: "Every engine. Every day.", color: "#00E5FF" },
  { icon: "◆", title: "Build", desc: "GEO + AEO + E-E-A-T.", color: "#1E6BFF" },
  { icon: "▲", title: "Distribute", desc: "Where LLMs crawl.", color: "#A78BFA" },
  { icon: "✓", title: "Prove", desc: "Receipts on demand.", color: "#06D6A0" },
];

export const FourPillars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: "Inter, sans-serif", padding: 100, alignItems: "center" }}>
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Eyebrow text="One Platform · Four Engines" startFrame={0} />
        <div style={{ marginTop: 24 }}>
          <KineticHeadline text="Built for the AI answer era." startFrame={6} size={84} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 40, marginTop: 100 }}>
        {PILLARS.map((p, i) => {
          const s = spring({ frame: frame - 50 - i * 10, fps, config: { damping: 18, stiffness: 110 } });
          const float = Math.sin((frame + i * 30) / 24) * 6;
          return (
            <div key={p.title} style={{
              width: 320, height: 380, borderRadius: 28, padding: 36,
              background: "linear-gradient(180deg, rgba(15,25,50,0.85), rgba(8,14,30,0.9))",
              border: `1px solid ${p.color}44`,
              boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${p.color}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
              opacity: s, transform: `translateY(${(1 - s) * 50 + float}px) scale(${0.9 + s * 0.1})`,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div style={{
                fontSize: 88, color: p.color, lineHeight: 1, fontWeight: 900,
                textShadow: `0 0 30px ${p.color}88`,
              }}>{p.icon}</div>
              <div>
                <div style={{ fontSize: 56, fontWeight: 900, color: "#fff", letterSpacing: -1.5 }}>{p.title}</div>
                <div style={{ fontSize: 20, color: "#9AB0D8", marginTop: 12, fontWeight: 500 }}>{p.desc}</div>
                <div style={{ fontSize: 14, color: p.color, marginTop: 24, letterSpacing: 4, fontWeight: 700 }}>
                  0{i + 1}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
