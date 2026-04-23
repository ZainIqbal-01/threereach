import React from "react";
import {
  ChatGPTLogo,
  GeminiLogo,
  PerplexityLogo,
  ClaudeLogo,
  CopilotLogo,
} from "./ai-engine-logos";

interface LogoProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

/* ──────────────────────────── Social / publishing ─────────────────────────── */

export const RedditLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

export const QuoraLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M12.738 18.701c-.831-1.635-1.805-3.27-3.722-3.27-.366 0-.732.061-1.067.214l-.671-1.34c.823-.701 2.166-1.34 3.875-1.34 2.685 0 4.066 1.279 5.169 2.94.658-1.33 1.012-3.057 1.012-5.094 0-5.094-1.595-7.71-5.323-7.71-3.668 0-5.262 2.616-5.262 7.71 0 5.064 1.594 7.65 5.262 7.65.244 0 .488 0 .727-.06zm1.07 2.13c-.55.122-1.16.215-1.797.215-4.948 0-9.683-3.943-9.683-9.935 0-6.05 4.735-9.994 9.683-9.994 5.04 0 9.713 3.91 9.713 9.994 0 3.392-1.464 6.13-3.668 7.864.701 1.067 1.434 1.768 2.44 1.768.733 0 1.341-.244 1.829-.701l.518.98c-.519.487-1.62 1.404-3.485 1.404-2.93 0-4.4-1.554-5.55-3.595z"/>
  </svg>
);

export const LinkedInLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export const MediumLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
);

export const HackerNewsLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z"/>
  </svg>
);

export const XLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const FacebookLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const InstagramLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

export const YouTubeLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const TikTokLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.79a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.22z"/>
  </svg>
);

export const ThreadsLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M17.55 11.13c-.08-.04-.17-.07-.25-.11-.15-2.78-1.67-4.37-4.22-4.39h-.04c-1.52 0-2.79.65-3.57 1.84l1.4.96c.58-.88 1.5-1.07 2.17-1.07h.03c.84 0 1.47.25 1.88.72.3.35.5.83.6 1.43-.74-.13-1.55-.17-2.41-.12-2.43.14-3.99 1.55-3.88 3.52.05.99.55 1.85 1.39 2.41.71.47 1.63.7 2.58.65 1.26-.07 2.25-.55 2.94-1.42.52-.66.85-1.51.99-2.59 1.16.7 2.02 1.62 2.49 2.74.81 1.91.86 5.03-1.69 7.58-2.23 2.23-4.92 3.19-8 2.86-2.74-.29-4.84-1.27-6.24-2.92C2.42 19.1 1.71 16.49 1.68 13c.03-3.49.74-6.1 2.04-7.79 1.4-1.65 3.5-2.63 6.24-2.92 3.08-.33 5.77.63 8 2.86 1.27 1.27 2.23 2.81 2.84 4.59l1.6-.43c-.7-2.04-1.81-3.81-3.29-5.29C16.43 1.49 13.31.36 9.79.74 6.4 1.1 3.84 2.32 2.18 4.36.6 6.32-.21 9.18-.21 13.06 0 16.92.81 19.78 2.39 21.74c1.66 2.04 4.22 3.26 7.61 3.62 1.21.13 2.39.13 3.5-.05 2.05-.32 3.85-1.05 5.32-2.18 1.27-.97 2.32-2.27 3.07-3.85 1.06-2.27 1.21-5.04.39-7.27-.5-1.4-1.5-2.77-2.73-3.78z"/>
  </svg>
);

export const GitHubLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

export const DiscordLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

export const SubstackLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
  </svg>
);

export const BlueskyLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.911.58-7.386 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
  </svg>
);

export const PinterestLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.747 2.853c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
  </svg>
);

export const MastodonLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size, style }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor" style={style}>
    <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.118.696-.766 1.608-1.16 2.74-1.16 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.394 2.74 1.16.675.768 1.012 1.808 1.012 3.118z"/>
  </svg>
);

