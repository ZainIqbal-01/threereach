import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const BG: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const drift = interpolate(frame, [0, 600], [0, 40]);
  return (
    <AbsoluteFill>
      {/* base radial */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at 30% 40%, rgba(30,107,255,0.25), transparent 60%), radial-gradient(ellipse at 75% 70%, rgba(0,229,255,0.18), transparent 55%), #05070F"
      }} />
      {/* grid */}
      <svg width={width} height={height} style={{ position: "absolute", opacity: 0.18 }}>
        <defs>
          <pattern id="g" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform={`translate(${drift} ${drift / 2})`}>
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#1E6BFF" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>
      {/* particles */}
      {Array.from({ length: 40 }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const x = (seed % width);
        const y = ((seed * 7) % height);
        const size = 1 + ((seed % 3));
        const op = 0.3 + ((seed % 50) / 100);
        const yOff = Math.sin((frame + i * 8) / 30) * 8;
        return <div key={i} style={{ position: "absolute", left: x, top: y + yOff, width: size, height: size, borderRadius: "50%", background: "#00E5FF", opacity: op, boxShadow: "0 0 8px #00E5FF" }} />;
      })}
    </AbsoluteFill>
  );
};
