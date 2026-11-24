"use client";

import React, { useState, Suspense, useId } from "react";
import { useSearchParams } from "next/navigation";
import {
  DISCOVERY_CALL_LENGTH_MINUTES,
  PHI_WARNING_NOTICE,
  SERVICE_ROLES,
  CTA_LABELS,
  formatCurrency,
} from "@/content";

export interface BookCallFormProps {
  className?: string;
  onSuccess?: () => void;
  showSchedulingSlot?: boolean;
}

export interface BookingFormData {
  name: string;
  workEmail: string;
  practiceName: string;
  practiceType: string;
  phone?: string;
  rolesOfInterest?: string;
  message?: string;
  website_url?: string;
  website_url_hp?: string;
}

export interface BookingValidationResult {
  isValid: boolean;
  isBotTrapped: boolean;
  errors: Record<string, string>;
}

// RFC 5322 Compliant Email Validator
export function validateWorkEmail(email: unknown): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf("@")) return false;
  const localPart = trimmed.slice(0, atIndex);
  if (
    localPart.length > 64 ||
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..")
  ) {
    return false;
  }
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

// Flexible Role Slug / Name Resolution
export function resolveRoleSelection(roleParam: string | null): string {
  if (!roleParam) return "";
  let cleanParam = "";
  try {
    cleanParam = decodeURIComponent(roleParam).trim().toLowerCase();
  } catch {
    cleanParam = String(roleParam).trim().toLowerCase();
  }

  // Match by exact ID
  const byId = SERVICE_ROLES.find((r) => r.id.toLowerCase() === cleanParam);
  if (byId) return byId.id;

  // Match by name
  const byName = SERVICE_ROLES.find((r) => r.name.toLowerCase() === cleanParam);
  if (byName) return byName.id;

  // Fuzzy match
  const byFuzzy = SERVICE_ROLES.find(
    (r) =>
      cleanParam.includes(r.id) || r.name.toLowerCase().includes(cleanParam)
  );
  return byFuzzy ? byFuzzy.id : "";
}

// Form Field Validator
export function validateBookingForm(data: BookingFormData): BookingValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    errors.name = "Full name is required";
  } else if (data.name.trim().length > 100) {
    errors.name = "Name must not exceed 100 characters";
  }

  if (!data.workEmail || !validateWorkEmail(data.workEmail)) {
    errors.workEmail = "Please enter a valid work email address";
  }

  if (
    !data.practiceName ||
    typeof data.practiceName !== "string" ||
    !data.practiceName.trim()
  ) {
    errors.practiceName = "Practice or organization name is required";
  } else if (data.practiceName.trim().length > 100) {
    errors.practiceName = "Practice name must not exceed 100 characters";
  }

  if (
    !data.practiceType ||
    typeof data.practiceType !== "string" ||
    !data.practiceType.trim()
  ) {
    errors.practiceType = "Practice type is required";
  }

  // Honeypot bot trap
  const honeypotVal = data.website_url || data.website_url_hp || "";
  const isBotTrapped =
    typeof honeypotVal === "string" && honeypotVal.trim().length > 0;

  // Phone validation (optional)
  if (data.phone && typeof data.phone === "string" && data.phone.trim().length > 0) {
    const digitsOnly = data.phone.replace(/[\s\-\(\)\+]/g, "");
    if (!/^\d{7,15}$/.test(digitsOnly)) {
      errors.phone = "Please enter a valid phone number";
    }
  }

  // Message length check (optional, max 2000 chars)
  if (data.message && typeof data.message === "string" && data.message.length > 2000) {
    errors.message = "Message must not exceed 2,000 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0 && !isBotTrapped,
    isBotTrapped,
    errors,
  };
}

export const PRACTICE_TYPE_OPTIONS = [
  "Dental Practices",
  "Family Medicine & Primary Care",
  "Hospice & Home Health",
  "Behavioral Health & Therapy",
  "Specialty Pharmacy & Labs",
  "Pain Management & ACOs",
  "Other / Multi-Specialty",
];

