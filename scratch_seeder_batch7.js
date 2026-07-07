const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

const briechAtlanticLessons = [
  {
    key: "briech-atlantic-strategic-expansion",
    title: "Briech Atlantic Q3/Q4 Expansion Strategy",
    minutes: 45,
    summary: "Expanding into Interior & Exterior Finishing and aggressive marketing.",
    attachments: [
      { title: "Briech Atlantic 90-Day Projection Plan (PDF)", url: "/docs/briech-atlantic-90-day-projection-plan.pdf" },
      { title: "Briech Atlantic Project Plan (PDF)", url: "/docs/briech-atlantic-project-plan.pdf" },
      { title: "Six-Month Strategic Projection Plan (PDF)", url: "/docs/briech-atlantic-six-month-strategic-plan.pdf" }
    ],
    sections: [
      {
        heading: "Strategic Objectives",
        body: [
          "- Secure a minimum of 6 new construction contracts.",
          "- Establish the Interior & Exterior Design and Finishing Division as a profitable business unit.",
          "- Generate at least 300 qualified property leads."
        ]
      },
      {
        heading: "Recruitment & Resources",
        body: [
          "- **Recruit:** 1 Quantity Surveyor, 4 Estate Marketers, 1 Interior Designer, 1 Exterior/Landscape Architect.",
          "- **Mobility:** Requesting 2 dedicated vehicles (Car and Hiace Bus) for marketing.",
          "- **Tech:** High-performance workstations for architects, project management software."
        ]
      },
      {
        heading: "Primary Construction Deliverables",
        body: [
          "- **EIB Group Main Headquarters:** Targeted for 100% project completion by November.",
          "- **Regulatory Compliance:** Registering with government MDAs to enhance company credibility, ensure regulatory compliance, and open opportunities for major public tenders and contracts."
        ]
      }
    ],
    takeaways: ["Introduce the Interior & Exterior Finishing division", "Recruit 4 Estate Marketers to cover Abuja zones", "100% completion of EIB Headquarters by November"]
  },
  {
    key: "briech-atlantic-forms",
    title: "Project Management Forms & Protocols",
    minutes: 45,
    summary: "Standardizing site operations and subcontractor handovers.",
    sections: [
      {
        heading: "Mandatory Site Forms",
        body: [
          "- **Daily Workers Register:** Must track skilled/unskilled labor and be approved by the Project Manager, Internal Control, and General Manager.",
          "- **Materials Request Form:** Standardizes procurement from the site to the warehouse."
        ]
      },
      {
        heading: "Project Completion and Handover Form (PCF)",
        body: [
          "- Issued to subcontractors after project completion.",
          "- Includes an inspection checklist and a Defect Liability Period where subcontractors must fix defects at no extra cost.",
          "- Must be signed before final payment and retention money release."
        ]
      }
    ],
    takeaways: ["Sign the Project Completion Form before releasing final payments", "Enforce the Defect Liability Period for subcontractors", "Track daily labor on the Workers Register"]
  }
];

const briechAtlanticQuiz = [
  { prompt: "What new division is Briech Atlantic introducing as a strategic business unit?", options: ["Agriculture", "Interior & Exterior Design and Finishing", "Cybersecurity", "Automobile Repair"], correctIndex: 1, explanation: "The new division is Interior & Exterior Design and Finishing." },
  { prompt: "How many dedicated vehicles is Briech Atlantic requesting for the marketing team?", options: ["None", "Two (a Car and a Hiace Bus)", "Five", "Ten"], correctIndex: 1, explanation: "Two dedicated vehicles are requested for the marketing team." },
  { prompt: "What must a subcontractor sign before final payment and release of retention monies?", options: ["A new contract", "The Project Completion and Handover Form (PCF)", "A non-disclosure agreement", "A timesheet"], correctIndex: 1, explanation: "The PCF must be completed before final payment." },
  { prompt: "Who is financially responsible for fixing defects identified during the Defect Liability Period?", options: ["Briech Atlantic", "The Subcontractor (at no additional cost)", "The Client", "The Government"], correctIndex: 1, explanation: "The subcontractor must fix defects at no extra cost during this period." },
  { prompt: "How many Estate Construction & Development Marketers does the plan eventually require?", options: ["One", "Two", "Four", "Ten"], correctIndex: 2, explanation: "The plan requires four marketers, though they may start with two." },
  { prompt: "Which of the following is NOT a required approval signature on the Daily Workers Register?", options: ["Project Manager", "Internal Control", "General Manager", "Subcontractor"], correctIndex: 3, explanation: "The Subcontractor does not approve the Daily Workers Register." },
  { prompt: "What is the targeted cumulative number of qualified leads for Estate Marketing by Q4?", options: ["50", "100", "300", "1000"], correctIndex: 2, explanation: "The strategic plan aims for 300 qualified leads." },
  { prompt: "Which of these projects is listed for 100% completion by November?", options: ["EIB Group Main Headquarters", "A new shopping mall", "A residential skyscraper", "A bridge"], correctIndex: 0, explanation: "The EIB Group Main Headquarters is targeted for 100% completion in November." },
  { prompt: "What specific IT equipment is requested for Architects and Engineers?", options: ["Tablets", "High-Performance Workstation Desktop computers", "Smartphones", "Basic laptops"], correctIndex: 1, explanation: "Architects and Engineers require high-performance workstations." },
  { prompt: "What is the primary purpose of registering with government MDAs?", options: ["To pay taxes", "To enhance credibility, ensure compliance, and create opportunities for tenders/contracts", "To get free land", "To hire civil servants"], correctIndex: 1, explanation: "Registration enhances credibility and opens up contract opportunities." }
];

