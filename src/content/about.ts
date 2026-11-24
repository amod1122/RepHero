export interface ValueItem {
  id: string;
  title: string;
  description: string;
}

export interface WorkPillar {
  id: string;
  title: string;
  description: string;
}

export const ABOUT_HEADER = {
  eyebrow: "About RepHero Global",
  heading: "Operational Excellence for Healthcare Practices",
  description: "RepHero Global LLC provides trained, HIPAA-compliant remote professionals dedicated to relieving administrative burden for medical and dental practices nationwide.",
};

export const ABOUT_MISSION = {
  eyebrow: "Our Story & Mission",
  heading: "Our Story & Mission",
  lead: "RepHero was founded to solve a pervasive crisis in US healthcare: provider burnout driven by escalating administrative and staffing overhead.",
  storyParagraphs: [
    "Healthcare providers enter medicine to treat patients, yet practice owners and clinical teams spend hours every day managing administrative burdens, telephone bottlenecks, insurance verification, and complex billing.",
    "RepHero places trained, HIPAA-compliant team members into your practice, so your providers can focus on patients and your admin work gets done.",
    "By combining rigorous healthcare training, proactive account management, and airtight HIPAA compliance, RepHero empowers practices to operate smoothly, reduce overhead by 50-60%, and elevate patient care.",
  ],
};

export const HOW_WE_WORK_PILLARS: WorkPillar[] = [
  {
    id: "hipaa-compliance",
    title: "HIPAA Training & Signed BAA",
    description: "Every remote professional undergoes comprehensive HIPAA training and testing before placement. RepHero executes a formal Business Associate Agreement on every engagement.",
  },
  {
    id: "proactive-communication",
    title: "Proactive Communication",
    description: "Your dedicated account manager provides daily check-ins, transparent weekly productivity metrics, and rapid issue resolution. You never have to chase an update.",
  },
  {
    id: "seamless-extension",
    title: "True Extension of Your Team",
    description: "Our remote professionals work directly inside your EHR/EMR, phone system, and clinic communication channels, seamlessly aligning with your practice workflows.",
  },
];

export const CORE_VALUES: ValueItem[] = [
  {
    id: "clinical-integrity",
    title: "Clinical & Administrative Integrity",
    description: "We treat every patient interaction and administrative task with the precision, confidentiality, and care required in modern healthcare.",
  },
  {
    id: "transparent-partnership",
    title: "Transparent Partnership",
    description: "Flat monthly pricing with zero hidden fees, flexible 30-day notice terms, and honest expectation setting at every step.",
  },
  {
    id: "operational-excellence",
    title: "Operational Excellence",
    description: "Continuous quality oversight, structured onboarding SOPs, and dedicated management ensuring consistent high performance.",
  },
  {
    id: "security-first",
    title: "Security & Compliance First",
    description: "Strict multi-factor authentication, secure remote desktop environments, and zero local PHI storage on public systems.",
  },
];

export const LEADERSHIP_INFO = {
  eyebrow: "Leadership & Governance",
  heading: "Leadership & Global Operations",
  description: "RepHero Global LLC is led by experienced healthcare operations, staffing, and revenue cycle professionals dedicated to delivering reliable, compliant staffing extensions to US medical and dental practices.",
  operatingModel: "Our centralized operational management team oversees rigorous candidate vetting, continuous HIPAA compliance auditing, and dedicated client success management.",
};
