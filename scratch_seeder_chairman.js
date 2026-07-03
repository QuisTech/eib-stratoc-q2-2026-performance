const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

const chairmanLessons = [
  {
    key: "h2-strategic-priorities-key-players",
    title: "H2 Strategic Priorities & Key Players",
    minutes: 45,
    summary: "Understand the reflection and recharge framework, the status of struggling subsidiaries, and the 9 designated key players for H2 2026.",
    attachments: [
      { title: "EIB Group Management Meeting Presentation (PDF)", url: "/docs/eib-group-mgt-meeting.pdf" }
    ],
    sections: [
      {
        heading: "Reflection & Recharge Framework",
        body: [
          "The second half of 2026 (July 1 till 31 December 2026) management meeting is structured around two key dimensions:",
          "1. **Reflection on the Last 6 Months**: An analysis of what has been achieved, the challenges faced, and targets that are yet to be met.",
          "2. **Recharge for the Next 6 Months**: Outlining key targets, core deliverables, timelines, dependencies, and strengthening our capacity to innovate."
        ]
      },
      {
        heading: "Struggling Subsidiaries",
        body: [
          "The company has defined clear positions on failed or struggling subsidiaries.",
          "Specifically, **Luft Pay TV** and **Bright FM** are identified as the two struggling subsidiaries requiring tactical intervention or structural review in the H2 2026 plan."
        ]
      },
      {
        heading: "Key Players of H2 2026",
        body: [
          "The Chairman designated exactly 9 key players for the last half of 2026 to drive operational growth and secure organizational security:",
          "1. **Giga Forensics**",
          "2. **EIB Stratoc: Directorate of Intelligence and Clandestine Operations (BLACK)**",
          "3. **EIB Stratoc Limited: Surveillance and Camps Operations**",
          "4. **Briech UAS**",
          "5. **PSAP Project**",
          "6. **Luftreiber Automobile**",
          "7. **POCTOVA**",
          "8. **Briech Atlantic Limited**",
          "9. **Briech Hospital**",
          "Note that struggling subsidiaries like Luft Pay TV are not listed among the key players."
        ]
      }
    ],
    takeaways: ["Identify Luft Pay TV and Bright FM as struggling", "Know the 9 key players for H2 2026", "Understand the reflection & recharge framework"]
  },
  {
    key: "revenue-targets-subsidiary-portfolios",
    title: "Revenue Targets & Subsidiary Portfolios",
    minutes: 45,
    summary: "Analyze the client targets and key products that generate funds across the key subsidiaries.",
    attachments: [
      { title: "EIB Group Management Meeting Presentation (PDF)", url: "/docs/eib-group-mgt-meeting.pdf" }
    ],
    sections: [
      {
        heading: "Giga Forensics and RAW Portfolio",
        body: [
          "Giga Forensics and RAW have a clear revenue projection targeting public, military, and private entities.",
          "**Projected Clients**: Nigerian Army, NYSC, ONSA (Office of the National Security Adviser), DHQ (Defence Headquarters), Nigerian Navy, Nigerian Airforce, DSS (Department of State Services), Police, NLNG, NNPC, NSCDC (Civil Defence), Immigrations, Customs, and 5 State Governments.",
          "**Key Products**: C2 Station, BUAS Station, Orion, Argus, Conference Application, Industry Based RAV, CGAS, Command Ops, Dilarion, and specialized training programs."
        ]
      },
      {
        heading: "Clandestine Operations (BLACK) Portfolio",
        body: [
          "For EIB Stratoc's Directorate of Intelligence and Clandestine Operations (BLACK), the revenue model targets security and regulatory bodies.",
          "**Projected Clients**: INEC, The Presidency, Mining Sites, State Governments (minimum of 8), and the Police."
        ]
      },
      {
        heading: "Surveillance and Camps Operations Portfolio",
        body: [
          "EIB Stratoc's Surveillance and Camps division drives revenue by securing critical infrastructure and regional camps.",
          "**Projected Clients**: NNPC, NLNG, and the state governments of **Plateau, Borno, Kebbi, Niger, Kwara, Yobe, Katsina, Kaduna, Sokoto, and Zamfara**."
        ]
      },
      {
        heading: "Briech UAS Portfolio",
        body: [
          "Briech UAS focuses on unmanned aerial systems and pilot training.",
          "**Projected Clients**: NNPC, ONSA, DSS, Ministry of Defence, Private Security Companies, Immigrations, Customs, Police, Civil Defence, Prisons, and the 10 northern state governments.",
          "**Key Products**: Kamikaze Drones, Fixed Wing Drones, and Drone Operations Training."
        ]
      },
      {
        heading: "PSAP Portfolio",
        body: [
          "The Public Safety Answering Point (PSAP) leverages both government and commercial opportunities.",
          "**Key Products**: PSAP Application, CGAS, Command Ops, Dilarion, and Training.",
          "**Projected Clients**: NYSC, Nigerian Army, Navy, Airforce, ONSA, DHQ, DIA, DSS, Police, NLNG, NNPC, NSCDC, Immigrations, Customs, Chinese/Mining clients, and private citizens through the commercialization of Dilarion, CGAS, and Command Ops."
        ]
      },
      {
        heading: "Luftreiber Automobile Portfolio",
        body: [
          "Luftreiber Automobile's primary focus for H2 is expanding its customer base ('More Customers') and service capacity."
        ]
      },
      {
        heading: "POCTOVA & Briech Atlantic Portfolios",
        body: [
          "**POCTOVA**: Revenue target includes NYSC, DSS, Police, and other security agencies utilizing POCTOVA products.",
          "**Briech Atlantic**: Revenue targets include Security Agencies, State Governments, Federal Government agencies/ministries, South-East Development Commission (SEDC), NDDC, Northeast Development Commission (NEDC), Schools, and Private Citizens."
        ]
      }
    ],
    takeaways: ["Giga Forensics targets Army, Navy, Airforce, DSS, Police, ONSA, NNPC, NLNG", "BLACK targets INEC, Presidency, and min 8 State Govs", "Briech UAS key products include Kamikaze and Fixed Wing drones"]
  },
  {
    key: "process-improvements-capital-projects",
    title: "Key Processes & Capital Projects",
    minutes: 45,
    summary: "Review the group-wide process implementations and major capital projects scheduled for completion by year-end.",
    attachments: [
      { title: "EIB Group Management Meeting Presentation (PDF)", url: "/docs/eib-group-mgt-meeting.pdf" }
    ],
    sections: [
      {
        heading: "Key Processes to be Implemented",
        body: [
          "The Chairman outlined exactly **7 key processes** to be systematically deployed across all subsidiaries to ensure governance, financial control, and growth:",
          "**01. Open revenue accounts** for all subsidiaries to centralize inflow tracking.",
          "**02. Open operations accounts** for all subsidiaries, to be managed by General Managers (GMs) in coordination with the Company Group Accountant.",
          "**03. Special marketing and business development teams** to be set up per subsidiary.",
          "**04. Set up internal control units** and create standardized processes per subsidiary.",
          "**05. Fully operationalize the requisition portal** to govern internal spending.",
          "**06. Prepare monthly performance reports** based on set targets per company and subsidiary.",
          "**07. Set up a central procurement unit** to leverage economies of scale."
        ]
      },
      {
        heading: "Key Capital Projects for Year-End Completion",
        body: [
          "Six (6) major capital projects must be completed before **December 31, 2026** to support the group's operational and infrastructure needs:",
          "1. **Completion of EIB Group Headquarters**.",
          "2. **Completion of the road leading to EIB Group Headquarters (Briech Street)**.",
          "3. **Completion of internal roads** for the EIB Group Headquarters and Briech Hospital.",
          "4. **Completion and equipping of Briech Hospital**.",
          "5. **Expansion of Luftreiber Automobile Yard** and operational workshop.",
          "6. **Expansion of our Data Center capability** and setting up our own Security Operations Center (SOC)."
        ]
      }
    ],
    takeaways: ["Implement the 7 key processes", "Complete the 6 capital projects by Dec 31, 2026", "Set up internal control and central procurement units"]
  }
];

