/**
 * Tier 2 Boundary & Corner Case Test Suite: F6 - Success Stories Boundaries
 * 
 * Sources:
 * - Explorer 2 Report (TEST-T2-TEST-001 through TEST-T2-TEST-005)
 * - PRD §8.5 (Success stories, approval flag, 4 banners)
 * - PRD §13 line 292 (Strict Testimonial 1 attribution rule: "Client Feedback")
 * - ORIGINAL_REQUEST.md R5 line 31
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TESTIMONIALS } from '../config.mjs';
import {
  filterApprovedTestimonials,
  getEnforcedAttribution,
  getEnforcedAttribution as enforceAttributionInvariant,
  resolveClientLogo,
  TESTIMONIAL_BANNERS
} from '../../../src/content/testimonials.ts';

describe('Tier 2 F6: Success Stories Controlled Display Boundaries', () => {
  // TEST-T2-TEST-001: All Flags False (Empty State Graceful Handling)
  test('TEST-T2-TEST-001: All approval flags false yields clean empty state without runtime exceptions', () => {
    const mockAllFalse = TESTIMONIALS.allBanners.map(b => ({
      ...b,
      isApproved: false
    }));

    const visibleBanners = filterApprovedTestimonials(mockAllFalse);

    // Must return an empty array without throwing TypeError
    assert.ok(Array.isArray(visibleBanners), 'Result must be an array');
    assert.strictEqual(visibleBanners.length, 0, 'No banners must be visible when all flags are false');

    // Rendering simulation: Empty array should trigger graceful empty fallback
    const renderSuccessStories = (banners) => {
      if (banners.length === 0) {
        return {
          hasBanners: false,
          fallbackMessage: 'Client case studies available upon request during discovery call.'
        };
      }
      return { hasBanners: true, count: banners.length };
    };

    const uiState = renderSuccessStories(visibleBanners);
    assert.strictEqual(uiState.hasBanners, false);
    assert.ok(uiState.fallbackMessage.length > 0, 'Must provide an elegant fallback message');
  });

  // TEST-T2-TEST-002: All Flags True (Full 4 Banners Rendered Without Key Collisions)
  test('TEST-T2-TEST-002: All approval flags true yields all 4 banners with unique keys and required attributes', () => {
    const mockAllTrue = TESTIMONIALS.allBanners.map(b => ({
      ...b,
      isApproved: true,
      status: 'published'
    }));

    const visibleBanners = filterApprovedTestimonials(mockAllTrue);

    assert.strictEqual(visibleBanners.length, 4, 'All 4 banners must be visible when all flags are true');

    // Key uniqueness check (no React key collisions)
    const idSet = new Set();
    for (const banner of visibleBanners) {
      assert.ok(banner.id, 'Every banner must have a defined ID');
      assert.ok(!idSet.has(banner.id), `Duplicate banner ID detected: ${banner.id}`);
      idSet.add(banner.id);

      // Verify essential properties
      assert.ok(banner.client, `Banner ${banner.id} must define client name`);
      assert.ok(banner.service, `Banner ${banner.id} must define service`);
    }

    assert.strictEqual(idSet.size, 4, 'All 4 banner IDs must be strictly unique');
  });

  // TEST-T2-TEST-003: Missing Client Logo Fallback to Text Wordmark
  test('TEST-T2-TEST-003: Missing or null client logo cleanly falls back to text wordmark or badge', () => {
    const mockBannerNoLogo = {
      id: 'test-dental',
      client: 'Apex Specialty Care',
      logoUrl: null,
      logoPlaceholder: 'Apex Specialty Care (Logo Pending)',
      isApproved: true
    };

    const resolved = resolveClientLogo(mockBannerNoLogo);

    assert.strictEqual(resolved.type, 'wordmark', 'Missing logoUrl must resolve to wordmark');
    assert.strictEqual(
      resolved.content,
      'Apex Specialty Care',
      'Wordmark text must use client name'
    );

    // Empty string logoUrl
    const mockBannerEmptyLogo = {
      ...mockBannerNoLogo,
      logoUrl: '   '
    };
    const resolvedEmpty = resolveClientLogo(mockBannerEmptyLogo);
    assert.strictEqual(resolvedEmpty.type, 'wordmark');
  });

  // TEST-T2-TEST-004: Unknown / Invalid Testimonial ID Query Resilience
  test('TEST-T2-TEST-004: Querying or filtering by invalid testimonial ID safely returns null/undefined without crashing', () => {
    const findTestimonialById = (banners, targetId) => {
      if (!Array.isArray(banners)) return undefined;
      return banners.find(b => b.id === targetId);
    };

    const result = findTestimonialById(TESTIMONIALS.allBanners, 'unknown-non-existent-banner-999');
    assert.strictEqual(result, undefined, 'Invalid ID lookup must return undefined');

    // Null or undefined array check
    assert.strictEqual(findTestimonialById(null, 'odonto-dental'), undefined);
    assert.strictEqual(findTestimonialById(undefined, 'odonto-dental'), undefined);
  });

  // TEST-T2-TEST-005: Adversarial Attribution Tamper Attempt on Testimonial 1
  test('TEST-T2-TEST-005: Adversarial attempt to override Testimonial 1 attribution is strictly rejected', () => {
    // PRD §8.5, PRD §13 line 292, Essentials §3 line 78:
    // Invariant: Testimonial 1 attribution must strictly be "Client Feedback",
    // never the client name or an individual doctor name.

    const adversarialTamperAttempts = [
      { id: 'odonto-dental', client: 'Odonto Dental', attribution: 'Dr. John Doe, DDS' },
      { id: 'testimonial-odonto-dental', client: 'Odonto Dental', attribution: 'Odonto Dental Practice Manager' },
      { id: 'odonto-dental', client: 'Odonto Dental', attribution: 'Anonymous Dentist' },
      { id: 'testimonial-odonto-dental', client: 'Odonto Dental', attribution: '' }
    ];

    for (const tamperedItem of adversarialTamperAttempts) {
      const enforcedAttribution = enforceAttributionInvariant(tamperedItem);

      // Must strictly override to "Client Feedback"
      assert.strictEqual(
        enforcedAttribution,
        'Client Feedback',
        `Adversarial attribution "${tamperedItem.attribution}" must be rejected and reset to "Client Feedback"`
      );
    }
  });
});
