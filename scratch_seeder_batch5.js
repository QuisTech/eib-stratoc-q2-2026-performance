const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

const securityLessons = [
  {
    key: "security-camp-infrastructure",
    title: "Camp Security & Infrastructure",
    minutes: 45,
    summary: "Strengthening physical defenses and threat detection across 17 camps.",
    attachments: [
      { title: "Camps Security Strategic Plan 2026 (PDF)", url: "/docs/camps-security-strategic-plan-2026.pdf" }
    ],
    sections: [
      {
        heading: "Strengthen Physical Security",
        body: [
          "- **Defensive Measures:** Construct observation towers, ensure regular vegetation clearance, and dig at least two layers of defensive trenches around camps.",
          "- **Objective:** Secure camp assets and protect 207 campers across Nigeria."
        ]
      },
      {
        heading: "Improve Threat Detection",
        body: [
          "- **Technology:** Implement solar-powered security lighting, motion sensor intrusion alarms, CCTV with recording capability, and GPS tracking for authorised vehicles."
        ]
      },
      {
        heading: "Strategic Implementation & Success Factors",
        body: [
          "- **Implementation Phases:** Phase 1 is Assessment & Planning (focusing on risk assessments and gap analysis). Phase 2 is Infrastructure & Systems deployment, and Phase 3 is Training & Operational Readiness.",
          "- **Success Factors:** The key success factors for camp security include adequate funding and leadership commitment."
        ]
      }
    ],
    takeaways: ["Dig two layers of defensive trenches", "Install solar-powered security lighting and motion sensors", "Phase 1 is Assessment & Planning", "Key success factors: adequate funding and leadership commitment"]
  },
  {
    key: "security-welfare-military",
    title: "Personnel Welfare & Military Coordination",
    minutes: 45,
    summary: "Addressing operational challenges regarding camper welfare and military personnel.",
    sections: [
      {
        heading: "Current Challenges",
        body: [
          "- Food wastage at camps and complaints regarding meals provided to military personnel.",
          "- Difficulty determining the actual number of military personnel assigned to each camp for effective welfare planning."
        ]
      },
      {
        heading: "Recommendations",
        body: [
          "- Verify the actual strength of security personnel at each camp.",
          "- Monitor welfare and feeding arrangements for deployed military personnel.",
          "- Conduct periodic visits/inspections of all camps."
        ]
      }
    ],
    takeaways: ["Verify the actual number of deployed military personnel", "Monitor feeding arrangements to prevent complaints and food wastage", "Conduct periodic camp inspections"]
  }
];

const securityQuiz = [
  { prompt: "How many layers of defensive trenches are recommended around the camps?", options: ["One", "At least two", "Four", "None"], correctIndex: 1, explanation: "The strategy requires digging at least two layers of defensive trenches." },
  { prompt: "What type of lighting is recommended for threat detection?", options: ["Kerosene lamps", "Solar-powered security and motion-activated lighting", "Diesel generators only", "Battery-operated flashlights"], correctIndex: 1, explanation: "Solar-powered and motion-activated lighting are recommended." },
  { prompt: "What is a major challenge identified regarding military personnel at the camps?", options: ["They do not have uniforms", "Complaints regarding meals and difficulty determining their actual numbers for welfare planning", "They refuse to patrol", "They do not have weapons"], correctIndex: 1, explanation: "Determining exact numbers and managing feeding arrangements for military personnel is a key challenge." },
  { prompt: "How many camps does the EIB Group currently operate across Nigeria?", options: ["5", "10", "17", "25"], correctIndex: 2, explanation: "There are currently 17 camps across Nigeria." },
  { prompt: "What physical security measure involves environmental maintenance?", options: ["Painting fences", "Regular vegetation clearance", "Planting trees", "Paving roads"], correctIndex: 1, explanation: "Regular vegetation clearance is critical to maintain clear lines of sight." },
  { prompt: "What technology should be implemented for authorised vehicles?", options: ["Bulletproof glass", "GPS tracking", "Custom paint jobs", "Loud sirens"], correctIndex: 1, explanation: "GPS tracking is required for authorised vehicles." },
  { prompt: "What is Phase 1 of the Strategic Implementation?", options: ["Training & Operational Readiness", "Infrastructure & Systems", "Assessment & Planning", "Demobilization"], correctIndex: 2, explanation: "Phase 1 is Assessment & Planning (Risk assessments, gap analysis)." },
  { prompt: "Why is it important to verify the actual strength of security personnel at each camp?", options: ["To reduce their pay", "For effective welfare and feeding planning", "To buy them cars", "To send them on leave"], correctIndex: 1, explanation: "Accurate numbers are needed to properly plan welfare and meals and avoid wastage." },
  { prompt: "What is one of the key success factors for camp security?", options: ["Adequate funding and Leadership commitment", "Ignoring SOPs", "Hiring untrained guards", "Reducing communication"], correctIndex: 0, explanation: "Adequate funding and Leadership commitment are key success factors." },
  { prompt: "What is a recommended action to ensure compliance with security standards?", options: ["Relying entirely on remote cameras", "Conducting periodic visits and inspections of all camps", "Ignoring camper feedback", "Removing security officers"], correctIndex: 1, explanation: "Periodic visits and inspections ensure compliance and verify personnel strength." }
];

