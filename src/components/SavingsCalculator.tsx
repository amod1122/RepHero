"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import {
  CALCULATOR_CONFIG,
  calculateSavings,
  formatCurrency,
  buildCalculatorForwardUrl,
  SERVICE_ROLES,
  CTA_LABELS,
} from "@/content";

export interface SavingsCalculatorProps {
  initialRole?: string;
  initialTeamMembers?: number;
  initialCurrentCost?: number;
  className?: string;
  showTitle?: boolean;
}

export function SavingsCalculator({
  initialRole,
  initialTeamMembers,
  initialCurrentCost,
  className = "",
  showTitle = true,
}: SavingsCalculatorProps) {
  const roleSelectId = useId();
  const membersInputId = useId();
  const costInputId = useId();

  const [selectedRoleId, setSelectedRoleId] = useState<string>(() => {
    if (initialRole && SERVICE_ROLES.some((r) => r.id === initialRole)) {
      return initialRole;
    }
    return CALCULATOR_CONFIG.defaultRole;
  });

  const [teamMembers, setTeamMembers] = useState<number>(() => {
    const val = initialTeamMembers ?? CALCULATOR_CONFIG.defaultTeamMembers;
    return Math.max(
      CALCULATOR_CONFIG.minTeamMembers,
      Math.min(CALCULATOR_CONFIG.maxTeamMembers, val)
    );
  });

  const [currentCost, setCurrentCost] = useState<number>(() => {
    const val = initialCurrentCost ?? CALCULATOR_CONFIG.defaultCurrentCost;
    return Math.max(
      CALCULATOR_CONFIG.minCurrentCost,
      Math.min(CALCULATOR_CONFIG.maxCurrentCost, val)
    );
  });

  const selectedRole = SERVICE_ROLES.find((r) => r.id === selectedRoleId);
  const calculation = calculateSavings(
    teamMembers,
    currentCost,
    selectedRole?.publishedMonthlyPrice
  );

  const forwardUrl = buildCalculatorForwardUrl(
    selectedRoleId,
    teamMembers,
    currentCost
  );

  const handleMemberChange = (newVal: number) => {
    const clamped = Math.max(
      CALCULATOR_CONFIG.minTeamMembers,
      Math.min(CALCULATOR_CONFIG.maxTeamMembers, newVal)
    );
    setTeamMembers(clamped);
  };

  const handleCostChange = (newVal: number) => {
    const clamped = Math.max(
      CALCULATOR_CONFIG.minCurrentCost,
      Math.min(CALCULATOR_CONFIG.maxCurrentCost, newVal)
    );
    setCurrentCost(clamped);
  };

  return (
    <div
      className={`border border-line rounded-[2px] bg-white p-6 sm:p-8 md:p-10 shadow-sm max-w-[640px] mx-auto ${className}`}
    >
      {showTitle && (
        <div className="border-b border-line pb-6 mb-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-wider text-slate font-medium block mb-1">
            Cost Reduction Calculator
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
            Calculate Your Practice Savings
          </h2>
          <p className="text-xs sm:text-sm text-slate mt-1">
            Adjust the sliders below to see your projected monthly and annual savings.
          </p>
        </div>
      )}

      <div className="space-y-6 mb-8">
        {/* Role Selection Dropdown */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor={roleSelectId}
              className="text-xs uppercase tracking-wider text-slate font-medium block"
            >
              Role of Interest
            </label>
            {selectedRole && (
              <span className="text-xs text-navy font-medium">
                {selectedRole.category}
              </span>
            )}
          </div>
          <select
            id={roleSelectId}
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="w-full px-4 py-3 border border-line rounded-[2px] text-charcoal text-sm focus:outline-navy bg-white transition-colors cursor-pointer"
          >
            {SERVICE_ROLES.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name} ({role.priceDisplay})
              </option>
            ))}
          </select>
        </div>

        {/* Team Members Stepper & Slider */}
        <div className="p-4 sm:p-5 bg-mist/60 border border-line rounded-[2px]">
          <div className="flex justify-between items-center mb-3">
            <label
              htmlFor={membersInputId}
              className="text-xs uppercase tracking-wider text-slate font-medium"
            >
              Number of Team Members
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleMemberChange(teamMembers - 1)}
                disabled={teamMembers <= CALCULATOR_CONFIG.minTeamMembers}
                aria-label="Decrease team members"
                className="w-8 h-8 rounded-[2px] border border-line bg-white text-charcoal font-bold hover:bg-mist disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                –
              </button>
              <input
                id={membersInputId}
                type="number"
                min={CALCULATOR_CONFIG.minTeamMembers}
                max={CALCULATOR_CONFIG.maxTeamMembers}
                value={teamMembers}
                onChange={(e) => handleMemberChange(parseInt(e.target.value, 10) || 1)}
                data-testid="team-members-input"
                className="w-14 text-center font-serif text-lg py-1 border border-line rounded-[2px] text-charcoal bg-white focus:outline-navy"
              />
              <button
                type="button"
                onClick={() => handleMemberChange(teamMembers + 1)}
                disabled={teamMembers >= CALCULATOR_CONFIG.maxTeamMembers}
                aria-label="Increase team members"
                className="w-8 h-8 rounded-[2px] border border-line bg-white text-charcoal font-bold hover:bg-mist disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>
          <input
            type="range"
            min={CALCULATOR_CONFIG.minTeamMembers}
            max={CALCULATOR_CONFIG.maxTeamMembers}
            step={1}
            value={teamMembers}
            onChange={(e) => handleMemberChange(parseInt(e.target.value, 10))}
            data-testid="team-members-slider"
            aria-label="Team members count slider"
            className="w-full h-2 bg-line rounded-lg appearance-none cursor-pointer accent-navy"
          />
          <div className="flex justify-between text-[11px] text-slate/70 mt-1">
            <span>{CALCULATOR_CONFIG.minTeamMembers} member</span>
            <span>{CALCULATOR_CONFIG.maxTeamMembers} members</span>
          </div>
        </div>

        {/* Current Monthly Cost Slider & Input */}
        <div className="p-4 sm:p-5 bg-mist/60 border border-line rounded-[2px]">
          <div className="flex justify-between items-center mb-3">
            <div>
              <label
                htmlFor={costInputId}
                className="text-xs uppercase tracking-wider text-slate font-medium block"
              >
                Current Monthly Cost Per Member
              </label>
              <span className="text-[11px] text-slate/70">
                (Salary, payroll taxes, benefits, & overhead)
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-slate font-serif text-lg mr-1">$</span>
              <input
                id={costInputId}
                type="number"
                min={CALCULATOR_CONFIG.minCurrentCost}
                max={CALCULATOR_CONFIG.maxCurrentCost}
                step={CALCULATOR_CONFIG.costStep}
                value={currentCost}
                onChange={(e) => handleCostChange(parseInt(e.target.value, 10) || 1000)}
                data-testid="current-cost-input"
                className="w-24 text-right font-serif text-lg py-1 px-2 border border-line rounded-[2px] text-charcoal bg-white focus:outline-navy"
              />
            </div>
          </div>
          <input
            type="range"
            min={CALCULATOR_CONFIG.minCurrentCost}
            max={CALCULATOR_CONFIG.maxCurrentCost}
            step={CALCULATOR_CONFIG.costStep}
            value={currentCost}
            onChange={(e) => handleCostChange(parseInt(e.target.value, 10))}
            data-testid="current-cost-slider"
            aria-label="Current monthly cost slider"
            className="w-full h-2 bg-line rounded-lg appearance-none cursor-pointer accent-navy"
          />
          <div className="flex justify-between text-[11px] text-slate/70 mt-1">
            <span>{formatCurrency(CALCULATOR_CONFIG.minCurrentCost)}</span>
            <span>{formatCurrency(CALCULATOR_CONFIG.maxCurrentCost)}</span>
          </div>
        </div>
      </div>

      {/* Live Savings Results Box */}
      <div
        role="region"
        aria-label="Calculated savings"
        aria-live="polite"
        aria-atomic="true"
        className="border border-line rounded-[2px] bg-mist p-6 sm:p-7 mb-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center sm:text-left">
          <div className="border-b sm:border-b-0 sm:border-r border-line pb-4 sm:pb-0 sm:pr-4">
            <span className="text-xs uppercase tracking-wider text-slate font-medium block mb-1">
              Estimated Monthly Savings
            </span>
            <span
              data-testid="monthly-savings-result"
              className="font-serif text-2xl sm:text-3xl text-charcoal font-normal block"
            >
              {formatCurrency(calculation.monthlyMin)} – {formatCurrency(calculation.monthlyMax)}/mo
            </span>
            <span className="text-xs text-slate mt-1 block">
              50% to 60% typical overhead reduction
            </span>
          </div>

          <div className="sm:pl-4">
            <span className="text-xs uppercase tracking-wider text-slate font-medium block mb-1">
              Estimated Annual Savings
            </span>
            <span
              data-testid="annual-savings-result"
              className="font-serif text-2xl sm:text-3xl text-charcoal font-normal block"
            >
              {formatCurrency(calculation.annualMin)} – {formatCurrency(calculation.annualMax)}/yr
            </span>
            <span className="text-xs text-slate mt-1 block">
              Projected annual overhead reduction
            </span>
          </div>
        </div>

        {/* Optional Comparison Note */}
        {calculation.publishedDiff !== undefined && calculation.publishedDiff > 0 && (
          <div className="mt-5 pt-4 border-t border-line text-xs text-charcoal text-center sm:text-left flex items-center justify-center sm:justify-start">
            <span className="inline-block w-2 h-2 rounded-full bg-navy mr-2"></span>
            <span>
              Save <strong>{formatCurrency(calculation.publishedDiff)}/mo</strong> vs RepHero listed rate for {selectedRole?.name}.
            </span>
          </div>
        )}

        {/* Custom Quote Note */}
        {calculation.isCustomQuote && (
          <div className="mt-5 pt-4 border-t border-line text-xs text-slate text-center sm:text-left italic">
            {CALCULATOR_CONFIG.customQuoteDisclaimer}
          </div>
        )}
      </div>

      {/* Forwarding CTA Button: Links to /book-a-call ("Get a custom plan") */}
      <Link
        href={forwardUrl}
        data-testid="calculator-cta-button"
        className="w-full inline-flex items-center justify-center font-medium text-base px-6 py-4 rounded-[2px] bg-charcoal text-white hover:bg-ink transition-colors shadow-sm text-center"
      >
        {CTA_LABELS.calculator}
      </Link>

      {/* Mandatory Disclaimer */}
      <p className="text-xs text-slate/80 text-center italic mt-4 leading-relaxed">
        {CALCULATOR_CONFIG.disclaimer}
      </p>
    </div>
  );
}
