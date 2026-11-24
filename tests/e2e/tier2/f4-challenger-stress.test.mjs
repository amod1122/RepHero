/**
 * Challenger Stress Harness: Milestone 3 Calculator & Interactive Logic Invariants
 * File: tests/e2e/tier2/f4-challenger-stress.test.mjs
 * 
 * Verifies:
 * 1. $3,500 Mandatory Benchmark and 50%-60% / x12 mathematical invariants
 * 2. Boundary conditions: zero, negative, fractional, infinite, NaN inputs
 * 3. Custom quote logic and list price suppression when C < P
 * 4. Live results box ARIA attributes (role="region", aria-live="polite", aria-label, aria-atomic)
 *    in both source code and built static export
 * 5. URL query parameters and malformed URI resilience
 * 6. RFC 5322 email validation local-part rules
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  CALCULATOR_CONFIG,
  calculateSavings,
  formatCurrency,
  formatMonthlyRange,
  formatAnnualRange,
  buildCalculatorForwardUrl,
} from '../../../src/content/calculator.ts';
import { SERVICE_ROLES } from '../../../src/content/services.ts';
import {
  validateWorkEmail,
  validateBookingForm,
  parseTeamMembersParam,
  parseCurrentCostParam,
} from '../../../src/lib/validation.ts';

describe('CHALLENGER: Calculator Math Engine Invariants', () => {
  // Test 1: Mandatory Benchmark Invariant ($n=2, C=$3,500)
  test('BENCHMARK: n=2, C=$3,500 yields strictly $3,500-$4,200/mo and $42,000-$50,400/yr', () => {
    const calc = calculateSavings(2, 3500);

    // Exact monthly bounds
    assert.strictEqual(calc.monthlyMin, 3500, 'Monthly min must equal 2 * 3500 * 0.50 = 3500');
    assert.strictEqual(calc.monthlyMax, 4200, 'Monthly max must equal 2 * 3500 * 0.60 = 4200');

    // Exact annual bounds (x12)
    assert.strictEqual(calc.annualMin, 42000, 'Annual min must equal 3500 * 12 = 42000');
    assert.strictEqual(calc.annualMax, 50400, 'Annual max must equal 4200 * 12 = 50400');

    // Display string formatting
    const monthlyStr = formatMonthlyRange(calc.monthlyMin, calc.monthlyMax);
    const annualStr = formatAnnualRange(calc.annualMin, calc.annualMax);
    assert.strictEqual(monthlyStr, '$3,500 – $4,200/mo');
    assert.strictEqual(annualStr, '$42,000 – $50,400/yr');

    // Published benchmark comparison for Admin / Front Desk ($1,499)
    const adminRole = SERVICE_ROLES.find((r) => r.id === 'admin-front-desk');
    assert.ok(adminRole, 'admin-front-desk role must exist');
    assert.strictEqual(adminRole.publishedMonthlyPrice, 1499);

    const calcWithAdmin = calculateSavings(2, 3500, adminRole.publishedMonthlyPrice);
    assert.strictEqual(calcWithAdmin.isCustomQuote, false);
    // 2 * (3500 - 1499) = 2 * 2001 = 4002
    assert.strictEqual(calcWithAdmin.publishedDiff, 4002);
    assert.strictEqual(formatCurrency(calcWithAdmin.publishedDiff), '$4,002');
  });

  // Test 2: Invariant Matrix over Diverse Range (50%-60% & x12)
  test('INVARIANTS: Matrix of inputs strictly obeys min=round(0.50*n*c), max=round(0.60*n*c), annual=12*monthly', () => {
    const testCases = [
      { n: 1, c: 1000 },
      { n: 1, c: 3500 },
      { n: 2, c: 2000 },
      { n: 3, c: 4500 },
      { n: 5, c: 7250 },
      { n: 10, c: 12000 },
      { n: 20, c: 15000 },
      { n: 7, c: 3333 },
      { n: 13, c: 4777 },
    ];

    for (const { n, c } of testCases) {
      const res = calculateSavings(n, c);
      const expectedMin = Math.round(n * c * 0.50);
      const expectedMax = Math.round(n * c * 0.60);

      assert.strictEqual(res.monthlyMin, expectedMin, `monthlyMin mismatch for n=${n}, c=${c}`);
      assert.strictEqual(res.monthlyMax, expectedMax, `monthlyMax mismatch for n=${n}, c=${c}`);
      assert.strictEqual(res.annualMin, expectedMin * 12, `annualMin mismatch for n=${n}, c=${c}`);
      assert.strictEqual(res.annualMax, expectedMax * 12, `annualMax mismatch for n=${n}, c=${c}`);
      assert.ok(res.monthlyMin <= res.monthlyMax, 'monthlyMin must be <= monthlyMax');
      assert.ok(res.annualMin <= res.annualMax, 'annualMin must be <= annualMax');
    }
  });

  // Test 3: Custom Quote Roles vs Published Price Roles
  test('CUSTOM QUOTES: Custom quote roles return isCustomQuote=true and publishedDiff=undefined', () => {
    const customRoles = SERVICE_ROLES.filter((r) => r.publishedMonthlyPrice === undefined);
    assert.ok(customRoles.length >= 2, 'There must be custom quote roles defined in SERVICE_ROLES');

    for (const role of customRoles) {
      const calc = calculateSavings(2, 3500, role.publishedMonthlyPrice);
      assert.strictEqual(calc.isCustomQuote, true, `${role.id} must be flagged as custom quote`);
      assert.strictEqual(calc.publishedDiff, undefined, `${role.id} must have undefined publishedDiff`);
      assert.strictEqual(calc.monthlyMin, 3500);
      assert.strictEqual(calc.monthlyMax, 4200);
    }

    const publishedRoles = SERVICE_ROLES.filter((r) => typeof r.publishedMonthlyPrice === 'number');
    assert.ok(publishedRoles.length >= 3, 'There must be published price roles');

    for (const role of publishedRoles) {
      const calc = calculateSavings(2, 3500, role.publishedMonthlyPrice);
      assert.strictEqual(calc.isCustomQuote, false, `${role.id} must not be custom quote`);
      assert.strictEqual(
        calc.publishedDiff,
        Math.round(2 * (3500 - role.publishedMonthlyPrice)),
        `${role.id} publishedDiff mismatch`
      );
    }
  });

  // Test 4: Cost Lower than Published Price (C < P)
  test('SUPPRESSION: C < P yields non-positive publishedDiff that UI suppresses', () => {
    // Current cost $1,000, Medical Assistant published price $1,999
    const calc = calculateSavings(1, 1000, 1999);
    assert.strictEqual(calc.monthlyMin, 500);
    assert.strictEqual(calc.monthlyMax, 600);
    assert.strictEqual(calc.publishedDiff, -999);
    // UI check: publishedDiff > 0 evaluates to false
    assert.ok(!(calc.publishedDiff !== undefined && calc.publishedDiff > 0));
  });

  // Test 5: Boundary & Extreme Inputs
  test('BOUNDARIES: Zero, negative, NaN, null, and non-numeric inputs cleanly return 0s', () => {
    const degenerateInputs = [
      [0, 3500],
      [2, 0],
      [0, 0],
      [-1, 3500],
      [2, -3500],
      [-5, -1000],
      [NaN, 3500],
      [2, NaN],
      [null, 3500],
      [undefined, undefined],
      ['invalid', 3500],
      [2, 'invalid'],
    ];

    for (const [members, cost] of degenerateInputs) {
      const calc = calculateSavings(members, cost);
      assert.strictEqual(calc.monthlyMin, 0, `Failed for n=${members}, c=${cost}`);
      assert.strictEqual(calc.monthlyMax, 0, `Failed for n=${members}, c=${cost}`);
      assert.strictEqual(calc.annualMin, 0, `Failed for n=${members}, c=${cost}`);
      assert.strictEqual(calc.annualMax, 0, `Failed for n=${members}, c=${cost}`);
      assert.strictEqual(calc.publishedDiff, undefined, `Failed for n=${members}, c=${cost}`);

      const formatted = formatMonthlyRange(calc.monthlyMin, calc.monthlyMax);
      assert.strictEqual(formatted, '$0 – $0/mo');
    }
  });

  // Test 6: Safe Integer and Currency Formatting for Large Numbers
  test('SCALE: Astronomical inputs format cleanly with commas without overflow', () => {
    const calc = calculateSavings(50, 50000);
    // 50 * 50000 = 2,500,000
    // min = 1,250,000; max = 1,500,000
    assert.strictEqual(calc.monthlyMin, 1250000);
    assert.strictEqual(calc.monthlyMax, 1500000);
    assert.strictEqual(calc.annualMin, 15000000);
    assert.strictEqual(calc.annualMax, 18000000);

    const monthlyStr = formatMonthlyRange(calc.monthlyMin, calc.monthlyMax);
    const annualStr = formatAnnualRange(calc.annualMin, calc.annualMax);
    assert.strictEqual(monthlyStr, '$1,250,000 – $1,500,000/mo');
    assert.strictEqual(annualStr, '$15,000,000 – $18,000,000/yr');
  });
});

describe('CHALLENGER: Accessibility & ARIA Live Region Verification', () => {
  // Test 7: Source Code Attributes
  test('ARIA SOURCE: SavingsCalculator component includes role="region", aria-live="polite", aria-label, aria-atomic', () => {
    const filePath = path.resolve(process.cwd(), 'src/components/SavingsCalculator.tsx');
    assert.ok(fs.existsSync(filePath), 'SavingsCalculator.tsx must exist');
    const source = fs.readFileSync(filePath, 'utf-8');

    assert.ok(source.includes('role="region"'), 'Must specify role="region"');
    assert.ok(source.includes('aria-label="Calculated savings"'), 'Must specify aria-label="Calculated savings"');
    assert.ok(source.includes('aria-live="polite"'), 'Must specify aria-live="polite"');
    assert.ok(source.includes('aria-atomic="true"'), 'Must specify aria-atomic="true"');

    // Confirm that these attributes are placed on the live results container div
    const resultsBoxMatch = source.match(/role="region"[\s\S]*?aria-label="Calculated savings"[\s\S]*?aria-live="polite"[\s\S]*?aria-atomic="true"/);
    assert.ok(resultsBoxMatch, 'Live savings container must declare all 4 ARIA live region attributes together');
  });

  // Test 8: Built Static Export HTML
  test('ARIA STATIC EXPORT: Built page out/savings-calculator/index.html includes all live region attributes', () => {
    const exportPath = path.resolve(process.cwd(), 'out/savings-calculator/index.html');
    if (fs.existsSync(exportPath)) {
      const html = fs.readFileSync(exportPath, 'utf-8');
      assert.ok(html.includes('role="region"'), 'Static HTML must include role="region"');
      assert.ok(html.includes('aria-label="Calculated savings"'), 'Static HTML must include aria-label="Calculated savings"');
      assert.ok(html.includes('aria-live="polite"'), 'Static HTML must include aria-live="polite"');
      assert.ok(html.includes('aria-atomic="true"'), 'Static HTML must include aria-atomic="true"');
    }
  });
});

describe('CHALLENGER: URL Parameter Sanitization & URIError Resilience', () => {
  // Test 9: buildCalculatorForwardUrl Contract
  test('FORWARD URL: Constructs standard query string /book-a-call?role=...&teamMembers=...&currentCost=...', () => {
    const url = buildCalculatorForwardUrl('admin-front-desk', 2, 3500);
    assert.strictEqual(url, '/book-a-call?role=admin-front-desk&teamMembers=2&currentCost=3500');

    const customUrl = buildCalculatorForwardUrl('executive-assistant', 5, 8000);
    assert.strictEqual(customUrl, '/book-a-call?role=executive-assistant&teamMembers=5&currentCost=8000');
  });

  // Test 10: Malformed Percent URI Decoding Resilience
  test('MALFORMED URI: Malformed URI strings in BookCallForm and resolveRoleSelection do NOT throw URIError', () => {
    const bookCallFormPath = path.resolve(process.cwd(), 'src/components/BookCallForm.tsx');
    const source = fs.readFileSync(bookCallFormPath, 'utf-8');

    // Verify BookCallForm wraps decodeURIComponent in try-catch
    assert.ok(source.includes('try {'), 'resolveRoleSelection must contain try-catch block');
    assert.ok(source.includes('decodeURIComponent(roleParam)'), 'Must call decodeURIComponent on roleParam');
    assert.ok(source.includes('catch {'), 'Must catch URIError');

    // Emulate resolveRoleSelection exactly as in BookCallForm.tsx
    const resolveRole = (roleParam) => {
      if (!roleParam) return "";
      let cleanParam = "";
      try {
        cleanParam = decodeURIComponent(roleParam).trim().toLowerCase();
      } catch {
        cleanParam = String(roleParam).trim().toLowerCase();
      }

      const byId = SERVICE_ROLES.find((r) => r.id.toLowerCase() === cleanParam);
      if (byId) return byId.id;

      const byName = SERVICE_ROLES.find((r) => r.name.toLowerCase() === cleanParam);
      if (byName) return byName.id;

      const byFuzzy = SERVICE_ROLES.find(
        (r) =>
          cleanParam.includes(r.id) || r.name.toLowerCase().includes(cleanParam)
      );
      return byFuzzy ? byFuzzy.id : "";
    };

    const malformedCases = ['%', '%E0%A4%A', '%%20', '%ZZ', '%C3%'];
    for (const badUri of malformedCases) {
      assert.doesNotThrow(() => {
        const resolved = resolveRole(badUri);
        assert.strictEqual(typeof resolved, 'string');
      }, `resolveRoleSelection must not throw URIError on ${badUri}`);
    }
  });

  // Test 11: Team Members and Cost Sanitization Fallbacks
  test('PARAM PARSER: parseTeamMembersParam & parseCurrentCostParam bounds and fallbacks', () => {
    // Team members: valid 1-20, default 2
    assert.strictEqual(parseTeamMembersParam('1'), 1);
    assert.strictEqual(parseTeamMembersParam('2'), 2);
    assert.strictEqual(parseTeamMembersParam('20'), 20);
    assert.strictEqual(parseTeamMembersParam('0'), 2, '0 members falls back to default 2');
    assert.strictEqual(parseTeamMembersParam('-99'), 2, 'Negative members falls back to default 2');
    assert.strictEqual(parseTeamMembersParam('21'), 2, '>20 members falls back to default 2');
    assert.strictEqual(parseTeamMembersParam('abc'), 2, 'Non-numeric falls back to default 2');
    assert.strictEqual(parseTeamMembersParam(null), 2, 'null falls back to default 2');
    assert.strictEqual(parseTeamMembersParam(undefined), 2, 'undefined falls back to default 2');

    // Current cost: valid 1000-20000, default 3500
    assert.strictEqual(parseCurrentCostParam('1000'), 1000);
    assert.strictEqual(parseCurrentCostParam('3500'), 3500);
    assert.strictEqual(parseCurrentCostParam('20000'), 20000);
    assert.strictEqual(parseCurrentCostParam('999'), 3500, '<1000 cost falls back to default 3500');
    assert.strictEqual(parseCurrentCostParam('-5000'), 3500, 'Negative cost falls back to default 3500');
    assert.strictEqual(parseCurrentCostParam('20001'), 3500, '>20000 cost falls back to default 3500');
    assert.strictEqual(parseCurrentCostParam('xyz'), 3500, 'Non-numeric falls back to default 3500');
    assert.strictEqual(parseCurrentCostParam(null), 3500, 'null falls back to default 3500');
    assert.strictEqual(parseCurrentCostParam(undefined), 3500, 'undefined falls back to default 3500');
  });
});

describe('CHALLENGER: RFC 5322 Email Validation Hardening', () => {
  // Test 12: RFC 5322 Local-Part and Edge Cases
  test('EMAIL RFC 5322: Strict dot-atom and local-part length rules in validation.ts', () => {
    // Valid cases
    assert.strictEqual(validateWorkEmail('doctor@clinic.com'), true, 'Must accept doctor@clinic.com');
    assert.strictEqual(validateWorkEmail('first.last@healthcare.org'), true, 'Must accept first.last@healthcare.org');
    assert.strictEqual(validateWorkEmail('dr.smith+staff@domain.co.uk'), true, 'Must accept + tags');
    assert.strictEqual(validateWorkEmail('user_name@sub.domain.com'), true, 'Must accept valid underscores');

    // 64 char local part (max valid RFC 5321 length)
    const valid64 = `${'a'.repeat(64)}@domain.com`;
    assert.strictEqual(validateWorkEmail(valid64), true, 'Must accept 64-char local part');

    // 65 char local part (strictly invalid RFC 5321 length)
    const invalid65 = `${'a'.repeat(65)}@domain.com`;
    assert.strictEqual(validateWorkEmail(invalid65), false, 'Must reject 65-char local part');

    // RFC 5322 dot violations
    assert.strictEqual(validateWorkEmail('.user@domain.com'), false, 'Must reject leading dot');
    assert.strictEqual(validateWorkEmail('user.@domain.com'), false, 'Must reject trailing dot');
    assert.strictEqual(validateWorkEmail('user..name@domain.com'), false, 'Must reject consecutive dots');

    // General invalid emails
    assert.strictEqual(validateWorkEmail(''), false, 'Must reject empty string');
    assert.strictEqual(validateWorkEmail('   '), false, 'Must reject whitespace');
    assert.strictEqual(validateWorkEmail('not-an-email'), false, 'Must reject non-email');
    assert.strictEqual(validateWorkEmail('user@'), false, 'Must reject missing domain');
    assert.strictEqual(validateWorkEmail('@domain.com'), false, 'Must reject missing local part');
    assert.strictEqual(validateWorkEmail('user@domain'), false, 'Must reject domain without TLD');
    assert.strictEqual(validateWorkEmail('user@@domain.com'), false, 'Must reject multiple @ signs');
    assert.strictEqual(validateWorkEmail(null), false, 'Must reject null');
    assert.strictEqual(validateWorkEmail(undefined), false, 'Must reject undefined');
    assert.strictEqual(validateWorkEmail(12345), false, 'Must reject numbers');

    // Confirm that BookCallForm.tsx has identical validation logic
    const bookCallFormPath = path.resolve(process.cwd(), 'src/components/BookCallForm.tsx');
    const source = fs.readFileSync(bookCallFormPath, 'utf-8');
    assert.ok(source.includes('localPart.length > 64'), 'BookCallForm must enforce 64 char local part limit');
    assert.ok(source.includes('localPart.startsWith(".")') || source.includes("localPart.startsWith('.')"), 'BookCallForm must reject leading dot');
    assert.ok(source.includes('localPart.endsWith(".")') || source.includes("localPart.endsWith('.')"), 'BookCallForm must reject trailing dot');
    assert.ok(source.includes('localPart.includes("..")') || source.includes("localPart.includes('..')"), 'BookCallForm must reject consecutive dots');
  });
});
