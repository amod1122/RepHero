import type { LegalPolicy } from './types';

export const PRIVACY_POLICY: LegalPolicy = {
  title: "Privacy Policy",
  lastUpdated: "November 23, 2026",
  introduction: "RepHero Global LLC (\"RepHero\", \"we\", \"us\", or \"our\") is committed to protecting your privacy and ensuring transparency regarding how we collect, use, and safeguard information collected through our website www.rephero.co.",
  sections: [
    {
      id: "scope-phi-notice",
      heading: "1. Scope and Protected Health Information (PHI) Notice",
      content: [
        "This Privacy Policy applies solely to information collected through our public marketing website (www.rephero.co), discovery call scheduling forms, and general business inquiries.",
        "IMPORTANT NOTICE: This website is not designed to collect, transmit, or store Protected Health Information (PHI) under the Health Insurance Portability and Accountability Act of 1996 (HIPAA). Please do not submit patient names, clinical records, or any patient-identifiable data through any form on this website.",
        "Healthcare staffing engagements between RepHero and covered entities are governed by separate, legally binding Business Associate Agreements (BAAs) executed outside this website.",
      ],
    },
    {
      id: "information-collected",
      heading: "2. Information We Collect",
      content: [
        "Business Contact Information: When you schedule a discovery call or submit an inquiry, we collect your name, work email address, telephone number (optional), practice name, practice specialty type, roles of interest, and message content.",
        "Technical and Usage Data: We collect standard non-identifying website analytics, including IP address, browser type, device information, referring URLs, and page interaction timestamps.",
        "Form Honeypot Data: We use automated anti-spam fields to protect our forms from malicious automated bot submissions.",
      ],
    },
    {
      id: "how-we-use-information",
      heading: "3. How We Use Your Information",
      content: [
        "To schedule and conduct your 15-minute discovery consultation.",
        "To prepare custom staffing proposals and pricing estimates requested by your practice.",
        "To send administrative booking confirmations and service updates.",
        "To analyze and improve website performance, usability, and visitor experience.",
        "We never sell, rent, or trade your personal or business contact information to third parties.",
      ],
    },
    {
      id: "third-party-providers",
      heading: "4. Third-Party Service Providers",
      content: [
        "We may engage trusted third-party service providers to support website operations, such as discovery call scheduling tools (e.g., Microsoft Bookings or Calendly), transactional email delivery services, and privacy-respecting analytics.",
        "These providers are bound by strict contractual confidentiality agreements and are permitted to process information solely to perform services on our behalf.",
      ],
    },
    {
      id: "data-security",
      heading: "5. Data Security",
      content: [
        "We implement technical and organizational measures to protect your submitted business information, including HTTPS encryption in transit, restricted administrative access, and secure hosting infrastructure.",
        "However, no electronic transmission over the internet can be guaranteed 100% secure.",
      ],
    },
    {
      id: "contact-rights",
      heading: "6. Your Rights and Contact Information",
      content: [
        "You may request access to, correction of, or deletion of your business contact information by contacting us at hello@rephero.co.",
        "RepHero Global LLC, 100 Pine Street, Suite 1250, San Francisco, CA 94111.",
      ],
    },
  ],
};

export const TERMS_OF_USE: LegalPolicy = {
  title: "Terms of Use",
  lastUpdated: "November 23, 2026",
  introduction: "Welcome to www.rephero.co. These Terms of Use (\"Terms\") govern your access to and use of the website operated by RepHero Global LLC (\"RepHero\", \"we\", \"us\", or \"our\"). By accessing or using this website, you agree to be bound by these Terms.",
  sections: [
    {
      id: "acceptance-of-terms",
      heading: "1. Acceptance of Terms",
      content: [
        "By accessing or using www.rephero.co, you represent that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.",
        "If you are accessing this website on behalf of a healthcare practice, medical group, or other organization, you represent that you have the authority to bind that entity.",
      ],
    },
    {
      id: "marketing-purpose",
      heading: "2. Informational and Marketing Purpose",
      content: [
        "This website is an informational marketing platform designed to introduce RepHero's remote staffing and administrative placement services to US healthcare practices.",
        "Information on this website does not constitute a formal binding service contract. Official staffing services, service level commitments, and pricing obligations are established solely through executed master services agreements and Business Associate Agreements (BAAs).",
      ],
    },
    {
      id: "calculator-disclaimer",
      heading: "3. Savings Calculator & Cost Estimates Disclaimer",
      content: [
        "The interactive Savings Calculator and published cost savings figures (including the 50-60% typical savings claim) are provided for illustrative and estimation purposes only.",
        "Actual practice savings, wage differentials, and productivity outcomes vary based on practice location, specialty, specific staffing requirements, and existing overhead structures. No savings results are guaranteed.",
      ],
    },
    {
      id: "prohibition-on-phi",
      heading: "4. Prohibition on Submitting Patient Information",
      content: [
        "You expressly agree NOT to upload, submit, or transmit any Protected Health Information (PHI), medical records, or patient-identifiable data through any public web forms or contact mechanisms on this website.",
        "RepHero disclaims any liability arising from unsolicited PHI submitted through public website channels.",
      ],
    },
    {
      id: "intellectual-property",
      heading: "5. Intellectual Property Rights",
      content: [
        "All content, logos, trademarks, text, graphics, and design assets on this website are the property of RepHero Global LLC or its licensors, protected under applicable intellectual property laws.",
        "Client logos and company names mentioned on this website are the property of their respective owners and used under license, permission, or pending authorization.",
      ],
    },
    {
      id: "liability-governing-law",
      heading: "6. Limitation of Liability & Governing Law",
      content: [
        "To the fullest extent permitted by law, RepHero Global LLC shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your access to or inability to use this website.",
        "These Terms are governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles.",
        "For inquiries regarding these Terms, contact hello@rephero.co.",
      ],
    },
  ],
};
