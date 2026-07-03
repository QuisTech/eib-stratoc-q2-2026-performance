const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

const corpCorpLessons = [
  {
    key: "corp-corps-90-day",
    title: "Corporate Comms 90-Day Strategy",
    minutes: 45,
    summary: "The 90-day strategic plan for the Corporate Communications & Media Department.",
    attachments: [
      { title: "Raw Corporate Communications Strategy Plan", url: "/docs/batch-9-raw-input.txt" }
    ],
    sections: [
      {
        heading: "Three-Phase Roadmap",
        body: [
          "- **Phase 1 (Days 1-30):** Foundation & Structure (Communication audit, CMS setup).",
          "- **Phase 2 (Days 31-60):** Visibility & Engagement (Content campaigns, video storytelling, media relations).",
          "- **Phase 3 (Days 61-90):** Optimization & Growth (Performance review, strategy refinement)."
        ]
      },
      {
        heading: "Subsidiary Digital Operations",
        body: [
          "- Providing dedicated mobile devices to 8 subsidiaries (e.g. Briech UAS, Luft Pay TV, EIB Stratoc, BEF) to manage official social media.",
          "- **Total Estimated 90-Day Budget:** ₦18,900,000."
        ]
      }
    ],
    takeaways: ["Deploy dedicated devices to subsidiaries for real-time content", "Host quarterly media parleys", "Total budget allocated is ₦18.9M"]
  }
];

const corpCorpQuiz = [
  { prompt: "What is the primary focus of Phase 2 (Days 31-60) in the Corporate Communications plan?", options: ["Foundation and Structure", "Visibility and Engagement", "Optimization and Growth", "Hiring new staff"], correctIndex: 1, explanation: "Phase 2 focuses on Visibility and Engagement." },
  { prompt: "How many subsidiaries are recommended to receive dedicated communication devices?", options: ["2", "4", "8", "10"], correctIndex: 2, explanation: "8 subsidiaries are recommended to receive dedicated devices." },
  { prompt: "What is the total estimated 90-day budget for the Corporate Communications plan?", options: ["₦3,500,000", "₦6,500,000", "₦8,000,000", "₦18,900,000"], correctIndex: 3, explanation: "The total estimated budget is ₦18.9 million." },
  { prompt: "What is the purpose of the Quarterly Media Parley?", options: ["To complain about journalists", "To build relationships with journalists, showcase achievements, and improve public perception", "To hire reporters", "To play games"], correctIndex: 1, explanation: "The parley is designed to build media relationships and improve public perception." },
  { prompt: "Which of these is listed as a Team Development Area?", options: ["AI-Assisted Content Creation", "Plumbing", "Electrical Engineering", "Cooking"], correctIndex: 0, explanation: "AI-Assisted Content Creation is a key team development area." }
];

const briechUasLessons = [
  {
    key: "briech-uas-operations",
    title: "Briech UAS Q1/Q2 Operational Milestones",
    minutes: 45,
    summary: "Significant operational deployments, military training, and drone production.",
    attachments: [
      { title: "Raw Briech UAS Operations Review", url: "/docs/batch-9-raw-input.txt" }
    ],
    sections: [
      {
        heading: "Military Support & Production",
        body: [
          "- **Training:** Trained 16 Nigerian Army personnel on FPV Kamikaze drone operations.",
          "- **Production:** Produced and deployed 60 FPV drone systems for the Ministry of Defense and Zamfara State.",
          "- **MoU Signed:** Successfully signed a Memorandum of Understanding with DICON (Defence Industries Corporation of Nigeria).",
          "- **Tactical Design:** Specifically designed the Argini Bomb Carrier for tactical payload deployment.",
          "- **Funding:** Received a critical imprest allocation of ₦8,000,000 to support operational and deployment activities."
        ]
      },
      {
        heading: "Commercial Reconnaissance",
        body: [
          "- Conducted aerial reconnaissance at the Ngaski Mining Site for potential commercial engagement."
        ]
      }
    ],
    takeaways: ["Completed training for 16 Army personnel", "Signed strategic MoU with DICON", "Produced 60 FPV Drones"]
  },
  {
    key: "briech-uas-qms-safety",
    title: "Briech UAS Quality & Safety Management",
    minutes: 45,
    summary: "Development of indigenous QMS software and maintaining a zero-incident safety record.",
    sections: [
      {
        heading: "Indigenous QMS Software",
        body: [
          "- Developing in-house Quality Management System (QMS) software to automate quality control, track defect rates, and monitor component reliability."
        ]
      },
      {
        heading: "Safety & Compliance",
        body: [
          "- Preparing documentation (Safety Management Manual, Operations Manual) for NCAA regulatory certification.",
          "- Achieved zero fatal incidents and zero major accidents during intensive H1 deployments."
        ]
      }
    ],
    takeaways: ["Develop indigenous QMS software", "Maintain NCAA compliance", "Prioritize Crew Resource Management (CRM)"]
  }
];

