const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

const stratocLessons = [
  {
    key: "executive-summary",
    title: "Executive Summary & Phase 1 (Days 1–30)",
    minutes: 45,
    summary: "Operational Assessment, Reporting Consolidation and Performance Alignment.",
    attachments: [
      { title: "EIB Stratoc 90-Day Plan (PDF)", url: "/docs/eib-stratoc-90-day-plan.pdf" }
    ],
    sections: [
      {
        heading: "Executive Summary",
        body: [
          "As EIB Stratoc expands its operational footprint from seventeen (17) active camps with additional deployments planned, the need for greater operational coordination, standardized reporting, stronger accountability, and improved communication between headquarters, Fusion Centres, and field locations has become increasingly important.",
          "A major priority during this implementation period will be the continued standardization of operational reporting via the Report Review and Analysis (RRA) Team.",
        ]
      },
      {
        heading: "Phase I (Days 1–30): Assessment & Alignment",
        body: [
          "- **Operational Assessment:** A comprehensive operational assessment across all Fusion Centres and operational camps.",
          "- **Standardized Reporting:** Guiding Fusion Analysts, Team Leads, and Camp Supervisors on approved reporting templates.",
          "- **Performance Monitoring:** Establishing KPIs to measure reporting compliance, surveillance feed availability, incident response, and equipment readiness."
        ]
      }
    ],
    takeaways: ["Standardize reporting via RRA", "Conduct operational assessments", "Establish KPIs"]
  },
  {
    key: "phase-2-optimization",
    title: "Phase 2 (Days 31–60): Process Optimization",
    minutes: 45,
    summary: "Operational Integration, Process Optimization and Performance Enhancement.",
    sections: [
      {
        heading: "Optimizing Fusion Centres",
        body: [
          "Efforts will be directed towards improving coordination between Fusion Analysts and field personnel through clearly defined communication channels, standardized operational procedures, and structured shift handover processes."
        ]
      },
      {
        heading: "Deliverables – Phase II",
        body: [
          "<div class='overflow-x-auto mt-4 rounded-lg border border-border'><table class='w-full text-sm text-left'>",
          "<thead class='bg-muted text-muted-foreground'><tr><th class='px-4 py-3 font-medium'>Initiative</th><th class='px-4 py-3 font-medium'>Practical Deliverable</th></tr></thead>",
          "<tbody class='divide-y divide-border'>",
          "<tr><td class='px-4 py-3 font-semibold'>Fusion Centre Optimization</td><td class='px-4 py-3'>Standardized shift handover procedure implemented across Main Fusion, Cindy Fusion, and PSAC</td></tr>",
          "<tr><td class='px-4 py-3 font-semibold'>RRA Implementation</td><td class='px-4 py-3'>Weekly report quality review sessions with documented feedback</td></tr>",
          "<tr><td class='px-4 py-3 font-semibold'>Operational Communications</td><td class='px-4 py-3'>Communications Register established to monitor network interruptions</td></tr>",
          "<tr><td class='px-4 py-3 font-semibold'>Camp Support Coordination</td><td class='px-4 py-3'>Request Tracking Register established to monitor requests from camps</td></tr>",
          "</tbody></table></div>"
        ]
      }
    ],
    takeaways: ["Standardized shift handovers", "Communications Register for network tracking", "Request Tracking Register"]
  },
  {
    key: "phase-3-institutionalization",
    title: "Phase 3 (Days 61–90): Institutionalization",
    minutes: 45,
    summary: "Institutionalization, Performance Evaluation and Strategic Readiness.",
    sections: [
      {
        heading: "Evaluation and Growth",
        body: [
          "A comprehensive operational performance review will assess the effectiveness of all initiatives.",
          "An Operational Improvement Register will be established within the Office of the Deputy General Manager to capture recommendations arising from management reviews, inspections, and staff engagements."
        ]
      },
      {
        heading: "Performance Measurement Framework",
        body: [
          "<div class='overflow-x-auto mt-4 rounded-lg border border-border'><table class='w-full text-sm text-left'>",
          "<thead class='bg-muted text-muted-foreground'><tr><th class='px-4 py-3 font-medium'>KPI</th><th class='px-4 py-3 font-medium'>Target After 90 Days</th></tr></thead>",
          "<tbody class='divide-y divide-border'>",
          "<tr><td class='px-4 py-3'>Standardized reporting template adoption</td><td class='px-4 py-3 font-semibold'>100% across all Fusion Centres and Camps</td></tr>",
          "<tr><td class='px-4 py-3'>Daily Situation Reports submitted on schedule</td><td class='px-4 py-3 font-semibold'>&ge;95% compliance</td></tr>",
          "<tr><td class='px-4 py-3'>Incident Reports reviewed through RRA</td><td class='px-4 py-3 font-semibold'>100%</td></tr>",
          "<tr><td class='px-4 py-3'>Surveillance feed monitoring compliance</td><td class='px-4 py-3 font-semibold'>&ge;95%</td></tr>",
          "</tbody></table></div>"
        ]
      }
    ],
    takeaways: ["100% template adoption", "Operational Improvement Register", "Continuous performance monitoring"]
  }
];

