/**
 * Tier 3 Test Suite: Cross-Feature Combinations — Placeholder to Build
 * File: tests/e2e/tier3/placeholder-to-build.test.mjs
 * 
 * Sources:
 * - ORIGINAL_REQUEST.md: R6 (Content System and Placeholder Management)
 * - PRD §8.8 (Placeholder Tracking & Warning Check)
 * - PROJECT.md: Feature 5 & Acceptance Criteria
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execSync, spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { ContentInspector } from '../helpers/content-inspector.mjs';
import { PROJECT_ROOT } from '../config.mjs';

const inspector = new ContentInspector();

describe('Tier 3: Placeholder Catalog & Build-Time Enforcement Integration', () => {

  // TEST-T3-HOLD-001: Placeholder Checker Script Execution and Warning Output
  test('TEST-T3-HOLD-001: check-placeholders.mjs executes successfully in dev mode and outputs non-blocking warnings', () => {
    const checkerScript = path.join(PROJECT_ROOT, 'scripts', 'check-placeholders.mjs');
    assert.ok(fs.existsSync(checkerScript), 'scripts/check-placeholders.mjs must exist');

    // Run script directly in dev mode (non-strict)
    const result = spawnSync(process.execPath, [checkerScript], {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      env: { ...process.env, STRICT_PLACEHOLDERS: '' }
    });

    assert.strictEqual(result.status, 0, 'Script must exit with code 0 in standard development mode');

    const output = (result.stdout || '') + (result.stderr || '');
    assert.ok(
      output.includes('RepHero Placeholder & Asset Verification'),
      'Script output must include RepHero header banner'
    );
    assert.ok(
      output.includes('unresolved placeholder items detected') || output.includes('NOTICE'),
      'Script must report unresolved placeholder items detected'
    );
  });

  // TEST-T3-HOLD-002: Strict Mode Production Build Gating
  test('TEST-T3-HOLD-002: Strict mode (--strict or STRICT_PLACEHOLDERS=true) blocks execution with exit code 1', () => {
    const checkerScript = path.join(PROJECT_ROOT, 'scripts', 'check-placeholders.mjs');

    // Run with --strict flag
    const resultStrictFlag = spawnSync(process.execPath, [checkerScript, '--strict'], {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8'
    });

    assert.strictEqual(resultStrictFlag.status, 1, 'Script must exit with code 1 when --strict flag is passed');
    const outputFlag = (resultStrictFlag.stdout || '') + (resultStrictFlag.stderr || '');
    assert.ok(
      outputFlag.includes('FAILED') || outputFlag.includes('Strict mode enabled'),
      'Stderr/stdout must report strict mode failure'
    );

    // Run with STRICT_PLACEHOLDERS=true environment variable
    const resultStrictEnv = spawnSync(process.execPath, [checkerScript], {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      env: { ...process.env, STRICT_PLACEHOLDERS: 'true' }
    });

    assert.strictEqual(resultStrictEnv.status, 1, 'Script must exit with code 1 when STRICT_PLACEHOLDERS=true');
  });

  // TEST-T3-HOLD-003: PLACEHOLDERS.md Catalog Completeness and Parity
  test('TEST-T3-HOLD-003: PLACEHOLDERS.md catalogs all mandatory unsupplied assets and copy items', () => {
    const placeholdersMdPath = path.join(PROJECT_ROOT, 'PLACEHOLDERS.md');
    assert.ok(fs.existsSync(placeholdersMdPath), 'PLACEHOLDERS.md must exist at project root');

    const content = fs.readFileSync(placeholdersMdPath, 'utf-8');
    const lines = content.split('\n');

    // Extract table rows
    const tableRows = lines.filter(line => 
      line.includes('|') && !line.includes('---') && !line.includes('Asset / Item')
    );
    assert.ok(tableRows.length >= 10, `PLACEHOLDERS.md table must contain at least 10 tracked items, found ${tableRows.length}`);

    // Verify mandatory placeholder categories
    assert.ok(content.includes('Logo') || content.includes('logo'), 'Must catalog logo placeholders');
    assert.ok(content.includes('Testimonial') || content.includes('testimonial'), 'Must catalog testimonial approvals');
    assert.ok(content.includes('Contact') || content.includes('Phone'), 'Must catalog corporate contact details');
    assert.ok(content.includes('HIPAA') || content.includes('BAA') || content.includes('Compliance'), 'Must catalog compliance copy review');
  });

  // TEST-T3-HOLD-004: Zero Prohibited Terms Scan Across Codebase
  test('TEST-T3-HOLD-004: Codebase scan confirms zero prohibited terms (Lorem ipsum, Aculis, etc.)', () => {
    const findings = inspector.scanForProhibitedTerms();
    assert.strictEqual(
      findings.length,
      0,
      findings.length > 0
        ? `Found ${findings.length} prohibited terms: ${JSON.stringify(findings, null, 2)}`
        : 'Zero prohibited terms found'
    );
  });

});
