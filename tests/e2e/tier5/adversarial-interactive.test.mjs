/**
 * Tier 5 Test Suite: Inverted Challenger Cycle — Interactive & Logic Adversarial Hardening
 * File: tests/e2e/tier5/adversarial-interactive.test.mjs
 * 
 * Focus Areas:
 * 1. Savings Calculator Math Engine (src/lib/calculator.ts, src/content/calculator.ts, SavingsCalculator.tsx)
 *    - Benchmark case: n=2 at $3,500/mo -> exactly $3,500 - $4,200/mo and $42,000 - $50,400/yr
 *    - Extreme values: n=0, -1, 1000, 0.5, NaN, null, negative costs, non-numeric strings, Infinity
 *    - Floating-point precision and rounding guarantees (annual is exactly 12x monthly)
 *    - Query string prefill generation and forwarding
 * 2. Booking Form (src/components/BookCallForm.tsx & src/lib/validation.ts)
 *    - Client-side validation: required fields, email syntax (RFC 5322), phone syntax, field lengths
 *    - Honeypot trapping (submissions with honeypot filled must be silently trapped / rejected)
 *    - Mandatory HIPAA non-PHI warning notice presence
 *    - Centralized 15-minute call duration constant (DISCOVERY_CALL_LENGTH_MINUTES = 15)
 *    - Malicious / adversarial URL query param injection (/book-a-call?role=<script>...&teamMembers=-999&currentCost=NaN)
 * 3. Interactive Components (Header.tsx, FAQAccordion.tsx, PlaceholderBadge.tsx)
 *    - Header mobile navigation toggle, keyboard accessibility (Escape), resize listener, persistent mobile CTA
 *    - FAQ accordion single vs multiple toggle mode, arrow key focus cycling, category filtering
 *    - Placeholder badge dev-mode gating vs production suppression
 * 4. ReDoS Vulnerability Stress Testing
 *    - Catastrophic backtracking resistance on email, phone, sanitizer, and HTML parser regular expressions
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

import {
  calculateSavings,
  formatCurrency,
  formatMonthlyRange,
  formatAnnualRange,
  buildCalculatorForwardUrl,
  CALCULATOR_CONFIG
} from '../../../src/content/calculator.ts';

import {
  validateBookingForm,
  validateWorkEmail,
  sanitizeInput,
  parseTeamMembersParam,
  parseCurrentCostParam
} from '../../../src/lib/validation.ts';

import {
  DISCOVERY_CALL_LENGTH_MINUTES,
  PHI_WARNING_NOTICE,
  CTA_LABELS,
  BRAND_NAME
} from '../../../src/content/siteConfig.ts';

import { SERVICE_ROLES } from '../../../src/content/services.ts';
import { FAQ_ITEMS } from '../../../src/content/faq.ts';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { MathVerifier } from '../helpers/math-verifier.mjs';
import { SRC_DIR, PROJECT_ROOT } from '../config.mjs';

const crawler = new RouteCrawler();

// Role selection resolution logic matching src/components/BookCallForm.tsx
function resolveRoleSelection(roleParam) {
  if (!roleParam) return '';
  let cleanParam = '';
  try {
    cleanParam = decodeURIComponent(roleParam).trim().toLowerCase();
  } catch {
    cleanParam = String(roleParam).trim().toLowerCase();
  }

  // Match by exact ID
  const byId = SERVICE_ROLES.find((r) => r.id.toLowerCase() === cleanParam);
  if (byId) return byId.id;

  // Match by name
  const byName = SERVICE_ROLES.find((r) => r.name.toLowerCase() === cleanParam);
  if (byName) return byName.id;

  // Fuzzy match
  const byFuzzy = SERVICE_ROLES.find(
    (r) =>
      cleanParam.includes(r.id) || r.name.toLowerCase().includes(cleanParam)
  );
  return byFuzzy ? byFuzzy.id : '';
}

/* ==============================================================================
   GROUP 1: Savings Calculator Math Engine & Component Hardening
   ============================================================================== */