const trainingLessons = [
  {
    key: "training-task-force-report",
    title: "Q3 Intelligence & Skill Gap Analysis",
    minutes: 45,
    summary: "Analyzing cross-subsidiary challenges and targeted training interventions.",
    attachments: [
      { title: "EIB Task Force Q3 Intelligence Report (PDF)", url: "/docs/eib-task-force-q3-intelligence-report.pdf" }
    ],
    sections: [
      {
        heading: "Task Force Intelligence Overview",
        body: [
          "- Consolidates challenges from 7 active subsidiary submissions (4 BLACK subsidiaries redacted).",
          "- Identifies critical infrastructure and workforce capacity gaps across Briech UAS, POCTOVA, EIB Stratoc, and others."
        ]
      },
      {
        heading: "Specific Skill Gaps",
        body: [
          "- **Briech UAS:** Avionics, Flight Controller configuration, hands-on assembly.",
          "- **Luftreiber Automobile:** Electric Vehicles (NEV) training, advanced diagnostics.",
          "- **EIB Stratoc:** Technical report writing, time management.",
          "- **BEF:** Project Management, M&E (MEAL), Financial Management."
        ]
      },
      {
        heading: "Subsidiary Interventions & Feedback",
        body: [
          "- **Giga Forensics:** Uniquely reported zero operational challenges in their submission.",
          "- **Bright FM:** Proposal to recruit and hire 2 experienced presenters and 2 marketing executives to resolve commercial bottlenecks.",
          "- **POCTOVA:** Insufficient tailoring staff is causing extreme pressure; the proposed solution is to implement structured shifts/off-days and salary increments."
        ]
      }
    ],
    takeaways: ["Review the 7 active subsidiary submissions", "Giga Forensics reported zero challenges", "Target UAV avionics training for Briech UAS"]
  },
  {
    key: "training-budget-alignment",
    title: "Budget & Strategic Alignment",
    minutes: 45,
    summary: "Aligning training interventions with the 90-Day Strategic Plan.",
    sections: [
      {
        heading: "Estimated Funding Requirements",
        body: [
          "- **External Experts:** ₦5M - ₦12.5M",
          "- **Equipment & Tech:** ₦15M - ₦35M",
          "- **Total Estimated Budget:** ₦34M - ₦80.5M"
        ]
      },
      {
        heading: "Strategic Alignment",
        body: [
          "- Fits directly into the 9 Initiatives, specifically 'Organization-Wide TNA', 'Staff Competency Mapping', and 'Capability Improvement'."
        ]
      }
    ],
    takeaways: ["Ensure training aligns with the 9 Strategic Initiatives", "Allocate budget for specialized external trainers", "Use internal tech workshops during idle periods for Briech UAS"]
  }
];

