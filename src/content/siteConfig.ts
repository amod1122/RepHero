import type { PartnerBadge } from "./types";

export const BRAND_NAME = "RepHero";
export const COMPANY_NAME = "RepHero Global LLC";
export const DOMAIN = "www.rephero.co";
export const TAGLINE = "Trained remote professionals for healthcare practices.";
export const SUPPORTING_LINE = "RepHero places trained, HIPAA-compliant team members into your practice, so your providers can focus on patients and your admin work gets done.";
export const DISCOVERY_CALL_LENGTH_MINUTES = 15;

export const COMPLIANCE_STATEMENT = "RepHero provides HIPAA-trained remote professionals and executes a Business Associate Agreement (BAA) with every covered entity client. RepHero does not store or process protected health information (PHI) through this website.";
export const BAA_STATEMENT = "HIPAA-trained staff, with a signed Business Associate Agreement (BAA) on every engagement.";
export const PHI_WARNING_NOTICE = "Notice: Do not include protected health information (PHI) or patient information in this form. RepHero complies with HIPAA standards. RepHero collects business contact details only.";
export const COPYRIGHT_TEXT = "© 2026 RepHero Global LLC. All rights reserved.";

export const CONTACT_INFO = {
  email: "sarahali@rephero.co",
  phone: "+1 (800) 555-0199", // PLACEHOLDER
  location: "United States",
  address: "100 Pine Street, Suite 1250, San Francisco, CA 94111", // PLACEHOLDER
};

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/rephero-global", // PLACEHOLDER
};

export const CTA_LABELS = {
  primary: "Book a Call",
  roleCard: "Book a call about this role",
  calculator: "Get a custom plan",
  secondaryServices: "View Services",
  secondaryCalculator: "Estimate Your Savings",
};

export const TRUST_POINTS = [
  {
    id: "savings",
    title: "50-60% Savings",
    description: "Substantial overhead reduction vs. equivalent local hires.",
  },
  {
    id: "hipaa",
    title: "HIPAA-Trained & BAA",
    description: "Trained remote staff with a signed BAA on every engagement.",
  },
  {
    id: "pricing",
    title: "Flat Monthly Pricing",
    description: "Predictable monthly rates with no hidden fees or taxes.",
  },
  {
    id: "communication",
    title: "Proactive Communication",
    description: "Dedicated account management so you never chase an update.",
  },
];

export const PARTNER_BADGES: PartnerBadge[] = [
  { id: "dental-partner", name: "Dental Practice Partner", category: "Dental" },
  { id: "primary-care", name: "Primary Care Clinic", category: "Primary Care" },
  { id: "behavioral-health", name: "Behavioral Health Group", category: "Behavioral Health" },
  { id: "hospice-provider", name: "Hospice Care Provider", category: "Hospice & Home Health" },
];