function BookCallFormInner({
  className = "",
  onSuccess,
  showSchedulingSlot = true,
}: BookCallFormProps) {
  const searchParams = useSearchParams();

  const nameId = useId();
  const emailId = useId();
  const practiceId = useId();
  const typeId = useId();
  const phoneId = useId();
  const roleId = useId();
  const messageId = useId();

  const initialRoleSlug = resolveRoleSelection(searchParams.get("role"));
  const initialMembersStr = searchParams.get("teamMembers") || "2";
  const initialCostStr = searchParams.get("currentCost") || "3500";

  const [name, setName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [practiceName, setPracticeName] = useState("");
  const [practiceType, setPracticeType] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState(initialRoleSlug);
  const [message, setMessage] = useState("");

  // Anti-spam honeypot states
  const [honeypot, setHoneypot] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const matchedRole = SERVICE_ROLES.find((r) => r.id === selectedRole);
  const rawMembers = parseInt(initialMembersStr, 10);
  const numMembers = !isNaN(rawMembers) && rawMembers > 0 && rawMembers <= 20 ? rawMembers : 2;

  const rawCost = parseInt(initialCostStr, 10);
  const numCost = !isNaN(rawCost) && rawCost >= 1000 && rawCost <= 20000 ? rawCost : 3500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent concurrent duplicate submissions
    if (isSubmitting) return;

    const payload: BookingFormData = {
      name,
      workEmail,
      practiceName,
      practiceType,
      phone,
      rolesOfInterest: selectedRole,
      message,
      website_url: honeypot,
      website_url_hp: honeypot,
    };

    const validation = validateBookingForm(payload);

    if (!validation.isValid) {
      if (validation.isBotTrapped) {
        // Silently drop bot submission
        return;
      }
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    if (onSuccess) {
      onSuccess();
    } else {
      window.location.href = "/thank-you";
    }
  };

  return (
    <div
      className={`border border-line rounded-[2px] p-6 sm:p-8 md:p-10 bg-white shadow-sm max-w-2xl mx-auto ${className}`}
    >
      {/* Mandatory Non-PHI Warning Notice */}
      <div
        data-testid="phi-notice"
        className="p-4 mb-6 bg-peach/30 border-l-4 border-peach text-xs text-charcoal rounded-[2px] leading-relaxed"
      >
        <strong>HIPAA & Privacy Notice:</strong> {PHI_WARNING_NOTICE}
      </div>

      {/* Calculator Forwarded Inquiry Summary Pill */}
      {(searchParams.get("role") || searchParams.get("teamMembers") || searchParams.get("currentCost")) && (
        <div className="mb-6 p-3.5 bg-mist border border-line rounded-[2px] text-xs text-charcoal flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-navy mr-1.5">Inquiry Details:</span>
            <span>
              {matchedRole ? matchedRole.name : "Custom Plan"} • {numMembers} team member{numMembers > 1 ? "s" : ""} • {formatCurrency(numCost)}/mo baseline
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-slate font-medium">Prefilled</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Anti-spam honeypot inputs */}
        <input
          type="text"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
          style={{ display: "none" }}
          aria-hidden="true"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
        <input
          type="text"
          name="website_url_hp"
          tabIndex={-1}
          autoComplete="off"
          style={{ display: "none" }}
          aria-hidden="true"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor={nameId}
              className="block text-xs uppercase tracking-wider text-slate font-medium mb-1.5"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id={nameId}
              type="text"
              name="name"
              required
              maxLength={100}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="Dr. Sarah Johnson"
              className={`w-full px-4 py-2.5 border rounded-[2px] text-charcoal text-sm focus:outline-navy bg-white transition-colors ${
                errors.name ? "border-red-500" : "border-line"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Work Email */}
          <div>
            <label
              htmlFor={emailId}
              className="block text-xs uppercase tracking-wider text-slate font-medium mb-1.5"
            >
              Work Email <span className="text-red-500">*</span>
            </label>
            <input
              id={emailId}
              type="email"
              name="workEmail"
              required
              maxLength={254}
              value={workEmail}
              onChange={(e) => {
                setWorkEmail(e.target.value);
                if (errors.workEmail) setErrors((prev) => ({ ...prev, workEmail: "" }));
              }}
              placeholder="sjohnson@practice.com"
              className={`w-full px-4 py-2.5 border rounded-[2px] text-charcoal text-sm focus:outline-navy bg-white transition-colors ${
                errors.workEmail ? "border-red-500" : "border-line"
              }`}
            />
            {errors.workEmail && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.workEmail}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Practice Name */}
          <div>
            <label
              htmlFor={practiceId}
              className="block text-xs uppercase tracking-wider text-slate font-medium mb-1.5"
            >
              Practice or Organization Name <span className="text-red-500">*</span>
            </label>
            <input
              id={practiceId}
              type="text"
              name="practiceName"
              required
              maxLength={100}
              value={practiceName}
              onChange={(e) => {
                setPracticeName(e.target.value);
                if (errors.practiceName)
                  setErrors((prev) => ({ ...prev, practiceName: "" }));
              }}
              placeholder="Pinecrest Family Health"
              className={`w-full px-4 py-2.5 border rounded-[2px] text-charcoal text-sm focus:outline-navy bg-white transition-colors ${
                errors.practiceName ? "border-red-500" : "border-line"
              }`}
            />
            {errors.practiceName && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {errors.practiceName}
              </p>
            )}
          </div>

          {/* Practice Type */}
          <div>
            <label
              htmlFor={typeId}
              className="block text-xs uppercase tracking-wider text-slate font-medium mb-1.5"
            >
              Practice Type <span className="text-red-500">*</span>
            </label>
            <select
              id={typeId}
              name="practiceType"
              required
              value={practiceType}
              onChange={(e) => {
                setPracticeType(e.target.value);
                if (errors.practiceType)
                  setErrors((prev) => ({ ...prev, practiceType: "" }));
              }}
              className={`w-full px-4 py-2.5 border rounded-[2px] text-charcoal text-sm focus:outline-navy bg-white transition-colors cursor-pointer ${
                errors.practiceType ? "border-red-500" : "border-line"
              }`}
            >
              <option value="">Select practice specialty...</option>
              {PRACTICE_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.practiceType && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {errors.practiceType}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Phone Number (Optional) */}
          <div>
            <label
              htmlFor={phoneId}
              className="block text-xs uppercase tracking-wider text-slate font-medium mb-1.5"
            >
              Direct Phone (Optional)
            </label>
            <input
              id={phoneId}
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
              }}
              placeholder="+1 (555) 234-5678"
              className={`w-full px-4 py-2.5 border rounded-[2px] text-charcoal text-sm focus:outline-navy bg-white transition-colors ${
                errors.phone ? "border-red-500" : "border-line"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone}</p>
            )}
          </div>

          {/* Role(s) of Interest */}
          <div>
            <label
              htmlFor={roleId}
              className="block text-xs uppercase tracking-wider text-slate font-medium mb-1.5"
            >
              Role(s) of Interest
            </label>
            <select
              id={roleId}
              name="rolesOfInterest"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2.5 border border-line rounded-[2px] text-charcoal text-sm focus:outline-navy bg-white transition-colors cursor-pointer"
            >
              <option value="">Select a role...</option>
              {SERVICE_ROLES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name} ({role.priceDisplay})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Practice Details */}
        <div>
          <label
            htmlFor={messageId}
            className="block text-xs uppercase tracking-wider text-slate font-medium mb-1.5"
          >
            Additional Practice Details (No PHI)
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={4}
            maxLength={2000}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
            }}
            placeholder="Tell us about your EHR system, current team size, and immediate staffing requirements..."
            className={`w-full px-4 py-2.5 border rounded-[2px] text-charcoal text-sm focus:outline-navy bg-white transition-colors ${
              errors.message ? "border-red-500" : "border-line"
            }`}
          ></textarea>
          <div className="flex justify-between text-[11px] text-slate/70 mt-1">
            <span>Do not include patient identifiers</span>
            <span>{message.length} / 2000</span>
          </div>
          {errors.message && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center font-medium text-base px-6 py-4 rounded-[2px] bg-charcoal text-white hover:bg-ink disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isSubmitting ? (
            <span>Scheduling...</span>
          ) : (
            <span>{`${CTA_LABELS.primary} (${DISCOVERY_CALL_LENGTH_MINUTES} min)`}</span>
          )}
        </button>
      </form>

      {/* Modular Third-Party Scheduling Tool Slot */}
      {showSchedulingSlot && (
        <div
          id="booking-embed-slot"
          data-testid="booking-embed-slot"
          className="mt-8 pt-8 border-t border-line"
        >
          <div className="bg-mist border border-line rounded-[2px] p-6 text-center">
            <span className="text-xs uppercase tracking-wider text-slate font-medium block mb-1">
              Instant Self-Scheduling (Optional)
            </span>
            <p className="text-sm text-slate">
              Prefer to pick a time right now? Direct calendar integration slot for Calendly / Microsoft Bookings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function BookCallForm(props: BookCallFormProps) {
  return (
    <Suspense
      fallback={
        <div className="border border-line rounded-[2px] p-8 bg-white max-w-2xl mx-auto text-center text-slate text-sm">
          Loading booking form...
        </div>
      }
    >
      <BookCallFormInner {...props} />
    </Suspense>
  );
}
