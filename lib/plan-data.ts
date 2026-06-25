// ─────────────────────────────────────────────────────────────
// EIB GROUP — 90-Day Strategic Plan (Q3 2026: July–September)
// Office of the Group Head, Training & Organizational Development
//
// Single source of truth for the overview, roadmap, ROI dashboard,
// and the consolidated subsidiary input (Task Force submissions).
// The 90-day plan is the deliverable; the subsidiary submissions are
// the real operational input that validates it.
// ─────────────────────────────────────────────────────────────

export const planMeta = {
  office: "Office of the Group Head, Training & Organizational Development",
  group: "EIB GROUP",
  title: "90-Day Strategic Plan",
  tagline:
    "Driving organizational capability, performance improvement & measurable business impact",
  period: "Q3 2026",
  window: "July – September 2026",
  horizonDays: 90,
  preparedFor: "Executive Management",
  contactEmail: "michael.marquis@eibgroup.com",
  positioning:
    "This is not a training calendar — it is a business performance architecture. Every initiative ties directly to operational efficiency, workforce effectiveness, and measurable ROI.",
}

export const strategicGoal =
  "To improve organizational performance, workforce effectiveness, and business productivity through capability development, performance monitoring, and culture reinforcement."

export const objectives = [
  "Identify and close critical knowledge and performance gaps.",
  "Improve staff productivity and operational readiness.",
  "Strengthen internal talent management processes.",
  "Support revenue growth through enhanced workforce effectiveness.",
  "Establish sustainable, measurable performance-improvement systems.",
]

export type Phase = "Diagnosis & Baseline" | "Intervention & System Building" | "Performance Optimization"

export type Initiative = {
  n: number
  title: string
  actions: string
  deliverable: string
  impact: string
  // Real subsidiary evidence that this initiative is grounded in.
  evidence?: string[]
}

export type MonthPlan = {
  month: number
  label: string
  window: string
  phase: Phase
  focus: string
  initiatives: Initiative[]
}

export const roadmap: MonthPlan[] = [
  {
    month: 1,
    label: "Month 1",
    window: "July 2026",
    phase: "Diagnosis & Baseline",
    focus: "Understand where the organization is losing value.",
    initiatives: [
      {
        n: 1,
        title: "Organization-Wide Training Needs Assessment (TNA)",
        actions:
          "Meet with departmental heads, consolidate skill gaps, recurring operational challenges, and competency deficiencies affecting performance across all subsidiaries.",
        deliverable: "Group Training Needs Assessment Report",
        impact: "Ensures training investment targets actual business problems.",
        evidence: [
          "5 subsidiaries have already submitted detailed input; 3 remain outstanding and must be closed out in Month 1.",
          "Confirmed gaps include report writing & MS Word (EIB Stratoc), vehicle diagnostics/EV & HSE (Air Friction), avionics, QA & MRO documentation (Briech UAS).",
        ],
      },
      {
        n: 2,
        title: "Staff Competency Mapping",
        actions:
          "Categorize staff by role and competency level; identify high performers, average performers, and development needs across subsidiaries.",
        deliverable: "Competency Matrix",
        impact: "Improves workforce deployment and succession planning.",
        evidence: [
          "Briech UAS flagged single-point-of-failure risk — competency mapping directly informs the proposed cross-training rotation.",
        ],
      },
      {
        n: 3,
        title: "Performance Bottleneck Review",
        actions:
          "Identify recurring issues: operational delays, equipment failures, communication gaps, and resource constraints raised by subsidiaries.",
        deliverable: "Internal Performance Improvement Report",
        impact: "Surfaces the sources of inefficiency that erode ROI.",
        evidence: [
          "Power supply during production (Poctova), spare-parts delay & vendor debt (Air Friction), ageing surveillance equipment & drone batteries (EIB Stratoc), under-utilised production lines (Briech UAS).",
        ],
      },
    ],
  },
  {
    month: 2,
    label: "Month 2",
    window: "August 2026",
    phase: "Intervention & System Building",
    focus: "Implement targeted solutions.",
    initiatives: [
      {
        n: 4,
        title: "Launch Capability Improvement Program",
        actions:
          "Deliver targeted training from Month 1 findings: report writing, technical diagnostics, UAV mission readiness, HSE, customer service, leadership, and operational excellence.",
        deliverable: "Monthly Learning Sessions",
        impact: "Improves service quality and employee productivity.",
        evidence: [
          "Advanced MS Word + intelligence report-writing workshops (EIB Stratoc).",
          "Advanced diagnostics, EV/new-energy and HSE training (Air Friction).",
          "Pre-deployment UAV mission training, avionics configuration & QA (Briech UAS).",
        ],
      },
      {
        n: 5,
        title: "Staff Evaluation Framework",
        actions:
          "Develop standardized competency, behavioral, and readiness assessments for transfers, promotions, and development plans.",
        deliverable: "Staff Evaluation Framework",
        impact: "Better talent decisions and reduced performance risk.",
      },
      {
        n: 6,
        title: "Internal Knowledge-Sharing Platform",
        actions:
          "Establish monthly best-practice sessions, structured cross-training rotation, and mentorship pairing of junior and senior technicians.",
        deliverable: "Knowledge Transfer Program",
        impact: "Reduces knowledge silos and increases operational consistency.",
        evidence: [
          "Directly answers Briech UAS request for cross-training rotation and senior–junior mentorship to remove single-point-of-failure dependency.",
        ],
      },
    ],
  },
  {
    month: 3,
    label: "Month 3",
    window: "September 2026",
    phase: "Performance Optimization",
    focus: "Institutionalize performance improvement.",
    initiatives: [
      {
        n: 7,
        title: "Operationalize the Performance Improvement Task Force",
        actions:
          "Run the standing cross-functional Task Force (one representative per subsidiary) to address recurring challenges and deliver monthly recommendations.",
        deliverable: "Monthly Improvement Recommendations",
        impact: "Faster problem-solving and stronger cross-functional collaboration.",
        evidence: [
          "Task Force already constituted with representatives nominated by subsidiary managers; kick-off completed and first submissions received.",
        ],
      },
      {
        n: 8,
        title: "Culture & Accountability Reinforcement",
        actions:
          "Define expected workplace behaviors, reinforce accountability standards, and drive full reporting compliance from outstanding subsidiaries.",
        deliverable: "Culture Reinforcement Framework",
        impact: "Improved employee engagement and accountability.",
        evidence: [
          "Targets the subsidiaries still outstanding on submission so that 100% input is achieved before Q4 planning.",
        ],
      },
      {
        n: 9,
        title: "Training ROI Dashboard",
        actions:
          "Track participation, competency, service quality, error rates, and staff readiness against established baselines.",
        deliverable: "Monthly Executive Dashboard",
        impact: "Demonstrates measurable value from every intervention.",
      },
    ],
  },
]