const briechUasQuiz = [
  { prompt: "How many Nigerian Army personnel were trained on FPV Kamikaze drone operations?", options: ["5", "10", "16", "50"], correctIndex: 2, explanation: "16 personnel successfully completed the training." },
  { prompt: "How many FPV drone systems were produced and deployed in Q2?", options: ["10", "30", "60", "100"], correctIndex: 2, explanation: "60 FPV drone systems were produced." },
  { prompt: "With which major government corporation did Briech UAS sign a Memorandum of Understanding (MoU)?", options: ["NNPC", "DICON (Defence Industries Corporation of Nigeria)", "CBN", "NTA"], correctIndex: 1, explanation: "An MoU was signed with DICON to advance indigenous defense technology." },
  { prompt: "Where did Briech UAS conduct an aerial reconnaissance operation for potential commercial engagement?", options: ["A shopping mall in Abuja", "Ngaski Mining Site in Kebbi State", "A farm in Lagos", "A school in Kano"], correctIndex: 1, explanation: "The reconnaissance was conducted at the Ngaski Mining Site." },
  { prompt: "What is the purpose of the indigenous QMS software being developed by Briech UAS?", options: ["To play video games", "To automate quality control, track defect rates, and manage documentation", "To hack computers", "To edit photos"], correctIndex: 1, explanation: "The QMS software is designed to automate and improve quality assurance." },
  { prompt: "What regulatory body is Briech UAS preparing certification documentation for?", options: ["NCAA (Nigerian Civil Aviation Authority)", "FRSC", "EFCC", "NAFDAC"], correctIndex: 0, explanation: "Briech UAS is preparing for NCAA certification." },
  { prompt: "What was the safety record for Briech UAS during the reporting period?", options: ["Many drone crashes", "Zero fatal incidents and zero major accidents", "Lost all drones", "Three minor injuries"], correctIndex: 1, explanation: "The company achieved a stellar safety record with zero fatal or major accidents." },
  { prompt: "What specific system was designed for the Argini drone?", options: ["A new paint job", "A Bomb Carrier", "A louder siren", "A parachute"], correctIndex: 1, explanation: "The Argini Bomb Carrier was designed for tactical payload deployment." },
  { prompt: "What was the imprest allocation received by Briech UAS to support operational activities?", options: ["₦1,000,000", "₦8,000,000", "₦20,000,000", "₦50,000,000"], correctIndex: 1, explanation: "The imprest allocation was ₦8,000,000." },
  { prompt: "What human factor programme was heavily emphasized to reduce operational risk?", options: ["Typing speed training", "Crew Resource Management (CRM)", "Public speaking", "Customer service"], correctIndex: 1, explanation: "CRM and human factors awareness were heavily emphasized." }
];

