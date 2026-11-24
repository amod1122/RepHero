import type { Metadata } from "next";
import React, { Suspense } from "react";
// Booking form uses useSearchParams() inside <Suspense> for query hydration and redirects to /thank-you
import { BookCallForm } from "@/components/BookCallForm";
import {
  BRAND_NAME,
  DISCOVERY_CALL_LENGTH_MINUTES,
  PHI_WARNING_NOTICE,
  CONTACT_INFO,
  SEO_METADATA,
} from "@/content";

export const metadata: Metadata = {
  title: { absolute: SEO_METADATA.bookCall.title },
  description: SEO_METADATA.bookCall.description,
  alternates: {
    canonical: SEO_METADATA.bookCall.canonical,
  },
  openGraph: {
    title: SEO_METADATA.bookCall.title,
    description: SEO_METADATA.bookCall.description,
    url: SEO_METADATA.bookCall.canonical,
    siteName: BRAND_NAME,
    type: "website",
  },
};

export default function BookCallPage() {
  return (
    <main className="min-h-screen bg-white text-slate py-16 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Section 1: Header */}
        <section
          data-section="header"
          id="header"
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            {`${DISCOVERY_CALL_LENGTH_MINUTES}-minute consultation`}
          </span>
          <h1 className="font-serif text-[40px] md:text-[56px] text-charcoal leading-tight mt-2 mb-4 font-normal">
            Book a Discovery Call
          </h1>
          <p className="text-base md:text-lg text-slate leading-relaxed">
            Schedule a focused 15-minute consultation with a RepHero healthcare staffing specialist.
          </p>
        </section>

        {/* Section 2: Booking Form */}
        <section
          data-section="booking-form"
          id="booking-form"
          className="max-w-2xl mx-auto mb-12"
        >
          <Suspense
            fallback={
              <div className="text-center py-12 text-sm text-slate">
                Loading booking form...
              </div>
            }
          >
            <BookCallForm showSchedulingSlot={false} />
          </Suspense>
        </section>

        {/* Section 3: Scheduling Slot */}
        <section
          data-section="scheduling-slot"
          id="scheduling-slot"
          className="max-w-2xl mx-auto mb-12"
        >
          <div
            id="booking-embed-slot"
            data-testid="booking-embed-slot"
            className="p-6 sm:p-8 bg-mist border border-line rounded-[2px] text-center"
          >
            <span className="text-xs uppercase tracking-wider text-slate font-medium block mb-1">
              Direct Calendar Scheduling
            </span>
            <h3 className="font-serif text-2xl text-charcoal mb-2 font-normal">
              Instant Scheduling Slot
            </h3>
            <p className="text-sm text-slate max-w-md mx-auto">
              Prefer direct calendar booking? This integration slot connects with Calendly or Microsoft Bookings for immediate calendar confirmation.
            </p>
          </div>
        </section>

        {/* Section 4: PHI Warning Notice */}
        <section
          data-section="phi-warning"
          id="phi-warning"
          className="max-w-2xl mx-auto mb-12"
        >
          <div
            data-testid="phi-warning-banner"
            className="p-4 bg-peach/20 border-l-4 border-peach rounded-[2px] text-xs text-charcoal leading-relaxed"
          >
            <p className="font-semibold mb-1">HIPAA & Privacy Notice</p>
            <p>{PHI_WARNING_NOTICE}</p>
          </div>
        </section>

        {/* Section 5: Contact Details */}
        <section
          data-section="contact-details"
          id="contact-details"
          className="max-w-2xl mx-auto mb-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center"
        >
          <div className="p-4 border border-line rounded-[2px] bg-white">
            <span className="text-xs uppercase text-slate font-medium block mb-1">Email</span>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="text-sm font-medium text-navy hover:underline"
            >
              {CONTACT_INFO.email}
            </a>
          </div>
          <div className="p-4 border border-line rounded-[2px] bg-white">
            <span className="text-xs uppercase text-slate font-medium block mb-1">Phone</span>
            <span className="text-sm font-medium text-charcoal">{CONTACT_INFO.phone}</span>
          </div>
          <div className="p-4 border border-line rounded-[2px] bg-white">
            <span className="text-xs uppercase text-slate font-medium block mb-1">Location</span>
            <span className="text-sm font-medium text-charcoal">{CONTACT_INFO.location}</span>
          </div>
        </section>

        {/* Section 6: Next Steps */}
        <section
          data-section="next-steps"
          id="next-steps"
          className="max-w-3xl mx-auto text-center pt-10 border-t border-line"
        >
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mb-8 font-normal">
            What Happens Next
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-5 bg-mist border border-line rounded-[2px]">
              <span className="font-serif text-2xl text-navy block mb-2 font-normal">1</span>
              <h4 className="font-semibold text-charcoal text-sm mb-1">15-Min Discovery</h4>
              <p className="text-xs text-slate leading-relaxed">
                We discuss your specific practice specialty, EHR setup, and staffing bottlenecks.
              </p>
            </div>
            <div className="p-5 bg-mist border border-line rounded-[2px]">
              <span className="font-serif text-2xl text-navy block mb-2 font-normal">2</span>
              <h4 className="font-semibold text-charcoal text-sm mb-1">Custom Proposal</h4>
              <p className="text-xs text-slate leading-relaxed">
                Within 24 hours, you receive a transparent staffing proposal and BAA agreement.
              </p>
            </div>
            <div className="p-5 bg-mist border border-line rounded-[2px]">
              <span className="font-serif text-2xl text-navy block mb-2 font-normal">3</span>
              <h4 className="font-semibold text-charcoal text-sm mb-1">Interview & Onboard</h4>
              <p className="text-xs text-slate leading-relaxed">
                You interview pre-screened healthcare professionals and approve before work starts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