/* ──────────────────────────── Brand color palette ─────────────────────────── */

export const PLATFORM_BRAND_COLORS: Record<string, { bg: string; ring: string; fg: string; text: string }> = {
  // Communities
  reddit:     { bg: "hsl(16 100% 50% / 0.12)",  ring: "hsl(16 100% 50% / 0.30)",  fg: "#FF4500", text: "hsl(16 100% 50%)" },
  quora:      { bg: "hsl(2 65% 44% / 0.12)",    ring: "hsl(2 65% 44% / 0.28)",    fg: "#B92B27", text: "hsl(2 65% 44%)" },
  hackernews: { bg: "hsl(24 100% 50% / 0.14)",  ring: "hsl(24 100% 50% / 0.32)",  fg: "#FF6600", text: "hsl(24 100% 50%)" },
  // Pro / publishing
  linkedin:   { bg: "hsl(210 90% 40% / 0.12)",  ring: "hsl(210 90% 40% / 0.30)",  fg: "#0A66C2", text: "hsl(210 90% 40%)" },
  medium:     { bg: "hsl(0 0% 0% / 0.08)",      ring: "hsl(0 0% 0% / 0.20)",      fg: "currentColor", text: "hsl(var(--foreground))" },
  substack:   { bg: "hsl(15 100% 55% / 0.12)",  ring: "hsl(15 100% 55% / 0.30)",  fg: "#FF6719", text: "hsl(15 100% 55%)" },
  // Social
  twitter:    { bg: "hsl(0 0% 0% / 0.08)",      ring: "hsl(0 0% 0% / 0.20)",      fg: "currentColor", text: "hsl(var(--foreground))" },
  x:          { bg: "hsl(0 0% 0% / 0.08)",      ring: "hsl(0 0% 0% / 0.20)",      fg: "currentColor", text: "hsl(var(--foreground))" },
  facebook:   { bg: "hsl(221 44% 41% / 0.12)",  ring: "hsl(221 44% 41% / 0.30)",  fg: "#1877F2", text: "hsl(214 89% 52%)" },
  instagram:  { bg: "hsl(329 70% 58% / 0.12)",  ring: "hsl(329 70% 58% / 0.30)",  fg: "#E4405F", text: "hsl(329 70% 58%)" },
  youtube:    { bg: "hsl(0 100% 50% / 0.10)",   ring: "hsl(0 100% 50% / 0.28)",   fg: "#FF0000", text: "hsl(0 100% 50%)" },
  tiktok:     { bg: "hsl(0 0% 0% / 0.08)",      ring: "hsl(0 0% 0% / 0.20)",      fg: "currentColor", text: "hsl(var(--foreground))" },
  threads:    { bg: "hsl(0 0% 0% / 0.08)",      ring: "hsl(0 0% 0% / 0.20)",      fg: "currentColor", text: "hsl(var(--foreground))" },
  bluesky:    { bg: "hsl(211 100% 50% / 0.12)", ring: "hsl(211 100% 50% / 0.30)", fg: "#0085FF", text: "hsl(211 100% 50%)" },
  mastodon:   { bg: "hsl(244 67% 56% / 0.12)",  ring: "hsl(244 67% 56% / 0.30)",  fg: "#6364FF", text: "hsl(244 67% 56%)" },
  pinterest:  { bg: "hsl(351 81% 47% / 0.12)",  ring: "hsl(351 81% 47% / 0.30)",  fg: "#E60023", text: "hsl(351 81% 47%)" },
  // Dev
  github:     { bg: "hsl(0 0% 0% / 0.08)",      ring: "hsl(0 0% 0% / 0.20)",      fg: "currentColor", text: "hsl(var(--foreground))" },
  discord:    { bg: "hsl(235 86% 65% / 0.12)",  ring: "hsl(235 86% 65% / 0.30)",  fg: "#5865F2", text: "hsl(235 86% 65%)" },
  // AI engines (re-exported for unified resolver)
  chatgpt:    { bg: "hsl(172 66% 50% / 0.12)",  ring: "hsl(172 66% 50% / 0.28)",  fg: "currentColor", text: "hsl(172 66% 40%)" },
  gemini:     { bg: "hsl(217 91% 60% / 0.12)",  ring: "hsl(217 91% 60% / 0.28)",  fg: "currentColor", text: "hsl(217 91% 60%)" },
  perplexity: { bg: "hsl(187 85% 53% / 0.14)",  ring: "hsl(187 85% 53% / 0.30)",  fg: "currentColor", text: "hsl(187 85% 40%)" },
  claude:     { bg: "hsl(20 80% 50% / 0.12)",   ring: "hsl(20 80% 50% / 0.28)",   fg: "currentColor", text: "hsl(20 80% 50%)" },
  copilot:    { bg: "hsl(187 70% 50% / 0.12)",  ring: "hsl(187 70% 50% / 0.28)",  fg: "currentColor", text: "hsl(187 70% 45%)" },
};

