const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

const befLessons = [
  {
    key: "bef-community-health",
    title: "Community Health & Education Support",
    minutes: 45,
    summary: "Executing health outreach and back-to-school programs.",
    attachments: [
      { title: "BEF Q3 2026 Workplan (PDF)", url: "/docs/bef-q3-2026-workplan.pdf" }
    ],
    sections: [
      {
        heading: "Community Health Outreach (Piwoyi & Idu)",
        body: [
          "- **Objective:** Equip facilities with certified medical equipment.",
          "- **Activities:** Hospital assessment, procurement, and distribution of medical equipment to ensure resuscitation, diagnostics, and obstetric capabilities."
        ]
      },
      {
        heading: "Back-to-School Support Project",
        body: [
          "- **Objective:** Improve access to quality education for vulnerable pupils.",
          "- **Activities:** Register pupils, procure bags, books, and sandals, distribute learning kits, and document the process."
        ]
      },
      {
        heading: "Budget & Program Logistics",
        body: [
          "- **Logistics Support:** A total vehicle budget of 400,000 NGN is allocated for Q3 2026 program delivery.",
          "- **Usage:** This budget covers fuelling and maintenance logistics to support field operations."
        ]
      }
    ],
    takeaways: ["Focus on Piwoyi & Idu for health outreach", "Supply essential learning materials to vulnerable pupils", "Ensure obstetric capabilities in community health", "Vehicle budget of 400,000 NGN covers fuel and logistics"]
  },
  {
    key: "bef-sgbv-leadership",
    title: "SGBV Prevention & Youth Leadership",
    minutes: 45,
    summary: "Promoting gender-based violence awareness and youth empowerment.",
    sections: [
      {
        heading: "SGBV Awareness & Prevention (July)",
        body: [
          "- **Objective:** Increase awareness on sexual & gender-based violence.",
          "- **Activities:** Sensitization sessions, referral pathway awareness, and compiling key metrics."
        ]
      },
      {
        heading: "Youth Leadership Program (August)",
        body: [
          "- **Objective:** Build leadership and life skills, encourage civic engagement.",
          "- **Activities:** Skills acquisition and leadership training sessions tied to International Youth Day in August."
        ]
      },
      {
        heading: "Monitoring, Evaluation & Learning (July Assessment)",
        body: [
          "- **H1 Impact Review:** In July, the foundation conducts a thorough M&E assessment to review impact from the first half of the year and identify lessons learned."
        ]
      }
    ],
    takeaways: ["Promote SGBV referral pathway awareness", "Host leadership training for International Youth Day", "Encourage civic engagement among youth", "July M&E review for H1 impact evaluation"]
  }
];

const befQuiz = [
  { prompt: "Which two locations are targeted for the Community Health Outreach?", options: ["Wuse & Garki", "Piwoyi & Idu", "Maitama & Asokoro", "Nyanya & Karu"], correctIndex: 1, explanation: "Piwoyi and Idu are the target communities for the health outreach." },
  { prompt: "What is the primary activity for the Back-to-School Support Project?", options: ["Building new classrooms", "Providing bags, books, and sandals to vulnerable pupils", "Hiring new teachers", "Buying school buses"], correctIndex: 1, explanation: "The project provides essential learning materials like bags and books." },
  { prompt: "What is the focus of the August 2026 program?", options: ["Agricultural training", "International Youth Day — Youth Leadership Program", "Road construction", "Senior citizen support"], correctIndex: 1, explanation: "August focuses on youth leadership for International Youth Day." },
  { prompt: "What is the total vehicle budget for Q3 2026 program delivery?", options: ["100,000 NGN", "200,000 NGN", "400,000 NGN", "1,000,000 NGN"], correctIndex: 2, explanation: "The total vehicle budget is 400,000 NGN." },
  { prompt: "What is one of the key activities for SGBV Awareness?", options: ["Distributing food", "Promoting referral pathway awareness", "Building shelters", "Fundraising galas"], correctIndex: 1, explanation: "Promoting referral pathway awareness is a key activity for SGBV prevention." },
  { prompt: "What is the purpose of the July M&E Assessment?", options: ["To fire underperforming staff", "To assess impact from the first half of the year and identify lessons learned", "To increase salaries", "To change the foundation's name"], correctIndex: 1, explanation: "The assessment evaluates impact and identifies lessons learned." },
  { prompt: "What kind of capabilities must the procured medical equipment support?", options: ["Only first aid", "Resuscitation, diagnostics, and obstetric capabilities", "Dental only", "Cosmetic surgery"], correctIndex: 1, explanation: "The equipment must support resuscitation, diagnostics, and obstetrics." },
  { prompt: "What is required before distributing the back-to-school kits?", options: ["A TV commercial", "Registering beneficiary pupils through schools", "Approval from the Mayor", "A parent-teacher meeting"], correctIndex: 1, explanation: "Pupils must be registered through schools before distribution." },
  { prompt: "Which of these is a core goal of the Bright Echefu Foundation?", options: ["Selling insurance", "Promoting community development and youth empowerment", "Real estate development", "Broadcasting news"], correctIndex: 1, explanation: "Community development and youth empowerment are core goals." },
  { prompt: "What does the 400,000 NGN vehicle budget cover?", options: ["Buying a new car", "Fuelling and Maintenance Logistics", "Driver salaries only", "Toll gate fees only"], correctIndex: 1, explanation: "It covers fuelling and maintenance logistics for program delivery." }
];