const eaLessons = [
  {
    key: "ea-executive-coordination",
    title: "Executive Coordination & Operations",
    minutes: 45,
    summary: "Managing protocol, logistics, and executive commitments.",
    attachments: [
      { title: "Executive Assistants Presentation (PDF)", url: "/docs/eas-presentation.pdf" }
    ],
    sections: [
      {
        heading: "Executive Engagements",
        body: [
          "- **Role:** Coordinating visit schedules, executive calendars, protocol, and reception arrangements.",
          "- **Highlights:** Hosted high-profile visits including the IGP, Minister of Foreign Affairs, and the NLNG Delegation.",
          "- **Internal Events:** The EA team successfully organized the Ramadan IFTAR Dinner and DICON Staff Luncheon."
        ]
      },
      {
        heading: "Operational Support",
        body: [
          "- **Interventions:** Coordinating emergency travel for stranded staff, facilitating prompt payment of urgent hospital bills, and managing petty cash reconciliation.",
          "- **Goal:** Resolving day-to-day operational issues requiring immediate attention without unnecessary escalation to the Chairman."
        ]
      }
    ],
    takeaways: ["Resolve operational issues proactively before escalating", "Organize Ramadan Iftar and DICON staff luncheon", "Manage protocol and executive calendars efficiently"]
  },
  {
    key: "ea-communication-framework",
    title: "Executive Access & Communication Framework",
    minutes: 45,
    summary: "Implementing a structured communication protocol for H2 2026.",
    sections: [
      {
        heading: "Structured Access Management",
        body: [
          "- **Objective:** Implement a more structured communication and access management process to the Chairman.",
          "- **Rule:** Ensure operational matters are first escalated through appropriate reporting lines before reaching the executive office."
        ]
      },
      {
        heading: "Expected Outcomes",
        body: [
          "- Reduced non-strategic interruptions to the Chairman.",
          "- Improved adherence to organizational reporting structure.",
          "- Increased executive productivity and focus on strategic priorities."
        ]
      }
    ],
    takeaways: ["Enforce the organizational reporting structure", "Protect the Chairman's time for strategic priorities", "Reduce non-strategic interruptions"]
  }
];

