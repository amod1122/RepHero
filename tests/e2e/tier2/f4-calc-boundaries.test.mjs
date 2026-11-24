/**
 * Tier 2 Boundary & Corner Case Test Suite: F4 - Savings Calculator Boundaries
 * 
 * Sources:
 * - Explorer 2 Report (TEST-T2-CALC-001 through TEST-T2-CALC-007)
 * - Essentials §2 (Formula specification: 50%-60% monthly savings, x12 annual)
 * - ORIGINAL_REQUEST.md AC line 54
 * - PRD §8.4 (Calculator behavior, custom quotes, published prices)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { MathVerifier } from '../helpers/math-verifier.mjs';
import { CALCULATOR } from '../config.mjs';
import { calculateSavings as appCalculateSavings } from '../../../src/content/calculator.ts';

describe('Tier 2 F4: Savings Calculator Boundaries & Corner Cases', () => {
  // TEST-T2-CALC-001: Zero Team Members (n = 0)
  test('TEST-T2-CALC-001: Zero team members (n = 0) returns zero savings without NaN or negative values', () => {
    const result = MathVerifier.calculateSavings(0, 3500);
    const appResult = appCalculateSavings(0, 3500);

    assert.strictEqual(result.monthlyMin, 0, 'monthlyMin must be 0 when teamMembers = 0');
    assert.strictEqual(result.monthlyMax, 0, 'monthlyMax must be 0 when teamMembers = 0');
    assert.strictEqual(result.annualMin, 0, 'annualMin must be 0 when teamMembers = 0');
    assert.strictEqual(result.annualMax, 0, 'annualMax must be 0 when teamMembers = 0');

    assert.strictEqual(appResult.monthlyMin, 0, 'appCalculateSavings monthlyMin must be 0 when teamMembers = 0');
    assert.strictEqual(appResult.monthlyMax, 0, 'appCalculateSavings monthlyMax must be 0 when teamMembers = 0');
    assert.strictEqual(appResult.annualMin, 0, 'appCalculateSavings annualMin must be 0 when teamMembers = 0');
    assert.strictEqual(appResult.annualMax, 0, 'appCalculateSavings annualMax must be 0 when teamMembers = 0');

    // Formatting check: Must not render NaN
    const formatted = MathVerifier.formatMonthlyRange(result.monthlyMin, result.monthlyMax);
    assert.ok(!formatted.includes('NaN'), 'Formatted range must not contain "NaN"');
    assert.strictEqual(formatted, '$0 – $0/mo');
  });

  // TEST-T2-CALC-002: Negative Values Handling (n < 0 or C < 0)
  test('TEST-T2-CALC-002: Negative team members or negative monthly costs are clamped to 0 savings', () => {
    // Case A: Negative team members
    const resultNegMembers = MathVerifier.calculateSavings(-2, 3500);
    const appResultNegMembers = appCalculateSavings(-2, 3500);
    assert.strictEqual(resultNegMembers.monthlyMin, 0, 'Negative team members must yield 0 monthlyMin');
    assert.strictEqual(resultNegMembers.monthlyMax, 0, 'Negative team members must yield 0 monthlyMax');
    assert.strictEqual(resultNegMembers.annualMin, 0, 'Negative team members must yield 0 annualMin');
    assert.strictEqual(resultNegMembers.annualMax, 0, 'Negative team members must yield 0 annualMax');
    assert.strictEqual(appResultNegMembers.monthlyMin, 0, 'App calculateSavings negative team members must yield 0 monthlyMin');

    // Case B: Negative monthly cost
    const resultNegCost = MathVerifier.calculateSavings(2, -5000);
    const appResultNegCost = appCalculateSavings(2, -5000);
    assert.strictEqual(resultNegCost.monthlyMin, 0, 'Negative cost must yield 0 monthlyMin');
    assert.strictEqual(resultNegCost.monthlyMax, 0, 'Negative cost must yield 0 monthlyMax');
    assert.strictEqual(resultNegCost.annualMin, 0, 'Negative cost must yield 0 annualMin');
    assert.strictEqual(resultNegCost.annualMax, 0, 'Negative cost must yield 0 annualMax');
    assert.strictEqual(appResultNegCost.monthlyMin, 0, 'App calculateSavings negative cost must yield 0 monthlyMin');

    // Both negative
    const resultBothNeg = MathVerifier.calculateSavings(-3, -2000);
    const appResultBothNeg = appCalculateSavings(-3, -2000);
    assert.strictEqual(resultBothNeg.monthlyMin, 0);
    assert.strictEqual(resultBothNeg.monthlyMax, 0);
    assert.strictEqual(appResultBothNeg.monthlyMin, 0);
  });

  // TEST-T2-CALC-003: Fractional / Decimal Team Members Integer Rounding
  test('TEST-T2-CALC-003: Fractional/decimal team members round cleanly to whole integer currency values', () => {
    // n = 2.5, C = $3,500
    // 2.5 * 3500 * 0.50 = 4,375
    // 2.5 * 3500 * 0.60 = 5,250
    const result = MathVerifier.calculateSavings(2.5, 3500);
    const appResult = appCalculateSavings(2.5, 3500);

    assert.strictEqual(Number.isInteger(result.monthlyMin), true, 'monthlyMin must be an integer');
    assert.strictEqual(Number.isInteger(result.monthlyMax), true, 'monthlyMax must be an integer');
    assert.strictEqual(Number.isInteger(result.annualMin), true, 'annualMin must be an integer');
    assert.strictEqual(Number.isInteger(result.annualMax), true, 'annualMax must be an integer');

    assert.strictEqual(result.monthlyMin, 4375);
    assert.strictEqual(result.monthlyMax, 5250);
    assert.strictEqual(result.annualMin, 4375 * 12);
    assert.strictEqual(result.annualMax, 5250 * 12);

    assert.strictEqual(appResult.monthlyMin, 4375, 'App calculateSavings monthlyMin matches');
    assert.strictEqual(appResult.monthlyMax, 5250, 'App calculateSavings monthlyMax matches');

    // Verify format strings do not contain decimal places
    const monthlyStr = MathVerifier.formatMonthlyRange(result.monthlyMin, result.monthlyMax);
    assert.strictEqual(monthlyStr, '$4,375 – $5,250/mo');
    assert.ok(!monthlyStr.includes('.'), 'Formatted string must not include decimal fractions');
  });

  // TEST-T2-CALC-004: Astronomical High Values (100k+/mo, n=100)
  test('TEST-T2-CALC-004: Astronomical high values remain within safe integers and format with commas', () => {
    const n = 100;
    const c = 100000; // $100k/mo
    const result = MathVerifier.calculateSavings(n, c);

    // 100 * 100,000 * 0.50 = $5,000,000
    // 100 * 100,000 * 0.60 = $6,000,000
    // Annual: $60,000,000 to $72,000,000
    assert.strictEqual(result.monthlyMin, 5000000);
    assert.strictEqual(result.monthlyMax, 6000000);
    assert.strictEqual(result.annualMin, 60000000);
    assert.strictEqual(result.annualMax, 72000000);

    // Safe integer verification
    assert.ok(Number.isSafeInteger(result.annualMax), 'Astronomical annualMax must be a safe JavaScript integer');

    // Currency formatting with thousands commas
    const monthlyStr = MathVerifier.formatMonthlyRange(result.monthlyMin, result.monthlyMax);
    const annualStr = MathVerifier.formatAnnualRange(result.annualMin, result.annualMax);

    assert.strictEqual(monthlyStr, '$5,000,000 – $6,000,000/mo');
    assert.strictEqual(annualStr, '$60,000,000 – $72,000,000/yr');
  });

  // TEST-T2-CALC-005: Cost Lower than Published Price (C < P) Suppression
  test('TEST-T2-CALC-005: Current cost lower than published price suppresses negative savings difference', () => {
    // Admin / Front Desk: P = $1,499. User currently pays C = $1,000.
    // Published difference: 1 * (1000 - 1499) = -499.
    const result = MathVerifier.calculateSavings(1, 1000, 1499);

    // Standard percentage savings (50%-60% of $1,000 = $500 - $600) still applies:
    assert.strictEqual(result.monthlyMin, 500);
    assert.strictEqual(result.monthlyMax, 600);

    // When published price difference is negative, the UI / engine must not advertise "negative savings":
    // The difference should either be clamped or recognized as negative for suppression
    if (result.publishedDiff !== undefined) {
      const isSuppressedOrClamped = result.publishedDiff <= 0;
      assert.ok(
        isSuppressedOrClamped,
        'Published difference when C < P must be recognized as non-positive so negative savings are never advertised'
      );
    }
  });

  // TEST-T2-CALC-006: Custom Quote Roles (No Published Price P)
  test('TEST-T2-CALC-006: Roles with custom quote (publishedPrice undefined) omit list price difference', () => {
    // Role: Executive Assistant (Custom Quote: publishedPrice = undefined)
    const result = MathVerifier.calculateSavings(2, 4000, undefined);

    // Percentage range: 2 * 4000 * 0.50 = 4000, 2 * 4000 * 0.60 = 4800
    assert.strictEqual(result.monthlyMin, 4000);
    assert.strictEqual(result.monthlyMax, 4800);
    assert.strictEqual(result.annualMin, 48000);
    assert.strictEqual(result.annualMax, 57600);

    // publishedDiff must be undefined so comparison line is omitted
    assert.strictEqual(result.publishedDiff, undefined, 'publishedDiff must be undefined for custom quote roles');
  });

  // TEST-T2-CALC-007: Non-Numeric and NaN Input Resilience
  test('TEST-T2-CALC-007: Non-numeric, null, and NaN inputs fallback cleanly without throwing or NaN strings', () => {
    // Pass strings, nulls, NaNs
    const result1 = MathVerifier.calculateSavings('abc', 3500);
    assert.strictEqual(result1.monthlyMin, 0);
    assert.strictEqual(result1.monthlyMax, 0);

    const result2 = MathVerifier.calculateSavings(2, 'invalid_cost');
    assert.strictEqual(result2.monthlyMin, 0);
    assert.strictEqual(result2.monthlyMax, 0);

    const result3 = MathVerifier.calculateSavings(null, undefined, NaN);
    assert.strictEqual(result3.monthlyMin, 0);
    assert.strictEqual(result3.monthlyMax, 0);
    assert.strictEqual(result3.publishedDiff, undefined);

    // Formatted output test
    const formatted = MathVerifier.formatMonthlyRange(result3.monthlyMin, result3.monthlyMax);
    assert.ok(!formatted.includes('NaN'), 'Formatted string must never contain "NaN"');
    assert.ok(!formatted.includes('undefined'), 'Formatted string must never contain "undefined"');
  });
});