const brightfmLessons = [
  {
    key: "brightfm-content-audience",
    title: "Content Improvement & Audience Growth",
    minutes: 45,
    summary: "Strengthening program identity and audience engagement.",
    attachments: [
      { title: "Bright FM 90-Day Action Plan (PDF)", url: "/docs/bright-fm-90-day-action-plan.pdf" },
      { title: "Bright FM Lean Growth Budget (PDF)", url: "/docs/bright-fm-lean-growth-budget.pdf" }
    ],
    sections: [
      {
        heading: "Content Improvement",
        body: [
          "- **Action:** Review existing programmes, improve segment structure, strengthen storytelling.",
          "- **Goal:** Build a stronger radio brand with better programme consistency."
        ]
      },
      {
        heading: "Audience Growth & Engagement",
        body: [
          "- **Action:** Increase audience interaction, promote programmes effectively, create relatable content.",
          "- **Measurement:** Increased listener participation and stronger social media engagement."
        ]
      },
      {
        heading: "Digital Presence Expansion",
        body: [
          "- **Online Integration:** Extend radio content beyond traditional broadcasting through online sharing, podcasts, and digital channels."
        ]
      }
    ],
    takeaways: ["Improve segment structure and storytelling", "Increase listener participation and digital visibility", "Extend radio content beyond traditional broadcasting"]
  },
  {
    key: "brightfm-commercial-hr",
    title: "Commercial Packaging & HR Additions",
    minutes: 45,
    summary: "Expanding the team to drive revenue and commercial packaging.",
    sections: [
      {
        heading: "Strengthening the Team",
        body: [
          "Bright FM requires **Two (2) Radio Marketers** to actively reach out to advertisers and find sponsorship opportunities, and **Two (2) Experienced Radio Presenters** to improve programme delivery and storytelling."
        ]
      },
      {
        heading: "Programme Branding & Commercial Packaging",
        body: [
          "- **Action:** Identify programmes with sponsorship potential and develop clearer value propositions for advertisers.",
          "- **Budget:** 1,550,000 NGN allocated over 3 months as a strategic growth investment, not a survival budget. Month 1 focuses on Foundation & Audience Acquisition."
        ]
      },
      {
        heading: "Month 1 Action Plan & Budget Allocations",
        body: [
          "- **Giveaway Incentives:** 400,000 NGN is budgeted in Month 1 for Audience giveaways, including souvenirs, coupons, and recharge cards.",
          "- **Performance Improvement Metrics:** Internal success will be measured by better workflow, timely reporting, and improved accountability."
        ]
      }
    ],
    takeaways: ["Hire 2 Marketers and 2 Presenters", "Identify sponsorship potential for programmes", "View the 3-month budget as a strategic growth investment", "400,000 NGN giveaways in Month 1 for souvenirs and coupons"]
  }
];

