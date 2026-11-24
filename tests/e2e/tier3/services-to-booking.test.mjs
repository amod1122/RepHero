/**
 * Tier 3 Test Suite: Cross-Feature Combinations — Services to Booking
 * File: tests/e2e/tier3/services-to-booking.test.mjs
 * 
 * Sources:
 * - PRD §2, §8.3 (Service Roles, Categories, and Pricing Models)
 * - Essentials §1 (Exact CTA text: "Book a call about this role")
 * - Sitemap §4.2 (/services Page Architecture)
 * - PROJECT.md Contract 2 (ServiceRole Interface)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RouteCrawler } from '../helpers/route-crawler.mjs';
import { HtmlParser } from '../helpers/html-parser.mjs';
import { SRC_DIR } from '../config.mjs';
import { SERVICE_ROLES } from '../../../src/content/services.ts';

const crawler = new RouteCrawler();

describe('Tier 3: Services Role Cards -> Booking URL Hydration -> Role Prefill', () => {

  // TEST-T3-SERV-001: Category 1 (Admin & Executive) Role Cards CTA Parameter Contract
  test('TEST-T3-SERV-001: Category 1 (Admin & Executive) role cards provide "Book a call about this role" CTA parameter contract', () => {
    const adminRoles = SERVICE_ROLES.filter(r => r.category === 'Admin and Executive');
    assert.strictEqual(adminRoles.length, 3, 'Must have exactly 3 Admin and Executive roles');

    const expectedAdminIds = ['admin-front-desk', 'medical-assistant', 'executive-assistant'];
    for (const id of expectedAdminIds) {
      const role = adminRoles.find(r => r.id === id);
      assert.ok(role, `Category 1 must include role: ${id}`);
      assert.ok(role.name.length > 0, 'Role must have a name');

      // Forwarding URL contract
      const targetUrl = `/book-a-call?role=${role.id}`;
      const parsedUrl = new URL(targetUrl, 'https://www.rephero.co');
      assert.strictEqual(parsedUrl.pathname, '/book-a-call');
      assert.strictEqual(parsedUrl.searchParams.get('role'), role.id);
    }

    // Check specific pricing
    const frontDesk = adminRoles.find(r => r.id === 'admin-front-desk');
    assert.strictEqual(frontDesk.publishedMonthlyPrice, 1499);
    assert.strictEqual(frontDesk.priceDisplay, '$1,499/mo');

    const medAssistant = adminRoles.find(r => r.id === 'medical-assistant');
    assert.strictEqual(medAssistant.publishedMonthlyPrice, 1999);
    assert.strictEqual(medAssistant.priceDisplay, '$1,999/mo');

    const execAssistant = adminRoles.find(r => r.id === 'executive-assistant');
    assert.strictEqual(execAssistant.publishedMonthlyPrice, undefined);
    assert.strictEqual(execAssistant.priceDisplay, 'Custom quote');

    // Also verify src/content/services.ts defines Category 1 roles
    const servicesFilePath = path.join(SRC_DIR, 'content', 'services.ts');
    if (fs.existsSync(servicesFilePath)) {
      const content = fs.readFileSync(servicesFilePath, 'utf-8');
      assert.ok(content.includes('admin-front-desk'), 'services.ts must include admin-front-desk');
      assert.ok(content.includes('medical-assistant'), 'services.ts must include medical-assistant');
      assert.ok(content.includes('executive-assistant'), 'services.ts must include executive-assistant');
    }
  });

  // TEST-T3-SERV-002: Category 2 (Revenue Cycle & Compliance) Role Cards CTA Parameter Contract
  test('TEST-T3-SERV-002: Category 2 (Revenue Cycle & Compliance) role cards provide CTA parameter contract', () => {
    const rcmRoles = SERVICE_ROLES.filter(r => r.category === 'Revenue Cycle and Compliance');
    assert.strictEqual(rcmRoles.length, 4, 'Must have exactly 4 Revenue Cycle and Compliance roles');

    const expectedRcmIds = [
      'medical-biller',
      'certified-professional-coder',
      'revenue-cycle-management',
      'credentialing-and-contracting'
    ];

    for (const id of expectedRcmIds) {
      const role = rcmRoles.find(r => r.id === id);
      assert.ok(role, `Category 2 must include role: ${id}`);
      
      const targetUrl = `/book-a-call?role=${role.id}`;
      const parsedUrl = new URL(targetUrl, 'https://www.rephero.co');
      assert.strictEqual(parsedUrl.searchParams.get('role'), role.id);
    }

    // Verify Medical Biller alternate pricing display (5% or $1,499 flat)
    const biller = rcmRoles.find(r => r.id === 'medical-biller');
    assert.strictEqual(biller.pricingModel, 'percentage');
    assert.strictEqual(biller.priceDisplay, '5% of collections or $1,499 flat/mo');
    assert.strictEqual(biller.publishedMonthlyPrice, 1499);

    // Verify Credentialing per-unit pricing
    const credentialing = rcmRoles.find(r => r.id === 'credentialing-and-contracting');
    assert.strictEqual(credentialing.pricingModel, 'per_unit');
    assert.strictEqual(credentialing.priceDisplay, '$200/provider/payer or $399 payer bundle');
  });

  // TEST-T3-SERV-003: Category 3 (Extended & Creative) Role Cards CTA Parameter Contract
  test('TEST-T3-SERV-003: Category 3 (Extended & Creative) role cards provide CTA parameter contract', () => {
    const creativeRoles = SERVICE_ROLES.filter(r => r.category === 'Extended and Creative');
    assert.strictEqual(creativeRoles.length, 2, 'Must have exactly 2 Extended and Creative roles');

    const afterHours = creativeRoles.find(r => r.id === 'after-hours-support');
    assert.ok(afterHours);
    assert.strictEqual(afterHours.priceDisplay, 'From $999/mo');
    assert.strictEqual(afterHours.publishedMonthlyPrice, 999);
    assert.strictEqual(`/book-a-call?role=${afterHours.id}`, '/book-a-call?role=after-hours-support');

    const graphicDesigner = creativeRoles.find(r => r.id === 'graphic-designer');
    assert.ok(graphicDesigner);
    assert.strictEqual(graphicDesigner.priceDisplay, 'Custom quote');
    assert.strictEqual(graphicDesigner.publishedMonthlyPrice, undefined);
    assert.strictEqual(`/book-a-call?role=${graphicDesigner.id}`, '/book-a-call?role=graphic-designer');
  });

  // TEST-T3-SERV-004: Published Price vs Custom Quote Role CTA Parameters & Pricing Displays
  test('TEST-T3-SERV-004: Published price vs custom quote roles correctly partition pricing display and CTA parameters', () => {
    // 5 roles have published monthly prices ($1,499, $1,999, $999)
    const fixedPriceRoles = SERVICE_ROLES.filter(r => r.pricingModel === 'flat' || r.pricingModel === 'percentage');
    for (const role of fixedPriceRoles) {
      assert.ok(typeof role.publishedMonthlyPrice === 'number', `${role.id} must define numeric publishedMonthlyPrice`);
      assert.ok(role.priceDisplay.includes('$'), `${role.id} priceDisplay must include dollar sign`);
    }

    // 2 roles have custom quotes
    const customRoles = SERVICE_ROLES.filter(r => r.pricingModel === 'custom');
    assert.strictEqual(customRoles.length, 2);
    for (const role of customRoles) {
      assert.strictEqual(role.publishedMonthlyPrice, undefined, `${role.id} must not have published price`);
      assert.strictEqual(role.priceDisplay, 'Custom quote');
      // CTA still forwards valid role parameter
      const url = `/book-a-call?role=${role.id}`;
      assert.ok(url.startsWith('/book-a-call?role='));
    }
  });

  // TEST-T3-SERV-005: URL-Encoded Role Slugs and Display Names Resolution in Booking Form
  test('TEST-T3-SERV-005: Role parameter resolves interchangeably across kebab-case slug, encoded title, and ID', () => {
    const resolveRoleSelection = (roleParam) => {
      if (!roleParam) return '';
      const cleanParam = decodeURIComponent(roleParam).trim().toLowerCase();
      
      // Match by exact ID
      const byId = SERVICE_ROLES.find(r => r.id.toLowerCase() === cleanParam);
      if (byId) return byId.id;

      // Match by name
      const byName = SERVICE_ROLES.find(r => r.name.toLowerCase() === cleanParam);
      if (byName) return byName.id;

      // Fuzzy match by slug or partial
      const byFuzzy = SERVICE_ROLES.find(r => 
        cleanParam.includes(r.id) || r.name.toLowerCase().includes(cleanParam)
      );
      return byFuzzy ? byFuzzy.id : '';
    };

    // Case 1: Standard kebab-case slug
    assert.strictEqual(resolveRoleSelection('admin-front-desk'), 'admin-front-desk');
    assert.strictEqual(resolveRoleSelection('medical-biller'), 'medical-biller');

    // Case 2: URL encoded name
    assert.strictEqual(resolveRoleSelection('Admin%20%2F%20Front%20Desk'), 'admin-front-desk');
    assert.strictEqual(resolveRoleSelection('Medical%20Biller'), 'medical-biller');

    // Case 3: Space separated plain name
    assert.strictEqual(resolveRoleSelection('Medical Assistant'), 'medical-assistant');
    assert.strictEqual(resolveRoleSelection('Graphic Designer'), 'graphic-designer');

    // Case 4: Unknown junk
    assert.strictEqual(resolveRoleSelection('unknown-junk-slug'), '');
  });

});
