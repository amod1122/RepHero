import type { TestimonialBanner } from './types';

/**
 * Filters an array of testimonials to only approved, published items for public view.
 */
export function filterApprovedTestimonials(testimonials: TestimonialBanner[]): TestimonialBanner[] {
  if (!Array.isArray(testimonials)) return [];
  return testimonials.filter(
    (item) => Boolean(item && item.isApproved === true && item.status === "published")
  );
}

/**
 * Invariant Attribution Helper.
 * Enforces PRD §8.5, PRD §13 Q3, Essentials §3, and TEST-T2-TEST-005.
 * Odonto Dental / Testimonial 1 attribution MUST strictly be "Client Feedback",
 * never an individual's name or client entity name.
 */
export function getEnforcedAttribution(testimonial: Partial<TestimonialBanner> | null | undefined): string {
  if (!testimonial) return "Client Feedback";
  const idLower = (testimonial.id || "").toLowerCase();
  const clientLower = (testimonial.client || "").toLowerCase();

  if (
    idLower.includes("odonto") ||
    clientLower.includes("odonto") ||
    idLower === "testimonial-1" ||
    idLower === "testimonial-odonto-dental"
  ) {
    return "Client Feedback";
  }

  return testimonial.attribution || "Client Feedback";
}

/**
 * Logo resolution with fallback to wordmark badge
 */
export function resolveClientLogo(item: any): { type: string; content: string } {
  if (!item) return { type: 'none', content: '' };
  if (item.logoUrl && typeof item.logoUrl === 'string' && item.logoUrl.trim().length > 0) {
    return { type: 'image', content: item.logoUrl };
  }
  return {
    type: 'wordmark',
    content: item.client || item.logoPlaceholder || 'Client Partner'
  };
}

export const TESTIMONIAL_BANNERS: TestimonialBanner[] = [
  {
    id: "testimonial-odonto-dental",
    client: "Odonto Dental",
    serviceHighlighted: "Five front-desk agents and after-hours support",
    eyebrow: "CLIENT SUCCESS STORY | DENTAL FRONT DESK SUPPORT",
    headline: "A front desk that feels in-house, with five dedicated agents",
    quote: "RepHero has completely transformed our front-office operations. Our five dedicated agents handle scheduling and patient inquiries seamlessly, and the after-hours coverage ensures our patients always reach a live, knowledgeable professional. It truly feels like they are sitting right in our clinic reception.",
    attribution: "Client Feedback", // STRICT REQUIREMENT: Attribution MUST strictly be "Client Feedback"
    isApproved: true,
    status: "published",
    backgroundTheme: "dental",
    backgroundDirection: "Bright dental clinic reception or treatment room",
    logoPlaceholder: "Odonto Dental (Grayscale logo pending permission)",
  },
  {
    id: "testimonial-tareen-dental",
    client: "Tareen Dental",
    serviceHighlighted: "Dental front-desk support",
    eyebrow: "CLIENT SUCCESS STORY | DENTAL CLINIC SUPPORT",
    headline: "Smooth patient experience from the first call",
    quote: "Our dental front office has achieved seamless patient scheduling and prompt insurance verification since partnering with RepHero Global.",
    attribution: "Practice Administrator, Tareen Dental",
    isApproved: false, // PENDING PERMISSION
    status: "pending",
    backgroundTheme: "dental",
    backgroundDirection: "Dental clinic front office",
    logoPlaceholder: "Tareen Dental (Permission and logo pending)",
  },
  {
    id: "testimonial-mypsychmd",
    client: "MyPsychMD",
    serviceHighlighted: "Mental health practice support",
    eyebrow: "CLIENT SUCCESS STORY | BEHAVIORAL HEALTH SUPPORT",
    headline: "Support that lets clinicians focus on care",
    quote: "Having dedicated, HIPAA-compliant remote staff manage our intake scheduling and billing inquiries allows our clinical therapists to dedicate 100% of their energy to patient care.",
    attribution: "Clinical Director, MyPsychMD",
    isApproved: false, // PENDING PERMISSION
    status: "pending",
    backgroundTheme: "mental-health",
    backgroundDirection: "Calm, soft-toned mental health practice setting",
    logoPlaceholder: "MyPsychMD (Permission and logo pending)",
  },
  {
    id: "testimonial-fastsigns",
    client: "FASTSIGNS",
    serviceHighlighted: "Graphic designer, client satisfaction",
    eyebrow: "CLIENT SUCCESS STORY | CREATIVE STUDIO SUPPORT",
    headline: "Design delivered with client satisfaction",
    quote: "The dedicated graphic designer provided by RepHero delivers creative collateral on time, with exceptional attention to detail and zero micromanagement required.",
    attribution: "Operations Manager, FASTSIGNS",
    isApproved: false, // PENDING PERMISSION
    status: "pending",
    backgroundTheme: "creative",
    backgroundDirection: "Creative studio or design workspace",
    logoPlaceholder: "FASTSIGNS (Permission and logo pending)",
  },
];

export const SUCCESS_STORIES_HEADER = {
  eyebrow: "Client Results & Outcomes",
  heading: "Client Success Stories",
  description: "Real client outcomes and testimonials from US healthcare practices partnering with RepHero Global for remote front desk, medical billing, and administrative staffing.",
};

export const RESULTS_STRIP_METRICS = [
  { value: "50–60%", label: "Typical Overhead Savings" },
  { value: "5", label: "Dedicated Front-Desk Agents Placed" },
  { value: "100%", label: "HIPAA Compliance & Signed BAA" },
  { value: "24/7", label: "After-Hours Coverage Capability" },
];

