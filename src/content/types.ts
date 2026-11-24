export type RoleCategory = 
  | 'Admin and Executive' 
  | 'Revenue Cycle and Compliance' 
  | 'Extended and Creative';

export type PricingModel = 
  | 'flat' 
  | 'percentage' 
  | 'per_unit' 
  | 'custom';

export interface ServiceRole {
  id: string;
  name: string;
  category: RoleCategory;
  description: string;
  responsibilities: string[];
  priceDisplay: string;
  publishedMonthlyPrice?: number;
  pricingModel: PricingModel;
  unitDetails?: string;
  popular?: boolean;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  anchorId: string;
  headline: string;
  description: string;
  painPoints: string[];
  recommendedRoles: string[]; // references ServiceRole.id
  testimonialSnippet?: {
    quote: string;
    author: string;
  };
}

export interface PartnerBadge {
  id: string;
  name: string;
  category: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  deliverable?: string;
}

export interface CalculatorConfig {
  defaultRole: string;
  defaultTeamMembers: number;
  minTeamMembers: number;
  maxTeamMembers: number;
  defaultCurrentCost: number;
  minCurrentCost: number;
  maxCurrentCost: number;
  costStep: number;
  minSavingsRate: number;
  maxSavingsRate: number;
  disclaimer: string;
  customQuoteDisclaimer: string;
}

export interface SavingsCalculation {
  monthlyMin: number;
  monthlyMax: number;
  annualMin: number;
  annualMax: number;
  publishedDiff?: number;
  isCustomQuote: boolean;
}

export interface TestimonialBanner {
  id: string;
  client: string;
  serviceHighlighted: string;
  eyebrow: string;
  headline: string;
  quote: string;
  attribution: string;
  isApproved: boolean;
  status: 'published' | 'pending';
  backgroundTheme: 'dental' | 'mental-health' | 'creative';
  backgroundDirection: string;
  logoPlaceholder: string;
}

export type FAQCategory = 'general' | 'pricing' | 'process' | 'compliance';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
}

export interface LegalSection {
  id: string;
  heading: string;
  content: string[];
}

export interface LegalPolicy {
  title: string;
  lastUpdated: string;
  introduction: string;
  sections: LegalSection[];
}

export interface NavigationItem {
  label: string;
  href: string;
  isButton?: boolean;
}

export interface FooterColumn {
  title: string;
  links: {
    label: string;
    href: string;
    isExternal?: boolean;
  }[];
}

export type PlaceholderStatus =
  | 'Received (low resolution)'
  | 'Needed'
  | 'Placeholder'
  | 'To create'
  | 'To draft'
  | 'To source'
  | 'Received'
  | 'Optional';

export type PlaceholderCategory = 'asset' | 'copy' | 'approval' | 'legal';

export interface PlaceholderItem {
  id: number;
  key: string;
  name: string;
  category: PlaceholderCategory;
  status: PlaceholderStatus;
  notes: string;
  fallbackValue?: string;
  resolved: boolean;
}
