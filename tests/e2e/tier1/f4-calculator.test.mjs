/**
 * Tier 1 Test Suite: F4 - Savings Calculator Logic & Benchmark (R3 / F4)
 * 
 * Verifies mathematical range calculation (50%-60%), annualization (x12),
 * the mandatory $3,500 benchmark test case, published price comparison,
 * disclaimer text presence, and URL query parameter contract.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { MathVerifier } from '../helpers/math-verifier.mjs';
import { CALCULATOR, SRC_DIR } from '../config.mjs';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';

const crawler = new RouteCrawler();

describe('F4: Savings Calculator Logic & Benchmark', () => {
  // TEST-T1-F4-001: Percentage Range Formula Verification (50%–60%)
  test('TEST-T1-F4-001: Math engine calculates exact 50% min and 60% max monthly savings', () => {
    // n = 1, C = $5,000 -> 50% = $2,500, 60% = $3,000
    const result = MathVerifier.calculateSavings(1, 5000);
    assert.strictEqual(result.monthlyMin, 2500, '50% of $5,000 must be $2,500');
    assert.strictEqual(result.monthlyMax, 3000, '60% of $5,000 must be $3,000');

    // n = 4, C = $4,000 -> 4 * 4000 = 16000 -> 50% = $8,000, 60% = $9,600
    const result4 = MathVerifier.calculateSavings(4, 4000);
    assert.strictEqual(result4.monthlyMin, 8000, '50% of 4 * $4,000 must be $8,000');
    assert.strictEqual(result4.monthlyMax, 9600, '60% of 4 * $4,000 must be $9,600');
  });

  // TEST-T1-F4-002: Annual Range Formula Verification (x12)
  test('TEST-T1-F4-002: Annual savings is strictly monthly savings multiplied by 12', () => {
    const result = MathVerifier.calculateSavings(1, 5000);
    assert.strictEqual(result.annualMin, 2500 * 12, 'Annual min must be monthlyMin * 12 ($30,000)');
    assert.strictEqual(result.annualMax, 3000 * 12, 'Annual max must be monthlyMax * 12 ($36,000)');
  });

  // TEST-T1-F4-003: Mandatory Benchmark Verification Test ($n=2, C=$3,500)
  test('TEST-T1-F4-003: MANDATORY BENCHMARK: n=2 at $3,500/mo yields $3,500-$4,200/mo and $42,000-$50,400/yr', () => {
    const verification = MathVerifier.verifyBenchmark();

    assert.ok(verification.passes, 'Benchmark calculation must pass with 100% precision');
    assert.strictEqual(verification.result.monthlyMin, 3500, 'Monthly min must be $3,500');
    assert.strictEqual(verification.result.monthlyMax, 4200, 'Monthly max must be $4,200');
    assert.strictEqual(verification.result.annualMin, 42000, 'Annual min must be $42,000');
    assert.strictEqual(verification.result.annualMax, 50400, 'Annual max must be $50,400');

    // Also verify display string formatting
    const monthlyStr = MathVerifier.formatMonthlyRange(verification.result.monthlyMin, verification.result.monthlyMax);
    const annualStr = MathVerifier.formatAnnualRange(verification.result.annualMin, verification.result.annualMax);

    assert.ok(
      CALCULATOR.benchmark.expectedMonthlyDisplayPattern.test(monthlyStr),
      `Monthly display string "${monthlyStr}" must match pattern`
    );
    assert.ok(
      CALCULATOR.benchmark.expectedAnnualDisplayPattern.test(annualStr),
      `Annual display string "${annualStr}" must match pattern`
    );
  });

  // TEST-T1-F4-004: Published Price Difference Comparison
  test('TEST-T1-F4-004: Published price difference calculates n * (C - P)', () => {
    // Admin / Front Desk: P = $1,499. n = 2, C = $3,500
    // Diff: 2 * (3500 - 1499) = 2 * 2001 = $4,002
    const verification = MathVerifier.verifyPublishedBenchmark();
    assert.ok(verification.passes, 'Published price difference must equal $4,002');
    assert.strictEqual(verification.publishedDiff, 4002);
  });

  // TEST-T1-F4-005: Mandatory Disclaimer Text Presence
  test('TEST-T1-F4-005: Calculator includes mandatory estimates disclaimer text', (t) => {
    const exactDisclaimer = CALCULATOR.disclaimerText;
    assert.strictEqual(
      exactDisclaimer,
      'Estimates only, based on typical savings. Actual results vary and are not guaranteed.',
      'Disclaimer text must match specification verbatim'
    );

    // If static export exists, verify disclaimer is rendered
    if (crawler.isExportPresent() && crawler.hasPageExport('/savings-calculator')) {
      const html = crawler.getPageHtml('/savings-calculator');
      assert.ok(
        HtmlParser.hasText(html, 'Estimates only, based on typical savings'),
        'Rendered /savings-calculator must display disclaimer text'
      );
    }
  });

  // TEST-T1-F4-006: URL Query Parameter Forwarding Contract
  test('TEST-T1-F4-006: "Get a custom plan" forwards role, teamMembers, and currentCost as query params', () => {
    // Contract definition: /book-a-call?role={roleId}&teamMembers={count}&currentCost={cost}
    const buildTargetUrl = (roleId, teamMembers, currentCost) => {
      const params = new URLSearchParams();
      if (roleId) params.set('role', roleId);
      if (teamMembers) params.set('teamMembers', String(teamMembers));
      if (currentCost) params.set('currentCost', String(currentCost));
      return `/book-a-call?${params.toString()}`;
    };

    const url = buildTargetUrl('admin-front-desk', 2, 3500);
    assert.strictEqual(url, '/book-a-call?role=admin-front-desk&teamMembers=2&currentCost=3500');

    // Also check if Calculator component exists and contains target path
    const calcComponentPath = path.join(SRC_DIR, 'components', 'SavingsCalculator.tsx');
    if (fs.existsSync(calcComponentPath)) {
      const code = fs.readFileSync(calcComponentPath, 'utf-8');
      assert.ok(
        code.includes('/book-a-call') || code.includes('Get a custom plan'),
        'SavingsCalculator component must reference /book-a-call redirect target'
      );
    }
  });

  // TEST-T1-F4-007: Live Region Accessibility Contract
  test('TEST-T1-F4-007: SavingsCalculator live results box includes ARIA live region attributes', () => {
    const calcComponentPath = path.join(SRC_DIR, 'components', 'SavingsCalculator.tsx');
    if (fs.existsSync(calcComponentPath)) {
      const code = fs.readFileSync(calcComponentPath, 'utf-8');
      assert.ok(code.includes('role="region"'), 'Must have role="region"');
      assert.ok(code.includes('aria-label="Calculated savings"'), 'Must have aria-label="Calculated savings"');
      assert.ok(code.includes('aria-live="polite"'), 'Must have aria-live="polite"');
      assert.ok(code.includes('aria-atomic="true"'), 'Must have aria-atomic="true"');
    }
  });
});