const stratocQuiz = [
  { prompt: "What is the primary function of the Report Review and Analysis (RRA) Team?", options: ["Procuring new drones", "Improving the quality, consistency, and analytical value of reports", "Managing field personnel payroll", "Conducting VIP protection"], correctIndex: 1, explanation: "The RRA Team focuses on the standardization of operational reporting." },
  { prompt: "In Phase I, what is established to measure reporting compliance and equipment readiness?", options: ["Key Performance Indicators (KPIs)", "Financial Budgets", "Marketing campaigns", "New Fusion Centres"], correctIndex: 0, explanation: "KPIs are established in Phase I to measure compliance and operational performance." },
  { prompt: "What registers are implemented in Phase II to monitor operational issues?", options: ["Communications Register and Request Tracking Register", "Cash Register and Asset Register", "Vehicle Register and Maintenance Register", "Visitor Register and Access Register"], correctIndex: 0, explanation: "The Communications Register tracks network issues, and Request Tracking tracks camp requests." },
  { prompt: "What is the 90-day target for 'Daily Situation Reports submitted on schedule'?", options: ["50% compliance", "75% compliance", "≥95% compliance", "100% compliance"], correctIndex: 2, explanation: "The KPI target for Daily SITREPs on schedule is ≥95%." },
  { prompt: "What is the 90-day target for 'Standardized reporting template adoption'?", options: ["80%", "90%", "95%", "100% across all Fusion Centres and Camps"], correctIndex: 3, explanation: "The KPI target requires 100% adoption across all locations." },
  { prompt: "Which office is responsible for establishing the Operational Improvement Register in Phase III?", options: ["The Office of the General Manager", "The Office of the Deputy General Manager", "The Human Resources Department", "The Report Review and Analysis Team"], correctIndex: 1, explanation: "The Continuous Improvement Register is established within the Office of the DGM." },
  { prompt: "What must Team Leads do at the commencement and conclusion of each shift during Phase II?", options: ["Submit timesheets", "Conduct routine operational briefings", "Clean the Fusion Centre", "Call the General Manager"], correctIndex: 1, explanation: "Team Leads must conduct routine operational briefings for shift handovers." },
  { prompt: "What challenge is the Operational Communications Register specifically designed to track?", options: ["Unpaid invoices", "Recurring communication disruptions, network outages, and surveillance feed interruptions", "Late staff arrivals", "Vehicle breakdowns"], correctIndex: 1, explanation: "It tracks network instability and communication issues." },
  { prompt: "How many active camps did EIB Stratoc have at the time of this plan?", options: ["10", "12", "15", "17"], correctIndex: 3, explanation: "The executive summary states EIB Stratoc has seventeen (17) active camps." },
  { prompt: "What is the goal of Phase III (Days 61-90)?", options: ["Laying off staff", "Institutionalization, Performance Evaluation, and Strategic Readiness", "Initial Operational Assessment", "Purchasing new drones"], correctIndex: 1, explanation: "Phase 3 focuses on Institutionalization, Performance Evaluation and Strategic Readiness." }
];

