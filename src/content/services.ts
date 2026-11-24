import type { ServiceRole } from './types';

export const SERVICE_ROLES: ServiceRole[] = [
  // Category 1: Admin and Executive
  {
    id: "admin-front-desk",
    name: "Admin / Front Desk",
    category: "Admin and Executive",
    description: "Dedicated front-desk and patient coordination professionals handling inbound calls, scheduling, intake, and patient follow-ups.",
    responsibilities: [
      "Inbound & outbound patient scheduling and triage",
      "Patient intake and registration coordination",
      "Appointment confirmations and recall reminders",
      "Insurance verification and copay collection inquiries",
      "EHR/EMR demographic and schedule maintenance",
    ],
    priceDisplay: "$1,499/mo",
    publishedMonthlyPrice: 1499,
    pricingModel: "flat",
    popular: true,
  },
  {
    id: "medical-assistant",
    name: "Medical Assistant",
    category: "Admin and Executive",
    description: "Remote clinical and administrative support assisting providers with charting, lab orders, prescription refill requests, and patient portal triage.",
    responsibilities: [
      "EHR chart prep and visit summary drafting",
      "Patient portal messaging and triage",
      "Prescription refill coordination and prior auth initiation",
      "Lab and diagnostic test order tracking",
      "Provider schedule optimization and documentation support",
    ],
    priceDisplay: "$1,999/mo",
    publishedMonthlyPrice: 1999,
    pricingModel: "flat",
  },
  {
    id: "executive-assistant",
    name: "Executive Assistant",
    category: "Admin and Executive",
    description: "High-level operational support for practice owners, medical directors, and practice managers navigating complex administrative workloads.",
    responsibilities: [
      "Calendar management and executive correspondence",
      "Meeting coordination, agendas, and follow-up tracking",
      "Vendor coordination and operational administrative tasks",
      "Reporting, presentation prep, and expense tracking",
      "Cross-departmental liaison for remote team management",
    ],
    priceDisplay: "Custom quote",
    publishedMonthlyPrice: undefined,
    pricingModel: "custom",
  },

  // Category 2: Revenue Cycle and Compliance
  {
    id: "medical-biller",
    name: "Medical Biller",
    category: "Revenue Cycle and Compliance",
    description: "End-to-end billing specialists submitting claims, managing denials, posting payments, and managing patient accounts receivables.",
    responsibilities: [
      "Claim scrubbing, generation, and electronic submission",
      "Payment posting (ERA/EOB) and adjustment reconciliation",
      "Denial management and appeal filing",
      "A/R follow-up with commercial and government payers",
      "Patient statement generation and balance inquiries",
    ],
    priceDisplay: "5% of collections or $1,499 flat/mo",
    publishedMonthlyPrice: 1499,
    pricingModel: "percentage",
    unitDetails: "5% of collections or $1,499 flat/mo (whichever fits your practice best)",
    popular: true,
  },
  {
    id: "certified-professional-coder",
    name: "Certified Professional Coder",
    category: "Revenue Cycle and Compliance",
    description: "AAPC/AHIMA-credentialed coders ensuring accurate ICD-10-CM, CPT, and HCPCS code assignment to maximize legitimate reimbursement and compliance.",
    responsibilities: [
      "ICD-10-CM, CPT, and HCPCS coding from clinical charts",
      "Modifier application and code bundling compliance check",
      "Documentation audit for medical necessity and specificity",
      "Provider documentation education and feedback loops",
      "Compliance audit prep and risk mitigation",
    ],
    priceDisplay: "$1,999/mo",
    publishedMonthlyPrice: 1999,
    pricingModel: "flat",
  },
  {
    id: "revenue-cycle-management",
    name: "Revenue Cycle Management",
    category: "Revenue Cycle and Compliance",
    description: "Comprehensive revenue cycle oversight combining billing, coding, denial analytics, and cash-flow optimization into one managed function.",
    responsibilities: [
      "Full revenue cycle workflow oversight and metrics tracking",
      "First-pass clean claim rate optimization",
      "A/R aging reduction strategy (>90 days cleanup)",
      "Payer fee schedule review and underpayment identification",
      "Monthly financial reporting and KPI dashboard review",
    ],
    priceDisplay: "$1,999/mo",
    publishedMonthlyPrice: 1999,
    pricingModel: "flat",
  },
  {
    id: "credentialing-and-contracting",
    name: "Credentialing and Contracting",
    category: "Revenue Cycle and Compliance",
    description: "Provider enrollment and commercial/Medicaid payer contracting specialists keeping your providers credentialed and in-network without lapses.",
    responsibilities: [
      "Initial provider credentialing and CAQH profile management",
      "Re-credentialing tracking and timely submission",
      "Payer contract enrollment and fee schedule negotiation support",
      "Hospital and facility privilege application coordination",
      "Licensure, DEA, and board certification expiration monitoring",
    ],
    priceDisplay: "$200/provider/payer or $399 payer bundle",
    publishedMonthlyPrice: undefined,
    pricingModel: "per_unit",
    unitDetails: "$200 per provider per payer or $399 per payer bundle [confirm mapping]",
  },

  // Category 3: Extended and Creative
  {
    id: "after-hours-support",
    name: "After-Hours Support",
    category: "Extended and Creative",
    description: "Evening, weekend, and holiday patient triage, emergency routing, and after-hours call coverage so practice staff can disconnect.",
    responsibilities: [
      "After-hours call answering and urgent triage routing",
      "On-call physician dispatch per clinic protocol",
      "Next-day appointment booking and urgent reschedule logging",
      "Patient portal monitoring and non-clinical reassurance",
      "Detailed morning call logs delivered before clinic opening",
    ],
    priceDisplay: "From $999/mo",
    publishedMonthlyPrice: 999,
    pricingModel: "flat",
    unitDetails: "Starting from $999/mo depending on shift coverage and volume",
  },
  {
    id: "graphic-designer",
    name: "Graphic Designer",
    category: "Extended and Creative",
    description: "Healthcare-attuned digital and print design specialists creating marketing collateral, social graphics, patient education brochures, and practice branding.",
    responsibilities: [
      "Patient education flyers, brochures, and intake collateral",
      "Practice social media graphics, website banners, and email templates",
      "Print signage, direct mail, and event promotional materials",
      "Brand consistency maintenance across multi-location clinics",
      "Digital presentation design for physician and provider lectures",
    ],
    priceDisplay: "Custom quote",
    publishedMonthlyPrice: undefined,
    pricingModel: "custom",
  },
];

