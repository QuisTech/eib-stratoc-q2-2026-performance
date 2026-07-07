const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

const evpLessons = [
  {
    key: "evp-reporting-approval",
    title: "Management Reporting & Approvals",
    minutes: 45,
    summary: "Standardizing reporting timelines and approval hierarchies.",
    attachments: [
      { title: "Senior Management Reporting SOPs (PDF)", url: "/docs/evp-senior-management-reporting.pdf" },
      { title: "HR Standard Operating Procedures (PDF)", url: "/docs/evp-hr-sop.pdf" },
      { title: "Onboarding & Offboarding Document (PDF)", url: "/docs/evp-onboarding-offboarding.pdf" },
      { title: "Simple SOPs (PDF)", url: "/docs/evp-simple-sop.pdf" }
    ],
    sections: [
      {
        heading: "Reporting Schedules",
        body: [
          "- **Daily Subsidiary Report:** Before 9:00 AM of the following business day.",
          "- **Weekly Senior Management Report:** Every Friday before close of work.",
          "- **Monthly Executive Report:** Within the first five working days of the new month.",
          "- **Incident Report:** Immediately for emergencies; within 24 hours for non-emergencies."
        ]
      },
      {
        heading: "Approval Timelines",
        body: [
          "- **Routine requests:** 24 hours",
          "- **Financial requests:** 48 hours",
          "- **Emergency requests:** Immediate"
        ]
      }
    ],
    takeaways: ["Submit daily reports before 9 AM", "Submit weekly reports on Friday", "Emergency requests require immediate approval"]
  },
  {
    key: "evp-hr-procurement",
    title: "HR Lifecycle & Procurement",
    minutes: 45,
    summary: "Managing the employee lifecycle and standardizing procurement.",
    sections: [
      {
        heading: "Employee Onboarding & Offboarding",
        body: [
          "- **Onboarding:** Prepare workstation, orient on day one, set KPIs, conduct 30/60/90-day reviews. Reference/background checks must be completed before an offer is made.",
          "- **Offboarding:** Recover assets, revoke system access (coordinate with ICT to disable email and remote access), conduct exit interview, process final pay."
        ]
      },
      {
        heading: "Procurement Procedure",
        body: [
          "- Obtain a minimum of three quotations where applicable.",
          "- Issue a Purchase Order (PO) after comparative analysis and approval. Procurement notifies Accounts to pay after PO is approved and issued.",
          "- **Rule:** No staff member is authorized to make purchases outside the procurement process."
        ]
      },
      {
        heading: "HR Employee Discipline & Compliance",
        body: [
          "- **Compliance:** Repeated non-compliance with reporting rules or management instructions results in a written warning, negative appraisal, demotion, or disciplinary action.",
          "- **Discipline Process:** The first step in the HR Employee Discipline process typically begins with a verbal warning."
        ]
      }
    ],
    takeaways: ["Conduct 30, 60, and 90-day onboarding reviews", "Obtain at least three quotes for procurement", "First step in discipline is a verbal warning"]
  }
];

const evpQuiz = [
  { prompt: "When is the Daily Subsidiary Management Report due?", options: ["Before close of business on the same day", "Before 9:00 AM of the following business day", "Every Friday", "On the 1st of the month"], correctIndex: 1, explanation: "Daily reports must be submitted before 9:00 AM the next day." },
  { prompt: "What is the expected approval timeline for a routine request?", options: ["12 hours", "24 hours", "48 hours", "1 week"], correctIndex: 1, explanation: "Routine requests should be approved within 24 hours." },
  { prompt: "How many quotations must Procurement obtain where applicable?", options: ["One", "Two", "A minimum of three", "Five"], correctIndex: 2, explanation: "A minimum of three quotations is standard procedure." },
  { prompt: "What is required during the Staff Offboarding process regarding system access?", options: ["Change their password to '1234'", "Coordinate with ICT to disable email and remote access", "Let the employee keep their email", "Give their password to their manager"], correctIndex: 1, explanation: "ICT must completely disable all system and building access." },
  { prompt: "When is the Weekly Senior Management Report due?", options: ["Monday morning", "Every Friday before close of work", "Wednesday afternoon", "Sunday night"], correctIndex: 1, explanation: "Weekly reports are due on Friday before the close of work." },
  { prompt: "What must happen before an employee receives an offer letter?", options: ["They must buy a company uniform", "Reference/background checks must be completed (where applicable)", "They must work for a week for free", "They must pass a driving test"], correctIndex: 1, explanation: "Background checks must be completed before an offer is made." },
  { prompt: "When must an emergency incident be reported?", options: ["Within 24 hours", "Immediately", "At the end of the week", "In the monthly report"], correctIndex: 1, explanation: "Emergencies require immediate reporting." },
  { prompt: "Who is responsible for notifying Accounts to pay after a PO is issued?", options: ["The vendor", "The requesting department", "Procurement", "The CEO"], correctIndex: 2, explanation: "Procurement notifies Accounts to pay after a PO is approved and issued." },
  { prompt: "What is the consequence of repeated non-compliance with reporting rules?", options: ["A promotion", "A written warning, negative appraisal, demotion, or disciplinary action", "A small fine", "Reassignment to a different subsidiary"], correctIndex: 1, explanation: "Repeated non-compliance results in severe disciplinary action." },
  { prompt: "What is the first step in the HR Employee Discipline process?", options: ["Termination", "Suspension", "Verbal warning", "Query letter"], correctIndex: 2, explanation: "The process typically begins with a verbal warning." }
];