const hospitalLessons = [
  {
    key: "hospital-governance",
    title: "Governance & Facility Readiness (Months 1-2)",
    minutes: 45,
    summary: "Establishing the administrative foundation and preparing the physical facility.",
    attachments: [
      { title: "Briech Hospital Six-Months Plan (PDF)", url: "/docs/briech-hospital-six-months-plan.pdf" }
    ],
    sections: [
      {
        heading: "Overall Goal",
        body: [
          "To successfully transition Briech Hospital from construction phase to a fully licensed, staffed, equipped, and operational world-class healthcare facility ready for commissioning and patient care in Kuje, FCT Abuja (91 Wards)."
        ]
      },
      {
        heading: "Month 1: Administrative Foundation & Governance",
        body: [
          "- Develop Hospital Organizational Structure",
          "- Create Departmental Framework (Admin, HR, Finance, Nursing, Medical, Lab, Radiology, Pharmacy, ICT, Facility Mgmt.)",
          "- Develop HR Manual, Procurement, Financial & Infection Control Policies, Patient Safety Policy, Staff Handbook"
        ]
      },
      {
        heading: "Month 2: Facility Readiness & Equipment Planning",
        body: [
          "- Conduct weekly construction review meetings",
          "- Finalize medical equipment list & procurement planning",
          "- Utility readiness: Water, Electricity, Internet, Oxygen system, Backup power"
        ]
      }
    ],
    takeaways: ["Develop Operational Policies", "Utility & Facility Readiness", "Governance Framework"]
  },
  {
    key: "hospital-workforce",
    title: "Recruitment, Onboarding & Systems (Months 3-4)",
    minutes: 45,
    summary: "Building the workforce and deploying digital systems.",
    sections: [
      {
        heading: "Month 3: Recruitment & Workforce Planning",
        body: [
          "Target: Recruit ~98–120 staff in total.",
          "- **Clinical Staff:** Medical Director, Consultants, Medical Officers, Nurses, Pharmacists, Lab Scientists, Radiographers",
          "- **Non-Clinical Staff:** HR, Finance, ICT Managers, Customer Service Officers, Security, Cleaners"
        ]
      },
      {
        heading: "Month 4: Staff Onboarding & System Development",
        body: [
          "- Establish Electronic Medical Records (EMR) & Hospital Information System (HIS)",
          "- Develop SOPs, clinical pathways & emergency protocols",
          "- Training: Customer service, Patient safety, Infection prevention, Workplace ethics"
        ]
      }
    ],
    takeaways: ["Recruit 98-120 staff", "Deploy EMR and HIS", "Develop clinical pathways"]
  },
  {
    key: "hospital-compliance",
    title: "Compliance & Commissioning (Months 5-6)",
    minutes: 45,
    summary: "Achieving regulatory readiness and officially launching.",
    sections: [
      {
        heading: "Month 5: Regulatory Compliance & Operational Testing",
        body: [
          "- Obtain: Hospital operating license, Pharmacy approvals, Laboratory approvals, Radiation licenses",
          "- Conduct: Mock patient admission, Emergency drills, Fire drills, Clinical simulations"
        ]
      },
      {
        heading: "Month 6: Commissioning & Launch Preparation",
        body: [
          "- Final equipment testing & staffing review",
          "- Marketing campaign & community sensitization",
          "- Commissioning event planning"
        ]
      },
      {
        heading: "Six-Month Timeline Overview",
        body: [
          "<div class='mt-4 border-l-4 pl-4 py-2 bg-muted/30 rounded-r-md' style='border-color: var(--primary)'>",
          "<p class='mb-2'><strong>Month 1 (Jul):</strong> Admin Foundation</p>",
          "<p class='mb-2'><strong>Month 2 (Aug):</strong> Facility Readiness</p>",
          "<p class='mb-2'><strong>Month 3 (Sep):</strong> Recruitment & Workforce</p>",
          "<p class='mb-2'><strong>Month 4 (Oct):</strong> Onboarding & Systems</p>",
          "<p class='mb-2'><strong>Month 5 (Nov):</strong> Regulatory Compliance</p>",
          "<p><strong>Month 6 (Dec):</strong> Commissioning & Launch</p>",
          "</div>"
        ]
      }
    ],
    takeaways: ["Obtain all licenses", "Conduct mock patient admissions", "Launch marketing campaigns"]
  }
];

