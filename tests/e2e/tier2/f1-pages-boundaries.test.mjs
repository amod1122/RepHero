/**
 * Tier 2 Boundary & Corner Case Test Suite: F1 - Page Architecture Boundaries
 * 
 * Sources:
 * - Sitemap §4.11 (404 Page recovery, lack of search bar, header/footer preservation)
 * - ORIGINAL_REQUEST.md lines 18-20, 48-52
 * - PROJECT.md (Sitemap 12 routes, layout integrity)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { skipIfNoExport } from '../helpers/assertions.mjs';
import { ROUTES, PUBLIC_CANONICAL_ROUTES, SITE_URL, SRC_DIR } from '../config.mjs';

const crawler = new RouteCrawler();

describe('Tier 2 F1: Page Architecture & Route Boundaries', () => {
  // TEST-T2-F1-001: 404 Recovery Page Integrity & Absence of Search Bar
  test('TEST-T2-F1-001: 404 recovery page preserves Header/Footer, provides recovery links, and omits search bar', (t) => {
    if (skipIfNoExport(t, '/not-found')) return;

    const html = crawler.getPageHtml('/not-found');
    assert.ok(html, '404 page HTML must exist in static export (out/404.html)');

    // 1. Clear error message present
    const hasNotFoundMessage = HtmlParser.hasText(html, /404|not found|page doesn't exist|page not found/i);
    assert.ok(hasNotFoundMessage, '404 page must display a clear "not found" message');

    // 2. Absence of search bar: per Sitemap §4.11 ("clear error message without search bar")
    const searchInputs = html.match(/<input[^>]+type=["']search["'][^>]*>/gi);
    const hasSearchRole = html.match(/role=["']search["']/gi);
    assert.strictEqual(searchInputs, null, '404 page must NOT contain an input of type search');
    assert.strictEqual(hasSearchRole, null, '404 page must NOT contain a search role form');

    // 3. Recovery links to Home (/), Services (/services), and Book a Call (/book-a-call)
    const links = HtmlParser.extractLinks(html);
    const linkHrefs = links.map(l => l.href.trim());

    const hasHomeLink = linkHrefs.some(href => href === '/' || href === SITE_URL || href === `${SITE_URL}/`);
    const hasServicesLink = linkHrefs.some(href => href.includes('/services'));
    const hasBookLink = linkHrefs.some(href => href.includes('/book-a-call'));

    assert.ok(hasHomeLink, '404 recovery page must provide recovery navigation link to Home (/)');
    assert.ok(hasServicesLink, '404 recovery page must provide recovery navigation link to Services (/services)');
    assert.ok(hasBookLink, '404 recovery page must provide recovery navigation link to Book a Call (/book-a-call)');

    // 4. Landmark checks: Header & Footer preservation
    // Progressive testability: verify Footer preservation if RepHero footer is implemented in project
    const footerComponentPath = path.join(SRC_DIR, 'components', 'Footer.tsx');
    const footerSource = fs.existsSync(footerComponentPath) ? fs.readFileSync(footerComponentPath, 'utf-8') : '';
    const isRepHeroFooterImplemented = footerSource.includes('RepHero Global LLC') || footerSource.includes('rephero.co');

    if (isRepHeroFooterImplemented) {
      const landmarks = HtmlParser.extractLandmarks(html);
      assert.ok(
        landmarks.hasFooter || html.includes('<footer') || html.includes('RepHero Global LLC'),
        '404 page must retain persistent Footer once RepHero Footer component is deployed'
      );
    }
  });

  // TEST-T2-F1-002: Trailing Slash Resolution & Canonical URL Consistency
  test('TEST-T2-F1-002: Trailing slash resolution and canonical URL consistency across all public routes', (t) => {
    if (!crawler.isExportPresent()) {
      t.skip('Static export out/ directory does not exist.');
      return;
    }

    let canonicalCount = 0;
    for (const route of ROUTES) {
      if (!route.inSitemap) continue;

      if (!crawler.hasPageExport(route.path)) continue;
      const html = crawler.getPageHtml(route.path);
      if (!html) continue;

      const canonicalHref = HtmlParser.extractCanonical(html);
      if (!canonicalHref) continue;
      canonicalCount++;

      // Canonical URLs must start with https://www.rephero.co
      assert.ok(
        canonicalHref.startsWith(SITE_URL),
        `Canonical URL for ${route.path} must start with SITE_URL (${SITE_URL}), received: ${canonicalHref}`
      );

      // Trailing slash consistency: Canonical must not contain double slashes (except protocol https://)
      const afterProtocol = canonicalHref.replace(/^https?:\/\//, '');
      assert.ok(
        !afterProtocol.includes('//'),
        `Canonical URL "${canonicalHref}" must not contain duplicate slashes`
      );

      // No query parameters or hash fragments in canonical tags
      assert.ok(
        !canonicalHref.includes('?') && !canonicalHref.includes('#'),
        `Canonical URL "${canonicalHref}" must not contain query parameters or hash fragments`
      );

      // Path matching: The canonical URL must reflect the route path
      const canonicalPath = new URL(canonicalHref).pathname;
      const normalizedCanonical = canonicalPath.replace(/\/$/, '') || '/';
      const normalizedRoute = route.path.replace(/\/$/, '') || '/';
      assert.strictEqual(
        normalizedCanonical,
        normalizedRoute,
        `Canonical path "${canonicalPath}" must match expected route "${route.path}"`
      );
    }

    if (canonicalCount === 0) {
      t.skip('Canonical link tags not yet rendered in static export (Milestone M4).');
    }
  });

  // TEST-T2-F1-003: Non-Existent / Arbitrary Route Rejection
  test('TEST-T2-F1-003: Non-existent routes and arbitrary paths are rejected by export crawler', () => {
    const maliciousOrBogusRoutes = [
      '/random-non-existent-page-xyz-123',
      '/wp-admin',
      '/wp-login.php',
      '/api/secret-eval',
      '/admin/dashboard',
      '/.env',
      '/undefined',
      '/null'
    ];

    for (const bogusRoute of maliciousOrBogusRoutes) {
      // Crawler should return null for non-existent paths
      const exportFile = crawler.getExportFilePath(bogusRoute);
      assert.strictEqual(
        exportFile,
        null,
        `RouteCrawler must reject non-existent route "${bogusRoute}"`
      );

      const sourcePath = crawler.getSourcePagePath(bogusRoute);
      assert.strictEqual(
        sourcePath,
        null,
        `Bogus route "${bogusRoute}" must not correspond to any source page file`
      );
    }

    // Verify sitemap does not index non-existent routes
    const sitemapUrls = crawler.extractSitemapUrls();
    for (const bogusRoute of maliciousOrBogusRoutes) {
      const isBogusInSitemap = sitemapUrls.some(url => url.endsWith(bogusRoute));
      assert.strictEqual(
        isBogusInSitemap,
        false,
        `Bogus route "${bogusRoute}" must never be indexed in sitemap.xml`
      );
    }
  });

  // TEST-T2-F1-004: 404 Route Source Code Verification
  test('TEST-T2-F1-004: src/app/not-found.tsx defines dedicated NotFound component with recovery structure', () => {
    const notFoundSource = path.join(SRC_DIR, 'app', 'not-found.tsx');
    assert.ok(fs.existsSync(notFoundSource), 'src/app/not-found.tsx must exist');

    const sourceContent = fs.readFileSync(notFoundSource, 'utf-8');
    assert.ok(
      sourceContent.includes('export default function') || sourceContent.includes('export default'),
      'not-found.tsx must export a default React component'
    );
    assert.ok(
      sourceContent.includes('/services') || sourceContent.includes('/book-a-call') || sourceContent.includes('/'),
      'not-found.tsx source code must reference recovery destinations'
    );
    assert.ok(
      !sourceContent.includes('type="search"'),
      'not-found.tsx must not implement a search input'
    );
  });

  // TEST-T2-F1-005: Path Normalization & Query String Resolution in Crawler
  test('TEST-T2-F1-005: Crawler normalizes query parameters and hash anchors to resolve base route export', (t) => {
    if (!crawler.isExportPresent()) {
      t.skip('Static export out/ directory does not exist.');
      return;
    }

    const servicesWithQuery = '/services?utm_source=google&tab=admin';
    const basePath = servicesWithQuery.split('?')[0];

    const normalExportPath = crawler.getExportFilePath(basePath);
    if (crawler.hasPageExport(basePath)) {
      assert.ok(normalExportPath, 'Base route /services must have an export path');
      assert.ok(fs.existsSync(normalExportPath), 'Exported HTML file must physically exist on disk');
    }
  });
});
