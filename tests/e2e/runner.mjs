#!/usr/bin/env node
/**
 * RepHero Unified E2E Test Runner CLI
 * 
 * Architecture:
 * - 100% Zero-dependency Node.js native test runner (node:test, node:test/reporters, node:assert/strict).
 * - Immune to Windows wildcard/shell globbing issues by performing recursive filesystem discovery.
 * - Granular tier filtering (--tier=1, --tier=2, --tier=3, --tier=4) and suite filtering (--suite=name).
 * - Optional pre-flight build triggering via --build.
 */

import { run } from 'node:test';
import { spec } from 'node:test/reporters';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');
const TESTS_DIR = __dirname;
const OUT_DIR = path.join(ROOT_DIR, 'out');

// Parse CLI flags
const args = process.argv.slice(2);
const flags = {
  tier: null,
  suite: null,
  build: false,
  help: false
};

for (const arg of args) {
  if (arg === '--help' || arg === '-h') {
    flags.help = true;
  } else if (arg.startsWith('--tier=')) {
    flags.tier = arg.split('=')[1].trim();
  } else if (arg.startsWith('--suite=')) {
    flags.suite = arg.split('=')[1].trim();
  } else if (arg === '--build') {
    flags.build = true;
  }
}

if (flags.help) {
  console.log(`
RepHero E2E Test Runner CLI
===========================
Usage:
  node tests/e2e/runner.mjs [options]
  npm run test:e2e -- [options]

Options:
  --tier=<1|2|3|4|5>  Execute tests belonging to a specific tier
  --suite=<pattern>   Execute tests matching suite name/pattern (e.g. f4, calculator)
  --build             Execute 'npm run build' before running test suites
  --help, -h          Show this help message

Examples:
  node tests/e2e/runner.mjs --tier=1
  node tests/e2e/runner.mjs --tier=1 --suite=f4-calculator
  node tests/e2e/runner.mjs --build
`);
  process.exit(0);
}

// Execute pre-flight build if requested
if (flags.build) {
  console.log('\n[Pre-flight] Running build to generate static export (out/)...');
  try {
    // Check if check-placeholders script exists
    const checkerScript = path.join(ROOT_DIR, 'scripts', 'check-placeholders.mjs');
    if (fs.existsSync(checkerScript)) {
      execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });
    } else {
      execSync('npx next build', { cwd: ROOT_DIR, stdio: 'inherit' });
    }
    console.log('[Pre-flight] Build completed successfully.\n');
  } catch (err) {
    console.error('[Pre-flight] Build failed. Aborting tests.\n', err);
    process.exit(1);
  }
}

// Pre-flight check on out/ directory
const exportExists = fs.existsSync(OUT_DIR) && fs.statSync(OUT_DIR).isDirectory();
if (!exportExists) {
  console.log('ℹ Notice: Static export "out/" directory not detected.');
  console.log('  Tests verifying compiled HTML will report skipped status.');
  console.log('  Use "node tests/e2e/runner.mjs --build" to generate the export.\n');
}

// Recursive test file discovery
function discoverTestFiles(dir, tierFilter, suiteFilter) {
  const testFiles = [];

  const tierDirs = ['tier1', 'tier2', 'tier3', 'tier4', 'tier5'];
  let targetDirs = tierDirs;

  if (tierFilter) {
    const requested = `tier${tierFilter.replace(/^tier/i, '')}`;
    targetDirs = tierDirs.filter(t => t.toLowerCase() === requested.toLowerCase());
  }

  for (const tDir of targetDirs) {
    const fullDirPath = path.join(dir, tDir);
    if (!fs.existsSync(fullDirPath)) continue;

    const files = fs.readdirSync(fullDirPath);
    for (const file of files) {
      if (file.endsWith('.test.mjs') || file.endsWith('.spec.mjs')) {
        if (!suiteFilter || file.toLowerCase().includes(suiteFilter.toLowerCase())) {
          testFiles.push(path.join(fullDirPath, file));
        }
      }
    }
  }

  return testFiles.sort();
}

const discoveredFiles = discoverTestFiles(TESTS_DIR, flags.tier, flags.suite);

if (discoveredFiles.length === 0) {
  console.log('⚠ No test files found matching criteria:');
  console.log(`  Tier filter:  ${flags.tier || 'ALL'}`);
  console.log(`  Suite filter: ${flags.suite || 'ALL'}`);
  process.exit(0);
}

console.log(`================================================================`);
console.log(`RepHero E2E Test Runner`);
console.log(`Execution Mode: Native Node.js Test Engine (v${process.versions.node})`);
console.log(`Selected Tier:  ${flags.tier ? `Tier ${flags.tier}` : 'ALL TIERS'}`);
console.log(`Suite Filter:   ${flags.suite || 'NONE'}`);
console.log(`Files Queued:   ${discoveredFiles.length}`);
console.log(`================================================================\n`);

const startTime = Date.now();
let passCount = 0;
let failCount = 0;
let skipCount = 0;

const testStream = run({
  files: discoveredFiles,
  concurrency: true
});

testStream.on('test:pass', (t) => {
  // Do not count suite (describe block) completion events as individual tests
  if (t.details?.type === 'suite' || t.type === 'suite') {
    return;
  }
  if (t.skip) {
    skipCount++;
  } else {
    passCount++;
  }
});

testStream.on('test:fail', (t) => {
  if (t.details?.type === 'suite' || t.type === 'suite') {
    return;
  }
  failCount++;
});

// Format output using standard spec reporter
testStream.compose(spec).pipe(process.stdout);

testStream.on('end', () => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const total = passCount + failCount + skipCount;

  console.log('\n================================================================');
  console.log('RepHero E2E Test Execution Summary');
  console.log('================================================================');
  console.log(`Total Files:   ${discoveredFiles.length}`);
  console.log(`Total Tests:   ${total}`);
  console.log(`Passed:        ${passCount}`);
  console.log(`Failed:        ${failCount}`);
  console.log(`Skipped:       ${skipCount}`);
  console.log(`Duration:      ${duration}s`);
  console.log('================================================================');

  if (failCount > 0) {
    console.log(`❌ Result: FAILED (${failCount} test failures)\n`);
    process.exitCode = 1;
  } else {
    console.log(`✔ Result: PASSED (All tests passed or skipped gracefully)\n`);
    process.exitCode = 0;
  }
});
