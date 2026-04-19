import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AppFrame } from "../ui/AppFrame";
import { CountUp } from "../ui/CountUp";
import { SideCaption } from "../ui/Caption";

const CITATIONS = [
  { engine: "ChatGPT", color: "#10A37F", time: "2 min ago", query: "best AI visibility platform", start: 30 },
  { engine: "Gemini", color: "#1E6BFF", time: "8 min ago", query: "tools for AEO 2025", start: 65 },
  { engine: "Perplexity", color: "#20B2AA", time: "14 min ago", query: "track AI mentions", start: 100 },
  { engine: "Claude", color: "#D97757", time: "22 min ago", query: "GEO software for SaaS", start: 135 },
];

export const Proof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Capture flash
  const flash = (() => {
    for (const c of CITATIONS) {
      if (frame >= c.start && frame < c.start + 8) {
        return interpolate(frame - c.start, [0, 4, 8], [0, 0.4, 0]);
      }
    }
    return 0;
  })();

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 70, fontFamily: "Inter, sans-serif" }}>
      <AppFrame url="app.threereach.ai/proof" width={1500} height={830}>
        <div style={{ padding: "40px 60px", color: "#fff" }}>
          <div style={{ fontSize: 14, color: "#00E5FF", letterSpacing: 3, fontWeight: 700 }}>PROOF & TRACKING</div>
          <div style={{ fontSize: 36, fontWeight: 900, marginTop: 8, letterSpacing: -1 }}>Receipts on demand.</div>

          {/* Big citation counter */}
          <div style={{
            marginTop: 24, padding: 32, borderRadius: 18,
            background: "linear-gradient(135deg, rgba(30,107,255,0.18), rgba(0,229,255,0.06))",
            border: "1px solid rgba(0,229,255,0.3)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 13, color: "#9AB0D8", letterSpacing: 3, fontWeight: 600 }}>VERIFIED CITATIONS · LAST 30 DAYS</div>
              <div style={{ fontSize: 110, fontWeight: 900, lineHeight: 1, letterSpacing: -4, marginTop: 8 }}>
                <CountUp to={1614} startFrame={20} duration={70} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 30, fontSize: 14 }}>
              {[
                { label: "ChatGPT", val: 612, c: "#10A37F" },
                { label: "Gemini", val: 488, c: "#1E6BFF" },
                { label: "Perplexity", val: 514, c: "#20B2AA" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: s.c, fontVariantNumeric: "tabular-nums" }}>
                    <CountUp to={s.val} startFrame={30 + i * 8} duration={60} />
                  </div>
                  <div style={{ color: "#9AB0D8", marginTop: 4, fontSize: 12, letterSpacing: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live citation feed */}
          <div style={{ fontSize: 13, color: "#9AB0D8", letterSpacing: 2, fontWeight: 600, marginTop: 28, marginBottom: 10 }}>
            🔴 LIVE FEED · CAPTURED IN REAL-TIME
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CITATIONS.map((c) => {
              const s = spring({ frame: frame - c.start, fps, config: { damping: 16, stiffness: 110 } });
              const captureF = interpolate(frame - c.start, [0, 6], [0, 1], { extrapolateRight: "clamp" });
              return (
                <div key={c.engine} style={{
                  padding: "16px 20px", borderRadius: 12,
                  background: "rgba(15,25,50,0.55)", border: `1px solid ${c.color}55`,
                  display: "flex", alignItems: "center", gap: 18,
                  opacity: s, transform: `translateY(${(1 - s) * 20}px) scale(${0.97 + s * 0.03})`,
                  boxShadow: `0 0 ${captureF * 30}px ${c.color}66`,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, background: `${c.color}33`,
                    border: `1.5px solid ${c.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: c.color, fontWeight: 800, fontSize: 14,
                  }}>{c.engine.slice(0, 2)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{c.engine} <span style={{ color: "#9AB0D8", fontWeight: 500, fontSize: 13 }}> · {c.time}</span></div>
                    <div style={{ fontSize: 13, color: "#9AB0D8", marginTop: 2, fontStyle: "italic" }}>"{c.query}"</div>
                  </div>
                  <div style={{
                    padding: "6px 12px", borderRadius: 8,
                    background: "rgba(6,214,160,0.18)", border: "1px solid #06D6A0",
                    color: "#06D6A0", fontSize: 12, fontWeight: 700,
                  }}>📸 SCREENSHOT</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flash overlay */}
        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash, pointerEvents: "none" }} />
      </AppFrame>

      <SideCaption
        eyebrow="Module · Proof & Tracking"
        title="Audit-ready evidence."
        body="Sentinel verifies, captures and timestamps every citation. Exportable proof for every stakeholder."
        position="right"
        startFrame={200}
      />
    </AbsoluteFill>
  );
};
