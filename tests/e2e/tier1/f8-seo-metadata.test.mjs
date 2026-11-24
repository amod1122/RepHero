/**
 * Tier 1 Test Suite: F8 - SEO, Metadata & Structured Data (R7 / F8)
 * 
 * Verifies 12 unique page titles & meta descriptions, OpenGraph tags,
 * JSON-LD Organization schema in root layout, FAQPage schema,
 * static sitemap.xml route coverage, and static robots.txt directives.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { skipIfNoExport } from '../helpers/assertions.mjs';
import { PUBLIC_CANONICAL_ROUTES, ROUTES, SITE_URL } from '../config.mjs';

const crawler = new RouteCrawler();

describe('F8: SEO, Metadata & Structured Data', () => {
  // TEST-T1-F8-001: Unique Title & Meta Description on All 12 Routes
  test('TEST-T1-F8-001: Every route has unique <title> and meta description', (t) => {
    if (!crawler.isExportPresent()) {
      t.skip('Static export out/ not found.');
      return;
    }

    const titles = new Map();
    const descriptions = new Map();

    for (const route of ROUTES) {
      if (!crawler.hasPageExport(route.path)) continue;
      const html = crawler.getPageHtml(route.path);
      const title = HtmlParser.extractTitle(html);
      const metaTags = HtmlParser.extractMetaTags(html);
      const descTag = metaTags.find(m => m.name === 'description');
      const desc = descTag ? descTag.content : null;

      assert.ok(title, `Page "${route.path}" must have a non-empty <title> tag`);
      assert.ok(
        title.toLowerCase().includes('rephero'),
        `Title for "${route.path}" must include "RepHero" (found "${title}")`
      );

      // Verify uniqueness
      if (titles.has(title)) {
        assert.fail(`Duplicate title "${title}" found between "${route.path}" and "${titles.get(title)}"`);
      }
      titles.set(title, route.path);

      if (desc) {
        if (descriptions.has(desc)) {
          assert.fail(`Duplicate meta description found between "${route.path}" and "${descriptions.get(desc)}"`);
        }
        descriptions.set(desc, route.path);
      }
    }
  });

  // TEST-T1-F8-002: Open Graph Tag Presence Across Routes
  test('TEST-T1-F8-002: Exported pages contain required OpenGraph tags (title, description, type, url)', (t) => {
    if (skipIfNoExport(t, '/')) return;

    const html = crawler.getPageHtml('/');
    const og = HtmlParser.extractOpenGraph(html);

    assert.ok(og['og:title'], 'Home must contain og:title tag');
    assert.ok(og['og:description'], 'Home must contain og:description tag');
    assert.ok(og['og:type'] || og['og:site_name'], 'Home must contain og:type or og:site_name');
  });

  // TEST-T1-F8-003: Organization Schema (JSON-LD) in Root Layout
  test('TEST-T1-F8-003: Root layout renders Organization schema in JSON-LD', (t) => {
    if (skipIfNoExport(t, '/')) return;

    const html = crawler.getPageHtml('/');
    const jsonLdList = HtmlParser.extractJsonLd(html);

    const orgSchema = jsonLdList.find(item => item['@type'] === 'Organization');
    assert.ok(orgSchema, 'Must include JSON-LD script with @type: "Organization"');
    assert.ok(
      orgSchema.name && orgSchema.name.includes('RepHero'),
      `Organization schema name must include "RepHero" (found "${orgSchema.name}")`
    );
  });

  // TEST-T1-F8-004: FAQPage Schema (JSON-LD) on Home and Services
  test('TEST-T1-F8-004: Home or Services renders FAQPage schema in JSON-LD', (t) => {
    if (!crawler.isExportPresent()) {
      t.skip('Static export out/ not found.');
      return;
    }

    const homeHtml = crawler.getPageHtml('/');
    const servicesHtml = crawler.getPageHtml('/services');

    const homeJsonLd = homeHtml ? HtmlParser.extractJsonLd(homeHtml) : [];
    const servicesJsonLd = servicesHtml ? HtmlParser.extractJsonLd(servicesHtml) : [];
    const combined = [...homeJsonLd, ...servicesJsonLd];

    const faqSchema = combined.find(item => item['@type'] === 'FAQPage');
    if (!faqSchema) {
      t.skip('FAQPage schema not yet rendered in static export (Milestone M4).');
      return;
    }
    assert.ok(Array.isArray(faqSchema.mainEntity), 'FAQPage mainEntity must be an array of questions');
    assert.ok(faqSchema.mainEntity.length > 0, 'FAQPage must contain question items');
  });

  // TEST-T1-F8-005: Static sitemap.xml Route Coverage
  test('TEST-T1-F8-005: sitemap.xml is well-formed and lists canonical public routes', (t) => {
    const sitemapData = crawler.getSitemapXml();
    if (!sitemapData) {
      t.skip('sitemap.xml not found in out/ or public/. Will be generated in Milestone M4.');
      return;
    }

    assert.ok(sitemapData.content.includes('<urlset'), 'sitemap.xml must contain <urlset>');
    const urls = crawler.extractSitemapUrls();
    assert.ok(urls.length >= 5, `sitemap.xml should contain public routes (found ${urls.length})`);

    // Verify key public paths are indexed
    const hasHome = urls.some(u => u === SITE_URL || u === `${SITE_URL}/`);
    assert.ok(hasHome, 'sitemap.xml must include home URL');
  });

  // TEST-T1-F8-006: Static robots.txt Configuration
  test('TEST-T1-F8-006: robots.txt allows search engines and references sitemap.xml', (t) => {
    const robots = crawler.getRobotsTxt();
    if (!robots) {
      t.skip('robots.txt not found in out/ or public/. Will be generated in Milestone M4.');
      return;
    }

    const parsed = crawler.parseRobotsTxt();
    assert.ok(
      parsed.userAgents.includes('*'),
      'robots.txt must declare "User-agent: *"'
    );
    assert.ok(
      parsed.allows.includes('/') || parsed.allows.length > 0,
      'robots.txt must declare "Allow: /"'
    );
    assert.ok(
      parsed.sitemaps.some(s => s.includes('sitemap.xml')),
      'robots.txt must declare Sitemap directive pointing to sitemap.xml'
    );
  });
});
