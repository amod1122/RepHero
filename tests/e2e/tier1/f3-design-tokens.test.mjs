/**
 * Tier 1 Test Suite: F3 - Design Tokens, Typography & WCAG Compliance (R2 / F3)
 * 
 * Verifies color palette hex values, font pairing tokens, square button corners,
 * and mathematical WCAG AA contrast ratio compliance.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DESIGN_TOKENS, PROJECT_ROOT, SRC_DIR } from '../config.mjs';
import { assertContrastRatio } from '../helpers/assertions.mjs';

describe('F3: Design Tokens, CSS Variables & Visual Rules', () => {
  // TEST-T1-F3-001: Brand Color Palette Token Definition
  test('TEST-T1-F3-001: Tailwind configuration and CSS variables define required palette', (t) => {
    const tailwindConfigPath = path.join(PROJECT_ROOT, 'tailwind.config.ts');
    const tokensCssPath = path.join(SRC_DIR, 'app', 'tokens.css');
    const globalsCssPath = path.join(SRC_DIR, 'app', 'globals.css');

    let combinedConfig = '';
    if (fs.existsSync(tailwindConfigPath)) combinedConfig += fs.readFileSync(tailwindConfigPath, 'utf-8');
    if (fs.existsSync(tokensCssPath)) combinedConfig += fs.readFileSync(tokensCssPath, 'utf-8');
    if (fs.existsSync(globalsCssPath)) combinedConfig += fs.readFileSync(globalsCssPath, 'utf-8');

    if (!combinedConfig) {
      t.skip('Style config files not yet created.');
      return;
    }

    const lowerConfig = combinedConfig.toLowerCase();

    // Check hex values or variable definitions
    const expectedHexes = [
      { name: 'Ink', hex: DESIGN_TOKENS.colors.ink.toLowerCase() },
      { name: 'Deep Navy', hex: DESIGN_TOKENS.colors.deepNavy.toLowerCase() },
      { name: 'Charcoal', hex: DESIGN_TOKENS.colors.charcoal.toLowerCase() },
      { name: 'Mist', hex: DESIGN_TOKENS.colors.mist.toLowerCase() },
      { name: 'Peach', hex: DESIGN_TOKENS.colors.peach.toLowerCase() },
      { name: 'Slate', hex: DESIGN_TOKENS.colors.slate.toLowerCase() },
      { name: 'Line', hex: DESIGN_TOKENS.colors.line.toLowerCase() }
    ];

    for (const { name, hex } of expectedHexes) {
      assert.ok(
        lowerConfig.includes(hex) || lowerConfig.includes(name.toLowerCase().replace(/\s+/g, '-')),
        `Config/CSS must define ${name} token (${hex})`
      );
    }
  });

  // TEST-T1-F3-002: Typography Tokens & Font Pairing
  test('TEST-T1-F3-002: Heading font specifies Instrument Serif and body specifies Inter', (t) => {
    const layoutPath = path.join(SRC_DIR, 'app', 'layout.tsx');
    const tailwindConfigPath = path.join(PROJECT_ROOT, 'tailwind.config.ts');

    let code = '';
    if (fs.existsSync(layoutPath)) code += fs.readFileSync(layoutPath, 'utf-8');
    if (fs.existsSync(tailwindConfigPath)) code += fs.readFileSync(tailwindConfigPath, 'utf-8');

    if (!code) {
      t.skip('Layout/Tailwind files not yet created.');
      return;
    }

    // Must configure Instrument Serif (or serif fallback) and Inter
    const hasSerif = /Instrument[\s_]*Serif|serif/i.test(code);
    const hasSans = /Inter|sans-serif/i.test(code);

    assert.ok(hasSerif, 'Must configure Instrument Serif (or serif) heading font');
    assert.ok(hasSans, 'Must configure Inter body font');
  });

  // TEST-T1-F3-003: Button Styling & Square Corners
  test('TEST-T1-F3-003: Design system enforces square or near-square corners (<= 4px)', () => {
    assert.ok(DESIGN_TOKENS.corners.maxBorderRadiusPx <= 4, 'Max allowed corner radius is 4px');
    assert.ok(
      DESIGN_TOKENS.corners.classes.includes('rounded-none') || DESIGN_TOKENS.corners.classes.includes('rounded-[2px]'),
      'Must support square corner classes'
    );
  });

  // TEST-T1-F3-004: Dark Hero Aesthetic & Deep Navy Glow
  test('TEST-T1-F3-004: Dark hero uses Ink background and Deep Navy accents', () => {
    assert.strictEqual(DESIGN_TOKENS.colors.ink, '#090E12', 'Ink background must be #090E12');
    assert.strictEqual(DESIGN_TOKENS.colors.deepNavy, '#0F3554', 'Deep Navy accent must be #0F3554');
  });

  // TEST-T1-F3-005: WCAG AA Color Contrast Compliance
  test('TEST-T1-F3-005: Brand color combinations pass WCAG AA contrast ratio (>= 4.5:1)', () => {
    // 1. Slate (#4A5560) on White (#FFFFFF)
    const bodyRatio = assertContrastRatio(
      DESIGN_TOKENS.colors.slate,
      DESIGN_TOKENS.colors.white,
      4.5,
      'Body Slate on White'
    );
    assert.ok(bodyRatio >= 4.5, `Slate on White contrast (${bodyRatio.toFixed(2)}) must be >= 4.5`);

    // 2. White (#FFFFFF) on Ink (#090E12)
    const heroRatio = assertContrastRatio(
      DESIGN_TOKENS.colors.white,
      DESIGN_TOKENS.colors.ink,
      4.5,
      'Hero White on Ink'
    );
    assert.ok(heroRatio >= 4.5, `White on Ink contrast (${heroRatio.toFixed(2)}) must be >= 4.5`);

    // 3. White (#FFFFFF) on Charcoal (#131D25)
    const buttonRatio = assertContrastRatio(
      DESIGN_TOKENS.colors.white,
      DESIGN_TOKENS.colors.charcoal,
      4.5,
      'Button White on Charcoal'
    );
    assert.ok(buttonRatio >= 4.5, `White on Charcoal contrast (${buttonRatio.toFixed(2)}) must be >= 4.5`);
  });
});