const hospitalQuiz = [
  { prompt: "What is the overall goal of the Six-Month Readiness Plan?", options: ["To close down operations", "To transition Briech Hospital from construction phase to a fully licensed, staffed, equipped, and operational world-class healthcare facility", "To sell the hospital to a third party", "To only offer outpatient services"], correctIndex: 1, explanation: "The goal is to transition from construction to a fully operational hospital." },
  { prompt: "Where is Briech Hospital located according to the presentation?", options: ["Lagos", "Kano", "Kuje, FCT Abuja", "Port Harcourt"], correctIndex: 2, explanation: "The hospital is located in Kuje, FCT Abuja." },
  { prompt: "In which month is the Facility Readiness & Equipment Planning (including Utility readiness for Oxygen and Backup power) scheduled?", options: ["Month 1", "Month 2", "Month 4", "Month 6"], correctIndex: 1, explanation: "Facility Readiness & Equipment Planning occurs in Month 2." },
  { prompt: "What is the total targeted staff recruitment number across clinical and non-clinical roles?", options: ["10 - 20 staff", "50 - 70 staff", "98 - 120 staff", "200+ staff"], correctIndex: 2, explanation: "The HR priority is to recruit ~98-120 staff." },
  { prompt: "What critical ICT system must be established in Month 4?", options: ["Social Media Accounts", "Electronic Medical Records (EMR) & Hospital Information System (HIS)", "Payroll Software", "Drone Tracking Software"], correctIndex: 1, explanation: "EMR and HIS deployment occurs in Month 4." },
  { prompt: "What activities are scheduled for Month 5 (Regulatory Compliance & Operational Testing)?", options: ["Obtaining licenses and conducting mock patient admissions and emergency drills", "Digging the foundation of the hospital", "Hiring the Medical Director", "Creating the annual budget"], correctIndex: 0, explanation: "Month 5 focuses on obtaining licenses (pharmacy, radiation, operating) and conducting mock drills." },
  { prompt: "Which of these policies is NOT explicitly listed to be developed in Month 1?", options: ["Infection Control Policy", "Patient Safety Policy", "Aviation Maintenance Policy", "Procurement Policy"], correctIndex: 2, explanation: "Aviation Maintenance Policy is irrelevant to the hospital. Infection control, patient safety, and procurement are required." },
  { prompt: "What is a key deliverable for Month 6?", options: ["Governance structure approved", "Launch readiness certification and official opening plan", "Recruitment database established", "Staff orientation completed"], correctIndex: 1, explanation: "Month 6 deliverables are Launch readiness certification and the Official opening plan." },
  { prompt: "What training topics are specified for staff during Month 4 Onboarding?", options: ["Customer service, Patient safety, Infection prevention, Workplace ethics", "Marketing and Sales", "Surgical techniques for all staff", "Basic accounting"], correctIndex: 0, explanation: "The specified trainings are Customer service, Patient safety, Infection prevention, and Workplace ethics." },
  { prompt: "What specific utility systems must be ready in Month 2?", options: ["Water, Electricity, Internet, Oxygen system, Backup power", "Only Internet", "Only Water and Electricity", "Solar panels only"], correctIndex: 0, explanation: "Utility readiness includes Water, Electricity, Internet, Oxygen system, and Backup power." }
];

