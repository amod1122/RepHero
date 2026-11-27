import type { Metadata } from "next";
import Link from "next/link";
import {
  BRAND_NAME,
  ABOUT_HEADER,
  ABOUT_MISSION,
  HOW_WE_WORK_PILLARS,
  CORE_VALUES,
  LEADERSHIP_INFO,
  CTA_LABELS,
  SEO_METADATA,
} from "@/content";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import { RevealSection } from "@/components/Motion";

export const metadata: Metadata = {
  title: { absolute: SEO_METADATA.about.title },
  description: SEO_METADATA.about.description,
  alternates: {
    canonical: SEO_METADATA.about.canonical,
  },
  openGraph: {
    title: SEO_METADATA.about.title,
    description: SEO_METADATA.about.description,
    url: SEO_METADATA.about.canonical,
    siteName: BRAND_NAME,
    type: "website",
  },
};

export default function AboutPage() {
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
            {ABOUT_HEADER.eyebrow}
          </span>
          <h1 className="font-serif text-[40px] md:text-[56px] text-charcoal leading-tight mt-2 mb-4 font-normal">
            {ABOUT_HEADER.heading}
          </h1>
          <p className="text-base md:text-lg text-slate leading-relaxed">
            {ABOUT_HEADER.description}
          </p>
        </div>
      </RevealSection>

      {/* 2. Story Section */}
      <RevealSection
        data-section="story"
        id="story"
        className="py-16 px-6 md:px-12 max-w-[900px] mx-auto"
      >
        <div className="border border-line rounded-[2px] p-8 md:p-12 bg-white shadow-sm">
          <span className="text-xs uppercase tracking-wider text-navy font-semibold">
            {ABOUT_MISSION.eyebrow}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mt-2 mb-6 font-normal">
            {ABOUT_MISSION.heading}
          </h2>
          <p className="text-lg text-charcoal font-medium leading-relaxed mb-6">
            {ABOUT_MISSION.lead}
          </p>
          <div className="space-y-4 text-base text-slate leading-relaxed">
            {ABOUT_MISSION.storyParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* 3. How We Work Section */}
      <RevealSection
        data-section="how-we-work"
        id="how-we-work"
        className="py-16 px-6 md:px-12 bg-mist border-y border-line"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
              Operational Tenets
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mt-2 font-normal">
              How We Work
            </h2>
            <p className="text-slate mt-3 text-base">
              A healthcare-first staffing model designed around compliance, transparency, and seamless clinic integration.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_WE_WORK_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="p-8 bg-white border border-line rounded-[2px] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-sans font-semibold text-xl text-charcoal mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* 4. Core Values Section */}
      <RevealSection
        data-section="values"
        id="values"
        className="py-16 px-6 md:px-12 max-w-[1200px] mx-auto"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            Our Guiding Principles
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mt-2 font-normal">
            Core Values
          </h2>
          <p className="text-slate mt-3 text-base">
            The foundation of every client engagement and remote professional placement.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_VALUES.map((val) => (
            <div
              key={val.id}
              className="p-6 bg-mist border border-line rounded-[2px] border-l-2 border-l-navy"
            >
              <h3 className="font-sans font-semibold text-lg text-charcoal mb-2">
                {val.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* 5. Leadership Section */}
      <RevealSection
        data-section="leadership"
        id="leadership"
        className="py-16 px-6 md:px-12 bg-mist border-t border-line"
      >
        <div className="max-w-[800px] mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            {LEADERSHIP_INFO.eyebrow}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mt-2 mb-4 font-normal">
            {LEADERSHIP_INFO.heading}
          </h2>
          <p className="text-base text-slate leading-relaxed mb-6">
            {LEADERSHIP_INFO.description}
          </p>
          <p className="text-sm text-slate leading-relaxed mb-8">
            {LEADERSHIP_INFO.operatingModel}
          </p>
          <div className="inline-flex justify-center">
            <PlaceholderBadge
              id={15}
              label="Leadership Bios Pending"
              category="copy"
              notes="Leadership bios and photos pending"
            />
          </div>
        </div>
      </RevealSection>

      {/* 6. Closing CTA */}
      <RevealSection
        data-section="cta"
        id="cta"
        className="py-20 px-6 md:px-12 bg-ink text-white text-center"
      >
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-serif text-[36px] md:text-[52px] leading-tight mb-6">
            Partner With RepHero Global
          </h2>
          <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
            Speak with our leadership team to evaluate how trained remote professionals can support your healthcare practice.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book-a-call"
              className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-[2px] bg-white text-ink hover:bg-mist transition-colors shadow-sm"
            >
              {CTA_LABELS.primary}
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-[2px] bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
            >
              How It Works
            </Link>
          </div>
        </div>
      </RevealSection>
    </main>
  );
}