const trainingQuiz = [
  { prompt: "How many active subsidiary submissions are included in the Q3 Intelligence Report (excluding BLACK)?", options: ["4", "7", "12", "15"], correctIndex: 1, explanation: "There are 7 active submissions, with 4 BLACK subsidiaries redacted." },
  { prompt: "What specific critical skill gap was identified for Luftreiber Automobile?", options: ["Drone piloting", "Electric Vehicles (NEV) training and advanced diagnostics", "Radio presentation", "Sewing"], correctIndex: 1, explanation: "Luftreiber needs NEV and advanced diagnostic training." },
  { prompt: "What critical skill gap was identified for EIB Stratoc (Fusion Centre)?", options: ["UAV assembly", "Technical/intelligence report writing and time management", "Landscaping", "Catering"], correctIndex: 1, explanation: "EIB Stratoc requires report writing and time management training." },
  { prompt: "What is the total estimated funding requirement for the Task Force interventions?", options: ["₦5,000,000", "₦10,000,000", "₦34,000,000 – ₦80,500,000", "₦1,000,000,000"], correctIndex: 2, explanation: "The total estimated budget ranges from ₦34M to ₦80.5M." },
  { prompt: "Which subsidiary requires M&E (MEAL) and Project Management training?", options: ["Bright FM", "POCTOVA", "BEF (Bright Echefu Foundation)", "Giga Forensics"], correctIndex: 2, explanation: "BEF requires M&E, Project, and Financial management training." },
  { prompt: "What intervention is proposed for Briech UAS during idle low-production periods?", options: ["Send staff home unpaid", "Structured practical drills, internal tech workshops, and cross-training", "Hire external consultants to build drones", "Switch to making cars"], correctIndex: 1, explanation: "Idle periods should be used for drills and cross-training." },
  { prompt: "Which subsidiary reported 'No challenges' in their submission?", options: ["Briech Atlantic", "Luftreiber", "Giga Forensics", "POCTOVA"], correctIndex: 2, explanation: "Giga Forensics reported no challenges." },
  { prompt: "What intervention was proposed for Bright FM?", options: ["Buy new antennas", "Hire 2 experienced presenters and 2 marketing executives", "Change to a TV station", "Play more music"], correctIndex: 1, explanation: "Bright FM needs to hire experienced presenters and marketers." },
  { prompt: "What is the proposed solution for POCTOVA's insufficient tailoring staff causing pressure?", options: ["Implement off-days/shifts and salary increments", "Force them to work 24/7", "Close the factory", "Outsource all tailoring"], correctIndex: 0, explanation: "Implementing shifts and salary increments will relieve pressure." },
  { prompt: "The intelligence report aligns with which specific initiative from the 90-Day Strategic Plan?", options: ["Organization-Wide TNA (Training Needs Analysis)", "Building a new hospital", "Buying new trucks", "Launching a satellite"], correctIndex: 0, explanation: "It aligns directly with the Organization-Wide TNA." }
];

const psapLessons = [
  {
    key: "psap-strategy",
    title: "PSAP 90-Day Transformation Plan",
    minutes: 45,
    summary: "Transforming the existing PSAP into a 24/7 fully operational center.",
    attachments: [
      { title: "PSAP 90-Day Strategy Plan (PDF)", url: "/docs/psap-90-day-strategy-plan.pdf" }
    ],
    sections: [
      {
        heading: "Phased Rollout",
        body: [
          "- **Phase 1 (Day 1-30):** Assessment, call centre design, and stakeholder coordination (Police, Fire, EMS).",
          "- **Phase 2 (Day 31-60):** Software configuration (COMMAND OPS, CIGAS), workstation setup (ergonomic 911-style), recruitment, and training.",
          "- **Phase 3 (Day 61-90):** System integration testing, SOP simulation (table-top exercises), soft launch, and full operational launch."
        ]
      },
      {
        heading: "Simulation & Public Awareness",
        body: [
          "- **Multi-Agency Drills:** In Week 10, the center must conduct fire, medical, crime, and disaster response exercises with all integrated agencies.",
          "- **Public Awareness Campaign:** Immediately prior to full launch, execute a campaign to educate the public on appropriate use of the emergency number via TV, Radio, and Social Media."
        ]
      }
    ],
    takeaways: ["Implement ergonomic 911-style workstations", "Conduct multi-agency response exercises in Week 10", "Educate the public on emergency number usage before launch"]
  },
  {
    key: "psap-kpis",
    title: "PSAP Operations & KPIs",
    minutes: 45,
    summary: "Key performance indicators for emergency dispatch.",
    sections: [
      {
        heading: "Key Performance Indicators",
        body: [
          "- **Average emergency call answer time:** ≤ 10 seconds.",
          "- **Dispatch time for Priority 1 incidents:** ≤ 60 seconds.",
          "- **System uptime:** ≥ 99.9%.",
          "- **Emergency agencies integrated:** 100%."
        ]
      },
      {
        heading: "Staff Training Focus",
        body: [
          "- Emergency call prioritization.",
          "- Dispatch procedures and radio communication.",
          "- Stress management and crisis communication.",
          "- CPR coordination and Basic First Aid."
        ]
      }
    ],
    takeaways: ["Answer all emergency calls within 10 seconds", "Dispatch Priority 1 incidents within 60 seconds", "Maintain 99.9% system uptime"]
  }
];

