import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import type { ServiceRole } from "@/content/types";
import { CTA_LABELS } from "@/content";

export interface RoleCardProps {
  role: ServiceRole;
  compact?: boolean;
  showCategoryBadge?: boolean;
  className?: string;
}

export function RoleCard({
  role,
  compact = false,
  showCategoryBadge = true,
  className = "",
}: RoleCardProps) {
  const ctaLabel = CTA_LABELS.roleCard || "Book a call about this role";

  return (
    <article
      className={`bg-mist border border-line rounded-[2px] p-6 sm:p-8 flex flex-col justify-between h-full hover:border-navy/40 transition-all duration-200 shadow-sm ${className}`}
      data-role-id={role.id}
    >
      <div>
        {/* Top Badges: Category & Popular */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {showCategoryBadge && (
            <span className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-navy bg-sky/30 px-2.5 py-1 rounded-[2px]">
              {role.category}
            </span>
          )}
          {role.popular && (
            <span className="text-[11px] font-sans font-medium uppercase tracking-eyebrow text-charcoal bg-peach px-2.5 py-1 rounded-[2px]">
              Popular
            </span>
          )}
        </div>

        {/* Role Title */}
        <h3 className="text-charcoal font-sans text-xl sm:text-2xl font-semibold tracking-tight">
          {role.name}
        </h3>

        {/* Role Description */}
        <p className="text-slate text-sm sm:text-base leading-relaxed mt-2.5">
          {role.description}
        </p>

        {/* Key Responsibilities */}
        {!compact && role.responsibilities && role.responsibilities.length > 0 && (
          <div className="mt-6 pt-5 border-t border-line/60">
            <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-charcoal/70 mb-3">
              Key Responsibilities
            </h4>
            <ul className="space-y-2.5 text-sm text-slate">
              {role.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className="w-4 h-4 text-navy shrink-0 mt-0.5 mr-2.5" aria-hidden="true" />
                  <span className="leading-snug">{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Pricing & Forwarding CTA */}
      <div className="mt-8 pt-6 border-t border-line flex flex-col gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-500 font-medium block">
            Pricing
          </span>
          <div className="text-2xl font-bold font-sans text-charcoal mt-0.5">
            {role.priceDisplay}
          </div>
          {role.unitDetails && (
            <p className="text-xs text-slate mt-1">
              {role.unitDetails}
            </p>
          )}
        </div>

        <Link
          href={`/book-a-call?role=${encodeURIComponent(role.id)}`}
          className="w-full bg-charcoal text-white hover:bg-ink rounded-[2px] py-3 px-5 font-medium text-sm flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
        >
          <span>{ctaLabel}</span>
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default RoleCard;
