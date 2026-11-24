/**
 * Math Verifier Helper for RepHero Savings Calculator Formulas & Benchmark Cases
 * 
 * Sources:
 * - ORIGINAL_REQUEST.md line 54
 * - RepHero Essentials §2 (lines 46-70)
 * - PROJECT.md lines 129-136
 */

import { CALCULATOR } from '../config.mjs';

export class MathVerifier {
  /**
   * Pure savings calculation formula:
   * Monthly savings: teamMembers * currentMonthlyCost * 0.50 to teamMembers * currentMonthlyCost * 0.60
   * Annual savings: monthly * 12
   * Published list price comparison: teamMembers * (currentMonthlyCost - publishedPrice)
   * 
   * @param {number} teamMembers 
   * @param {number} currentMonthlyCost 
   * @param {number} [publishedPrice] 
   * @returns {{ monthlyMin: number, monthlyMax: number, annualMin: number, annualMax: number, publishedDiff?: number }}
   */
  static calculateSavings(teamMembers, currentMonthlyCost, publishedPrice) {
    const n = Number(teamMembers) || 0;
    const c = Number(currentMonthlyCost) || 0;

    if (n <= 0 || c <= 0) {
      return {
        monthlyMin: 0,
        monthlyMax: 0,
        annualMin: 0,
        annualMax: 0,
        publishedDiff: undefined
      };
    }

    const monthlyMin = Math.round(n * c * CALCULATOR.minPercentage);
    const monthlyMax = Math.round(n * c * CALCULATOR.maxPercentage);
    const annualMin = monthlyMin * 12;
    const annualMax = monthlyMax * 12;

    let publishedDiff = undefined;
    if (typeof publishedPrice === 'number' && !isNaN(publishedPrice)) {
      const diff = n * (c - publishedPrice);
      // Clamp negative diff to 0 or leave as calculated
      publishedDiff = diff;
    }

    return {
      monthlyMin,
      monthlyMax,
      annualMin,
      annualMax,
      publishedDiff
    };
  }

  /**
   * Format number as currency string with commas (e.g. 3500 -> "$3,500")
   * @param {number} amount 
   * @returns {string}
   */
  static formatCurrency(amount) {
    return '$' + Math.round(amount).toLocaleString('en-US');
  }

  /**
   * Format monthly savings range string
   * @param {number} min 
   * @param {number} max 
   * @returns {string}
   */
  static formatMonthlyRange(min, max) {
    return `${this.formatCurrency(min)} – ${this.formatCurrency(max)}/mo`;
  }

  /**
   * Format annual savings range string
   * @param {number} min 
   * @param {number} max 
   * @returns {string}
   */
  static formatAnnualRange(min, max) {
    return `${this.formatCurrency(min)} – ${this.formatCurrency(max)}/yr`;
  }

  /**
   * Run the authoritative benchmark test case:
   * n = 2 team members, C = $3,500 / month
   * Expected: $3,500 - $4,200 / month, $42,000 - $50,400 / year
   * @returns {{ passes: boolean, result: object, expected: object }}
   */
  static verifyBenchmark() {
    const { teamMembers, currentMonthlyCost, expectedMonthlyMin, expectedMonthlyMax, expectedAnnualMin, expectedAnnualMax } = CALCULATOR.benchmark;
    const result = this.calculateSavings(teamMembers, currentMonthlyCost);

    const passes = 
      result.monthlyMin === expectedMonthlyMin &&
      result.monthlyMax === expectedMonthlyMax &&
      result.annualMin === expectedAnnualMin &&
      result.annualMax === expectedAnnualMax;

    return {
      passes,
      result,
      expected: {
        monthlyMin: expectedMonthlyMin,
        monthlyMax: expectedMonthlyMax,
        annualMin: expectedAnnualMin,
        annualMax: expectedAnnualMax
      }
    };
  }

  /**
   * Verify published price difference for benchmark
   * Role: Admin / Front Desk ($1,499)
   * n = 2, C = $3,500
   * Expected: 2 * (3500 - 1499) = $4,002
   * @returns {{ passes: boolean, publishedDiff: number, expected: number }}
   */
  static verifyPublishedBenchmark() {
    const { teamMembers, currentMonthlyCost, publishedPrice, expectedDifference } = CALCULATOR.publishedBenchmark;
    const result = this.calculateSavings(teamMembers, currentMonthlyCost, publishedPrice);

    return {
      passes: result.publishedDiff === expectedDifference,
      publishedDiff: result.publishedDiff,
      expected: expectedDifference
    };
  }
}
