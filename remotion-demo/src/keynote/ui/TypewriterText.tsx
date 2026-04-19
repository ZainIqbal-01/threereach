import React from "react";
import { useCurrentFrame } from "remotion";

export const TypewriterText: React.FC<{
  text: string;
  startFrame: number;
  charsPerFrame?: number;
  showCaret?: boolean;
  style?: React.CSSProperties;
  className?: string;
}> = ({ text, startFrame, charsPerFrame = 0.8, showCaret = true, style, className }) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const count = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const visible = text.slice(0, count);
  const caret = showCaret && count < text.length && Math.floor(frame / 8) % 2 === 0;
  return (
    <span style={style} className={className}>
      {visible}
      {caret && <span style={{ opacity: 0.85 }}>▍</span>}
    </span>
  );
};
