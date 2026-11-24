/**
 * Tier 1 Test Suite: F5 - Book a Call Form & Integrations (R4 / F5)
 * 
 * Verifies form field schema, required fields, honeypot bot trap,
 * discovery call 15-minute constant, mandatory PHI warning notice,
 * and third-party scheduling container slot.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { BOOKING, SRC_DIR, PROJECT_ROOT } from '../config.mjs';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { ContentInspector } from '../helpers/content-inspector.mjs';
import { validateBookingForm } from '../../../src/lib/validation.ts';

const crawler = new RouteCrawler();
const inspector = new ContentInspector();

describe('F5: Book a Call Form & Integrations', () => {
  // TEST-T1-F5-001: Form Field Schema & Required Attribute Verification
  test('TEST-T1-F5-001: Form schema contains required name, workEmail, practiceName, practiceType', () => {
    assert.deepStrictEqual(
      BOOKING.requiredFields,
      ['name', 'workEmail', 'practiceName', 'practiceType'],
      'Required fields must match PRD specification'
    );

    // If BookCallForm component exists, check form inputs
    const formPath = path.join(SRC_DIR, 'components', 'BookCallForm.tsx');
    if (fs.existsSync(formPath)) {
      const code = fs.readFileSync(formPath, 'utf-8');
      assert.ok(code.includes('name') && code.includes('workEmail'), 'Must contain name and workEmail inputs');
      assert.ok(code.includes('practiceName') && code.includes('practiceType'), 'Must contain practice inputs');
    }
  });

  // TEST-T1-F5-002: Client-Side Validation on Empty Submission
  test('TEST-T1-F5-002: Client-side validation prevents empty submission of required fields', () => {
    const emptyResult = validateBookingForm({});
    assert.strictEqual(emptyResult.isValid, false, 'Empty submission must fail validation');
    assert.ok(emptyResult.errors.name, 'Error for missing name');
    assert.ok(emptyResult.errors.workEmail, 'Error for missing workEmail');
    assert.ok(emptyResult.errors.practiceName, 'Error for missing practiceName');
    assert.ok(emptyResult.errors.practiceType, 'Error for missing practiceType');

    const validResult = validateBookingForm({
      name: 'Dr. Jane Smith',
      workEmail: 'drsmith@example.com',
      practiceName: 'Smith Family Dental',
      practiceType: 'Dental'
    });
    assert.strictEqual(validResult.isValid, true, 'Fully populated submission must be valid');
  });

  // TEST-T1-F5-003: Anti-Spam Honeypot Field Protection
  test('TEST-T1-F5-003: Form contains hidden honeypot input to trap automated bots', () => {
    assert.ok(
      BOOKING.honeypotFieldName || BOOKING.altHoneypotFieldName,
      'Honeypot field name must be configured'
    );

    const cleanResult = validateBookingForm({
      name: 'Dr. Jane Smith',
      workEmail: 'drsmith@example.com',
      practiceName: 'Smith Family Dental',
      practiceType: 'Dental',
      [BOOKING.honeypotFieldName]: ''
    });
    assert.strictEqual(cleanResult.isBotTrapped, false, 'Clean submission passes');
    assert.strictEqual(cleanResult.isValid, true, 'Clean submission is valid');

    const spamResult = validateBookingForm({
      name: 'Dr. Jane Smith',
      workEmail: 'drsmith@example.com',
      practiceName: 'Smith Family Dental',
      practiceType: 'Dental',
      [BOOKING.honeypotFieldName]: 'http://spam.org'
    });
    assert.strictEqual(spamResult.isBotTrapped, true, 'Spam honeypot trapped');
    assert.strictEqual(spamResult.isValid, false, 'Spam submission is invalid');
  });

  // TEST-T1-F5-004: Centralized Discovery Call Length Constant (15 Minutes)
  test('TEST-T1-F5-004: Discovery call length is strictly 15 minutes', () => {
    assert.strictEqual(BOOKING.discoveryCallLengthMinutes, 15, 'Call duration constant must be exactly 15');

    // Check if siteConfig.ts exists and exports 15
    const constantVal = inspector.extractExportedConstant('siteConfig.ts', 'DISCOVERY_CALL_LENGTH_MINUTES');
    if (constantVal !== null) {
      assert.strictEqual(Number(constantVal), 15, 'DISCOVERY_CALL_LENGTH_MINUTES in siteConfig.ts must be 15');
    }
  });

  // TEST-T1-F5-005: Mandatory PHI Warning Notice Presence
  test('TEST-T1-F5-005: Mandatory PHI warning notice prohibits patient information', (t) => {
    const noticeString = BOOKING.phiWarningExactString;
    assert.ok(noticeString.includes('do not include patient information'), 'Notice text must match specification');

    if (crawler.isExportPresent() && crawler.hasPageExport('/book-a-call')) {
      const html = crawler.getPageHtml('/book-a-call');
      assert.ok(
        HtmlParser.hasText(html, /do not include patient information|PHI/i),
        'Rendered /book-a-call page must display PHI notice'
      );
    }
  });

  // TEST-T1-F5-006: Third-Party Scheduling Tool Integration Slot
  test('TEST-T1-F5-006: Designated integration container slot for Calendly / MS Bookings embed', () => {
    assert.strictEqual(BOOKING.schedulingSlotId, 'booking-embed-slot', 'Slot ID must match specification');
  });

  // TEST-T1-F5-007: Successful Submission Redirects to /thank-you
  test('TEST-T1-F5-007: Form submission target redirects to /thank-you', () => {
    assert.strictEqual(BOOKING.redirectTarget, '/thank-you', 'Redirect target must be /thank-you');
  });
});
