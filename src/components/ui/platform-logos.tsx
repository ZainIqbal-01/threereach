import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

/** Reddit — Snoo-inspired simplified mark */
export const RedditLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

/** Quora — stylized Q */
export const QuoraLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor">
    <path d="M12.738 18.701c-.831-1.635-1.805-3.27-3.722-3.27-.366 0-.732.061-1.067.214l-.671-1.34c.823-.701 2.166-1.34 3.875-1.34 2.685 0 4.066 1.279 5.169 2.94.658-1.33 1.012-3.057 1.012-5.094 0-5.094-1.595-7.71-5.323-7.71-3.668 0-5.262 2.616-5.262 7.71 0 5.064 1.594 7.65 5.262 7.65.244 0 .488 0 .727-.06zm1.07 2.13c-.55.122-1.16.215-1.797.215-4.948 0-9.683-3.943-9.683-9.935 0-6.05 4.735-9.994 9.683-9.994 5.04 0 9.713 3.91 9.713 9.994 0 3.392-1.464 6.13-3.668 7.864.701 1.067 1.434 1.768 2.44 1.768.733 0 1.341-.244 1.829-.701l.518.98c-.519.487-1.62 1.404-3.485 1.404-2.93 0-4.4-1.554-5.55-3.595z"/>
  </svg>
);

/** LinkedIn — official "in" mark */
export const LinkedInLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

/** Medium — official "M" with circles */
export const MediumLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor">
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
);

/** Hacker News — Y in orange square */
export const HackerNewsLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor">
    <path d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z"/>
  </svg>
);

/** X / Twitter — official X glyph */
export const XLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

/** Brand colors — used for tinted "wells" */
export const PLATFORM_BRAND_COLORS: Record<string, { bg: string; ring: string; fg: string }> = {
  reddit:     { bg: "hsl(16 100% 50% / 0.12)",  ring: "hsl(16 100% 50% / 0.28)",  fg: "#FF4500" },
  quora:      { bg: "hsl(2 65% 44% / 0.12)",    ring: "hsl(2 65% 44% / 0.28)",    fg: "#B92B27" },
  linkedin:   { bg: "hsl(210 90% 40% / 0.12)",  ring: "hsl(210 90% 40% / 0.28)",  fg: "#0A66C2" },
  medium:     { bg: "hsl(0 0% 0% / 0.08)",      ring: "hsl(0 0% 0% / 0.18)",      fg: "currentColor" },
  hackernews: { bg: "hsl(24 100% 50% / 0.14)",  ring: "hsl(24 100% 50% / 0.30)",  fg: "#FF6600" },
  twitter:    { bg: "hsl(0 0% 0% / 0.08)",      ring: "hsl(0 0% 0% / 0.18)",      fg: "currentColor" },
  x:          { bg: "hsl(0 0% 0% / 0.08)",      ring: "hsl(0 0% 0% / 0.18)",      fg: "currentColor" },
};

/** Resolve logo by platform id/name */
export function getPlatformLogo(platform: string, className = "h-5 w-5"): React.ReactNode {
  const key = platform.toLowerCase().replace(/[\s/]/g, "");
  switch (key) {
    case "reddit":     return <RedditLogo className={className} style={{ color: "#FF4500" }} />;
    case "quora":      return <QuoraLogo className={className} style={{ color: "#B92B27" }} />;
    case "linkedin":   return <LinkedInLogo className={className} style={{ color: "#0A66C2" }} />;
    case "medium":     return <MediumLogo className={className} />;
    case "hackernews":
    case "hn":         return <HackerNewsLogo className={className} style={{ color: "#FF6600" }} />;
    case "x":
    case "twitter":
    case "xtwitter":   return <XLogo className={className} />;
    default:           return <RedditLogo className={className} />;
  }
}

// Allow style prop on logos
declare module "react" {
  interface SVGProps<T> {
    style?: React.CSSProperties;
  }
}
