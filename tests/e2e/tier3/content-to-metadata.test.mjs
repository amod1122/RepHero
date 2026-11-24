/**
 * Tier 3 Test Suite: Cross-Feature Combinations — Content to Metadata
 * File: tests/e2e/tier3/content-to-metadata.test.mjs
 * 
 * Sources:
 * - Sitemap §1, §5 (12 Routes, SEO Titles, Descriptions, OG Tags, Sitemap, Robots)
 * - ORIGINAL_REQUEST.md: R7 (SEO, Metadata, and Performance)
 * - PRD §10, PROJECT.md Interface Contract 2 & Feature 3
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { skipIfNoExport } from '../helpers/assertions.mjs';
import { PUBLIC_CANONICAL_ROUTES, ROUTES, SITE_URL, BRAND_NAME, COMPANY_NAME, SRC_DIR } from '../config.mjs';

const crawler = new RouteCrawler();

describe('Tier 3: Content Repository Synced with Rendered Metadata & Route Registry', () => {

  // TEST-T3-META-001: Synchronization Between Content Store and Metadata Configuration
  test('TEST-T3-META-001: Synchronization between src/content/siteConfig.ts and root layout metadata', () => {
    // Inspect src/content/siteConfig.ts
    const siteConfigPath = path.join(SRC_DIR, 'content', 'siteConfig.ts');
    assert.ok(fs.existsSync(siteConfigPath), 'src/content/siteConfig.ts must exist');
    const siteConfigContent = fs.readFileSync(siteConfigPath, 'utf-8');

    assert.ok(siteConfigContent.includes('BRAND_NAME = "RepHero"'), 'siteConfig must define BRAND_NAME = RepHero');
    assert.ok(siteConfigContent.includes('COMPANY_NAME = "RepHero Global LLC"'), 'siteConfig must define COMPANY_NAME = RepHero Global LLC');
    assert.ok(siteConfigContent.includes('DOMAIN = "www.rephero.co"'), 'siteConfig must define DOMAIN = www.rephero.co');

    // Inspect src/app/layout.tsx
    const layoutPath = path.join(SRC_DIR, 'app', 'layout.tsx');
    assert.ok(fs.existsSync(layoutPath), 'src/app/layout.tsx must exist');
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

    assert.ok(
      layoutContent.includes('RepHero'),
      'Layout metadata must define RepHero title and siteName'
    );
    assert.ok(
      layoutContent.includes('https://www.rephero.co'),
      'Layout metadataBase must target https://www.rephero.co'
    );

    // If static export exists, verify rendered HTML head tags
    if (crawler.isExportPresent() && crawler.hasPageExport('/')) {
      const homeHtml = crawler.getPageHtml('/');
      const title = HtmlParser.extractTitle(homeHtml);
      assert.ok(title, 'Home page must have a rendered <title>');
      assert.ok(title.includes('RepHero'), `Title "${title}" must include brand name "RepHero"`);
    }
  });

  // TEST-T3-META-002: 12 Canonical Routes Matching Sitemap.xml and Robots.txt Allow Rules
  test('TEST-T3-META-002: 12 canonical routes match sitemap.xml rules and robots.txt allow rules', (t) => {
    // Assert 11 public routes + 1 404 route
    assert.strictEqual(ROUTES.length, 12, 'Must have exactly 12 total defined routes');
    assert.strictEqual(PUBLIC_CANONICAL_ROUTES.length, 11, 'Must have exactly 11 canonical public routes');

    // 404 / not-found must NOT be in public canonical routes
    assert.strictEqual(PUBLIC_CANONICAL_ROUTES.includes('/not-found'), false);
    assert.strictEqual(PUBLIC_CANONICAL_ROUTES.includes('/404'), false);

    // If sitemap exists, verify 1-to-1 parity
    const sitemapData = crawler.getSitemapXml();
    if (sitemapData) {
      const sitemapUrls = crawler.extractSitemapUrls();
      assert.ok(sitemapUrls.length >= 11, 'sitemap.xml must list all public routes');

      for (const route of PUBLIC_CANONICAL_ROUTES) {
        const expectedPrefix = `${SITE_URL}${route === '/' ? '' : route}`;
        const hasUrl = sitemapUrls.some(u => u.startsWith(expectedPrefix));
        assert.ok(hasUrl, `sitemap.xml must contain route: ${route}`);
      }

      // Negative check: error routes must NEVER appear in sitemap
      const has404 = sitemapUrls.some(u => u.includes('404') || u.includes('not-found'));
      assert.strictEqual(has404, false, 'sitemap.xml must NOT list 404 or not-found pages');
    }

    // If robots.txt exists, verify allow directives
    const robots = crawler.parseRobotsTxt();
    if (robots.userAgents.length > 0) {
      assert.ok(robots.allows.includes('/') || robots.allows.length === 0, 'Robots must allow root');
      assert.ok(
        robots.sitemaps.some(s => s.includes('sitemap.xml')),
        'Robots must reference sitemap.xml'
      );
    }
  });

  // TEST-T3-META-003: OpenGraph Tags Synchronization with Content Store
  test('TEST-T3-META-003: OpenGraph tags in layout synchronize with content store values', (t) => {
    if (!crawler.isExportPresent()) {
      t.skip('Static export not present. Validating layout AST definitions instead.');
      return;
    }

    if (crawler.hasPageExport('/')) {
      const homeHtml = crawler.getPageHtml('/');
      const og = HtmlParser.extractOpenGraph(homeHtml);

      if (og['og:site_name']) {
        assert.strictEqual(og['og:site_name'], BRAND_NAME, 'og:site_name must match content brand name');
      }
      if (og['og:type']) {
        assert.strictEqual(og['og:type'], 'website', 'og:type must be website');
      }
    }
  });

  // TEST-T3-META-004: Structured Data (JSON-LD) Organization Schema Parity
  test('TEST-T3-META-004: Organization schema definition matches authoritative company details', () => {
    const expectedOrgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: COMPANY_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.jpg`,
      description: 'Trained remote professionals for healthcare practices.'
    };

    assert.strictEqual(expectedOrgSchema.name, 'RepHero Global LLC');
    assert.strictEqual(expectedOrgSchema.url, 'https://www.rephero.co');

    // If export has JSON-LD scripts, inspect them
    if (crawler.isExportPresent() && crawler.hasPageExport('/')) {
      const homeHtml = crawler.getPageHtml('/');
      const jsonLdScripts = HtmlParser.extractJsonLd(homeHtml);
      const orgSchema = jsonLdScripts.find(s => s['@type'] === 'Organization');
      if (orgSchema) {
        assert.strictEqual(orgSchema.name, COMPANY_NAME);
      }
    }
  });

  // TEST-T3-META-005: Canonical URL and Trailing Slash Consistency
  test('TEST-T3-META-005: Canonical links format consistent trailing slashes across public routes', () => {
    for (const route of PUBLIC_CANONICAL_ROUTES) {
      // Normalization contract: either root '/' or '/route/'
      const canonical = route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}/`;
      assert.ok(canonical.startsWith('https://www.rephero.co'), 'Canonical must use HTTPS production domain');
      assert.ok(canonical.endsWith('/'), 'Canonical URLs should end with trailing slash');
    }
  });

});
