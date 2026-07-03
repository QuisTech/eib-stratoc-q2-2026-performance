const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

const procurementLessons = [
  {
    key: "procurement-90-day-plan",
    title: "Procurement Centralization & Vendor Management",
    minutes: 45,
    summary: "The 90-day plan to centralize procurement and deploy management software.",
    attachments: [
      { title: "Raw Procurement Centralization Plan", url: "/docs/batch-8-raw-input.txt" }
    ],
    sections: [
      {
        heading: "Phase 1: Foundation (Days 1-30)",
        body: [
          "- Work with IT to redesign the requisition portal to include the Procurement Manager's input.",
          "- Engage and prequalify at least three vendors per major procurement category.",
          "- Complete onboarding of redeployed staff and enroll personnel in supply chain training."
        ]
      },
      {
        heading: "Phase 2 & 3: Implementation & Consolidation",
        body: [
          "- Pilot test and deploy the procurement and inventory management software organization-wide.",
          "- Create an approved vendor database and evaluate performance using scorecards.",
          "- Conduct a procurement compliance audit and measure cost savings achieved."
        ]
      }
    ],
    takeaways: ["All requisitions must route through the redesigned portal", "Prequalify at least 3 vendors per category", "Evaluate vendor performance using standardized scorecards"]
  }
];

const procurementQuiz = [
  { prompt: "What is a key action required during Phase 1 of the Procurement 90-Day Plan regarding vendors?", options: ["Prequalify at least three vendors per major procurement category", "Fire all current vendors", "Pay all vendors in advance", "Hire only one vendor for everything"], correctIndex: 0, explanation: "Prequalifying at least three vendors per category is required to establish a robust vendor base." },
  { prompt: "What software intervention is IT working on with Procurement?", options: ["A new social media app", "Redesigning the requisition portal to include procurement approval stages", "A new payroll system", "A game for staff"], correctIndex: 1, explanation: "IT is redesigning the requisition portal to include the Procurement Manager's input." },
  { prompt: "What happens during Phase 3 regarding the procurement software?", options: ["It gets deleted", "It is deployed organization-wide", "It is sold to another company", "It is kept in testing forever"], correctIndex: 1, explanation: "After successful testing, the software is deployed organization-wide." },
  { prompt: "How will vendor performance be evaluated in Phase 2?", options: ["By holding a vote", "Using vendor performance scorecards", "By how friendly they are", "By flipping a coin"], correctIndex: 1, explanation: "Vendor performance is evaluated using standardized scorecards." },
  { prompt: "What is the primary goal of conducting regular market surveys and benchmark pricing?", options: ["To find new restaurants", "To ensure the company purchases good quality products at low prices", "To spy on competitors", "To plan vacations"], correctIndex: 1, explanation: "Market surveys help negotiate better prices and lower operational costs." }
];

const facilitiesLessons = [
  {
    key: "facilities-power-infrastructure",
    title: "Facility Infrastructure & Power Management",
    minutes: 45,
    summary: "Managing the group's generators, inverters, and solar infrastructure.",
    attachments: [
      { title: "Raw Facility & Power Operations Review", url: "/docs/batch-8-raw-input.txt" }
    ],
    sections: [
      {
        heading: "Power Infrastructure Inventory",
        body: [
          "- **Generators:** 16 generators assessed across facilities.",
          "- **Solar Panels:** 331 solar panels currently supporting operations.",
          "- **Major Project:** Rerouting 95mm² armoured cable for load balancing at Cindy Center to prevent excessive heat and vibration."
        ]
      },
      {
        heading: "Facility Improvements",
        body: [
          "- **Solar Street Lights:** Installation recommended across Cindy Centre Idu, Black Idu, and Kuje for security and visibility.",
          "- **Fleet Inventory:** Total company vehicles: 53 (30 Official, 23 Logistics)."
        ]
      }
    ],
    takeaways: ["Reroute the 95mm² cable at Cindy Center to balance load", "Install solar street lights across all facilities", "Maintain the inventory of 331 solar panels"]
  },
  {
    key: "facilities-janitorial-budget",
    title: "Workplace Support & Janitorial Budget",
    minutes: 45,
    summary: "Standardizing hygiene and safety for cleaning staff.",
    sections: [
      {
        heading: "3-Month Budget Proposal",
        body: [
          "- Covers 48 Janitors and 7 Gardeners across 4 subsidiaries.",
          "- Provides Janitors' Uniforms (48 pairs) and Safety Shoes (48 pairs).",
          "- **Objective:** Maintain hygiene standards, support effective cleaning operations, and ensure safety compliance."
        ]
      }
    ],
    takeaways: ["Provide safety shoes and uniforms for all 48 janitors", "Budget spans a 3-month period", "Maintain 96% staff attendance for cleaning crews"]
  }
];

const facilitiesQuiz = [
  { prompt: "Why is the 95mm² armoured cable at Cindy Center being rerouted?", options: ["Because it is too long", "To address persistent overloading, excessive heat, and vibration", "To change its color", "To save money on copper"], correctIndex: 1, explanation: "The cable is overloaded and requires rerouting for load balancing." },
  { prompt: "How many solar panels are currently supporting operations across the group?", options: ["50", "100", "331", "500"], correctIndex: 2, explanation: "There are 331 solar panels across the facilities." },
  { prompt: "What is the primary recommendation for improving nighttime security across facilities?", options: ["Hiring more guards", "Installing solar street lights", "Buying guard dogs", "Building higher walls"], correctIndex: 1, explanation: "Installing solar street lights will improve security and visibility." },
  { prompt: "How many Janitors are covered under the 3-Month Budget Proposal?", options: ["10", "25", "48", "100"], correctIndex: 2, explanation: "The budget covers 48 janitors." },
  { prompt: "What safety equipment is specifically budgeted for the janitorial staff?", options: ["Hard hats", "Safety shoes and uniforms", "Safety goggles", "Reflective vests"], correctIndex: 1, explanation: "48 pairs of safety shoes and uniforms are included in the budget." }
];

