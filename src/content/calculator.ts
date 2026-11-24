import type { CalculatorConfig, SavingsCalculation } from './types';

export const CALCULATOR_CONFIG: CalculatorConfig = {
  defaultRole: "admin-front-desk",
  defaultTeamMembers: 2,
  minTeamMembers: 1,
  maxTeamMembers: 20,
  defaultCurrentCost: 3500,
  minCurrentCost: 1000,
  maxCurrentCost: 15000,
  costStep: 250,
  minSavingsRate: 0.50,
  maxSavingsRate: 0.60,
  disclaimer: "Estimates only, based on typical savings. Actual results vary and are not guaranteed.",
  customQuoteDisclaimer: "Roles priced with a custom quote use the standard 50-60% typical savings range.",
};

export function calculateSavings(
  teamMembers: number,
  currentMonthlyCost: number,
  publishedMonthlyPrice?: number
): SavingsCalculation {
  const n = Number(teamMembers) || 0;
  const c = Number(currentMonthlyCost) || 0;

  // Boundary check: non-positive or NaN values yield 0 savings
  if (n <= 0 || c <= 0) {
    return {
      monthlyMin: 0,
      monthlyMax: 0,
      annualMin: 0,
      annualMax: 0,
      publishedDiff: undefined,
      isCustomQuote: publishedMonthlyPrice === undefined || publishedMonthlyPrice === null,
    };
  }

  const monthlyMin = Math.round(n * c * CALCULATOR_CONFIG.minSavingsRate);
  const monthlyMax = Math.round(n * c * CALCULATOR_CONFIG.maxSavingsRate);
  const annualMin = monthlyMin * 12;
  const annualMax = monthlyMax * 12;

  const isCustomQuote = publishedMonthlyPrice === undefined || publishedMonthlyPrice === null;
  const publishedDiff = (publishedMonthlyPrice !== undefined && publishedMonthlyPrice !== null && !isNaN(publishedMonthlyPrice))
    ? Math.round(n * (c - publishedMonthlyPrice))
    : undefined;

  return {
    monthlyMin,
    monthlyMax,
    annualMin,
    annualMax,
    publishedDiff,
    isCustomQuote,
  };
}

export function formatCurrency(amount: number): string {
  return '$' + Math.round(amount).toLocaleString('en-US');
}

export function formatMonthlyRange(min: number, max: number): string {
  return `${formatCurrency(min)} – ${formatCurrency(max)}/mo`;
}

export function formatAnnualRange(min: number, max: number): string {
  return `${formatCurrency(min)} – ${formatCurrency(max)}/yr`;
}

export function buildCalculatorForwardUrl(
  roleId: string,
  teamMembers: number,
  currentCost: number
): string {
  const params = new URLSearchParams();
  if (roleId) params.set('role', roleId);
  if (teamMembers) params.set('teamMembers', String(teamMembers));
  if (currentCost) params.set('currentCost', String(currentCost));
  return `/book-a-call?${params.toString()}`;
}
