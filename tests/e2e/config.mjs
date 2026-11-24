/**
 * RepHero E2E Test Suite - Shared Configuration & Authoritative Specification
 * 
 * Sources:
 * - ORIGINAL_REQUEST.md
 * - RepHero PRD (media_1795506969153_bca78fef.md)
 * - RepHero Sitemap & Navigation (media_1795506969147_18496eaf.md)
 * - RepHero Essentials (media_1795506969147_123016be.md)
 * - RepHero Design Guidelines (media_1795506969147_fb7167f2.md)
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PROJECT_ROOT = path.resolve(__dirname, '../..');
export const EXPORT_DIR = path.resolve(PROJECT_ROOT, 'out');
export const SRC_DIR = path.resolve(PROJECT_ROOT, 'src');
export const CONTENT_DIR = path.resolve(SRC_DIR, 'content');

export const BRAND_NAME = 'RepHero';
export const COMPANY_NAME = 'RepHero Global LLC';
export const SITE_URL = 'https://www.rephero.co';

/**
 * 12 Routes defined in the Sitemap:
 * /, /services, /industries, /how-it-works, /savings-calculator,
 * /success-stories, /about, /book-a-call, /thank-you, /privacy, /terms, /not-found (404)
 */
export const ROUTES = [
  { path: '/', name: 'Home', exportFile: 'index.html', inSitemap: true },
  { path: '/services', name: 'Services', exportFile: 'services/index.html', altExportFile: 'services.html', inSitemap: true },
  { path: '/industries', name: 'Industries', exportFile: 'industries/index.html', altExportFile: 'industries.html', inSitemap: true },
  { path: '/how-it-works', name: 'How It Works', exportFile: 'how-it-works/index.html', altExportFile: 'how-it-works.html', inSitemap: true },
  { path: '/savings-calculator', name: 'Savings Calculator', exportFile: 'savings-calculator/index.html', altExportFile: 'savings-calculator.html', inSitemap: true },
  { path: '/success-stories', name: 'Success Stories', exportFile: 'success-stories/index.html', altExportFile: 'success-stories.html', inSitemap: true },
  { path: '/about', name: 'About', exportFile: 'about/index.html', altExportFile: 'about.html', inSitemap: true },
  { path: '/book-a-call', name: 'Book a Call', exportFile: 'book-a-call/index.html', altExportFile: 'book-a-call.html', inSitemap: true },
  { path: '/thank-you', name: 'Thank You', exportFile: 'thank-you/index.html', altExportFile: 'thank-you.html', inSitemap: true },
  { path: '/privacy', name: 'Privacy Policy', exportFile: 'privacy/index.html', altExportFile: 'privacy.html', inSitemap: true },
  { path: '/terms', name: 'Terms of Use', exportFile: 'terms/index.html', altExportFile: 'terms.html', inSitemap: true },
  { path: '/not-found', name: '404 Not Found', exportFile: '404.html', altExportFile: 'not-found/index.html', inSitemap: false }
];

export const PUBLIC_CANONICAL_ROUTES = ROUTES.filter(r => r.inSitemap).map(r => r.path);

/**
 * Expected sequential section orders per page matching Sitemap §4.1 through §4.11
 */
export const EXPECTED_SECTIONS = {
  '/': [
    'hero',
    'trust-strip',
    'services-overview',
    'how-it-works',
    'savings-calculator',
    'industries',
    'success-stories',
    'faq',
    'cta'
  ],
  '/services': [
    'header',
    'category-tabs',
    'role-cards',
    'pricing-note',
    'trust-block',
    'faq',
    'cta'
  ],
  '/industries': [
    'header',
    'anchor-nav',
    'industry-sections',
    'cta'
  ],
  '/how-it-works': [
    'header',
    'timeline-steps',
    'what-to-expect',
    'communication-reporting',
    'faq',
    'cta'
  ],
  '/savings-calculator': [
    'header',
    'calculator-card',
    'result-cta',
    'disclaimer',
    'proof-points',
    'cta'
  ],
  '/success-stories': [
    'header',
    'banner-container',
    'results-strip',
    'cta'
  ],
  '/about': [
    'header',
    'story',
    'how-we-work',
    'values',
    'leadership',
    'cta'
  ],
  '/book-a-call': [
    'header',
    'booking-form',
    'scheduling-slot',
    'phi-warning',
    'contact-details',
    'next-steps'
  ],
  '/thank-you': [
    'confirmation',
    'expectation-cards',
    'return-links'
  ],
  '/privacy': [
    'header',
    'policy-content'
  ],
  '/terms': [
    'header',
    'terms-content'
  ],
  '/not-found': [
    'error-message',
    'recovery-links'
  ]
};

/**
 * Design Tokens & Visual Specs
 * Source: Design Guidelines §3-§5
 */
