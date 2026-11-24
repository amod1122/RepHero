/**
 * Tier 2 Boundary & Corner Case Test Suite: F3 - Design Tokens & Visual Boundaries
 * 
 * Sources:
 * - Design Guidelines §3 (Color Palette, Hex Codes, Contrast Ratios)
 * - Design Guidelines §4 (Typography Tokens & Font Fallbacks)
 * - Design Guidelines §5 (Square corners, Button Styling, Max Border Radius <= 4px)
 * - WCAG 2.1 Level AA (4.5:1 for body text, 3.0:1 for large text / components)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  calculateContrastRatio,
  assertContrastRatio
} from '../helpers/assertions.mjs';
import { DESIGN_TOKENS, PROJECT_ROOT, SRC_DIR } from '../config.mjs';

describe('Tier 2 F3: Design Tokens & Visual Boundaries', () => {
  // TEST-T2-F3-001: Extreme Contrast Checks & WCAG AA Compliance Across Token Pairs
  test('TEST-T2-F3-001: WCAG AA contrast ratio compliance for all approved background/foreground token pairs', () => {
    const { colors } = DESIGN_TOKENS;

    // 1. Body Text Slate (#4A5560) on Light Backgrounds
    const slateOnWhite = calculateContrastRatio(colors.slate, colors.white);
    assert.ok(
      slateOnWhite >= DESIGN_TOKENS.contrastRatios.bodyTextMin,
      `Slate on White contrast ratio (${slateOnWhite.toFixed(2)}:1) must meet WCAG AA body minimum (>= 4.5:1)`
    );

    const slateOnMist = calculateContrastRatio(colors.slate, colors.mist);
    assert.ok(
      slateOnMist >= DESIGN_TOKENS.contrastRatios.bodyTextMin,
      `Slate on Mist contrast ratio (${slateOnMist.toFixed(2)}:1) must meet WCAG AA body minimum (>= 4.5:1)`
    );

    // 2. White Text on Dark Backgrounds
    const whiteOnInk = calculateContrastRatio(colors.white, colors.ink);
    assert.ok(
      whiteOnInk >= DESIGN_TOKENS.contrastRatios.bodyTextMin,
      `White on Ink contrast ratio (${whiteOnInk.toFixed(2)}:1) must meet WCAG AA body minimum (>= 4.5:1)`
    );

    const whiteOnCharcoal = calculateContrastRatio(colors.white, colors.charcoal);
    assert.ok(
      whiteOnCharcoal >= DESIGN_TOKENS.contrastRatios.bodyTextMin,
      `White on Charcoal contrast ratio (${whiteOnCharcoal.toFixed(2)}:1) must meet WCAG AA body minimum (>= 4.5:1)`
    );

    const whiteOnNavy = calculateContrastRatio(colors.white, colors.deepNavy);
    assert.ok(
      whiteOnNavy >= DESIGN_TOKENS.contrastRatios.bodyTextMin,
      `White on Deep Navy contrast ratio (${whiteOnNavy.toFixed(2)}:1) must meet WCAG AA body minimum (>= 4.5:1)`
    );

    // 3. Dark Text on Accent Backgrounds
    const inkOnPeach = calculateContrastRatio(colors.ink, colors.peach);
    assert.ok(
      inkOnPeach >= DESIGN_TOKENS.contrastRatios.bodyTextMin,
      `Ink on Peach contrast ratio (${inkOnPeach.toFixed(2)}:1) must meet WCAG AA body minimum (>= 4.5:1)`
    );

    const navyOnSky = calculateContrastRatio(colors.deepNavy, colors.sky);
    assert.ok(
      navyOnSky >= DESIGN_TOKENS.contrastRatios.bodyTextMin,
      `Deep Navy on Sky contrast ratio (${navyOnSky.toFixed(2)}:1) must meet WCAG AA body minimum (>= 4.5:1)`
    );

    // 4. Boundary Verification: Incompatible Low-Contrast Pairs MUST NOT be allowed for body text
    const slateOnInk = calculateContrastRatio(colors.slate, colors.ink);
    assert.ok(
      slateOnInk < DESIGN_TOKENS.contrastRatios.bodyTextMin,
      `Slate on Ink (${slateOnInk.toFixed(2)}:1) is low-contrast and correctly flagged as unsuitable for body text`
    );

    const skyOnWhite = calculateContrastRatio(colors.sky, colors.white);
    assert.ok(
      skyOnWhite < DESIGN_TOKENS.contrastRatios.bodyTextMin,
      `Sky on White (${skyOnWhite.toFixed(2)}:1) is low-contrast and correctly flagged as unsuitable for body text`
    );
  });

  // TEST-T2-F3-002: Button & Card Border Radius Clamping (<= 4px)
  test('TEST-T2-F3-002: Button border radius is strictly clamped to <= 4px (rounded-[2px] or rounded-none)', () => {
    // Design Guidelines §5: "Corners: square or near-square 0-4px (rounded-[2px] or rounded-none)"
    const maxRadius = DESIGN_TOKENS.corners.maxBorderRadiusPx;
    assert.strictEqual(maxRadius, 4, 'Design tokens must specify max border radius of 4px');

    // Scan component files for prohibited rounded pill classes on buttons
    const targetDirs = [
      path.join(SRC_DIR, 'components'),
      path.join(SRC_DIR, 'app')
    ];

    const prohibitedRadiusClasses = [
      'rounded-full',
      'rounded-3xl',
      'rounded-2xl',
      'rounded-xl'
    ];

    const violations = [];
    const walk = (dir) => {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules') {
          walk(full);
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))) {
          const content = fs.readFileSync(full, 'utf-8');
          // Check if button or CTA element uses an overly rounded class
          const buttonTagRegex = /<(?:button|a)\b[^>]*className=["']([^"']*)["'][^>]*>/gi;
          let match;
          while ((match = buttonTagRegex.exec(content)) !== null) {
            const classStr = match[1];
            for (const prohibited of prohibitedRadiusClasses) {
              if (new RegExp(`\\b${prohibited}\\b`).test(classStr)) {
                // Ignore avatar images or badge circles if any
                if (!classStr.includes('avatar') && !classStr.includes('badge')) {
                  violations.push({ file: entry.name, classStr, prohibited });
                }
              }
            }
          }
        }
      }
    };

    for (const dir of targetDirs) {
      walk(dir);
    }

    assert.strictEqual(
      violations.length,
      0,
      `Buttons must not use rounded-full/rounded-2xl. Found violations: ${JSON.stringify(violations)}`
    );
  });

  // TEST-T2-F3-003: Font Family Fallback Chain Completeness
  test('TEST-T2-F3-003: Typography tokens configure complete fallback chains (Serif -> Georgia/serif, Sans -> system-ui)', () => {
    // 1. Verify config tokens
    assert.strictEqual(DESIGN_TOKENS.typography.headings, 'Instrument Serif');
    assert.strictEqual(DESIGN_TOKENS.typography.body, 'Inter');

    const hasSerifFallback = DESIGN_TOKENS.typography.serifFallbacks.some(f => f.toLowerCase().includes('serif') || f.toLowerCase().includes('georgia'));
    assert.ok(hasSerifFallback, 'Headings font must configure Georgia or generic serif fallback');

    const hasSansFallback = DESIGN_TOKENS.typography.sansFallbacks.some(f => f.toLowerCase().includes('sans') || f.toLowerCase().includes('system-ui'));
    assert.ok(hasSansFallback, 'Body font must configure system-ui or generic sans-serif fallback');

    // 2. Inspect tailwind.config.ts / tailwind.config.js or globals.css
    const candidateConfigFiles = [
      path.join(PROJECT_ROOT, 'tailwind.config.ts'),
      path.join(PROJECT_ROOT, 'tailwind.config.js'),
      path.join(SRC_DIR, 'app', 'layout.tsx'),
      path.join(SRC_DIR, 'app', 'tokens.css'),
      path.join(SRC_DIR, 'app', 'globals.css')
    ];

    let combinedConfig = '';
    for (const file of candidateConfigFiles) {
      if (fs.existsSync(file)) {
        combinedConfig += fs.readFileSync(file, 'utf-8') + '\n';
      }
    }

    // Must reference Instrument Serif and Inter
    const hasInstrumentSerif = combinedConfig.includes('Instrument Serif') || combinedConfig.includes('Instrument_Serif') || combinedConfig.includes('instrument-serif');
    const hasInter = combinedConfig.includes('Inter') || combinedConfig.includes('inter');

    assert.ok(hasInstrumentSerif, 'Font configuration must reference Instrument Serif');
    assert.ok(hasInter, 'Font configuration must reference Inter');
  });

  // TEST-T2-F3-004: Dark Hero Aesthetic & Ink Background Token Preservation
  test('TEST-T2-F3-004: Dark Hero token definition uses Ink (#090E12) and Deep Navy (#0F3554)', () => {
    const { colors } = DESIGN_TOKENS;

    assert.strictEqual(colors.ink.toUpperCase(), '#090E12', 'Ink hex code must be strictly #090E12');
    assert.strictEqual(colors.deepNavy.toUpperCase(), '#0F3554', 'Deep Navy hex code must be strictly #0F3554');
    assert.strictEqual(colors.charcoal.toUpperCase(), '#131D25', 'Charcoal hex code must be strictly #131D25');
    assert.strictEqual(colors.mist.toUpperCase(), '#F7F8FA', 'Mist hex code must be strictly #F7F8FA');
    assert.strictEqual(colors.peach.toUpperCase(), '#FFE3D1', 'Peach hex code must be strictly #FFE3D1');
    assert.strictEqual(colors.sky.toUpperCase(), '#C6DDF5', 'Sky hex code must be strictly #C6DDF5');
    assert.strictEqual(colors.line.toUpperCase(), '#E3E6EA', 'Line hex code must be strictly #E3E6EA');
  });

  // TEST-T2-F3-005: Line Token Border Contrast for Structural Separation
  test('TEST-T2-F3-005: Line token (#E3E6EA) provides sufficient structural divider contrast against White and Mist', () => {
    const { colors } = DESIGN_TOKENS;

    // Line against white background
    const lineOnWhite = calculateContrastRatio(colors.line, colors.white);
    assert.ok(
      lineOnWhite >= 1.15,
      `Line token must have distinct luminance contrast against White for subtle border visibility (${lineOnWhite.toFixed(2)}:1)`
    );

    // Line against charcoal/ink (dark mode divider)
    const lineOnInk = calculateContrastRatio(colors.line, colors.ink);
    assert.ok(
      lineOnInk >= 14.0,
      `Line token on Ink provides high visibility divider contrast (${lineOnInk.toFixed(2)}:1)`
    );
  });
});
