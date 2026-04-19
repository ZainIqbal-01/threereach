import React from "react";
import { AbsoluteFill } from "remotion";
import { ScreenShowcase } from "../components/ScreenShowcase";
import { Caption } from "../components/Caption";

export const ModuleScene: React.FC<{
  src: string;
  durationInFrames: number;
  eyebrow: string;
  title: string;
  body: string;
  zoom?: "in" | "out" | "static";
  pan?: "up" | "down" | "none";
}> = ({ src, durationInFrames, eyebrow, title, body, zoom = "in", pan = "none" }) => {
  return (
    <AbsoluteFill>
      <ScreenShowcase src={src} durationInFrames={durationInFrames} zoom={zoom} pan={pan} align="top" />
      <Caption eyebrow={eyebrow} title={title} body={body} position="left" />
    </AbsoluteFill>
  );
};
