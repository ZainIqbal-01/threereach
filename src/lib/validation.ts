/**
 * Client-side input validation utilities.
 * 
 * These complement server-side validation — NEVER rely on client-side
 * validation alone for security (OWASP A04).
 */

// ─── Sanitization ───

/** Strip HTML tags and dangerous characters from user input */
export function sanitize(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"']/g, "");
}

// ─── Validation schemas ───

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/** Validate onboarding form data */
export function validateOnboardingForm(data: {
  websiteUrl: string;
  businessName: string;
  description: string;
  services: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // At least one of URL or business name is required
  const hasUrl = data.websiteUrl.trim().length > 0;
  const hasName = data.businessName.trim().length > 0;

  if (!hasUrl && !hasName) {
    errors.businessName = "Business name or website URL is required";
  }

  if (hasUrl) {
    if (data.websiteUrl.length > 500) {
      errors.websiteUrl = "URL must be under 500 characters";
    } else {
      try {
        const url = data.websiteUrl.startsWith("http")
          ? data.websiteUrl
          : `https://${data.websiteUrl}`;
        new URL(url);
      } catch {
        errors.websiteUrl = "Please enter a valid URL";
      }
    }
  }

  if (hasName && data.businessName.length > 200) {
    errors.businessName = "Business name must be under 200 characters";
  }

  if (data.description.length > 1000) {
    errors.description = "Description must be under 1000 characters";
  }

  if (data.services.length > 500) {
    errors.services = "Services must be under 500 characters";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Validate brand intelligence form data */
export function validateBrandIntelligenceForm(data: {
  brandName: string;
  website: string;
  description?: string;
  industry?: string;
  competitors?: string[];
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.brandName.trim()) {
    errors.brandName = "Brand name is required";
  } else if (data.brandName.length > 200) {
    errors.brandName = "Brand name must be under 200 characters";
  }

  if (!data.website.trim()) {
    errors.website = "Website URL is required";
  } else if (data.website.length > 500) {
    errors.website = "URL must be under 500 characters";
  } else {
    try {
      const url = data.website.startsWith("http")
        ? data.website
        : `https://${data.website}`;
      new URL(url);
    } catch {
      errors.website = "Please enter a valid URL";
    }
  }

  if (data.description && data.description.length > 1000) {
    errors.description = "Description must be under 1000 characters";
  }

  if (data.industry && data.industry.length > 100) {
    errors.industry = "Industry must be under 100 characters";
  }

  if (data.competitors && data.competitors.length > 10) {
    errors.competitors = "Maximum 10 competitors allowed";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Validate AI scan query */
export function validateScanQuery(query: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!query.trim()) {
    errors.query = "Search query is required";
  } else if (query.length > 500) {
    errors.query = "Query must be under 500 characters";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Validate content generation topic */
export function validateContentTopic(topic: string, platform: string): ValidationResult {
  const errors: Record<string, string> = {};
  const allowedPlatforms = ["reddit", "quora", "linkedin", "medium", "hackernews", "twitter"];

  if (!topic.trim()) {
    errors.topic = "Topic is required";
  } else if (topic.length > 500) {
    errors.topic = "Topic must be under 500 characters";
  }

  if (!allowedPlatforms.includes(platform)) {
    errors.platform = "Please select a valid platform";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
