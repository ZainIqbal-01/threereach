/**
 * Shared security utilities for all edge functions.
 * Provides IP+user rate limiting, input sanitization, and CORS helpers.
 * 
 * OWASP references:
 * - A04:2021 Insecure Design (rate limiting)
 * - A03:2021 Injection (input sanitization)
 * - A07:2021 Identification and Authentication Failures
 */

// ─── CORS ───
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export function corsResponse() {
  return new Response(null, { headers: corsHeaders });
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function errorResponse(message: string, status = 500) {
  // Never leak stack traces or internal details to the client (OWASP A09)
  return jsonResponse({ error: message }, status);
}

// ─── RATE LIMITING (in-memory, per-isolate) ───
// Uses a sliding-window counter per IP. Deno Deploy isolates recycle
// periodically, so this is best-effort — sufficient for abuse prevention.
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Garbage-collect expired entries every 60 s to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) rateLimitStore.delete(key);
  }
}, 60_000);

interface RateLimitOpts {
  /** Max requests per window (default 20) */
  maxRequests?: number;
  /** Window size in milliseconds (default 60 000 = 1 min) */
  windowMs?: number;
}

/**
 * Check rate limit for a request. Returns null if allowed,
 * or a 429 Response if rate-limited.
 */
export function checkRateLimit(
  req: Request,
  opts: RateLimitOpts = {}
): Response | null {
  const { maxRequests = 20, windowMs = 60_000 } = opts;

  // Extract client IP from standard proxy headers (OWASP rate-limit best practice)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    // New window
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count++;

  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return new Response(
      JSON.stringify({
        error: "Too many requests. Please try again later.",
        retryAfterSeconds: retryAfter,
      }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
        },
      }
    );
  }

  return null;
}

// ─── INPUT SANITIZATION ───

/** Strip HTML/script tags and trim whitespace (OWASP A03 - Injection) */
export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[<>"'&]/g, "") // Remove dangerous chars
    .trim();
}

/** Validate and sanitize a URL string */
export function sanitizeUrl(input: unknown): string {
  const cleaned = sanitizeString(input);
  if (!cleaned) return "";
  // Only allow http/https URLs
  try {
    const url = new URL(cleaned.startsWith("http") ? cleaned : `https://${cleaned}`);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    return url.toString();
  } catch {
    return "";
  }
}

/** Enforce maximum length on a string */
export function enforceLength(input: string, max: number): string {
  return input.slice(0, max);
}

/** Validate that an array contains only allowed string values */
export function validateStringArray(
  input: unknown,
  allowed: string[],
  maxItems = 10
): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is string => typeof item === "string" && allowed.includes(item))
    .slice(0, maxItems);
}

/** Safe JSON parse that never throws */
export async function safeParseBody(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const text = await req.text();
    // Reject excessively large payloads (OWASP A04 - DoS prevention)
    if (text.length > 50_000) return null;
    const parsed = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}
