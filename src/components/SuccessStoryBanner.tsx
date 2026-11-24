import React from "react";
import type { TestimonialBanner } from "@/content/types";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import {
  filterApprovedTestimonials,
  getEnforcedAttribution,
  resolveClientLogo,
} from "@/content/testimonials";

export {
  filterApprovedTestimonials,
  getEnforcedAttribution,
  resolveClientLogo,
};

export function SuccessStoryBanner({
  testimonial,
  previewMode = false,
  className = "",
}: SuccessStoryBannerProps) {
  // CRITICAL FLAG GATING:
  // In public view (previewMode !== true), unapproved or non-published testimonials
  // MUST RETURN NULL and render nothing into the DOM.
  if (!testimonial) return null;
  if (!previewMode && (!testimonial.isApproved || testimonial.status !== "published")) {
    return null;
  }

  const attribution = getEnforcedAttribution(testimonial);
  const isUnapprovedPreview = previewMode && (!testimonial.isApproved || testimonial.status !== "published");

  // Background gradient theme selection based on client domain
  const themeGradients: Record<string, string> = {
    dental: "from-mist via-sky/20 to-peach/10",
    "mental-health": "from-mist via-peach/20 to-sky/10",
    creative: "from-mist via-sky/15 to-peach/20",
  };
  const visualGradient = themeGradients[testimonial.backgroundTheme] || "from-mist via-sky/15 to-peach/15";

  return (
    <article
      className={`relative w-full max-w-[1200px] min-h-[520px] mx-auto bg-white border border-line rounded-[2px] shadow-sm overflow-hidden flex flex-col lg:grid lg:grid-cols-12 ${className}`}
      data-testimonial-id={testimonial.id}
    >
      {/* Preview Mode Watermark / Badge Overlay */}
      {isUnapprovedPreview && (
        <div className="absolute top-4 right-4 z-20">
          <PlaceholderBadge
            status={testimonial.status === "pending" ? "Pending Approval" : "Unapproved"}
            label={`PREVIEW ONLY — ${testimonial.status.toUpperCase()}`}
            forceShow={true}
          />
        </div>
      )}

      {/* Left Column: Editorial & Content (7 columns on desktop) */}
      <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
        <div>
          {/* Client Identity & Eyebrow */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="font-serif text-xl font-bold text-charcoal tracking-wide">
              {testimonial.client}
            </span>
            <span className="text-slate/40 text-xs select-none">•</span>
            <span className="text-xs uppercase font-sans tracking-eyebrow text-slate font-medium">
              {testimonial.eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal leading-tight mb-6">
            &ldquo;{testimonial.headline}&rdquo;
          </h3>

          {/* Quote */}
          <blockquote className="text-slate font-sans text-base sm:text-lg leading-relaxed mb-8">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
        </div>

        {/* Footer of Left Column: Attribution, Service Tag & Brand Mark */}
        <div className="pt-6 border-t border-line/60 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-sans font-semibold text-charcoal text-sm">
              {attribution}
            </div>
            <div className="font-sans text-xs text-slate mt-0.5">
              {testimonial.serviceHighlighted}
            </div>
          </div>

          {/* Powered by RepHero Global Mark */}
          <div className="text-xs font-sans text-slate/70 tracking-wide flex items-center gap-1.5">
            <span>Powered by</span>
            <span className="font-semibold text-charcoal">RepHero Global</span>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Container / Stat Callout (5 columns on desktop) */}
      <div
        className={`lg:col-span-5 bg-gradient-to-br ${visualGradient} border-t lg:border-t-0 lg:border-l border-line p-8 lg:p-10 flex flex-col items-center justify-center relative min-h-[260px] lg:min-h-full`}
      >
        {/* Stat Callout / Metrics Card */}
        <div className="w-full max-w-sm bg-white border border-line rounded-[2px] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <span className="text-xs uppercase font-sans tracking-eyebrow text-slate font-medium">
              Practice Impact
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-sans text-slate bg-mist px-2 py-0.5 rounded-[2px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Verified
            </span>
          </div>

          <div className="py-6 text-center">
            <div className="font-serif text-5xl text-charcoal font-normal tracking-tight mb-1">
              {testimonial.backgroundTheme === "dental" ? "5 Dedicated" : "50–60%"}
            </div>
            <div className="text-xs font-sans text-slate uppercase tracking-wider font-medium">
              {testimonial.backgroundTheme === "dental" ? "Front-Desk Agents Placed" : "Typical Overhead Savings"}
            </div>
          </div>

          <div className="pt-4 border-t border-line/60 flex items-center justify-between text-xs text-slate font-sans">
            <span>Coverage</span>
            <span className="font-medium text-charcoal">In-House + After-Hours</span>
          </div>
        </div>

        {/* Visual Direction / Field Context Notice */}
        <p className="mt-4 text-[11px] text-slate/60 font-sans text-center max-w-xs">
          {testimonial.backgroundDirection}
        </p>
      </div>
    </article>
  );
}

export default SuccessStoryBanner;