const meLessons = [
  {
    key: "me-visibility-collaboration",
    title: "M&E Strategy & Operations",
    minutes: 45,
    summary: "Improving visibility and collaboration across subsidiaries.",
    attachments: [
      { title: "M&E Q3 Action Report (PDF)", url: "/docs/me-q3-action-report.pdf" }
    ],
    sections: [
      {
        heading: "Q3 Strategy Initiatives",
        body: [
          "- Direct interface with Department or Subsidiary heads.",
          "- Implement Weekly Budget Implementation Cycles.",
          "- Use Daily Task Appraisal Milestones and Weekly on-site Evaluation reports."
        ]
      },
      {
        heading: "Subsidiary M&E Engagements",
        body: [
          "- **BEF:** Implement an incident management protocol to insulate the group from legal liability.",
          "- **POCTOVA:** Standardize costing index before public sales.",
          "- **Briech UAS:** Protect intellectual property and prototype designs."
        ]
      }
    ],
    takeaways: ["Implement weekly budget cycles", "Protect the company from legal liability during BEF outreaches", "Secure intellectual property at Briech UAS"]
  },
  {
    key: "me-departmental-focus",
    title: "Departmental M&E Focus",
    minutes: 45,
    summary: "M&E collaboration with Accounts, HR, and Procurement.",
    sections: [
      {
        heading: "Accounts & HR",
        body: [
          "- **Accounts:** Must notify M&E of every project milestone cost expended or defunded.",
          "- **HR:** M&E will assist to design and implement a 24-Hour Exit Protocol for transfers and disengagements."
        ]
      },
      {
        heading: "Procurement & Document Control",
        body: [
          "- **Procurement:** Conduct bi-weekly overviews of stock to prevent overlap with administrative roles.",
          "- **Document Control:** Rely on their data collection to spot trends and notify responsible offices for timely aversion."
        ]
      },
      {
        heading: "Briech Atlantic & Compliance",
        body: [
          "- **Briech Atlantic Milestone:** A major operational milestone monitored by M&E is reducing operational costs by 10% and increasing property inquiries by 30% in Q3.",
          "- **Contract Compliance:** Employment contracts must not be identical across subsidiaries because each company has unique operational realities and legal/regulatory requirements."
        ]
      }
    ],
    takeaways: ["Accounts must notify M&E of defunded projects", "Implement a 24-Hour Exit Protocol with HR", "Use Document Control data to spot operational trends", "Contracts must reflect subsidiary-specific legal realities"]
  }
];

