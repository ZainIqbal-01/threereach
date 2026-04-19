import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AppFrame } from "../ui/AppFrame";
import { TypewriterText } from "../ui/TypewriterText";
import { SideCaption } from "../ui/Caption";

const CODE_LINES = [
  '{',
  '  "@context": "https://schema.org",',
  '  "@type": "SoftwareApplication",',
  '  "name": "Three Reach AI",',
  '  "applicationCategory": "MarketingApplication",',
  '  "operatingSystem": "Web",',
  '  "offers": {',
  '    "@type": "Offer",',
  '    "price": "49.00"',
  '  },',
  '  "aggregateRating": {',
  '    "@type": "AggregateRating",',
  '    "ratingValue": "4.9",',
  '    "reviewCount": "284"',
  '  }',
  '}',
];

const EEAT = [
  { label: "Experience", val: 92, color: "#00E5FF" },
  { label: "Expertise", val: 88, color: "#1E6BFF" },
  { label: "Authoritativeness", val: 76, color: "#A78BFA" },
  { label: "Trustworthiness", val: 95, color: "#06D6A0" },
];

export const Footprint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 70, fontFamily: "Inter, sans-serif" }}>
      <AppFrame url="app.threereach.ai/footprint" width={1500} height={830}>
        <div style={{ padding: "40px 60px", color: "#fff" }}>
          <div style={{ fontSize: 14, color: "#00E5FF", letterSpacing: 3, fontWeight: 700 }}>BUILD AI FOOTPRINT</div>
          <div style={{ fontSize: 36, fontWeight: 900, marginTop: 8, letterSpacing: -1 }}>Schema · GEO · E-E-A-T</div>

          <div style={{ display: "flex", gap: 30, marginTop: 28 }}>
            {/* Code editor */}
            <div style={{
              flex: 1.2, borderRadius: 14, overflow: "hidden",
              background: "#06090F", border: "1px solid rgba(0,229,255,0.18)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}>
              <div style={{ padding: "10px 16px", background: "rgba(15,25,50,0.6)", display: "flex", gap: 8, alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
                <span style={{ marginLeft: 12, color: "#9AB0D8", fontSize: 13, fontFamily: "monospace" }}>schema.json</span>
                <span style={{
                  marginLeft: "auto", padding: "3px 10px", borderRadius: 6,
                  background: "rgba(6,214,160,0.15)", border: "1px solid #06D6A0",
                  color: "#06D6A0", fontSize: 11, fontWeight: 700,
                }}>JSON-LD VALID</span>
              </div>
              <div style={{ padding: 22, fontFamily: "monospace", fontSize: 14, lineHeight: 1.7, height: 380, overflow: "hidden" }}>
                {CODE_LINES.map((ln, i) => {
                  const start = 20 + i * 14;
                  const op = interpolate(frame, [start, start + 6], [0, 1], { extrapolateRight: "clamp" });
                  const ty = interpolate(frame, [start, start + 6], [-4, 0], { extrapolateRight: "clamp" });
                  return (
                    <div key={i} style={{ opacity: op, transform: `translateY(${ty}px)`, display: "flex", gap: 16 }}>
                      <span style={{ color: "rgba(154,176,216,0.3)", width: 20, textAlign: "right" }}>{i + 1}</span>
                      <span style={{ color: ln.includes('"') ? "#00E5FF" : "#FFD166" }}>{ln}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* E-E-A-T meters */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 13, color: "#9AB0D8", letterSpacing: 2, fontWeight: 600 }}>E-E-A-T SIGNALS</div>
              {EEAT.map((e, i) => {
                const s = spring({ frame: frame - 80 - i * 18, fps, durationInFrames: 60, config: { damping: 22 } });
                const w = e.val * s;
                return (
                  <div key={e.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 600 }}>{e.label}</span>
                      <span style={{ color: e.color, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{Math.round(w)}</span>
                    </div>
                    <div style={{ height: 14, borderRadius: 6, background: "rgba(154,176,216,0.1)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${w}%`,
                        background: `linear-gradient(90deg, ${e.color}, ${e.color}aa)`,
                        boxShadow: `0 0 12px ${e.color}88`, borderRadius: 6,
                      }} />
                    </div>
                  </div>
                );
              })}

              {/* GEO landing wireframe */}
              <div style={{
                marginTop: 14, padding: 18, borderRadius: 14,
                background: "rgba(15,25,50,0.5)", border: "1px solid rgba(0,229,255,0.18)",
              }}>
                <div style={{ fontSize: 12, color: "#9AB0D8", letterSpacing: 2, fontWeight: 600 }}>GEO LANDING · AUTO-GENERATED</div>
                {[40, 60, 80, 100, 120].map((s, i) => {
                  const sp = spring({ frame: frame - 180 - i * 10, fps, config: { damping: 20 } });
                  const widths = [85, 60, 95, 70, 50];
                  return (
                    <div key={i} style={{
                      height: i === 0 ? 16 : 8, marginTop: i === 0 ? 14 : 8,
                      width: `${widths[i] * sp}%`,
                      background: i === 0 ? "linear-gradient(90deg, #1E6BFF, #00E5FF)" : "rgba(154,176,216,0.3)",
                      borderRadius: 4, opacity: sp,
                    }} />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </AppFrame>

      <SideCaption
        eyebrow="Module · Build AI Footprint"
        title="GEO, automated."
        body="Atlas writes landing copy, ships JSON-LD schema, and stacks E-E-A-T signals — all engineered for AI extraction."
        position="right"
        startFrame={250}
      />
    </AbsoluteFill>
  );
};
