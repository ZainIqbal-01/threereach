import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AppFrame } from "../ui/AppFrame";
import { Gauge } from "../ui/Gauge";
import { CountUp } from "../ui/CountUp";
import { SideCaption } from "../ui/Caption";

const ENGINES = [
  { name: "ChatGPT", val: 92, color: "#10A37F" },
  { name: "Gemini", val: 86, color: "#1E6BFF" },
  { name: "Perplexity", val: 78, color: "#20B2AA" },
  { name: "Claude", val: 81, color: "#D97757" },
  { name: "Copilot", val: 74, color: "#0078D4" },
];

export const Score: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 70, fontFamily: "Inter, sans-serif" }}>
      <AppFrame url="app.threereach.ai/overview" width={1500} height={830}>
        <div style={{ padding: "40px 60px", color: "#fff", display: "flex", gap: 50 }}>
          {/* Sidebar mock */}
          <div style={{ width: 60, display: "flex", flexDirection: "column", gap: 16, paddingTop: 6 }}>
            {[0,1,2,3,4,5].map(i => (
              <div key={i} style={{
                width: 44, height: 44, borderRadius: 12,
                background: i === 0 ? "linear-gradient(135deg, #1E6BFF, #00E5FF)" : "rgba(15,25,50,0.7)",
                border: i === 0 ? "none" : "1px solid rgba(154,176,216,0.15)",
              }} />
            ))}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: "#9AB0D8", letterSpacing: 3, fontWeight: 600 }}>OVERVIEW · LIVE</div>
            <div style={{ fontSize: 38, fontWeight: 900, marginTop: 8, letterSpacing: -1 }}>AI Visibility Score</div>

            <div style={{ display: "flex", gap: 40, marginTop: 30, alignItems: "center" }}>
              {/* Gauge */}
              <Gauge value={84} startFrame={20} label="VISIBILITY" />

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1, letterSpacing: -3, fontVariantNumeric: "tabular-nums" }}>
                    <CountUp to={84} startFrame={25} duration={50} />
                  </div>
                  <div style={{
                    padding: "8px 14px", borderRadius: 10,
                    background: "rgba(6,214,160,0.18)", border: "1px solid #06D6A0",
                    color: "#06D6A0", fontWeight: 700, fontSize: 18,
                    opacity: interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp" }),
                    transform: `translateY(${interpolate(frame, [80, 110], [10, 0], { extrapolateRight: "clamp" })}px)`,
                  }}>↑ +12 this week</div>
                </div>
                <div style={{ fontSize: 18, color: "#9AB0D8", marginTop: 6 }}>across 5 engines · updated 2 min ago</div>
              </div>
            </div>

            {/* Engine bars */}
            <div style={{ marginTop: 50 }}>
              <div style={{ fontSize: 14, color: "#9AB0D8", letterSpacing: 2, fontWeight: 600, marginBottom: 18 }}>ENGINE BREAKDOWN</div>
              {ENGINES.map((e, i) => {
                const s = spring({ frame: frame - 90 - i * 8, fps, config: { damping: 22 } });
                const w = e.val * s;
                return (
                  <div key={e.name} style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 110, fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: e.color }} />
                      {e.name}
                    </div>
                    <div style={{ flex: 1, height: 12, borderRadius: 6, background: "rgba(154,176,216,0.1)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${w}%`,
                        background: `linear-gradient(90deg, ${e.color}, ${e.color}dd)`,
                        boxShadow: `0 0 12px ${e.color}88`,
                        borderRadius: 6,
                      }} />
                    </div>
                    <div style={{ width: 60, textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                      {Math.round(w)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AppFrame>

      <SideCaption
        eyebrow="Module · Overview"
        title="One score. Every engine."
        body="Live visibility across ChatGPT, Gemini, Perplexity, Claude & Copilot. Updated daily."
        position="left"
        startFrame={30}
      />
    </AbsoluteFill>
  );
};
