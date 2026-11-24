/**
 * Assertion Utilities & Structured Error Reporting
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { RouteCrawler } from './route-crawler.mjs';

const crawler = new RouteCrawler();

/**
 * Convert 3 or 6 hex string to RGB object { r, g, b } (0-255)
 * @param {string} hex 
 * @returns {{ r: number, g: number, b: number }}
 */
export function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') {
    throw new TypeError(`Expected hex color string, received: ${hex}`);
  }
  const match = hex.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) {
    throw new Error(`Invalid hex color string: "${hex}"`);
  }
  let clean = match[1];
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Calculate relative luminance per WCAG 2.1 specs
 * @param {string} hex 
 * @returns {number}
 */
export function calculateRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const transform = (val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
}

/**
 * Calculate WCAG contrast ratio between two hex colors: (L1 + 0.05) / (L2 + 0.05)
 * @param {string} color1 
 * @param {string} color2 
 * @returns {number}
 */
export function calculateContrastRatio(color1, color2) {
  const l1 = calculateRelativeLuminance(color1);
  const l2 = calculateRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Assert WCAG AA contrast ratio
 * @param {string} fgHex 
 * @param {string} bgHex 
 * @param {number} minRatio (e.g. 4.5 for body text, 3.0 for large text)
 * @param {string} [label] 
 */
export function assertContrastRatio(fgHex, bgHex, minRatio = 4.5, label = '') {
  const ratio = calculateContrastRatio(fgHex, bgHex);
  assert.ok(
    ratio >= minRatio,
    `Contrast ratio between ${fgHex} and ${bgHex} for ${label || 'element'} is ${ratio.toFixed(2)}:1, which is below required ${minRatio}:1`
  );
  return ratio;
}

/**
 * Assert that text or regex is present in an HTML string
 * @param {string} html 
 * @param {string|RegExp} pattern 
 * @param {string} [message] 
 */
export function assertContainsText(html, pattern, message) {
  if (pattern instanceof RegExp) {
    assert.ok(pattern.test(html), message || `Expected HTML to match regex: ${pattern}`);
  } else {
    assert.ok(html.includes(pattern), message || `Expected HTML to contain text: "${pattern}"`);
  }
}

/**
 * Assert that text or regex is NOT present in an HTML string
 * @param {string} html 
 * @param {string|RegExp} pattern 
 * @param {string} [message] 
 */
export function assertDoesNotContainText(html, pattern, message) {
  if (pattern instanceof RegExp) {
    assert.ok(!pattern.test(html), message || `Expected HTML NOT to match regex: ${pattern}`);
  } else {
    assert.ok(!html.includes(pattern), message || `Expected HTML NOT to contain text: "${pattern}"`);
  }
}

/**
 * Gracefully skip test if static export `out/` is not present
 * @param {object} t (node:test test context)
 * @param {string} [routePath] 
 * @returns {boolean} true if skipped, false if export exists
 */
export function skipIfNoExport(t, routePath) {
  if (!crawler.isExportPresent()) {
    t.skip('Static export out/ directory does not exist. Run npm run build or use --build flag.');
    return true;
  }
  if (routePath && !crawler.hasPageExport(routePath)) {
    t.skip(`Static export file for route "${routePath}" not found in out/.`);
    return true;
  }
  return false;
}

/**
 * Gracefully skip test if a specific file is missing
 * @param {object} t (node:test test context)
 * @param {string} filePath 
 * @param {string} description 
 * @returns {boolean}
 */
export function skipIfFileMissing(t, filePath, description = 'Required file') {
  if (!fs.existsSync(filePath)) {
    t.skip(`${description} missing at: ${filePath}`);
    return true;
  }
  return false;
}

export { assert };
