import type { HowItWorksStep } from './types';

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: 1,
    title: "Discovery Call",
    subtitle: "15-minute consultation",
    description: "We meet for a focused 15-minute consultation to understand your practice's specific workflows, current administrative bottlenecks, EHR systems, and staffing requirements.",
    details: [
      "Review current practice staffing pain points and volume needs",
      "Identify software tools and EHR/EMR platforms used (e.g., Epic, Athena, Dentrix, Kareo)",
      "Determine target start date, schedule coverage hours, and role specifications",
    ],
    deliverable: "Staffing scope assessment",
  },
  {
    step: 2,
    title: "Custom Proposal",
    subtitle: "Tailored staffing plan & flat pricing",
    description: "Within 24-48 hours of our call, you receive a tailored staffing plan detailing candidate profiles, exact scope of responsibilities, and transparent flat monthly pricing.",
    details: [
      "Detailed job descriptions tailored to your clinic protocols",
      "Transparent, flat monthly rate with no hidden charges or setup fees",
      "Expected cost savings analysis compared to local hiring",
    ],
    deliverable: "Written proposal and transparent fee schedule",
  },
  {
    step: 3,
    title: "BAA & Agreement via DocuSign",
    subtitle: "HIPAA compliance from day one",
    description: "We execute our standard service agreement along with a comprehensive Business Associate Agreement (BAA) via DocuSign to ensure full HIPAA compliance before any work begins.",
    details: [
      "Mutually executed Business Associate Agreement (BAA) covering all federal privacy rules",
      "Clear service level expectations and flexible terms without burdensome lock-ins",
      "100% digital, secure DocuSign execution within minutes",
    ],
    deliverable: "Signed BAA and Service Agreement",
  },
  {
    step: 4,
    title: "Matching & Candidate Approval",
    subtitle: "You choose who joins your team",
    description: "We present pre-vetted, HIPAA-trained healthcare professionals matched to your specialty. You review video introductions, interview candidates, and give final approval.",
    details: [
      "Thorough vetting: healthcare experience, English proficiency, and background checks",
      "Review recorded introductions, resumes, and skill assessments",
      "Conduct video interviews and select the exact team member you want",
    ],
    deliverable: "Client-approved dedicated professional",
  },
  {
    step: 5,
    title: "Onboarding & Workflow Integration",
    subtitle: "Seamless integration into your systems",
    description: "We assist with secure EHR provisioning, telephone system routing, and clinic workflow orientation. Your dedicated professional begins working directly inside your systems.",
    details: [
      "Secure workstation setup with VPN/remote desktop and two-factor authentication",
      "EHR role-based access assignment and clinic communication setup (Slack, Teams, VoIP)",
      "Structured standard operating procedure (SOP) walkthrough and workflow shadowing",
    ],
    deliverable: "Fully integrated remote team member",
  },
  {
    step: 6,
    title: "Ongoing Support & Proactive Reporting",
    subtitle: "You never have to chase an update",
    description: "Your dedicated account manager provides ongoing performance oversight, daily check-ins, and proactive weekly productivity reports. We ensure consistent excellence.",
    details: [
      "Proactive communication with regular check-ins and productivity tracking",
      "Dedicated account manager handling administrative, HR, and performance needs",
      "Seamless coverage planning and hassle-free replacement guarantee if fit isn't perfect",
    ],
    deliverable: "Weekly productivity reports and continuous account management",
  },
];

export const HOW_IT_WORKS_HEADER = {
  eyebrow: "Engagement & Onboarding Process",
  heading: "How It Works",
  description: "From your initial 15-minute discovery consultation to candidate matching, signed BAA, and ongoing proactive support.",
};

export const WHAT_TO_EXPECT = {
  eyebrow: "Expectations & Timelines",
  heading: "What to Expect",
  timeToStart: "Typical placement begins within 7 to 14 business days following candidate approval and DocuSign BAA execution.",
  points: [
    "Typical start time of 7-14 business days from candidate approval",
    "Zero disruption to your daily patient schedule during transition",
    "Candidate video interviews and final approval always remain in your hands",
    "No long-term lock-in: agreements operate with a standard 30-day notice period",
    "Comprehensive HIPAA BAA coverage executed prior to any system access",
  ],
};

export const COMMUNICATION_REPORTING = {
  eyebrow: "Proactive Account Management",
  heading: "Communication & Reporting",
  description: "We believe healthcare practices shouldn't spend time managing remote team administration. Your dedicated RepHero account manager guarantees proactive oversight.",
  channels: [
    { title: "Daily Integration", desc: "Direct communication via your preferred channels: Slack, Microsoft Teams, email, or VoIP." },
    { title: "Weekly Productivity Dashboards", desc: "Detailed weekly reports summarizing call volumes, tasks completed, and billing milestones." },
    { title: "Proactive Check-Ins", desc: "Regular touchpoints so you never have to chase an update or wondering about project status." },
  ],
};

