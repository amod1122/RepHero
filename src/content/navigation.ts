import type { NavigationItem, FooterColumn } from './types';

export const HEADER_NAV_LINKS: NavigationItem[] = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Savings Calculator", href: "/#savings-calculator" },
  { label: "Our Team", href: "/our-team" },
  { label: "About", href: "/about" },
];

export const HEADER_CTA: NavigationItem = {
  label: "Book a Call",
  href: "/book-a-call",
  isButton: true,
};

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Our Team", href: "/our-team" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Savings Calculator", href: "/#savings-calculator" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Admin & Executive", href: "/services#admin-and-executive" },
      { label: "Revenue Cycle & Compliance", href: "/services#revenue-cycle-and-compliance" },
      { label: "Extended & Creative", href: "/services#extended-and-creative" },
      { label: "View All 9 Roles", href: "/services" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Dental Practices", href: "/industries#dental" },
      { label: "Family Medicine & Primary Care", href: "/industries#family-medicine" },
      { label: "Hospice & Home Health", href: "/industries#hospice-home-health" },
      { label: "Behavioral Health", href: "/industries#behavioral-health" },
      { label: "Specialty Pharmacy & Labs", href: "/industries#specialty-pharmacy" },
      { label: "Pain Management & ACOs", href: "/industries#pain-management" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Book a Discovery Call", href: "/book-a-call" },
      { label: "hello@rephero.co", href: "mailto:hello@rephero.co" },
      { label: "+1 (800) 555-0199", href: "tel:+18005550199" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/rephero-global", isExternal: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
    ],
  },
];
