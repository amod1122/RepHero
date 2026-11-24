import React from "react";
import {
  BRAND_NAME,
  COMPANY_NAME,
  SUPPORTING_LINE,
  COMPLIANCE_STATEMENT,
  COPYRIGHT_TEXT,
  FOOTER_COLUMNS,
  CONTACT_INFO,
  SOCIAL_LINKS,
} from "@/content";

export function Footer() {
  const companyCol = FOOTER_COLUMNS.find((c) => c.title === "Company");
  const servicesCol = FOOTER_COLUMNS.find((c) => c.title === "Services");
  const contactCol = FOOTER_COLUMNS.find((c) => c.title === "Contact");
  const legalCol = FOOTER_COLUMNS.find((c) => c.title === "Legal");

  return (
    <footer className="bg-ink text-white border-t border-white/10" role="contentinfo">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16">
        
        {/* 5 Directory Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              <a
                href="/"
                className="font-sans font-bold text-2xl tracking-tight text-white hover:opacity-85 transition-opacity inline-flex items-center"
                aria-label={`${BRAND_NAME} Home`}
              >
                <span>RepHero</span>
                <span className="text-sky">.</span>
              </a>
              <p className="mt-3 text-xs text-white/50 uppercase tracking-wider font-semibold">
                {COMPANY_NAME}
              </p>
              <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                {SUPPORTING_LINE}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-white/5 border border-white/10 text-[11px] text-sky font-medium w-fit">
                HIPAA-Trained & Signed BAA
              </div>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 w-fit"
                aria-label="RepHero on LinkedIn (opens in a new window)"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sky mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {companyCol?.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sky mb-4">
              Services
            </h3>
            <ul className="space-y-2.5">
              {servicesCol?.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sky mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <a
                  href="/book-a-call"
                  className="text-white font-medium hover:text-sky transition-colors inline-flex items-center gap-1"
                >
                  Book a Discovery Call <span aria-hidden="true">→</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-white transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/[^+\d]/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="text-xs text-slate-400 pt-1">
                {CONTACT_INFO.location}
              </li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sky mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {legalCol?.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BAA & HIPAA Compliance Statement */}
        <div className="mt-14 pt-8 border-t border-white/10">
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
            {COMPLIANCE_STATEMENT}
          </p>
        </div>

        {/* Bottom Bar: Copyright & Details */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{COPYRIGHT_TEXT}</p>
          <p className="text-slate-400">
            Trained remote healthcare staffing · Zero PHI stored on web
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
