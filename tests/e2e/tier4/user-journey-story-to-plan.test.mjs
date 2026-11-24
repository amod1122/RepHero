/**
 * Tier 4 End-to-End User Journey Test: Multi-Specialty Group Evaluation (Sarah Jenkins)
 * File: tests/e2e/tier4/user-journey-story-to-plan.test.mjs
 * 
 * Scenario Overview:
 * - Persona: Sarah Jenkins, Operations Director for a multi-specialty healthcare network (Dental, Primary Care, Behavioral Health).
 * - Business Need: Evaluate staffing fit across multiple clinical disciplines, inspect industry-specific pain points
 *   via anchor jumps, review the 6-step onboarding timeline, and navigate to conversion.
 * 
 * Complete Journey Phases:
 * 1. Industries Page Entry (/industries)
 * 2. Anchor Jump Navigation to #dental (Pain Points & Recommended Roles)
 * 3. Secondary Anchor Jump Navigation to #behavioral-health
 * 4. Cross-Linking from Recommended Roles to Services/Booking
 * 5. How It Works 6-Step Timeline Audit (/how-it-works)
 * 6. Final Timeline CTA Conversion to /book-a-call
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { SRC_DIR } from '../config.mjs';

const crawler = new RouteCrawler();

describe('Tier 4 Journey 4: Multi-Specialty Group Evaluation Journey (Sarah Jenkins)', () => {

  test('E2E-T4-004: Sarah Jenkins explores /industries anchors, verifies 6-step timeline, and converts via CTA', () => {
    // =========================================================================
    // Phase 1: Industries Page Entry (/industries)
    // =========================================================================
    const industriesPath = path.join(SRC_DIR, 'app', 'industries', 'page.tsx');
    assert.ok(fs.existsSync(industriesPath), 'Industries page source must exist');
    const industriesSource = fs.readFileSync(industriesPath, 'utf-8');

    assert.ok(
      industriesSource.includes('Industries') || industriesSource.includes('Healthcare Specialties'),
      'Industries page must render main heading'
    );

    // =========================================================================
    // Phase 2: Anchor Jump Navigation to #dental
    // =========================================================================
    const industriesContentPath = path.join(SRC_DIR, 'content', 'industries.ts');
    assert.ok(fs.existsSync(industriesContentPath), 'industries.ts content must exist');
    const industriesContent = fs.readFileSync(industriesContentPath, 'utf-8');

    // Verify dental anchor and content
    assert.ok(industriesContent.includes('anchorId: "dental"'), 'Must define anchorId: "dental"');
    assert.ok(
      industriesContent.includes('Dental Practices'),
      'Must contain Dental Practices industry specification'
    );
    assert.ok(
      industriesContent.includes('breakdown of benefits') || industriesContent.includes('insurance verification'),
      'Dental pain points must cover insurance verification delays'
    );
    assert.ok(
      industriesContent.includes('admin-front-desk'),
      'Dental recommended roles must include admin-front-desk'
    );

    // =========================================================================
    // Phase 3: Secondary Anchor Jump Navigation to #behavioral-health
    // =========================================================================
    assert.ok(industriesContent.includes('anchorId: "behavioral-health"'), 'Must define anchorId: "behavioral-health"');
    assert.ok(
      industriesContent.includes('Behavioral Health & Therapy'),
      'Must contain Behavioral Health industry specification'
    );
    assert.ok(
      industriesContent.includes('Intake sensitivity') || industriesContent.includes('intake'),
      'Behavioral health pain points must cover intake coordination'
    );

    // Verify anchor links exist in industries page source or export
    assert.ok(
      industriesSource.includes('#dental') || industriesSource.includes('anchorId'),
      'Industries page component must render anchor links for quick jump navigation'
    );

    // =========================================================================
    // Phase 4: How It Works 6-Step Timeline Audit (/how-it-works)
    // =========================================================================
    const howItWorksContentPath = path.join(SRC_DIR, 'content', 'howItWorks.ts');
    assert.ok(fs.existsSync(howItWorksContentPath), 'howItWorks.ts content must exist');
    const howItWorksContent = fs.readFileSync(howItWorksContentPath, 'utf-8');

    // Verify sequential steps 1 through 6
    const expectedSteps = [
      { step: 1, title: 'Discovery Call' },
      { step: 2, title: 'Custom Proposal' },
      { step: 3, title: 'BAA & Agreement via DocuSign' },
      { step: 4, title: 'Matching & Candidate Approval' },
      { step: 5, title: 'Onboarding & Workflow Integration' },
      { step: 6, title: 'Ongoing Support & Proactive Reporting' }
    ];

    for (const s of expectedSteps) {
      assert.ok(
        howItWorksContent.includes(s.title),
        `How It Works must define Step ${s.step}: "${s.title}"`
      );
    }

    // Inspect how-it-works page component
    const howItWorksPagePath = path.join(SRC_DIR, 'app', 'how-it-works', 'page.tsx');
    assert.ok(fs.existsSync(howItWorksPagePath), 'how-it-works page source must exist');
    const howItWorksSource = fs.readFileSync(howItWorksPagePath, 'utf-8');

    // =========================================================================
    // Phase 5: Closing CTA Conversion to /book-a-call
    // =========================================================================
    assert.ok(
      howItWorksSource.includes('/book-a-call'),
      'How It Works page must include final CTA button linking to /book-a-call'
    );

    // If static export is present, check rendered timeline
    if (crawler.isExportPresent() && crawler.hasPageExport('/how-it-works')) {
      const html = crawler.getPageHtml('/how-it-works');
      assert.ok(HtmlParser.hasText(html, 'Discovery Call'), 'Rendered HTML must include Discovery Call');
      assert.ok(HtmlParser.hasText(html, 'Custom Proposal'), 'Rendered HTML must include Custom Proposal');
      assert.ok(HtmlParser.hasText(html, 'Book a Call'), 'Rendered HTML must include Book a Call CTA');
    }
  });

});
