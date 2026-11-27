"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ArrowRight, Check, ChevronDown, Minus, Plus } from "lucide-react";
import {
  CALCULATOR_CONFIG,
  calculateSavings,
  formatCurrency,
  buildCalculatorForwardUrl,
  SERVICE_ROLES,
  CTA_LABELS,
} from "@/content";
import type { ServiceRole } from "@/content";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export interface SavingsCalculatorProps {
  initialRole?: string;
  initialTeamMembers?: number;
  initialCurrentCost?: number;
  className?: string;
  showTitle?: boolean;
}

const INTERACTION_EASE = [0.2, 0, 0, 1] as const;
const DROPDOWN_EASE = [0.22, 1, 0.36, 1] as const;

function RoleDropdown({
  id,
  selectedRoleId,
  onChange,
}: {
  id: string;
  selectedRoleId: string;
  onChange: (roleId: string) => void;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    SERVICE_ROLES.findIndex((role) => role.id === selectedRoleId),
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const selectedRole =
    SERVICE_ROLES.find((role) => role.id === selectedRoleId) ?? SERVICE_ROLES[0];
  const menuId = `${id}-menu`;

  const focusOption = (index: number) => {
    window.requestAnimationFrame(() => optionRefs.current[index]?.focus());
  };

  const openMenu = (index = selectedIndex) => {
    setActiveIndex(index);
    setIsOpen(true);
    focusOption(index);
  };

  const closeMenu = (restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  const selectRole = (roleId: string) => {
    onChange(roleId);
    closeMenu(true);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: Event) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu(isOpen ? (activeIndex + 1) % SERVICE_ROLES.length : selectedIndex);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(
        isOpen
          ? (activeIndex - 1 + SERVICE_ROLES.length) % SERVICE_ROLES.length
          : selectedIndex,
      );
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) {
        selectRole(SERVICE_ROLES[activeIndex].id);
      } else {
        openMenu();
      }
      return;
    }
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeMenu(true);
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = (activeIndex + 1) % SERVICE_ROLES.length;
      setActiveIndex(nextIndex);
      focusOption(nextIndex);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex =
        (activeIndex - 1 + SERVICE_ROLES.length) % SERVICE_ROLES.length;
      setActiveIndex(nextIndex);
      focusOption(nextIndex);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      focusOption(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      const lastIndex = SERVICE_ROLES.length - 1;
      setActiveIndex(lastIndex);
      focusOption(lastIndex);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectRole(SERVICE_ROLES[activeIndex].id);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
      return;
    }
    if (event.key === "Tab") closeMenu();
  };

  return (
    <div className="savings-calculator__role" ref={rootRef}>
      <span className="savings-calculator__label" id={`${id}-label`}>
        Role of interest
      </span>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-labelledby={`${id}-label ${id}-value`}
        className="savings-calculator__role-trigger"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="savings-calculator__role-copy">
          <span id={`${id}-value`}>{selectedRole.name}</span>
          <small>{selectedRole.priceDisplay}</small>
        </span>
        <motion.span
          className="savings-calculator__role-chevron"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: INTERACTION_EASE }}
          aria-hidden="true"
        >
          <ChevronDown size={18} strokeWidth={1.8} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id={menuId}
            className="savings-calculator__role-menu"
            role="presentation"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.985 }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.28,
              ease: DROPDOWN_EASE,
            }}
            onKeyDown={handleMenuKeyDown}
          >
            <ul role="listbox" aria-labelledby={`${id}-label`}>
              {SERVICE_ROLES.map((role, index) => {
                const isSelected = role.id === selectedRoleId;
                const isActive = index === activeIndex;
                return (
                  <li key={role.id} role="presentation">
                    <button
                      ref={(node) => {
                        optionRefs.current[index] = node;
                      }}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={-1}
                      className="savings-calculator__role-option"
                      data-active={isActive || undefined}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => selectRole(role.id)}
                    >
                      <span>
                        <strong>{role.name}</strong>
                        <small>{role.priceDisplay}</small>
                      </span>
                      {isSelected ? (
                        <motion.span
                          className="savings-calculator__role-check"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: reduceMotion ? 0.01 : 0.18,
                            ease: INTERACTION_EASE,
                          }}
                          aria-hidden="true"
                        >
                          <Check size={16} strokeWidth={2.2} />
                        </motion.span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function EditableNumber({
  id,
  value,
  min,
  max,
  onChange,
  format,
  className = "",
  testId,
  ariaLabel,
}: {
  id: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
  className?: string;
  testId?: string;
  ariaLabel: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const controlRef = useRef<HTMLDivElement>(null);
  const isEditingRef = useRef(false);
  const previousValueRef = useRef(value);
  const [draft, setDraft] = useState(() => format(value));
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    if (value === previousValueRef.current) return;
    previousValueRef.current = value;
    if (!isEditingRef.current) setDraft(format(value));
    if (!reduceMotion && controlRef.current) {
      animate(
        controlRef.current,
        { y: [5, 0], opacity: [0.68, 1] },
        { duration: 0.16, ease: INTERACTION_EASE },
      );
    }
  }, [format, reduceMotion, value]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const rawValue = event.target.value.replace(/[^0-9.]/g, "");
    setDraft(rawValue);
    const parsedValue = Number(rawValue);
    const isValid =
      rawValue !== "" &&
      Number.isFinite(parsedValue) &&
      parsedValue >= min &&
      parsedValue <= max;
    setIsInvalid(!isValid);
    if (isValid) onChange(Math.round(parsedValue));
  };

  const handleBlur = () => {
    isEditingRef.current = false;
    const parsedValue = Number(draft.replace(/[^0-9.]/g, ""));
    const nextValue = Number.isFinite(parsedValue)
      ? Math.max(min, Math.min(max, Math.round(parsedValue)))
      : value;
    onChange(nextValue);
    previousValueRef.current = nextValue;
    setDraft(format(nextValue));
    setIsInvalid(false);
  };

  return (
    <motion.div
      ref={controlRef}
      className={`savings-calculator__editable-number ${className}`.trim()}
    >
      <input
        id={id}
        type="text"
        inputMode="numeric"
        enterKeyHint="done"
        value={draft}
        min={min}
        max={max}
        aria-label={ariaLabel}
        aria-invalid={isInvalid}
        data-testid={testId}
        onFocus={(event) => {
          isEditingRef.current = true;
          event.currentTarget.select();
        }}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </motion.div>
  );
}

function RangeControl({
  id,
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
  ariaLabel,
  testId,
}: {
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  ariaLabel: string;
  testId: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const progress = max === min ? 0 : (value - min) / (max - min);

  useEffect(() => {
    if (!isDragging) return undefined;
    const stopDragging = () => setIsDragging(false);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
    return () => {
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, [isDragging]);

  return (
    <div
      className={`savings-calculator__range ${isDragging ? "is-dragging" : ""}`.trim()}
      style={{ "--range-progress": progress } as CSSProperties}
    >
      <div className="savings-calculator__range-track" aria-hidden="true">
        <span />
      </div>
      <div className="savings-calculator__range-thumb" aria-hidden="true" />
      <input
        id={id}
        className="savings-calculator__range-input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={ariaLabel}
        aria-valuetext={formatValue(value)}
        data-testid={testId}
        onChange={(event) => onChange(Number(event.target.value))}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onPointerCancel={() => setIsDragging(false)}
        onBlur={() => setIsDragging(false)}
      />
      <span className="savings-calculator__range-tooltip" aria-hidden="true">
        {formatValue(value)}
      </span>
    </div>
  );
}

function AnimatedSavings({
  min,
  max,
  suffix,
  testId,
  reduceMotion,
}: {
  min: number;
  max: number;
  suffix: string;
  testId: string;
  reduceMotion: boolean;
}) {
  const minValue = useMotionValue(min);
  const maxValue = useMotionValue(max);
  const minLabel = useTransform(minValue, (value) => formatCurrency(value));
  const maxLabel = useTransform(maxValue, (value) => formatCurrency(value));

  useEffect(() => {
    if (reduceMotion) {
      minValue.set(min);
      maxValue.set(max);
      return undefined;
    }

    const controls = [
      animate(minValue, min, {
        duration: 0.38,
        ease: DROPDOWN_EASE,
      }),
      animate(maxValue, max, {
        duration: 0.38,
        ease: DROPDOWN_EASE,
      }),
    ];
    return () => controls.forEach((control) => control.stop());
  }, [max, maxValue, min, minValue, reduceMotion]);

  return (
    <motion.strong
      data-testid={testId}
      aria-label={`${formatCurrency(min)} to ${formatCurrency(max)} ${suffix}`}
    >
      <motion.span aria-hidden="true">{minLabel}</motion.span>
      <span className="savings-calculator__result-separator" aria-hidden="true">
        {" – "}
      </span>
      <motion.span aria-hidden="true">{maxLabel}</motion.span>
      <small className="savings-calculator__result-period" aria-hidden="true">
        {suffix}
      </small>
    </motion.strong>
  );
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
  const reduceMotion = usePrefersReducedMotion();

  const [selectedRoleId, setSelectedRoleId] = useState<string>(() => {
    if (initialRole && SERVICE_ROLES.some((role) => role.id === initialRole)) {
      return initialRole;
    }
    return CALCULATOR_CONFIG.defaultRole;
  });

  const [teamMembers, setTeamMembers] = useState<number>(() => {
    const value = initialTeamMembers ?? CALCULATOR_CONFIG.defaultTeamMembers;
    return Math.max(
      CALCULATOR_CONFIG.minTeamMembers,
      Math.min(CALCULATOR_CONFIG.maxTeamMembers, value),
    );
  });

  const [currentCost, setCurrentCost] = useState<number>(() => {
    const value = initialCurrentCost ?? CALCULATOR_CONFIG.defaultCurrentCost;
    return Math.max(
      CALCULATOR_CONFIG.minCurrentCost,
      Math.min(CALCULATOR_CONFIG.maxCurrentCost, value),
    );
  });

  const selectedRole = SERVICE_ROLES.find((role) => role.id === selectedRoleId);
  const calculation = calculateSavings(
    teamMembers,
    currentCost,
    selectedRole?.publishedMonthlyPrice,
  );
  const forwardUrl = buildCalculatorForwardUrl(
    selectedRoleId,
    teamMembers,
    currentCost,
  );

  const handleMemberChange = (nextValue: number) => {
    setTeamMembers(
      Math.max(
        CALCULATOR_CONFIG.minTeamMembers,
        Math.min(CALCULATOR_CONFIG.maxTeamMembers, nextValue),
      ),
    );
  };

  const handleCostChange = (nextValue: number) => {
    setCurrentCost(
      Math.max(
        CALCULATOR_CONFIG.minCurrentCost,
        Math.min(CALCULATOR_CONFIG.maxCurrentCost, nextValue),
      ),
    );
  };

  return (
    <div className={`savings-calculator ${className}`.trim()}>
      {showTitle ? (
        <div className="savings-calculator__heading">
          <p>Cost reduction calculator</p>
          <h2>Calculate your practice savings</h2>
          <span>Adjust the inputs to see your projected range.</span>
        </div>
      ) : null}

      <div className="savings-calculator__fields">
        <div className="savings-calculator__field savings-calculator__field--role">
          <RoleDropdown
            id={roleSelectId}
            selectedRoleId={selectedRoleId}
            onChange={setSelectedRoleId}
          />
        </div>

        <div className="savings-calculator__field savings-calculator__field--boxed">
          <div className="savings-calculator__label-row">
            <label htmlFor={membersInputId}>Number of team members</label>
            <div className="savings-calculator__stepper">
              <button
                type="button"
                onClick={() => handleMemberChange(teamMembers - 1)}
                disabled={teamMembers <= CALCULATOR_CONFIG.minTeamMembers}
                aria-label="Decrease team members"
              >
                <Minus size={16} strokeWidth={2} aria-hidden="true" />
              </button>
              <EditableNumber
                id={membersInputId}
                value={teamMembers}
                min={CALCULATOR_CONFIG.minTeamMembers}
                max={CALCULATOR_CONFIG.maxTeamMembers}
                onChange={handleMemberChange}
                format={(value) => String(value)}
                ariaLabel="Number of team members"
                testId="team-members-input"
              />
              <button
                type="button"
                onClick={() => handleMemberChange(teamMembers + 1)}
                disabled={teamMembers >= CALCULATOR_CONFIG.maxTeamMembers}
                aria-label="Increase team members"
              >
                <Plus size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </div>
          <RangeControl
            id={`${membersInputId}-range`}
            min={CALCULATOR_CONFIG.minTeamMembers}
            max={CALCULATOR_CONFIG.maxTeamMembers}
            step={1}
            value={teamMembers}
            onChange={handleMemberChange}
            formatValue={(value) =>
              `${value} ${value === 1 ? "member" : "members"}`
            }
            ariaLabel="Team members count slider"
            testId="team-members-slider"
          />
          <div className="savings-calculator__range-labels">
            <span>{CALCULATOR_CONFIG.minTeamMembers} member</span>
            <span>{CALCULATOR_CONFIG.maxTeamMembers} members</span>
          </div>
        </div>

        <div className="savings-calculator__field savings-calculator__field--boxed">
          <div className="savings-calculator__label-row">
            <div>
              <label htmlFor={costInputId}>Current monthly cost per member</label>
              <span>Salary, payroll taxes, benefits, and overhead</span>
            </div>
            <div className="savings-calculator__money-input">
              <span aria-hidden="true">$</span>
              <EditableNumber
                id={costInputId}
                value={currentCost}
                min={CALCULATOR_CONFIG.minCurrentCost}
                max={CALCULATOR_CONFIG.maxCurrentCost}
                onChange={handleCostChange}
                format={(value) => Math.round(value).toLocaleString("en-US")}
                ariaLabel="Current monthly cost per member"
                testId="current-cost-input"
              />
            </div>
          </div>
          <RangeControl
            id={`${costInputId}-range`}
            min={CALCULATOR_CONFIG.minCurrentCost}
            max={CALCULATOR_CONFIG.maxCurrentCost}
            step={CALCULATOR_CONFIG.costStep}
            value={currentCost}
            onChange={handleCostChange}
            formatValue={(value) => formatCurrency(value)}
            ariaLabel="Current monthly cost slider"
            testId="current-cost-slider"
          />
          <div className="savings-calculator__range-labels">
            <span>{formatCurrency(CALCULATOR_CONFIG.minCurrentCost)}</span>
            <span>{formatCurrency(CALCULATOR_CONFIG.maxCurrentCost)}</span>
          </div>
        </div>
      </div>

      <div
        className="savings-calculator__results"
        role="region"
        aria-label="Calculated savings"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="savings-calculator__results-summary">
          <span>Typical savings range</span>
          <strong>50%–60%</strong>
        </div>
        <div className="savings-calculator__result">
          <span>Estimated monthly savings</span>
          <AnimatedSavings
            min={calculation.monthlyMin}
            max={calculation.monthlyMax}
            suffix="/mo"
            testId="monthly-savings-result"
            reduceMotion={reduceMotion}
          />
          <small>50% to 60% typical overhead reduction</small>
        </div>
        <div className="savings-calculator__result">
          <span>Estimated annual savings</span>
          <AnimatedSavings
            min={calculation.annualMin}
            max={calculation.annualMax}
            suffix="/yr"
            testId="annual-savings-result"
            reduceMotion={reduceMotion}
          />
          <small>Projected annual overhead reduction</small>
        </div>

        {calculation.publishedDiff !== undefined &&
        calculation.publishedDiff > 0 ? (
          <p className="savings-calculator__comparison">
            Save {formatCurrency(calculation.publishedDiff)}/mo versus the
            RepHero listed rate for {selectedRole?.name}.
          </p>
        ) : null}

        {calculation.isCustomQuote ? (
          <p className="savings-calculator__custom-note">
            {CALCULATOR_CONFIG.customQuoteDisclaimer}
          </p>
        ) : null}
      </div>

      <Link
        href={forwardUrl}
        data-testid="calculator-cta-button"
        className="savings-calculator__cta"
      >
        <span>{CTA_LABELS.calculator}</span>
        <ArrowRight size={17} strokeWidth={1.9} aria-hidden="true" />
      </Link>

      <p className="savings-calculator__disclaimer">
        {CALCULATOR_CONFIG.disclaimer}
      </p>
    </div>
  );
}

export default SavingsCalculator;
