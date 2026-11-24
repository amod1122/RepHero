import type { Metadata } from "next";
import Link from "next/link";
import {
  BRAND_NAME,
  DISCOVERY_CALL_LENGTH_MINUTES,
  SEO_METADATA,
} from "@/content";

export const metadata: Metadata = {
  title: { absolute: SEO_METADATA.thankYou.title },
  description: SEO_METADATA.thankYou.description,
  alternates: {
    canonical: SEO_METADATA.thankYou.canonical,
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: SEO_METADATA.thankYou.title,
    description: SEO_METADATA.thankYou.description,
    url: SEO_METADATA.thankYou.canonical,
    siteName: BRAND_NAME,
    type: "website",
  },
};

export default function ThankYouPage() {
  const steps = [
    {
      num: "1",
      title: "Review & Assessment",
      desc: "Our staffing directors review your practice specifications, software systems, and role requirements.",
    },
    {
      num: "2",
      title: "Custom Proposal",
      desc: "We formulate a tailored staffing proposal with flat monthly pricing and candidate qualifications.",
    },
    {
      num: "3",
      title: "Discovery Call",
      desc: `We meet for your ${DISCOVERY_CALL_LENGTH_MINUTES}-minute consultation to review the plan and answer your questions.`,
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate py-16 px-6 md:px-12 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto text-center border border-line rounded-[2px] p-8 md:p-12 bg-white shadow-sm">
        {/* 1. Confirmation Section */}
        <section data-section="confirmation" id="confirmation" className="mb-8">
          <span className="text-xs uppercase tracking-[0.08em] text-navy font-medium block mb-2">
            Inquiry Received
          </span>
          <h1 className="font-serif text-[40px] md:text-[56px] text-charcoal leading-tight font-normal mb-4">
            Thank You!
          </h1>
          <p className="text-base text-slate leading-relaxed max-w-lg mx-auto">
            We have received your discovery call request. A {BRAND_NAME} healthcare staffing director will review your practice information and be in touch shortly.
          </p>
        </section>

        {/* 2. Expectation Cards Section */}
        <section
          data-section="expectation-cards"
          id="expectation-cards"
          className="text-left mb-8 pt-6 border-t border-line"
        >
          <h2 className="font-sans font-medium text-sm text-charcoal uppercase tracking-wider mb-4 text-center">
            What Happens Next
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((s) => (
              <div key={s.num} className="p-4 bg-mist rounded-[2px] border border-line">
                <span className="font-serif text-lg text-navy font-bold block mb-1">
                  Step {s.num}
                </span>
                <span className="font-medium text-charcoal text-xs block mb-1">
                  {s.title}
                </span>
                <p className="text-[11px] text-slate leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Return Links Section */}
        <section
          data-section="return-links"
          id="return-links"
          className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-line"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center font-medium text-sm px-6 py-2.5 rounded-[2px] bg-charcoal text-white hover:bg-ink transition-colors shadow-sm"
          >
            Return Home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center font-medium text-sm px-6 py-2.5 rounded-[2px] border border-line text-charcoal hover:bg-mist transition-colors"
          >
            Explore All 9 Roles
          </Link>
          <Link
            href="/success-stories"
            className="inline-flex items-center justify-center font-medium text-sm px-6 py-2.5 rounded-[2px] border border-line text-charcoal hover:bg-mist transition-colors"
          >
            View Success Stories
          </Link>
        </section>
      </div>
    </main>
  );
}
