import type { Metadata } from "next";
import Link from "next/link";
import {
  BRAND_NAME,
  SERVICE_ROLES,
  SERVICES_HEADER,
  CATEGORY_TABS,
  PRICING_NOTE,
  SERVICES_TRUST_BLOCK,
  FAQ_ITEMS,
  CTA_LABELS,
  SEO_METADATA,
  RoleCategory,
} from "@/content";
import { RoleCard } from "@/components/RoleCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RevealSection } from "@/components/Motion";

export const metadata: Metadata = {
  title: { absolute: SEO_METADATA.services.title },
  description: SEO_METADATA.services.description,
  alternates: {
    canonical: SEO_METADATA.services.canonical,
  },
  openGraph: {
    title: SEO_METADATA.services.title,
    description: SEO_METADATA.services.description,
    url: SEO_METADATA.services.canonical,
    siteName: BRAND_NAME,
    type: "website",
  },
};

export default function ServicesPage() {
  const categories: RoleCategory[] = [
    "Admin and Executive",
    "Revenue Cycle and Compliance",
    "Extended and Creative",
  ];

  const pricingFaqs = FAQ_ITEMS.filter(
    (f) => f.category === "pricing" || f.category === "general"
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pricingFaqs.map((faq) => ({
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

      {/* 1. Header Section */}
      <RevealSection
        data-section="header"
        id="header"
        className="py-16 md:py-20 px-6 md:px-12 text-center bg-mist border-b border-line"
      >
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            {SERVICES_HEADER.eyebrow}
          </span>
          <h1 className="font-serif text-[40px] md:text-[56px] text-charcoal leading-tight mt-2 mb-4 font-normal">
            {SERVICES_HEADER.heading}
          </h1>
          <p className="text-base md:text-lg text-slate leading-relaxed">
            {SERVICES_HEADER.description}
          </p>
        </div>
      </RevealSection>

      {/* 2. Category Tabs */}
      <RevealSection
        data-section="category-tabs"
        id="category-tabs"
        className="sticky top-[73px] z-20 bg-white/95 backdrop-blur-sm border-b border-line py-4 px-6 md:px-12"
      >
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-2 md:gap-4">
          {CATEGORY_TABS.map((tab) => (
            <a
              key={tab.id}
              href={tab.anchor}
              className="text-xs md:text-sm font-medium px-4 py-2 rounded-[2px] bg-mist text-charcoal border border-line hover:border-navy hover:text-navy transition-colors"
            >
              {tab.label}
            </a>
          ))}
        </div>
      </RevealSection>

      {/* 3. Role Cards */}
      <RevealSection
        data-section="role-cards"
        id="role-cards"
        className="py-16 px-6 md:px-12 max-w-[1200px] mx-auto space-y-16"
      >
        {categories.map((category) => {
          const catId = category.toLowerCase().replace(/\s+/g, "-");
          const roles = SERVICE_ROLES.filter((r) => r.category === category);
          return (
            <div key={category} id={catId} className="scroll-mt-32">
              <div className="border-b border-line pb-4 mb-8">
                <span className="text-xs uppercase tracking-wider text-navy font-semibold">
                  Category
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-charcoal font-normal mt-1">
                  {category}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {roles.map((role) => (
                  <RoleCard key={role.id} role={role} />
                ))}
              </div>
            </div>
          );
        })}
      </RevealSection>

      {/* 4. Pricing Note */}
      <RevealSection
        data-section="pricing-note"
        id="pricing-note"
        className="py-16 px-6 md:px-12 bg-mist border-y border-line"
      >
        <div className="max-w-[800px] mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            {PRICING_NOTE.eyebrow}
          </span>
          <h2 className="font-serif text-[32px] md:text-[44px] text-charcoal mt-2 mb-4 font-normal">
            {PRICING_NOTE.heading}
          </h2>
          <p className="text-slate leading-relaxed mb-6 text-base">
            {PRICING_NOTE.description}
          </p>
          <div className="p-6 bg-white border border-line rounded-[2px] text-left">
            <h3 className="font-sans font-medium text-charcoal text-sm mb-2">Custom Quote Roles</h3>
            <p className="text-xs md:text-sm text-slate leading-relaxed">
              {PRICING_NOTE.customQuoteDetails}
            </p>
          </div>
        </div>
      </RevealSection>

      {/* 5. Trust Block */}
      <RevealSection
        data-section="trust-block"
        id="trust-block"
        className="py-16 px-6 md:px-12 max-w-[1200px] mx-auto"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
            {SERVICES_TRUST_BLOCK.eyebrow}
          </span>
          <h2 className="font-serif text-[32px] md:text-[44px] text-charcoal mt-2 font-normal">
            {SERVICES_TRUST_BLOCK.heading}
          </h2>
          <p className="text-slate mt-4 text-base">
            {SERVICES_TRUST_BLOCK.description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_TRUST_BLOCK.points.map((pt, idx) => (
            <div
              key={idx}
              className="p-6 bg-mist border border-line rounded-[2px] border-l-2 border-l-navy"
            >
              <p className="text-sm font-medium text-charcoal leading-snug">{pt}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* 6. Pricing FAQ */}
      <RevealSection
        data-section="faq"
        id="faq"
        className="py-16 px-6 md:px-12 bg-mist border-t border-line"
      >
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.08em] text-slate/80 font-medium">
              Pricing & Contracts
            </span>
            <h2 className="font-serif text-[32px] md:text-[44px] text-charcoal mt-2 font-normal">
              Frequently Asked Questions
            </h2>
            <p className="text-slate mt-2 text-sm">
              Common questions about rates, contract flexibility, and billing setup.
            </p>
          </div>
          <FAQAccordion items={pricingFaqs} allowMultiple={false} />
        </div>
      </RevealSection>

      {/* 7. Closing CTA */}
      <RevealSection
        data-section="cta"
        id="cta"
        className="py-20 px-6 md:px-12 bg-ink text-white text-center"
      >
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-serif text-[36px] md:text-[52px] leading-tight mb-6">
            Find the Right Remote Professional for Your Practice
          </h2>
          <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
            Speak with our healthcare staffing specialists in a 15-minute consultation to review role specifications and candidate profiles.
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
      </RevealSection>
    </main>
  );
}
