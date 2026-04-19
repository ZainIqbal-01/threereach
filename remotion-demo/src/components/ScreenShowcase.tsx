import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

// Animated browser-style frame that pans/zooms across a real product screenshot
export const ScreenShowcase: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: "in" | "out" | "static";
  pan?: "up" | "down" | "none";
  align?: "top" | "center" | "bottom";
}> = ({ src, durationInFrames, zoom = "in", pan = "none", align = "top" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 22, stiffness: 80 } });

  const zoomFrom = zoom === "in" ? 1.0 : zoom === "out" ? 1.12 : 1.05;
  const zoomTo = zoom === "in" ? 1.12 : zoom === "out" ? 1.0 : 1.05;
  const scale = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], { extrapolateRight: "clamp" });

  const panAmt = pan === "up" ? -80 : pan === "down" ? 80 : 0;
  const ty = interpolate(frame, [0, durationInFrames], [0, panAmt], { extrapolateRight: "clamp" });

  // Browser frame size — 16:9 with 80px padding around
  const frameW = width - 200;
  const frameH = (frameW * 9) / 16;
  const top = align === "top" ? 80 : align === "bottom" ? height - frameH - 80 : (height - frameH) / 2;

  return (
    <div style={{
      position: "absolute", left: 100, top,
      width: frameW, height: frameH,
      borderRadius: 24, overflow: "hidden",
      background: "#0B1226",
      border: "1px solid rgba(0,229,255,0.25)",
      boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 80px rgba(30,107,255,0.25)",
      opacity: enter,
      transform: `translateY(${(1 - enter) * 30}px) scale(${0.97 + enter * 0.03})`,
    }}>
      {/* Browser chrome */}
      <div style={{
        height: 36, background: "#0F1830", display: "flex", alignItems: "center", paddingLeft: 14, gap: 8,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
        <div style={{
          marginLeft: 16, padding: "4px 14px", borderRadius: 8, background: "rgba(255,255,255,0.06)",
          color: "#9AB0D8", fontSize: 13, fontFamily: "Inter, sans-serif", letterSpacing: 0.4,
        }}>
          app.threereach.ai
        </div>
      </div>
      {/* Screenshot with ken burns */}
      <div style={{ position: "relative", width: "100%", height: frameH - 36, overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{
          position: "absolute", left: 0, top: 0, width: "100%",
          transform: `translateY(${ty}px) scale(${scale})`,
          transformOrigin: "center top",
        }} />
      </div>
    </div>
  );
};
