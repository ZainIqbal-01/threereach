import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AppFrame } from "../ui/AppFrame";
import { SideCaption } from "../ui/Caption";

const COMPETITORS = [
  { name: "Three Reach", val: 84, color: "#00E5FF", us: true, start: 30 },
  { name: "Competitor A", val: 62, color: "#A78BFA", start: 50 },
  { name: "Competitor B", val: 51, color: "#FF8AC7", start: 65 },
  { name: "Competitor C", val: 38, color: "#FFD166", start: 80 },
  { name: "Competitor D", val: 22, color: "#FF4D6D", start: 95 },
];

export const BrandIntel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sentimentAngle = interpolate(spring({ frame: frame - 80, fps, config: { damping: 18 } }), [0, 1], [-90, 35]);
  const cardS = spring({ frame: frame - 160, fps, config: { damping: 16 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 70, fontFamily: "Inter, sans-serif" }}>
      <AppFrame url="app.threereach.ai/brand-intelligence" width={1500} height={830}>
        <div style={{ padding: "40px 60px", color: "#fff", display: "flex", gap: 40 }}>
          {/* Left: bar race */}
          <div style={{ flex: 1.2 }}>
            <div style={{ fontSize: 14, color: "#00E5FF", letterSpacing: 3, fontWeight: 700 }}>BRAND INTELLIGENCE</div>
            <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8, letterSpacing: -1 }}>Competitor Benchmark</div>
            <div style={{ marginTop: 28 }}>
              {COMPETITORS.map((c) => {
                const s = spring({ frame: frame - c.start, fps, durationInFrames: 60, config: { damping: 22 } });
                const w = c.val * s;
                return (
                  <div key={c.name} style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: c.us ? 800 : 600, color: c.us ? "#00E5FF" : "#fff" }}>
                        {c.us && "★ "}{c.name}
                      </span>
                      <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{Math.round(w)}</span>
                    </div>
                    <div style={{
                      height: c.us ? 22 : 16, borderRadius: 6,
                      background: "rgba(154,176,216,0.08)", overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%", width: `${w}%`,
                        background: c.us ? `linear-gradient(90deg, #1E6BFF, #00E5FF)` : c.color,
                        boxShadow: c.us ? "0 0 16px #00E5FF88" : "none",
                        borderRadius: 6,
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: sentiment + gap */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Sentiment dial */}
            <div style={{
              padding: 28, borderRadius: 18,
              background: "rgba(15,25,50,0.5)", border: "1px solid rgba(0,229,255,0.18)",
            }}>
              <div style={{ fontSize: 13, color: "#9AB0D8", letterSpacing: 2, fontWeight: 600 }}>AI SENTIMENT</div>
              <div style={{ height: 140, position: "relative", marginTop: 16 }}>
                <svg width="100%" height="140" viewBox="0 0 300 140">
                  <path d="M 30 130 A 120 120 0 0 1 270 130" stroke="rgba(154,176,216,0.15)" strokeWidth="14" fill="none" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FF4D6D" />
                      <stop offset="50%" stopColor="#FFD166" />
                      <stop offset="100%" stopColor="#06D6A0" />
                    </linearGradient>
                  </defs>
                  <path d="M 30 130 A 120 120 0 0 1 270 130" stroke="url(#sg)" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.85" />
                  {/* Needle */}
                  <line x1="150" y1="130" x2={150 + 100 * Math.cos((sentimentAngle - 90) * Math.PI / 180)} y2={130 + 100 * Math.sin((sentimentAngle - 90) * Math.PI / 180)} stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="150" cy="130" r="8" fill="#0A1226" stroke="#00E5FF" strokeWidth="2" />
                </svg>
              </div>
              <div style={{ textAlign: "center", fontSize: 28, fontWeight: 900, color: "#06D6A0", marginTop: -8 }}>POSITIVE</div>
            </div>

            {/* Top gap card */}
            <div style={{
              padding: 28, borderRadius: 18,
              background: "linear-gradient(135deg, rgba(255,77,109,0.18), rgba(167,139,250,0.12))",
              border: "1px solid rgba(255,77,109,0.4)",
              opacity: cardS, transform: `translateX(${(1 - cardS) * 60}px) scale(${0.95 + cardS * 0.05})`,
              boxShadow: "0 20px 60px rgba(255,77,109,0.2)",
            }}>
              <div style={{ fontSize: 13, color: "#FF4D6D", letterSpacing: 2, fontWeight: 700 }}>⚠ TOP GAP DETECTED</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 10, lineHeight: 1.3 }}>
                Missing from "AI SEO tools" queries on Perplexity
              </div>
              <div style={{
                marginTop: 16, padding: "10px 16px", borderRadius: 10,
                background: "rgba(0,229,255,0.15)", border: "1px solid #00E5FF",
                color: "#00E5FF", fontSize: 14, fontWeight: 700, display: "inline-block",
              }}>→ Spark queued 3 posts to fix</div>
            </div>
          </div>
        </div>
      </AppFrame>

      <SideCaption
        eyebrow="Module · Brand Intelligence"
        title="What AI thinks of you."
        body="Oracle benchmarks competitors, surfaces sentiment shifts, and turns gaps into action."
        position="left"
        startFrame={180}
      />
    </AbsoluteFill>
  );
};