const psapQuiz = [
  { prompt: "What is the target Average Emergency Call Answer Time for the PSAP?", options: ["≤ 30 seconds", "≤ 10 seconds", "≤ 1 minute", "≤ 5 seconds"], correctIndex: 1, explanation: "Calls must be answered within 10 seconds or less." },
  { prompt: "What is the target Dispatch Time for Priority 1 incidents?", options: ["≤ 2 minutes", "≤ 60 seconds", "≤ 5 minutes", "Immediate"], correctIndex: 1, explanation: "Priority 1 incidents must be dispatched within 60 seconds." },
  { prompt: "Which software applications are being configured for the PSAP?", options: ["Microsoft Word", "COMMAND OPS and CIGAS", "Adobe Photoshop", "AutoCAD"], correctIndex: 1, explanation: "COMMAND OPS and CIGAS are the primary PSAP dispatch softwares." },
  { prompt: "What happens during Phase 3 (Day 61-90) of the PSAP rollout?", options: ["Buying the building", "System integration testing, simulation exercises, and full operational launch", "Designing the logo", "Hiring the first employee"], correctIndex: 1, explanation: "Phase 3 focuses on testing, simulations, and the operational launch." },
  { prompt: "What style of workstation is specified for the PSAP Call Centre?", options: ["Standing desks only", "Ergonomic workstation design similar to 911 workstations", "Couches and laptops", "Traditional cubicles"], correctIndex: 1, explanation: "The facility requires ergonomic 911-style workstations." },
  { prompt: "What is the target system uptime for the PSAP?", options: ["90%", "95%", "99.9%", "100%"], correctIndex: 2, explanation: "System uptime must be at least 99.9%." },
  { prompt: "Which of the following is NOT a training topic for PSAP staff?", options: ["Emergency call prioritization", "Stress management", "Advanced drone piloting", "CPR coordination"], correctIndex: 2, explanation: "Drone piloting is not required for PSAP call takers." },
  { prompt: "What simulation exercise must be conducted during Week 10?", options: ["Fire, medical, crime, and disaster multi-agency response exercises", "A cooking competition", "A video game tournament", "A typing test"], correctIndex: 0, explanation: "Comprehensive multi-agency disaster drills must be simulated." },
  { prompt: "Who are the primary stakeholders that the PSAP must coordinate with?", options: ["Local restaurants", "Uniformed agencies (Police, Military, Fire, EMS, Civil Defense)", "Airlines", "Schools"], correctIndex: 1, explanation: "Uniformed security and emergency agencies are the primary stakeholders." },
  { prompt: "What public awareness initiative happens right before full launch?", options: ["A secret rollout", "Educating the public on appropriate use of the emergency number via TV, Radio, and Social Media", "Handing out flyers at the mall", "Sending a single email"], correctIndex: 1, explanation: "A massive multi-channel public awareness campaign is required." }
];

async function run() {
  try {
    const briechAtlanticContent = JSON.stringify({ lessons: briechAtlanticLessons, quiz: briechAtlanticQuiz });
    const trainingContent = JSON.stringify({ lessons: trainingLessons, quiz: trainingQuiz });
    const psapContent = JSON.stringify({ lessons: psapLessons, quiz: psapQuiz });

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
      // Briech Atlantic
      'briech-atlantic-q3-expansion',
      'Briech Atlantic: Q3/Q4 Expansion & Project Protocols',
      'Strategic expansion into Interior & Exterior Finishing, and mandatory site handover/completion protocols.',
      'Operational',
      'Advanced',
      'Online',
      4,
      0,
      'Briech Atlantic',
      briechAtlanticContent,
      'michael.marquis@eibgroup.com',

      // Training
      'training-q3-intelligence-report',
      'Task Force Q3 Intelligence & Skill Gap Report',
      'Cross-subsidiary analysis of operational bottlenecks and targeted training budget interventions.',
      'Operational',
      'Advanced',
      'Online',
      3,
      0,
      'EIB Group',
      trainingContent,
      'michael.marquis@eibgroup.com',

      // PSAP
      'psap-90-day-transformation',
      'PSAP: 90-Day Operational Transformation',
      'Roadmap to operationalize the Public Safety Answering Point to 911-standards with multi-agency integration.',
      'Technical',
      'Advanced',
      'Online',
      4,
      0,
      'PSAP',
      psapContent,
      'michael.marquis@eibgroup.com'
    ]);

    console.log('Successfully inserted Briech Atlantic, Training, and PSAP courses!');
  } catch(e) {
    console.error('Error inserting courses', e);
  } finally {
    process.exit(0);
  }
}

run();
