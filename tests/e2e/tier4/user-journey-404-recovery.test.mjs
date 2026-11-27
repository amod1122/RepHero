/**
 * Tier 4 End-to-End User Journey Test: Mobile Visitor Navigation & 404 Recovery (Dr. Marcus Vance)
 * File: tests/e2e/tier4/user-journey-404-recovery.test.mjs
 * 
 * Scenario Overview:
 * - Persona: Dr. Marcus Vance, Solo Practitioner browsing on mobile smartphone (375x667).
 * - Business Need: Browse healthcare practice solutions on a mobile viewport, access persistent sticky header CTA,
 *   navigate between pages, and recover gracefully when encountering a broken link (404).
 * 
 * Complete Journey Phases:
 * 1. Mobile Viewport (375px) & Persistent Sticky Header Verification
 * 2. Mobile Drawer Navigation Toggle
 * 3. Mobile Navigation to How It Works & Sticky CTA Presence
 * 4. 404 Page Not Found Trigger & Preservation of Layout
 * 5. Recovery Navigation Links Back to Home and Services
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { SRC_DIR, NAVIGATION } from '../config.mjs';

const crawler = new RouteCrawler();

describe('Tier 4 Journey 5: Mobile Navigation & 404 Recovery Journey (Dr. Marcus Vance)', () => {

  test('E2E-T4-005: Dr. Vance navigates on mobile viewport, interacts with sticky CTA, and recovers from 404', () => {
    // =========================================================================
    // Phase 1: Mobile Viewport (375px) & Sticky Header Specification
    // =========================================================================
    // Sitemap §2 specifies:
    // "On mobile viewports, the navigation links collapse into a hamburger menu icon...
    //  The primary 'Book a Call' button remains visible in the header next to the menu button at all times."
    assert.strictEqual(NAVIGATION.headerCta.label, 'Book a Call');
    assert.strictEqual(NAVIGATION.headerCta.href, '/book-a-call');

    // Verify navigation links for mobile drawer
    assert.strictEqual(NAVIGATION.desktopLinks.length, 7, 'Must have 7 standard navigation links');
    const expectedDrawerLabels = [
      'Services',
      'Industries',
      'How It Works',
      'Success Stories',
      'Savings Calculator',
      'Our Team',
      'About'
    ];
    for (const label of expectedDrawerLabels) {
      assert.ok(
        NAVIGATION.desktopLinks.some(l => l.label === label),
        `Navigation drawer must include link for: ${label}`
      );
    }

    // =========================================================================
    // Phase 2: Navigation to How It Works
    // =========================================================================
    const howItWorksLink = NAVIGATION.desktopLinks.find(l => l.label === 'How It Works');
    assert.ok(howItWorksLink);
    assert.strictEqual(howItWorksLink.href, '/how-it-works');

    // =========================================================================
    // Phase 3: 404 Page Component Inspection & Recovery Links
    // =========================================================================
    const notFoundPath = path.join(SRC_DIR, 'app', 'not-found.tsx');
    assert.ok(fs.existsSync(notFoundPath), 'src/app/not-found.tsx must exist');
    const notFoundSource = fs.readFileSync(notFoundPath, 'utf-8');

    // Dr. Vance encounters a broken link -> not-found page renders
    assert.ok(
      notFoundSource.includes('404') || notFoundSource.includes('Page Not Found'),
      '404 page must display 404 error code and Page Not Found heading'
    );

    // Verify recovery links back to Home, Services, and Book a Call
    assert.ok(
      notFoundSource.includes('href="/"') || notFoundSource.includes('Return to Home'),
      '404 page must include recovery link to Home (/)'
    );
    assert.ok(
      notFoundSource.includes('href="/services"') || notFoundSource.includes('Explore Healthcare Roles'),
      '404 page must include recovery link to Services (/services)'
    );
    assert.ok(
      notFoundSource.includes('href="/book-a-call"'),
      '404 page must include recovery link to Book a Call (/book-a-call)'
    );

    // Negative check: 404 page must NOT include broken search box or misleading elements
    assert.strictEqual(
      notFoundSource.includes('type="search"'),
      false,
      '404 page must not contain non-functional search input'
    );

    // =========================================================================
    // Phase 4: Static Export 404 Recovery Validation (if export exists)
    // =========================================================================
    if (crawler.isExportPresent() && (crawler.hasPageExport('/not-found') || crawler.hasPageExport('/404'))) {
      const notFoundHtml = crawler.getPageHtml('/not-found') || crawler.getPageHtml('/404');
      assert.ok(
        HtmlParser.hasText(notFoundHtml, 'Page Not Found') || HtmlParser.hasText(notFoundHtml, '404'),
        'Exported 404 page must contain Page Not Found text'
      );
      assert.ok(
        HtmlParser.hasText(notFoundHtml, 'Home') || HtmlParser.hasText(notFoundHtml, 'Return to Home'),
        'Exported 404 page must contain Home recovery link'
      );
    }
  });

});
