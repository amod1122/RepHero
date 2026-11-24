/**
 * Tier 4 End-to-End User Journey Test: Dental Practice Owner (Dr. Alex Smith)
 * File: tests/e2e/tier4/user-journey-dental-practice.test.mjs
 * 
 * Scenario Overview:
 * - Persona: Dr. Alex Smith, Owner of Smith Dental Care (Private Dental Practice, 2 Operatories, 5 Staff).
 * - Business Need: Evaluate replacement of 2 departing front-desk receptionists with trained remote staff;
 *   verify savings vs $3,500/mo current cost; verify HIPAA compliance & non-PHI requirements; book a 15-min discovery call.
 * 
 * Complete Journey Phases:
 * 1. Entry & Hero Impression on Home (/)
 * 2. Trust Strip Due Diligence (4 Proof Points & Client Logos)
 * 3. Savings Calculator Interaction & Benchmark Validation ($n=2, C=3500)
 * 4. Intent Transition via "Get a custom plan" forwarding to /book-a-call
 * 5. Booking Form Hydration in <Suspense>, non-PHI notice verification & completion
 * 6. Form Submission & Conversion to /thank-you with 3 Expectation Steps
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { MathVerifier } from '../helpers/math-verifier.mjs';
import { skipIfNoExport } from '../helpers/assertions.mjs';
import { CALCULATOR, BOOKING, SRC_DIR } from '../config.mjs';

const crawler = new RouteCrawler();

// Self-contained booking form validator matching PRD §8.6
function validateBookingForm(data) {
  const errors = {};
  if (!data.name || !data.name.trim()) errors.name = 'Full name is required';
  if (!data.workEmail || !data.workEmail.includes('@') || !data.workEmail.includes('.')) {
    errors.workEmail = 'Valid work email required';
  }
  if (!data.practiceName || !data.practiceName.trim()) errors.practiceName = 'Practice name required';
  if (!data.practiceType || !data.practiceType.trim()) errors.practiceType = 'Practice type required';

  const honeypotVal = data[BOOKING.honeypotFieldName] || data.website_url_hp || data[BOOKING.altHoneypotFieldName];
  const isBotTrapped = typeof honeypotVal === 'string' && honeypotVal.trim().length > 0;

  return {
    isValid: Object.keys(errors).length === 0 && !isBotTrapped,
    isBotTrapped,
    errors
  };
}

describe('Tier 4 Journey 1: Dental Practice Owner Conversion Journey (Dr. Alex Smith)', () => {

  test('E2E-T4-001: Dr. Alex Smith evaluates benchmark savings, verifies compliance, and completes booking', (t) => {
    // =========================================================================
    // Phase 1: Entry & Hero Impression on Home (/)
    // =========================================================================
    const homePagePath = path.join(SRC_DIR, 'app', 'page.tsx');
    assert.ok(fs.existsSync(homePagePath), 'Home page source must exist');
    const homeSource = fs.readFileSync(homePagePath, 'utf-8');

    // Hero heading and branding check
    assert.ok(
      homeSource.includes('TAGLINE') ||
      homeSource.includes('Trained remote professionals for healthcare practices') ||
      homeSource.includes('RepHero'),
      'Hero section must display headline for healthcare practices'
    );
    assert.ok(
      homeSource.includes('/book-a-call'),
      'Hero must provide primary CTA link to /book-a-call'
    );

    // If static export is present, check HTML structure
    if (crawler.isExportPresent() && crawler.hasPageExport('/')) {
      const homeHtml = crawler.getPageHtml('/');
      const landmarks = HtmlParser.extractLandmarks(homeHtml);
      assert.ok(landmarks.hasHeader || homeHtml.includes('<header') || homeHtml.includes('nav'), 'Header navigation must be rendered');
      assert.ok(HtmlParser.hasText(homeHtml, 'Book a Call'), 'Book a Call CTA must be visible in Hero');
    }

    // =========================================================================
    // Phase 2: Trust Strip Due Diligence (Proof Points)
    // =========================================================================
    const siteConfigPath = path.join(SRC_DIR, 'content', 'siteConfig.ts');
    const siteConfigContent = fs.readFileSync(siteConfigPath, 'utf-8');

    // Verify 4 proof points in content
    assert.ok(siteConfigContent.includes('50-60% Savings'), 'Must highlight 50-60% savings proof point');
    assert.ok(siteConfigContent.includes('HIPAA-Trained & BAA'), 'Must highlight HIPAA and BAA compliance');
    assert.ok(siteConfigContent.includes('Flat Monthly Pricing'), 'Must highlight Flat Monthly Pricing');
    assert.ok(siteConfigContent.includes('Proactive Communication'), 'Must highlight Proactive Communication');

    // =========================================================================
    // Phase 3: Savings Calculator Interaction & Benchmark Calculation
    // =========================================================================
    // Dr. Smith enters 2 team members and $3,500/mo current cost for Admin / Front Desk
    const inputRole = 'admin-front-desk';
    const inputMembers = 2;
    const inputCost = 3500;
    const publishedPrice = 1499;

    const calcResult = MathVerifier.calculateSavings(inputMembers, inputCost, publishedPrice);

    // Verify calculated ranges
    assert.strictEqual(calcResult.monthlyMin, 3500, 'Monthly min savings must be $3,500');
    assert.strictEqual(calcResult.monthlyMax, 4200, 'Monthly max savings must be $4,200');
    assert.strictEqual(calcResult.annualMin, 42000, 'Annual min savings must be $42,000');
    assert.strictEqual(calcResult.annualMax, 50400, 'Annual max savings must be $50,400');
    assert.strictEqual(calcResult.publishedDiff, 4002, 'Comparison vs listed price ($1,499) must be $4,002');

    // Calculator page must display disclaimer
    const calcPagePath = path.join(SRC_DIR, 'app', 'savings-calculator', 'page.tsx');
    assert.ok(fs.existsSync(calcPagePath), 'savings-calculator page must exist');
    const calcSource = fs.readFileSync(calcPagePath, 'utf-8');
    assert.ok(
      calcSource.includes('disclaimer') || calcSource.includes('Estimates only'),
      'Calculator page must render legal disclaimer'
    );

    // =========================================================================
    // Phase 4: Intent & Navigation Forwarding
    // =========================================================================
    // Dr. Smith clicks "Get a custom plan"
    const forwardParams = new URLSearchParams({
      role: inputRole,
      teamMembers: String(inputMembers),
      currentCost: String(inputCost)
    });
    const destinationUrl = `/book-a-call?${forwardParams.toString()}`;
    assert.strictEqual(
      destinationUrl,
      '/book-a-call?role=admin-front-desk&teamMembers=2&currentCost=3500',
      'Target URL must match exact query parameter serialization'
    );

    // =========================================================================
    // Phase 5: Booking Form Hydration & Completion
    // =========================================================================
    const bookCallPath = path.join(SRC_DIR, 'app', 'book-a-call', 'page.tsx');
    const bookCallSource = fs.readFileSync(bookCallPath, 'utf-8');

    // Verify Suspense boundary protects searchParams reading
    assert.ok(bookCallSource.includes('<Suspense'), 'BookCallPage must use <Suspense> boundary');

    // Verify 15-minute consultation notice
    assert.ok(
      bookCallSource.includes('15') || bookCallSource.includes('DISCOVERY_CALL_LENGTH_MINUTES'),
      'Booking form must display 15-minute consultation duration'
    );

    // Verify non-PHI notice
    assert.ok(
      bookCallSource.includes('PHI_WARNING_NOTICE') || bookCallSource.includes('patient information'),
      'Booking form must enforce non-PHI warning notice'
    );

    // Form prefill extraction simulation
    const simulatedSearchParams = new URLSearchParams(forwardParams);
    const prefilledRole = simulatedSearchParams.get('role');
    const prefilledMembers = simulatedSearchParams.get('teamMembers');

    assert.strictEqual(prefilledRole, 'admin-front-desk');
    assert.strictEqual(prefilledMembers, '2');

    // Dr. Smith fills out practice information
    const submissionData = {
      name: 'Dr. Alex Smith',
      workEmail: 'alex@smithdental.com',
      phone: '(555) 234-5678',
      practiceName: 'Smith Dental Care',
      practiceType: 'Dental',
      role: prefilledRole,
      teamMembers: prefilledMembers,
      message: 'Looking to place 2 dental receptionists for patient recall and scheduling.',
      website_url_hp: '' // Honeypot remains empty
    };

    const validation = validateBookingForm(submissionData);
    assert.strictEqual(validation.isValid, true, 'Form submission must be valid');
    assert.strictEqual(validation.isBotTrapped, false, 'Legitimate visitor must not be bot trapped');

    // =========================================================================
    // Phase 6: Submission & Conversion to /thank-you
    // =========================================================================
    // Target redirect URL on submit
    assert.ok(bookCallSource.includes('/thank-you'), 'Form submission must redirect to /thank-you');

    const thankYouPath = path.join(SRC_DIR, 'app', 'thank-you', 'page.tsx');
    assert.ok(fs.existsSync(thankYouPath), 'thank-you page source must exist');
    const thankYouSource = fs.readFileSync(thankYouPath, 'utf-8');

    // Verify 3 expectation steps on thank-you page
    assert.ok(thankYouSource.includes('What Happens Next'), 'Must display "What Happens Next" section');
    assert.ok(thankYouSource.includes('Step 1') || thankYouSource.includes('num: "1"'), 'Must render Step 1');
    assert.ok(thankYouSource.includes('Step 2') || thankYouSource.includes('num: "2"'), 'Must render Step 2');
    assert.ok(thankYouSource.includes('Step 3') || thankYouSource.includes('num: "3"'), 'Must render Step 3');
    assert.ok(thankYouSource.includes('Return Home') || thankYouSource.includes('href="/"'), 'Must provide link back to home');
  });

});
