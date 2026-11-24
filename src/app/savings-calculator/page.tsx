import type { Metadata } from "next";
import Link from "next/link";
import {
  BRAND_NAME,
  CALCULATOR_CONFIG,
  TRUST_POINTS,
  CTA_LABELS,
  SEO_METADATA,
} from "@/content";
import { SavingsCalculator } from "@/components/SavingsCalculator";

export const metadata: Metadata = {
  title: { absolute: SEO_METADATA.savingsCalculator.title },
  description: SEO_METADATA.savingsCalculator.description,
  alternates: {
    canonical: SEO_METADATA.savingsCalculator.canonical,
  },
  openGraph: {
    title: SEO_METADATA.savingsCalculator.title,
    description: SEO_METADATA.savingsCalculator.description,
    url: SEO_METADATA.savingsCalculator.canonical,
    siteName: BRAND_NAME,
    type: "website",
  },
};

export default function SavingsCalculatorPage() {
  return (
    <main className="min-h-screen bg-white text-slate py-16 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Section 1: Header */}
        <section
          data-section="header"
          id="header"
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            Interactive Cost Analysis
          </span>
          <h1 className="font-serif text-[40px] md:text-[56px] text-charcoal leading-tight mt-2 mb-4 font-normal">
            Staffing Savings Calculator
          </h1>
          <p className="text-base md:text-lg text-slate leading-relaxed">
            Estimate your monthly and annual overhead reduction by comparing your current local hiring costs with RepHero dedicated remote professionals.
          </p>
        </section>

        {/* Section 2: Calculator Card */}
        <section
          data-section="calculator-card"
          id="calculator-card"
          className="max-w-3xl mx-auto mb-12"
        >
          <SavingsCalculator showTitle={false} />
        </section>

        {/* Section 3: Result CTA */}
        <section
          data-section="result-cta"
          id="result-cta"
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <div className="p-6 sm:p-8 bg-mist border border-line rounded-[2px]">
            <h3 className="font-serif text-2xl text-charcoal mb-2">
              Ready for a Tailored Staffing Plan?
            </h3>
            <p className="text-sm text-slate mb-6 max-w-lg mx-auto">
              Our staffing specialists will map your exact EHR workflows and prepare a custom proposal within 24 hours.
            </p>
            <Link
              href="/book-a-call"
              className="inline-flex items-center justify-center font-medium text-sm px-6 py-3.5 rounded-[2px] bg-charcoal text-white hover:bg-ink transition-colors shadow-sm"
            >
              {CTA_LABELS.primary}
            </Link>
          </div>
        </section>

        {/* Section 4: Disclaimer */}
        <section
          data-section="disclaimer"
          id="disclaimer"
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <p className="text-xs text-slate/80 italic leading-relaxed">
            {CALCULATOR_CONFIG.disclaimer}
          </p>
        </section>

        {/* Section 5: Proof Points */}
        <section
          data-section="proof-points"
          id="proof-points"
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
              Why Practices Choose RepHero
            </span>
            <h2 className="font-serif text-3xl text-charcoal mt-1 font-normal">
              Backed by Healthcare Standards
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_POINTS.map((pt) => (
              <div
                key={pt.id}
                className="p-5 bg-mist border border-line rounded-[2px]"
              >
                <h3 className="font-sans font-semibold text-sm text-charcoal mb-1">
                  {pt.title}
                </h3>
                <p className="text-xs text-slate leading-relaxed">
                  {pt.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: CTA */}
        <section
          data-section="cta"
          id="cta"
          className="text-center py-16 border-t border-line"
        >
          <h2 className="font-serif text-3xl text-charcoal mb-3 font-normal">
            Take the Next Step
          </h2>
          <p className="text-slate text-sm max-w-lg mx-auto mb-6">
            Schedule a 15-minute discovery call to discuss your practice staffing requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book-a-call"
              className="inline-flex items-center justify-center font-medium text-base px-8 py-3.5 rounded-[2px] bg-charcoal text-white hover:bg-ink transition-colors shadow-sm"
            >
              {CTA_LABELS.primary}
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center font-medium text-base px-8 py-3.5 rounded-[2px] bg-white text-charcoal border border-line hover:border-navy transition-colors shadow-sm"
            >
              {CTA_LABELS.secondaryServices}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
