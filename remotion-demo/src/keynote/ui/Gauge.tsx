import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const Gauge: React.FC<{
  value: number; // 0-100
  size?: number;
  startFrame?: number;
  label?: string;
}> = ({ value, size = 360, startFrame = 0, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - startFrame, fps, durationInFrames: 70, config: { damping: 20, stiffness: 90 } });
  const animValue = value * s;

  const r = size / 2 - 20;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = Math.PI * 0.75; // 135deg
  const endAngle = Math.PI * 2.25; // 405deg => 270deg sweep
  const sweep = endAngle - startAngle;

  const valueAngle = startAngle + sweep * (animValue / 100);
  const px = cx + r * Math.cos(valueAngle);
  const py = cy + r * Math.sin(valueAngle);

  const arcPath = (a1: number, a2: number) => {
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    const large = a2 - a1 > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="gaugeFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E6BFF" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
          <filter id="gaugeGlow">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        {/* Track */}
        <path d={arcPath(startAngle, endAngle)} stroke="rgba(154,176,216,0.15)" strokeWidth="14" fill="none" strokeLinecap="round" />
        {/* Tick marks */}
        {Array.from({ length: 31 }).map((_, i) => {
          const a = startAngle + (sweep * i) / 30;
          const r1 = r + 14;
          const r2 = r + 22;
          const x1 = cx + r1 * Math.cos(a);
          const y1 = cy + r1 * Math.sin(a);
          const x2 = cx + r2 * Math.cos(a);
          const y2 = cy + r2 * Math.sin(a);
          const active = (i / 30) * 100 <= animValue;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? "#00E5FF" : "rgba(154,176,216,0.25)"} strokeWidth="2" />;
        })}
        {/* Filled arc */}
        {animValue > 0.5 && (
          <path d={arcPath(startAngle, valueAngle)} stroke="url(#gaugeFill)" strokeWidth="14" fill="none" strokeLinecap="round" filter="url(#gaugeGlow)" />
        )}
        {/* Needle */}
        <line x1={cx} y1={cy} x2={px} y2={py} stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="10" fill="#0A1226" stroke="#00E5FF" strokeWidth="2" />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", pointerEvents: "none"
      }}>
        <div style={{ fontSize: size * 0.32, fontWeight: 900, color: "#fff", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {Math.round(animValue)}
        </div>
        {label && <div style={{ fontSize: size * 0.05, color: "#9AB0D8", marginTop: 6, letterSpacing: 3, fontWeight: 600 }}>{label}</div>}
      </div>
    </div>
  );
};
