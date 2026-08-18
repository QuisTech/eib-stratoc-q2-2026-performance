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
          "7 subsidiaries have submitted detailed input; BLACK is being handled as a separate phase and Luft (Pay TV) has no representative assigned.",
          "Confirmed gaps include report writing & MS Word (EIB Stratoc), vehicle diagnostics/EV & HSE (Luftreiber Automobile), avionics/QA/MRO (Briech UAS), project management/M&E/finance (BEF), and presentation/content/marketing (Bright FM).",
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
          "Power supply during production (Poctova), spare-parts delay & vendor debt (Luftreiber Automobile), ageing surveillance equipment & drone batteries (EIB Stratoc), under-utilised production lines (Briech UAS).",
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
          "Advanced diagnostics, EV/new-energy and HSE training (Luftreiber Automobile).",
          "Pre-deployment UAV mission training, avionics configuration & QA (Briech UAS).",
          "Project management, M&E, financial management & leadership training with costed budget (BEF).",
          "Presentation/storytelling, content production, digital engagement & sponsorship-sales training (Bright FM).",
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

export type SubmissionState =
  | "Submitted"
  | "Pending"
  | "No response"
  | "No challenges"
  | "Redacted"
  | "Not applicable"
  | "Morphed"

export type DetailLevel =
  | "Comprehensive"
  | "Structured"
  | "Basic"
  | "No issues"
  | "Pending"
  | "No response"
  | "—"

export type Submission = {
  subsidiary: string
  representative: string
  department?: string
  state: SubmissionState
  detail: DetailLevel
  challenges: string[]
  skillGaps?: string[]
  priorities?: string[]
  resources?: string[]
  note?: string
  // Submitted budget estimates (e.g. BEF), shown as a small costed table.
  budget?: { area: string; cost: string }[]
  // For umbrella entities (e.g. BLACK) that contain their own representatives.
  subReps?: { name: string; unit: string }[]
}

