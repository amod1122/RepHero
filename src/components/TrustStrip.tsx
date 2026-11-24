import React from "react";
import { TrendingDown, ShieldCheck, CreditCard, MessageSquare, CheckCircle2 } from "lucide-react";
import { TRUST_POINTS, PARTNER_BADGES, type PartnerBadge } from "@/content";

export interface TrustPoint {
  id: string;
  title: string;
  description: string;
}

export type ClientLogoItem = PartnerBadge;

export interface TrustStripProps {
  variant?: "dark" | "light";
  showLogos?: boolean;
  showProofPoints?: boolean;
  points?: TrustPoint[];
  partnerBadges?: PartnerBadge[];
  className?: string;
}

function getTrustIcon(id: string, isDark: boolean) {
  const iconClass = isDark
    ? "w-5 h-5 text-sky"
    : "w-5 h-5 text-navy";

  switch (id) {
    case "savings":
      return <TrendingDown className={iconClass} aria-hidden="true" />;
    case "hipaa":
      return <ShieldCheck className={iconClass} aria-hidden="true" />;
    case "pricing":
      return <CreditCard className={iconClass} aria-hidden="true" />;
    case "communication":
      return <MessageSquare className={iconClass} aria-hidden="true" />;
    default:
      return <CheckCircle2 className={iconClass} aria-hidden="true" />;
  }
}

export function TrustStrip({
  variant = "light",
  showLogos = true,
  showProofPoints = true,
  points = TRUST_POINTS,
  partnerBadges = PARTNER_BADGES,
  className = "",
}: TrustStripProps) {
  const isDark = variant === "dark";

  return (
    <section
      aria-label="Trust and compliance proof points"
      className={`${
        isDark
          ? "bg-ink border-y border-white/10 text-white"
          : "bg-mist/80 border-y border-line text-charcoal"
      } py-12 sm:py-16 ${className}`}
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Proof Points Grid */}
        {showProofPoints && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {points.map((point) => (
              <div
                key={point.id}
                className="flex flex-col items-start"
              >
                <div
                  className={`p-2.5 rounded-[2px] mb-4 ${
                    isDark
                      ? "bg-white/5 border border-white/10"
                      : "bg-white border border-line shadow-sm"
                  }`}
                >
                  {getTrustIcon(point.id, isDark)}
                </div>
                <h3
                  className={`font-sans font-semibold text-base sm:text-lg tracking-tight ${
                    isDark ? "text-white" : "text-charcoal"
                  }`}
                >
                  {point.title}
                </h3>
                <p
                  className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate"
                  }`}
                >
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Practice Partner Category Badges */}
        {showLogos && (
          <div
            className={`${
              showProofPoints
                ? isDark
                  ? "mt-12 pt-10 border-t border-white/10"
                  : "mt-12 pt-10 border-t border-line"
                : ""
            }`}
          >
            <p
              className={`text-center text-xs uppercase tracking-eyebrow font-medium mb-6 ${
                isDark ? "text-slate-400" : "text-slate"
              }`}
            >
              Trusted by Leading Healthcare Practices
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-14">
              {partnerBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-2 group transition-opacity"
                >
                  <span
                    className={`font-sans font-semibold text-sm sm:text-base tracking-wider uppercase transition-colors ${
                      isDark
                        ? "text-white/40 group-hover:text-white/80"
                        : "text-slate/60 group-hover:text-charcoal"
                    }`}
                  >
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default TrustStrip;