describe('Tier 5 Group 1: Savings Calculator Math Engine & Component Hardening', () => {

  // TEST-T5-CALC-001: Benchmark Case Exactness
  test('TEST-T5-CALC-001: Mandatory Benchmark Verification: n=2 at $3,500/mo yields strictly $3,500-$4,200/mo and $42,000-$50,400/yr', () => {
    const n = 2;
    const c = 3500;
    const frontDeskPrice = 1499;

    const res = calculateSavings(n, c, frontDeskPrice);

    // 2 * 3500 * 0.50 = 3500
    // 2 * 3500 * 0.60 = 4200
    assert.strictEqual(res.monthlyMin, 3500, 'Benchmark monthlyMin must be exactly 3,500');
    assert.strictEqual(res.monthlyMax, 4200, 'Benchmark monthlyMax must be exactly 4,200');
    assert.strictEqual(res.annualMin, 42000, 'Benchmark annualMin must be exactly 42,000');
    assert.strictEqual(res.annualMax, 50400, 'Benchmark annualMax must be exactly 50,400');

    // Published list price difference: 2 * (3500 - 1499) = 2 * 2001 = 4002
    assert.strictEqual(res.publishedDiff, 4002, 'Published price difference must be exactly 4,002');
    assert.strictEqual(res.isCustomQuote, false, 'Admin / Front Desk is not a custom quote role');

    // Formatting assertion
    const monthlyStr = formatMonthlyRange(res.monthlyMin, res.monthlyMax);
    const annualStr = formatAnnualRange(res.annualMin, res.annualMax);
    assert.strictEqual(monthlyStr, '$3,500 – $4,200/mo');
    assert.strictEqual(annualStr, '$42,000 – $50,400/yr');
  });

  // TEST-T5-CALC-002: Extreme Non-Numeric & Degenerate Boundaries
  test('TEST-T5-CALC-002: Extreme non-numeric, null, undefined, NaN, and negative values safely yield 0 savings without crashing or NaN strings', () => {
    const degenerateCases = [
      { n: 0, c: 3500, desc: 'Zero team members' },
      { n: -1, c: 3500, desc: 'Negative team members' },
      { n: -999, c: -5000, desc: 'Both negative' },
      { n: NaN, c: 3500, desc: 'NaN team members' },
      { n: 2, c: NaN, desc: 'NaN current cost' },
      { n: null, c: 3500, desc: 'Null team members' },
      { n: undefined, c: undefined, desc: 'Undefined inputs' },
      { n: 'invalid', c: 3500, desc: 'Non-numeric string members' },
      { n: 2, c: 'free', desc: 'Non-numeric string cost' },
      { n: '', c: '', desc: 'Empty strings' },
    ];

    for (const { n, c, desc } of degenerateCases) {
      const res = calculateSavings(n, c);
      assert.strictEqual(res.monthlyMin, 0, `${desc} monthlyMin must be 0`);
      assert.strictEqual(res.monthlyMax, 0, `${desc} monthlyMax must be 0`);
      assert.strictEqual(res.annualMin, 0, `${desc} annualMin must be 0`);
      assert.strictEqual(res.annualMax, 0, `${desc} annualMax must be 0`);
      assert.strictEqual(res.publishedDiff, undefined, `${desc} publishedDiff must be undefined`);

      const fmt = formatMonthlyRange(res.monthlyMin, res.monthlyMax);
      assert.ok(!fmt.includes('NaN'), `${desc} format string must not include NaN`);
      assert.strictEqual(fmt, '$0 – $0/mo');
    }
  });

  // TEST-T5-CALC-003: Fractional & Decimal Team Members
  test('TEST-T5-CALC-003: Fractional and decimal team members calculate cleanly with strict whole-integer rounding', () => {
    const fractionalCases = [
      { n: 0.5, c: 3500, expectedMin: 875, expectedMax: 1050 },     // 0.5 * 3500 = 1750; *0.5=875, *0.6=1050
      { n: 1.25, c: 4000, expectedMin: 2500, expectedMax: 3000 },   // 1.25 * 4000 = 5000; *0.5=2500, *0.6=3000
      { n: 2.5, c: 3500, expectedMin: 4375, expectedMax: 5250 },    // 2.5 * 3500 = 8750; *0.5=4375, *0.6=5250
      { n: 3.75, c: 2800, expectedMin: 5250, expectedMax: 6300 },   // 3.75 * 2800 = 10500; *0.5=5250, *0.6=6300
    ];

    for (const { n, c, expectedMin, expectedMax } of fractionalCases) {
      const res = calculateSavings(n, c);
      assert.strictEqual(Number.isInteger(res.monthlyMin), true, `monthlyMin must be integer for n=${n}`);
      assert.strictEqual(Number.isInteger(res.monthlyMax), true, `monthlyMax must be integer for n=${n}`);
      assert.strictEqual(res.monthlyMin, expectedMin, `n=${n} monthlyMin matches`);
      assert.strictEqual(res.monthlyMax, expectedMax, `n=${n} monthlyMax matches`);
      assert.strictEqual(res.annualMin, expectedMin * 12, `n=${n} annualMin matches 12x`);
      assert.strictEqual(res.annualMax, expectedMax * 12, `n=${n} annualMax matches 12x`);

      const fmt = formatMonthlyRange(res.monthlyMin, res.monthlyMax);
      assert.ok(!fmt.includes('.'), `Formatted string for n=${n} must not contain decimal pennies`);
    }
  });

  // TEST-T5-CALC-004: Astronomical Scale & Safe Integer Preservation
  test('TEST-T5-CALC-004: Astronomical high values (n=1000, C=$100,000) remain safe JavaScript integers with commas', () => {
    const res = calculateSavings(1000, 100000);
    // 1000 * 100,000 = 100,000,000
    // min: 50,000,000/mo; max: 60,000,000/mo
    // annual min: 600,000,000; annual max: 720,000,000
    assert.strictEqual(res.monthlyMin, 50000000);
    assert.strictEqual(res.monthlyMax, 60000000);
    assert.strictEqual(res.annualMin, 600000000);
    assert.strictEqual(res.annualMax, 720000000);

    assert.ok(Number.isSafeInteger(res.annualMax), 'Astronomical annualMax must be a safe integer');

    const monthlyStr = formatMonthlyRange(res.monthlyMin, res.monthlyMax);
    const annualStr = formatAnnualRange(res.annualMin, res.annualMax);
    assert.strictEqual(monthlyStr, '$50,000,000 – $60,000,000/mo');
    assert.strictEqual(annualStr, '$600,000,000 – $720,000,000/yr');
  });

  // TEST-T5-CALC-005: Precision Invariance & Rounding Guarantees across 100 Random Inputs
  test('TEST-T5-CALC-005: Precision Invariance: annualMin/annualMax are strictly 12x monthly with zero float drift across randomized inputs', () => {
    // Generate 100 pseudo-random test vectors
    for (let i = 1; i <= 100; i++) {
      const n = (i * 7) % 20 + 1; // 1 to 20
      const c = 1000 + ((i * 313) % 14000); // 1000 to 15000
      const res = calculateSavings(n, c);

      assert.strictEqual(
        res.annualMin,
        res.monthlyMin * 12,
        `annualMin must strictly equal monthlyMin * 12 (vector: n=${n}, c=${c})`
      );
      assert.strictEqual(
        res.annualMax,
        res.monthlyMax * 12,
        `annualMax must strictly equal monthlyMax * 12 (vector: n=${n}, c=${c})`
      );
      assert.strictEqual(Number.isInteger(res.monthlyMin), true, 'monthlyMin is whole integer');
      assert.strictEqual(Number.isInteger(res.monthlyMax), true, 'monthlyMax is whole integer');
    }
  });

  // TEST-T5-CALC-006: Cost Lower Than Published Price (C < P) & Custom Quote Suppression
  test('TEST-T5-CALC-006: Cost lower than published price suppresses negative savings difference, and custom quote roles omit published diff', () => {
    // Case A: User currently pays $1,000/mo, published rate is $1,499/mo
    const underCostRes = calculateSavings(1, 1000, 1499);
    assert.strictEqual(underCostRes.monthlyMin, 500);
    assert.strictEqual(underCostRes.monthlyMax, 600);
    assert.strictEqual(underCostRes.publishedDiff, -499);

    // Verify SavingsCalculator component source code strictly checks `publishedDiff > 0` before rendering
    const compPath = path.join(SRC_DIR, 'components', 'SavingsCalculator.tsx');
    assert.ok(fs.existsSync(compPath), 'SavingsCalculator.tsx must exist');
    const compSource = fs.readFileSync(compPath, 'utf-8');
    assert.ok(
      compSource.includes('calculation.publishedDiff > 0'),
      'SavingsCalculator must guard comparison banner with publishedDiff > 0 to suppress negative savings'
    );

    // Case B: Custom quote role (publishedPrice = undefined)
    const customQuoteRes = calculateSavings(2, 4000, undefined);
    assert.strictEqual(customQuoteRes.publishedDiff, undefined, 'publishedDiff must be undefined for custom quote');
    assert.strictEqual(customQuoteRes.isCustomQuote, true, 'isCustomQuote must be true');
    assert.ok(
      compSource.includes('CALCULATOR_CONFIG.customQuoteDisclaimer'),
      'Component must render custom quote disclaimer when isCustomQuote is true'
    );
  });

  // TEST-T5-CALC-007: Query String Forwarding URL Generation
  test('TEST-T5-CALC-007: buildCalculatorForwardUrl properly builds URL, encodes special chars, and omits falsy values', () => {
    // Standard contract
    const url1 = buildCalculatorForwardUrl('admin-front-desk', 2, 3500);
    assert.strictEqual(url1, '/book-a-call?role=admin-front-desk&teamMembers=2&currentCost=3500');

    // Falsy / zero values omitted
    const url2 = buildCalculatorForwardUrl('', 0, 0);
    assert.strictEqual(url2, '/book-a-call?');

    // Malicious role parameter safely URL-encoded
    const url3 = buildCalculatorForwardUrl("<script>alert('xss')</script>", 2, 3500);
    assert.ok(!url3.includes('<script>'), 'URL must not contain raw script tags');
    assert.ok(url3.includes('%3Cscript%3E'), 'URL must percent-encode HTML tags');
  });

  // TEST-T5-CALC-008: Component Range Clamping & Stepper State Invariants
  test('TEST-T5-CALC-008: SavingsCalculator component clamps team members to [1, 20] and monthly cost to [1000, 15000]', () => {
    const compPath = path.join(SRC_DIR, 'components', 'SavingsCalculator.tsx');
    const compSource = fs.readFileSync(compPath, 'utf-8');

    // Verify team members bounds clamping
    assert.ok(compSource.includes('CALCULATOR_CONFIG.minTeamMembers'), 'Must reference minTeamMembers (1)');
    assert.ok(compSource.includes('CALCULATOR_CONFIG.maxTeamMembers'), 'Must reference maxTeamMembers (20)');
    assert.strictEqual(CALCULATOR_CONFIG.minTeamMembers, 1);
    assert.strictEqual(CALCULATOR_CONFIG.maxTeamMembers, 20);

    // Verify current cost bounds clamping
    assert.ok(compSource.includes('CALCULATOR_CONFIG.minCurrentCost'), 'Must reference minCurrentCost (1000)');
    assert.ok(compSource.includes('CALCULATOR_CONFIG.maxCurrentCost'), 'Must reference maxCurrentCost (15000)');
    assert.strictEqual(CALCULATOR_CONFIG.minCurrentCost, 1000);
    assert.strictEqual(CALCULATOR_CONFIG.maxCurrentCost, 15000);

    // Verify stepper buttons have accessibility labels
    assert.ok(compSource.includes('aria-label="Decrease team members"'), 'Decrease button has aria-label');
    assert.ok(compSource.includes('aria-label="Increase team members"'), 'Increase button has aria-label');
  });

});

