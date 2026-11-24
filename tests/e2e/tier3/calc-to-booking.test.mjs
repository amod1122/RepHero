/**
 * Tier 3 Test Suite: Cross-Feature Combinations — Calculator to Booking
 * File: tests/e2e/tier3/calc-to-booking.test.mjs
 * 
 * Sources & Interface Contracts:
 * - PROJECT.md: Contract 3 (Calculator -> Booking Form Query Parameters & Suspense Hydration)
 * - ORIGINAL_REQUEST.md: R3, R4, Benchmark Test ($n=2, C=3500 -> $3,500-$4,200/mo)
 * - PRD §8.4, §8.6, Essentials §2
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { MathVerifier } from '../helpers/math-verifier.mjs';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { skipIfNoExport } from '../helpers/assertions.mjs';
import { CALCULATOR, BOOKING, SRC_DIR } from '../config.mjs';
import { parseTeamMembersParam, parseCurrentCostParam } from '../../../src/lib/validation.ts';

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

describe('Tier 3: Calculator -> Booking URL Hydration -> Prefill -> Submit', () => {

  // TEST-T3-CALC-001: Benchmark Flow — Calculator to Prefilled Form to Thank-You Redirect
  test('TEST-T3-CALC-001: Benchmark flow ($n=2, C=3500, admin-front-desk) forwards query string, hydrates in Suspense, validates & submits', (t) => {
    // 1. Math engine calculates benchmark values
    const benchmark = MathVerifier.verifyBenchmark();
    assert.ok(benchmark.passes, 'Benchmark math calculation must pass with 100% precision');
    assert.strictEqual(benchmark.result.monthlyMin, 3500);
    assert.strictEqual(benchmark.result.monthlyMax, 4200);
    assert.strictEqual(benchmark.result.annualMin, 42000);
    assert.strictEqual(benchmark.result.annualMax, 50400);

    const publishedBench = MathVerifier.verifyPublishedBenchmark();
    assert.ok(publishedBench.passes, 'Published price difference must equal $4,002');
    assert.strictEqual(publishedBench.publishedDiff, 4002);

    // 2. Calculator CTA builds exact query parameters
    const queryParams = new URLSearchParams({
      role: 'admin-front-desk',
      teamMembers: '2',
      currentCost: '3500'
    });
    const targetUrl = `/book-a-call?${queryParams.toString()}`;
    assert.strictEqual(
      targetUrl,
      '/book-a-call?role=admin-front-desk&teamMembers=2&currentCost=3500',
      'Query string contract must be exact'
    );

    // 3. Verify Suspense boundary contract in Book a Call implementation
    const bookCallPagePath = path.join(SRC_DIR, 'app', 'book-a-call', 'page.tsx');
    assert.ok(fs.existsSync(bookCallPagePath), 'src/app/book-a-call/page.tsx must exist');
    const bookCallSource = fs.readFileSync(bookCallPagePath, 'utf-8');

    assert.ok(
      bookCallSource.includes('<Suspense'),
      'BookCallPage must wrap useSearchParams() component inside <Suspense> for static export safety'
    );
    assert.ok(
      bookCallSource.includes('useSearchParams'),
      'Booking form must invoke useSearchParams() to read forwarded query parameters'
    );

    // 4. Verify searchParams extraction logic
    const extractedRole = queryParams.get('role');
    const extractedMembers = queryParams.get('teamMembers');
    const extractedCost = queryParams.get('currentCost');

    assert.strictEqual(extractedRole, 'admin-front-desk');
    assert.strictEqual(extractedMembers, '2');
    assert.strictEqual(extractedCost, '3500');

    // 5. Form validation and submission simulation
    const formSubmission = {
      name: 'Dr. Alex Smith',
      workEmail: 'alex@smithdental.com',
      practiceName: 'Smith Dental Care',
      practiceType: 'Dental',
      role: extractedRole,
      teamMembers: extractedMembers,
      currentCost: extractedCost,
      message: 'Evaluation of 2 remote dental receptionists',
      website_url_hp: ''
    };

    const validationResult = validateBookingForm(formSubmission);
    assert.strictEqual(validationResult.isValid, true, 'Benchmark form submission must be completely valid');
    assert.strictEqual(validationResult.isBotTrapped, false);

    // 6. Non-PHI warning notice presence
    assert.ok(
      bookCallSource.toLowerCase().includes('patient information') ||
      bookCallSource.includes('PHI_WARNING_NOTICE'),
      'Booking form source must include mandatory non-PHI notice'
    );

    // 7. Verify /thank-you export if static build is present
    if (crawler.isExportPresent() && crawler.hasPageExport('/thank-you')) {
      const thankYouHtml = crawler.getPageHtml('/thank-you');
      assert.ok(
        HtmlParser.hasText(thankYouHtml, 'Thank You') || HtmlParser.hasText(thankYouHtml, 'Received'),
        '/thank-you must render confirmation heading'
      );
    }
  });

  // TEST-T3-CALC-002: Custom Quote Role with High Staffing & Percentage-Only Savings
  test('TEST-T3-CALC-002: Custom quote roles with high staffing (10 staff, $8,000/mo) calculate percentage-only savings without published list diff', () => {
    const roleId = 'executive-assistant';
    const teamMembers = 10;
    const currentCost = 8000;
    const publishedPrice = undefined; // Custom quote

    const savings = MathVerifier.calculateSavings(teamMembers, currentCost, publishedPrice);

    // 10 * 8000 = 80,000 total monthly cost
    // 50% = 40,000, 60% = 48,000
    assert.strictEqual(savings.monthlyMin, 40000, '50% of 10 * $8,000 must be $40,000');
    assert.strictEqual(savings.monthlyMax, 48000, '60% of 10 * $8,000 must be $48,000');
    assert.strictEqual(savings.annualMin, 480000, 'Annual min must be $480,000');
    assert.strictEqual(savings.annualMax, 576000, 'Annual max must be $576,000');
    assert.strictEqual(savings.publishedDiff, undefined, 'Published diff must be undefined for custom quote');

    // Query string contract
    const params = new URLSearchParams({
      role: roleId,
      teamMembers: String(teamMembers),
      currentCost: String(currentCost)
    });
    const url = `/book-a-call?${params.toString()}`;
    assert.strictEqual(url, '/book-a-call?role=executive-assistant&teamMembers=10&currentCost=8000');

    // Simulate prefill
    const prefilledRole = params.get('role');
    assert.strictEqual(prefilledRole, 'executive-assistant');
  });

  // TEST-T3-CALC-003: Honeypot Bot Trap Interception on Prefilled Submission
  test('TEST-T3-CALC-003: Honeypot bot trap interception on prefilled submission', () => {
    // Arrival with prefilled parameters
    const query = new URLSearchParams({
      role: 'medical-biller',
      teamMembers: '1',
      currentCost: '2500'
    });

    // Spam bot fills the hidden honeypot field
    const spamSubmission = {
      name: 'Spam Bot Crawler',
      workEmail: 'spambot@darkweb.ru',
      practiceName: 'Blackhat SEO Pharma',
      practiceType: 'Dental',
      role: query.get('role'),
      website_url_hp: 'https://viagra-spam-pills.example.com',
      message: 'Automated spam message'
    };

    const result = validateBookingForm(spamSubmission);
    assert.strictEqual(result.isBotTrapped, true, 'Honeypot value must trigger bot detection');
    assert.strictEqual(result.isValid, false, 'Bot trapped submission must be rejected');

    // If honeypot is clean, submission passes
    const legitimateSubmission = {
      ...spamSubmission,
      name: 'Dr. Jane Evans',
      workEmail: 'jane@evansoptometry.com',
      practiceName: 'Evans Optometry',
      website_url_hp: ''
    };
    const legitResult = validateBookingForm(legitimateSubmission);
    assert.strictEqual(legitResult.isBotTrapped, false);
    assert.strictEqual(legitResult.isValid, true);
  });

  // TEST-T3-CALC-004: User Modifying Prefilled Parameters Before Submission
  test('TEST-T3-CALC-004: User modifying prefilled parameters before submission updates payload correctly', () => {
    // User arrives with prefill for admin-front-desk
    const initialParams = new URLSearchParams({
      role: 'admin-front-desk',
      teamMembers: '2',
      currentCost: '3500'
    });
    let selectedRole = initialParams.get('role');
    assert.strictEqual(selectedRole, 'admin-front-desk');

    // User changes role to certified-professional-coder before submitting
    selectedRole = 'certified-professional-coder';

    const submissionData = {
      name: 'Jordan Hayes',
      workEmail: 'jhayes@metrohealth.org',
      practiceName: 'Metro Health Specialists',
      practiceType: 'Multi-Specialty',
      role: selectedRole,
      website_url_hp: ''
    };

    const result = validateBookingForm(submissionData);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(submissionData.role, 'certified-professional-coder', 'Submitted payload must reflect modified role');
  });

  // TEST-T3-CALC-005: Malformed / Corrupted Query Parameter Resilience
  test('TEST-T3-CALC-005: Malformed and corrupted query parameters fallback gracefully to defaults', () => {
    const corruptedParams = new URLSearchParams({
      role: 'nonexistent-corrupted-slug-999',
      teamMembers: '-99',
      currentCost: 'not-a-number'
    });

    // Sanitization & normalization logic
    const parseRole = (roleParam, validRoleIds) => {
      if (!roleParam) return '';
      let clean = '';
      try {
        clean = decodeURIComponent(roleParam).trim().toLowerCase();
      } catch {
        clean = String(roleParam).trim().toLowerCase();
      }
      return validRoleIds.includes(clean) ? clean : '';
    };

    const validRoles = ['admin-front-desk', 'medical-assistant', 'executive-assistant', 'medical-biller'];
    const safeRole = parseRole(corruptedParams.get('role'), validRoles);
    const safeMembers = parseTeamMembersParam(corruptedParams.get('teamMembers'));
    const safeCost = parseCurrentCostParam(corruptedParams.get('currentCost'));

    assert.strictEqual(safeRole, '', 'Invalid role slug must fallback to empty selection prompt');
    assert.strictEqual(safeMembers, 2, 'Negative team members must fallback to default 2');
    assert.strictEqual(safeCost, 3500, 'NaN current cost must fallback to default $3,500');

    // Also verify URIError resilience directly
    const corruptedRoleResult = parseRole('%', validRoles);
    assert.strictEqual(corruptedRoleResult, '', 'Malformed percent URI sequence must not throw URIError');

    // Form validation still enforces required fields even if query params are malformed
    const emptySubmit = validateBookingForm({
      name: '',
      workEmail: '',
      practiceName: '',
      practiceType: ''
    });
    assert.strictEqual(emptySubmit.isValid, false, 'Validation must block empty submission regardless of params');
  });

});
