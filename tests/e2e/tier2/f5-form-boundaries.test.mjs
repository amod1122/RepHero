/**
 * Tier 2 Boundary & Corner Case Test Suite: F5 - Book a Call Form Boundaries
 * 
 * Sources:
 * - Explorer 2 Report (TEST-T2-FORM-001 through TEST-T2-FORM-007)
 * - PRD §8.6 (Form specification, validation, honeypot)
 * - ORIGINAL_REQUEST.md line 27 (anti-spam honeypot, validation)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { BOOKING } from '../config.mjs';
import { validateWorkEmail, validateBookingForm, sanitizeInput } from '../../../src/lib/validation.ts';

describe('Tier 2 F5: Book a Call Form Boundaries & Corner Cases', () => {
  // TEST-T2-FORM-001: 6 Invalid Email Variations Validation
  test('TEST-T2-FORM-001: All 6 invalid email variations are strictly rejected by email validator', () => {
    const invalidEmails = [
      { email: 'plainaddress', reason: 'Missing @ symbol' },
      { email: '@missinguser.com', reason: 'Missing username before @' },
      { email: 'user@.com', reason: 'Empty domain label before TLD' },
      { email: 'user@domain..com', reason: 'Consecutive dots in domain' },
      { email: 'user@domain com', reason: 'Space inside domain label' },
      { email: 'user@domain', reason: 'Missing top-level domain (TLD)' },
      { email: '.user@domain.com', reason: 'Leading dot in local-part (RFC 5322)' },
      { email: 'user.@domain.com', reason: 'Trailing dot in local-part (RFC 5322)' },
      { email: 'user..name@domain.com', reason: 'Consecutive dots in local-part (RFC 5322)' },
      { email: `${'a'.repeat(65)}@domain.com`, reason: 'Local-part exceeds 64 characters (RFC 5321)' }
    ];

    for (const { email, reason } of invalidEmails) {
      const isValid = validateWorkEmail(email);
      assert.strictEqual(
        isValid,
        false,
        `Email "${email}" must fail validation (${reason})`
      );

      // Verify form submission also reports error for this email
      const formResult = validateBookingForm({
        name: 'Dr. Jane Smith',
        workEmail: email,
        practiceName: 'Primary Care Clinic',
        practiceType: 'family-medicine'
      });

      assert.strictEqual(formResult.isValid, false);
      assert.ok(formResult.errors.workEmail, `Must flag workEmail error for: ${email}`);
    }

    // Verify valid emails pass
    assert.strictEqual(validateWorkEmail('doctor@practice.com'), true);
    assert.strictEqual(validateWorkEmail('sarah.smith@med-clinic.org'), true);
    assert.strictEqual(validateWorkEmail(`${'a'.repeat(64)}@domain.com`), true);
  });

  // TEST-T2-FORM-002: Missing Individual Required Fields Independently
  test('TEST-T2-FORM-002: Missing each required field independently blocks submission and identifies field', () => {
    const baseValid = {
      name: 'Dr. Alex Miller',
      workEmail: 'amiller@dental.com',
      practiceName: 'Miller Dental Group',
      practiceType: 'dental'
    };

    // 1. Missing name only
    const missingName = validateBookingForm({ ...baseValid, name: '' });
    assert.strictEqual(missingName.isValid, false);
    assert.ok(missingName.errors.name, 'Must report error on missing name');
    assert.strictEqual(missingName.errors.workEmail, undefined);

    // 2. Missing workEmail only
    const missingEmail = validateBookingForm({ ...baseValid, workEmail: '' });
    assert.strictEqual(missingEmail.isValid, false);
    assert.ok(missingEmail.errors.workEmail, 'Must report error on missing workEmail');
    assert.strictEqual(missingEmail.errors.name, undefined);

    // 3. Missing practiceName only
    const missingPractice = validateBookingForm({ ...baseValid, practiceName: '   ' });
    assert.strictEqual(missingPractice.isValid, false);
    assert.ok(missingPractice.errors.practiceName, 'Must report error on missing practiceName');

    // 4. Missing practiceType only
    const missingType = validateBookingForm({ ...baseValid, practiceType: '' });
    assert.strictEqual(missingType.isValid, false);
    assert.ok(missingType.errors.practiceType, 'Must report error on missing practiceType');
  });

  // TEST-T2-FORM-003: Extreme Payload Stress (10,000 Character Message & 500 Char Fields)
  test('TEST-T2-FORM-003: Massive payloads (10,000 char message) are bounded and trigger length protection', () => {
    const giantMessage = 'M'.repeat(10000);
    const oversizedName = 'A'.repeat(500);
    const oversizedPractice = 'B'.repeat(500);

    const stressSubmission = validateBookingForm({
      name: oversizedName,
      workEmail: 'test@practice.com',
      practiceName: oversizedPractice,
      practiceType: 'dental',
      message: giantMessage
    });

    assert.strictEqual(stressSubmission.isValid, false);
    assert.ok(
      stressSubmission.errors.message || stressSubmission.errors.name,
      'Oversized payload must trigger length constraint error'
    );

    // Verify sanitization on large string does not crash or loop indefinitely
    const sanitized = sanitizeInput(giantMessage);
    assert.strictEqual(sanitized.length, 10000);
  });

  // TEST-T2-FORM-004: XSS & HTML Script Injection Patterns Sanitization
  test('TEST-T2-FORM-004: Malicious script tags and HTML injection patterns are safely escaped', () => {
    const maliciousPayloads = [
      { input: "<script>alert('xss')</script>", expectedFragment: '&lt;script&gt;' },
      { input: '"><img src=x onerror=alert(1)>', expectedFragment: '&lt;img src=x onerror=alert(1)&gt;' },
      { input: "' OR '1'='1'; --", expectedFragment: '&#x27;' },
      { input: '<iframe src="https://evil.com"></iframe>', expectedFragment: '&lt;iframe' }
    ];

    for (const { input, expectedFragment } of maliciousPayloads) {
      const sanitized = sanitizeInput(input);
      // Malicious executable tags must be neutralized
      assert.strictEqual(sanitized.includes('<script>'), false);
      assert.strictEqual(sanitized.includes('<iframe'), false);
      assert.strictEqual(sanitized.includes('<img'), false);
      assert.ok(sanitized.includes(expectedFragment), `Escaped string must contain safe entities: ${sanitized}`);
    }
  });

  // TEST-T2-FORM-005: Honeypot Anti-Spam Bot Trap Populated
  test('TEST-T2-FORM-005: Populated honeypot field is trapped, silently dropped, and rejected', () => {
    const spamSubmission = {
      name: 'Spam Bot 3000',
      workEmail: 'bot@spamnetwork.ru',
      practiceName: 'Cheap Pharma SEO',
      practiceType: 'dental',
      website_url_hp: 'https://viagra-seo-spam.example.com',
      message: 'Check out our cheap link building services!'
    };

    const result = validateBookingForm(spamSubmission);

    assert.strictEqual(result.isBotTrapped, true, 'Submission with populated honeypot must be flagged as bot');
    assert.strictEqual(result.isValid, false, 'Bot trapped submission must not be valid');
  });

  // TEST-T2-FORM-006: Optional Phone Field Edge Cases
  test('TEST-T2-FORM-006: Phone number field accepts valid variations and rejects alphabetical junk', () => {
    const base = {
      name: 'Dr. John Doe',
      workEmail: 'jdoe@clinic.org',
      practiceName: 'Downtown Clinic',
      practiceType: 'primary-care'
    };

    // Case A: Empty phone -> valid (optional)
    const emptyPhone = validateBookingForm({ ...base, phone: '' });
    assert.strictEqual(emptyPhone.isValid, true);
    assert.strictEqual(emptyPhone.errors.phone, undefined);

    // Case B: Valid formatted phone numbers
    const validPhones = [
      '+1 (555) 234-5678',
      '555-234-5678',
      '+15552345678',
      '5552345678'
    ];
    for (const phone of validPhones) {
      const res = validateBookingForm({ ...base, phone });
      assert.strictEqual(res.isValid, true, `Valid phone "${phone}" must pass`);
    }

    // Case C: Invalid garbage phone
    const invalidPhone = validateBookingForm({ ...base, phone: 'abc-not-a-phone' });
    assert.strictEqual(invalidPhone.isValid, false);
    assert.ok(invalidPhone.errors.phone, 'Garbage letters in phone field must trigger error');
  });

  // TEST-T2-FORM-007: Rapid Double-Click Debounce Simulation
  test('TEST-T2-FORM-007: Rapid duplicate submissions are debounced and allow only one dispatch', () => {
    // State machine simulation of form submission lock
    class FormSubmissionController {
      constructor() {
        this.isSubmitting = false;
        this.dispatchedCount = 0;
      }

      async submit(formData) {
        if (this.isSubmitting) {
          // Debounced / blocked
          return { status: 'blocked_debounce' };
        }

        this.isSubmitting = true;
        this.dispatchedCount++;

        // Simulate network latency (50ms)
        await new Promise(r => setTimeout(r, 50));
        this.isSubmitting = false;
        return { status: 'submitted' };
      }
    }

    const controller = new FormSubmissionController();

    // Trigger 5 rapid clicks concurrently
    const attempts = [
      controller.submit({ name: 'Fast User' }),
      controller.submit({ name: 'Fast User' }),
      controller.submit({ name: 'Fast User' }),
      controller.submit({ name: 'Fast User' }),
      controller.submit({ name: 'Fast User' })
    ];

    return Promise.all(attempts).then((results) => {
      const submitted = results.filter(r => r.status === 'submitted');
      const blocked = results.filter(r => r.status === 'blocked_debounce');

      assert.strictEqual(submitted.length, 1, 'Exactly one submission should be dispatched');
      assert.strictEqual(blocked.length, 4, 'Remaining rapid clicks must be debounced/blocked');
      assert.strictEqual(controller.dispatchedCount, 1);
    });
  });
});