export const DESIGN_TOKENS = {
  colors: {
    ink: '#090E12',
    deepNavy: '#0F3554',
    charcoal: '#131D25',
    white: '#FFFFFF',
    mist: '#F7F8FA',
    sky: '#C6DDF5',
    peach: '#FFE3D1',
    slate: '#4A5560',
    line: '#E3E6EA'
  },
  typography: {
    headings: 'Instrument Serif',
    body: 'Inter',
    serifFallbacks: ['Newsreader', 'Georgia', 'serif'],
    sansFallbacks: ['system-ui', 'sans-serif']
  },
  corners: {
    maxBorderRadiusPx: 4,
    classes: ['rounded-none', 'rounded-[2px]', 'rounded-sm']
  },
  contrastRatios: {
    bodyTextMin: 4.5,
    largeTextMin: 3.0
  }
};

/**
 * Calculator Specifications & Authoritative Benchmark
 * Source: Essentials §2, PRD §8.4
 */
export const CALCULATOR = {
  minPercentage: 0.50,
  maxPercentage: 0.60,
  benchmark: {
    teamMembers: 2,
    currentMonthlyCost: 3500,
    expectedMonthlyMin: 3500,
    expectedMonthlyMax: 4200,
    expectedAnnualMin: 42000,
    expectedAnnualMax: 50400,
    expectedMonthlyDisplayPattern: /\$3,500\s*[–-]\s*\$4,200\/mo/i,
    expectedAnnualDisplayPattern: /\$42,000\s*[–-]\s*\$50,400\/yr/i
  },
  publishedBenchmark: {
    roleId: 'admin-front-desk',
    roleName: 'Admin / Front Desk',
    publishedPrice: 1499,
    teamMembers: 2,
    currentMonthlyCost: 3500,
    expectedDifference: 4002 // 2 * (3500 - 1499)
  },
  disclaimerText: 'Estimates only, based on typical savings. Actual results vary and are not guaranteed.',
  ctaText: 'Get a custom plan',
  targetUrl: '/book-a-call'
};

/**
 * Book a Call Form & Scheduling Specifications
 * Source: PRD §8.6, Essentials §3
 */
export const BOOKING = {
  discoveryCallLengthMinutes: 15,
  discoveryCallDurationText: '15-minute',
  phiWarningExactString: 'do not include patient information',
  honeypotFieldName: 'website_url',
  altHoneypotFieldName: 'hp_field',
  requiredFields: ['name', 'workEmail', 'practiceName', 'practiceType'],
  optionalFields: ['phone', 'rolesOfInterest', 'message'],
  redirectTarget: '/thank-you',
  schedulingSlotId: 'booking-embed-slot'
};

/**
 * Success Stories & Testimonials Controlled Display
 * Source: PRD §8.5, Design Guidelines §7
 */
export const TESTIMONIALS = {
  invariantAttribution: 'Client Feedback',
  poweredByBadge: 'Powered by RepHero Global',
  allBanners: [
    {
      id: 'odonto-dental',
      client: 'Odonto Dental',
      service: 'Dental Front Desk & Patient Coordination',
      isApproved: true,
      attribution: 'Client Feedback'
    },
    {
      id: 'tareen-dental',
      client: 'Tareen Dental',
      service: 'Dental Billing & Insurance Verification',
      isApproved: false,
      attribution: 'Practice Manager'
    },
    {
      id: 'mypsychmd',
      client: 'MyPsychMD',
      service: 'Mental Health Intake & Scheduling',
      isApproved: false,
      attribution: 'Operations Director'
    },
    {
      id: 'fastsigns',
      client: 'FASTSIGNS',
      service: 'Production Design & Graphic Support',
      isApproved: false,
      attribution: 'General Manager'
    }
  ],
  approvedBannerIds: ['odonto-dental'],
  unapprovedBannerIds: ['tareen-dental', 'mypsychmd', 'fastsigns']
};

/**
 * Navigation Header & Multi-Column Footer
 * Source: Sitemap §2, §3
 */
export const NAVIGATION = {
  desktopLinks: [
    { label: 'Services', href: '/services' },
    { label: 'Industries', href: '/industries' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'Savings Calculator', href: '/savings-calculator' },
    { label: 'About', href: '/about' }
  ],
  headerCta: { label: 'Book a Call', href: '/book-a-call' },
  footerColumns: ['Brand', 'Company', 'Services', 'Contact', 'Legal'],
  footerLegalLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' }
  ],
  copyrightText: 'RepHero Global LLC',
  hipaaNoticePattern: /HIPAA|BAA|Business Associate Agreement/i
};

/**
 * Prohibited Hardcoded Words / Copy Leakage
 */
export const PROHIBITED_WORDS = [
  'Lorem ipsum',
  'lorem ipsum',
  'Aculis',
  'dexes',
  'Rapido'
];