/** Normalize a platform/engine string to a stable key */
export function platformKey(name: string): string {
  return name.toLowerCase().replace(/[\s/.-]/g, "");
}

/** Get the brand-color tokens for a given platform — falls back to neutral */
export function getPlatformBrand(name: string) {
  const key = platformKey(name).replace("googlegemini", "gemini").replace("hn", "hackernews").replace("xtwitter", "x");
  return (
    PLATFORM_BRAND_COLORS[key] ?? {
      bg: "hsl(var(--secondary))",
      ring: "hsl(var(--border))",
      fg: "currentColor",
      text: "hsl(var(--foreground))",
    }
  );
}

/** Resolve logo by platform/engine id or display name */
export function getPlatformLogo(platform: string, className = "h-5 w-5"): React.ReactNode {
  const key = platformKey(platform);
  const brand = getPlatformBrand(platform);
  const colored: React.CSSProperties = brand.fg !== "currentColor" ? { color: brand.fg } : {};
  switch (key) {
    // Communities
    case "reddit":           return <RedditLogo className={className} style={colored} />;
    case "quora":            return <QuoraLogo className={className} style={colored} />;
    case "hackernews":
    case "hn":               return <HackerNewsLogo className={className} style={colored} />;
    // Pro / publishing
    case "linkedin":         return <LinkedInLogo className={className} style={colored} />;
    case "medium":           return <MediumLogo className={className} />;
    case "substack":         return <SubstackLogo className={className} style={colored} />;
    // Social
    case "x":
    case "twitter":
    case "xtwitter":         return <XLogo className={className} />;
    case "facebook":         return <FacebookLogo className={className} style={colored} />;
    case "instagram":        return <InstagramLogo className={className} style={colored} />;
    case "youtube":          return <YouTubeLogo className={className} style={colored} />;
    case "tiktok":           return <TikTokLogo className={className} />;
    case "threads":          return <ThreadsLogo className={className} />;
    case "bluesky":          return <BlueskyLogo className={className} style={colored} />;
    case "mastodon":         return <MastodonLogo className={className} style={colored} />;
    case "pinterest":        return <PinterestLogo className={className} style={colored} />;
    // Dev
    case "github":           return <GitHubLogo className={className} />;
    case "discord":          return <DiscordLogo className={className} style={colored} />;
    // AI engines
    case "chatgpt":          return <ChatGPTLogo className={className} />;
    case "gemini":
    case "googlegemini":     return <GeminiLogo className={className} />;
    case "perplexity":       return <PerplexityLogo className={className} />;
    case "claude":           return <ClaudeLogo className={className} />;
    case "copilot":          return <CopilotLogo className={className} />;
    default:                 return <RedditLogo className={className} />;
  }
}
