import { describe, it, expect } from "vitest";
import {
  sanitize,
  validateOnboardingForm,
  validateBrandIntelligenceForm,
  validateScanQuery,
  validateContentTopic,
} from "@/lib/validation";

describe("sanitize", () => {
  it("strips HTML tags and dangerous characters", () => {
    expect(sanitize('<script>alert("xss")</script>hi')).toBe("alert(xss)hi");
  });
  it("leaves clean text untouched", () => {
    expect(sanitize("Hello world 42")).toBe("Hello world 42");
  });
});

describe("validateOnboardingForm", () => {
  const base = { websiteUrl: "", businessName: "", description: "", services: "" };

  it("requires URL or business name", () => {
    const r = validateOnboardingForm(base);
    expect(r.valid).toBe(false);
    expect(r.errors.businessName).toMatch(/required/i);
  });

  it("accepts URL without protocol", () => {
    const r = validateOnboardingForm({ ...base, websiteUrl: "linear.app" });
    expect(r.valid).toBe(true);
  });

  it("rejects malformed URLs", () => {
    const r = validateOnboardingForm({ ...base, websiteUrl: "ht!tp://" });
    expect(r.valid).toBe(false);
  });

  it("enforces description length cap", () => {
    const r = validateOnboardingForm({ ...base, businessName: "Acme", description: "a".repeat(1001) });
    expect(r.errors.description).toBeDefined();
  });
});

describe("validateBrandIntelligenceForm", () => {
  it("requires brandName and website", () => {
    const r = validateBrandIntelligenceForm({ brandName: "", website: "" });
    expect(r.valid).toBe(false);
    expect(r.errors.brandName).toBeDefined();
    expect(r.errors.website).toBeDefined();
  });

  it("limits competitors to 10", () => {
    const r = validateBrandIntelligenceForm({
      brandName: "Acme",
      website: "acme.com",
      competitors: Array(11).fill("x"),
    });
    expect(r.errors.competitors).toBeDefined();
  });
});

describe("validateScanQuery", () => {
  it("rejects empty queries", () => {
    expect(validateScanQuery("   ").valid).toBe(false);
  });
  it("accepts reasonable queries", () => {
    expect(validateScanQuery("best fintech tools").valid).toBe(true);
  });
});

describe("validateContentTopic", () => {
  it("validates known platforms", () => {
    expect(validateContentTopic("AI trends", "linkedin").valid).toBe(true);
  });
  it("rejects unknown platforms", () => {
    const r = validateContentTopic("AI trends", "myspace");
    expect(r.valid).toBe(false);
    expect(r.errors.platform).toBeDefined();
  });
});
