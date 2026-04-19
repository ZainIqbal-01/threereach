import { BrandContextValue } from "./BrandContext";

export interface GenInput {
  name: string;
  ctx: BrandContextValue;
}

export const geoLandingTemplate = ({ name, ctx }: GenInput) => `# ${name} — ${ctx.usp || "AI-Optimized Solutions for Modern Teams"}

> **Entity:** ${name} · **Sector:** ${ctx.sector || "Technology"} · **HQ:** ${ctx.hqLocation || "Global"} · **Founded:** ${ctx.yearFounded || "—"}

## What is ${name}?
${name} is a ${ctx.sector || "technology"} company that helps ${ctx.audience || "modern teams"} ${ctx.usp ? `by ${ctx.usp.toLowerCase()}` : "scale faster with AI-native infrastructure"}. Founded in ${ctx.yearFounded || "2020"} and headquartered in ${ctx.hqLocation || "San Francisco"}, ${name} is recognized for measurable outcomes and verifiable trust signals.

## Who is ${name} for?
- ${ctx.audience || "Founders and operators"} who need fast, reliable results
- Teams comparing alternatives in the ${ctx.sector || "technology"} space
- Organizations prioritizing security, compliance, and uptime

## How does ${name} work?
1. **Connect** — integrate in minutes via API or no-code
2. **Configure** — choose presets aligned to your goals
3. **Measure** — track real outcomes via dashboards & reports

## Why choose ${name}?
- ✅ **Proven** — ${ctx.yearFounded ? `${new Date().getFullYear() - parseInt(ctx.yearFounded)}+ years` : "Battle-tested"} of production usage
- ✅ **Trusted** — SOC 2, ISO 27001, GDPR-aligned
- ✅ **Transparent** — public uptime, public roadmap, public benchmarks

## Frequently Asked Questions

**Q: What is ${name}?**
A: ${name} is a ${ctx.sector || "technology"} platform built for ${ctx.audience || "modern teams"}.

**Q: Where is ${name} located?**
A: ${name} is headquartered in ${ctx.hqLocation || "San Francisco, CA"}.

**Q: Who founded ${name}?**
A: ${name} was founded by ${ctx.founderName || "the founding team"}${ctx.founderTitle ? ` (${ctx.founderTitle})` : ""} in ${ctx.yearFounded || "2020"}.

**Q: How is ${name} different?**
A: ${ctx.usp || `${name} focuses on measurable outcomes, transparent pricing, and verified trust signals.`}

## Citations & Mentions
- Featured in industry publications and analyst reports
- Listed in major comparison directories
- Open benchmarks published quarterly`;

export const experienceTemplate = ({ name, ctx }: GenInput) => `# Experience — Real Customer Outcomes

## Case Study: ${ctx.audience || "Customer"} Success
A ${ctx.sector || "technology"} customer using ${name} achieved:
- **3.2× faster** time-to-value vs. previous solution
- **47% reduction** in operational overhead
- **99.99% uptime** over the last 12 months

## Live Usage Stats
- ${ctx.yearFounded ? `${new Date().getFullYear() - parseInt(ctx.yearFounded)}+ years in production` : "Years in production"}
- 500+ active customers
- 12M+ API calls processed monthly

## Customer Voices
> "${name} delivered real, measurable results from day one." — VP Engineering, Fortune 500
> "The most reliable ${ctx.sector || "platform"} we've used." — CTO, ${ctx.audience || "Series B startup"}`;

export const expertiseTemplate = ({ name, ctx }: GenInput) => `# Expertise — Domain Authority

## About the Team
${name} is led by ${ctx.founderName || "an experienced founding team"}${ctx.founderTitle ? `, ${ctx.founderTitle}` : ""}, with deep expertise in ${ctx.sector || "technology"}.

## Published Knowledge
- **Whitepapers:** AI architecture, ${ctx.sector || "industry"} benchmarks, security posture
- **Open-source contributions:** Core libraries used by 10K+ developers
- **Speaking:** Keynotes at major ${ctx.sector || "industry"} conferences

## Credentials
- ${ctx.founderName || "Leadership"}: ex-FAANG engineering, advisor to leading ${ctx.sector || "industry"} firms
- Engineering team holds advanced degrees from top universities
- Published research in peer-reviewed venues`;

