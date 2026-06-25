// ─────────────────────────────────────────────────────────────
// EIB GROUP — Q2 2026 Performance Evaluation + Task Force data
// Single source of truth for the dashboard, report, and tracker.
// ─────────────────────────────────────────────────────────────

export const reportMeta = {
  org: "EIB STRATOC",
  group: "EIB GROUP",
  title: "Quarterly Performance Evaluation Report",
  period: "Q2 2026",
  date: "09 June 2026",
  to: "Executive Vice President",
  toEmail: "evp@eibstratoc.com",
  from: "Group Head, Training & Organizational Development",
  classification: "CONFIDENTIAL",
  pages: 14,
}

export type ComplianceStatus =
  | "High-performing"
  | "Satisfactory"
  | "Partial engagement"
  | "Non-compliant"

export const statusMeta: Record<
  ComplianceStatus,
  { label: string; chart: string; token: string; symbol: string }
> = {
  "High-performing": { label: "High-performing", chart: "var(--chart-1)", token: "chart-1", symbol: "▲" },
  Satisfactory: { label: "Satisfactory", chart: "var(--chart-2)", token: "chart-2", symbol: "●" },
  "Partial engagement": { label: "Partial engagement", chart: "var(--chart-3)", token: "chart-3", symbol: "◐" },
  "Non-compliant": { label: "Non-compliant", chart: "var(--chart-4)", token: "chart-4", symbol: "✕" },
}

export type Subsidiary = {
  id: number
  name: string
  sector: string
  activity: string
  submitted: "Yes" | "Partial" | "No"
  status: ComplianceStatus
}

export const subsidiaries: Subsidiary[] = [
  {
    id: 1,
    name: "Briech UAS",
    sector: "Drone Manufacturing",
    activity:
      "FPV Drone Training for Nigerian Army (16 personnel); Advanced UAV Training at Kuje Facility; Custom FPV Training Portal developed and deployed.",
    submitted: "Yes",
    status: "High-performing",
  },
  {
    id: 2,
    name: "EIB Stratoc",
    sector: "Strategic Technology",
    activity:
      "Comprehensive PSAP & STRATOC training modules; GIS/QGIS mapping, Power BI dashboard training, Intelligence Reporting, HSE health talks, Field Orientation; trained posted Luft personnel.",
    submitted: "Yes",
    status: "High-performing",
  },
  {
    id: 3,
    name: "BLACK",
    sector: "Intelligence & Operations",
    activity:
      "Extensive training & HR support provided (see Cross-Functional section). Daily HR supervision by HR Assistant (Geraldine).",
    submitted: "Yes",
    status: "Satisfactory",
  },
  {
    id: 4,
    name: "Giga Forensics",
    sector: "Digital Forensics & Cybersecurity",
    activity:
      "Active training venue for GIS/QGIS sessions, Shiroro mapping exercises, Power BI training. Training Supervisor stationed here.",
    submitted: "Yes",
    status: "Satisfactory",
  },
  {
    id: 5,
    name: "Air (Pay TV)",
    sector: "Entertainment",
    activity:
      "Personnel posted to EIB Stratoc for training; Training Supervisor conducted follow-up assessment. Did not independently submit training needs.",
    submitted: "Partial",
    status: "Partial engagement",
  },
  {
    id: 6,
    name: "Honorable (Poctova)",
    sector: "Military Clothing & Textiles",
    activity:
      "BLACK staff directed to Poctova office for Argus Review/Lecture session. Poctova Manager engaged on procurement matters. No formal submission.",
    submitted: "Partial",
    status: "Partial engagement",
  },
  {
    id: 7,
    name: "Glint Technologies",
    sector: "Software Development",
    activity:
      "Subsidiary intentionally maintains a back-burner operational profile. No training needs submitted.",
    submitted: "No",
    status: "Non-compliant",
  },
  {
    id: 8,
    name: "Briech Atlantic",
    sector: "Construction & Infrastructure",
    activity: "No training conducted. Did not submit training needs despite formal request.",
    submitted: "No",
    status: "Non-compliant",
  },
  {
    id: 9,
    name: "Air Friction Automobiles",
    sector: "Automotive",
    activity: "No training conducted. Did not submit training needs despite formal request.",
    submitted: "No",
    status: "Non-compliant",
  },
  {
    id: 10,
    name: "Bright Echefu Foundation",
    sector: "Charity & NGO",
    activity: "No training conducted. Did not submit training needs despite formal request.",
    submitted: "No",
    status: "Non-compliant",
  },
  {
    id: 11,
    name: "Bright FM (98.7 FM)",
    sector: "Radio & Media",
    activity: "No training conducted. Did not submit training needs despite formal request.",
    submitted: "No",
    status: "Non-compliant",
  },
]