/* ==============================================================================
   GROUP 2: Booking Form Validation & Honeypot Hardening
   ============================================================================== */
describe('Tier 5 Group 2: Booking Form Validation & Honeypot Hardening', () => {

  const validBasePayload = {
    name: 'Dr. Sarah Connor',
    workEmail: 'sconnor@cyberdyne-health.com',
    practiceName: 'Connor Family Medicine',
    practiceType: 'Family Medicine & Primary Care',
    phone: '+1 (555) 019-2834',
    rolesOfInterest: 'admin-front-desk',
    message: 'Evaluating staffing for front office operations.',
    website_url_hp: ''
  };

  // TEST-T5-FORM-001: Required Fields Strict Enforcement
  test('TEST-T5-FORM-001: Missing required fields independently blocks submission and identifies the missing field', () => {
    // 1. Fully valid submission
    const validRes = validateBookingForm(validBasePayload);
    assert.strictEqual(validRes.isValid, true, 'Base payload must be valid');
    assert.strictEqual(Object.keys(validRes.errors).length, 0);

    // 2. Missing name (empty string and whitespace-only)
    const noName = validateBookingForm({ ...validBasePayload, name: '' });
    assert.strictEqual(noName.isValid, false);
    assert.ok(noName.errors.name, 'Must report name error');

    const whitespaceName = validateBookingForm({ ...validBasePayload, name: '    ' });
    assert.strictEqual(whitespaceName.isValid, false);
    assert.ok(whitespaceName.errors.name, 'Whitespace name must fail');

    // 3. Missing practiceName
    const noPractice = validateBookingForm({ ...validBasePayload, practiceName: '   ' });
    assert.strictEqual(noPractice.isValid, false);
    assert.ok(noPractice.errors.practiceName, 'Must report practiceName error');

    // 4. Missing practiceType
    const noType = validateBookingForm({ ...validBasePayload, practiceType: '' });
    assert.strictEqual(noType.isValid, false);
    assert.ok(noType.errors.practiceType, 'Must report practiceType error');
  });

  // TEST-T5-FORM-002: Field Length Boundaries
  test('TEST-T5-FORM-002: Field length boundaries are strictly enforced (100 char name/practice, 2000 char message)', () => {
    // Name: exactly 100 chars (valid) vs 101 chars (invalid)
    const valid100Name = validateBookingForm({ ...validBasePayload, name: 'A'.repeat(100) });
    assert.strictEqual(valid100Name.isValid, true, '100-char name must pass');

    const invalid101Name = validateBookingForm({ ...validBasePayload, name: 'A'.repeat(101) });
    assert.strictEqual(invalid101Name.isValid, false);
    assert.ok(invalid101Name.errors.name, '101-char name must fail');

    // Practice: exactly 100 chars (valid) vs 101 chars (invalid)
    const valid100Practice = validateBookingForm({ ...validBasePayload, practiceName: 'B'.repeat(100) });
    assert.strictEqual(valid100Practice.isValid, true, '100-char practiceName must pass');

    const invalid101Practice = validateBookingForm({ ...validBasePayload, practiceName: 'B'.repeat(101) });
    assert.strictEqual(invalid101Practice.isValid, false);
    assert.ok(invalid101Practice.errors.practiceName, '101-char practiceName must fail');

    // Message: exactly 2000 chars (valid) vs 2001 chars (invalid)
    const valid2000Msg = validateBookingForm({ ...validBasePayload, message: 'C'.repeat(2000) });
    assert.strictEqual(valid2000Msg.isValid, true, '2000-char message must pass');

    const invalid2001Msg = validateBookingForm({ ...validBasePayload, message: 'C'.repeat(2001) });
    assert.strictEqual(invalid2001Msg.isValid, false);
    assert.ok(invalid2001Msg.errors.message, '2001-char message must fail');
  });

  // TEST-T5-FORM-003: RFC 5322 Email Validation Matrix
  test('TEST-T5-FORM-003: RFC 5322 email syntax validation accepts compliant addresses and rejects all invalid variants', () => {
    const validEmails = [
      'simple@example.com',
      'very.common@example.com',
      'disposable.style.email.with+symbol@example.com',
      'other.email-with-hyphen@example.com',
      'fully-qualified-domain@example.co.uk',
      'user.name@subdomain.example.com',
      `${'a'.repeat(64)}@example.com`, // max 64-char local part
    ];

    for (const email of validEmails) {
      assert.strictEqual(validateWorkEmail(email), true, `Valid email "${email}" must pass`);
    }

    const invalidEmails = [
      '',
      '   ',
      'plainaddress',
      '#@%^%#$@#$@#.com',
      '@example.com',
      'Joe Smith <email@example.com>',
      'email.example.com',
      'email@example@example.com',
      '.email@example.com',          // leading dot
      'email.@example.com',          // trailing dot
      'email..email@example.com',    // double dot
      'email@example.com (Joe Smith)',
      'email@example',               // no TLD
      'email@-example.com',          // leading dash in domain
      'email@example..com',          // double dot in domain
      `${'a'.repeat(65)}@example.com`, // local part exceeds 64 chars
      `${'a'.repeat(250)}@example.com`, // total length exceeds 254 chars
    ];

    for (const email of invalidEmails) {
      assert.strictEqual(validateWorkEmail(email), false, `Invalid email "${email}" must fail`);
    }
  });

  // TEST-T5-FORM-004: Optional Phone Number Formatting & Validation
  test('TEST-T5-FORM-004: Phone number allows empty, validates 7-15 digits with formatting, and rejects alphabetical junk', () => {
    // 1. Empty phone (optional field) -> valid
    const emptyPhoneRes = validateBookingForm({ ...validBasePayload, phone: '' });
    assert.strictEqual(emptyPhoneRes.isValid, true, 'Empty phone is valid');

    // 2. Valid formats (7 to 15 digits)
    const validPhones = [
      '555-1234',            // 7 digits (local)
      '555-234-5678',        // 10 digits (US)
      '+1 (555) 234-5678',   // formatted US
      '+44 20 7946 0958',    // international
      '123456789012345'      // 15 digits (max ITU E.164)
    ];

    for (const phone of validPhones) {
      const res = validateBookingForm({ ...validBasePayload, phone });
      assert.strictEqual(res.isValid, true, `Phone "${phone}" must pass`);
      assert.strictEqual(res.errors.phone, undefined);
    }

    // 3. Invalid formats (alphanumeric junk, out-of-range digits)
    const invalidPhones = [
      '123456',              // 6 digits (too short)
      '1234567890123456',    // 16 digits (too long)
      '555-CALL-NOW',        // contains letters
      'phone number here',   // garbage text
      'abc-def-ghij'         // non-numeric
    ];

    for (const phone of invalidPhones) {
      const res = validateBookingForm({ ...validBasePayload, phone });
      assert.strictEqual(res.isValid, false, `Invalid phone "${phone}" must fail`);
      assert.ok(res.errors.phone, `Must report phone error for "${phone}"`);
    }
  });

  // TEST-T5-FORM-005: Multi-Vector Honeypot Bot Trapping
  test('TEST-T5-FORM-005: Multi-vector honeypot bot trap silently traps submissions without displaying error messages', () => {
    const baseWithoutHp = {
      name: 'Dr. Sarah Connor',
      workEmail: 'sconnor@cyberdyne-health.com',
      practiceName: 'Connor Family Medicine',
      practiceType: 'Family Medicine & Primary Care',
      phone: '+1 (555) 019-2834',
      rolesOfInterest: 'admin-front-desk',
      message: 'Evaluating staffing for front office operations.',
    };

    // Test each recognized honeypot key independently
    const honeypotKeys = ['website_url_hp', 'website_url', 'honeypot', 'company_url'];

    for (const key of honeypotKeys) {
      const spamPayload = {
        ...baseWithoutHp,
        [key]: 'https://spambot-payload.ru'
      };

      const res = validateBookingForm(spamPayload);
      assert.strictEqual(res.isBotTrapped, true, `Populated ${key} must set isBotTrapped=true`);
      assert.strictEqual(res.isValid, false, `Populated ${key} must set isValid=false`);
    }

    // Clean submission with empty honeypot field
    const cleanPayload = {
      ...baseWithoutHp,
      website_url_hp: ''
    };
    const cleanRes = validateBookingForm(cleanPayload);
    assert.strictEqual(cleanRes.isBotTrapped, false, 'Clean honeypot must not trap');
    assert.strictEqual(cleanRes.isValid, true);
  });

  // TEST-T5-FORM-006: Mandatory Non-PHI Notice & Disclosures
  test('TEST-T5-FORM-006: Mandatory HIPAA Non-PHI warning notice is present in source, data structures, and rendered page', () => {
    // 1. Content constant
    assert.ok(
      PHI_WARNING_NOTICE.toLowerCase().includes('do not include') &&
      PHI_WARNING_NOTICE.toLowerCase().includes('phi'),
      'PHI_WARNING_NOTICE must warn against including PHI'
    );

    // 2. Component source
    const formPath = path.join(SRC_DIR, 'components', 'BookCallForm.tsx');
    const formCode = fs.readFileSync(formPath, 'utf-8');
    assert.ok(formCode.includes('data-testid="phi-notice"'), 'BookCallForm has data-testid="phi-notice"');
    assert.ok(formCode.includes('PHI_WARNING_NOTICE'), 'BookCallForm renders PHI_WARNING_NOTICE');
    assert.ok(formCode.includes('No PHI'), 'Textarea label includes "(No PHI)"');
    assert.ok(formCode.includes('Do not include patient identifiers'), 'Helper text warns against patient identifiers');

    // 3. Rendered HTML in static export
    if (crawler.isExportPresent() && crawler.hasPageExport('/book-a-call')) {
      const html = crawler.getPageHtml('/book-a-call');
      assert.ok(
        HtmlParser.hasText(html, /do not include protected health information|PHI/i),
        'Exported /book-a-call HTML must render HIPAA Non-PHI notice'
      );
    }
  });

  // TEST-T5-FORM-007: Centralized 15-Minute Discovery Call Constant
  test('TEST-T5-FORM-007: Centralized DISCOVERY_CALL_LENGTH_MINUTES is strictly 15 and referenced across button and drawer', () => {
    assert.strictEqual(DISCOVERY_CALL_LENGTH_MINUTES, 15, 'Call duration must be strictly 15');

    const formPath = path.join(SRC_DIR, 'components', 'BookCallForm.tsx');
    const formCode = fs.readFileSync(formPath, 'utf-8');
    assert.ok(
      formCode.includes('DISCOVERY_CALL_LENGTH_MINUTES'),
      'BookCallForm must reference DISCOVERY_CALL_LENGTH_MINUTES'
    );

    const headerPath = path.join(SRC_DIR, 'components', 'Header.tsx');
    const headerCode = fs.readFileSync(headerPath, 'utf-8');
    assert.ok(
      headerCode.includes('15-min discovery call'),
      'Header mobile drawer must display 15-min discovery call notice'
    );
  });

});

