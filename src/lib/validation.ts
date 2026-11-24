export interface BookingFormData {
  name?: string;
  workEmail?: string;
  practiceName?: string;
  practiceType?: string;
  phone?: string;
  rolesOfInterest?: string;
  message?: string;
  website_url_hp?: string;
  website_url?: string;
  honeypot?: string;
  company_url?: string;
  [key: string]: any;
}

export interface ValidationResult {
  isValid: boolean;
  isBotTrapped: boolean;
  errors: Record<string, string>;
}

export function validateWorkEmail(email: unknown): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf('@')) return false;
  const localPart = trimmed.slice(0, atIndex);
  if (
    localPart.length > 64 ||
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..')
  ) {
    return false;
  }
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

export function parseTeamMembersParam(param: string | null | undefined): number {
  const num = parseInt(param || '', 10);
  return !isNaN(num) && num > 0 && num <= 20 ? num : 2;
}

export function parseCurrentCostParam(param: string | null | undefined): number {
  const num = parseInt(param || '', 10);
  return !isNaN(num) && num >= 1000 && num <= 20000 ? num : 3500;
}

export function validateBookingForm(data: BookingFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      isBotTrapped: false,
      errors: {
        name: 'Full name is required',
        workEmail: 'Please enter a valid work email address',
        practiceName: 'Practice or organization name is required',
        practiceType: 'Practice type is required'
      }
    };
  }

  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.name = 'Full name is required';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must not exceed 100 characters';
  }

  if (!data.workEmail || !validateWorkEmail(data.workEmail)) {
    errors.workEmail = 'Please enter a valid work email address';
  }

  if (!data.practiceName || typeof data.practiceName !== 'string' || !data.practiceName.trim()) {
    errors.practiceName = 'Practice or organization name is required';
  } else if (data.practiceName.trim().length > 100) {
    errors.practiceName = 'Practice name must not exceed 100 characters';
  }

  if (!data.practiceType || typeof data.practiceType !== 'string' || !data.practiceType.trim()) {
    errors.practiceType = 'Practice type is required';
  }

  const honeypotVal = data.website_url_hp || data.website_url || data.honeypot || data.company_url || '';
  const isBotTrapped = typeof honeypotVal === 'string' && honeypotVal.trim().length > 0;

  if (data.phone && typeof data.phone === 'string' && data.phone.trim().length > 0) {
    const digitsOnly = data.phone.replace(/[\s\-\(\)\+]/g, '');
    if (!/^\d{7,15}$/.test(digitsOnly)) {
      errors.phone = 'Please enter a valid phone number';
    }
  }

  if (data.message && typeof data.message === 'string' && data.message.length > 2000) {
    errors.message = 'Message must not exceed 2,000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0 && !isBotTrapped,
    isBotTrapped,
    errors
  };
}

export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
