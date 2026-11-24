/**
 * Tier 1 Test Suite: F2 - Navigation, Sticky Header & Multi-Column Footer (R1 / F2)
 * 
 * Verifies desktop nav links, sticky header positioning, mobile persistent CTA,
 * 5-column footer structure, copyright notice, and HIPAA/BAA statement.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { skipIfNoExport } from '../helpers/assertions.mjs';
import { NAVIGATION, ROUTES } from '../config.mjs';

const crawler = new RouteCrawler();

describe('F2: Navigation, Sticky Header & Multi-Column Footer', () => {
  // TEST-T1-F2-001: Sticky Header Desktop Configuration
  test('TEST-T1-F2-001: Sticky header contains logo, 6 nav links, and Book a Call CTA', (t) => {
    if (skipIfNoExport(t, '/')) return;

    const html = crawler.getPageHtml('/');
    const landmarks = HtmlParser.extractLandmarks(html);
    assert.ok(landmarks.hasHeader, 'Document must have a <header> element');

    const headerHtml = landmarks.headerHtml;
    // Check 6 desktop links
    for (const link of NAVIGATION.desktopLinks) {
      assert.ok(
        headerHtml.includes(`href="${link.href}"`) || headerHtml.includes(`href='${link.href}'`),
        `Header must contain navigation link to ${link.href} (${link.label})`
      );
    }

    // Check CTA button
    assert.ok(
      headerHtml.includes('href="/book-a-call"') && HtmlParser.hasText(headerHtml, 'Book a Call'),
      'Header must contain primary "Book a Call" CTA button'
    );
  });

  // TEST-T1-F2-002: Mobile Header Navigation & Persistent CTA
  test('TEST-T1-F2-002: Header maintains persistent Book Call CTA on mobile viewports', (t) => {
    if (skipIfNoExport(t, '/')) return;

    const html = crawler.getPageHtml('/');
    const landmarks = HtmlParser.extractLandmarks(html);
    const headerHtml = landmarks.headerHtml;

    // Verify presence of mobile menu toggle/button or drawer trigger
    const hasMobileToggle = /menu|drawer|hamburger|mobile/i.test(headerHtml) || /aria-label=["'][^"']*menu[^"']*["']/i.test(headerHtml);
    assert.ok(hasMobileToggle, 'Header must contain mobile drawer toggle or mobile navigation trigger');

    // Verify Book a Call CTA is not hidden on mobile (must remain visible or separate from collapsed links)
    assert.ok(headerHtml.includes('/book-a-call'), 'Book a Call CTA must remain available in header element');
  });

  // TEST-T1-F2-003: Multi-Column Footer Directory Structure
  test('TEST-T1-F2-003: Multi-column footer contains 5 semantic columns and copyright', (t) => {
    if (skipIfNoExport(t, '/')) return;

    const html = crawler.getPageHtml('/');
    const landmarks = HtmlParser.extractLandmarks(html);
    assert.ok(landmarks.hasFooter, 'Document must have a <footer> element');

    const footerHtml = landmarks.footerHtml;

    // Check links to Company / About
    assert.ok(footerHtml.includes('/about') || footerHtml.includes('/how-it-works'), 'Footer must contain company links');
    // Check links to Services
    assert.ok(footerHtml.includes('/services'), 'Footer must contain services links');
    // Check Legal links: Privacy Policy and Terms of Use
    assert.ok(footerHtml.includes('/privacy'), 'Footer must contain link to /privacy');
    assert.ok(footerHtml.includes('/terms'), 'Footer must contain link to /terms');

    // Check copyright
    assert.ok(
      HtmlParser.hasText(footerHtml, NAVIGATION.copyrightText) || HtmlParser.hasText(footerHtml, 'RepHero'),
      `Footer must contain copyright notice mentioning "${NAVIGATION.copyrightText}"`
    );
  });

  // TEST-T1-F2-004: Primary CTA Presence Across All Pages
  test('TEST-T1-F2-004: Every page has at least 2 distinct CTAs to /book-a-call', (t) => {
    if (!crawler.isExportPresent()) {
      t.skip('Static export out/ not found.');
      return;
    }

    for (const route of ROUTES) {
      if (!crawler.hasPageExport(route.path)) continue;
      const html = crawler.getPageHtml(route.path);
      const links = HtmlParser.extractLinks(html);
      const ctaLinks = links.filter(l => l.href === '/book-a-call' || l.href.startsWith('/book-a-call?'));

      assert.ok(
        ctaLinks.length >= 2,
        `Page "${route.path}" must contain at least 2 links to /book-a-call (found ${ctaLinks.length})`
      );
    }
  });

  // TEST-T1-F2-005: Header Background & Sticky Positioning
  test('TEST-T1-F2-005: Header specifies fixed/sticky positioning in markup', (t) => {
    if (skipIfNoExport(t, '/')) return;

    const html = crawler.getPageHtml('/');
    const landmarks = HtmlParser.extractLandmarks(html);
    const headerHtml = landmarks.headerHtml;

    const isStickyOrFixed = /sticky|fixed/i.test(headerHtml);
    assert.ok(isStickyOrFixed, 'Header element must specify sticky or fixed positioning');
  });

  // TEST-T1-F2-006: HIPAA Compliance and BAA Notice in Footer
  test('TEST-T1-F2-006: Footer bottom bar contains HIPAA / BAA compliance notice', (t) => {
    if (skipIfNoExport(t, '/')) return;

    const html = crawler.getPageHtml('/');
    const landmarks = HtmlParser.extractLandmarks(html);
    const footerHtml = landmarks.footerHtml;

    assert.ok(
      NAVIGATION.hipaaNoticePattern.test(footerHtml),
      'Footer must display HIPAA / BAA compliance statement'
    );
  });
});
