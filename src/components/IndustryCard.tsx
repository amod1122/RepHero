import React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle, ArrowRight, Quote } from "lucide-react";
import type { Industry } from "@/content/types";
import { SERVICE_ROLES } from "@/content";

export interface IndustryCardProps {
  industry: Industry;
  variant?: "section" | "card";
  className?: string;
}

/**
 * Sanitizes testimonial snippet attribution.
 * Invariant: Any quote referencing Odonto Dental MUST strictly render attribution as "Client Feedback".
 */
export function formatTestimonialAuthor(author?: string, industryId?: string): string {
  if (!author) return "Client Feedback";
  const lower = author.toLowerCase();
  if (industryId === "dental-practices" || lower.includes("odonto")) {
    return "Client Feedback";
  }
  return author;
}

/**
 * Helper to resolve friendly role title from role ID slug.
 */
function getRoleName(roleId: string): string {
  const matchedRole = SERVICE_ROLES.find((r) => r.id === roleId);
  if (matchedRole) return matchedRole.name;
  return roleId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function IndustryCard({
  industry,
  variant = "section",
  className = "",
}: IndustryCardProps) {
  const targetAnchor = industry.anchorId || industry.id;
  const isCard = variant === "card";

  // Compact Teaser Card for Home Page
  if (isCard) {
    return (
      <article
        className={`bg-mist border border-line rounded-[2px] p-6 sm:p-8 flex flex-col justify-between hover:border-navy/40 transition-all duration-200 shadow-sm ${className}`}
      >
        <div>
          <span className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-navy bg-sky/30 px-2.5 py-1 rounded-[2px]">
            Healthcare Specialization
          </span>
          <h3 className="font-sans font-semibold text-xl sm:text-2xl text-charcoal mt-3">
            {industry.name}
          </h3>
          <p className="text-slate text-sm sm:text-base leading-relaxed mt-2">
            {industry.headline}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-line/60">
          <Link
            href={`/industries#${targetAnchor}`}
            className="text-sm font-semibold text-charcoal hover:text-navy inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Explore {industry.name} roles</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </article>
    );
  }

  // Full-Width Dedicated Section for /industries Page
  const sanitizedAuthor = industry.testimonialSnippet
    ? formatTestimonialAuthor(industry.testimonialSnippet.author, industry.id)
    : "";

  return (
    <section
      id={industry.id}
      className={`scroll-mt-28 py-12 sm:py-16 border-b border-line last:border-b-0 ${className}`}
      data-industry-slug={industry.slug}
    >
      {/* Secondary anchor target to support both #dental and #dental-practices */}
      {industry.anchorId && industry.anchorId !== industry.id && (
        <div id={industry.anchorId} className="scroll-mt-28 -mt-28" aria-hidden="true" />
      )}

      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Industry Eyebrow & Title */}
        <div className="max-w-3xl">
          <span className="text-xs uppercase font-sans tracking-eyebrow text-navy font-semibold">
            Industry Practice
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal mt-1 tracking-tight">
            {industry.name}
          </h2>
          <p className="font-sans text-base sm:text-lg font-medium text-charcoal/90 mt-2">
            {industry.headline}
          </p>
          <p className="text-slate text-sm sm:text-base leading-relaxed mt-2.5">
            {industry.description}
          </p>
        </div>

        {/* 2-Column Grid: Operational Challenges vs Recommended Staffing */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Practice Challenges */}
          <div className="lg:col-span-7 bg-mist border border-line rounded-[2px] p-6 sm:p-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal/80 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" aria-hidden="true" />
              <span>Common Operational Challenges</span>
            </h3>
            <ul className="space-y-3 text-sm text-slate">
              {industry.painPoints.map((pain, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy mt-2 mr-2.5 shrink-0" aria-hidden="true" />
                  <span className="leading-snug">{pain}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Recommended Roles & Quote */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Recommended Remote Roles */}
            <div className="bg-white border border-line rounded-[2px] p-6 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal/80 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>Recommended Roles</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {industry.recommendedRoles.map((roleId) => (
                  <Link
                    key={roleId}
                    href={`/services#${roleId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-charcoal bg-mist border border-line rounded-[2px] hover:border-navy hover:text-navy hover:bg-sky/20 transition-colors"
                  >
                    <span>{getRoleName(roleId)}</span>
                    <span className="text-slate/60 text-[10px]">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Testimonial Pull Quote (if present) */}
            {industry.testimonialSnippet && (
              <div className="bg-sky/15 border border-sky/30 rounded-[2px] p-5 relative">
                <Quote className="w-5 h-5 text-navy/40 mb-2" aria-hidden="true" />
                <p className="text-xs sm:text-sm text-charcoal italic leading-relaxed">
                  &ldquo;{industry.testimonialSnippet.quote}&rdquo;
                </p>
                <p className="text-[11px] font-sans font-semibold text-navy uppercase tracking-wider mt-3">
                  — {sanitizedAuthor}
                </p>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}

export default IndustryCard;