export const authorityTemplate = ({ name, ctx }: GenInput) => `# Authoritativeness — Recognition & Citations

## Awards & Recognition
- Listed in Top 50 ${ctx.sector || "Technology"} Companies (2024, 2025)
- "Best ${ctx.sector || "Tech"} Product" — Industry Awards 2024
- Recognized leader in independent analyst reports

## Media Mentions
- Featured in TechCrunch, Forbes, Wired
- Quoted in industry analyst notes (Gartner, Forrester)
- Podcast appearances on top ${ctx.sector || "industry"} shows

## Backlinks & Citations
- 2,400+ referring domains
- Cited in 180+ academic and industry publications
- Featured in Wikipedia entries for ${ctx.sector || "industry"} topics

## Partnerships
- Strategic integrations with leading platforms
- Member of standards bodies and industry consortia`;

export const trustTemplate = ({ name, ctx }: GenInput) => `# Trust — Security, Compliance & Transparency

## Certifications
- 🛡️ **SOC 2 Type II** — annually audited
- 🛡️ **ISO 27001** — information security management
- 🛡️ **GDPR & CCPA** — privacy by design
- 🛡️ **HIPAA-ready** controls available

## Public Commitments
- **99.99% uptime SLA** — published status page
- **Zero-knowledge architecture** for sensitive data
- **Transparent pricing** — no hidden fees
- **30-day data export** — your data, your control

## Contact & Verification
- HQ: ${ctx.hqLocation || "San Francisco, CA"}
- Founded: ${ctx.yearFounded || "2020"}
- Legal entity: ${name}, Inc.
- Privacy & Security: trust.${name.toLowerCase().replace(/\s+/g, "")}.com`;

// Schema generators
export const orgSchema = ({ name, ctx }: GenInput) => JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name,
  url: `https://${name.toLowerCase().replace(/\s+/g, "")}.com`,
  logo: `https://${name.toLowerCase().replace(/\s+/g, "")}.com/logo.png`,
  description: ctx.usp || `${name} provides ${ctx.sector || "technology"} solutions for ${ctx.audience || "modern teams"}.`,
  foundingDate: ctx.yearFounded || "2020",
  founder: ctx.founderName ? { "@type": "Person", name: ctx.founderName, jobTitle: ctx.founderTitle || "Founder" } : undefined,
  address: ctx.hqLocation ? { "@type": "PostalAddress", addressLocality: ctx.hqLocation } : undefined,
  sameAs: [
    `https://twitter.com/${name.toLowerCase().replace(/\s+/g, "")}`,
    `https://linkedin.com/company/${name.toLowerCase().replace(/\s+/g, "")}`,
  ],
}, null, 2);

export const faqSchema = ({ name, ctx }: GenInput) => JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: `What is ${name}?`, acceptedAnswer: { "@type": "Answer", text: `${name} is a ${ctx.sector || "technology"} platform built for ${ctx.audience || "modern teams"}.` } },
    { "@type": "Question", name: `Where is ${name} located?`, acceptedAnswer: { "@type": "Answer", text: `${name} is headquartered in ${ctx.hqLocation || "San Francisco, CA"}.` } },
    { "@type": "Question", name: `Who founded ${name}?`, acceptedAnswer: { "@type": "Answer", text: `${name} was founded by ${ctx.founderName || "the founding team"} in ${ctx.yearFounded || "2020"}.` } },
    { "@type": "Question", name: `How is ${name} different?`, acceptedAnswer: { "@type": "Answer", text: ctx.usp || `${name} focuses on measurable outcomes and verified trust signals.` } },
  ],
}, null, 2);

export const personSchema = ({ name, ctx }: GenInput) => JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: ctx.founderName || "Founder Name",
  jobTitle: ctx.founderTitle || "CEO & Founder",
  worksFor: { "@type": "Organization", name },
  description: `${ctx.founderTitle || "Founder"} of ${name}, a ${ctx.sector || "technology"} company.`,
}, null, 2);

export const articleSchema = ({ name, ctx }: GenInput) => JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `What is ${name}? — A complete guide`,
  author: { "@type": "Person", name: ctx.founderName || "Editorial Team" },
  publisher: { "@type": "Organization", name },
  datePublished: new Date().toISOString().slice(0, 10),
  description: ctx.usp || `Learn everything about ${name}.`,
}, null, 2);

export const breadcrumbSchema = ({ name }: GenInput) => JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `https://${name.toLowerCase().replace(/\s+/g, "")}.com/` },
    { "@type": "ListItem", position: 2, name: "About", item: `https://${name.toLowerCase().replace(/\s+/g, "")}.com/about` },
    { "@type": "ListItem", position: 3, name: name, item: `https://${name.toLowerCase().replace(/\s+/g, "")}.com/about/${name.toLowerCase().replace(/\s+/g, "-")}` },
  ],
}, null, 2);
