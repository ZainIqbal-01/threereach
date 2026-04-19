import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

type Point = { frame: number; x: number; y: number; click?: boolean };

export const Cursor: React.FC<{ path: Point[] }> = ({ path }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (path.length === 0) return null;

  // Find current segment
  let cur = path[0];
  let next = path[path.length - 1];
  for (let i = 0; i < path.length - 1; i++) {
    if (frame >= path[i].frame && frame <= path[i + 1].frame) {
      cur = path[i];
      next = path[i + 1];
      break;
    }
  }
  if (frame >= path[path.length - 1].frame) {
    cur = next = path[path.length - 1];
  }

  const t = next.frame === cur.frame ? 1 : (frame - cur.frame) / (next.frame - cur.frame);
  // ease in-out
  const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const x = cur.x + (next.x - cur.x) * e;
  const y = cur.y + (next.y - cur.y) * e;

  // Click pulse
  const clickPoint = path.find((p) => p.click && Math.abs(frame - p.frame) < 20);
  let clickScale = 0;
  let clickOp = 0;
  if (clickPoint) {
    const cf = frame - clickPoint.frame;
    if (cf >= 0 && cf < 18) {
      clickScale = interpolate(cf, [0, 18], [0.4, 2.2]);
      clickOp = interpolate(cf, [0, 18], [0.6, 0]);
    }
  }

  const enter = spring({ frame: frame - path[0].frame + 6, fps, config: { damping: 18 } });

  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: enter, transform: `scale(${0.9 + enter * 0.1})`, pointerEvents: "none", zIndex: 100 }}>
      <div style={{
        position: "absolute", left: -30, top: -30, width: 60, height: 60, borderRadius: "50%",
        border: "2px solid #00E5FF", transform: `scale(${clickScale})`, opacity: clickOp,
      }} />
      <svg width="28" height="28" viewBox="0 0 28 28" style={{ filter: "drop-shadow(0 4px 12px rgba(0,229,255,0.5))" }}>
        <path d="M5 3 L5 22 L11 17 L15 25 L18 23 L14 16 L22 16 Z" fill="#fff" stroke="#0A1226" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
