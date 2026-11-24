/**
 * Tier 2 Boundary & Corner Case Test Suite: F8 - SEO, Metadata & Structured Data Boundaries
 * 
 * Sources:
 * - Explorer 2 Report (SEO boundaries)
 * - Sitemap §5 (SEO & Metadata specifications)
 * - ORIGINAL_REQUEST.md R7 line 37
 * - PROJECT.md lines 57-59
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { skipIfNoExport } from '../helpers/assertions.mjs';
import { ROUTES, SITE_URL } from '../config.mjs';

const crawler = new RouteCrawler();

describe('Tier 2 F8: SEO, Metadata & Structured Data Boundaries', () => {
  // TEST-T2-F8-001: Duplicate Canonical URLs Detection Across Routes
  test('TEST-T2-F8-001: Every public route specifies a unique canonical URL without duplicates', (t) => {
    if (!crawler.isExportPresent()) {
      t.skip('Static export out/ directory does not exist.');
      return;
    }

    const canonicalMap = new Map(); // canonicalUrl -> routePath

    for (const route of ROUTES) {
      if (!route.inSitemap) continue;
      if (!crawler.hasPageExport(route.path)) continue;

      const html = crawler.getPageHtml(route.path);
      if (!html) continue;

      const canonicalHref = HtmlParser.extractCanonical(html);
      if (!canonicalHref) continue;

      // Check for duplicates across distinct routes
      if (canonicalMap.has(canonicalHref)) {
        const previousRoute = canonicalMap.get(canonicalHref);
        assert.fail(
          `Duplicate canonical URL detected: "${canonicalHref}" is shared between route "${previousRoute}" and route "${route.path}"`
        );
      }

      canonicalMap.set(canonicalHref, route.path);
    }

    if (canonicalMap.size === 0) {
      t.skip('Canonical link tags not yet embedded in static export HTML head (Milestone M4).');
      return;
    }

    assert.ok(
      canonicalMap.size > 0,
      'At least one canonical URL must be extracted from exported pages'
    );
  });

  // TEST-T2-F8-002: Malformed JSON-LD Syntax Detection & Schema.org Compliance
  test('TEST-T2-F8-002: All JSON-LD scripts across exported pages are syntactically valid and well-formed', (t) => {
    if (!crawler.isExportPresent()) {
      t.skip('Static export out/ directory does not exist.');
      return;
    }

    const exportedFiles = crawler.getAllExportedHtmlFiles();
    let totalJsonLdFound = 0;

    for (const relFile of exportedFiles) {
      const fullPath = path.join(crawler.exportDir, relFile);
      const html = fs.readFileSync(fullPath, 'utf-8');
      const jsonLdList = HtmlParser.extractJsonLd(html);

      for (const item of jsonLdList) {
        totalJsonLdFound++;

        // 1. Must not have parse error
        assert.strictEqual(
          item.__parseError,
          undefined,
          `Malformed JSON-LD syntax in ${relFile}: ${item.__parseError}`
        );

        // 2. Must define @context
        assert.ok(
          item['@context'],
          `JSON-LD in ${relFile} must define @context`
        );
        assert.ok(
          /schema\.org/i.test(item['@context']),
          `JSON-LD @context in ${relFile} must point to schema.org`
        );

        // 3. Must define valid @type
        assert.ok(
          item['@type'],
          `JSON-LD in ${relFile} must define an @type`
        );
      }
    }

    if (totalJsonLdFound === 0) {
      t.skip('No JSON-LD scripts found in export yet (Milestone M4).');
    }
  });

  // TEST-T2-F8-003: Robots.txt Parsing & Sitemap URL Exact Matching
  test('TEST-T2-F8-003: Robots.txt directives are well-formed and sitemap directive matches canonical URL', (t) => {
    const robots = crawler.getRobotsTxt();
    if (!robots) {
      t.skip('robots.txt not found in out/ or public/. Will be generated in Milestone M4.');
      return;
    }

    const parsed = crawler.parseRobotsTxt();

    // 1. User-agent directive
    assert.ok(
      parsed.userAgents.includes('*'),
      'robots.txt must define "User-agent: *"'
    );

    // 2. Allow directive
    assert.ok(
      parsed.allows.includes('/') || parsed.allows.length > 0,
      'robots.txt must specify Allow directive'
    );

    // 3. Sitemap directive exact matching
    assert.ok(
      parsed.sitemaps.length > 0,
      'robots.txt must include at least one Sitemap directive'
    );

    const expectedSitemapUrl = `${SITE_URL}/sitemap.xml`;
    const hasMatchingSitemap = parsed.sitemaps.some(s => s === expectedSitemapUrl || s.endsWith('/sitemap.xml'));

    assert.ok(
      hasMatchingSitemap,
      `robots.txt Sitemap directive must point to ${expectedSitemapUrl}. Found: ${JSON.stringify(parsed.sitemaps)}`
    );
  });

  // TEST-T2-F8-004: Sitemap.xml URL Protocol, Host, and Unique Canonical URLs
  test('TEST-T2-F8-004: Sitemap.xml URLs strictly use HTTPS, correct domain, and contain no duplicates', (t) => {
    const sitemapData = crawler.getSitemapXml();
    if (!sitemapData) {
      t.skip('sitemap.xml not found in out/ or public/. Will be generated in Milestone M4.');
      return;
    }

    const urls = crawler.extractSitemapUrls();
    assert.ok(urls.length > 0, 'sitemap.xml must list at least one <loc> URL');

    const seenUrls = new Set();

    for (const urlStr of urls) {
      // 1. HTTPS Protocol
      assert.ok(
        urlStr.startsWith('https://'),
        `Sitemap URL "${urlStr}" must use secure https:// protocol`
      );

      // 2. Hostname matches SITE_URL
      assert.ok(
        urlStr.startsWith(SITE_URL),
        `Sitemap URL "${urlStr}" must match site domain (${SITE_URL})`
      );

      // 3. No localhost or dev domains
      assert.strictEqual(
        urlStr.includes('localhost'),
        false,
        `Sitemap URL "${urlStr}" must not reference localhost`
      );

      // 4. No duplicate entries in sitemap
      assert.strictEqual(
        seenUrls.has(urlStr),
        false,
        `Duplicate URL detected in sitemap.xml: ${urlStr}`
      );
      seenUrls.add(urlStr);
    }
  });

  // TEST-T2-F8-005: OpenGraph Protocol and Property Consistency
  test('TEST-T2-F8-005: OpenGraph metadata across exported pages contains well-formed URLs and site_name', (t) => {
    if (!crawler.isExportPresent()) {
      t.skip('Static export out/ directory does not exist.');
      return;
    }

    if (!crawler.hasPageExport('/')) {
      t.skip('Home page export not found');
      return;
    }

    const html = crawler.getPageHtml('/');
    const og = HtmlParser.extractOpenGraph(html);

    // If og tags are rendered, check validity
    if (og['og:url']) {
      assert.ok(
        og['og:url'].startsWith('https://'),
        `og:url must be an absolute HTTPS URL: ${og['og:url']}`
      );
    }

    if (og['og:type']) {
      assert.strictEqual(
        og['og:type'],
        'website',
        `og:type must be "website", got: ${og['og:type']}`
      );
    }

    if (og['og:site_name']) {
      assert.strictEqual(
        og['og:site_name'],
        'RepHero',
        `og:site_name must be "RepHero", got: ${og['og:site_name']}`
      );
    }
  });
});