export const complianceSummary = {
  total: 11,
  active: 4,
  partial: 2,
  nonResponsive: 5,
  activeRate: 36,
  inclusiveRate: 55,
  activeNames: ["Briech UAS", "EIB Stratoc", "BLACK", "Giga Forensics"],
  partialNames: ["Air (Pay TV)", "Honorable (Poctova)"],
  nonResponsiveNames: [
    "Glint Technologies",
    "Briech Atlantic",
    "Air Friction Automobiles",
    "Bright Echefu Foundation",
    "Bright FM",
  ],
}

export const statusBreakdown = [
  { status: "High-performing" as ComplianceStatus, count: 2 },
  { status: "Satisfactory" as ComplianceStatus, count: 2 },
  { status: "Partial engagement" as ComplianceStatus, count: 2 },
  { status: "Non-compliant" as ComplianceStatus, count: 5 },
]

export const monthlyTrends = [
  {
    month: "March 2026",
    short: "Mar",
    impact: "High",
    score: 9,
    activities: 4,
    key: 'FPV Drone Training (Army, 16 trainees); Executive Leadership Training ("The Oranges") for all Group & Subsidiary Managers; Giga Forensics sessions; FPV Training Portal deployed.',
  },
  {
    month: "April 2026",
    short: "Apr",
    impact: "Moderate",
    score: 6,
    activities: 3,
    key: "Multi-state deployment framework established (Zamfara, Shiroro, Niger, Kebbi, Plateau); Shiroro Camp strategic planning; continued PSAP/STRATOC modules; Luft personnel posted to EIB Stratoc.",
  },
  {
    month: "May 2026",
    short: "May",
    impact: "High",
    score: 9,
    activities: 5,
    key: "Advanced UAV Training at Kuje Facility; GIS/QGIS, Power BI dashboard, and Sentinel imagery training at Giga Forensics; HSE health talks; Poctova Argus Review session; Shiroro deployment debriefs.",
  },
]

export const interventions = [
  {
    area: "Non-compliance by 5 subsidiaries",
    details:
      "Formal training needs requests were sent to all 11 subsidiary managers. 5 failed to submit any training needs or gap analysis. Extensive Lumethis-generated curricula were prepared but could not be deployed due to lack of response.",
    action:
      "EVP intervention recommended. Subsidiary Managers should be directed to submit outstanding training needs within 14 days to enable Q3 rollout of prepared curricula.",
  },
  {
    area: "Shiroro Camp deployment",
    details: "3-week delay requested for perimeter defense setup.",
    action: "Approved — resolution expected post-Q2.",
  },
  {
    area: "Software development capacity",
    details:
      "Custom software tools developed by Group Head Training on personal initiative to enhance operational efficiency. No dedicated development resource allocated.",
    action: "Consider formalizing development support or allocating resources.",
  },
]

