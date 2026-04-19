import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const FONT = "Inter, sans-serif";

const MODULES = [
  { name: "AI Scan", desc: "Detect brand mentions across engines" },
  { name: "Brand Intel", desc: "Visibility scores & competitor benchmarks" },
  { name: "Footprint", desc: "GEO/AEO landing pages with E-E-A-T" },
  { name: "Distribution", desc: "Auto-publish to Reddit, LinkedIn, X" },
  { name: "Proof Tracking", desc: "Citations, mentions & sentiment" },
  { name: "Agent Center", desc: "7 agents working 24/7" },
];

export const Modules: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: 80 }}>
      <div style={{ fontSize: 28, color: "#00E5FF", letterSpacing: 6, fontWeight: 600, opacity: title }}>
        ONE PLATFORM
      </div>
      <div style={{ fontSize: 76, fontWeight: 900, color: "#fff", marginTop: 12, opacity: title, marginBottom: 60, letterSpacing: -2 }}>
        Six Modules. Total Coverage.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, width: "100%", maxWidth: 1500 }}>
        {MODULES.map((m, i) => {
          const s = spring({ frame: frame - 18 - i * 5, fps, config: { damping: 18, stiffness: 130 } });
          return (
            <div key={m.name} style={{
              opacity: s, transform: `translateY(${(1 - s) * 40}px)`,
              padding: 32, borderRadius: 20,
              background: "rgba(15,25,50,0.7)",
              border: "1px solid rgba(30,107,255,0.4)",
              boxShadow: "0 0 30px rgba(30,107,255,0.15)"
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#1E6BFF,#00E5FF)", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 22 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>{m.name}</div>
              <div style={{ fontSize: 18, color: "#9AB0D8", marginTop: 8, fontWeight: 500 }}>{m.desc}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