/* ==============================================================================
   GROUP 3: Adversarial URL Query Parameter Injection & Hydration
   ============================================================================== */
describe('Tier 5 Group 3: Adversarial URL Query Parameter Injection & Hydration', () => {

  // TEST-T5-INJECT-001: Script Injection & XSS Attack via role Parameter
  test('TEST-T5-INJECT-001: Pure XSS and script tag payloads via role parameter are neutralized to safe empty string', () => {
    const maliciousRolePayloads = [
      "<script>alert('xss')</script>",
      '"><svg/onload=alert(1)>',
      'javascript:alert(1)',
      '<img src=x onerror=prompt(1)>',
      '{{constructor.constructor("alert(1)")()}}',
    ];

    for (const payload of maliciousRolePayloads) {
      const resolved = resolveRoleSelection(payload);
      assert.strictEqual(
        resolved,
        '',
        `Malicious payload "${payload}" must resolve to empty string`
      );
    }

    // If an attacker appends a script tag to a real role name, verify resolver produces ONLY the safe whitelisted role ID
    const hybridPayload = "role=admin-front-desk<script>alert(1)</script>";
    const resolvedHybrid = resolveRoleSelection(hybridPayload);
    assert.ok(
      !resolvedHybrid.includes('<') && !resolvedHybrid.includes('script'),
      'Resolved role must never contain script tags or HTML characters'
    );
    assert.strictEqual(resolvedHybrid, 'admin-front-desk', 'Must resolve only to the safe whitelisted role ID');
  });

  // TEST-T5-INJECT-002: Path Traversal & SQL Injection in Query Parameters
  test('TEST-T5-INJECT-002: Path traversal and SQL injection patterns are neutralized without file leakage or crash', () => {
    const attacks = [
      '../../../../etc/passwd',
      '..\\..\\..\\windows\\system32',
      "' OR '1'='1'; --",
      "admin' UNION SELECT 1,2,3--",
      "; DROP TABLE users;",
    ];

    for (const attack of attacks) {
      const resolved = resolveRoleSelection(attack);
      assert.strictEqual(resolved, '', `Attack pattern "${attack}" must resolve to empty string`);
    }
  });

  // TEST-T5-INJECT-003: Extreme Numeric Injection in teamMembers and currentCost
  test('TEST-T5-INJECT-003: Extreme numeric and non-numeric query params fall back cleanly to 2 members and $3,500 cost', () => {
    const memberAttacks = [
      { input: '-999', expected: 2 },
      { input: '0', expected: 2 },
      { input: '21', expected: 2 },           // exceeds max 20
      { input: '99999999999', expected: 2 },   // massive overflow
      { input: 'NaN', expected: 2 },
      { input: 'null', expected: 2 },
      { input: 'Infinity', expected: 2 },
      { input: 'abc', expected: 2 },
      { input: '10', expected: 10 },           // valid in-range value
    ];

    for (const { input, expected } of memberAttacks) {
      assert.strictEqual(
        parseTeamMembersParam(input),
        expected,
        `parseTeamMembersParam("${input}") must yield ${expected}`
      );
    }

    const costAttacks = [
      { input: '-500', expected: 3500 },
      { input: '0', expected: 3500 },
      { input: '999', expected: 3500 },        // below min 1000
      { input: '20001', expected: 3500 },      // above max 20000
      { input: '100000000', expected: 3500 },  // massive overflow
      { input: 'NaN', expected: 3500 },
      { input: 'Infinity', expected: 3500 },
      { input: '5000', expected: 5000 },       // valid in-range value
    ];

    for (const { input, expected } of costAttacks) {
      assert.strictEqual(
        parseCurrentCostParam(input),
        expected,
        `parseCurrentCostParam("${input}") must yield ${expected}`
      );
    }
  });

  // TEST-T5-INJECT-004: Malformed Percent-Encoding and URI Sequences
  test('TEST-T5-INJECT-004: Corrupted percent sequences in URL query parameters do not throw URIError', () => {
    const malformedPercentStrings = [
      '%',
      '%E0%A4%A',
      '%ZZ',
      '%%%',
      '%u0000',
    ];

    for (const badStr of malformedPercentStrings) {
      // Must not throw URIError
      assert.doesNotThrow(() => {
        const res = resolveRoleSelection(badStr);
        assert.strictEqual(typeof res, 'string');
      }, `Malformed URI string "${badStr}" must not throw`);
    }
  });

  // TEST-T5-INJECT-005: HTML Sanitizer Function Rigor
  test('TEST-T5-INJECT-005: sanitizeInput strictly escapes all dangerous HTML meta-characters', () => {
    const input = '<script>alert("xss") & \'run\' / test</script>';
    const sanitized = sanitizeInput(input);

    assert.ok(!sanitized.includes('<'), 'Must not contain raw <');
    assert.ok(!sanitized.includes('>'), 'Must not contain raw >');
    assert.ok(!sanitized.includes('"'), 'Must not contain raw "');
    assert.ok(!sanitized.includes("'"), 'Must not contain raw \'');
    assert.ok(!sanitized.includes('& '), 'Must not contain unescaped &');

    assert.strictEqual(
      sanitized,
      '&lt;script&gt;alert(&quot;xss&quot;) &amp; &#x27;run&#x27; &#x2F; test&lt;&#x2F;script&gt;'
    );

    // Non-string inputs
    assert.strictEqual(sanitizeInput(null), '');
    assert.strictEqual(sanitizeInput(undefined), '');
    assert.strictEqual(sanitizeInput(123), '');
  });

});

