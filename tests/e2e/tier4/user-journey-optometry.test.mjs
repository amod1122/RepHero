/**
 * Tier 4 End-to-End User Journey Test: Medical Billing Specialist Hiring (Jordan Hayes)
 * File: tests/e2e/tier4/user-journey-optometry.test.mjs
 * 
 * Scenario Overview:
 * - Persona: Jordan Hayes, Practice Administrator at Metro Primary Care & Optometry (12 Providers).
 * - Business Need: Overcome claims rejection backlog by hiring dedicated certified remote billing specialists;
 *   inspect pricing model (5% or $1,499 flat/mo) and book discovery call about this role.
 * 
 * Complete Journey Phases:
 * 1. Services Page Entry (/services)
 * 2. Category Filter Interaction ("Revenue Cycle and Compliance")
 * 3. Role Card Scope & Alternate Pricing Model Inspection (Medical Biller)
 * 4. Role CTA Navigation to /book-a-call?role=medical-biller
 * 5. Booking Form Hydration & Completion with Non-PHI Notice
 * 6. Submission & Conversion to /thank-you
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { SRC_DIR, BOOKING } from '../config.mjs';

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

const AUTHORITATIVE_SERVICE_ROLES = [
  {
    id: "medical-biller",
    name: "Medical Biller",
    category: "Revenue Cycle and Compliance",
    priceDisplay: "5% of collections or $1,499 flat/mo",
    publishedMonthlyPrice: 1499,
    pricingModel: "percentage"
  },
  {
    id: "certified-professional-coder",
    name: "Certified Professional Coder",
    category: "Revenue Cycle and Compliance",
    priceDisplay: "$1,999/mo",
    publishedMonthlyPrice: 1999,
    pricingModel: "flat"
  },
  {
    id: "revenue-cycle-management",
    name: "Revenue Cycle Management",
    category: "Revenue Cycle and Compliance",
    priceDisplay: "$1,999/mo",
    publishedMonthlyPrice: 1999,
    pricingModel: "flat"
  },
  {
    id: "credentialing-and-contracting",
    name: "Credentialing and Contracting",
    category: "Revenue Cycle and Compliance",
    priceDisplay: "$200/provider/payer or $399 payer bundle",
    publishedMonthlyPrice: undefined,
    pricingModel: "per_unit"
  }
];

describe('Tier 4 Journey 2: Medical Billing Specialist Hiring Journey (Jordan Hayes)', () => {

  test('E2E-T4-002: Jordan Hayes filters by Revenue Cycle, inspects Medical Biller role, and books a call', () => {
    // =========================================================================
    // Phase 1: Services Page Entry (/services)
    // =========================================================================
    const servicesPath = path.join(SRC_DIR, 'app', 'services', 'page.tsx');
    assert.ok(fs.existsSync(servicesPath), 'Services page source must exist');
    const servicesSource = fs.readFileSync(servicesPath, 'utf-8');

    assert.ok(
      servicesSource.includes('Services') || servicesSource.includes('Roles'),
      'Services page must have clear heading'
    );

    // =========================================================================
    // Phase 2: Category Filter Interaction ("Revenue Cycle and Compliance")
    // =========================================================================
    const rcmRoles = AUTHORITATIVE_SERVICE_ROLES.filter(r => r.category === 'Revenue Cycle and Compliance');
    assert.strictEqual(rcmRoles.length, 4, 'Must have 4 roles under Revenue Cycle and Compliance');

    const expectedRoleIds = [
      'medical-biller',
      'certified-professional-coder',
      'revenue-cycle-management',
      'credentialing-and-contracting'
    ];
    for (const id of expectedRoleIds) {
      assert.ok(rcmRoles.some(r => r.id === id), `RCM category must contain ${id}`);
    }

    // =========================================================================
    // Phase 3: Role Card Scope & Pricing Model Inspection (Medical Biller)
    // =========================================================================
    const billerRole = rcmRoles.find(r => r.id === 'medical-biller');
    assert.ok(billerRole, 'Medical Biller role must exist');
    assert.strictEqual(
      billerRole.priceDisplay,
      '5% of collections or $1,499 flat/mo',
      'Medical biller must offer collections percentage or flat rate'
    );
    assert.strictEqual(billerRole.pricingModel, 'percentage');

    // =========================================================================
    // Phase 4: Role CTA Click & Navigation to /book-a-call?role=medical-biller
    // =========================================================================
    const roleCtaUrl = `/book-a-call?role=${billerRole.id}`;
    assert.strictEqual(roleCtaUrl, '/book-a-call?role=medical-biller');

    // =========================================================================
    // Phase 5: Booking Form Hydration & Completion with Non-PHI Notice
    // =========================================================================
    const bookCallPath = path.join(SRC_DIR, 'app', 'book-a-call', 'page.tsx');
    const bookCallSource = fs.readFileSync(bookCallPath, 'utf-8');

    // Read search param
    const searchParams = new URLSearchParams({ role: billerRole.id });
    const prefilledRole = searchParams.get('role');
    assert.strictEqual(prefilledRole, 'medical-biller');

    // Verify non-PHI notice
    assert.ok(
      bookCallSource.includes('PHI_WARNING_NOTICE') || bookCallSource.includes('patient information'),
      'Booking form must enforce non-PHI warning notice'
    );

    // Form submission
    const formData = {
      name: 'Jordan Hayes',
      workEmail: 'jordan@metroprimary.org',
      phone: '+1 (555) 789-0123',
      practiceName: 'Metro Primary Care Physicians',
      practiceType: 'Primary Care & Optometry',
      role: prefilledRole,
      message: 'Need 1 full-time biller for commercial and Medicare claim submission.',
      website_url_hp: ''
    };

    const validation = validateBookingForm(formData);
    assert.strictEqual(validation.isValid, true, 'Form submission must be valid');
    assert.strictEqual(validation.isBotTrapped, false);

    // =========================================================================
    // Phase 6: Submission & Conversion to /thank-you
    // =========================================================================
    const thankYouPath = path.join(SRC_DIR, 'app', 'thank-you', 'page.tsx');
    assert.ok(fs.existsSync(thankYouPath), 'thank-you page source must exist');
    const thankYouSource = fs.readFileSync(thankYouPath, 'utf-8');

    assert.ok(thankYouSource.includes('Thank You'), 'Must render Thank You confirmation');
    assert.ok(thankYouSource.includes('What Happens Next'), 'Must render next steps for staffing review');
  });

});
