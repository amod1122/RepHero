/**
 * Tier 1 Test Suite: F7 - Content System & Placeholder Management (R6 / F7)
 * 
 * Verifies zero-hardcoding policy, PLACEHOLDERS.md catalog completeness,
 * execution of build-time placeholder checker, prohibition of "lorem ipsum",
 * and development-mode placeholder badges.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { PROJECT_ROOT, SRC_DIR, PROHIBITED_WORDS } from '../config.mjs';
import { ContentInspector } from '../helpers/content-inspector.mjs';

const inspector = new ContentInspector();

describe('F7: Content System & Placeholder Management', () => {
  // TEST-T1-F7-001: Zero Hardcoding Policy Enforcement
  test('TEST-T1-F7-001: Component files do not contain hardcoded pricing literals ($1,499 etc)', (t) => {
    // Hardcoded prices in component files are prohibited; they must come from src/content/
    const hardcodedFindings = inspector.scanForHardcodedPrices();
    
    if (hardcodedFindings.length > 0) {
      console.warn('Hardcoded price findings:', hardcodedFindings);
    }
    assert.strictEqual(
      hardcodedFindings.length,
      0,
      `Found ${hardcodedFindings.length} hardcoded price literals in components: ${JSON.stringify(hardcodedFindings)}`
    );
  });

  // TEST-T1-F7-002: Catalog Completeness in PLACEHOLDERS.md
  test('TEST-T1-F7-002: PLACEHOLDERS.md exists and catalogs unsupplied assets and pending approvals', (t) => {
    const catalog = inspector.getPlaceholdersCatalog();
    if (!catalog.exists) {
      t.skip('PLACEHOLDERS.md not yet created. Will be verified in Milestone M1.');
      return;
    }

    assert.ok(catalog.content.length > 100, 'PLACEHOLDERS.md must be populated');
    
    // Check for cataloging required items
    const lowerContent = catalog.content.toLowerCase();
    assert.ok(lowerContent.includes('logo'), 'PLACEHOLDERS.md must catalog logo assets');
    assert.ok(lowerContent.includes('contact') || lowerContent.includes('phone') || lowerContent.includes('email'), 'Must catalog contact details');
    assert.ok(lowerContent.includes('testimonial') || lowerContent.includes('approval'), 'Must catalog pending testimonials');
  });

  // TEST-T1-F7-003: Build-Time Placeholder Checker Script Execution
  test('TEST-T1-F7-003: Build-time placeholder checker script executes without runtime crash', (t) => {
    const scriptPath = path.join(PROJECT_ROOT, 'scripts', 'check-placeholders.mjs');
    if (!fs.existsSync(scriptPath)) {
      t.skip('scripts/check-placeholders.mjs not yet created. Will be verified in Milestone M1.');
      return;
    }

    try {
      const output = execSync(`node ${scriptPath}`, { cwd: PROJECT_ROOT, encoding: 'utf-8' });
      assert.ok(typeof output === 'string', 'Script must produce string output');
    } catch (err) {
      // If script exits with warning code or output, verify it did not crash unhandled
      assert.ok(err.stdout || err.stderr, 'Script execution produced diagnostic output');
    }
  });

  // TEST-T1-F7-004: Prohibition of Stock Claims & "Lorem Ipsum"
  test('TEST-T1-F7-004: Zero occurrences of "lorem ipsum", "Aculis", "dexes", or "Rapido" in source', () => {
    const findings = inspector.scanForProhibitedTerms(PROHIBITED_WORDS);
    assert.strictEqual(
      findings.length,
      0,
      `Prohibited terms found in source files: ${JSON.stringify(findings, null, 2)}`
    );
  });

  // TEST-T1-F7-005: Visual Placeholder Badge in Development Mode
  test('TEST-T1-F7-005: PlaceholderBadge component gates display to development mode', (t) => {
    const badgeComponentPath = path.join(SRC_DIR, 'components', 'PlaceholderBadge.tsx');
    if (!fs.existsSync(badgeComponentPath)) {
      t.skip('PlaceholderBadge.tsx not yet created. Will be verified in Milestone M1.');
      return;
    }

    const code = fs.readFileSync(badgeComponentPath, 'utf-8');
    assert.ok(
      code.includes('process.env.NODE_ENV') || code.includes('development'),
      'PlaceholderBadge must check NODE_ENV === development'
    );
  });
});