export const softwareTools = [
  { name: "Performance Intelligence System (PIS)", desc: "Enterprise performance tracking platform to replace manual reporting.", status: "Under development" },
  { name: "EventSecOps Platform", desc: "Event security operations management system.", status: "Deployed" },
  { name: "FPV Training Portal", desc: "Custom web application for drone training curriculum.", status: "Deployed" },
  { name: "Lumethis", desc: "Organizational workflow optimization and automated curriculum generator.", status: "Deployed" },
  { name: "APC Event Badge System", desc: "Automated event badge/credential management system.", status: "Deployed" },
  { name: "Document Intelligence Reporter", desc: "Software-driven anti-fraud field reporting system.", status: "Deployed" },
  { name: "Staff Schedule Manager", desc: "Automated staff scheduling and roster management system.", status: "Deployed" },
  { name: "EIB Group Report Synthesizer", desc: "Automated reporting and document generation tool.", status: "Deployed" },
]

export const partnerships = [
  { partner: "Nigerian Army (1 & 8 Divisions)", nature: "FPV Drone Training delivery for military personnel.", status: "Completed (March 2026)" },
  { partner: "Nigerian Air Force", nature: "Shiroro Camp operational support and logistics alignment.", status: "In progress" },
]

export const opportunities = [
  { name: "Software commercialization (SaaS)", detail: "Custom-built tools (EventSecOps, Report Synthesizer, Document Intelligence Reporter, Staff Schedule Manager, Lumethis) can be packaged and licensed to other security/defense agencies.", value: "High" },
  { name: "Expanded military training contracts", detail: "Proven track record with Nigerian Army FPV training opens doors to additional military/para-military contracts.", value: "High" },
  { name: "Remote industrial camp security", detail: "Strategic pivot toward securing mining and infrastructure camps in high-risk zones (Zamfara, Shiroro, Niger, Kebbi, Plateau).", value: "High" },
]

export const swot = {
  strengths: [
    "Unique blend of Group Training expertise, HR management, and software engineering — enabling custom operational tools and automated curriculum generation (Lumethis).",
    "High-performing products: FPV Drone Training curriculum (proven with Nigerian Army), 8 custom-built applications, Executive Leadership Training program.",
    "Strong cross-functional team incl. Training Supervisor (Antah Benedict, GIS Analyst) and HR Assistant (Unande S. Geraldine) capable of multi-site operations.",
    "Loyal partners: Nigerian Army (1 & 8 Divisions) and Nigerian Air Force (Shiroro operations).",
  ],
  weaknesses: [
    "Custom software tools developed entirely on personal initiative with no formal organizational support or dedicated development resources.",
    "Staffing strain: Training Supervisor doubles as GIS Analyst; HR Assistant manages daily operations alongside HR duties.",
    "45% of subsidiary managers fully non-compliant on training needs submission — pre-generated curricula cannot be deployed.",
  ],
  opportunities: [
    "Expanded military/para-military training contracts; expansion into 5 currently unserved subsidiaries once EVP enforces compliance.",
    "Custom software tools can be formalized and commercialized as standalone SaaS products.",
    "Deeper engagement with Nigerian Armed Forces; partnerships with mining/infrastructure firms for camp security training.",
  ],
  threats: [
    "External security training providers and off-the-shelf administrative software vendors.",
    "Inflationary pressures on training logistics (accommodation, transport, stipends).",
    "Evolving defense sector regulations may impact training delivery.",
    "Physical risks in high-threat zones; subsidiary non-engagement; burnout risk from managing multiple portfolios without support.",
  ],
}

export const summaryRatings = [
  { area: "Training subsidiary performance (engaged)", rating: "Exceeded expectations", tone: "good" },
  { area: "Strategic growth initiatives", rating: "On track", tone: "good" },
  { area: "Human capital development", rating: "Achieved (limited by 45% non-compliance)", tone: "warn" },
  { area: "Financial oversight", rating: "Satisfactory", tone: "good" },
  { area: "Risk and compliance", rating: "Effective (risk from 5 non-responsive subsidiaries)", tone: "warn" },
  { area: "Management action execution", rating: "Strong (curricula prepared, pending engagement)", tone: "good" },
  { area: "Cross-functional support (BLACK HR)", rating: "Exceptional contribution", tone: "good" },
  { area: "Software development (personal initiative)", rating: "Exceptional — 8 custom applications deployed", tone: "good" },
] as const