export const submissions: Submission[] = [
  {
    subsidiary: "Briech Atlantic Ltd",
    representative: "Kenneth Mbadugha (General Manager)",
    state: "Submitted",
    detail: "Comprehensive",
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
    subsidiary: "POCTOVA",
    representative: "Miss Princess",
    state: "Submitted",
    detail: "Basic",
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
    representative: "Francis Echefu",
    department: "UAV Mission Operations",
    state: "Submitted",
    detail: "Comprehensive",
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
    representative: "Grace Nnaji (Nnaji Grace Amarachi)",
    department: "Fusion Centre / Surveillance Operations",
    state: "Submitted",
    detail: "Comprehensive",
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
    subsidiary: "Luftreiber Automobile",
    representative: "Marie Pearl",
    department: "Workshop / Body Shop",
    state: "Submitted",
    detail: "Basic",
    challenges: [
      "Lack of adequate technical training for workshop personnel.",
      "Delays in supply and availability of spare parts; insufficient workshop/body shop space.",
      "High vendor debt delaying response time and spare parts delivery.",
      "Customer-facing service standards — front desk and service-advisor consistency.",
    ],
    skillGaps: [
      "Advanced vehicle diagnostic and fault-finding skills.",
      "Modern mechanical repair techniques; electric/new-energy (NEV) vehicle training.",
      "HSE awareness, operational risk assessment, and compliance practices.",
      "Customer care, front desk operations, and service advisor skills.",
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
    representative: "Rejoice",
    state: "No challenges",
    detail: "No issues",
    challenges: [],
    note: "Representative reported no operational challenges at this time (GM: \"Nothing from Giga\").",
  },
  {
    subsidiary: "BLACK",
    representative: "4 sub-subsidiary representatives",
    state: "Redacted",
    detail: "Pending",
    challenges: [],
    note: "Recognized subsidiary (formerly Glint Technologies). Sub-subsidiary input is being handled separately and is redacted here; BLACK's detailed breakdown will be built as a separate phase once data is supplied.",
    subReps: [
      { name: "Fadekemi Veronica Okunoye", unit: "RAW Subsidiary" },
      { name: "Gideon Eden", unit: "PSAP Subsidiary" },
      { name: "Moses H. Bayawa", unit: "SAC Subsidiary" },
      { name: "Unande S. Geraldine", unit: "HR / Admin" },
    ],
  },
  {
    subsidiary: "Bright Echefu Foundation (BEF)",
    representative: "Oluwaseyi Akinfela",
    department: "Programs / Operations",
    state: "Submitted",
    detail: "Structured",
    challenges: [
      "Capacity gaps in structured project planning, implementation, and risk management.",
      "Limited monitoring & evaluation (M&E) and data-driven impact measurement.",
      "Financial management, budgeting, and leadership/team-management development needs.",
    ],
    skillGaps: [
      "Project management — planning, implementation, risk management, and reporting.",
      "Monitoring & evaluation — data collection, analysis, and impact measurement.",
      "Financial management — budgeting and budget development.",
      "Leadership and team management.",
    ],
    priorities: [
      "Project Management training for program staff.",
      "M&E training with practical data tools.",
      "Financial management & budgeting training.",
      "Leadership & team-management training.",
    ],
    resources: [
      "External facilitators across the four training areas.",
      "Costed budget submitted (see estimates).",
    ],
    budget: [
      { area: "Project Management Training", cost: "₦100,000 – ₦300,000" },
      { area: "M&E Training", cost: "₦250,000 – ₦450,000" },
      { area: "Financial Management & Budget Training", cost: "₦200,000 – ₦550,000" },
      { area: "Leadership & Team Management Training", cost: "₦300,000 – ₦600,000" },
      { area: "BEF Total Range", cost: "₦850,000 – ₦1,900,000" },
    ],
  },
  {
    subsidiary: "Bright FM",
    representative: "Engineer Johnson Makoji",
    department: "Broadcast / Station Operations",
    state: "Submitted",
    detail: "Comprehensive",
    challenges: [
      "Manpower shortage — insufficient staffing across presentation, content, and operations.",
      "Marketing, sales, and sponsorship development gaps limiting revenue growth.",
      "Resource constraints — content production, digital, and operational tooling.",
    ],
    skillGaps: [
      "Radio presentation, storytelling, and on-air delivery.",
      "Content development and production.",
      "Online audience engagement and digital content.",
      "Radio marketing, sales, and sponsorship development.",
      "Operational coordination across the station.",
    ],
    priorities: [
      "Presentation & storytelling training for on-air staff.",
      "Content development and production workshops.",
      "Digital audience engagement and social content training.",
      "Marketing, sales, and sponsorship development training.",
    ],
    resources: [
      "Human — additional presentation, content, and operations staff.",
      "Training — external media and marketing facilitators.",
      "Content & Marketing — production and digital tooling.",
      "Operational — station infrastructure support.",
    ],
  },
  {
    subsidiary: "Luft (Pay TV)",
    representative: "No representative assigned",
    state: "Not applicable",
    detail: "—",
    challenges: [],
    note: "No representative currently assigned to the Task Force.",
  },
  {
    subsidiary: "Glint Technologies",
    representative: "—",
    state: "Morphed",
    detail: "—",
    challenges: [],
    note: "Morphed into BLACK — tracked under the BLACK subsidiary above.",
  },
  {
    subsidiary: "UVECH",
    representative: "TBD",
    state: "No response",
    detail: "—",
    challenges: [],
  },
]

// ── Derived analytics for the ROI dashboard ────────────────────
// "Reporting entities" = everything except the morphed/legacy Glint record.
const reporting = submissions.filter((s) => s.state !== "Morphed")

export const submissionStats = {
  total: reporting.length,
  submitted: reporting.filter((s) => s.state === "Submitted").length,
  noChallenges: reporting.filter((s) => s.state === "No challenges").length,
  pending: reporting.filter((s) => s.state === "Pending" || s.state === "Redacted").length,
  noResponse: reporting.filter((s) => s.state === "No response").length,
  notApplicable: reporting.filter((s) => s.state === "Not applicable").length,
}

// Recurring challenge themes consolidated across all submissions.
export const challengeThemes = [
  { theme: "Staffing & Workforce Capacity", count: 5 },
  { theme: "Technical Skills & Training", count: 5 },
  { theme: "Equipment & Infrastructure", count: 4 },
  { theme: "Business Development & Marketing", count: 2 },
  { theme: "Supply Chain & Procurement", count: 2 },
  { theme: "Welfare & Working Conditions", count: 2 },
  { theme: "Content & Audience Growth", count: 1 },
]

// 2A. Operational Challenges Matrix — theme cross-referenced to subsidiaries.
export const challengeMatrix: { theme: string; subsidiaries: string[] }[] = [
  { theme: "Infrastructure / equipment degradation", subsidiaries: ["EIB Stratoc", "Luftreiber Automobile", "POCTOVA"] },
  { theme: "Workforce capacity / staffing gaps", subsidiaries: ["Briech Atlantic", "POCTOVA", "Briech UAS", "Bright FM"] },
  { theme: "Business development / marketing", subsidiaries: ["Briech Atlantic", "Bright FM"] },
  { theme: "Supply chain / spare parts / accessories", subsidiaries: ["Luftreiber Automobile", "POCTOVA"] },
  { theme: "Technical tools / software / workstations", subsidiaries: ["Briech Atlantic", "EIB Stratoc"] },
  { theme: "Supervisory workload / burnout", subsidiaries: ["EIB Stratoc"] },
  { theme: "Production volume / utilization", subsidiaries: ["Briech UAS"] },
  { theme: "Skill continuity / hands-on practice gaps", subsidiaries: ["Briech UAS"] },
  { theme: "Content / audience growth", subsidiaries: ["Bright FM"] },
]

// 2B. Skill Gap Analysis — category, gaps, subsidiaries.
export const skillGapAnalysis: { category: string; gaps: string; subsidiaries: string[] }[] = [
  {
    category: "Technical",
    gaps: "Vehicle diagnostics, UAV assembly/calibration, avionics, AV/transmission equipment",
    subsidiaries: ["Luftreiber Automobile", "Briech UAS", "EIB Stratoc"],
  },
  {
    category: "Reporting & Documentation",
    gaps: "MS Word, intelligence report writing, technical documentation, MRO record-keeping",
    subsidiaries: ["EIB Stratoc", "Briech UAS"],
  },
  {
    category: "Operational",
    gaps: "Time management, workload prioritization, QA inspection protocols",
    subsidiaries: ["EIB Stratoc", "Briech UAS"],
  },
  {
    category: "Emerging Tech",
    gaps: "Electric vehicles (NEV), drone operations, live-feed management",
    subsidiaries: ["Luftreiber Automobile", "EIB Stratoc"],
  },
  {
    category: "Safety & Compliance",
    gaps: "HSE awareness, operational risk assessment",
    subsidiaries: ["Luftreiber Automobile"],
  },
  {
    category: "Customer-Facing",
    gaps: "Customer care, front desk operations, service advisor skills",
    subsidiaries: ["Luftreiber Automobile"],
  },
  {
    category: "Project Management",
    gaps: "Project planning, implementation, risk management, and reporting",
    subsidiaries: ["BEF"],
  },
  {
    category: "M&E / Data",
    gaps: "Monitoring, evaluation, data collection, analysis, and impact measurement",
    subsidiaries: ["BEF"],
  },
  {
    category: "Financial",
    gaps: "Financial management, budgeting, and budget development",
    subsidiaries: ["BEF"],
  },
  {
    category: "Leadership",
    gaps: "Leadership skills and team management",
    subsidiaries: ["BEF"],
  },
  {
    category: "Media & Content",
    gaps: "Radio presentation, storytelling, content development, and production",
    subsidiaries: ["Bright FM"],
  },
  {
    category: "Digital Media",
    gaps: "Online audience engagement and digital content",
    subsidiaries: ["Bright FM"],
  },
  {
    category: "Marketing & Sales",
    gaps: "Radio marketing, sales, and sponsorship development",
    subsidiaries: ["Bright FM"],
  },
]

// 2D. Resource Requirements Summary — categorized for the 3-month budget submission.
export const resourceRequirements: { category: string; items: string }[] = [
  { category: "External trainers / specialists", items: "Technical, HSE, customer-service and report-writing facilitators" },
  { category: "Equipment & technology", items: "Workstations, drone batteries, AV/transmission infrastructure, spare parts" },
  { category: "Personnel recruitment", items: "Quantity Surveyor, technicians, business-development staff, tailoring staff" },
  { category: "Infrastructure", items: "Workshop/body-shop space, facility maintenance, production power backup" },
  { category: "Training program budgets", items: "Per-subsidiary learning sessions, drills, and certification" },
]

// Section 3. Strategic Alignment Matrix — Task Force data feeding each initiative.
export const strategicAlignment: { n: number; initiative: string; covers: string; feed: string }[] = [
  { n: 1, initiative: "Organization-Wide TNA", covers: "Identify skill gaps & operational challenges", feed: "All 7 submissions directly provide this" },
  { n: 2, initiative: "Staff Competency Mapping", covers: "Categorize staff by role & competency", feed: "Briech UAS (assembly/avionics), Luftreiber (diagnostics), EIB Stratoc (reporting), BEF (project mgmt, M&E, finance, leadership), Bright FM (presentation, content, marketing)" },
  { n: 3, initiative: "Performance Bottleneck Review", covers: "Customer complaints, delays, errors", feed: "Briech Atlantic (project delays), POCTOVA (production delays), Luftreiber (spare-parts delays), Bright FM (audience engagement gaps)" },
  { n: 4, initiative: "Capability Improvement Program", covers: "Targeted training delivery", feed: "All training priorities submitted" },
  { n: 5, initiative: "Staff Evaluation Framework", covers: "Competency & readiness assessments", feed: "Skill gaps inform evaluation criteria" },
  { n: 6, initiative: "Knowledge Sharing Platform", covers: "Cross-functional learning", feed: "Briech UAS (cross-training, mentorship), EIB Stratoc (knowledge transfer)" },
  { n: 7, initiative: "Performance Improvement Task Force", covers: "This platform IS the deliverable", feed: "Active" },
  { n: 8, initiative: "Culture & Accountability Reinforcement", covers: "Workplace behaviors, ownership", feed: "POCTOVA (suggestion boxes, welfare), Briech UAS (ownership through mentorship)" },
  { n: 9, initiative: "Training ROI Dashboard", covers: "Track KPIs", feed: "Baseline data from submissions establishes starting metrics" },
]

// ── Strategic narrative (the "say it in a sentence" layer) ──────
export const strategy = {
  // The single-sentence pitch executives keep asking for.
  oneLiner:
    "Over the next 90 days, transform EIB Group's Training & OD function from reactive, ad-hoc training into a structured, data-driven capability engine — by diagnosing skill gaps across all subsidiaries, delivering targeted training tied to measurable KPIs, and standing up a permanent system to sustain it.",
  mission:
    "To build a high-performing, continuously-learning workforce that drives measurable business results across every EIB Group subsidiary.",
  vision:
    "A self-sustaining, group-wide capability-development system where every employee's growth is mapped, measured, and tied directly to organizational performance.",
  // The three things every executive wants to hear, in order.
  pillars: [
    {
      label: "The Goal",
      question: "Where are we going?",
      statement:
        "A measurable, self-sustaining group-wide capability-development system that outlives any single quarter.",
    },
    {
      label: "The Objectives",
      question: "What will we achieve?",
      statement:
        "Close priority skill gaps in every subsidiary, establish a TNA and staff-evaluation framework, and build the LMS as the permanent home for learning.",
    },
    {
      label: "The Roadmap",
      question: "How will we get there?",
      statement:
        "Month 1 — diagnose & baseline. Month 2 — deliver targeted training. Month 3 — measure ROI, embed the system, and launch the LMS pilot.",
    },
  ],
  // Why this counts as strategy, not a to-do list.
  principles: [
    "Tied to business outcomes, not activity counts — every initiative maps to efficiency, effectiveness, or ROI.",
    "Evidence-based — grounded in real subsidiary submissions, not assumptions.",
    "Measurable — baselines established now, targets tracked monthly.",
    "Sustainable — ends with a permanent platform (LMS), not a one-off training calendar.",
  ],
}

// ── LMS vision & maturity roadmap ──────────────────────────────
export type LmsPhaseStatus = "Live now" | "Next" | "Planned" | "Future"

export type LmsPhase = {
  phase: string
  status: LmsPhaseStatus
  title: string
  summary: string
  features: string[]
  unlocks: string
}

export const lmsVision = {
  headline: "From a 90-day plan to a permanent learning platform",
  intro:
    "The dashboards you see today are the intelligence layer — the diagnosis. A Learning Management System is the delivery layer — the cure. Each phase below builds directly on the data already captured, so nothing is thrown away.",
  // How current assets map onto LMS capabilities.
  bridge: [
    { have: "Training Needs Analysis per subsidiary", becomes: "Courses mapped to those exact needs" },
    { have: "Skill-gap matrix", becomes: "Learner enrollment & assignment by gap" },
    { have: "KPI / ROI targets", becomes: "Real completion, scores & progress tracking" },
    { have: "Subsidiary submissions", becomes: "User accounts, roles & departments" },
    { have: "The 9 strategic initiatives", becomes: "Curriculum, certification & evaluation framework" },
  ],
  phases: [
    {
      phase: "Phase 0",
      status: "Live now",
      title: "Intelligence Layer",
      summary: "Diagnose needs and establish the baseline — the current app.",
      features: [
        "Strategic plan & 90-day roadmap",
        "Consolidated subsidiary input (TNA)",
        "Skill-gap & challenge matrices",
        "ROI dashboard with KPI targets",
      ],
      unlocks: "A clear, evidence-based picture of what to teach and why.",
    },
    {
      phase: "Phase 1",
      status: "Next",
      title: "Foundation & Course Catalog",
      summary: "Stand up accounts, roles, and a catalog of courses mapped to real skill gaps.",
      features: [
        "User accounts & roles (admin, subsidiary lead, learner)",
        "Course catalog mapped to the skill-gap matrix",
        "Enrollment & assignment by subsidiary / gap",
        "Secure database, authentication & file storage",
      ],
      unlocks: "Learners can be assigned the exact training their gaps call for.",
    },
    {
      phase: "Phase 2",
      status: "Planned",
      title: "Content, Assessment & Certification",
      summary: "Deliver real learning content and prove competency.",
      features: [
        "Video, PDF & SCORM course content",
        "Quizzes, assessments & pass thresholds",
        "Completion certificates",
        "Staff evaluation framework (Initiative #5)",
      ],
      unlocks: "Competency is measured and certified, not assumed.",
    },
    {
      phase: "Phase 3",
      status: "Future",
      title: "Live ROI & Continuous Improvement",
      summary: "Close the loop — the ROI dashboard runs on real completion data.",
      features: [
        "Real participation, scores & readiness feeding the dashboard",
        "Knowledge-sharing & mentorship spaces (Initiative #6)",
        "Manager analytics per subsidiary",
        "Quarter-over-quarter capability trends",
      ],
      unlocks: "Training ROI becomes a measured fact, sustained beyond any 90-day window.",
    },
  ] as LmsPhase[],
}