const docControlLessons = [
  {
    key: "doc-control-task-track",
    title: "Document Control & Task Track Compliance",
    minutes: 45,
    summary: "Enforcing the use of Task Track for all official document workflows.",
    attachments: [
      { title: "Raw Task Track Document Compliance Guidelines", url: "/docs/batch-8-raw-input.txt" }
    ],
    sections: [
      {
        heading: "Phase 1: The Interim Rule",
        body: [
          "- **The Rule:** All documents and approvals must route through Task Track.",
          "- **Prohibition:** No more sending official documents or approvals via email or WhatsApp."
        ]
      },
      {
        heading: "Phase 2 & 3: Re-anchoring & Accountability",
        body: [
          "- **Core Principle:** 'If it is not logged in Task Track, it did not happen.'",
          "- **Compliance Tracking:** Maintain a visible shared tracker identifying departments that miss internal reporting deadlines.",
          "- **Automation:** Implement auto-reminders for document review deadlines to reduce recurring bottlenecks."
        ]
      },
      {
        heading: "Team Rhythm Check-Ins",
        body: [
          "- **Rhythm:** Weekly and monthly checks must last 15-20 minutes and focus strictly on resolving blockers that stop reports from being sent on the platform."
        ]
      }
    ],
    takeaways: ["Stop sending official documents via WhatsApp or email", "Log every approval in Task Track", "Use the shared compliance tracker to identify bottlenecks"]
  }
];

const docControlQuiz = [
  { prompt: "What is the strict interim rule established by the Document Control department?", options: ["Use WhatsApp for all approvals", "All documents and approvals must route through Task Track; no more email or WhatsApp", "Send all documents via physical mail", "Call the manager for approval"], correctIndex: 1, explanation: "Task Track is mandatory; email and WhatsApp are prohibited for official approvals." },
  { prompt: "What is the core principle introduced during Phase 2 of the Document Control plan?", options: ["'Trust but verify'", "'If it is not logged in Task Track, it did not happen'", "'Always reply all'", "'Paper is better'"], correctIndex: 1, explanation: "If it's not in Task Track, it didn't happen." },
  { prompt: "How will Document Control identify departments causing compliance bottlenecks?", options: ["By asking around", "By maintaining a visible shared tracker on the reporting platform", "By reading emails", "By guessing"], correctIndex: 1, explanation: "A visible shared tracker will identify missing reports and bottlenecks." },
  { prompt: "What automation opportunity is Document Control targeting in Phase 3?", options: ["Auto-reminders for document review deadlines", "Auto-deleting old files", "Auto-generating reports", "Auto-replying to emails"], correctIndex: 0, explanation: "Auto-reminders will help reduce recurring review bottlenecks." },
  { prompt: "What happens during the weekly/monthly team rhythm check-ins?", options: ["Eating lunch", "Focusing strictly on blockers stopping reports from being sent on the platform", "Discussing the news", "Playing games"], correctIndex: 1, explanation: "Check-ins are strictly 15-20 minutes focused on resolving reporting blockers." }
];

async function run() {
  try {
    const procurementContent = JSON.stringify({ lessons: procurementLessons, quiz: procurementQuiz });
    const facilitiesContent = JSON.stringify({ lessons: facilitiesLessons, quiz: facilitiesQuiz });
    const docControlContent = JSON.stringify({ lessons: docControlLessons, quiz: docControlQuiz });

    const q = `
      INSERT INTO "courses" (slug, title, description, category, level, format, "durationHours", "priceNaira", subsidiaries, "customContent", "authorId")
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11),
      ($12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22),
      ($23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)
      ON CONFLICT (slug) DO UPDATE 
      SET title = EXCLUDED.title, description = EXCLUDED.description, "customContent" = EXCLUDED."customContent";
    `;

    await pool.query(q, [
      // Procurement
      'procurement-centralization-vendor-management',
      'Procurement: Centralization & Vendor Management',
      '90-day plan to centralize procurement, redesign the requisition portal, and prequalify vendors.',
      'Operational',
      'Intermediate',
      'Online',
      2,
      0,
      'EIB Group',
      procurementContent,
      'michael.marquis@eibgroup.com',

      // Facilities
      'group-admin-facility-power-management',
      'Group Admin: Facility & Power Infrastructure Management',
      'Mid-year performance review covering power infrastructure, fleet logistics, and janitorial operations.',
      'Operational',
      'Intermediate',
      'Online',
      3,
      0,
      'EIB Group',
      facilitiesContent,
      'michael.marquis@eibgroup.com',

      // Document Control
      'document-control-task-track-compliance',
      'Document Control: Task Track & Reporting Compliance',
      'Mandatory guidelines enforcing the use of Task Track for all cross-departmental document approvals.',
      'Safety & Compliance',
      'Beginner',
      'Online',
      2,
      0,
      'EIB Group',
      docControlContent,
      'michael.marquis@eibgroup.com'
    ]);

    console.log('Successfully inserted Procurement, Facilities, and Doc Control courses!');
  } catch(e) {
    console.error('Error inserting courses', e);
  } finally {
    process.exit(0);
  }
}

run();
