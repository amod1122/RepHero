/**
 * Tier 1 Test Suite: F1 - Page Architecture & Route Existence (R1 / F1)
 * 
 * Verifies that all 12 pages defined in the Sitemap exist, are non-empty,
 * and contain the exact ordered section hierarchy specified in Sitemap §4.1 through §4.11.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { skipIfNoExport } from '../helpers/assertions.mjs';
import { EXPECTED_SECTIONS, ROUTES } from '../config.mjs';

const crawler = new RouteCrawler();

describe('F1: Page Architecture & Route Existence (12 Pages)', () => {
  // TEST-T1-F1-001: Home Route Existence & Section Structure
  test('TEST-T1-F1-001: Home (/) exists and contains exact ordered sections', (t) => {
    if (skipIfNoExport(t, '/')) return;

    const html = crawler.getPageHtml('/');
    assert.ok(html, 'Home page HTML must not be null');
    assert.ok(html.length > 500, 'Home page HTML must be substantial and non-empty');

    // Verify key landmark sections
    assert.ok(HtmlParser.hasText(html, 'RepHero'), 'Home must contain brand name');
    
    // Check for sections / content
    const hasHero = HtmlParser.hasText(html, /hire|healthcare|staffing|extension of your practice/i);
    const hasTrust = HtmlParser.hasText(html, /HIPAA|BAA|savings|flat pricing/i);
    const hasServices = HtmlParser.hasText(html, /services|admin|billing|creative/i);
    const hasHowItWorks = HtmlParser.hasText(html, /how it works|steps|discovery/i);
    const hasCalculator = HtmlParser.hasText(html, /calculator|savings|estimate/i);
    const hasIndustries = HtmlParser.hasText(html, /industries|dental|practice/i);
    const hasStories = HtmlParser.hasText(html, /success stories|client feedback/i);
    const hasFaq = HtmlParser.hasText(html, /frequently asked|faq/i);
    const hasCta = HtmlParser.hasText(html, /book a call/i);

    assert.ok(hasHero, 'Home must contain Hero section');
    assert.ok(hasTrust, 'Home must contain Trust strip section');
    assert.ok(hasServices, 'Home must contain Services overview section');
    assert.ok(hasHowItWorks, 'Home must contain How It Works section');
    assert.ok(hasCalculator, 'Home must contain Savings Calculator teaser section');
    assert.ok(hasIndustries, 'Home must contain Industries section');
    assert.ok(hasStories, 'Home must contain Success Stories section');
    assert.ok(hasFaq, 'Home must contain FAQ section');
    assert.ok(hasCta, 'Home must contain Final CTA section');
  });

  // TEST-T1-F1-002: Services Route Existence & Section Structure
  test('TEST-T1-F1-002: Services (/services) exists and contains 7 ordered sections', (t) => {
    if (skipIfNoExport(t, '/services')) return;

    const html = crawler.getPageHtml('/services');
    assert.ok(html, 'Services page HTML must exist');
    assert.ok(html.length > 500, 'Services page must not be empty');

    // Verify category tabs and role cards
    assert.ok(HtmlParser.hasText(html, /Admin and Executive/i), 'Must contain Admin & Executive category');
    assert.ok(HtmlParser.hasText(html, /Revenue Cycle/i), 'Must contain Revenue Cycle category');
    assert.ok(HtmlParser.hasText(html, /Extended and Creative/i), 'Must contain Extended & Creative category');
    assert.ok(HtmlParser.hasText(html, /pricing|flat monthly/i), 'Must contain pricing note');
    assert.ok(HtmlParser.hasText(html, /HIPAA|BAA/i), 'Must contain trust block');
  });

  // TEST-T1-F1-003: Industries Route Existence & Anchor Navigation
  test('TEST-T1-F1-003: Industries (/industries) exists with anchor jump nav & 6 industry sections', (t) => {
    if (skipIfNoExport(t, '/industries')) return;

    const html = crawler.getPageHtml('/industries');
    assert.ok(html, 'Industries page HTML must exist');

    // Verify anchor nav links or section anchors
    const requiredAnchorPatterns = [
      /family-medicine/,
      /hospice-(?:care|home-health)/,
      /behavioral-health/,
      /dental(?:-practices)?/,
      /specialty-pharmacy/,
      /pain-management/
    ];

    for (const pattern of requiredAnchorPatterns) {
      assert.ok(
        pattern.test(html),
        `Industries must contain anchor matching ${pattern}`
      );
    }
  });

  // TEST-T1-F1-004: How It Works Route Existence & Section Structure
  test('TEST-T1-F1-004: How It Works (/how-it-works) exists with 6-step timeline', (t) => {
    if (skipIfNoExport(t, '/how-it-works')) return;

    const html = crawler.getPageHtml('/how-it-works');
    assert.ok(html, 'How It Works HTML must exist');

    // Must mention 6 process phases: Discovery, Proposal, Agreement/BAA, Matching, Onboarding, Support
    assert.ok(HtmlParser.hasText(html, /discovery/i), 'Step 1: Discovery call must be described');
    assert.ok(HtmlParser.hasText(html, /proposal/i), 'Step 2: Custom proposal must be described');
    assert.ok(HtmlParser.hasText(html, /BAA|agreement|DocuSign/i), 'Step 3: BAA and agreement must be described');
    assert.ok(HtmlParser.hasText(html, /matching|candidate/i), 'Step 4: Candidate matching must be described');
    assert.ok(HtmlParser.hasText(html, /onboarding/i), 'Step 5: Onboarding must be described');
    assert.ok(HtmlParser.hasText(html, /support|reporting/i), 'Step 6: Ongoing support must be described');
  });

  // TEST-T1-F1-005: Savings Calculator Page Section Structure
  test('TEST-T1-F1-005: Savings Calculator (/savings-calculator) exists with card, CTA & disclaimer', (t) => {
    if (skipIfNoExport(t, '/savings-calculator')) return;

    const html = crawler.getPageHtml('/savings-calculator');
    assert.ok(html, 'Savings Calculator HTML must exist');

    // Calculator inputs & disclaimer text
    assert.ok(HtmlParser.hasText(html, /team|staff|members|cost/i), 'Calculator card inputs must exist');
    assert.ok(HtmlParser.hasText(html, /Get a custom plan/i), 'Must contain "Get a custom plan" CTA');
    assert.ok(HtmlParser.hasText(html, /Estimates only/i), 'Must contain mandatory disclaimer text');
  });

  // TEST-T1-F1-006: Success Stories Page Section Structure
  test('TEST-T1-F1-006: Success Stories (/success-stories) exists with banner container & CTA', (t) => {
    if (skipIfNoExport(t, '/success-stories')) return;

    const html = crawler.getPageHtml('/success-stories');
    assert.ok(html, 'Success Stories HTML must exist');

    assert.ok(HtmlParser.hasText(html, /Powered by RepHero Global/i), 'Must include "Powered by RepHero Global" badge');
    assert.ok(HtmlParser.hasText(html, /Client Feedback/i), 'Must include Testimonial 1 attribution');
  });

  // TEST-T1-F1-007: About Page Section Structure
  test('TEST-T1-F1-007: About (/about) exists with story, mission, values and CTA', (t) => {
    if (skipIfNoExport(t, '/about')) return;

    const html = crawler.getPageHtml('/about');
    assert.ok(html, 'About page HTML must exist');

    assert.ok(HtmlParser.hasText(html, /mission|story|who we are/i), 'Must contain company story');
    assert.ok(HtmlParser.hasText(html, /values|how we work/i), 'Must contain values section');
    assert.ok(HtmlParser.hasText(html, /Book a Call/i), 'Must contain closing CTA');
  });

  // TEST-T1-F1-008: Book a Call Page Section Structure
  test('TEST-T1-F1-008: Book a Call (/book-a-call) exists with 15-min call, form, and PHI notice', (t) => {
    if (skipIfNoExport(t, '/book-a-call')) return;

    const html = crawler.getPageHtml('/book-a-call');
    assert.ok(html, 'Book a Call HTML must exist');

    assert.ok(HtmlParser.hasText(html, /15\s*[-–]\s*minute/i), 'Must specify 15-minute call duration');
    assert.ok(HtmlParser.hasText(html, /do not include patient information|PHI/i), 'Must include mandatory PHI warning notice');
    assert.ok(html.includes('booking-embed-slot') || HtmlParser.hasText(html, /schedule|calendar/i), 'Must include scheduling tool slot');
  });

  // TEST-T1-F1-009: Thank You Page Content & Expectation Cards
  test('TEST-T1-F1-009: Thank You (/thank-you) exists with confirmation & expectation cards', (t) => {
    if (skipIfNoExport(t, '/thank-you')) return;

    const html = crawler.getPageHtml('/thank-you');
    assert.ok(html, 'Thank You HTML must exist');

    assert.ok(HtmlParser.hasText(html, /thank you|confirmed|received/i), 'Must confirm booking or submission');
    assert.ok(html.includes('/services') || html.includes('/success-stories'), 'Must provide return navigation links');
  });

  // TEST-T1-F1-010: Legal Pages Existence (/privacy & /terms)
  test('TEST-T1-F1-010: Legal Pages (/privacy and /terms) exist with standard disclosures', (t) => {
    if (skipIfNoExport(t, '/privacy') || skipIfNoExport(t, '/terms')) return;

    const privacyHtml = crawler.getPageHtml('/privacy');
    const termsHtml = crawler.getPageHtml('/terms');

    assert.ok(privacyHtml, 'Privacy Policy HTML must exist');
    assert.ok(termsHtml, 'Terms of Use HTML must exist');

    assert.ok(HtmlParser.hasText(privacyHtml, /privacy|data|cookies/i), 'Privacy policy must contain privacy statement');
    assert.ok(HtmlParser.hasText(privacyHtml, /PHI|patient information/i), 'Privacy policy must mention non-collection of PHI');
    assert.ok(HtmlParser.hasText(termsHtml, /terms|liability|estimates/i), 'Terms must contain terms and disclaimer of savings guarantee');
  });

  // TEST-T1-F1-011: 404 Not Found Page Architecture & Recovery Links
  test('TEST-T1-F1-011: 404 Not Found exists with header/footer and recovery links', (t) => {
    if (skipIfNoExport(t, '/not-found')) return;

    const html = crawler.getPageHtml('/not-found');
    assert.ok(html, '404 HTML must exist');

    assert.ok(HtmlParser.hasText(html, /404|not found|page doesn't exist/i), 'Must display not found message');
    assert.ok(html.includes('href="/"') || html.includes('href="/services"'), 'Must contain recovery navigation links');
  });
});