const eaQuiz = [
  { prompt: "What is the primary goal of the new Executive Access & Communication Framework?", options: ["To prevent anyone from speaking to the Chairman", "To ensure operational matters escalate through appropriate reporting lines before reaching the executive office", "To eliminate all meetings", "To automate the Chairman's email"], correctIndex: 1, explanation: "The framework ensures adherence to the chain of command, reducing non-strategic interruptions." },
  { prompt: "What is one of the operational support tasks handled by the EAs?", options: ["Designing company logos", "Facilitating prompt payment of urgent hospital bills for staff", "Repairing company vehicles", "Writing software code"], correctIndex: 1, explanation: "EAs manage urgent welfare matters like hospital bills to prevent unnecessary escalation." },
  { prompt: "Why is it important to reduce non-strategic interruptions to the Chairman?", options: ["Because the Chairman doesn't like staff", "To protect the Chairman's time for organizational strategic priorities", "To make the EAs look busy", "Because there is no office space"], correctIndex: 1, explanation: "Reducing interruptions allows the Chairman to focus on strategic leadership." },
  { prompt: "Which of these delegations was successfully hosted by the Executive Office in H1?", options: ["The United Nations", "The Inspector General of Police (IGP) and NLNG Delegation", "The World Bank", "FIFA Officials"], correctIndex: 1, explanation: "The IGP, Minister of Foreign Affairs, and NLNG were among the notable visitors." },
  { prompt: "What is required before a routine operational issue reaches the Chairman's office?", options: ["A written letter", "It must be escalated through the appropriate departmental reporting lines first", "A board resolution", "A public announcement"], correctIndex: 1, explanation: "Routine issues must follow the chain of command to enforce accountability among managers." },
  { prompt: "What administrative task helps maintain smooth executive office operations?", options: ["Cleaning the entire building", "Managing petty cash reconciliation and vendor engagements", "Driving the staff bus", "Fixing the IT network"], correctIndex: 1, explanation: "Petty cash and vendor management are key EA administrative duties." },
  { prompt: "How do the EAs handle staff-related emergencies like stranded staff?", options: ["They ignore them", "They proactively coordinate emergency travel support to resolve it before escalation", "They immediately call the Chairman", "They tell the staff to wait"], correctIndex: 1, explanation: "EAs proactively resolve these emergencies to spare the Chairman's time." },
  { prompt: "What is an expected outcome of better accountability among managers?", options: ["More complaints", "Faster resolution of operational issues at the departmental level", "More meetings with the Chairman", "Slower decision making"], correctIndex: 1, explanation: "Accountable managers resolve issues faster at their own level." },
  { prompt: "What internal event was organized by the EA team?", options: ["The Annual General Meeting", "The Ramadan IFTAR Dinner and DICON Staff Luncheon", "The Company Marathon", "The Tech Summit"], correctIndex: 1, explanation: "The EAs successfully organized the Ramadan Iftar and DICON luncheon." },
  { prompt: "What must be maintained when handling sensitive corporate information and executive correspondence?", options: ["Public transparency", "Strict confidentiality", "Social media sharing", "Office gossip"], correctIndex: 1, explanation: "Strict confidentiality is a critical requirement for EAs." }
];

const luftLessons = [
  {
    key: "luft-growth-bottlenecks",
    title: "Managing Growth & Bottlenecks",
    minutes: 45,
    summary: "Addressing operational friction amidst a 32% increase in vehicle demand.",
    attachments: [
      { title: "Luftreiber H2 2026 Strategic Plan (PDF)", url: "/docs/luftreiber-h2-2026-strategic-plan.pdf" }
    ],
    sections: [
      {
        heading: "H1 Growth Review",
        body: [
          "- **Growth:** +32.1% Vehicles Received, +26.0% Revenue Activity.",
          "- **Successes:** Toyota Partnership, structured customer follow-up, improved workshop visibility."
        ]
      },
      {
        heading: "Current Challenges",
        body: [
          "- **Staffing:** Vacant key roles (diagnostics, AC technicians, front desk) causing delays.",
          "- **Vendors:** Vendor pressure and parts delays due to outstanding debts.",
          "- **Space:** Workshop congestion limiting bodyshop and vehicle flow."
        ]
      }
    ],
    takeaways: ["Address vacant technician roles to stop bottlenecks", "Reduce vendor pressure to improve parts delivery", "Separate the bodyshop to reduce workshop congestion"]
  },
  {
    key: "luft-system-ev",
    title: "Systems, EV Readiness & Expansion",
    minutes: 45,
    summary: "Building an in-house garage system and preparing for Electric Vehicles.",
    sections: [
      {
        heading: "In-House Garage System",
        body: [
          "- **Requirement:** Build an in-house system with modules for job cards, inventory, procurement, invoicing, and reporting to replace manual tracking."
        ]
      },
      {
        heading: "EV Market Readiness",
        body: [
          "- **Challenge:** Huge EV demand is growing, but the center is not yet strongly positioned.",
          "- **Action (Phase 1):** Fast-track EV readiness for minor inspections and low-risk repairs, and build partnerships with EV sellers."
        ]
      }
    ],
    takeaways: ["Adopt an in-house garage system for end-to-end tracking", "Prepare for EV minor inspections and low-risk repairs", "Partner with EV car sellers"]
  }
];

