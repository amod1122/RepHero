#!/usr/bin/env node
/**
 * RepHero Build-Time Placeholder Checker
 * Inspects PLACEHOLDERS.md and/or src/content/placeholders.ts
 * Emits clear warnings if unresolved assets or draft copy items exist.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isStrict = process.argv.includes('--strict') || process.env.STRICT_PLACEHOLDERS === 'true';
const placeholdersMdPath = path.join(rootDir, 'PLACEHOLDERS.md');

console.log('\n======================================================');
console.log('🔍 RepHero Placeholder & Asset Verification');
console.log('======================================================\n');

if (!fs.existsSync(placeholdersMdPath)) {
  console.warn('⚠️  Warning: PLACEHOLDERS.md not found at project root.');
  process.exit(isStrict ? 1 : 0);
}

const content = fs.readFileSync(placeholdersMdPath, 'utf8');
const lines = content.split('\n');

const unresolvedItems = [];
for (const line of lines) {
  // Check markdown table rows matching unresolved statuses
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

if (unresolvedItems.length === 0) {
  console.log('✅ All placeholder items and assets have been verified and resolved!\n');
  process.exit(0);
}

console.warn(`⚠️  NOTICE: ${unresolvedItems.length} unresolved placeholder items detected:\n`);
unresolvedItems.forEach((entry, idx) => {
  console.warn(`  ${idx + 1}. [${entry.id}] ${entry.item} -> Status: ${entry.status}`);
  if (entry.notes) {
    console.warn(`     Notes: ${entry.notes}`);
  }
});

console.warn('\n⚠️  LAUNCH RULE: Do not deploy to public production while unresolved placeholders remain on public pages.');

if (isStrict) {
  console.error('\n❌ FAILED: Strict mode enabled and open placeholders were found.\n');
  process.exit(1);
} else {
  console.log('\n✨ Build check passed with non-blocking warnings (development mode).\n');
  process.exit(0);
}
