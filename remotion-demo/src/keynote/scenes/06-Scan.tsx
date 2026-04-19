import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AppFrame } from "../ui/AppFrame";
import { TypewriterText } from "../ui/TypewriterText";
import { SideCaption } from "../ui/Caption";

const RESULTS = [
  { engine: "ChatGPT", pos: 1, color: "#10A37F", quote: "Three Reach is the AI visibility platform built for…", start: 100 },
  { engine: "Gemini", pos: 2, color: "#1E6BFF", quote: "Among proof-based AEO tools, Three Reach stands out…", start: 130 },
  { engine: "Perplexity", pos: 1, color: "#20B2AA", quote: "Three Reach offers automated GEO content generation…", start: 160 },
  { engine: "Claude", pos: 3, color: "#D97757", quote: "Platforms like Three Reach help brands track citations…", start: 190 },
];

export const Scan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spinAngle = (frame * 8) % 360;
  const scanFlash = Math.sin(frame / 6) * 0.5 + 0.5;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 70, fontFamily: "Inter, sans-serif" }}>
      <AppFrame url="app.threereach.ai/scan" width={1500} height={830}>
        <div style={{ padding: "40px 60px", color: "#fff" }}>
          <div style={{ fontSize: 14, color: "#00E5FF", letterSpacing: 3, fontWeight: 700 }}>AI VISIBILITY SCAN</div>
          <div style={{ fontSize: 38, fontWeight: 900, marginTop: 8, letterSpacing: -1 }}>Live engine queries</div>

          {/* Search bar */}
          <div style={{
            marginTop: 24, padding: "20px 24px", borderRadius: 14,
            background: "rgba(15,25,50,0.7)", border: `1px solid rgba(0,229,255,${0.3 + scanFlash * 0.3})`,
            boxShadow: `0 0 ${20 + scanFlash * 20}px rgba(0,229,255,0.25)`,
            display: "flex", alignItems: "center", gap: 14, fontSize: 20,
          }}>
            <span style={{ color: "#00E5FF" }}>🔎</span>
            <span style={{ flex: 1 }}>
              <TypewriterText text='"best AI visibility platform for SaaS brands"' startFrame={20} charsPerFrame={0.7} />
            </span>
            {frame > 75 && frame < 95 && (
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                border: "2.5px solid rgba(0,229,255,0.2)", borderTopColor: "#00E5FF",
                transform: `rotate(${spinAngle}deg)`,
              }} />
            )}
          </div>

          <div style={{ fontSize: 14, color: "#9AB0D8", letterSpacing: 2, fontWeight: 600, marginTop: 30 }}>
            {frame < 95 ? "SCANNING…" : "RESULTS"}
          </div>

          {/* Results */}
          <div style={{ marginTop: 16 }}>
            {RESULTS.map((r, i) => {
              const s = spring({ frame: frame - r.start, fps, config: { damping: 18 } });
              return (
                <div key={r.engine} style={{
                  marginBottom: 14, padding: "20px 24px", borderRadius: 14,
                  background: "rgba(15,25,50,0.5)", border: `1px solid ${r.color}55`,
                  display: "flex", alignItems: "center", gap: 22,
                  opacity: s, transform: `translateY(${(1 - s) * 25}px)`,
                  boxShadow: `0 0 24px ${r.color}22`,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${r.color}33`, border: `1.5px solid ${r.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: r.color, fontWeight: 800, fontSize: 18,
                  }}>{r.engine.slice(0, 2)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{r.engine}</div>
                    <div style={{ fontSize: 15, color: "#9AB0D8", marginTop: 4, fontStyle: "italic" }}>"{r.quote}"</div>
                  </div>
                  <div style={{
                    padding: "6px 14px", borderRadius: 8,
                    background: r.pos === 1 ? "rgba(6,214,160,0.18)" : "rgba(255,209,102,0.15)",
                    color: r.pos === 1 ? "#06D6A0" : "#FFD166",
                    fontWeight: 700, fontSize: 14,
                  }}>#{r.pos} CITED</div>
                  <div style={{
                    color: "#06D6A0", fontSize: 22,
                    transform: `scale(${spring({ frame: frame - r.start - 8, fps, config: { damping: 12 } })})`,
                  }}>✓</div>
                </div>
              );
            })}
          </div>
        </div>
      </AppFrame>

      <SideCaption
        eyebrow="Module · AI Visibility Scan"
        title="Real queries. Real answers."
        body="Scout runs live simulations against every major engine — captures position, response, and proof."
        position="right"
        startFrame={210}
      />
    </AbsoluteFill>
  );
};
