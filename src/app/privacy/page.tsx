import type { Metadata } from "next";
import {
  BRAND_NAME,
  PRIVACY_POLICY,
  SEO_METADATA,
} from "@/content";

export const metadata: Metadata = {
  title: { absolute: SEO_METADATA.privacy.title },
  description: SEO_METADATA.privacy.description,
  alternates: {
    canonical: SEO_METADATA.privacy.canonical,
  },
  openGraph: {
    title: SEO_METADATA.privacy.title,
    description: SEO_METADATA.privacy.description,
    url: SEO_METADATA.privacy.canonical,
    siteName: BRAND_NAME,
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-slate py-16 px-6 md:px-12">
      <div className="max-w-[800px] mx-auto">
        {/* 1. Header Section */}
        <section
          data-section="header"
          id="header"
          className="border-b border-line pb-8 mb-10"
        >
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            Legal & Compliance
          </span>
          <h1 className="font-serif text-[40px] md:text-[52px] text-charcoal leading-tight mt-2 mb-2 font-normal">
            {PRIVACY_POLICY.title}
          </h1>
          <p className="text-xs text-slate">
            Last Updated: {PRIVACY_POLICY.lastUpdated}
          </p>
          <p className="text-sm md:text-base text-slate leading-relaxed mt-4">
            {PRIVACY_POLICY.introduction}
          </p>
        </section>

        {/* 2. Policy Content Section */}
        <section
          data-section="policy-content"
          id="policy-content"
          className="space-y-10"
        >
          {PRIVACY_POLICY.sections.map((section) => (
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
        </section>
      </div>
    </main>
  );
}
