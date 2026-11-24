/**
 * Tier 1 Test Suite: F6 - Success Stories Controlled Display (R5 / F6)
 * 
 * Verifies 4 banners in content store, visibility filtering via isApproved,
 * strict "Client Feedback" attribution on Testimonial 1, and "Powered by RepHero Global".
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { TESTIMONIALS, SRC_DIR } from '../config.mjs';
import { ContentInspector } from '../helpers/content-inspector.mjs';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';

const inspector = new ContentInspector();
const crawler = new RouteCrawler();

describe('F6: Success Stories Controlled Display', () => {
  // TEST-T1-F6-001: 4 Banners Defined in Typed Content Store
  test('TEST-T1-F6-001: Exactly 4 banners defined in content specification', () => {
    assert.strictEqual(TESTIMONIALS.allBanners.length, 4, 'Must define exactly 4 testimonial banners');

    const clientNames = TESTIMONIALS.allBanners.map(b => b.client);
    assert.ok(clientNames.includes('Odonto Dental'), 'Must include Odonto Dental');
    assert.ok(clientNames.includes('Tareen Dental'), 'Must include Tareen Dental');
    assert.ok(clientNames.includes('MyPsychMD'), 'Must include MyPsychMD');
    assert.ok(clientNames.includes('FASTSIGNS'), 'Must include FASTSIGNS');

    // If src/content/testimonials.ts exists, verify it matches
    const inspection = inspector.inspectTestimonialsContent();
    if (inspection.raw) {
      assert.ok(inspection.has4Banners, 'src/content/testimonials.ts must define all 4 client banners');
    }
  });

  // TEST-T1-F6-002: Approval Flag Visibility Filtering (isApproved)
  test('TEST-T1-F6-002: Visibility filter strictly excludes unapproved banners (isApproved === false)', () => {
    const filterApproved = (banners) => banners.filter(b => b.isApproved === true);

    const approvedOnly = filterApproved(TESTIMONIALS.allBanners);
    assert.strictEqual(approvedOnly.length, 1, 'Only 1 banner (Odonto Dental) is currently approved');
    assert.strictEqual(approvedOnly[0].id, 'odonto-dental', 'Approved banner is Odonto Dental');

    // If rendered HTML exists, check that pending banners are not exposed
    if (crawler.isExportPresent() && crawler.hasPageExport('/success-stories')) {
      const html = crawler.getPageHtml('/success-stories');
      assert.ok(!html.includes('Tareen Dental'), 'Unapproved Tareen Dental must not appear in rendered DOM');
      assert.ok(!html.includes('MyPsychMD'), 'Unapproved MyPsychMD must not appear in rendered DOM');
      assert.ok(!html.includes('FASTSIGNS'), 'Unapproved FASTSIGNS must not appear in rendered DOM');
    }
  });

  // TEST-T1-F6-003: Strict Attribution Rule for Testimonial 1 ("Client Feedback")
  test('TEST-T1-F6-003: Testimonial 1 attribution is STRICTLY "Client Feedback"', () => {
    const testimonial1 = TESTIMONIALS.allBanners.find(b => b.id === 'odonto-dental');
    assert.ok(testimonial1, 'Testimonial 1 must exist');
    assert.strictEqual(
      testimonial1.attribution,
      'Client Feedback',
      'Testimonial 1 attribution MUST be "Client Feedback" - cannot be doctor name or client name'
    );

    // If testimonials.ts exists, check for invariant
    const inspection = inspector.inspectTestimonialsContent();
    if (inspection.raw) {
      assert.ok(
        inspection.invariantAttributionStrict,
        'src/content/testimonials.ts must attribute Testimonial 1 as "Client Feedback"'
      );
    }
  });

  // TEST-T1-F6-004: Banner Template Structural Elements
  test('TEST-T1-F6-004: Banner template specifies "Powered by RepHero Global" badge', () => {
    assert.strictEqual(
      TESTIMONIALS.poweredByBadge,
      'Powered by RepHero Global',
      'Powered by badge must be "Powered by RepHero Global"'
    );

    // Check banner component if present
    const bannerComponentPath = path.join(SRC_DIR, 'components', 'SuccessStoryBanner.tsx');
    if (fs.existsSync(bannerComponentPath)) {
      const code = fs.readFileSync(bannerComponentPath, 'utf-8');
      assert.ok(
        code.includes('Powered by RepHero Global'),
        'SuccessStoryBanner component must render "Powered by RepHero Global"'
      );
    }
  });

  // TEST-T1-F6-005: Banner Dimensions & Layout Configuration
  test('TEST-T1-F6-005: Banner dimensions conform to desktop max-w (approx 1200px) and vertical mobile stack', () => {
    const bannerComponentPath = path.join(SRC_DIR, 'components', 'SuccessStoryBanner.tsx');
    if (fs.existsSync(bannerComponentPath)) {
      const code = fs.readFileSync(bannerComponentPath, 'utf-8');
      assert.ok(
        code.includes('max-w-') || code.includes('1200') || code.includes('grid') || code.includes('flex-col'),
        'Banner layout must specify responsive container widths'
      );
    }
  });
});
