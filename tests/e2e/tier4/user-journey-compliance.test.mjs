/**
 * Tier 4 End-to-End User Journey Test: Compliance & Trust Due Diligence (Elena Rostova)
 * File: tests/e2e/tier4/user-journey-compliance.test.mjs
 * 
 * Scenario Overview:
 * - Persona: Elena Rostova, Healthcare Legal Counsel & Privacy Officer.
 * - Business Need: Rigorously audit vendor compliance claims, BAA commitments, non-PHI policies,
 *   estimate disclaimers, and accessibility standards prior to approving practice partnership.
 * 
 * Complete Journey Phases:
 * 1. Footer BAA Statement & Compliance Statement Review
 * 2. Privacy Policy Audit (/privacy) for Non-PHI Guarantee
 * 3. Terms of Use Audit (/terms) for Savings Disclaimer & Separate MSA/BAA Requirement
 * 4. WCAG AA Color Contrast Audit on Legal & Compliance Documents
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { assertContrastRatio, skipIfNoExport } from '../helpers/assertions.mjs';
import { DESIGN_TOKENS, SRC_DIR } from '../config.mjs';

const crawler = new RouteCrawler();

describe('Tier 4 Journey 3: Compliance & Trust Due Diligence Journey (Elena Rostova)', () => {

  test('E2E-T4-003: Elena Rostova audits footer BAA, /privacy non-PHI policies, /terms disclaimers, and WCAG AA contrast', () => {
    // =========================================================================
    // Phase 1: Footer BAA Notice & Compliance Statement Review
    // =========================================================================
    const siteConfigPath = path.join(SRC_DIR, 'content', 'siteConfig.ts');
    assert.ok(fs.existsSync(siteConfigPath), 'siteConfig.ts must exist');
    const siteConfig = fs.readFileSync(siteConfigPath, 'utf-8');

    // BAA Commitment verification
    assert.ok(
      siteConfig.includes('Business Associate Agreement') || siteConfig.includes('BAA'),
      'Compliance statement must commit to executing a Business Associate Agreement (BAA)'
    );
    assert.ok(
      siteConfig.includes('HIPAA-trained') || siteConfig.includes('HIPAA'),
      'Compliance statement must verify HIPAA training'
    );
    assert.ok(
      siteConfig.includes('RepHero Global LLC'),
      'Copyright statement must declare RepHero Global LLC'
    );

    // =========================================================================
    // Phase 2: Privacy Policy Audit (/privacy)
    // =========================================================================
    const legalContentPath = path.join(SRC_DIR, 'content', 'legal.ts');
    assert.ok(fs.existsSync(legalContentPath), 'legal.ts must exist');
    const legalContent = fs.readFileSync(legalContentPath, 'utf-8');

    // Elena audits Privacy Policy for explicit PHI prohibition
    assert.ok(
      legalContent.includes('Protected Health Information') || legalContent.includes('PHI'),
      'Privacy policy must contain dedicated Protected Health Information clause'
    );
    assert.ok(
      legalContent.includes('not designed to collect, transmit, or store Protected Health Information') ||
      legalContent.includes('do not submit patient'),
      'Privacy policy must explicitly instruct users not to submit patient data'
    );
    assert.ok(
      legalContent.includes('Business Associate Agreements'),
      'Privacy policy must note healthcare engagements are governed by separate BAAs'
    );

    // If static export is present, check rendered /privacy HTML
    if (crawler.isExportPresent() && crawler.hasPageExport('/privacy')) {
      const privacyHtml = crawler.getPageHtml('/privacy');
      assert.ok(HtmlParser.hasText(privacyHtml, 'Privacy Policy'), 'Rendered /privacy must display Privacy Policy heading');
      assert.ok(HtmlParser.hasText(privacyHtml, 'Protected Health Information'), 'Rendered /privacy must display PHI section');
    }

    // =========================================================================
    // Phase 3: Terms of Use Audit (/terms)
    // =========================================================================
    // Elena audits Terms of Use for Savings Disclaimer and Agreement terms
    assert.ok(
      legalContent.includes('Savings Calculator & Cost Estimates Disclaimer') ||
      legalContent.includes('illustrative and estimation purposes only'),
      'Terms of Use must explicitly state calculator figures are for illustrative purposes'
    );
    assert.ok(
      legalContent.includes('No savings results are guaranteed') || legalContent.includes('not guaranteed'),
      'Terms must explicitly state savings are not guaranteed'
    );
    assert.ok(
      legalContent.includes('Business Associate Agreements') || legalContent.includes('master services agreements'),
      'Terms must state binding obligations require executed BAA and MSA'
    );

    // If static export is present, check rendered /terms HTML
    if (crawler.isExportPresent() && crawler.hasPageExport('/terms')) {
      const termsHtml = crawler.getPageHtml('/terms');
      assert.ok(HtmlParser.hasText(termsHtml, 'Terms of Use'), 'Rendered /terms must display Terms of Use heading');
      assert.ok(HtmlParser.hasText(termsHtml, 'Savings Calculator'), 'Rendered /terms must display savings disclaimer');
    }

    // =========================================================================
    // Phase 4: WCAG AA Color Contrast Compliance Audit
    // =========================================================================
    // Elena verifies body text and heading contrast ratios per WCAG 2.1 AA
    // 1. Slate (#4A5560) on White (#FFFFFF)
    const slateOnWhiteRatio = assertContrastRatio(
      DESIGN_TOKENS.colors.slate,
      DESIGN_TOKENS.colors.white,
      4.5,
      'Slate on White (Body text)'
    );
    assert.ok(slateOnWhiteRatio >= 4.5, 'Slate on White must achieve >= 4.5:1');

    // 2. Charcoal (#131D25) on White (#FFFFFF)
    const charcoalOnWhiteRatio = assertContrastRatio(
      DESIGN_TOKENS.colors.charcoal,
      DESIGN_TOKENS.colors.white,
      4.5,
      'Charcoal on White (Headings)'
    );
    assert.ok(charcoalOnWhiteRatio >= 7.0, 'Charcoal on White must achieve >= 7.0:1');

    // 3. Charcoal (#131D25) on Mist (#F7F8FA)
    const charcoalOnMistRatio = assertContrastRatio(
      DESIGN_TOKENS.colors.charcoal,
      DESIGN_TOKENS.colors.mist,
      4.5,
      'Charcoal on Mist (Cards)'
    );
    assert.ok(charcoalOnMistRatio >= 4.5, 'Charcoal on Mist must achieve >= 4.5:1');
  });

});