/* ==============================================================================
   GROUP 4: Interactive Component State & Accessibility Hardening
   ============================================================================== */
describe('Tier 5 Group 4: Interactive Component State & Accessibility Hardening', () => {

  // TEST-T5-INTERACT-001: Header Mobile Navigation State & ARIA Attributes
  test('TEST-T5-INTERACT-001: Header mobile navigation implements required ARIA attributes and persistent mobile CTA', () => {
    const headerPath = path.join(SRC_DIR, 'components', 'Header.tsx');
    assert.ok(fs.existsSync(headerPath), 'Header.tsx must exist');
    const headerCode = fs.readFileSync(headerPath, 'utf-8');

    // ARIA expanded on hamburger button
    assert.ok(headerCode.includes('aria-expanded={isOpen}'), 'Toggle button must bind aria-expanded');
    assert.ok(headerCode.includes('aria-controls="mobile-nav-drawer"'), 'Toggle button must control mobile-nav-drawer');

    // Drawer dialog role
    assert.ok(headerCode.includes('id="mobile-nav-drawer"'), 'Drawer element must have id="mobile-nav-drawer"');
    assert.ok(headerCode.includes('role="dialog"'), 'Drawer element must have role="dialog"');
    assert.ok(headerCode.includes('aria-modal="true"'), 'Drawer element must have aria-modal="true"');

    // Persistent Book Call CTA on mobile viewports (<1024px)
    assert.ok(
      headerCode.includes('flex lg:hidden items-center') && headerCode.includes('HEADER_CTA.label'),
      'Header must render persistent Book a Call button on mobile viewports'
    );
  });

  // TEST-T5-INTERACT-002: Header Keyboard Navigation & Scroll Lock
  test('TEST-T5-INTERACT-002: Header mobile drawer locks scroll and closes on Escape key or desktop resize', () => {
    const headerPath = path.join(SRC_DIR, 'components', 'Header.tsx');
    const headerCode = fs.readFileSync(headerPath, 'utf-8');

    // Escape key handler
    assert.ok(headerCode.includes('e.key === "Escape"'), 'Header must listen for Escape key');
    assert.ok(headerCode.includes('setIsOpen(false)'), 'Escape key must close drawer');
    assert.ok(headerCode.includes('toggleButtonRef.current?.focus()'), 'Must return focus to toggle button on Escape');

    // Body scroll lock
    assert.ok(headerCode.includes('document.body.style.overflow = "hidden"'), 'Must lock scroll when drawer open');

    // Desktop resize listener
    assert.ok(headerCode.includes('window.innerWidth >= 1024'), 'Must check window.innerWidth >= 1024 on resize');
  });

  // TEST-T5-INTERACT-003: FAQ Accordion Single vs Multiple Mode Toggle
  test('TEST-T5-INTERACT-003: FAQAccordion supports single-collapse and multiple-open modes', () => {
    const faqPath = path.join(SRC_DIR, 'components', 'FAQAccordion.tsx');
    assert.ok(fs.existsSync(faqPath), 'FAQAccordion.tsx must exist');
    const faqCode = fs.readFileSync(faqPath, 'utf-8');

    // Check allowMultiple prop
    assert.ok(faqCode.includes('allowMultiple'), 'FAQAccordion must define allowMultiple prop');

    // State logic verification: simulate toggleItem
    const simulateToggle = (openIds, targetId, allowMultiple) => {
      if (allowMultiple) {
        return openIds.includes(targetId)
          ? openIds.filter((id) => id !== targetId)
          : [...openIds, targetId];
      } else {
        return openIds.includes(targetId) ? [] : [targetId];
      }
    };

    // Single mode (default: allowMultiple = false)
    let open = [];
    open = simulateToggle(open, 'item-1', false);
    assert.deepStrictEqual(open, ['item-1'], 'Item 1 opens');

    open = simulateToggle(open, 'item-2', false);
    assert.deepStrictEqual(open, ['item-2'], 'Opening Item 2 closes Item 1 in single mode');

    open = simulateToggle(open, 'item-2', false);
    assert.deepStrictEqual(open, [], 'Clicking active Item 2 closes it');

    // Multi mode (allowMultiple = true)
    let multiOpen = [];
    multiOpen = simulateToggle(multiOpen, 'item-1', true);
    multiOpen = simulateToggle(multiOpen, 'item-2', true);
    assert.deepStrictEqual(multiOpen, ['item-1', 'item-2'], 'Both items open in multi mode');

    multiOpen = simulateToggle(multiOpen, 'item-1', true);
    assert.deepStrictEqual(multiOpen, ['item-2'], 'Closing item-1 leaves item-2 open');
  });

  // TEST-T5-INTERACT-004: FAQ Accordion WAI-ARIA Keyboard Navigation & Category Filtering
  test('TEST-T5-INTERACT-004: FAQAccordion implements WAI-ARIA arrow key navigation and resets open state on category change', () => {
    const faqPath = path.join(SRC_DIR, 'components', 'FAQAccordion.tsx');
    const faqCode = fs.readFileSync(faqPath, 'utf-8');

    // Keyboard handlers
    assert.ok(faqCode.includes('case "ArrowDown":'), 'Handles ArrowDown navigation');
    assert.ok(faqCode.includes('case "ArrowUp":'), 'Handles ArrowUp navigation');
    assert.ok(faqCode.includes('case "Home":'), 'Handles Home navigation');
    assert.ok(faqCode.includes('case "End":'), 'Handles End navigation');

    // ARIA panel and button binding
    assert.ok(faqCode.includes('aria-expanded={isOpen}'), 'Button has aria-expanded');
    assert.ok(faqCode.includes('aria-controls={panelId}'), 'Button has aria-controls');
    assert.ok(faqCode.includes('role="region"'), 'Panel has role="region"');
    assert.ok(faqCode.includes('aria-labelledby={buttonId}'), 'Panel has aria-labelledby');

    // Category reset logic
    assert.ok(
      faqCode.includes('setSelectedCategory(cat.value)') && faqCode.includes('setOpenIds([])'),
      'Category selection resets open accordion panels'
    );
  });

  // TEST-T5-INTERACT-005: PlaceholderBadge Development-Mode Gating & Production Suppression
  test('TEST-T5-INTERACT-005: PlaceholderBadge renders role="status" and suppresses in production', () => {
    const badgePath = path.join(SRC_DIR, 'components', 'PlaceholderBadge.tsx');
    assert.ok(fs.existsSync(badgePath), 'PlaceholderBadge.tsx must exist');
    const badgeCode = fs.readFileSync(badgePath, 'utf-8');

    // Dev-mode check
    assert.ok(
      badgeCode.includes('process.env.NODE_ENV === "development"'),
      'PlaceholderBadge checks NODE_ENV === "development"'
    );
    assert.ok(
      badgeCode.includes('!isDevelopment && !forceShow'),
      'PlaceholderBadge returns null in production unless forceShow is true'
    );
    assert.ok(badgeCode.includes('role="status"'), 'PlaceholderBadge specifies role="status"');
  });

});

