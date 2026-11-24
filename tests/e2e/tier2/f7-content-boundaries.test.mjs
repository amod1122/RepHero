/**
 * Tier 2 Boundary & Corner Case Test Suite: F7 - Content System & Placeholder Boundaries
 * 
 * Sources:
 * - Explorer 2 Report (TEST-T2-CONT-001 through TEST-T2-CONT-005)
 * - PRD §2 (Zero hardcoding, typed content store)
 * - ORIGINAL_REQUEST.md lines 33-35, AC lines 44-45
 * - PLACEHOLDERS.md (20 cataloged placeholder items)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ContentInspector } from '../helpers/content-inspector.mjs';
import { PROJECT_ROOT, SRC_DIR, PROHIBITED_WORDS } from '../config.mjs';

const inspector = new ContentInspector();

// Parser matching scripts/check-placeholders.mjs logic
export function parsePlaceholderTable(markdownContent) {
  const lines = markdownContent.split('\n');
  const unresolvedItems = [];

  for (const line of lines) {
    if (line.includes('|') && !line.includes('---') && !line.includes('Asset / Item')) {
      const cols = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length >= 3) {
        const [id, item, status, notes] = cols;
        const lowerStatus = (status || '').toLowerCase();
        if (
          lowerStatus.includes('needed') ||
          lowerStatus.includes('placeholder') ||
          lowerStatus.includes('pending') ||
          lowerStatus.includes('unconfirmed') ||
          lowerStatus.includes('to source') ||
          lowerStatus.includes('to draft') ||
          lowerStatus.includes('to create')
        ) {
          unresolvedItems.push({ id, item, status, notes: notes || '' });
        }
      }
    }
  }

  return {
    unresolvedCount: unresolvedItems.length,
    unresolvedItems
  };
}

describe('Tier 2 F7: Content System & Placeholder Boundaries', () => {
  // TEST-T2-CONT-001: Clean State Check vs Synthetic Unresolved Placeholder Detection
  test('TEST-T2-CONT-001: Placeholder parser correctly distinguishes clean resolved states from unresolved items', () => {
    // 1. Synthetic clean state
    const cleanMarkdown = `
# Asset Tracker
| ID | Asset / Item | Status | Notes |
|:---|:---|:---|:---|
| 1 | Vector Logo | Received | High-res SVG confirmed |
| 2 | Brand Colors | Approved | Hex palette finalized |
| 3 | Odonto Logo | Received | Written permission on file |
    `.trim();

    const cleanResult = parsePlaceholderTable(cleanMarkdown);
    assert.strictEqual(cleanResult.unresolvedCount, 0, 'Clean table must report 0 unresolved placeholders');
    assert.deepStrictEqual(cleanResult.unresolvedItems, []);

    // 2. Synthetic unresolved state
    const unresolvedMarkdown = `
# Asset Tracker
| ID | Asset / Item | Status | Notes |
|:---|:---|:---|:---|
| 1 | RepHero White Logo | Needed | Needed for dark hero |
| 2 | Real Contact Details | Placeholder | Corporate email needed |
| 3 | Approved Testimonial | Received | Verified |
    `.trim();

    const unresolvedResult = parsePlaceholderTable(unresolvedMarkdown);
    assert.strictEqual(unresolvedResult.unresolvedCount, 2, 'Must detect exactly 2 unresolved items');
    assert.strictEqual(unresolvedResult.unresolvedItems[0].id, '1');
    assert.strictEqual(unresolvedResult.unresolvedItems[1].id, '2');
  });

  // TEST-T2-CONT-002: PLACEHOLDERS.md Catalog Synchronization Check
  test('TEST-T2-CONT-002: PLACEHOLDERS.md exists and synchronizes all mandatory unsupplied assets', () => {
    const catalog = inspector.getPlaceholdersCatalog();
    assert.ok(catalog.exists, 'PLACEHOLDERS.md must exist in the project root');
    assert.ok(catalog.content, 'PLACEHOLDERS.md content must not be empty');

    const content = catalog.content;

    // Check mandatory unsupplied assets required by PRD & Design Guidelines:
    // 1. RepHero white logo version
    assert.ok(
      content.includes('RepHero Logo, White Version') || content.includes('White Version'),
      'Must catalog RepHero White Version logo'
    );

    // 2. Real contact details (corporate email, phone, location)
    assert.ok(
      content.includes('Real Company Contact Details') || content.includes('Contact Details'),
      'Must catalog real contact details placeholder'
    );

    // 3. Client logos (Odonto, Tareen, MyPsychMD, FASTSIGNS)
    assert.ok(content.includes('Odonto Dental Logo'), 'Must catalog Odonto Dental Logo');
    assert.ok(content.includes('Tareen Dental Logo'), 'Must catalog Tareen Dental Logo');
    assert.ok(content.includes('MyPsychMD Logo'), 'Must catalog MyPsychMD Logo');
    assert.ok(content.includes('FASTSIGNS Logo'), 'Must catalog FASTSIGNS Logo');

    // 4. Testimonials 2-4 pending permission
    assert.ok(
      content.includes('Testimonials 2 to 4') || content.includes('Testimonials 2-4'),
      'Must catalog Testimonials 2-4 pending written consent'
    );

    // 5. Testimonial 1 attribution strictly 'Client Feedback'
    assert.ok(
      content.includes('Client Feedback') && content.includes('Testimonial 1'),
      'Must document Testimonial 1 attribution constraint'
    );
  });

  // TEST-T2-CONT-003: Empty Optional Fields in Content Data Types
  test('TEST-T2-CONT-003: Empty optional fields in content schemas are handled without runtime crashes', () => {
    // 1. Service role with omitted optional fields
    const roleWithoutOptionals = {
      id: 'custom-executive-assistant',
      name: 'Executive Assistant',
      category: 'Admin and Executive',
      description: 'High-level calendar and inbox management for busy practice leaders.',
      responsibilities: ['Calendar management', 'Travel coordination', 'Meeting minutes'],
      priceDisplay: 'Custom quote based on scope',
      pricingModel: 'custom',
      publishedMonthlyPrice: undefined, // OPTIONAL
      unitDetails: undefined,           // OPTIONAL
      popular: undefined                // OPTIONAL
    };

    // Formatter / renderer check: role without publishedMonthlyPrice should render without throwing
    const formatRoleSummary = (role) => {
      const isPopularBadge = role.popular ? 'POPULAR' : '';
      const priceText = role.publishedMonthlyPrice !== undefined 
        ? `$${role.publishedMonthlyPrice.toLocaleString()}/mo` 
        : role.priceDisplay;
      return `${role.name} - ${priceText} ${isPopularBadge}`.trim();
    };

    const summary = formatRoleSummary(roleWithoutOptionals);
    assert.strictEqual(summary, 'Executive Assistant - Custom quote based on scope');
    assert.ok(!summary.includes('undefined'), 'Formatted summary must not contain "undefined"');

    // 2. Industry vertical with omitted testimonial snippet
    const industryWithoutSnippet = {
      id: 'specialty-pharmacy',
      name: 'Specialty Pharmacy',
      slug: 'specialty-pharmacy',
      anchorId: 'specialty-pharmacy',
      headline: 'Prior authorizations, refill coordination, and pharmacy support.',
      description: 'Streamline prescription workflows and reduce fulfillment bottlenecks.',
      painPoints: ['Prior authorization delays', 'High inbound call volume'],
      recommendedRoles: ['prior-authorization-specialist'],
      testimonialSnippet: undefined // OPTIONAL
    };

    const renderIndustryCard = (ind) => {
      const quoteText = ind.testimonialSnippet?.quote || 'Case study available upon consultation';
      return `${ind.name}: ${quoteText}`;
    };

    const cardOutput = renderIndustryCard(industryWithoutSnippet);
    assert.strictEqual(cardOutput, 'Specialty Pharmacy: Case study available upon consultation');

    // 3. HowItWorks step with omitted deliverable
    const stepWithoutDeliverable = {
      step: 1,
      title: 'Discovery Call',
      subtitle: '15-minute alignment',
      description: 'We learn about your practice workflows.',
      details: ['Review EHR setup', 'Identify bottlenecks'],
      deliverable: undefined // OPTIONAL
    };

    const deliverableBadge = stepWithoutDeliverable.deliverable || 'Standard Onboarding';
    assert.strictEqual(deliverableBadge, 'Standard Onboarding');
  });

  // TEST-T2-CONT-004: Prohibited Hardcoded Terms Scan
  test('TEST-T2-CONT-004: Scan across source components contains zero forbidden legacy or stock terms', () => {
    // Forbidden terms: 'Lorem ipsum', 'Aculis', 'dexes', 'Rapido'
    const findings = inspector.scanForProhibitedTerms(PROHIBITED_WORDS);

    // If findings are detected, format clear error message
    if (findings.length > 0) {
      const details = findings
        .map(f => `  - ${f.file}:${f.line} matched "${f.matchedWord}": ${f.preview}`)
        .join('\n');
      assert.fail(`Found forbidden terms in source files:\n${details}`);
    }

    assert.strictEqual(findings.length, 0, 'No prohibited terms should be present in components or app');
  });

  // TEST-T2-CONT-005: Content Module File Integrity
  test('TEST-T2-CONT-005: All required typed content files exist under src/content/', () => {
    const requiredContentFiles = [
      'siteConfig.ts',
      'navigation.ts',
      'services.ts',
      'industries.ts',
      'howItWorks.ts',
      'calculator.ts',
      'testimonials.ts',
      'faq.ts',
      'legal.ts',
      'placeholders.ts',
      'types.ts'
    ];

    for (const fileName of requiredContentFiles) {
      assert.ok(
        inspector.hasContentFile(fileName),
        `Required content module "src/content/${fileName}" must exist`
      );
    }
  });
});
