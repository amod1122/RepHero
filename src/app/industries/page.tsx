import type { Metadata } from "next";
import Link from "next/link";
import {
  BRAND_NAME,
  INDUSTRIES,
  CTA_LABELS,
  SEO_METADATA,
} from "@/content";
import { IndustryCard } from "@/components/IndustryCard";
import { RevealSection } from "@/components/Motion";

export const metadata: Metadata = {
  title: { absolute: SEO_METADATA.industries.title },
  description: SEO_METADATA.industries.description,
  alternates: {
    canonical: SEO_METADATA.industries.canonical,
  },
  openGraph: {
    title: SEO_METADATA.industries.title,
    description: SEO_METADATA.industries.description,
    url: SEO_METADATA.industries.canonical,
    siteName: BRAND_NAME,
    type: "website",
  },
};

export default function IndustriesPage() {
  const anchorPills = [
    { href: "#family-medicine", label: "Family Medicine" },
    { href: "#hospice-home-health", label: "Hospice & Home Health" },
    { href: "#behavioral-health", label: "Behavioral Health" },
    { href: "#dental", label: "Dental Practices" },
    { href: "#specialty-pharmacy", label: "Specialty Pharmacy" },
    { href: "#pain-management", label: "Pain Management" },
  ];

  return (
    <main className="min-h-screen bg-white text-slate">
      {/* 1. Header Section */}
      <RevealSection
        data-section="header"
        id="header"
        className="py-16 md:py-20 px-6 md:px-12 text-center bg-mist border-b border-line"
      >
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            Specialized Practice Solutions
          </span>
          <h1 className="font-serif text-[40px] md:text-[56px] text-charcoal leading-tight mt-2 mb-4 font-normal">
            Tailored Staffing for Healthcare Verticals
          </h1>
          <p className="text-base md:text-lg text-slate leading-relaxed">
            Every healthcare specialty faces unique administrative, clinical, and billing workflows. RepHero provides specialized remote professionals trained in your specific field.
          </p>
        </div>
      </RevealSection>

      {/* 2. Anchor Jump Navigation */}
      <RevealSection
        data-section="anchor-nav"
        id="anchor-nav"
        className="sticky top-[73px] z-20 bg-white/95 backdrop-blur-sm border-b border-line py-4 px-6 md:px-12"
      >
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {anchorPills.map((pill) => (
            <a
              key={pill.href}
              href={pill.href}
              className="text-xs font-medium px-3.5 py-1.5 rounded-[2px] bg-mist text-charcoal border border-line hover:border-navy hover:text-navy transition-colors"
            >
              {pill.label}
            </a>
          ))}
        </div>
      </RevealSection>

      {/* 3. Industry Sections */}
      <RevealSection
        data-section="industry-sections"
        id="industry-sections"
        className="py-12 px-6 md:px-12 max-w-[1200px] mx-auto space-y-16"
      >
        {INDUSTRIES.map((industry) => (
          <div key={industry.id} className="relative">
            {/* Alias for hospice anchor #hospice without duplicating #hospice-home-health */}
            {industry.id === "hospice-home-health" && (
              <div id="hospice" className="scroll-mt-32 -mt-32 absolute top-0" aria-hidden="true" />
            )}
            <IndustryCard industry={industry} variant="section" />
          </div>
        ))}
      </RevealSection>

      {/* 4. Closing CTA */}
      <RevealSection
        data-section="cta"
        id="cta"
        className="py-20 px-6 md:px-12 bg-ink text-white text-center"
      >
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-serif text-[36px] md:text-[52px] leading-tight mb-6">
            Get Vertical-Specific Staffing for Your Practice
          </h2>
          <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
            Book a 15-minute consultation with a RepHero healthcare staffing director to discuss your specialty workflows.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book-a-call"
              className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-[2px] bg-white text-ink hover:bg-mist transition-colors shadow-sm"
            >
              {CTA_LABELS.primary}
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-[2px] bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
            >
              {CTA_LABELS.secondaryServices}
            </Link>
          </div>
        </div>
      </RevealSection>
    </main>
  );
}
