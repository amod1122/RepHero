import type { Metadata } from "next";
import Link from "next/link";
import {
  BRAND_NAME,
  TESTIMONIAL_BANNERS,
  SUCCESS_STORIES_HEADER,
  RESULTS_STRIP_METRICS,
  CTA_LABELS,
  SEO_METADATA,
  filterApprovedTestimonials,
} from "@/content";
import { SuccessStoryBanner } from "@/components/SuccessStoryBanner";

export const metadata: Metadata = {
  title: { absolute: SEO_METADATA.successStories.title },
  description: SEO_METADATA.successStories.description,
  alternates: {
    canonical: SEO_METADATA.successStories.canonical,
  },
  openGraph: {
    title: SEO_METADATA.successStories.title,
    description: SEO_METADATA.successStories.description,
    url: SEO_METADATA.successStories.canonical,
    siteName: BRAND_NAME,
    type: "website",
  },
};

export default function SuccessStoriesPage() {
  const approvedStories = filterApprovedTestimonials(TESTIMONIAL_BANNERS);

  return (
    <main className="min-h-screen bg-white text-slate">
      {/* 1. Header Section */}
      <section
        data-section="header"
        id="header"
        className="py-16 md:py-20 px-6 md:px-12 text-center bg-mist border-b border-line"
      >
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            {SUCCESS_STORIES_HEADER.eyebrow}
          </span>
          <h1 className="font-serif text-[40px] md:text-[56px] text-charcoal leading-tight mt-2 mb-4 font-normal">
            {SUCCESS_STORIES_HEADER.heading}
          </h1>
          <p className="text-base md:text-lg text-slate leading-relaxed">
            {SUCCESS_STORIES_HEADER.description}
          </p>
        </div>
      </section>

      {/* 2. Banner Container (Flag-Filtered: only approved items render) */}
      <section
        data-section="banner-container"
        id="banner-container"
        className="py-16 px-6 md:px-12 max-w-[1200px] mx-auto space-y-12"
      >
        {approvedStories.length > 0 ? (
          approvedStories.map((story) => (
            <div key={story.id} className="flex justify-center">
              <SuccessStoryBanner testimonial={story} />
            </div>
          ))
        ) : (
          <div className="p-12 text-center border border-line rounded-[2px] bg-mist">
            <p className="text-slate text-sm">
              Client case studies available upon request during discovery call.
            </p>
          </div>
        )}
      </section>

      {/* 3. Results Strip */}
      <section
        data-section="results-strip"
        id="results-strip"
        className="py-16 px-6 md:px-12 bg-mist border-y border-line"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {RESULTS_STRIP_METRICS.map((metric, idx) => (
              <div
                key={idx}
                className="p-8 bg-white border border-line rounded-[2px] shadow-sm flex flex-col justify-center"
              >
                <span className="font-serif text-3xl sm:text-4xl text-navy font-bold mb-2">
                  {metric.value}
                </span>
                <span className="text-xs sm:text-sm font-medium text-charcoal uppercase tracking-wider">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Closing CTA */}
      <section
        data-section="cta"
        id="cta"
        className="py-20 px-6 md:px-12 bg-ink text-white text-center"
      >
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-serif text-[36px] md:text-[52px] leading-tight mb-6">
            Build Your Own Success Story
          </h2>
          <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
            Schedule a 15-minute discovery consultation to discover how RepHero can support your practice workflows.
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
      </section>
    </main>
  );
}
