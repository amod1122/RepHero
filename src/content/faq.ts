import type { FAQItem } from './types';

export const FAQ_ITEMS: FAQItem[] = [
  // General & Services
  {
    id: "faq-how-it-fits",
    question: "How do remote team members fit into our practice?",
    answer: "RepHero remote professionals work as a direct extension of your practice inside your existing workflows. They log into your EHR/EMR, answer your phone lines via your VoIP system, communicate with your team via Slack or Microsoft Teams, and follow your practice's specific standard operating procedures (SOPs). To your patients and staff, they feel like in-house colleagues.",
    category: "general",
  },
  {
    id: "faq-roles-available",
    question: "What types of healthcare roles does RepHero provide?",
    answer: "We provide nine specialized roles across three categories: Admin and Executive (Front Desk, Medical Assistant, Executive Assistant), Revenue Cycle and Compliance (Medical Biller, Certified Professional Coder, Revenue Cycle Management, Credentialing and Contracting), and Extended and Creative (After-Hours Support, Graphic Designer).",
    category: "general",
  },
  {
    id: "faq-time-zones",
    question: "What time zones do your remote professionals cover?",
    answer: "Our remote team members are matched to your practice's operating hours across all US time zones (Eastern, Central, Mountain, and Pacific). We also provide dedicated evening, weekend, and overnight coverage through our After-Hours Support role.",
    category: "general",
  },

  // Pricing & Contracts
  {
    id: "faq-pricing-details",
    question: "How much does it cost, and are there hidden fees?",
    answer: "We operate on a transparent, flat monthly pricing model with no hidden fees, recruiting costs, or payroll taxes. Full-time dedicated roles start from $1,499/mo for Admin/Front Desk and $1,999/mo for Medical Assistants and Coders. This represents a typical 50-60% savings compared to equivalent local hires.",
    category: "pricing",
  },
  {
    id: "faq-what-is-included",
    question: "What is included in the monthly flat rate?",
    answer: "The flat monthly fee covers your dedicated, full-time professional, comprehensive HIPAA compliance training, dedicated workstation equipment with security controls, a dedicated RepHero account manager, ongoing quality oversight, and a signed Business Associate Agreement (BAA).",
    category: "pricing",
  },
  {
    id: "faq-contract-terms",
    question: "Are there long-term contract lock-ins?",
    answer: "No. We believe in earning your business every month. Our standard agreements operate on flexible terms with a standard 30-day notice period, allowing your practice to scale staffing up or down as patient volumes change.",
    category: "pricing",
  },

  // Compliance & HIPAA
  {
    id: "faq-hipaa-compliance",
    question: "Is our practice data safe, and are you HIPAA compliant?",
    answer: "Yes. Every RepHero professional undergoes comprehensive HIPAA training and testing before placement. Furthermore, RepHero executes a formal Business Associate Agreement (BAA) with every covered entity client before access is provisioned. Staff work through secure, client-managed remote environments with multi-factor authentication, and no protected health information (PHI) is ever stored locally.",
    category: "compliance",
  },
  {
    id: "faq-phi-notice",
    question: "Does this website collect or store any patient information?",
    answer: "No. RepHero never collects, stores, or processes protected health information (PHI) through this website or discovery call booking forms. All discovery and contact forms are strictly for business-to-business administrative inquiries.",
    category: "compliance",
  },

  // Process & Onboarding
  {
    id: "faq-getting-started",
    question: "How do we get started?",
    answer: "Getting started follows a simple 6-step process: (1) Book a 15-minute discovery call, (2) Receive a custom proposal, (3) Sign the agreement and BAA via DocuSign, (4) Interview and approve matched candidates, (5) Onboard and integrate into your workflows, and (6) Receive ongoing support with proactive reporting.",
    category: "process",
  },
  {
    id: "faq-candidate-selection",
    question: "Can we choose and interview who joins our team?",
    answer: "Yes, absolutely. In Step 4 (Matching), we present pre-screened candidates tailored to your clinic requirements. You review candidate profiles, video introductions, and conduct live video interviews. You have final approval over who joins your practice.",
    category: "process",
  },
  {
    id: "faq-ramp-up-time",
    question: "How soon can someone start?",
    answer: "Typically, matched professionals can begin onboarding within 7 to 14 business days following candidate approval and BAA execution, depending on the role complexity and your system provisioning schedule.",
    category: "process",
  },
  {
    id: "faq-mismatch-policy",
    question: "What if a team member isn't the right fit?",
    answer: "If a team member does not meet your expectations, your dedicated account manager will address the issue immediately. If necessary, we provide a replacement candidate at no additional recruiting charge to ensure your clinic workflow remains uninterrupted.",
    category: "process",
  },
];