const meQuiz = [
  { prompt: "What M&E initiative is designed to insulate BEF from legal liability?", options: ["Hiring more lawyers", "Implementing a strict incident management protocol", "Stopping all outreaches", "Buying insurance"], correctIndex: 1, explanation: "An incident management protocol is needed to protect against liability during health outreaches." },
  { prompt: "What is M&E's primary focus for Briech UAS in the coming year?", options: ["Selling drones", "Intellectual property protection and prototype documentation", "Firing staff", "Opening a new factory"], correctIndex: 1, explanation: "Protecting IP and documenting prototypes is the primary focus." },
  { prompt: "What must the Accounts department communicate to M&E regarding projects?", options: ["The color of the project folders", "Every project milestone cost expended, and any initiatives canceled or defunded", "The salaries of the project managers", "Nothing"], correctIndex: 1, explanation: "Accounts must communicate funding milestones and cancellations." },
  { prompt: "What HR protocol is M&E helping to design and implement?", options: ["A 24-Hour Exit Protocol for terminations and transfers", "A new dress code", "A 3-day weekend policy", "A mandatory gym membership"], correctIndex: 0, explanation: "M&E is helping HR design a 24-Hour Exit Protocol." },
  { prompt: "What is a key strategy initiative for M&E in Q3?", options: ["Closing down subsidiaries", "Weekly Budget Implementation Cycles and Daily Task Appraisals", "Reducing staff pay", "Outsourcing M&E to a third party"], correctIndex: 1, explanation: "Weekly budget cycles and daily task appraisals are key initiatives." },
  { prompt: "How will M&E use data from Document Control?", options: ["To delete old files", "To spot trends during daily collation and notify responsible offices for timely aversion", "To sell data to competitors", "To print more paper"], correctIndex: 1, explanation: "Document control data helps spot trends and avert issues." },
  { prompt: "What is M&E's recommendation for POCTOVA before embarking on public sales?", options: ["Change their name", "Standardize the costing index", "Buy more sewing machines", "Fire the tailors"], correctIndex: 1, explanation: "Standardizing the costing index is critical before public sales." },
  { prompt: "How often will M&E conduct stock and restock overview documentation for Procurement?", options: ["Daily", "Bi-weekly", "Monthly", "Annually"], correctIndex: 1, explanation: "M&E will conduct bi-weekly overviews of procurement stock." },
  { prompt: "What is a major milestone for Briech Atlantic monitored by M&E?", options: ["Build a new hospital in 1 day", "Reduce operational costs by 10% and increase property inquiries by 30%", "Stop all construction", "Sell the company"], correctIndex: 1, explanation: "Reducing costs and increasing inquiries are major milestones." },
  { prompt: "Why must employment contracts not be similar across subsidiaries?", options: ["To save paper", "Because each subsidiary has different operational realities and legal requirements", "To confuse the staff", "Because the Chairman said so"], correctIndex: 1, explanation: "Contracts must reflect the specific industry and operational realities of each subsidiary." }
];

const poctovaLessons = [
  {
    key: "poctova-workflow",
    title: "Poctova Production Workflow",
    minutes: 45,
    summary: "The 17-department sequence from design to delivery.",
    attachments: [
      { title: "POCTOVA Departmental Workflow (PDF)", url: "/docs/poctova-departmental-workflow.pdf" },
      { title: "POCTOVA Strategic Projection Plan (PDF)", url: "/docs/poctova-strategic-projection-plan.pdf" },
      { title: "POCTOVA Presentation July-December (PDF)", url: "/docs/poctova-presentation-july-december.pdf" }
    ],
    sections: [
      {
        heading: "The Production Sequence",
        body: [
          "The workflow reflects the natural flow from product conception to delivery:",
          "1. **Design & Sample:** Create concepts and prototypes.",
          "2. **Planning & Cutting:** Schedule production and prepare materials.",
          "3. **Sewing & Finishing:** Assemble garments and add final touches.",
          "4. **Quality Control & Laundry:** Ensure standards and treat products. Quality Control checks garments immediately after Finishing and before Laundry.",
          "5. **Packaging & Logistics:** Ready items for shipment and distribute."
        ]
      },
      {
        heading: "Supporting Departments",
        body: [
          "Sales, Inventory, Accounting, Maintenance, Legal, Admin, and Security provide operational support to the manufacturing pipeline."
        ]
      },
      {
        heading: "Design and Prototype Sampling",
        body: [
          "- **Sample Department:** This department is responsible for preparing physical prototype samples after the Design phase and before production planning is scheduled."
        ]
      }
    ],
    takeaways: ["Follow the logical order from Design to Logistics", "Ensure Quality Control checks garments before Laundry and Packaging", "Planning must schedule production before Cutting begins"]
  },
  {
    key: "poctova-strategic-plan",
    title: "Q3 Strategic Projection & Quality",
    minutes: 45,
    summary: "Expanding RTW lines and enforcing strict Quality Control.",
    sections: [
      {
        heading: "Ready-To-Wear (RTW) & Monograms",
        body: [
          "- **Launch:** 4 New RTW Lines (Unisex, Corporate, Bubu, Sports).",
          "- **Wholesale:** Distribute Agbada monograms to 20+ retail traders in major markets by Day 90."
        ]
      },
      {
        heading: "Quality Control & Cost Reduction",
        body: [
          "- **4 Stages of QC:** Costing, Fabric Inspection, In-Process (Sewing), and Final (100% inspection). Fabric inspection is Stage 2 and involves checking defects, color, and shrinkage before cutting.",
          "- **Goal:** Reduce customer complaints by 80%.",
          "- **Costing:** Bulk procurement via 2 annual supplier contracts to reduce material costs by 5-10%."
        ]
      },
      {
        heading: "Mobile Sales & Outreach",
        body: [
          "- **Mobile Team:** By Day 45, the mobile team is tasked to take client measurements and present RTW samples in the field to secure sales."
        ]
      }
    ],
    takeaways: ["Enforce 4 stages of Quality Control", "Launch 4 new Ready-To-Wear lines", "Use bulk procurement contracts to reduce costs", "Mobile team takes client measurements by Day 45"]
  }
];

