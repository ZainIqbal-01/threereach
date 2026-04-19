import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AppFrame } from "../ui/AppFrame";
import { TypewriterText } from "../ui/TypewriterText";
import { SideCaption } from "../ui/Caption";

const PLATFORMS = [
  { name: "Reddit", color: "#FF4500", initial: "R", start: 30 },
  { name: "LinkedIn", color: "#0A66C2", initial: "in", start: 40 },
  { name: "Quora", color: "#B92B27", initial: "Q", start: 50 },
  { name: "Medium", color: "#000", initial: "M", start: 60 },
  { name: "X / Twitter", color: "#1DA1F2", initial: "X", start: 70 },
  { name: "Hacker News", color: "#FF6600", initial: "Y", start: 80 },
];

export const Distribution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 70, fontFamily: "Inter, sans-serif" }}>
      <AppFrame url="app.threereach.ai/distribution" width={1500} height={830}>
        <div style={{ padding: "40px 60px", color: "#fff" }}>
          <div style={{ fontSize: 14, color: "#00E5FF", letterSpacing: 3, fontWeight: 700 }}>DISTRIBUTION ENGINE</div>
          <div style={{ fontSize: 36, fontWeight: 900, marginTop: 8, letterSpacing: -1 }}>One brief. Six platforms.</div>

          <div style={{ display: "flex", gap: 30, marginTop: 28 }}>
            {/* Brief composer */}
            <div style={{
              flex: 1, padding: 24, borderRadius: 14,
              background: "rgba(15,25,50,0.6)", border: "1px solid rgba(0,229,255,0.2)",
              minHeight: 380,
            }}>
              <div style={{ fontSize: 13, color: "#9AB0D8", letterSpacing: 2, fontWeight: 600 }}>BRIEF</div>
              <div style={{
                marginTop: 12, padding: 16, borderRadius: 10,
                background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,229,255,0.15)",
                fontSize: 15, lineHeight: 1.6, minHeight: 80,
              }}>
                <TypewriterText text='Why traditional SEO is dead — and what brands should do about AI answers.' startFrame={20} charsPerFrame={0.6} />
              </div>

              <div style={{ fontSize: 13, color: "#9AB0D8", letterSpacing: 2, fontWeight: 600, marginTop: 18 }}>STATUS</div>
              <div style={{
                marginTop: 8, padding: "12px 16px", borderRadius: 10,
                background: "rgba(6,214,160,0.12)", border: "1px solid rgba(6,214,160,0.4)",
                color: "#06D6A0", fontSize: 14, fontWeight: 700,
                opacity: interpolate(frame, [110, 130], [0, 1], { extrapolateRight: "clamp" }),
              }}>
                ✓ AI-optimized · 6 variants generated
              </div>
            </div>

            {/* Platform tile grid */}
            <div style={{ flex: 1.4, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {PLATFORMS.map((p, i) => {
                const s = spring({ frame: frame - p.start, fps, config: { damping: 18, stiffness: 110 } });
                const publishStart = 130 + i * 12;
                const pubS = spring({ frame: frame - publishStart, fps, config: { damping: 14 } });
                const isPublished = frame > publishStart;
                return (
                  <div key={p.name} style={{
                    padding: 20, borderRadius: 14, minHeight: 130,
                    background: "rgba(15,25,50,0.6)",
                    border: `1px solid ${isPublished ? "#06D6A0" : "rgba(154,176,216,0.18)"}`,
                    boxShadow: isPublished ? `0 0 24px rgba(6,214,160,${pubS * 0.4})` : "none",
                    opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${0.92 + s * 0.08})`,
                    position: "relative",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: p.color, color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 900, fontSize: 16,
                      }}>{p.initial}</div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</div>
                    </div>
                    <div style={{
                      marginTop: 12, height: 6, borderRadius: 3,
                      background: "rgba(154,176,216,0.12)", overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%", width: `${(isPublished ? pubS : 0) * 100}%`,
                        background: "linear-gradient(90deg, #1E6BFF, #06D6A0)", borderRadius: 3,
                      }} />
                    </div>
                    {isPublished && (
                      <div style={{
                        marginTop: 10, fontSize: 12, fontWeight: 700, color: "#06D6A0",
                        opacity: pubS,
                      }}>✓ PUBLISHED</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reach counter */}
          <div style={{
            marginTop: 30, display: "flex", justifyContent: "space-between",
            padding: "20px 28px", borderRadius: 14,
            background: "linear-gradient(90deg, rgba(30,107,255,0.15), rgba(0,229,255,0.05))",
            border: "1px solid rgba(0,229,255,0.3)",
          }}>
            <div>
              <div style={{ fontSize: 12, color: "#9AB0D8", letterSpacing: 2, fontWeight: 600 }}>EST. AI REACH</div>
              <div style={{ fontSize: 36, fontWeight: 900, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
                {Math.round(interpolate(frame, [200, 280], [0, 248000], { extrapolateRight: "clamp" })).toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#9AB0D8", letterSpacing: 2, fontWeight: 600 }}>POSTS LIVE</div>
              <div style={{ fontSize: 36, fontWeight: 900, marginTop: 4, color: "#00E5FF", fontVariantNumeric: "tabular-nums" }}>
                {Math.min(6, Math.floor(interpolate(frame, [130, 200], [0, 6], { extrapolateRight: "clamp" })))}
                <span style={{ color: "#9AB0D8", fontSize: 22 }}> / 6</span>
              </div>
            </div>
          </div>
        </div>
      </AppFrame>

      <SideCaption
        eyebrow="Module · Distribution Engine"
        title="Where LLMs crawl."
        body="Spark generates AI-optimized variants for the platforms that actually feed AI training data. Auto-shipped."
        position="left"
        startFrame={300}
      />
    </AbsoluteFill>
  );
};