export const SERVICES_HEADER = {
  eyebrow: "Healthcare Roles & Pricing",
  heading: "Trained Remote Healthcare Professionals",
  description: "Explore all 9 specialized remote healthcare roles across admin, medical billing, compliance, and creative support. Flat monthly pricing with signed BAA on every engagement.",
};

export const CATEGORY_TABS = [
  { id: "all", label: "All Roles", anchor: "#all" },
  { id: "admin-and-executive", label: "Admin and Executive", anchor: "#admin-and-executive" },
  { id: "revenue-cycle-and-compliance", label: "Revenue Cycle and Compliance", anchor: "#revenue-cycle-and-compliance" },
  { id: "extended-and-creative", label: "Extended and Creative", anchor: "#extended-and-creative" },
];

export const PRICING_NOTE = {
  eyebrow: "Transparent Pricing Commitment",
  heading: "Transparent Flat Monthly Pricing",
  description: "RepHero eliminates the complexity and overhead of local recruiting. All our dedicated roles operate on predictable flat monthly pricing with zero hidden fees, recruitment fees, payroll taxes, or benefits overhead. Flexible 30-day notice terms apply to all standard contracts.",
  customQuoteDetails: "Roles marked 'Custom quote' are tailored to your practice's specific shift requirements, volume tiers, or specialized EHR software expertise. Custom proposals are delivered within 24-48 hours of your discovery call.",
};

export const SERVICES_TRUST_BLOCK = {
  eyebrow: "Healthcare Standards Guaranteed",
  heading: "Backed by Airtight HIPAA Compliance",
  description: "Every remote professional undergoes comprehensive HIPAA training and testing before placement. RepHero executes a formal Business Associate Agreement on every engagement.",
  points: [
    "Signed Business Associate Agreement (BAA) on every engagement",
    "HIPAA-trained and tested professionals before placement",
    "Dedicated US-aligned account manager for quality assurance",
    "50-60% typical savings compared to local hiring costs",
  ],
};

