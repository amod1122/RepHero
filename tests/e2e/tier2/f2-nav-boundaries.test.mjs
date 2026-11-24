/**
 * Tier 2 Boundary & Corner Case Test Suite: F2 - Navigation & Anchor Boundaries
 * 
 * Sources:
 * - Sitemap §2 (Header and Footer specification, mobile CTA persistence)
 * - Sitemap §4.3 (/industries anchor jump navigation: #family-medicine, #hospice-care, etc.)
 * - ORIGINAL_REQUEST.md lines 18-20, 48-52
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { skipIfNoExport } from '../helpers/assertions.mjs';
import { NAVIGATION, ROUTES, SRC_DIR } from '../config.mjs';

const crawler = new RouteCrawler();

describe('Tier 2 F2: Navigation & Anchor Boundaries', () => {
  // TEST-T2-F2-001: Missing, Empty, Dead, or Undefined Hrefs Across Rendered Pages
  test('TEST-T2-F2-001: Detection of missing, empty, javascript: or undefined hrefs in navigation', (t) => {
    // 1. Verify the authoritative navigation content configuration has no dead links
    for (const link of NAVIGATION.desktopLinks) {
      assert.ok(link.href, `Navigation config entry "${link.label}" must have a non-empty href`);
      assert.ok(!link.href.startsWith('javascript:'), `Navigation link "${link.label}" must not use javascript pseudo-protocol`);
      assert.notStrictEqual(link.href, '#', `Navigation link "${link.label}" must point to a real route, not bare "#"`);
      assert.notStrictEqual(link.href, 'undefined', `Navigation link "${link.label}" href must not be string "undefined"`);
    }

    assert.ok(NAVIGATION.headerCta.href, 'Header CTA must have a valid href');
    assert.strictEqual(NAVIGATION.headerCta.href, '/book-a-call');

    // 2. If static export exists, scan extracted links from exported HTML pages
    if (crawler.isExportPresent()) {
      const exportedFiles = crawler.getAllExportedHtmlFiles();
      for (const relFile of exportedFiles) {
        const fullPath = path.join(crawler.exportDir, relFile);
        const html = fs.readFileSync(fullPath, 'utf-8');
        const links = HtmlParser.extractLinks(html);

        for (const link of links) {
          const rawHref = link.href.trim();
          assert.notStrictEqual(
            rawHref,
            '',
            `Found empty href in file: ${relFile} (${link.html})`
          );
          assert.notStrictEqual(
            rawHref,
            'undefined',
            `Found literal "undefined" href in file: ${relFile} (${link.html})`
          );
          assert.notStrictEqual(
            rawHref,
            'null',
            `Found literal "null" href in file: ${relFile} (${link.html})`
          );
          assert.ok(
            !rawHref.startsWith('javascript:'),
            `Found unsafe javascript: href in file: ${relFile} (${link.html})`
          );
        }
      }
    }
  });

  // TEST-T2-F2-002: Anchor Link Jump Target Integrity on /industries
  test('TEST-T2-F2-002: Anchor link jump targets on /industries match existing section IDs', (t) => {
    // 1. Check source file: src/app/industries/page.tsx or content
    const industriesSourcePath = path.join(SRC_DIR, 'app', 'industries', 'page.tsx');
    if (fs.existsSync(industriesSourcePath)) {
      const sourceCode = fs.readFileSync(industriesSourcePath, 'utf-8');
      
      // Extract all internal hash links: href={`#${...}`} or href="#..."
      const hashLinkRegex = /href=["']#([^"']+)["']/g;
      let match;
      const targetIds = [];
      while ((match = hashLinkRegex.exec(sourceCode)) !== null) {
        targetIds.push(match[1]);
      }

      // Each extracted target anchor ID must be defined as an id="..." in the document
      for (const targetId of targetIds) {
        const idDefinition = `id="${targetId}"`;
        assert.ok(
          sourceCode.includes(idDefinition),
          `Anchor target "#${targetId}" on /industries must correspond to an element with id="${targetId}"`
        );
      }
    }

    // 2. Check exported HTML if available
    if (crawler.isExportPresent() && crawler.hasPageExport('/industries')) {
      const html = crawler.getPageHtml('/industries');
      const links = HtmlParser.extractLinks(html);
      const hashLinks = links.filter(l => l.href.startsWith('#') && l.href.length > 1);

      for (const link of hashLinks) {
        const targetId = link.href.replace('#', '');
        const idPattern = new RegExp(`id=["']${targetId}["']`, 'i');
        assert.ok(
          idPattern.test(html),
          `Anchor jump "${link.href}" must have corresponding element with id="${targetId}" in /industries HTML`
        );
      }
    }
  });

  // TEST-T2-F2-003: Persistent Mobile Book a Call CTA Accessibility (< 768px)
  test('TEST-T2-F2-003: Header maintains persistent Book a Call CTA accessibility at mobile viewport (< 768px)', (t) => {
    // Sitemap §2 (lines 40-43): "On mobile viewports (< 768px), navigation collapses into a hamburger menu.
    // The 'Book a Call' CTA button remains persistently visible in the header alongside the hamburger menu."

    const headerComponentPath = path.join(SRC_DIR, 'components', 'Header.tsx');
    const layoutPath = path.join(SRC_DIR, 'app', 'layout.tsx');

    // Check if RepHero Header component or Header element in layout exists
    let headerSource = '';
    if (fs.existsSync(headerComponentPath)) {
      headerSource = fs.readFileSync(headerComponentPath, 'utf-8');
    } else if (fs.existsSync(layoutPath)) {
      const layoutSource = fs.readFileSync(layoutPath, 'utf-8');
      if (layoutSource.includes('<header') || layoutSource.includes('Header')) {
        headerSource = layoutSource;
      }
    }

    if (!headerSource) {
      t.skip('RepHero Header component (src/components/Header.tsx) not yet created. Will be verified once Header component is deployed.');
      return;
    }

    // Header must reference /book-a-call
    assert.ok(
      headerSource.includes('/book-a-call') || headerSource.includes('book-a-call'),
      'Header component must reference /book-a-call CTA'
    );

    // Verify it does not completely hide on small screens (e.g. `hidden md:inline-flex` without mobile CTA)
    const ctaHiddenMobileOnly = /class(Name)?=["'][^"']*hidden\s+(?:md|lg):(?:flex|block|inline-flex)[^"']*["'][^>]*href=["']\/book-a-call["']/i.test(headerSource);
    assert.strictEqual(
      ctaHiddenMobileOnly,
      false,
      'Header "Book a Call" CTA button must NOT be hidden on mobile viewports (< 768px)'
    );
  });

  // TEST-T2-F2-004: External Link Safety Attributes (target="_blank" -> rel="noopener noreferrer")
  test('TEST-T2-F2-004: External links with target="_blank" must enforce rel="noopener" or rel="noreferrer"', (t) => {
    if (!crawler.isExportPresent()) {
      t.skip('Static export out/ directory does not exist.');
      return;
    }

    const exportedFiles = crawler.getAllExportedHtmlFiles();
    for (const relFile of exportedFiles) {
      const fullPath = path.join(crawler.exportDir, relFile);
      const html = fs.readFileSync(fullPath, 'utf-8');

      const blankLinkRegex = /<a\s+[^>]*target=["']_blank["'][^>]*>/gi;
      let match;
      while ((match = blankLinkRegex.exec(html)) !== null) {
        const tag = match[0];
        const hrefMatch = tag.match(/href=["']([^"']*)["']/i);
        const relMatch = tag.match(/rel=["']([^"']*)["']/i);

        if (hrefMatch && hrefMatch[1].startsWith('http')) {
          assert.ok(
            relMatch && (relMatch[1].includes('noopener') || relMatch[1].includes('noreferrer')),
            `External target="_blank" link in ${relFile} must include rel="noopener" or rel="noreferrer": ${tag}`
          );
        }
      }
    }
  });

  // TEST-T2-F2-005: Navigation Link Text Accessibility & Non-Empty Anchor Labels
  test('TEST-T2-F2-005: All navigation links have accessible text or aria-label', (t) => {
    if (!crawler.isExportPresent()) {
      t.skip('Static export out/ directory does not exist.');
      return;
    }

    const html = crawler.getPageHtml('/');
    if (!html) {
      t.skip('Home page export not found');
      return;
    }

    const links = HtmlParser.extractLinks(html);
    for (const link of links) {
      const hasVisibleText = link.text && link.text.trim().length > 0;
      const hasAriaLabel = /aria-label=["'][^"']+["']/i.test(link.html);
      const hasImgAlt = /<img[^>]+alt=["'][^"']+["']/i.test(link.html);
      const hasSvgTitle = /<svg[^>]*>[\s\S]*?<title>[\s\S]*?<\/title>/i.test(link.html);

      assert.ok(
        hasVisibleText || hasAriaLabel || hasImgAlt || hasSvgTitle,
        `Link with href="${link.href}" must provide accessible text, aria-label, or image alt attribute`
      );
    }
  });
});