const blackLessons = [
  {
    key: "black-intel-clandestine",
    title: "Black: Intelligence & Clandestine Ops",
    minutes: 45,
    summary: "H1 performance and H2 strategic roadmap for corporate intelligence.",
    attachments: [
      { title: "Raw Black Clandestine Operations Plan", url: "/docs/batch-9-raw-input.txt" }
    ],
    sections: [
      {
        heading: "H1 Strategic Achievements",
        body: [
          "- Detected insider threats, completed background verifications, and executed executive protection missions.",
          "- Established an intelligence reporting framework and supported major business negotiations through due diligence."
        ]
      },
      {
        heading: "H2 Priorities & KPIs",
        body: [
          "- Establishing a Corporate Intelligence Fusion Centre and Digital Intelligence Platform.",
          "- Developing an Insider Threat Programme.",
          "- **KPI Targets:** 100 Intelligence Briefs, 95% investigation completion rate, and a 40% reduction in insider threats."
        ]
      }
    ],
    takeaways: ["Intelligence is a strategic capability, not just a security function", "Target a 40% reduction in insider threats in H2", "Deploy an Executive Threat Monitoring Dashboard"]
  }
];

const blackQuiz = [
  { prompt: "What is the stated theme of the Mid-Year Black Presentation?", options: ["Making more money", "Strengthening Corporate Intelligence and Protecting Strategic Assets", "Building new offices", "Hiring more guards"], correctIndex: 1, explanation: "The theme is strengthening corporate intelligence and protecting assets." },
  { prompt: "What is one of the H2 Strategic Priorities for the Directorate of Intelligence?", options: ["Buying a private jet", "Establishing a Corporate Intelligence Fusion Centre", "Closing down the security team", "Outsourcing all security"], correctIndex: 1, explanation: "Establishing the Fusion Centre is a key priority." },
  { prompt: "What is the KPI target for the investigation completion rate in H2?", options: ["50%", "75%", "95%", "100%"], correctIndex: 2, explanation: "The target completion rate for investigations is 95%." },
  { prompt: "What is the targeted percentage reduction in Insider Threats for H2?", options: ["10%", "20%", "40%", "100%"], correctIndex: 2, explanation: "The goal is a 40% reduction in insider threats." },
  { prompt: "According to the presentation, what is intelligence no longer considered to be?", options: ["Merely a security function (it is a strategic capability)", "Important", "Expensive", "Useful"], correctIndex: 0, explanation: "Intelligence is now a strategic capability, not just a security function." }
];

async function run() {
  try {
    const corpCorpContent = JSON.stringify({ lessons: corpCorpLessons, quiz: corpCorpQuiz });
    const briechUasContent = JSON.stringify({ lessons: briechUasLessons, quiz: briechUasQuiz });
    const blackContent = JSON.stringify({ lessons: blackLessons, quiz: blackQuiz });

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
      // Corp Corps
      'corp-communications-90-day-strategy',
      'Corporate Comms: 90-Day Strategy',
      'Strategic roadmap to reposition corporate communications, manage media relations, and boost digital presence.',
      'Operational',
      'Intermediate',
      'Online',
      2,
      0,
      'EIB Group',
      corpCorpContent,
      'michael.marquis@eibgroup.com',

      // Briech UAS
      'briech-uas-q2-operations',
      'Briech UAS: Operations & Tech Development',
      'Comprehensive report on military operational support, kamikaze drone production, and NCAA regulatory compliance.',
      'Technical',
      'Advanced',
      'Online',
      4,
      0,
      'Briech UAS',
      briechUasContent,
      'michael.marquis@eibgroup.com',

      // Black
      'black-intelligence-clandestine-ops',
      'Black: Intelligence & Clandestine Ops',
      'Strategic briefing on corporate intelligence fusion, threat monitoring, and the insider threat program.',
      'Safety & Compliance',
      'Advanced',
      'Online',
      3,
      0,
      'BLACK',
      blackContent,
      'michael.marquis@eibgroup.com'
    ]);

    console.log('Successfully inserted Corp Corps, Briech UAS, and Black courses!');
  } catch(e) {
    console.error('Error inserting courses', e);
  } finally {
    process.exit(0);
  }
}

run();
