import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const ChatGPTLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
  </svg>
);

export const GeminiLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size }) => (
  <svg viewBox="0 0 28 28" className={className} width={size} height={size} fill="none">
    <path d="M14 28C14 21.75 9.94 16.52 4.38 14.77C3.09 14.36 1.74 14.1 0.35 14C1.74 13.9 3.09 13.64 4.38 13.23C9.94 11.48 14 6.25 14 0C14 6.25 18.06 11.48 23.62 13.23C24.91 13.64 26.26 13.9 27.65 14C26.26 14.1 24.91 14.36 23.62 14.77C18.06 16.52 14 21.75 14 28Z" fill="url(#gemini-grad)"/>
    <defs>
      <linearGradient id="gemini-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4285F4"/>
        <stop offset="0.5" stopColor="#9B72CB"/>
        <stop offset="1" stopColor="#D96570"/>
      </linearGradient>
    </defs>
  </svg>
);

export const PerplexityLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="none">
    <path d="M12 1L4 5.5V10H7.5V18.5L12 21.5L16.5 18.5V10H20V5.5L12 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 1V8.5M12 21.5V14M4 5.5L12 8.5L20 5.5M7.5 10L12 14L16.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

export const ClaudeLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="currentColor">
    <path d="M16.98 3.41L14.4 12.34L20.59 3.41H16.98ZM3.41 3.41L11.48 21.09L13.86 12.67L8.43 3.41H3.41ZM11.49 14.67L8.93 20.59H15.58L11.49 14.67Z" fillRule="evenodd"/>
  </svg>
);

export const CopilotLogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="url(#copilot-grad)"/>
    <path d="M8 14.5C8 14.5 9.5 16.5 12 16.5C14.5 16.5 16 14.5 16 14.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="9" cy="10.5" r="1.5" fill="white"/>
    <circle cx="15" cy="10.5" r="1.5" fill="white"/>
    <defs>
      <linearGradient id="copilot-grad" x1="2" y1="2" x2="22" y2="22">
        <stop stopColor="#26C6DA"/>
        <stop offset="1" stopColor="#7C4DFF"/>
      </linearGradient>
    </defs>
  </svg>
);

export const MetaAILogo: React.FC<LogoProps> = ({ className = "h-5 w-5", size }) => (
  <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="url(#meta-grad)"/>
    <path d="M7 15C7 15 8.5 9 10.5 9C12 9 12.5 12 12.5 12C12.5 12 13 9 14.5 9C16.5 9 17 15 17 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="meta-grad" x1="2" y1="2" x2="22" y2="22">
        <stop stopColor="#0081FB"/>
        <stop offset="1" stopColor="#0064E0"/>
      </linearGradient>
    </defs>
  </svg>
);

/** Helper to get the right logo component by engine name */
export function getEngineLogo(engine: string, className?: string): React.ReactNode {
  const name = engine.toLowerCase().replace(/\s/g, "");
  switch (name) {
    case "chatgpt": return <ChatGPTLogo className={className} />;
    case "gemini":
    case "googlegemini": return <GeminiLogo className={className} />;
    case "perplexity": return <PerplexityLogo className={className} />;
    case "claude": return <ClaudeLogo className={className} />;
    case "copilot": return <CopilotLogo className={className} />;
    case "meta":
    case "metaai": return <MetaAILogo className={className} />;
    default: return <ChatGPTLogo className={className} />;
  }
}

/** Engine badge with logo + name + optional status dot */
export function EngineBadge({ name, className = "" }: { name: string; className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-[11px] font-medium ${className}`}>
      {getEngineLogo(name, "h-3.5 w-3.5")}
      <span>{name}</span>
    </div>
  );
}

/** Engine badge with green pulse dot */
export function EngineStatusBadge({ name, className = "" }: { name: string; className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-[11px] font-medium ${className}`}>
      {getEngineLogo(name, "h-3.5 w-3.5")}
      <span>{name}</span>
      <div className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
    </div>
  );
}