const brightfmQuiz = [
  { prompt: "What is the total 3-Month Strategic Growth Budget for Bright FM?", options: ["500,000 NGN", "930,000 NGN", "1,550,000 NGN", "2,000,000 NGN"], correctIndex: 2, explanation: "The total 3-month budget is 1,550,000 NGN." },
  { prompt: "How many Radio Marketers is Bright FM planning to hire?", options: ["One", "Two", "Three", "Five"], correctIndex: 1, explanation: "The plan requires two dedicated radio marketers." },
  { prompt: "How many Experienced Radio Presenters is Bright FM planning to hire?", options: ["One", "Two", "Four", "None"], correctIndex: 1, explanation: "The plan requires two experienced radio presenters." },
  { prompt: "What is a primary responsibility of the new Radio Marketers?", options: ["Reading the news", "Fixing the transmitter", "Finding sponsorship opportunities and reaching out to advertisers", "Cleaning the studio"], correctIndex: 2, explanation: "Marketers will actively seek sponsorships and advertisers." },
  { prompt: "What is the primary focus of Month 1 in the budget plan?", options: ["Consolidation", "Foundation & Audience Acquisition", "Laying off staff", "Buying new transmitters"], correctIndex: 1, explanation: "Month 1 focuses on Foundation and Audience Acquisition." },
  { prompt: "Why is the 3-month budget described as a 'strategic growth investment' rather than a survival budget?", options: ["Because they have no money", "Because core operational expenses (diesel, power) are supported by the parent company", "Because it is funded by a bank loan", "Because radio is very cheap to run"], correctIndex: 1, explanation: "Parent company EIB Group covers major operational costs, allowing this budget to focus on growth." },
  { prompt: "What is one way Bright FM plans to improve its Digital Presence?", options: ["Extending radio content beyond traditional broadcasting through online sharing", "Shutting down social media", "Only broadcasting on AM", "Printing newspapers"], correctIndex: 0, explanation: "Extending content online improves digital presence." },
  { prompt: "What is targeted under 'Programme Branding & Commercial Packaging'?", options: ["Buying new microphones", "Identifying programmes with sponsorship potential and developing value propositions", "Changing the station's frequency", "Playing more music"], correctIndex: 1, explanation: "The goal is to package programmes for sponsorship." },
  { prompt: "What item is budgeted at 400,000 NGN in Month 1 for Audience giveaways?", options: ["A car", "Souvenirs, Coupons, Recharge Cards", "A new studio desk", "Billboard advertising"], correctIndex: 1, explanation: "400,000 NGN is allocated for souvenirs and recharge cards for giveaways." },
  { prompt: "What is a key metric for measuring 'Internal Performance Improvement'?", options: ["More songs played per hour", "Better workflow, timely reporting, and improved accountability", "Number of phone calls received", "Higher electricity bills"], correctIndex: 1, explanation: "Better workflow and accountability measure internal performance." }
];

const workflowLessons = [
  {
    key: "workflow-standardization",
    title: "Standardization & Digital Transformation",
    minutes: 45,
    summary: "Transitioning subsidiaries from manual processes to technology-driven operations.",
    attachments: [
      { title: "EIB Organizational Structure & Process Optimization (PDF)", url: "/docs/eib-organizational-structure-optimization.pdf" }
    ],
    sections: [
      {
        heading: "Standardize Procedures & Automate",
        body: [
          "- **Action:** Unified operating procedures across all six subsidiaries.",
          "- **Digital Transformation:** Adopt digital workflow systems and ERP (Enterprise Resource Planning) platforms to replace manual bottlenecks."
        ]
      },
      {
        heading: "Decentralize Authority",
        body: [
          "Delegate decision-making to reduce bottlenecks. For example, Bright FM suffers from 'High GM dependence' leading to delayed decisions due to the lack of a structured Commercial (Sales & Marketing) Unit.",
          "- **Action Plan Phases:** Phase I is Assessment & Stabilization (focusing on KPIs, SOPs); Phase II is Performance & Growth; Phase III is Optimization & Capacity."
        ]
      },
      {
        heading: "Transformation Goal",
        body: [
          "- **Institutional Maturity:** The ultimate goal of this transformation is increased scalability and a coordinated corporate ecosystem."
        ]
      }
    ],
    takeaways: ["Implement ERP systems to replace manual workflows", "Standardize operating procedures", "Decentralize authority to speed up decisions", "Phase I focuses on Assessment & Stabilization", "Ultimate goal is increased scalability"]
  },
  {
    key: "workflow-subsidiary-gaps",
    title: "Subsidiary Workflow Optimizations",
    minutes: 45,
    summary: "Addressing specific operational bottlenecks across EIB Group subsidiaries.",
    sections: [
      {
        heading: "POCTOVA & EIB Stratoc",
        body: [
          "- **POCTOVA (Garments):** Needs an ERP for inventory to replace manual tracking and streamline multiple approval bottlenecks.",
          "- **EIB Stratoc (Security):** Needs a digital reporting platform and AI-assisted tools to replace manual logging across its 11-Step Workflow. This workflow incorporates three levels of escalation: Routine, Significant, and Critical."
        ]
      },
      {
        heading: "Luftreiber Automobile & Briech Atlantic",
        body: [
          "- **Luftreiber:** Suffers from a single diagnostic technician bottleneck; requires an independent QA function.",
          "- **Briech Atlantic (Real Estate):** Needs an independent QA function to mitigate quality risk, and a dedicated customer experience function."
        ]
      }
    ],
    takeaways: ["POCTOVA needs an ERP for inventory", "EIB Stratoc has 3 levels of escalation (Routine, Significant, Critical)", "Luftreiber needs independent QA and more technicians"]
  }
];

