import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AppFrame } from "../ui/AppFrame";
import { Cursor } from "../ui/Cursor";
import { TypewriterText } from "../ui/TypewriterText";
import { SideCaption } from "../ui/Caption";

export const Onboarding: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Field focus glow at f=40
  const focus = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" });
  // Button glow + click at f=140
  const btnGlow = interpolate(frame, [140, 165], [0, 1], { extrapolateRight: "clamp" });
  // Toast slides in
  const toastS = spring({ frame: frame - 175, fps, config: { damping: 16 } });

  const cursorPath = [
    { frame: 0, x: 1500, y: 800 },
    { frame: 35, x: 940, y: 380 },
    { frame: 50, x: 940, y: 380, click: true },
    { frame: 130, x: 940, y: 580 },
    { frame: 145, x: 940, y: 580, click: true },
  ];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 80, fontFamily: "Inter, sans-serif" }}>
      <AppFrame url="app.threereach.ai/onboarding" width={1480} height={820}>
        <div style={{ padding: "60px 80px", color: "#fff", display: "flex", gap: 60 }}>
          {/* Left side */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: "#00E5FF", letterSpacing: 4, fontWeight: 700 }}>STEP 01 OF 03</div>
            <div style={{ fontSize: 48, fontWeight: 900, marginTop: 18, letterSpacing: -1.5, lineHeight: 1.1 }}>
              Tell us about<br/>your brand.
            </div>
            <div style={{ fontSize: 18, color: "#9AB0D8", marginTop: 18, lineHeight: 1.5, maxWidth: 420 }}>
              We'll build your AI knowledge identity in seconds.
            </div>

            {/* Form */}
            <div style={{ marginTop: 50 }}>
              <div style={{ fontSize: 13, color: "#9AB0D8", letterSpacing: 1.5, fontWeight: 600, textTransform: "uppercase" }}>Brand URL</div>
              <div style={{
                marginTop: 10, padding: "18px 20px", borderRadius: 12,
                background: "rgba(0,229,255,0.04)",
                border: `1px solid rgba(0,229,255,${0.15 + focus * 0.45})`,
                boxShadow: `0 0 ${focus * 30}px rgba(0,229,255,${focus * 0.4})`,
                fontSize: 22, color: "#fff", minHeight: 30,
              }}>
                <TypewriterText text="threereach.ai" startFrame={55} charsPerFrame={0.4} />
              </div>

              <div style={{ fontSize: 13, color: "#9AB0D8", letterSpacing: 1.5, fontWeight: 600, textTransform: "uppercase", marginTop: 24 }}>Business Name</div>
              <div style={{
                marginTop: 10, padding: "18px 20px", borderRadius: 12,
                background: "rgba(15,25,50,0.5)",
                border: "1px solid rgba(154,176,216,0.18)",
                fontSize: 22, color: "#fff", minHeight: 30,
              }}>
                <TypewriterText text="Three Reach AI" startFrame={95} charsPerFrame={0.5} showCaret={false} />
              </div>

              {/* CTA */}
              <div style={{
                marginTop: 36, padding: "18px 32px", borderRadius: 12,
                background: "linear-gradient(135deg, #1E6BFF, #00E5FF)",
                boxShadow: `0 0 ${btnGlow * 50}px rgba(0,229,255,${0.3 + btnGlow * 0.4})`,
                fontSize: 18, fontWeight: 700, color: "#fff", display: "inline-block",
                transform: `scale(${1 + btnGlow * 0.02})`,
              }}>Build my AI footprint →</div>
            </div>
          </div>

          {/* Right side preview */}
          <div style={{ flex: 1, padding: "20px 0" }}>
            <div style={{
              borderRadius: 18, padding: 32,
              background: "rgba(15,25,50,0.5)", border: "1px solid rgba(0,229,255,0.15)",
              minHeight: 420,
            }}>
              <div style={{ fontSize: 13, letterSpacing: 3, color: "#00E5FF", fontWeight: 700 }}>LIVE PREVIEW</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 14, color: "#fff" }}>Brand Knowledge Graph</div>

              {/* Animated mini graph */}
              <svg width="100%" height="320" style={{ marginTop: 20 }}>
                {[
                  { x: 220, y: 150, label: "Three Reach", color: "#00E5FF", r: 32, start: 100 },
                  { x: 90, y: 60, label: "AEO", color: "#1E6BFF", r: 22, start: 130 },
                  { x: 380, y: 70, label: "GEO", color: "#1E6BFF", r: 22, start: 145 },
                  { x: 90, y: 250, label: "Schema", color: "#A78BFA", r: 22, start: 160 },
                  { x: 380, y: 250, label: "E-E-A-T", color: "#06D6A0", r: 22, start: 175 },
                ].map((n, i) => {
                  const ns = spring({ frame: frame - n.start, fps, config: { damping: 18 } });
                  return (
                    <g key={i} opacity={ns}>
                      {i > 0 && (
                        <line x1={220} y1={150} x2={n.x} y2={n.y} stroke={n.color} strokeWidth="1.5" strokeDasharray="3 4" opacity="0.5" />
                      )}
                      <circle cx={n.x} cy={n.y} r={n.r * ns} fill={n.color} opacity="0.25" />
                      <circle cx={n.x} cy={n.y} r={n.r * ns} fill="none" stroke={n.color} strokeWidth="2" />
                      <text x={n.x} y={n.y + n.r + 18} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">{n.label}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Toast */}
        <div style={{
          position: "absolute", bottom: 30, right: 30,
          padding: "16px 24px", borderRadius: 14,
          background: "rgba(6,214,160,0.15)", border: "1px solid #06D6A0",
          color: "#fff", fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 12,
          opacity: toastS, transform: `translateX(${(1 - toastS) * 60}px)`,
        }}>
          <span style={{ color: "#06D6A0", fontSize: 20 }}>✓</span> Brand identity built
        </div>

        <Cursor path={cursorPath} />
      </AppFrame>

      <SideCaption
        eyebrow="Step 01 · Onboarding"
        title="60 seconds. Zero credit card."
        body="Drop in your URL and brand name. Three Reach builds your complete AI knowledge identity automatically."
        position="left"
        startFrame={20}
      />
    </AbsoluteFill>
  );
};