export type Kpi = {
  kpi: string
  baseline: string
  target: string
  // direction of the desired change, for display
  direction: "up" | "down"
}

export const kpis: Kpi[] = [
  { kpi: "Training Participation", baseline: "Establish", target: "+20%", direction: "up" },
  { kpi: "Competency Scores", baseline: "Establish", target: "+15%", direction: "up" },
  { kpi: "Internal Service Quality Ratings", baseline: "Establish", target: "+10%", direction: "up" },
  { kpi: "Operational Error Rates", baseline: "Establish", target: "-10%", direction: "down" },
  { kpi: "Staff Readiness Scores", baseline: "Establish", target: "+15%", direction: "up" },
]

export const outcomes = {
  organizational: [
    "Clear visibility of workforce capability gaps.",
    "Standardized staff assessment process.",
    "Stronger culture of accountability.",
  ],
  operational: [
    "Improved staff effectiveness.",
    "Reduced performance bottlenecks.",
    "Better cross-functional collaboration.",
  ],
  financial: [
    "Reduced operational inefficiencies.",
    "Improved customer experience.",
    "Better utilization of human capital.",
    "Increased productivity per employee.",
  ],
}

export const executiveSummary =
  "Over the next 90 days, the Training Function will transition from a reactive training unit to a strategic organizational-development function. The focus is on identifying capability gaps, improving workforce productivity, strengthening talent-evaluation processes, and establishing measurable systems that contribute directly to operational efficiency, customer satisfaction, and organizational growth. This plan is validated against real operational needs gathered from subsidiary representatives through the Performance Improvement Task Force."

// ── Consolidated Task Force input (real submissions) ───────────
export const taskForce = {
  title: "Performance Improvement Task Force",
  owner: "Office of the Group Head, Training & Organizational Development",
  contactEmail: "michael.marquis@eibgroup.com",
  deadline: "Thursday, 25 June 2026, 08:00",
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

// ── Derived analytics for the ROI dashboard ────────────────────
export const submissionStats = {
  total: submissions.length,
  submitted: submissions.filter((s) => s.state === "Submitted").length,
  noChallenges: submissions.filter((s) => s.state === "No challenges").length,
  awaiting: submissions.filter((s) => s.state === "Awaiting").length,
}

// Recurring challenge themes consolidated across all submissions.
export const challengeThemes = [
  { theme: "Equipment & Infrastructure", count: 4 },
  { theme: "Staffing & Workforce Capacity", count: 4 },
  { theme: "Technical Skills & Training", count: 4 },
  { theme: "Supply Chain & Procurement", count: 2 },
  { theme: "Welfare & Working Conditions", count: 2 },
  { theme: "Business Development", count: 1 },
]