const poctovaQuiz = [
  { prompt: "Which department immediately follows the 'Cutting' department in the Poctova workflow?", options: ["Packaging", "Sewing", "Quality Control", "Design"], correctIndex: 1, explanation: "Sewing follows Cutting in the assembly process." },
  { prompt: "What is Stage 2 of Poctova's Quality Control process?", options: ["Costing", "Fabric Inspection (Check defects, color, shrinkage before cut)", "In-Process", "Final Inspection"], correctIndex: 1, explanation: "Stage 2 is Fabric Inspection before cutting begins." },
  { prompt: "What is the goal of the Monogram Wholesale objective?", options: ["Sell sewing machines", "Distribute Agbada monograms to 20+ retail traders by Day 90", "Stop making monograms", "Only sell to the military"], correctIndex: 1, explanation: "The objective is wholesale distribution to 20+ retail traders." },
  { prompt: "How many Ready-To-Wear (RTW) lines is Poctova launching in Q3?", options: ["Two", "Four (Unisex, Corporate, Bubu, Sports)", "Ten", "None"], correctIndex: 1, explanation: "Poctova is launching 4 new RTW lines." },
  { prompt: "What is the target reduction for customer complaints due to the new QC process?", options: ["10%", "50%", "80%", "100%"], correctIndex: 2, explanation: "The KPI is to reduce customer complaints by 80%." },
  { prompt: "Which department is responsible for ensuring standards are met immediately after Finishing?", options: ["Legal", "Quality Control", "Sales", "Security"], correctIndex: 1, explanation: "Quality Control inspects the garments after Finishing." },
  { prompt: "What is the target for the Mobile Team by Day 45?", options: ["To sell food", "To take client measurements and present RTW samples in the field", "To deliver fabric to suppliers", "To fix broken sewing machines"], correctIndex: 1, explanation: "The mobile team takes measurements and presents samples directly to clients." },
  { prompt: "How does Poctova plan to achieve a 5-10% material cost reduction?", options: ["Buying cheaper, low-quality fabric", "Bulk Procurement through 2 annual supplier contracts", "Stealing fabric", "Asking staff to bring their own thread"], correctIndex: 1, explanation: "Bulk procurement contracts will reduce material costs." },
  { prompt: "What must happen in Stage 4 (Final) of Quality Control before packaging?", options: ["A 10% random check", "A 100% inspection", "Ironing only", "Taking a photo for Instagram"], correctIndex: 1, explanation: "A 100% inspection is mandatory before packaging." },
  { prompt: "Which department prepares prototypes before production is scheduled?", options: ["Sample Department", "Logistics", "Maintenance", "Accounting"], correctIndex: 0, explanation: "The Sample department creates prototypes after Design and before Planning." }
];

async function run() {
  try {
    const evpContent = JSON.stringify({ lessons: evpLessons, quiz: evpQuiz });
    const meContent = JSON.stringify({ lessons: meLessons, quiz: meQuiz });
    const poctovaContent = JSON.stringify({ lessons: poctovaLessons, quiz: poctovaQuiz });

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
      // EVP
      'evp-group-hr-sops',
      'EVP: Standard Operating Procedures & Reporting',
      'Standard operating procedures covering management reporting workflows, personnel onboarding, and corporate procurement directives.',
      'Operational',
      'Advanced',
      'Online',
      4,
      0,
      'Global',
      evpContent,
      'michael.marquis@eibgroup.com',

      // M&E
      'monitoring-evaluation-q3-action-plan',
      'Monitoring & Evaluation Q3 Action Plan',
      'Strategic oversight, budget implementation tracking, and cross-subsidiary compliance monitoring.',
      'Operational',
      'Advanced',
      'Online',
      3,
      0,
      'EIB Group',
      meContent,
      'michael.marquis@eibgroup.com',

      // Poctova
      'poctova-workflow-strategic-plan',
      'POCTOVA: Departmental Workflow & Strategic Growth',
      'End-to-end garment manufacturing workflow and Q3 strategy for Ready-To-Wear expansion and quality control.',
      'Operational',
      'Intermediate',
      'Online',
      3,
      0,
      'POCTOVA',
      poctovaContent,
      'michael.marquis@eibgroup.com'
    ]);

    console.log('Successfully inserted EVP, M&E, and POCTOVA courses!');
  } catch(e) {
    console.error('Error inserting courses', e);
  } finally {
    process.exit(0);
  }
}

run();