const workflowQuiz = [
  { prompt: "Which subsidiary requires an ERP system to replace manual inventory tracking in its garment production?", options: ["Bright FM", "POCTOVA", "Briech Atlantic", "EIB Stratoc"], correctIndex: 1, explanation: "POCTOVA requires an ERP for its garment manufacturing inventory." },
  { prompt: "What is the recommended solution for Bright FM's 'High GM dependence' bottleneck?", options: ["Fire the GM", "Decentralize authority and delegate decision-making", "Close the station", "Add more administrative layers"], correctIndex: 1, explanation: "Decentralizing authority is recommended to prevent delayed decisions." },
  { prompt: "What major gap was identified in Luftreiber Automobile's service journey?", options: ["They don't fix cars", "A single diagnostic technician creating a bottleneck", "They only service motorcycles", "They have too many QA staff"], correctIndex: 1, explanation: "A single diagnostic technician was identified as a critical bottleneck." },
  { prompt: "What tool is recommended for EIB Stratoc to improve its 11-step surveillance workflow?", options: ["More binoculars", "A digital reporting platform and AI-assisted tools", "Fewer cameras", "Walkie-talkies"], correctIndex: 1, explanation: "Digital reporting and AI tools are recommended to replace manual reporting." },
  { prompt: "What missing function presents a 'Quality risk' at Briech Atlantic?", options: ["No HR department", "No independent QA (Quality Assurance) function", "No accountants", "No architects"], correctIndex: 1, explanation: "The lack of an independent QA function poses a quality risk in construction." },
  { prompt: "What is Phase I of the group-wide Action Plan?", options: ["Performance & Growth", "Assessment & Stabilization", "Optimization & Capacity", "Liquidation"], correctIndex: 1, explanation: "Phase I focuses on Assessment & Stabilization (KPIs, SOPs)." },
  { prompt: "What missing unit is causing revenue constraints at Bright FM?", options: ["Engineering Unit", "Commercial (Sales & Marketing) Unit", "News Unit", "Programming Unit"], correctIndex: 1, explanation: "The lack of a Commercial Unit limits revenue." },
  { prompt: "What is one of the key recommendations across ALL subsidiaries?", policies: [], options: ["Eliminate all managers", "Adopt digital workflow systems and ERP", "Stop all training", "Reduce salaries"], correctIndex: 1, explanation: "Automating and digitizing workflows is a core recommendation." },
  { prompt: "How many levels of escalation exist in EIB Stratoc's workflow?", options: ["One", "Three", "Five", "Ten"], correctIndex: 1, explanation: "There are 3 levels: Routine, Significant, and Critical." },
  { prompt: "What is the ultimate goal of the 'Institutional Maturity' transformation?", options: ["Increased scalability and a coordinated corporate ecosystem", "Making the company smaller", "Selling the company", "Returning to manual processes"], correctIndex: 0, explanation: "The goal is scalability and a coordinated, mature corporate ecosystem." }
];

async function run() {
  try {
    const befContent = JSON.stringify({ lessons: befLessons, quiz: befQuiz });
    const brightfmContent = JSON.stringify({ lessons: brightfmLessons, quiz: brightfmQuiz });
    const workflowContent = JSON.stringify({ lessons: workflowLessons, quiz: workflowQuiz });

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
      // BEF
      'bef-q3-2026-workplan',
      'BEF Q3 2026 Foundation Workplan',
      'Community health outreach, SGBV prevention, and back-to-school support initiatives execution strategy.',
      'Operational',
      'Beginner',
      'Online',
      2,
      0,
      'BEF',
      befContent,
      'michael.marquis@eibgroup.com',

      // Bright FM
      'brightfm-90-day-growth-plan',
      'Bright FM 90-Day Lean Growth & Action Plan',
      'Strategic framework for content improvement, audience growth, and commercial packaging.',
      'Media & Content',
      'Intermediate',
      'Online',
      2,
      0,
      'Bright FM',
      brightfmContent,
      'michael.marquis@eibgroup.com',

      // Interface & Workflow
      'group-workflow-optimization-strategy',
      'EIB Group Workflow & Process Optimization',
      'Group-wide strategy for standardizing procedures, deploying ERPs, and decentralizing authority across subsidiaries.',
      'Operational',
      'Advanced',
      'Online',
      3,
      0,
      'EIB Group',
      workflowContent,
      'michael.marquis@eibgroup.com'
    ]);

    console.log('Successfully inserted BEF, Bright FM, and Workflow courses!');
  } catch(e) {
    console.error('Error inserting courses', e);
  } finally {
    process.exit(0);
  }
}

run();
