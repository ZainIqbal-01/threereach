import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

export const CountUp: React.FC<{
  to: number;
  from?: number;
  startFrame?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ to, from = 0, startFrame = 0, duration = 60, decimals = 0, prefix = "", suffix = "", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - startFrame, fps, durationInFrames: duration, config: { damping: 22, stiffness: 80 } });
  const val = from + (to - from) * s;
  const formatted = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{prefix}{formatted}{suffix}</span>;
};