const ghrLessons = [
  {
    key: "ghr-workforce-overview",
    title: "Workforce Overview & Disciplinary Actions",
    minutes: 45,
    summary: "An overview of staff strength and disciplinary actions across the group.",
    attachments: [
      { title: "GHRM Presentation 2026 (PDF)", url: "/docs/ghrm-presentation-2026.pdf" },
      { title: "GHR Manager Appraisal (PDF)", url: "/docs/ghrm-appraisal.pdf" }
    ],
    sections: [
      {
        heading: "Workforce Distribution Highlights",
        body: [
          "- **EIB Group Total Staff:** 910 employees.",
          "- **EIB Stratoc:** 142 total staff, 38 security agencies, 207 campers.",
          "- **Briech UAS:** 91 staff, 9 janitors.",
          "- **LUFT PayTV:** Workforce reduced to 52 personnel following restructuring. 5 voluntary resignations in March."
        ]
      },
      {
        heading: "Notable Disciplinary Cases",
        body: [
          "- **Behavioral Misconduct:** A staff member was issued a suspension letter without pay for constant violations of the company dress code.",
          "- **Repeated Absenteeism:** Warning letters were issued for repeated lateness and absenteeism.",
          "- **Misconduct:** A staff member was issued a warning letter for Breach of NDA.",
          "- **Insubordination & Misconduct:** A query letter was issued to a staff for giving misinformation and insubordination to the GHR.",
          "- **Absenteeism Management Actions:** Immediate phone follow-up with all absent staff, documentation of all absence reasons, requiring medical certificates/pictures of drugs for sick leave."
        ]
      }
    ],
    takeaways: ["Strict absenteeism management", "Dress code enforcement", "Breach of NDA consequences", "Insubordination results in query letters"]
  },
  {
    key: "ghr-q3-q4-plans",
    title: "Strategic Plan for Q3 & Q4 2026",
    minutes: 45,
    summary: "HR strategic goals, compliance mandates, and performance tracking.",
    sections: [
      {
        heading: "Q3 & Q4 Strategic Pillars",
        body: [
          "**1. Training & Development:** Develop a formal Q3 training calendar. Prioritize customer service excellence and leadership training.",
          "**2. HR Systems & Processes:** Implement formal exit interview process. Develop clear career progression paths. Get acquainted with the digital HRIS System.",
          "**3. Compliance:** Continue enforcing dress code policy. Monitor ID card compliance across EIB Group. Complete Zenith Bank salary account transition.",
          "**4. Performance Management:** Introduce formal quarterly performance reviews. Develop KPIs for all departments. Create individual development plans for key staff."
        ]
      },
      {
        heading: "Training Recommendations",
        body: [
          "- **Workplace Ethics & Conduct:** All Staff",
          "- **Attendance & Punctuality Awareness:** All Departments",
          "- **Leadership & Team Management:** Supervisors and Team Leads",
          "- **Security & ID Card Compliance:** All Staff",
          "- **Compliance:** Adherence to management’s instructions and policies."
        ]
      }
    ],
    takeaways: ["Formal exit interviews", "Enforce ID card compliance", "Quarterly performance reviews"]
  }
];

