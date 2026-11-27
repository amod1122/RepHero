import type { Metadata } from "next";
import Link from "next/link";
import {
  BRAND_NAME,
  CTA_LABELS,
  SEO_METADATA,
  TEAM_PREVIEW,
} from "@/content";
import { Reveal, RevealHeading } from "@/components/HomeMotion";
import Lanyard from "@/components/Lanyard";

export const metadata: Metadata = {
  title: { absolute: SEO_METADATA.ourTeam.title },
  description: SEO_METADATA.ourTeam.description,
  alternates: {
    canonical: SEO_METADATA.ourTeam.canonical,
  },
  openGraph: {
    title: SEO_METADATA.ourTeam.title,
    description: SEO_METADATA.ourTeam.description,
    url: SEO_METADATA.ourTeam.canonical,
    siteName: BRAND_NAME,
    type: "website",
  },
};

export default function OurTeamPage() {
  return (
    <main className="home-page our-team-page">
      <section
        data-section="team"
        id="team"
        className="home-team our-team-page__team"
        aria-labelledby="our-team-title"
      >
        <div className="our-team-page__intro container">
          <Reveal>
            <h1 id="our-team-title">People behind the practice.</h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p>
              A close, experienced team connecting practices with dedicated
              remote professionals.
            </p>
          </Reveal>
        </div>

        <div className="container">
          <div className="our-team__profiles">
            {TEAM_PREVIEW.map((member, index) => (
              <Reveal
                className="our-team__profile-reveal"
                key={member.id}
                delay={index * 0.08}
                amount={0.12}
              >
                <article className="our-team-profile">
                  <div className="our-team-profile__badge">
                    <div
                      className="our-team-profile__lanyard"
                      role="img"
                      aria-label={`Interactive lanyard badge for ${member.name}`}
                    >
                      <Lanyard
                        frontImage={member.lanyardImage}
                        backImage={member.lanyardImage}
                        strapImage="/band.png"
                        imageFit="contain"
                        finish="glossy"
                        metal="silver"
                      />
                    </div>
                    <p className="our-team-profile__hint">
                      Drag or tap the badge to turn it over.
                    </p>
                  </div>
                  <div className="our-team-profile__copy">
                    <h2>{member.name}</h2>
                    <p className="our-team-profile__role">{member.role}</p>
                    <p>{member.bio}</p>
                  </div>
                </article>
              </Reveal>
            ))}

          </div>
        </div>
      </section>

      <section
        data-section="cta"
        id="cta"
        className="home-cta our-team-page__cta"
        aria-labelledby="our-team-cta-title"
      >
        <div className="home-cta__inner container">
          <RevealHeading id="our-team-cta-title">
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
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