export const implementationStatus = [
  { directive: "Software tools deployment", complete: 85, eta: "Q3 2026 (PIS finalization remaining)" },
  { directive: "Training needs collection (all subsidiaries)", complete: 55, eta: "Requires EVP escalation for remaining 5" },
  { directive: "Training curriculum delivery (Q2)", complete: 100, eta: "Completed" },
]

export const q3TrainingNeeds = [
  { need: "Deployment of Lumethis Curricula", priority: "High", target: "Group-wide" },
  { need: "Advanced cybersecurity awareness", priority: "High", target: "Group-wide" },
  { need: "Outstanding training needs", priority: "High", target: "Glint, Briech Atlantic, Air Friction, BEF, Bright FM" },
]

// ── 90-day Performance Improvement Task Force ──────────────────
export const taskForce = {
  title: "Performance Improvement Task Force",
  owner: "Office of the Group Head, Training & Organizational Development",
  contactEmail: "michael.marquis@eibgroup.com",
  deadline: "Thursday, 25 June 2026, 08:00",
  horizonDays: 90,
  mandate:
    "Identify recurring operational challenges, drive cross-functional collaboration, and deliver actionable recommendations that directly impact organizational performance and ROI.",
  requested: [
    "Top 3 operational challenges currently affecting your subsidiary/department.",
    "Critical skill gaps impacting staff productivity.",
    "Proposed training or intervention priorities.",
    "Estimated resource requirements (budget, materials, external support).",
  ],
}

export type SubmissionState = "Submitted" | "Awaiting" | "No challenges"

export type Submission = {
  subsidiary: string
  representative: string
  department?: string
  state: SubmissionState
  challenges: string[]
  skillGaps?: string[]
  priorities?: string[]
  resources?: string[]
  note?: string
}

