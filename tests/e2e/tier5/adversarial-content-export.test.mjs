/**
 * Tier 5 Test Suite: Adversarial Content Governance, Testimonial Leaks & Export Hardening
 * File: tests/e2e/tier5/adversarial-content-export.test.mjs
 * 
 * Inverted Challenger Cycle for Milestone 5 Phase 2:
 * 1. Adversarial Testimonial & Logo Leak Audit across all out/ files
 * 2. Static Export & Canonical Routing Integrity (12 routes, 404, sitemap, robots)
 * 3. SEO & Structured Data (JSON-LD) Syntactic & Semantic Adversarial Stress
 * 4. Strict Placeholder Verification & CI/CD Gating
 * 
 * Engine: Native Node.js Test Runner (node:test, node:assert/strict)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../..');
const OUT_DIR = path.resolve(ROOT_DIR, 'out');
const SRC_DIR = path.resolve(ROOT_DIR, 'src');

// Helper to recursively collect all files in a directory
function getAllFilesSync(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      getAllFilesSync(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

// 12 Canonical Routes Definition
const CANONICAL_ROUTES = [
  { path: '/', file: path.join(OUT_DIR, 'index.html'), inSitemap: true },
  { path: '/services', file: path.join(OUT_DIR, 'services', 'index.html'), inSitemap: true },
  { path: '/industries', file: path.join(OUT_DIR, 'industries', 'index.html'), inSitemap: true },
  { path: '/how-it-works', file: path.join(OUT_DIR, 'how-it-works', 'index.html'), inSitemap: true },
  { path: '/savings-calculator', file: path.join(OUT_DIR, 'savings-calculator', 'index.html'), inSitemap: true },
  { path: '/success-stories', file: path.join(OUT_DIR, 'success-stories', 'index.html'), inSitemap: true },
  { path: '/about', file: path.join(OUT_DIR, 'about', 'index.html'), inSitemap: true },
  { path: '/book-a-call', file: path.join(OUT_DIR, 'book-a-call', 'index.html'), inSitemap: true },
  { path: '/thank-you', file: path.join(OUT_DIR, 'thank-you', 'index.html'), inSitemap: true },
  { path: '/privacy', file: path.join(OUT_DIR, 'privacy', 'index.html'), inSitemap: true },
  { path: '/terms', file: path.join(OUT_DIR, 'terms', 'index.html'), inSitemap: true },
  { path: '/not-found', file: path.join(OUT_DIR, '404.html'), inSitemap: false }
];

// Helper to extract JSON-LD script blocks from HTML
function extractJsonLdBlocks(html) {
  const blocks = [];
  const regex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

// Helper to extract meta tag contents
function extractMeta(html, attrName, attrValue) {
  const pattern = new RegExp(`<meta\\s+[^>]*${attrName}=["']${attrValue}["'][^>]*content=["']([^"']*)["']`, 'i');
  const altPattern = new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*${attrName}=["']${attrValue}["']`, 'i');
  const match = html.match(pattern) || html.match(altPattern);
  return match ? match[1] : null;
}

// ==============================================================================
// SUITE 1: Adversarial Testimonial & Logo Leak Audit
// ==============================================================================
describe('Tier 5 Suite 1: Adversarial Testimonial & Logo Leak Audit', () => {

  test('TEST-T5-LEAK-001: Scan all files in out/ for unapproved client names', () => {
    assert.ok(fs.existsSync(OUT_DIR), 'Static export out/ directory must exist');
    const allExportFiles = getAllFilesSync(OUT_DIR);
    assert.ok(allExportFiles.length > 0, 'Export directory out/ must contain files');

    const forbiddenClients = ['Tareen Dental', 'Tareen', 'MyPsychMD', 'FASTSIGNS'];
    const detectedLeaks = [];

    for (const filePath of allExportFiles) {
      const ext = path.extname(filePath).toLowerCase();
      // Scan HTML, JS, JSON, XML, TXT
      if (!['.html', '.js', '.json', '.xml', '.txt'].includes(ext)) continue;

      const content = fs.readFileSync(filePath, 'utf8');
      for (const client of forbiddenClients) {
        if (content.includes(client)) {
          detectedLeaks.push({
            file: path.relative(OUT_DIR, filePath),
            client,
            snippet: content.substring(
              Math.max(0, content.indexOf(client) - 40),
              Math.min(content.length, content.indexOf(client) + 60)
            )
          });
        }
      }
    }

    assert.strictEqual(
      detectedLeaks.length,
      0,
      `Unapproved client name leaks detected in out/: ${JSON.stringify(detectedLeaks, null, 2)}`
    );
  });

  test('TEST-T5-LEAK-002: Scan all files in out/ for unapproved quotes and draft testimonials', () => {
    assert.ok(fs.existsSync(OUT_DIR), 'Static export out/ directory must exist');
    const allExportFiles = getAllFilesSync(OUT_DIR);

    const forbiddenQuotes = [
      'Support that lets clinicians focus on care',
      'Smooth patient experience from the first call',
      'Design delivered with client satisfaction',
      'Having dedicated, HIPAA-compliant remote staff',
      'The dedicated graphic designer provided by RepHero'
    ];

    const detectedLeaks = [];

    for (const filePath of allExportFiles) {
      const ext = path.extname(filePath).toLowerCase();
      if (!['.html', '.js', '.json', '.xml', '.txt'].includes(ext)) continue;

      const content = fs.readFileSync(filePath, 'utf8');
      for (const quote of forbiddenQuotes) {
        if (content.includes(quote)) {
          detectedLeaks.push({
            file: path.relative(OUT_DIR, filePath),
            quote,
            snippet: content.substring(
              Math.max(0, content.indexOf(quote) - 40),
              Math.min(content.length, content.indexOf(quote) + quote.length + 40)
            )
          });
        }
      }
    }

    assert.strictEqual(
      detectedLeaks.length,
      0,
      `Unapproved testimonial quote leaks detected in out/: ${JSON.stringify(detectedLeaks, null, 2)}`
    );
  });

  test('TEST-T5-LEAK-003: Odonto Dental is strictly attributed as "Client Feedback" and never as "Odonto Dental" or "Client Feedback (Odonto Dental)"', () => {
    // Check pages displaying testimonials (/ and /success-stories)
    const testimonialPages = [
      path.join(OUT_DIR, 'index.html'),
      path.join(OUT_DIR, 'success-stories', 'index.html')
    ];

    for (const pagePath of testimonialPages) {
      assert.ok(fs.existsSync(pagePath), `Page must exist: ${pagePath}`);
      const html = fs.readFileSync(pagePath, 'utf8');

      // Negative assertion 1: Must never attribute as "Client Feedback (Odonto Dental)"
      assert.strictEqual(
        html.includes('Client Feedback (Odonto Dental)'),
        false,
        `${pagePath} must NOT contain "Client Feedback (Odonto Dental)"`
      );

      // Negative assertion 2: Attribution container must not use Odonto Dental
      // The attribution container has text-charcoal and font-semibold
      const attributionMatches = html.match(/class=["'][^"']*font-semibold\s+text-charcoal\s+text-sm[^"']*["']>([^<]+)<\/div>/g) || [];
      for (const match of attributionMatches) {
        const text = match.replace(/<[^>]+>/g, '').trim();
        if (text.includes('Odonto')) {
          assert.fail(`Attribution line contains client name "${text}" in ${pagePath}`);
        }
      }

      // Positive assertion: "Client Feedback" must exist in the HTML
      assert.ok(
        html.includes('Client Feedback'),
        `${pagePath} must render "Client Feedback" attribution`
      );
    }
  });

  test('TEST-T5-LEAK-004: Adversarial stress test of filterApprovedTestimonials gating function', async () => {
    const testimonialsUrl = pathToFileURL(path.join(SRC_DIR, 'content', 'testimonials.ts')).href;
    const testimonialsModule = await import(testimonialsUrl);
    const { filterApprovedTestimonials } = testimonialsModule;

    assert.strictEqual(typeof filterApprovedTestimonials, 'function', 'filterApprovedTestimonials must be exported');

    // Test adversarial and corrupted inputs:
    assert.deepStrictEqual(filterApprovedTestimonials(null), [], 'Must return empty array for null');
    assert.deepStrictEqual(filterApprovedTestimonials(undefined), [], 'Must return empty array for undefined');
    assert.deepStrictEqual(filterApprovedTestimonials([]), [], 'Must return empty array for empty array');

    // Attempted truthy bypass using strings
    const stringBypass = [{ id: 'fake-1', isApproved: 'true', status: 'published' }];
    assert.strictEqual(
      filterApprovedTestimonials(stringBypass).length,
      0,
      'String "true" must NOT bypass strict boolean isApproved === true check'
    );

    // Attempted truthy bypass using numbers
    const numberBypass = [{ id: 'fake-2', isApproved: 1, status: 'published' }];
    assert.strictEqual(
      filterApprovedTestimonials(numberBypass).length,
      0,
      'Number 1 must NOT bypass strict boolean isApproved === true check'
    );

    // Attempted status bypass
    const pendingWithApprovedFlag = [{ id: 'fake-3', isApproved: true, status: 'pending' }];
    assert.strictEqual(
      filterApprovedTestimonials(pendingWithApprovedFlag).length,
      0,
      'status "pending" must NOT pass filter even if isApproved is true'
    );

    const draftWithApprovedFlag = [{ id: 'fake-4', isApproved: true, status: 'draft' }];
    assert.strictEqual(
      filterApprovedTestimonials(draftWithApprovedFlag).length,
      0,
      'status "draft" must NOT pass filter even if isApproved is true'
    );

    // Valid item check
    const validItem = [{ id: 'valid-1', isApproved: true, status: 'published' }];
    assert.strictEqual(
      filterApprovedTestimonials(validItem).length,
      1,
      'Properly approved and published item must pass filter'
    );
  });

  test('TEST-T5-LEAK-005: Adversarial stress test of getEnforcedAttribution invariant function', async () => {
    const testimonialsUrl = pathToFileURL(path.join(SRC_DIR, 'content', 'testimonials.ts')).href;
    const testimonialsModule = await import(testimonialsUrl);
    const { getEnforcedAttribution } = testimonialsModule;

    assert.strictEqual(typeof getEnforcedAttribution, 'function', 'getEnforcedAttribution must be exported');

    // Null/undefined/empty fallbacks
    assert.strictEqual(getEnforcedAttribution(null), 'Client Feedback', 'null must return "Client Feedback"');
    assert.strictEqual(getEnforcedAttribution(undefined), 'Client Feedback', 'undefined must return "Client Feedback"');
    assert.strictEqual(getEnforcedAttribution({}), 'Client Feedback', 'empty object must return "Client Feedback"');

    // Attempt to override Odonto Dental attribution with custom name
    const maliciousOdonto1 = {
      id: 'testimonial-odonto-dental',
      client: 'Odonto Dental',
      attribution: 'Dr. Jane Smith, Odonto Dental'
    };
    assert.strictEqual(
      getEnforcedAttribution(maliciousOdonto1),
      'Client Feedback',
      'Odonto Dental id must force attribution to "Client Feedback"'
    );

    const maliciousOdonto2 = {
      id: 'testimonial-1',
      client: 'Some Dental Group',
      attribution: 'Lead Dentist'
    };
    assert.strictEqual(
      getEnforcedAttribution(maliciousOdonto2),
      'Client Feedback',
      'testimonial-1 id must force attribution to "Client Feedback"'
    );

    const maliciousOdonto3 = {
      id: 'any-id',
      client: 'Odonto Dental Clinic',
      attribution: 'Clinic Manager'
    };
    assert.strictEqual(
      getEnforcedAttribution(maliciousOdonto3),
      'Client Feedback',
      'Client name containing Odonto must force attribution to "Client Feedback"'
    );
  });

  test('TEST-T5-LEAK-006: SuccessStoryBanner component enforces null render for unapproved banners in production view', () => {
    const bannerPath = path.join(SRC_DIR, 'components', 'SuccessStoryBanner.tsx');
    assert.ok(fs.existsSync(bannerPath), 'SuccessStoryBanner.tsx must exist');
    const bannerCode = fs.readFileSync(bannerPath, 'utf8');

    // 1. Source code invariant: must return null if not approved or not published when previewMode is false
    assert.ok(
      bannerCode.includes('if (!testimonial) return null;') || bannerCode.includes('if (!testimonial) return null'),
      'Component must return null if testimonial is null'
    );
    assert.ok(
      bannerCode.includes('!testimonial.isApproved') && bannerCode.includes('return null'),
      'Component must guard against !testimonial.isApproved and return null'
    );
    assert.ok(
      bannerCode.includes('testimonial.status !== "published"'),
      'Component must guard against status !== "published"'
    );

    // 2. Export verification: verify that no unapproved testimonial IDs exist in out/
    const allHtml = getAllFilesSync(OUT_DIR).filter(f => f.endsWith('.html'));
    for (const file of allHtml) {
      const html = fs.readFileSync(file, 'utf8');
      assert.strictEqual(
        html.includes('testimonial-tareen-dental'),
        false,
        `${path.relative(OUT_DIR, file)} must not contain unapproved testimonial id testimonial-tareen-dental`
      );
      assert.strictEqual(
        html.includes('testimonial-mypsychmd'),
        false,
        `${path.relative(OUT_DIR, file)} must not contain unapproved testimonial id testimonial-mypsychmd`
      );
      assert.strictEqual(
        html.includes('testimonial-fastsigns'),
        false,
        `${path.relative(OUT_DIR, file)} must not contain unapproved testimonial id testimonial-fastsigns`
      );
    }
  });

});

// ==============================================================================
// SUITE 2: Static Export & Canonical Routing Integrity
// ==============================================================================
describe('Tier 5 Suite 2: Static Export & Canonical Routing Integrity', () => {

  test('TEST-T5-ROUT-001: All 12 canonical routes exist in out/ with valid file size (>1KB)', () => {
    for (const route of CANONICAL_ROUTES) {
      assert.ok(
        fs.existsSync(route.file),
        `Route ${route.path} file does not exist at ${route.file}`
      );
      const stat = fs.statSync(route.file);
      assert.ok(
        stat.size > 1024,
        `Route ${route.path} export file is suspiciously small (${stat.size} bytes)`
      );
    }
  });

  test('TEST-T5-ROUT-002: Valid HTML doctype on all 12 canonical routes', () => {
    for (const route of CANONICAL_ROUTES) {
      const html = fs.readFileSync(route.file, 'utf8').trim();
      assert.ok(
        /^<!DOCTYPE\s+html/i.test(html),
        `Route ${route.path} must start with standard <!DOCTYPE html>`
      );
    }
  });

  test('TEST-T5-ROUT-003: Title tag on all 12 canonical routes contains "RepHero"', () => {
    for (const route of CANONICAL_ROUTES) {
      const html = fs.readFileSync(route.file, 'utf8');
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      assert.ok(
        titleMatch,
        `Route ${route.path} must contain a <title> tag`
      );
      const titleText = titleMatch[1].trim();
      assert.ok(
        titleText.includes('RepHero'),
        `Route ${route.path} title "${titleText}" must contain "RepHero"`
      );
      assert.ok(
        titleText.length >= 10 && titleText.length <= 100,
        `Route ${route.path} title "${titleText}" length must be between 10 and 100 chars`
      );
    }
  });

  test('TEST-T5-ROUT-004: Valid meta description on all 12 canonical routes', () => {
    for (const route of CANONICAL_ROUTES) {
      const html = fs.readFileSync(route.file, 'utf8');
      const desc = extractMeta(html, 'name', 'description');
      assert.ok(
        desc && desc.length >= 25,
        `Route ${route.path} must contain a meaningful meta description (got length ${desc ? desc.length : 0})`
      );
    }
  });

  test('TEST-T5-ROUT-005: 404.html preserves Header & Footer and has ZERO search inputs', () => {
    const errorPagePath = path.join(OUT_DIR, '404.html');
    assert.ok(fs.existsSync(errorPagePath), '404.html must exist');
    const html = fs.readFileSync(errorPagePath, 'utf8');

    // Landmark preservation
    assert.ok(html.includes('<header') && html.includes('</header>'), '404.html must preserve <header>');
    assert.ok(html.includes('<footer') && html.includes('</footer>'), '404.html must preserve <footer>');

    // ZERO search inputs rule (PRD / Sitemap requirement: 404 must not have search input)
    assert.strictEqual(
      html.includes('type="search"'),
      false,
      '404.html must NOT contain <input type="search">'
    );
    assert.strictEqual(
      html.includes("type='search'"),
      false,
      '404.html must NOT contain <input type=\'search\'>'
    );
    assert.strictEqual(
      /name=["']search["']/i.test(html),
      false,
      '404.html must NOT contain search input name'
    );

    // Recovery navigation links
    assert.ok(html.includes('href="/"'), '404.html must provide recovery link to Home');
    assert.ok(html.includes('href="/services"'), '404.html must provide recovery link to Services');
    assert.ok(html.includes('href="/book-a-call"'), '404.html must provide recovery link to Book a Call');
  });

  test('TEST-T5-ROUT-006: sitemap.xml lists all 11 public canonical routes with trailing slashes and excludes 404', () => {
    const sitemapPath = path.join(OUT_DIR, 'sitemap.xml');
    assert.ok(fs.existsSync(sitemapPath), 'out/sitemap.xml must exist');

    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    assert.ok(sitemapContent.includes('<urlset'), 'sitemap.xml must be valid urlset XML');

    const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(m => m[1].trim());
    assert.strictEqual(locMatches.length, 11, `sitemap.xml must list exactly 11 canonical routes, found ${locMatches.length}`);

    const expectedPaths = CANONICAL_ROUTES.filter(r => r.inSitemap).map(r => r.path);

    for (const p of expectedPaths) {
      const expectedUrl = `https://www.rephero.co${p === '/' ? '/' : p + '/'}`;
      assert.ok(
        locMatches.includes(expectedUrl),
        `sitemap.xml must list ${expectedUrl}`
      );
    }

    // Negative assertion: 404 / not-found must NOT be in sitemap
    for (const url of locMatches) {
      assert.strictEqual(
        url.includes('404') || url.includes('not-found'),
        false,
        `sitemap.xml must NOT list error page: ${url}`
      );
      assert.ok(
        url.endsWith('/'),
        `sitemap.xml URL "${url}" must have trailing slash`
      );
    }
  });

  test('TEST-T5-ROUT-007: robots.txt disallows /thank-you/ and references canonical sitemap.xml', () => {
    const robotsPath = path.join(OUT_DIR, 'robots.txt');
    assert.ok(fs.existsSync(robotsPath), 'out/robots.txt must exist');

    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    const lines = robotsContent.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    // Check User-agent
    assert.ok(lines.some(l => l.toLowerCase() === 'user-agent: *'), 'robots.txt must specify User-agent: *');

    // Check Disallow for thank-you
    assert.ok(
      lines.some(l => l.toLowerCase() === 'disallow: /thank-you/' || l.toLowerCase() === 'disallow: /thank-you'),
      'robots.txt must disallow /thank-you/ to protect conversion tracking'
    );

    // Check Sitemap directive
    assert.ok(
      lines.some(l => l.toLowerCase() === 'sitemap: https://www.rephero.co/sitemap.xml'),
      'robots.txt must reference https://www.rephero.co/sitemap.xml'
    );
  });

});

// ==============================================================================
// SUITE 3: SEO & Structured Data (JSON-LD) Adversarial Stress
// ==============================================================================
describe('Tier 5 Suite 3: SEO & Structured Data (JSON-LD) Adversarial Stress', () => {

  test('TEST-T5-JSONLD-001: Syntactic parsing and error-free evaluation of all JSON-LD scripts in out/', () => {
    const allHtmlFiles = getAllFilesSync(OUT_DIR).filter(f => f.endsWith('.html'));
    let totalParsedScripts = 0;

    for (const htmlFile of allHtmlFiles) {
      const html = fs.readFileSync(htmlFile, 'utf8');
      const blocks = extractJsonLdBlocks(html);

      for (const rawJson of blocks) {
        totalParsedScripts++;
        try {
          const parsed = JSON.parse(rawJson);
          assert.ok(parsed && typeof parsed === 'object', 'JSON-LD must parse to an object');
          assert.ok(parsed['@context'], 'JSON-LD must define @context');
          assert.ok(parsed['@type'], 'JSON-LD must define @type');
        } catch (err) {
          assert.fail(`Malformed JSON-LD syntax in ${path.relative(OUT_DIR, htmlFile)}: ${err.message}\nRaw JSON: ${rawJson}`);
        }
      }
    }

    assert.ok(totalParsedScripts >= 12, `Must find and parse at least 12 JSON-LD scripts across export (found ${totalParsedScripts})`);
  });

  test('TEST-T5-JSONLD-002: Organization schema validation on root layout export', () => {
    // Check root index.html
    const homeHtml = fs.readFileSync(path.join(OUT_DIR, 'index.html'), 'utf8');
    const blocks = extractJsonLdBlocks(homeHtml);

    const orgBlock = blocks.map(b => JSON.parse(b)).find(item => item['@type'] === 'Organization');
    assert.ok(orgBlock, 'Home page must embed an Organization schema');

    assert.strictEqual(orgBlock['@type'], 'Organization');
    assert.ok(orgBlock.name.includes('RepHero'), 'Organization name must contain RepHero');
    assert.strictEqual(orgBlock.url, 'https://www.rephero.co');
    assert.ok(orgBlock.logo, 'Organization schema must specify logo');
    assert.ok(orgBlock.contactPoint, 'Organization schema must specify contactPoint');
    assert.strictEqual(orgBlock.contactPoint['@type'], 'ContactPoint');
    assert.ok(orgBlock.address, 'Organization schema must specify address');
    assert.strictEqual(orgBlock.address['@type'], 'PostalAddress');
  });

  test('TEST-T5-JSONLD-003: FAQPage schema validation on Home (/) and Services (/services)', () => {
    const pagesWithFaq = [
      { path: '/', file: path.join(OUT_DIR, 'index.html') },
      { path: '/services', file: path.join(OUT_DIR, 'services', 'index.html') }
    ];

    for (const target of pagesWithFaq) {
      const html = fs.readFileSync(target.file, 'utf8');
      const blocks = extractJsonLdBlocks(html);
      const parsedItems = blocks.map(b => JSON.parse(b));

      const faqSchema = parsedItems.find(item => item['@type'] === 'FAQPage');
      assert.ok(
        faqSchema,
        `${target.path} must contain FAQPage schema`
      );

      assert.ok(
        Array.isArray(faqSchema.mainEntity),
        `${target.path} FAQPage mainEntity must be an array`
      );
      assert.ok(
        faqSchema.mainEntity.length >= 3,
        `${target.path} FAQPage must define at least 3 FAQ questions, found ${faqSchema.mainEntity.length}`
      );

      for (let i = 0; i < faqSchema.mainEntity.length; i++) {
        const item = faqSchema.mainEntity[i];
        assert.strictEqual(item['@type'], 'Question', `Item ${i} must be a Question`);
        assert.ok(item.name && item.name.length > 5, `Item ${i} Question name must be non-empty`);
        assert.ok(item.acceptedAnswer, `Item ${i} must have acceptedAnswer`);
        assert.strictEqual(item.acceptedAnswer['@type'], 'Answer', `Item ${i} acceptedAnswer must be of type Answer`);
        assert.ok(
          item.acceptedAnswer.text && item.acceptedAnswer.text.length > 10,
          `Item ${i} acceptedAnswer text must be non-empty`
        );
      }
    }
  });

  test('TEST-T5-JSONLD-004: Negative boundary validation: utility and legal pages do NOT contain orphaned FAQPage schemas', () => {
    const pagesWithoutFaq = [
      path.join(OUT_DIR, 'privacy', 'index.html'),
      path.join(OUT_DIR, 'terms', 'index.html'),
      path.join(OUT_DIR, 'thank-you', 'index.html'),
      path.join(OUT_DIR, '404.html')
    ];

    for (const filePath of pagesWithoutFaq) {
      if (!fs.existsSync(filePath)) continue;
      const html = fs.readFileSync(filePath, 'utf8');
      const blocks = extractJsonLdBlocks(html);
      const parsedItems = blocks.map(b => JSON.parse(b));

      const faqSchema = parsedItems.find(item => item['@type'] === 'FAQPage');
      assert.strictEqual(
        faqSchema,
        undefined,
        `${path.relative(OUT_DIR, filePath)} must NOT define an orphaned FAQPage schema`
      );
    }
  });

});

// ==============================================================================
// SUITE 4: Strict Placeholder Verification & CI/CD Gating
// ==============================================================================
describe('Tier 5 Suite 4: Strict Placeholder Verification & CI/CD Gating', () => {

  const checkerScript = path.join(ROOT_DIR, 'scripts', 'check-placeholders.mjs');

  test('TEST-T5-HOLD-001: check-placeholders.mjs executes successfully in dev mode with exit code 0', () => {
    assert.ok(fs.existsSync(checkerScript), 'scripts/check-placeholders.mjs must exist');

    const result = spawnSync(process.execPath, [checkerScript], {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      env: { ...process.env, STRICT_PLACEHOLDERS: '' }
    });

    assert.strictEqual(result.status, 0, 'Dev mode execution must exit with code 0');
    const combinedOutput = (result.stdout || '') + (result.stderr || '');
    assert.ok(
      combinedOutput.includes('RepHero Placeholder & Asset Verification'),
      'Script must output header banner'
    );
    assert.ok(
      combinedOutput.includes('unresolved placeholder items detected'),
      'Script must warn of unresolved items'
    );
    assert.ok(
      combinedOutput.includes('Build check passed with non-blocking warnings'),
      'Script must indicate non-blocking dev mode passage'
    );
  });

  test('TEST-T5-HOLD-002: check-placeholders.mjs --strict halts with exit code 1 while unresolved placeholders exist', () => {
    assert.ok(fs.existsSync(checkerScript), 'scripts/check-placeholders.mjs must exist');

    const result = spawnSync(process.execPath, [checkerScript, '--strict'], {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      env: { ...process.env, STRICT_PLACEHOLDERS: '' }
    });

    assert.strictEqual(
      result.status,
      1,
      'Strict mode (--strict) MUST exit with code 1 while unresolved placeholders exist'
    );
    const combinedOutput = (result.stdout || '') + (result.stderr || '');
    assert.ok(
      combinedOutput.includes('FAILED') && combinedOutput.includes('Strict mode enabled'),
      'Script output must explicitly state failure due to strict mode'
    );
  });

  test('TEST-T5-HOLD-003: STRICT_PLACEHOLDERS=true environment variable enforces CI/CD gate with exit code 1', () => {
    assert.ok(fs.existsSync(checkerScript), 'scripts/check-placeholders.mjs must exist');

    const result = spawnSync(process.execPath, [checkerScript], {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      env: { ...process.env, STRICT_PLACEHOLDERS: 'true' }
    });

    assert.strictEqual(
      result.status,
      1,
      'Environment variable STRICT_PLACEHOLDERS=true MUST exit with code 1'
    );
    const combinedOutput = (result.stdout || '') + (result.stderr || '');
    assert.ok(
      combinedOutput.includes('FAILED'),
      'Script must log failure message when STRICT_PLACEHOLDERS=true'
    );
  });

  test('TEST-T5-HOLD-004: PLACEHOLDERS.md catalogs all mandatory unsupplied assets and pending items', () => {
    const mdPath = path.join(ROOT_DIR, 'PLACEHOLDERS.md');
    assert.ok(fs.existsSync(mdPath), 'PLACEHOLDERS.md must exist at project root');

    const mdContent = fs.readFileSync(mdPath, 'utf8');
    const lines = mdContent.split('\n');

    // Filter table rows tracking items
    const tableRows = lines.filter(l => l.includes('|') && !l.includes('---') && !l.includes('Asset / Item'));
    assert.ok(tableRows.length >= 10, `PLACEHOLDERS.md must track at least 10 items (found ${tableRows.length})`);

    // Must document unapproved client logos and testimonials
    assert.ok(mdContent.includes('Odonto Dental'), 'Must document Odonto Dental logo/permission');
    assert.ok(mdContent.includes('Tareen Dental'), 'Must document Tareen Dental logo/testimonial');
    assert.ok(mdContent.includes('MyPsychMD'), 'Must document MyPsychMD logo/testimonial');
    assert.ok(mdContent.includes('FASTSIGNS'), 'Must document FASTSIGNS logo/testimonial');

    // Launch rule notice must be present
    assert.ok(
      mdContent.includes('Launch Verification Rules') || mdContent.includes('LAUNCH RULE') || mdContent.includes('Launch rule'),
      'PLACEHOLDERS.md must state the public launch verification rules'
    );
  });

});
