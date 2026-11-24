import type { Metadata } from "next";
import Link from "next/link";
import {
  BRAND_NAME,
  TAGLINE,
  SUPPORTING_LINE,
  CTA_LABELS,
  HOW_IT_WORKS_STEPS,
  INDUSTRIES,
  FAQ_ITEMS,
  TESTIMONIAL_BANNERS,
  filterApprovedTestimonials,
  SEO_METADATA,
} from "@/content";
import { TrustStrip } from "@/components/TrustStrip";
import { SuccessStoryBanner } from "@/components/SuccessStoryBanner";
import { FAQAccordion } from "@/components/FAQAccordion";
import { IndustryCard } from "@/components/IndustryCard";

export const metadata: Metadata = {
  title: { absolute: SEO_METADATA.home.title },
  description: SEO_METADATA.home.description,
  alternates: {
    canonical: SEO_METADATA.home.canonical,
  },
  openGraph: {
    title: SEO_METADATA.home.title,
    description: SEO_METADATA.home.description,
    url: SEO_METADATA.home.canonical,
    siteName: BRAND_NAME,
    type: "website",
  },
};

export default function HomePage() {
  const approvedTestimonials = filterApprovedTestimonials(TESTIMONIAL_BANNERS);
  const homeFaqs = FAQ_ITEMS.slice(0, 6);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-white text-slate">
      {/* FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* 1. Hero Section */}
      <section
        data-section="hero"
        id="hero"
        className="bg-ink text-white py-20 px-6 md:px-12 text-center relative overflow-hidden"
      >
        <div className="max-w-[1200px] mx-auto flex flex-col items-center">
          <span className="text-xs uppercase tracking-[0.08em] text-sky mb-4">
            Healthcare Staffing Simplified — Dedicated Extension of Your Practice
          </span>
          <h1 className="font-serif text-[40px] md:text-[72px] leading-[1.05] tracking-[-0.02em] max-w-4xl font-normal text-white mb-6">
            {TAGLINE}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed">
            {SUPPORTING_LINE}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
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

      {/* 2. Trust Strip */}
      <section data-section="trust-strip" id="trust-strip">
        <TrustStrip variant="light" showProofPoints={true} showLogos={true} />
      </section>

      {/* 3. Services Overview */}
      <section
        data-section="services-overview"
        id="services-overview"
        className="py-20 px-6 md:px-12 max-w-[1200px] mx-auto"
      >
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            Dedicated Healthcare Roles
          </span>
          <h2 className="font-serif text-[32px] md:text-[48px] text-charcoal mt-2">
            Specialized Staffing for Every Workflow
          </h2>
          <p className="text-slate max-w-2xl mx-auto mt-4 text-base">
            From patient intake to medical billing and compliance, our trained remote professionals integrate directly into your EHR and daily practice systems.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 border border-line rounded-[2px] bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs text-navy uppercase tracking-wider font-medium">Category 1</span>
              <h3 className="text-xl font-medium text-charcoal mt-2">Admin and Executive</h3>
              <p className="text-sm text-slate mt-3 leading-relaxed">
                Front desk coordination, appointment scheduling, patient intake, and clinical medical assistants providing seamless support.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-line">
              <Link
                href="/services#admin-and-executive"
                className="text-xs text-navy font-medium hover:underline inline-flex items-center gap-1"
              >
                Explore Admin & Clinical Roles &rarr;
              </Link>
            </div>
          </div>

          <div className="p-8 border border-line rounded-[2px] bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs text-navy uppercase tracking-wider font-medium">Category 2</span>
              <h3 className="text-xl font-medium text-charcoal mt-2">Revenue Cycle and Compliance</h3>
              <p className="text-sm text-slate mt-3 leading-relaxed">
                Expert medical billers, certified professional coders, full RCM managers, and provider credentialing specialists.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-line">
              <Link
                href="/services#revenue-cycle-and-compliance"
                className="text-xs text-navy font-medium hover:underline inline-flex items-center gap-1"
              >
                Explore Revenue Cycle Roles &rarr;
              </Link>
            </div>
          </div>

          <div className="p-8 border border-line rounded-[2px] bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs text-navy uppercase tracking-wider font-medium">Category 3</span>
              <h3 className="text-xl font-medium text-charcoal mt-2">Extended and Creative</h3>
              <p className="text-sm text-slate mt-3 leading-relaxed">
                24/7 after-hours call answering, urgent clinical triage routing, and dedicated graphic design for clinic marketing.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-line">
              <Link
                href="/services#extended-and-creative"
                className="text-xs text-navy font-medium hover:underline inline-flex items-center gap-1"
              >
                Explore Extended & Creative Roles &rarr;
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-[2px] bg-charcoal text-white hover:bg-ink transition-colors text-sm"
          >
            {CTA_LABELS.secondaryServices}
          </Link>
        </div>
      </section>

      {/* 4. How It Works */}
      <section
        data-section="how-it-works"
        id="how-it-works"
        className="py-20 px-6 md:px-12 bg-mist border-y border-line"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
              Streamlined Process
            </span>
            <h2 className="font-serif text-[32px] md:text-[48px] text-charcoal mt-2">
              How It Works
            </h2>
            <p className="text-slate max-w-2xl mx-auto mt-4 text-base">
              From discovery consultation to candidate matching, signed BAA, and ongoing proactive support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-5 bg-white border border-line rounded-[2px] flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-navy">Step 0{step.step}</span>
                  <h3 className="text-sm font-semibold text-charcoal mt-2">{step.title}</h3>
                  <p className="text-xs text-slate mt-2 leading-relaxed">{step.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-[2px] bg-charcoal text-white hover:bg-ink transition-colors text-sm"
            >
              Learn More About Our Process
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Savings Calculator Teaser */}
      <section
        data-section="savings-calculator"
        id="savings-calculator"
        className="py-20 px-6 md:px-12 max-w-[1200px] mx-auto"
      >
        <div className="border border-line rounded-[2px] p-8 md:p-12 bg-white text-center">
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            Interactive Cost Analysis
          </span>
          <h2 className="font-serif text-[32px] md:text-[48px] text-charcoal mt-2">
            Staffing Savings Calculator
          </h2>
          <p className="text-slate max-w-2xl mx-auto mt-4 text-base leading-relaxed">
            Calculate how much your healthcare practice can save by transitioning administrative and revenue cycle roles to trained remote professionals. Most practices achieve 50-60% typical savings compared to local hiring overhead.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/savings-calculator"
              className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-[2px] bg-charcoal text-white hover:bg-ink transition-colors text-sm"
            >
              {CTA_LABELS.secondaryCalculator}
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Industries */}
      <section
        data-section="industries"
        id="industries"
        className="py-20 px-6 md:px-12 bg-mist border-y border-line"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
              Healthcare Verticals
            </span>
            <h2 className="font-serif text-[32px] md:text-[48px] text-charcoal mt-2">
              Industries We Serve
            </h2>
            <p className="text-slate max-w-2xl mx-auto mt-4 text-base">
              Tailored staffing solutions designed around the specific workflows, compliance demands, and software platforms of medical and dental practices.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRIES.map((industry) => (
              <IndustryCard key={industry.id} industry={industry} variant="card" />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/industries"
              className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-[2px] bg-charcoal text-white hover:bg-ink transition-colors text-sm"
            >
              View All Industries
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Success Stories */}
      <section
        data-section="success-stories"
        id="success-stories"
        className="py-20 px-6 md:px-12 max-w-[1200px] mx-auto"
      >
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            Client Proof
          </span>
          <h2 className="font-serif text-[32px] md:text-[48px] text-charcoal mt-2">
            Client Success Stories
          </h2>
          <p className="text-slate max-w-2xl mx-auto mt-4 text-base">
            See how US practices eliminate phone bottlenecks, reduce overhead, and scale operations with RepHero.
          </p>
        </div>
        {approvedTestimonials.length > 0 && (
          <div className="flex justify-center">
            <SuccessStoryBanner testimonial={approvedTestimonials[0]} />
          </div>
        )}
        <div className="text-center mt-8">
          <Link
            href="/success-stories"
            className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-[2px] bg-charcoal text-white hover:bg-ink transition-colors text-sm"
          >
            Read More Success Stories
          </Link>
        </div>
      </section>

      {/* 8. FAQ */}
      <section
        data-section="faq"
        id="faq"
        className="py-20 px-6 md:px-12 bg-mist border-t border-line"
      >
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
              Common Inquiries
            </span>
            <h2 className="font-serif text-[32px] md:text-[48px] text-charcoal mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-slate max-w-xl mx-auto mt-4 text-base">
              Clear answers regarding HIPAA compliance, onboarding timelines, and flat monthly pricing.
            </p>
          </div>
          <FAQAccordion items={homeFaqs} allowMultiple={false} />
        </div>
      </section>

      {/* 9. Final CTA */}
      <section
        data-section="cta"
        id="cta"
        className="py-20 px-6 md:px-12 bg-ink text-white text-center"
      >
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-serif text-[36px] md:text-[52px] leading-tight mb-6">
            Ready to Give Your Practice Its Time Back?
          </h2>
          <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
            Schedule a focused 15-minute consultation to evaluate your practice workflows and review candidate profiles.
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
