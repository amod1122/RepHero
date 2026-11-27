import type { Metadata, Viewport } from "next";
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
  TRUST_POINTS,
  SERVICE_ROLES,
  filterApprovedTestimonials,
  SEO_METADATA,
} from "@/content";
import { FAQAccordion } from "@/components/FAQAccordion";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { ShinyButton } from "@/components/ui/shiny-button";
import {
  HeroTitle,
  ProcessJourney,
  Reveal,
  RevealHeading,
} from "@/components/HomeMotion";

export const viewport: Viewport = {
  themeColor: "#030816",
};

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

const roleGroups = [
  {
    id: "admin-and-executive",
    number: "01",
    name: "Admin and Executive",
    description:
      "Front desk coordination, appointment scheduling, patient intake, and clinical support for the daily work around care.",
  },
  {
    id: "revenue-cycle-and-compliance",
    number: "02",
    name: "Revenue Cycle and Compliance",
    description:
      "Medical billing, coding, revenue cycle oversight, credentialing, and contracting with clear ownership.",
  },
  {
    id: "extended-and-creative",
    number: "03",
    name: "Extended and Creative",
    description:
      "After-hours call coverage, urgent triage routing, and dedicated design support when the workday extends beyond the clinic.",
  },
];

export default function HomePage() {
  const approvedTestimonials = filterApprovedTestimonials(TESTIMONIAL_BANNERS);
  const homeFaqs = FAQ_ITEMS.slice(0, 6);
  const featuredTestimonial = approvedTestimonials[0];

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
    <main className="home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section
        data-section="hero"
        id="hero"
        className="home-hero"
        aria-labelledby="home-hero-title"
      >
        <div className="home-hero__background" aria-hidden="true" />
        <div className="home-hero__veil" aria-hidden="true" />

        <div className="home-hero__content container">
          <p className="home-hero__kicker">{TAGLINE}</p>
          <HeroTitle>Reclaim your practice&apos;s time.</HeroTitle>
          <Reveal className="home-hero__intro" delay={0.28}>
            <p>{SUPPORTING_LINE}</p>
            <div className="home-hero__actions">
              <ShinyButton
                href="/book-a-call"
                className="home-hero__shiny-button"
              >
                {CTA_LABELS.primary}
              </ShinyButton>
              <Link className="home-text-link home-text-link--light" href="/services">
                {CTA_LABELS.secondaryServices}
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="home-hero__proof container" aria-label="Service highlights">
          {TRUST_POINTS.map((point, index) => (
            <Reveal key={point.id} delay={0.42 + index * 0.06} amount={0.5}>
              <div className="home-hero__proof-item">
                <span>{point.title}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="home-intro" aria-labelledby="home-intro-title">
        <div className="home-intro__grid container">
          <RevealHeading id="home-intro-title">
            Staff the work behind the work.
          </RevealHeading>
          <Reveal className="home-intro__copy" delay={0.08}>
            <p>
              RepHero gives healthcare practices a trained remote team for
              administration, revenue cycle, compliance, and extended coverage.
              Your people stay focused on patients. Your systems keep moving.
            </p>
            <Link className="home-text-link" href="/how-it-works">
              See how the engagement works
            </Link>
          </Reveal>
        </div>
      </section>

      <section
        data-section="services-overview"
        id="services-overview"
        className="home-services"
        aria-labelledby="home-services-title"
      >
        <div className="container">
          <div className="home-section-head home-section-head--split">
            <RevealHeading id="home-services-title">
              The right role for the work.
            </RevealHeading>
            <Reveal delay={0.08}>
              <p>
                Start with one focused need or build a team around the work your
                practice cannot keep on the clinical calendar.
              </p>
            </Reveal>
          </div>

          <div className="home-service-chapters">
            {roleGroups.map((group) => {
              const roles = SERVICE_ROLES.filter(
                (role) => role.category === group.name,
              );

              return (
                <Reveal key={group.id} amount={0.12}>
                  <article className="home-service-chapter">
                    <span className="home-service-chapter__number">
                      {group.number}
                    </span>
                    <div className="home-service-chapter__copy">
                      <h3>
                        <Link href={`/services#${group.id}`}>{group.name}</Link>
                      </h3>
                      <p>{group.description}</p>
                    </div>
                    <ul className="home-service-chapter__roles">
                      {roles.map((role) => (
                        <li key={role.id}>
                          <Link href={`/services#${role.id}`}>
                            <span>{role.name}</span>
                            <span>{role.priceDisplay}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <div className="home-section-action">
            <Link className="home-text-link" href="/services">
              View all roles and pricing
            </Link>
          </div>
        </div>
      </section>

      <section
        data-section="how-it-works"
        id="how-it-works"
        className="home-process"
        aria-labelledby="home-process-title"
      >
        <div className="container">
          <div className="home-section-head home-section-head--split">
            <RevealHeading id="home-process-title">
              From first call to daily coverage.
            </RevealHeading>
            <Reveal delay={0.08}>
              <p>
                A clear path through discovery, agreement, matching, onboarding,
                and ongoing support.
              </p>
            </Reveal>
          </div>

          <ProcessJourney steps={HOW_IT_WORKS_STEPS} />

          <div className="home-section-action">
            <Link className="home-text-link" href="/how-it-works">
              Learn more about the process
            </Link>
          </div>
        </div>
      </section>

      <section
        data-section="savings-calculator"
        id="savings-calculator"
        className="home-calculator-band"
        aria-labelledby="home-calculator-title"
      >
        <div className="home-calculator-band__grid container">
          <div className="home-calculator-band__copy">
            <RevealHeading id="home-calculator-title">
              See what the overhead gap could be.
            </RevealHeading>
            <Reveal delay={0.08}>
              <p>
                Compare your current cost per team member with RepHero&apos;s
                published flat monthly rates. Adjust the numbers to see a
                practical monthly and annual range.
              </p>
              <p className="home-calculator-band__note">
                Estimates only. Actual results vary and are not guaranteed.
              </p>
            </Reveal>
          </div>

          <Reveal className="home-calculator" delay={0.12} amount={0.08}>
            <SavingsCalculator showTitle={false} />
          </Reveal>
        </div>
      </section>

      <section
        data-section="industries"
        id="industries"
        className="home-industries"
        aria-labelledby="home-industries-title"
      >
        <div className="container">
          <div className="home-section-head home-section-head--split">
            <RevealHeading id="home-industries-title">
              Built around your specialty.
            </RevealHeading>
            <Reveal delay={0.08}>
              <p>
                Staffing shaped around the workflows, compliance demands, and
                software platforms your team already uses.
              </p>
            </Reveal>
          </div>

          <div className="home-industries__layout">
            <ul className="home-industry-list">
              {INDUSTRIES.map((industry, index) => (
                <li key={industry.id}>
                  <Reveal delay={index * 0.035} amount={0.3}>
                    <Link href={`/industries#${industry.anchorId}`}>
                      <span>{industry.name}</span>
                      <span>{industry.headline}</span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>

            {featuredTestimonial ? (
              <Reveal className="home-story" delay={0.1} amount={0.12}>
                <figure id="success-stories" data-section="success-stories">
                  <blockquote>
                    <p>&ldquo;{featuredTestimonial.quote}&rdquo;</p>
                  </blockquote>
                  <figcaption>
                    <span>{featuredTestimonial.attribution}</span>
                    <span>{featuredTestimonial.serviceHighlighted}</span>
                  </figcaption>
                  <Link className="home-text-link" href="/success-stories">
                    Read more success stories
                  </Link>
                </figure>
              </Reveal>
            ) : null}
          </div>

          <div className="home-section-action">
            <Link className="home-text-link" href="/industries">
              View all industries
            </Link>
          </div>
        </div>
      </section>

      <section
        data-section="faq"
        id="faq"
        className="home-faq"
        aria-labelledby="home-faq-title"
      >
        <div className="home-faq__layout container">
          <div className="home-section-head">
            <RevealHeading id="home-faq-title">
              Questions before you book.
            </RevealHeading>
            <Reveal delay={0.08}>
              <p>Clear answers on HIPAA, onboarding, and flat monthly pricing.</p>
            </Reveal>
          </div>
          <Reveal delay={0.08} amount={0.08}>
            <FAQAccordion items={homeFaqs} allowMultiple={false} />
          </Reveal>
        </div>
      </section>

      <section
        data-section="cta"
        id="cta"
        className="home-cta"
        aria-labelledby="home-cta-title"
      >
        <div className="home-cta__inner container">
          <RevealHeading id="home-cta-title">
            Put the admin work in good hands.
          </RevealHeading>
          <Reveal delay={0.08}>
            <p>
              Schedule a focused 15-minute consultation to review your workflows
              and candidate profiles.
            </p>
            <div className="home-cta__actions">
              <Link className="home-button home-button--light" href="/book-a-call">
                {CTA_LABELS.primary}
              </Link>
              <Link className="home-text-link home-text-link--light" href="/services">
                {CTA_LABELS.secondaryServices}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
