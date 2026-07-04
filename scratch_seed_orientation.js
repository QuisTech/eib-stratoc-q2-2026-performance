const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const orientationContent = {
  lessons: [
    {
      key: "hr-compliance",
      title: "Human Resources & Corporate Compliance",
      minutes: 45,
      summary: "Essential corporate policies covering workplace conduct, dress code, and absenteeism.",
      attachments: [
        {
          title: "HR Standard Operating Procedures (PDF)",
          url: "/docs/evp-hr-sop.pdf"
        },
        {
          title: "Onboarding & Offboarding Document (PDF)",
          url: "/docs/evp-onboarding-offboarding.pdf"
        }
      ],
      sections: [
        {
          heading: "Workplace Conduct & Disciplinary Policy",
          body: [
            "The EIB Group maintains strict standards for workplace ethics and conduct. Violations of these standards are treated seriously.",
            "- **Dress Code & ID Cards:** All staff must adhere to the company dress code and display their ID cards at all times across all EIB Group premises.",
            "- **Disciplinary Process:** The HR employee discipline process typically begins with a verbal warning. However, repeated non-compliance with reporting rules or management instructions will result in a written warning, negative appraisal, demotion, or severe disciplinary action.",
            "- **Breach of NDA & Insubordination:** Breaching a Non-Disclosure Agreement or exhibiting insubordination towards management results in immediate formal query letters and potential suspension or termination."
          ]
        },
        {
          heading: "Absenteeism & Leave Policy",
          body: [
            "- All absences must be properly documented and approved.",
            "- **Sick Leave:** If you are absent due to illness, you are strictly required to provide a medical certificate or pictures of prescribed medication to HR.",
            "- Unexcused absenteeism or repeated lateness will result in formal warning letters."
          ]
        },
        {
          heading: "Payroll Transition",
          body: [
            "- **Salary Accounts:** The Group is transitioning all staff salary accounts to Zenith Bank. All employees must comply with this financial transition to avoid delays in payroll."
          ]
        }
      ],
      takeaways: [
        "Strict adherence to dress code and ID card policies is mandatory.",
        "Sick leave requires a medical certificate or proof of medication.",
        "The first step in general discipline is a verbal warning."
      ]
    },
    {
      key: "operations-procurement",
      title: "Operations & Procurement Protocols",
      minutes: 30,
      summary: "Standard operating procedures for corporate procurement and incident reporting.",
      attachments: [
        {
          title: "Simple SOPs (PDF)",
          url: "/docs/evp-simple-sop.pdf"
        }
      ],
      sections: [
        {
          heading: "Procurement Rules",
          body: [
            "To ensure transparency and cost-efficiency, the EIB Group operates a centralized procurement system.",
            "- **Golden Rule:** No staff member is authorized to make purchases or financial commitments on behalf of the company outside of the official procurement process.",
            "- Procurement must obtain a minimum of three (3) quotations before processing standard requests.",
            "- A Purchase Order (PO) must be approved and issued before Accounts is notified to make payment."
          ]
        },
        {
          heading: "Incident Reporting",
          body: [
            "- **Emergencies:** Must be reported immediately up the chain of command.",
            "- **Non-Emergencies:** Must be reported within 24 hours via standard operating channels."
          ]
        }
      ],
      takeaways: [
        "No unauthorized purchases outside the formal procurement pipeline.",
        "Procurement requires a minimum of three quotations.",
        "Emergencies must be reported immediately."
      ]
    }
  ],
  quiz: [
    {
      prompt: "What documentation is strictly required by HR for sick leave absences?",
      options: [
        "A text message to a colleague",
        "A medical certificate or pictures of prescribed medication",
        "No documentation is required",
        "A verbal confirmation"
      ],
      correctIndex: 1,
      explanation: "A medical certificate or proof of medication must be provided to HR to validate sick leave."
    },
    {
      prompt: "Are individual staff members authorized to make company purchases directly with their own funds?",
      options: [
        "Yes, if it is an emergency",
        "Yes, if it is under N10,000",
        "No, no staff member is authorized to make purchases outside the official procurement process",
        "Yes, but only on Fridays"
      ],
      correctIndex: 2,
      explanation: "No staff member is authorized to bypass the centralized procurement process."
    },
    {
      prompt: "What is typically the first step in the standard HR Employee Discipline process for minor infractions?",
      options: [
        "Immediate termination",
        "Suspension without pay",
        "Verbal warning",
        "Police involvement"
      ],
      correctIndex: 2,
      explanation: "The process typically begins with a verbal warning before escalating to written warnings."
    },
    {
      prompt: "How many competitive quotations must the Procurement department obtain where applicable?",
      options: [
        "One",
        "Two",
        "A minimum of three",
        "Five"
      ],
      correctIndex: 2,
      explanation: "Standard procurement procedure requires a minimum of three quotes."
    },
    {
      prompt: "When must an emergency incident be reported according to the SOPs?",
      options: [
        "Within 24 hours",
        "Immediately",
        "At the end of the week",
        "In the next monthly report"
      ],
      correctIndex: 1,
      explanation: "All emergencies must be reported immediately up the chain of command."
    }
  ]
};

async function run() {
  try {
    await pool.query('UPDATE courses SET "customContent" = $1 WHERE title = $2', [
      JSON.stringify(orientationContent),
      'EIB Group Global Orientation'
    ]);
    console.log("Successfully seeded the Global Orientation course.");
  } catch(e) {
    console.error(e)
  } finally {
    pool.end();
  }
}
run();