const chairmanQuiz = [
  {
    id: "q1",
    question: "What are the two subsidiaries identified as failed or struggling in the H2 2026 plan?",
    options: [
      "Luft Pay TV and Bright FM",
      "Giga Forensics and POCTOVA",
      "Briech Hospital and Briech UAS",
      "EIB Stratoc and Luftreiber"
    ],
    answer: "Luft Pay TV and Bright FM"
  },
  {
    id: "q2",
    question: "Which of the following is NOT listed as a key player for the last half of 2026?",
    options: [
      "Giga Forensics",
      "Luft Pay TV",
      "Briech UAS",
      "Luftreiber Automobile"
    ],
    answer: "Luft Pay TV"
  },
  {
    id: "q3",
    question: "What are the projected clients for Giga Forensics and RAW in H2 2026?",
    options: [
      "Nigerian Army, NYSC, ONSA, DHQ, Nigerian Navy, Airforce, DSS, Police, NLNG, NNPC, NSCDC, Immigrations, Customs, and 5 State Governments",
      "Local schools and private security companies",
      "Only INEC and the Presidency",
      "Chinese mining companies and agricultural cooperatives"
    ],
    answer: "Nigerian Army, NYSC, ONSA, DHQ, Nigerian Navy, Airforce, DSS, Police, NLNG, NNPC, NSCDC, Immigrations, Customs, and 5 State Governments"
  },
  {
    id: "q4",
    question: "For EIB Stratoc: Directorate of Intelligence and Clandestine Operations (BLACK), who are the targeted H2 revenue clients?",
    options: [
      "INEC, The Presidency, Mining Sites, Minimum of 8 State Governments, and the Police",
      "Private citizens and local businesses",
      "Ministry of Education and Ministry of Finance",
      "Only NNPC and NLNG"
    ],
    answer: "INEC, The Presidency, Mining Sites, Minimum of 8 State Governments, and the Police"
  },
  {
    id: "q5",
    question: "Which of the following state governments is NOT listed as a client target for EIB Stratoc: Surveillance and Camps?",
    options: [
      "Lagos State Government",
      "Plateau State Government",
      "Borno State Government",
      "Katsina State Government"
    ],
    answer: "Lagos State Government"
  },
  {
    id: "q6",
    question: "What are the key products listed under Briech UAS for generating revenue?",
    options: [
      "Kamikaze Drones, Fixed Wing Drones, and Training",
      "Bulletproof vests and tactical vehicles",
      "Commercial passenger planes and flight simulation software",
      "CCTV cameras and motion sensors"
    ],
    answer: "Kamikaze Drones, Fixed Wing Drones, and Training"
  },
  {
    id: "q7",
    question: "Which key product or application is commercialized to private citizens and Chinese/Mining clients under the PSAP portfolio?",
    options: [
      "Dilarion, CGAS, and Command Ops",
      "Orion and Argus",
      "Kamikaze Drones",
      "Luft TV subscriptions"
    ],
    answer: "Dilarion, CGAS, and Command Ops"
  },
  {
    id: "q8",
    question: "How many key process improvements are outlined for implementation across the group in H2 2026?",
    options: [
      "5 key processes",
      "7 key processes",
      "10 key processes",
      "3 key processes"
    ],
    answer: "7 key processes"
  },
  {
    id: "q9",
    question: "Which of the following is one of the 7 key process improvements to be implemented per subsidiary?",
    options: [
      "Set up a central procurement unit and open separate revenue/operations accounts for all subsidiaries",
      "Eliminate all manual reports",
      "Outsource all HR operations to external firms",
      "Rebrand all subsidiary names"
    ],
    answer: "Set up a central procurement unit and open separate revenue/operations accounts for all subsidiaries"
  },
  {
    id: "q10",
    question: "Which major capital projects are targeted for completion before Dec 31, 2026?",
    options: [
      "EIB Group Headquarters, internal/external roads, Briech Hospital, Luftreiber workshop expansion, and Security Operations Center (SOC)",
      "A new university campus and a sports stadium",
      "Luft Pay TV satellite launch and a fleet of electric buses",
      "Five new branch offices in neighbouring countries"
    ],
    answer: "EIB Group Headquarters, internal/external roads, Briech Hospital, Luftreiber workshop expansion, and Security Operations Center (SOC)"
  }
];

async function run() {
  try {
    const chairmanContent = JSON.stringify({ lessons: chairmanLessons, quiz: chairmanQuiz });

    const q = `
      INSERT INTO "courses" (slug, title, description, category, level, format, "durationHours", "priceNaira", subsidiaries, "customContent", "authorId")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (slug) DO UPDATE 
      SET title = EXCLUDED.title, description = EXCLUDED.description, "customContent" = EXCLUDED."customContent", subsidiaries = EXCLUDED.subsidiaries;
    `;

    await pool.query(q, [
      'eib-group-h2-2026-strategic-directives',
      'EIB Group H2 2026 Strategic Directives',
      'Strategic directives, revenue targets, process improvements, and key capital projects outlined by the Chairman for the second half of 2026.',
      'Strategy',
      'Advanced',
      'Online',
      3,
      0,
      'EIB Group',
      chairmanContent,
      'michael.marquis@eibgroup.com',
    ]);

    console.log('Successfully inserted Chairman Strategic Directives course!');
  } catch(e) {
    console.error('Error inserting course', e);
  } finally {
    process.exit(0);
  }
}

run();