const luftQuiz = [
  { prompt: "What was the percentage increase in Vehicles Received in H1 2026?", options: ["+10.5%", "+18.2%", "+26.0%", "+32.1%"], correctIndex: 3, explanation: "Vehicles received increased by a massive 32.1%." },
  { prompt: "What is causing slow parts delivery and vendor pressure at Luftreiber?", options: ["Traffic jams", "Outstanding debts", "Lack of internet", "Vendors closed down"], correctIndex: 1, explanation: "Vendor pressure and parts delays are due to outstanding debts." },
  { prompt: "What is the recommended solution for workshop congestion?", options: ["Stop accepting cars", "Pursue expansion or a nearby location to separate the bodyshop", "Stack cars on top of each other", "Work only at night"], correctIndex: 1, explanation: "Expanding to a nearby location to separate the bodyshop is recommended." },
  { prompt: "What major automotive partnership was secured in H1 2026?", options: ["Ford", "Toyota", "Honda", "Tesla"], correctIndex: 1, explanation: "Luftreiber successfully established a Toyota Partnership." },
  { prompt: "What is the primary goal regarding Electric Vehicles (EVs) in Phase 1?", options: ["Manufacture an EV", "Fast-track readiness for minor inspections and low-risk repairs", "Ignore EVs completely", "Only service EVs from now on"], correctIndex: 1, explanation: "Phase 1 focuses on EV readiness for minor inspections and low-risk repairs." },
  { prompt: "What system is required to replace weak job tracking and manual updates?", options: ["A paper ledger", "An In-House Garage System (job cards, inventory, CRM)", "WhatsApp groups", "Sticky notes"], correctIndex: 1, explanation: "An in-house garage system is required for end-to-end operational control." },
  { prompt: "Which critical technical roles are currently vacant and causing bottlenecks?", options: ["Painters and cleaners", "Diagnostic, AC, and Electrical technicians (Japanese & German cars)", "Salesmen", "Security guards"], correctIndex: 1, explanation: "A lack of diagnostic and specialized technicians is causing delays." },
  { prompt: "What is the core theme of Luftreiber's H2 Strategic Plan?", options: ["Downsizing the business", "Building structure behind growth", "Moving to a new city", "Stopping all marketing"], correctIndex: 1, explanation: "The theme is 'Building structure behind growth'." },
  { prompt: "What is a key strategy for capturing EV market share?", options: ["Building partnerships with EV car sellers", "Banning petrol cars", "Selling EV batteries", "Offering free car washes"], correctIndex: 0, explanation: "Building partnerships with EV sellers is a key strategic move." },
  { prompt: "Why must vendor pressure be resolved urgently?", options: ["To make friends", "To rebuild supplier confidence and reduce turnaround times for parts", "Because it is a legal requirement", "To save paper"], correctIndex: 1, explanation: "Clearing debts and rebuilding confidence ensures parts arrive on time." }
];

async function run() {
  try {
    const securityContent = JSON.stringify({ lessons: securityLessons, quiz: securityQuiz });
    const eaContent = JSON.stringify({ lessons: eaLessons, quiz: eaQuiz });
    const luftContent = JSON.stringify({ lessons: luftLessons, quiz: luftQuiz });

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
      // Security
      'camps-security-strategic-plan',
      'Camps Security & Military Welfare Plan',
      'Defensive infrastructure, threat detection technologies, and military personnel welfare management across 17 camps.',
      'Intelligence & Security',
      'Advanced',
      'Online',
      3,
      0,
      'EIB Group',
      securityContent,
      'michael.marquis@eibgroup.com',

      // EAs
      'executive-access-communication-framework',
      'Executive Access & Communication Framework',
      'Protocol for managing executive time, enforcing chain of command, and handling operational interventions.',
      'Operational',
      'Intermediate',
      'Online',
      2,
      0,
      'EIB Group',
      eaContent,
      'michael.marquis@eibgroup.com',

      // Luftreiber
      'luftreiber-h2-growth-structure',
      'Luftreiber Automobile: Building Structure Behind Growth',
      'Resolving workshop bottlenecks, managing vendor debts, and preparing for the Electric Vehicle (EV) market.',
      'Operational',
      'Advanced',
      'Online',
      3,
      0,
      'Luftreiber Automobile',
      luftContent,
      'michael.marquis@eibgroup.com'
    ]);

    console.log('Successfully inserted Security, EAs, and Luftreiber courses!');
  } catch(e) {
    console.error('Error inserting courses', e);
  } finally {
    process.exit(0);
  }
}

run();
