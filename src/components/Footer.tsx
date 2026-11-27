import React from "react";
import {
  BRAND_NAME,
  COMPANY_NAME,
  SUPPORTING_LINE,
  COMPLIANCE_STATEMENT,
  COPYRIGHT_TEXT,
  FOOTER_COLUMNS,
} from "@/content";

export function Footer() {
  const companyCol = FOOTER_COLUMNS.find((column) => column.title === "Company");
  const servicesCol = FOOTER_COLUMNS.find((column) => column.title === "Services");
  const industriesCol = FOOTER_COLUMNS.find((column) => column.title === "Industries");
  const contactCol = FOOTER_COLUMNS.find((column) => column.title === "Contact");
  const legalCol = FOOTER_COLUMNS.find((column) => column.title === "Legal");
  const navigateLinks = [
    ...(companyCol?.links ?? []),
    ...(industriesCol?.links ?? []),
  ];
  const contactLinks = [
    ...(contactCol?.links ?? []),
    ...(legalCol?.links ?? []),
  ];

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner container">
        <div className="site-footer__statement">
          <p>A calmer practice starts with the right team.</p>
          <a className="home-button home-button--light" href="/book-a-call">
            Book a call
          </a>
        </div>

        <div className="site-footer__directory">
          <div className="site-footer__brand">
            <a href="/" aria-label={`${BRAND_NAME} Home`}>
              <span>RepHero</span>
              <span className="site-footer__brand-dot">.</span>
            </a>
            <p>{SUPPORTING_LINE}</p>
            <p className="site-footer__company">{COMPANY_NAME}</p>
          </div>

          <nav className="site-footer__group" aria-label="Navigate">
            <h2>Navigate</h2>
            <ul>
              {navigateLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="site-footer__group" aria-label="Services">
            <h2>Services</h2>
            <ul>
              {servicesCol?.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="site-footer__group" aria-label="Contact and legal">
            <h2>Contact and legal</h2>
            <ul>
              {contactLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.isExternal ? "_blank" : undefined}
                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="site-footer__legal">
          <p>{COMPLIANCE_STATEMENT}</p>
          <p>
            {COPYRIGHT_TEXT} Trained remote healthcare staffing. Zero PHI stored
            on web.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
