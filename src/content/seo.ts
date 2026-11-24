export interface RouteSeoMetadata {
  path: string;
  title: string;
  description: string;
  canonical: string;
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  inSitemap: boolean;
}

export const SITE_METADATA_BASE = "https://www.rephero.co";

export const SEO_METADATA: Record<string, RouteSeoMetadata> = {
  home: {
    path: "/",
    title: "RepHero | Trained Remote Professionals for Healthcare Practices",
    description: "RepHero places trained, HIPAA-compliant remote professionals into US healthcare practices. Front desk, medical billing, clinical support, and after-hours coverage with 50-60% savings.",
    canonical: "https://www.rephero.co/",
    priority: 1.0,
    changeFrequency: "weekly",
    inSitemap: true,
  },
  services: {
    path: "/services",
    title: "Services and Pricing | RepHero",
    description: "Explore all 9 trained remote healthcare roles across admin, medical billing, compliance, and creative support with transparent flat monthly pricing.",
    canonical: "https://www.rephero.co/services/",
    priority: 0.9,
    changeFrequency: "weekly",
    inSitemap: true,
  },
  industries: {
    path: "/industries",
    title: "Industries We Serve | RepHero",
    description: "Specialized remote healthcare staffing for Family Medicine, Hospice, Behavioral Health, Dental Practices, Specialty Pharmacy, and Pain Management.",
    canonical: "https://www.rephero.co/industries/",
    priority: 0.8,
    changeFrequency: "monthly",
    inSitemap: true,
  },
  howItWorks: {
    path: "/how-it-works",
    title: "How It Works | RepHero",
    description: "Our streamlined 6-step healthcare staffing process from initial 15-minute discovery consultation to candidate matching, signed BAA, and ongoing proactive support.",
    canonical: "https://www.rephero.co/how-it-works/",
    priority: 0.8,
    changeFrequency: "monthly",
    inSitemap: true,
  },
  savingsCalculator: {
    path: "/savings-calculator",
    title: "Staffing Savings Calculator | RepHero",
    description: "Calculate how much your healthcare practice can save by transitioning administrative and revenue cycle roles to trained remote professionals.",
    canonical: "https://www.rephero.co/savings-calculator/",
    priority: 0.8,
    changeFrequency: "monthly",
    inSitemap: true,
  },
  successStories: {
    path: "/success-stories",
    title: "Client Success Stories | RepHero",
    description: "Real client outcomes and testimonials from US healthcare practices partnering with RepHero Global for remote front desk, medical billing, and administrative staffing.",
    canonical: "https://www.rephero.co/success-stories/",
    priority: 0.7,
    changeFrequency: "monthly",
    inSitemap: true,
  },
  about: {
    path: "/about",
    title: "About RepHero Global | RepHero",
    description: "Learn about RepHero Global LLC: our mission to relieve healthcare administrative burden through trained, HIPAA-compliant remote professionals.",
    canonical: "https://www.rephero.co/about/",
    priority: 0.7,
    changeFrequency: "monthly",
    inSitemap: true,
  },
  bookCall: {
    path: "/book-a-call",
    title: "Book a Discovery Call | RepHero",
    description: "Schedule a focused 15-minute consultation with a RepHero healthcare staffing specialist to assess your practice needs.",
    canonical: "https://www.rephero.co/book-a-call/",
    priority: 0.9,
    changeFrequency: "monthly",
    inSitemap: true,
  },
  thankYou: {
    path: "/thank-you",
    title: "Thank You | RepHero",
    description: "Thank you for requesting a discovery call with RepHero. Our healthcare staffing directors will review your practice information and be in touch.",
    canonical: "https://www.rephero.co/thank-you/",
    priority: 0.1,
    changeFrequency: "yearly",
    inSitemap: true,
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy | RepHero",
    description: "RepHero Global LLC Privacy Policy. Details our data collection practices, non-collection of Protected Health Information (PHI), and Business Associate Agreement standards.",
    canonical: "https://www.rephero.co/privacy/",
    priority: 0.3,
    changeFrequency: "yearly",
    inSitemap: true,
  },
  terms: {
    path: "/terms",
    title: "Terms of Use | RepHero",
    description: "RepHero Global LLC Terms of Use. Governing website access, staffing estimates disclaimer, and Business Associate Agreement requirements.",
    canonical: "https://www.rephero.co/terms/",
    priority: 0.3,
    changeFrequency: "yearly",
    inSitemap: true,
  },
  notFound: {
    path: "/not-found",
    title: "Page Not Found (404) | RepHero",
    description: "The page you requested could not be found. Return to RepHero Home or explore our healthcare staffing services.",
    canonical: "https://www.rephero.co/not-found/",
    priority: 0.0,
    changeFrequency: "never",
    inSitemap: false,
  },
};
