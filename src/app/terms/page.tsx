import type { Metadata } from "next";
import {
  BRAND_NAME,
  TERMS_OF_USE,
  SEO_METADATA,
} from "@/content";
import { RevealSection } from "@/components/Motion";

export const metadata: Metadata = {
  title: { absolute: SEO_METADATA.terms.title },
  description: SEO_METADATA.terms.description,
  alternates: {
    canonical: SEO_METADATA.terms.canonical,
  },
  openGraph: {
    title: SEO_METADATA.terms.title,
    description: SEO_METADATA.terms.description,
    url: SEO_METADATA.terms.canonical,
    siteName: BRAND_NAME,
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-slate py-16 px-6 md:px-12">
      <div className="max-w-[800px] mx-auto">
        {/* 1. Header Section */}
        <RevealSection
          data-section="header"
          id="header"
          className="border-b border-line pb-8 mb-10"
        >
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            Legal & Compliance
          </span>
          <h1 className="font-serif text-[40px] md:text-[52px] text-charcoal leading-tight mt-2 mb-2 font-normal">
            {TERMS_OF_USE.title}
          </h1>
          <p className="text-xs text-slate">
            Last Updated: {TERMS_OF_USE.lastUpdated}
          </p>
          <p className="text-sm md:text-base text-slate leading-relaxed mt-4">
            {TERMS_OF_USE.introduction}
          </p>
        </RevealSection>

        {/* 2. Terms Content Section */}
        <RevealSection
          data-section="terms-content"
          id="terms-content"
          className="space-y-10"
        >
          {TERMS_OF_USE.sections.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-20">
              <h2 className="font-sans font-semibold text-lg md:text-xl text-charcoal mb-3">
                {section.heading}
              </h2>
              <div className="space-y-3 text-sm md:text-base text-slate leading-relaxed">
                {section.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </RevealSection>
      </div>
    </main>
  );
}