export const submissions: Submission[] = [
  {
    subsidiary: "Briech Atlantic Ltd",
    representative: "Kenneth Mbadugha (General Manager)",
    state: "Submitted",
    challenges: [
      "Limited Business Development & revenue generation capacity — insufficient marketing resources, limited market penetration, inadequate mobility for BD personnel.",
      "Insufficient technical & operational resources — inadequate tools, equipment, and technology infrastructure for design, engineering, and project delivery.",
      "Workforce capacity & organizational structure gaps — manpower insufficient to support projected growth across construction, real estate, marketing, and finishing.",
    ],
    priorities: [
      "Recruit & strengthen the BD and Estate Construction marketing team; provide dedicated vehicles.",
      "Procure high-performance workstations and design software; upgrade project management/reporting systems.",
      "Recruit Quantity Surveyor and supporting personnel; implement staff training and performance management.",
    ],
    resources: [
      "Dedicated vehicles for marketing and project sourcing.",
      "Design workstations, software, and site supervision resources.",
      "Additional headcount and succession/talent retention strategies.",
    ],
  },
  {
    subsidiary: "Honorable (Poctova)",
    representative: "Miss Princess",
    state: "Submitted",
    challenges: [
      "Power supply issues during production.",
      "Insufficient tailoring staff to meet production targets — limiting rest days and pressuring production time limits.",
      "Delay and shortage of accessories for production.",
    ],
    priorities: [
      "Recommend off-days/shifts for all staff; timely availability of accessories.",
      "Salary increment; central printer/photocopier; water dispensers per floor.",
      "Suggestion boxes, AC servicing, facility fumigation, and a shared microwave.",
    ],
    resources: [
      "Backup power for production floors.",
      "Additional tailoring staff and reliable accessory supply.",
      "Facility welfare provisions (water, AC servicing, fumigation).",
    ],
  },
  {
    subsidiary: "Briech UAS",
    representative: "Briech UAS Chapter",
    department: "UAV Mission Operations",
    state: "Submitted",
    challenges: [
      "Cross-functional challenges in external UAV (ISR + FPV kamikaze) missions — mission variability, cyber threats, regulatory compliance, system reliability, logistics, and adversarial interference.",
      "Limited production volume — assembly lines available but underutilised.",
      "Personnel skill continuity — infrequent production cycles reduce operator proficiency and increase assembly error risk.",
    ],
    skillGaps: [
      "Hands-on assembly & integration proficiency (wiring harness routing, airframe integration).",
      "Avionics & flight controller configuration (FMS calibration, ESC tuning, sensor integration).",
      "Quality assurance & inspection protocols; technical documentation & MRO record-keeping.",
    ],
    priorities: [
      "Pre-deployment training programmes for UAV teams operating under contractual/adversarial pressure.",
      "Structured practical drills and in-house technical workshops during idle periods.",
      "QA & documentation training; cross-training rotation; mentorship & knowledge transfer.",
    ],
    resources: ["To be comprehensively reviewed by all managers involved, then communicated."],
  },
  {
    subsidiary: "EIB Stratoc Ltd",
    representative: "Nnaji Grace Amarachi",
    department: "Fusion Centre / Surveillance Operations",
    state: "Submitted",
    challenges: [
      "Inconsistent technical infrastructure — variability in AV/transmission equipment disrupts real-time drone feed connectivity to the Fusion Centre.",
      "Ageing and insufficient equipment inventory — degraded surveillance assets (incl. drone batteries) reduce operational endurance.",
      "Excessive supervisory workload — camp supervisors juggle operational, monitoring, communication, and reporting duties.",
    ],
    skillGaps: [
      "Advanced MS Word for professional documentation and structured reporting.",
      "Technical/intelligence report writing for clarity and faster turnaround.",
      "Time management & workload prioritisation.",
    ],
    priorities: [
      "Advanced MS Word + report template standardization training.",
      "Intelligence analysis and structured report-writing workshops.",
      "Time management & productivity training; periodic drone ops/live-feed troubleshooting.",
    ],
    resources: [
      "Upgrade/standardise AV/transmission infrastructure across sites.",
      "Replacement drone batteries and surveillance spares; analyst peripherals.",
      "Budget for training programs; preventive maintenance; workload review.",
    ],
  },
  {
    subsidiary: "Air Friction Automobiles",
    representative: "Workshop Management",
    department: "Workshop / Body Shop",
    state: "Submitted",
    challenges: [
      "Lack of adequate technical training for workshop personnel.",
      "Delays in supply and availability of spare parts; insufficient workshop/body shop space.",
      "High vendor debt delaying response time and spare parts delivery.",
    ],
    skillGaps: [
      "Advanced vehicle diagnostic and fault-finding skills.",
      "Modern mechanical repair techniques; electric/new-energy vehicle training.",
      "HSE awareness and compliance practices.",
    ],
    priorities: [
      "Advanced diagnostic & mechanical training; electric cars training.",
      "Regular technical workshops on new vehicle technologies; improved spare parts planning.",
      "HSE training and customer care / service advisor training.",
    ],
    resources: [
      "External technical support and trainers required.",
      "Budget for external technical and HSE training programs.",
    ],
  },
  {
    subsidiary: "Giga Forensics",
    representative: "General Manager",
    state: "No challenges",
    challenges: [],
    note: "GM reported no operational challenges at this time.",
  },
  {
    subsidiary: "Bright FM (98.7 FM)",
    representative: "—",
    state: "Awaiting",
    challenges: [],
    note: "Submission outstanding — nothing received yet.",
  },
  {
    subsidiary: "Bright Echefu Foundation",
    representative: "—",
    state: "Awaiting",
    challenges: [],
    note: "Indicated submission will follow; space reserved for their input.",
  },
]