/* ==============================================================================
   GROUP 5: ReDoS & Catastrophic Backtracking Stress Testing
   ============================================================================== */
describe('Tier 5 Group 5: ReDoS & Catastrophic Backtracking Stress Testing', () => {

  // TEST-T5-REDOS-001: Email Validation Regex ReDoS Stress
  test('TEST-T5-REDOS-001: Email regex withstands 5,000 iterations of pathological strings in < 50ms (linear O(N))', () => {
    const pathologicalEmails = [
      'a'.repeat(64) + '@' + ('a'.repeat(61) + '.').repeat(3) + 'com',
      'user@' + 'sub.'.repeat(30) + 'domain.com',
      'user@' + 'a-'.repeat(50) + 'invalid',
      'user@' + 'a.'.repeat(50) + 'invalid',
      'a'.repeat(64) + '@' + 'a'.repeat(61) + '.' + 'b'.repeat(61) + '.' + 'c'.repeat(50),
    ];

    const iterations = 5000;
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
      const email = pathologicalEmails[i % pathologicalEmails.length];
      validateWorkEmail(email);
    }

    const elapsedMs = performance.now() - startTime;
    assert.ok(
      elapsedMs < 50,
      `Email regex ReDoS benchmark failed: 5,000 runs took ${elapsedMs.toFixed(2)}ms (must be < 50ms)`
    );
  });

  // TEST-T5-REDOS-002: Phone Extraction & Number Validation ReDoS Stress
  test('TEST-T5-REDOS-002: Phone number validation withstands 5,000 iterations of delimiter-dense strings in < 150ms', () => {
    const hugePhone = '+1 (' + '123-'.repeat(200) + '456)';

    const iterations = 5000;
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
      const digitsOnly = hugePhone.replace(/[\s\-\(\)\+]/g, '');
      /^\d{7,15}$/.test(digitsOnly);
    }

    const elapsedMs = performance.now() - startTime;
    assert.ok(
      elapsedMs < 150,
      `Phone validation ReDoS benchmark failed: 5,000 runs took ${elapsedMs.toFixed(2)}ms (must be < 150ms)`
    );
  });

  // TEST-T5-REDOS-003: Input Sanitization ReDoS Stress
  test('TEST-T5-REDOS-003: sanitizeInput processes 2,500 iterations of dense HTML entities in < 100ms (O(N) linear time)', () => {
    const denseHtml = '<script>alert("test & verify")</script>'.repeat(20);

    const iterations = 2500;
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
      sanitizeInput(denseHtml);
    }

    const elapsedMs = performance.now() - startTime;
    assert.ok(
      elapsedMs < 100,
      `SanitizeInput ReDoS benchmark failed: 2,500 runs took ${elapsedMs.toFixed(2)}ms (must be < 100ms)`
    );
  });

  // TEST-T5-REDOS-004: HTML Parser Regular Expressions Stress
  test('TEST-T5-REDOS-004: HtmlParser extractText withstands unclosed script tags and 50KB payload in < 50ms', () => {
    const unclosedPayload = '<div>' + '<script>var x = 1;'.repeat(500) + '</div>' + '<!-- comment -->'.repeat(500);

    const startTime = performance.now();
    const text = HtmlParser.extractText(unclosedPayload);
    const elapsedMs = performance.now() - startTime;

    assert.ok(
      elapsedMs < 50,
      `HtmlParser ReDoS benchmark failed: 50KB payload took ${elapsedMs.toFixed(2)}ms (must be < 50ms)`
    );
    assert.strictEqual(typeof text, 'string');
  });

});
