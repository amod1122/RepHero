/**
 * Tier 3 Test Suite: Cross-Feature Combinations — Stories to Content
 * File: tests/e2e/tier3/stories-to-content.test.mjs
 * 
 * Sources:
 * - PRD §8.5, PRD §13 Q3 (Testimonial Approval Gating & Attribution Rule)
 * - ORIGINAL_REQUEST.md: R5 (Controlled Display & "Client Feedback" Attribution)
 * - Design Guidelines §7 (Template Specifications & Powered by Badge)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { skipIfNoExport, assertDoesNotContainText } from '../helpers/assertions.mjs';
import { TESTIMONIALS, SRC_DIR } from '../config.mjs';
import { filterApprovedTestimonials, TESTIMONIAL_BANNERS } from '../../../src/content/testimonials.ts';

const crawler = new RouteCrawler();

describe('Tier 3: Success Stories Controlled Display & Attribution Rules', () => {

  // TEST-T3-STOR-001: Baseline Exclusion of Unapproved Testimonials
  test('TEST-T3-STOR-001: Content flag isApproved strictly gates unapproved banners from rendered output', (t) => {
    // 1. Verify content definitions from config
    const approved = TESTIMONIALS.allBanners.filter(b => b.isApproved);
    const unapproved = TESTIMONIALS.allBanners.filter(b => !b.isApproved);

    assert.strictEqual(approved.length, 1, 'Only Testimonial 1 should currently have isApproved: true');
    assert.strictEqual(unapproved.length, 3, 'Testimonials 2, 3, 4 must have isApproved: false');

    const approvedIds = approved.map(b => b.id);
    assert.ok(approvedIds.includes('odonto-dental'));

    // Verify src/content/testimonials.ts file content
    const testimonialsPath = path.join(SRC_DIR, 'content', 'testimonials.ts');
    if (fs.existsSync(testimonialsPath)) {
      const content = fs.readFileSync(testimonialsPath, 'utf-8');
      assert.ok(content.includes('testimonial-odonto-dental'), 'testimonials.ts must include Odonto Dental');
      assert.ok(content.includes('isApproved: true'), 'testimonials.ts must have isApproved: true for Odonto');
      assert.ok(content.includes('isApproved: false'), 'testimonials.ts must have isApproved: false for unapproved');
    }

    // 2. Unapproved client names must NOT leak into rendered HTML if export exists
    if (crawler.isExportPresent() && crawler.hasPageExport('/success-stories')) {
      const html = crawler.getPageHtml('/success-stories');
      assertDoesNotContainText(html, 'Tareen Dental', 'Unapproved Tareen Dental must not appear in HTML');
      assertDoesNotContainText(html, 'MyPsychMD', 'Unapproved MyPsychMD must not appear in HTML');
      assertDoesNotContainText(html, 'FASTSIGNS', 'Unapproved FASTSIGNS must not appear in HTML');
    }
  });

  // TEST-T3-STOR-002: Testimonial 1 Immutable Attribution Rule
  test('TEST-T3-STOR-002: Testimonial 1 attribution is strictly "Client Feedback" and never a client/doctor name', (t) => {
    const banner1 = TESTIMONIALS.allBanners.find(b => b.id === 'odonto-dental');
    assert.ok(banner1, 'Testimonial 1 must exist');

    // Strict positive assertion
    assert.strictEqual(
      banner1.attribution,
      'Client Feedback',
      'Testimonial 1 attribution MUST be exactly "Client Feedback"'
    );

    // Strict negative assertion
    const prohibitedSubstrings = ['Odonto', 'Odonto Dental', 'Dr.', 'Doctor', 'Dentist'];
    for (const forbidden of prohibitedSubstrings) {
      assert.strictEqual(
        banner1.attribution.includes(forbidden),
        false,
        `Attribution must NOT contain client name substring "${forbidden}"`
      );
    }

    // Verify in src/content/testimonials.ts
    const testimonialsPath = path.join(SRC_DIR, 'content', 'testimonials.ts');
    if (fs.existsSync(testimonialsPath)) {
      const content = fs.readFileSync(testimonialsPath, 'utf-8');
      assert.ok(
        content.includes('attribution: "Client Feedback"'),
        'src/content/testimonials.ts must set attribution: "Client Feedback" on Testimonial 1'
      );
    }

    // Verify rendered export if present
    if (crawler.isExportPresent() && crawler.hasPageExport('/success-stories')) {
      const html = crawler.getPageHtml('/success-stories');
      assert.ok(
        HtmlParser.hasText(html, 'Client Feedback'),
        '/success-stories rendered HTML must display "Client Feedback" attribution'
      );
    }
  });

  // TEST-T3-STOR-003: Dynamic Approval Flag Toggling Life Cycle
  test('TEST-T3-STOR-003: Dynamic approval flag filter correctly governs collection inclusion/exclusion', () => {
    // Clone production banners from src/content/testimonials.ts
    const testBanners = JSON.parse(JSON.stringify(TESTIMONIAL_BANNERS));

    // Initially: exactly 1 approved
    let visible = filterApprovedTestimonials(testBanners);
    assert.strictEqual(visible.length, 1);
    assert.strictEqual(visible[0].id, 'testimonial-odonto-dental');

    // Toggle Tareen Dental to approved & published
    const tareen = testBanners.find(b => b.id === 'testimonial-tareen-dental');
    tareen.isApproved = true;
    tareen.status = 'published';

    visible = filterApprovedTestimonials(testBanners);
    assert.strictEqual(visible.length, 2);
    assert.ok(visible.some(b => b.id === 'testimonial-tareen-dental'));

    // Toggle back to false
    tareen.isApproved = false;
    tareen.status = 'pending';
    visible = filterApprovedTestimonials(testBanners);
    assert.strictEqual(visible.length, 1);
    assert.strictEqual(visible.some(b => b.id === 'testimonial-tareen-dental'), false);
  });

  // TEST-T3-STOR-004: Hallmark Branding Mark on Every Approved Banner
  test('TEST-T3-STOR-004: Hallmark branding mark "Powered by RepHero Global" is present on testimonial banner layout', () => {
    assert.strictEqual(
      TESTIMONIALS.poweredByBadge,
      'Powered by RepHero Global',
      'Badge text must be "Powered by RepHero Global"'
    );

    // If static export exists, verify badge string
    if (crawler.isExportPresent() && crawler.hasPageExport('/success-stories')) {
      const html = crawler.getPageHtml('/success-stories');
      assert.ok(
        HtmlParser.hasText(html, 'Powered by RepHero Global'),
        'Success Stories page must render "Powered by RepHero Global"'
      );
    }
  });

  // TEST-T3-STOR-005: Zero Approved Banners Graceful Degradation Test
  test('TEST-T3-STOR-005: Zero approved banners gracefully produces empty list without crashing', () => {
    const testBanners = JSON.parse(JSON.stringify(TESTIMONIAL_BANNERS));
    // Set all to false
    testBanners.forEach(b => { b.isApproved = false; });

    const visible = filterApprovedTestimonials(testBanners);
    assert.strictEqual(visible.length, 0, 'Visible banners count must be 0');

    // Simulating component render condition: visible.length > 0
    const shouldRenderSection = visible.length > 0;
    assert.strictEqual(shouldRenderSection, false, 'Section should gracefully hide or show fallback');
  });

});
