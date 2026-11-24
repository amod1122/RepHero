import type { Metadata } from "next";
import Link from "next/link";
import {
  BRAND_NAME,
  HOW_IT_WORKS_STEPS,
  HOW_IT_WORKS_HEADER,
  WHAT_TO_EXPECT,
  COMMUNICATION_REPORTING,
  DISCOVERY_CALL_LENGTH_MINUTES,
  CTA_LABELS,
  FAQ_ITEMS,
  SEO_METADATA,
} from "@/content";
import { FAQAccordion } from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: { absolute: SEO_METADATA.howItWorks.title },
  description: SEO_METADATA.howItWorks.description,
  alternates: {
    canonical: SEO_METADATA.howItWorks.canonical,
  },
  openGraph: {
    title: SEO_METADATA.howItWorks.title,
    description: SEO_METADATA.howItWorks.description,
    url: SEO_METADATA.howItWorks.canonical,
    siteName: BRAND_NAME,
    type: "website",
  },
};

export default function HowItWorksPage() {
  const processFaqs = FAQ_ITEMS.filter(
    (f) => f.category === "process" || f.category === "compliance"
  );

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
            {HOW_IT_WORKS_HEADER.eyebrow}
          </span>
          <h1 className="font-serif text-[40px] md:text-[56px] text-charcoal leading-tight mt-2 mb-4 font-normal">
            {HOW_IT_WORKS_HEADER.heading}
          </h1>
          <p className="text-base md:text-lg text-slate leading-relaxed">
            From our initial {DISCOVERY_CALL_LENGTH_MINUTES}-minute discovery consultation to full workflow integration, our streamlined 6-step onboarding process ensures HIPAA compliance, clinical quality, and zero disruption to your daily patient care.
          </p>
        </div>
      </section>

      {/* 2. Timeline Steps */}
      <section
        data-section="timeline-steps"
        id="timeline-steps"
        className="py-16 px-6 md:px-12 max-w-[1000px] mx-auto space-y-8"
      >
        {HOW_IT_WORKS_STEPS.map((step) => (
          <div
            key={step.step}
            className="border border-line rounded-[2px] p-6 sm:p-8 bg-white flex flex-col md:flex-row gap-6 items-start hover:border-navy/40 transition-colors shadow-sm"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-[2px] bg-ink text-white font-serif text-2xl shrink-0">
              {step.step}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-baseline gap-2 mb-2">
                <h2 className="font-sans font-semibold text-xl text-charcoal">
                  {step.title}
                </h2>
                <span className="text-xs text-navy font-medium">
                  • {step.subtitle}
                </span>
              </div>
              <p className="text-sm md:text-base text-slate leading-relaxed mb-4">
                {step.description}
              </p>
              <div className="space-y-1.5 pt-3 border-t border-line">
                <span className="text-xs uppercase tracking-wider text-slate/70 font-medium block">
                  Key Activities:
                </span>
                <ul className="text-xs md:text-sm text-slate space-y-1.5 list-disc list-inside">
                  {step.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
              {step.deliverable && (
                <div className="mt-4 pt-3 border-t border-line flex items-center gap-2 text-xs text-charcoal">
                  <strong className="text-navy font-semibold">Deliverable:</strong>
                  <span>{step.deliverable}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* 3. What to Expect */}
      <section
        data-section="what-to-expect"
        id="what-to-expect"
        className="py-16 px-6 md:px-12 bg-mist border-y border-line"
      >
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
              {WHAT_TO_EXPECT.eyebrow}
            </span>
            <h2 className="font-serif text-[32px] md:text-[44px] text-charcoal mt-2 font-normal">
              {WHAT_TO_EXPECT.heading}
            </h2>
            <p className="text-slate mt-3 text-base">
              {WHAT_TO_EXPECT.timeToStart}
            </p>
          </div>
          <div className="bg-white border border-line rounded-[2px] p-8 shadow-sm">
            <ul className="space-y-3">
              {WHAT_TO_EXPECT.points.map((point, idx) => (
                <li key={idx} className="flex items-start text-sm text-slate">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy mt-2 mr-3 shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Communication & Reporting */}
      <section
        data-section="communication-reporting"
        id="communication-reporting"
        className="py-16 px-6 md:px-12 max-w-[1000px] mx-auto"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            {COMMUNICATION_REPORTING.eyebrow}
          </span>
          <h2 className="font-serif text-[32px] md:text-[44px] text-charcoal mt-2 font-normal">
            {COMMUNICATION_REPORTING.heading}
          </h2>
          <p className="text-slate mt-4 text-base">
            {COMMUNICATION_REPORTING.description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COMMUNICATION_REPORTING.channels.map((ch, idx) => (
            <div
              key={idx}
              className="p-6 bg-mist border border-line rounded-[2px] flex flex-col justify-between"
            >
              <div>
                <h3 className="font-sans font-semibold text-charcoal text-base mb-2">
                  {ch.title}
                </h3>
                <p className="text-xs md:text-sm text-slate leading-relaxed">
                  {ch.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Process FAQ */}
      <section
        data-section="faq"
        id="faq"
        className="py-16 px-6 md:px-12 bg-mist border-t border-line"
      >
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
              Process & Integration
            </span>
            <h2 className="font-serif text-[32px] md:text-[44px] text-charcoal mt-2 font-normal">
              Frequently Asked Questions
            </h2>
            <p className="text-slate mt-2 text-sm">
              Answers regarding matching, EHR software integration, and candidate approval.
            </p>
          </div>
          <FAQAccordion items={processFaqs} allowMultiple={false} />
        </div>
      </section>

      {/* 6. Closing CTA */}
      <section
        data-section="cta"
        id="cta"
        className="py-20 px-6 md:px-12 bg-ink text-white text-center"
      >
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-serif text-[36px] md:text-[52px] leading-tight mb-6">
            Ready to Begin Your Discovery Call?
          </h2>
          <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
            Schedule your focused {DISCOVERY_CALL_LENGTH_MINUTES}-minute consultation with a RepHero healthcare staffing director.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book-a-call"
              className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-[2px] bg-white text-ink hover:bg-mist transition-colors shadow-sm"
            >
              {CTA_LABELS.primary}
            </Link>
            <Link
              href="/savings-calculator"
              className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-[2px] bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
            >
              {CTA_LABELS.secondaryCalculator}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