const ghrQuiz = [
  { prompt: "What is the total number of staff in the EIB Group according to the GHR report?", options: ["500", "750", "910", "1200"], correctIndex: 2, explanation: "The report states the total number of staff in the EIB Group is 910." },
  { prompt: "What disciplinary action was taken for constant violations of the company dress code?", options: ["A verbal warning", "A suspension letter without pay", "A small fine", "Reassignment to another department"], correctIndex: 1, explanation: "A staff member was issued a suspension letter without pay for constant dress code violations." },
  { prompt: "What is the required documentation for sick leave absences under the Absenteeism Management Actions?", options: ["A text message to the manager", "A medical certificate or pictures of drugs", "A signed letter from a parent", "No documentation is required"], correctIndex: 1, explanation: "The HR actions require a medical certificate/pictures of drugs for sick leave." },
  { prompt: "What is a major compliance goal for Q3 & Q4 regarding salaries?", options: ["Complete the Zenith Bank salary account transition", "Switch to daily cash payments", "Move to Bitcoin salaries", "Stop paying salaries"], correctIndex: 0, explanation: "Completing the Zenith Bank salary account transition is a key compliance goal." },
  { prompt: "What action was taken against a staff member for giving misinformation and insubordination to the GHR?", options: ["Promotion", "Issued a query letter", "Transferred to a new location", "Ignored"], correctIndex: 1, explanation: "A query letter was issued to a staff for giving misinformation and insubordination." },
  { prompt: "Which of the following is a Training Recommendation mandatory for 'All Staff'?", options: ["Leadership & Team Management", "Workplace Ethics & Conduct", "Advanced software engineering", "Financial accounting"], correctIndex: 1, explanation: "Workplace Ethics & Conduct is recommended for All Staff." },
  { prompt: "How often will formal performance reviews be introduced according to the Q3 & Q4 plan?", options: ["Annually", "Biannually", "Quarterly", "Monthly"], correctIndex: 2, explanation: "The plan introduces formal quarterly performance reviews." },
  { prompt: "What process must be formally implemented in Q3 & Q4 regarding departing staff?", options: ["Farewell parties", "Exit interview process", "Severance packages", "Reference blocking"], correctIndex: 1, explanation: "Implementing the exit interview process formally is a Q3 & Q4 goal." },
  { prompt: "What caused the workforce reduction to 52 personnel in LUFT Pay TV?", options: ["A fire outbreak", "Restructuring, transfers, and redundancy exercises", "They all resigned on the same day", "Lack of funding"], correctIndex: 1, explanation: "The reduction was due to restructuring, transfers, and redundancy exercises." },
  { prompt: "What was the consequence for a staff member who breached an NDA?", options: ["Issued a warning letter", "Fired immediately", "Fined N100,000", "Suspended for a year"], correctIndex: 0, explanation: "A staff member was issued a warning letter for Breach of NDA." }
];


async function run() {
  try {
    const stratocContent = JSON.stringify({ lessons: stratocLessons, quiz: stratocQuiz });
    const hospitalContent = JSON.stringify({ lessons: hospitalLessons, quiz: hospitalQuiz });
    const ghrContent = JSON.stringify({ lessons: ghrLessons, quiz: ghrQuiz });

    const q = `
      INSERT INTO "courses" (slug, title, description, category, level, format, "durationHours", "priceNaira", subsidiaries, "customContent", "authorId")
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11),
      ($12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22),
      ($23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)
      ON CONFLICT (slug) DO UPDATE 
      SET title = EXCLUDED.title, description = EXCLUDED.description, "customContent" = EXCLUDED."customContent", subsidiaries = EXCLUDED.subsidiaries;
    `;

    await pool.query(q, [
      // Stratoc
      'eib-stratoc-90-day-ops-plan',
      'EIB Stratoc 90-Day Strategic Operational Excellence Plan',
      'A roadmap for strengthening EIB Stratoc operational effectiveness, standardizing reporting, and expanding surveillance operations.',
      'Operational',
      'Advanced',
      'Online',
      3,
      0,
      'EIB Stratoc',
      stratocContent,
      'michael.marquis@eibgroup.com',

      // Hospital
      'briech-hospital-six-month-readiness',
      'Briech Hospital Six-Month Administrative & Operational Readiness',
      'Detailed timelines and governance frameworks for transitioning the hospital from construction to a fully commissioned healthcare facility.',
      'Operational',
      'Intermediate',
      'Online',
      4,
      0,
      'Briech Hospital',
      hospitalContent,
      'michael.marquis@eibgroup.com',

      // GHR
      'ghrm-q3-q4-strategic-plan',
      'GHRM Q3-Q4 Strategic Plan & Compliance Enforcement',
      'Group Human Resources framework for performance management, disciplinary actions, and mandatory ID/Dress code compliance.',
      'Safety & Compliance',
      'Beginner',
      'Online',
      2,
      0,
      'Global',
      ghrContent,
      'michael.marquis@eibgroup.com'
    ]);

    console.log('Successfully inserted Stratoc, Hospital, and GHR courses!');
  } catch(e) {
    console.error('Error inserting courses', e);
  } finally {
    process.exit(0);
  }
}

run();
