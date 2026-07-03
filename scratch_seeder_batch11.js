const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

// PSAP
const psapLessons = [
  {
    key: "psap-osint-gis",
    title: "OSINT & GIS for First Responders",
    minutes: 45,
    summary: "Techniques for data collection and building identification using Open-Source Intelligence and Geographic Information Systems.",
    attachments: [
      { title: "Raw DCI Training Plans", url: "/docs/batch-9-raw-input.txt" }
    ],
    sections: [
      {
        heading: "Open-Source Intelligence (OSINT)",
        body: [
          "- **Data Gathering:** Utilizing public records, social media, and search engines to gather crucial situational data.",
          "- **Incident Verification:** Cross-referencing caller information with open-source data to verify emergency validity."
        ]
      },
      {
        heading: "Geographic Information System (GIS)",
        body: [
          "- **Location Tracking:** Accurately and promptly identifying and locating buildings.",
          "- **Navigation:** Routing emergency services efficiently using GIS mapping."
        ]
      }
    ],
    takeaways: ["Use OSINT to verify emergency caller information", "Utilize GIS for rapid building identification", "Cross-reference data to ensure dispatch accuracy"]
  },
  {
    key: "psap-pre-arrival-communication",
    title: "Pre-Arrival Instructions & Call Handling",
    minutes: 45,
    summary: "Providing emergency guidance and managing distressed callers before physical responders arrive.",
    sections: [
      {
        heading: "Emergency Guidance",
        body: [
          "- **Medical Incidents:** Providing CPR guidance, bleeding control, and airway management instructions over the phone.",
          "- **Fire Incidents:** Instructing callers on evacuation procedures and smoke inhalation prevention."
        ]
      },
      {
        heading: "Call Routing & Escalation",
        body: [
          "- **Prioritization:** Assessing the severity of the call to dispatch appropriate services.",
          "- **Communication Skills:** Managing difficult, panicking, or emotional callers with calm, authoritative communication.",
          "- **System Downtime:** Handling emergency routing manually during Command Ops or Vanguard application downtimes."
        ]
      }
    ],
    takeaways: ["Provide critical life-saving instructions before responders arrive", "Remain calm and authoritative with distressed callers", "Have a manual fallback plan for system downtimes"]
  }
];

const psapQuiz = [
  { prompt: "What is a primary use of GIS for PSAP operators?", options: ["Making phone calls", "Accurately identifying and locating buildings", "Fixing computers", "Sending emails"], correctIndex: 1, explanation: "GIS tools are used for rapid location tracking and building identification." },
  { prompt: "Which of the following is an example of a medical pre-arrival instruction?", options: ["Asking the caller to reboot their computer", "Instructing the caller on bleeding control or CPR", "Telling the caller to call back later", "Hanging up"], correctIndex: 1, explanation: "CPR and bleeding control are critical medical pre-arrival instructions." },
  { prompt: "How should a PSAP operator handle a panicking caller?", options: ["Yell at them", "Use calm, authoritative communication", "Ignore them", "Transfer them immediately"], correctIndex: 1, explanation: "Operators must use calm, authoritative communication to manage emotional callers." },
  { prompt: "What should an operator do if the Command Ops or Vanguard application experiences periodic downtime?", options: ["Go home", "Rely on manual emergency routing and escalation protocols", "Stop answering calls", "Wait for the internet to come back"], correctIndex: 1, explanation: "Manual fallback protocols are necessary during system downtimes." },
  { prompt: "How can OSINT be used during an emergency call?", options: ["To play games", "To cross-reference and verify caller information and gather situational data", "To watch videos", "To order food"], correctIndex: 1, explanation: "OSINT helps verify incidents through public data and search techniques." }
];

// SAC
const sacLessons = [
  {
    key: "sac-centralized-intelligence",
    title: "Centralized Intelligence & DB Management",
    minutes: 45,
    summary: "Utilizing centralized systems for storing and retrieving operational records.",
    attachments: [
      { title: "Raw DCI Training Plans", url: "/docs/batch-9-raw-input.txt" }
    ],
    sections: [
      {
        heading: "Database Utilization",
        body: [
          "- **Information Sharing:** Storing intelligence reports, research findings, and coordinates centrally.",
          "- **Remote Retrieval:** Ensuring data is accessible securely from remote locations, moving away from stationary-only computers."
        ]
      }
    ],
    takeaways: ["Store all intelligence reports centrally", "Ensure secure remote access to operational records"]
  },
  {
    key: "sac-osint-geoint-ai",
    title: "OSINT, GEOINT & AI-Assisted Research",
    minutes: 45,
    summary: "Emerging tools and techniques for intelligence gathering and analysis.",
    sections: [
      {
        heading: "Advanced Techniques",
        body: [
          "- **GEOINT:** Utilizing geospatial intelligence for situational awareness.",
          "- **AI-Assisted Research:** Leveraging artificial intelligence to process large datasets and identify patterns rapidly.",
          "- **Cyber Awareness:** Maintaining operational security while utilizing paid online tools and software for data visualization."
        ]
      }
    ],
    takeaways: ["Leverage AI for rapid pattern identification", "Maintain strict cyber awareness when using online tools", "Use GEOINT for advanced situational awareness"]
  }
];

const sacQuiz = [
  { prompt: "What is the main benefit of a centralized intelligence database for SAC?", options: ["It looks nice", "Faster access to information and intelligence products remotely", "It takes up less space", "It requires fewer passwords"], correctIndex: 1, explanation: "A centralized DB allows for fast, secure remote retrieval of intelligence." },
  { prompt: "What does GEOINT stand for in intelligence operations?", options: ["General Intelligence", "Geospatial Intelligence", "Geometric Internet", "Global Enterprise"], correctIndex: 1, explanation: "GEOINT stands for Geospatial Intelligence." },
  { prompt: "How can AI-assisted research benefit SAC analysts?", options: ["By making coffee", "By processing large datasets and identifying patterns rapidly", "By writing emails", "By formatting documents"], correctIndex: 1, explanation: "AI helps analysts process massive amounts of data efficiently." },
  { prompt: "Why is cyber awareness critical when using paid online tools?", options: ["To save money", "To maintain operational security and prevent data leaks", "To get a discount", "To remember passwords"], correctIndex: 1, explanation: "Cyber awareness prevents operational data from being compromised on third-party platforms." },
  { prompt: "What was identified as a limitation of storing reports on stationary computers?", options: ["The computers are too heavy", "It makes it difficult to quickly retrieve previous work remotely when needed", "The computers are too old", "The monitors are too small"], correctIndex: 1, explanation: "Stationary storage prevents remote access during field operations." }
];

// RAW
const rawLessons = [
  {
    key: "raw-cybersecurity",
    title: "Offensive & Defensive Cybersecurity",
    minutes: 45,
    summary: "Advanced cyber practices for intelligence missions.",
    attachments: [
      { title: "Raw DCI Training Plans", url: "/docs/batch-9-raw-input.txt" }
    ],
    sections: [
      {
        heading: "Cyber Operations",
        body: [
          "- **Defensive Practices:** Securing departmental networks and preventing unauthorized intrusions.",
          "- **Offensive Practices:** Utilizing advanced techniques to gather intelligence and penetrate target networks legally and securely."
        ]
      }
    ],
    takeaways: ["Deploy defensive measures to secure internal networks", "Understand offensive cyber techniques for intelligence gathering"]
  },
  {
    key: "raw-osint-documentation",
    title: "Advanced OSINT & Product Documentation",
    minutes: 45,
    summary: "Search engine techniques and technical documentation development.",
    sections: [
      {
        heading: "OSINT Verification",
        body: [
          "- **Search Techniques:** Using advanced search operators (Dorks) to uncover hidden information.",
          "- **Analysis:** Verifying the authenticity of digital intelligence."
        ]
      },
      {
        heading: "Product Documentation",
        body: [
          "- **Technical Writing:** Preparing system requirements, technical documents, and user guides for cyber solutions."
        ]
      }
    ],
    takeaways: ["Use advanced search operators for OSINT", "Verify all digital intelligence before reporting", "Standardize technical documentation for cyber tools"]
  }
];

const rawQuiz = [
  { prompt: "What is a key component of defensive cybersecurity?", options: ["Attacking other networks", "Securing departmental networks and preventing intrusions", "Writing blogs", "Fixing printers"], correctIndex: 1, explanation: "Defensive cybersecurity focuses on protecting internal assets." },
  { prompt: "What are advanced search operators (Dorks) used for in OSINT?", options: ["Playing games", "Uncovering hidden information and specific files on search engines", "Formatting text", "Sending emails"], correctIndex: 1, explanation: "Search operators allow analysts to filter and find highly specific information." },
  { prompt: "Why is product documentation important for the RAW department?", options: ["To waste time", "To prepare clear system requirements and user guides for cyber solutions", "To learn how to type", "To print posters"], correctIndex: 1, explanation: "Documentation ensures cyber tools can be properly integrated and used by other personnel." },
  { prompt: "What is a core objective of the RAW department's cyber training?", options: ["To become hackers", "To support the successful integration of digital and cyber solutions across intelligence missions", "To fix Wi-Fi routers", "To sell software"], correctIndex: 1, explanation: "The goal is to integrate digital solutions into intelligence missions." },
  { prompt: "What must be done after collecting intelligence via OSINT?", options: ["Post it on social media", "Verify its authenticity and analyze it", "Delete it", "Ignore it"], correctIndex: 1, explanation: "All collected intelligence must be rigorously verified." }
];

// INTEL
const intelLessons = [
  {
    key: "intel-analysis-reporting",
    title: "Information Gathering & Intelligence Reporting",
    minutes: 45,
    summary: "Techniques for gathering, verifying, and reporting intelligence accurately.",
    attachments: [
      { title: "Raw DCI Training Plans", url: "/docs/batch-9-raw-input.txt" }
    ],
    sections: [
      {
        heading: "Information Gathering & Verification",
        body: [
          "- **Collection:** Identifying reliable sources and avoiding misinformation.",
          "- **Verification:** Cross-checking facts before they are entered into the intelligence database."
        ]
      },
      {
        heading: "Intelligence Reporting",
        body: [
          "- **Structure:** Preparing clear, actionable, and accurate intelligence reports.",
          "- **Analytical Software:** Utilizing databases (like Excel and proprietary tools) to identify trends and patterns."
        ]
      }
    ],
    takeaways: ["Cross-check all facts to avoid misinformation", "Prepare clear, actionable intelligence reports", "Use analytical software to spot hidden trends"]
  }
];

const intelQuiz = [
  { prompt: "What is the most critical step before entering information into an intelligence database?", options: ["Formatting the text", "Cross-checking and verifying the facts", "Adding pictures", "Printing the document"], correctIndex: 1, explanation: "Verification prevents misinformation from corrupting the intelligence database." },
  { prompt: "What characterizes a well-prepared intelligence report?", options: ["It is very long", "It is clear, actionable, and accurate", "It uses many colors", "It is handwritten"], correctIndex: 1, explanation: "Reports must be clear, accurate, and provide actionable insights." },
  { prompt: "Why should INTEL staff utilize analytical software like Excel or proprietary databases?", options: ["To play games", "To identify trends and patterns in large datasets", "To write letters", "To store music"], correctIndex: 1, explanation: "Analytical software helps analysts spot trends that aren't obvious manually." },
  { prompt: "What is a major challenge to avoid during information gathering?", options: ["Finding too much true information", "Misinformation and unreliable sources", "Reading too fast", "Typing errors"], correctIndex: 1, explanation: "Relying on misinformation can compromise entire intelligence operations." },
  { prompt: "What should an analyst do if they are not confident in preparing an intelligence report?", options: ["Guess the facts", "Request additional training in report writing", "Copy someone else", "Refuse to write it"], correctIndex: 1, explanation: "Analysts should request training to ensure their reports meet strict standards." }
];


async function run() {
  try {
    const psapContent = JSON.stringify({ lessons: psapLessons, quiz: psapQuiz });
    const sacContent = JSON.stringify({ lessons: sacLessons, quiz: sacQuiz });
    const rawContent = JSON.stringify({ lessons: rawLessons, quiz: rawQuiz });
    const intelContent = JSON.stringify({ lessons: intelLessons, quiz: intelQuiz });

    const q = `
      INSERT INTO "courses" (slug, title, description, category, level, format, "durationHours", "priceNaira", subsidiaries, "customContent", "authorId")
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11),
      ($12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22),
      ($23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33),
      ($34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44)
      ON CONFLICT (slug) DO UPDATE 
      SET title = EXCLUDED.title, description = EXCLUDED.description, "customContent" = EXCLUDED."customContent", subsidiaries = EXCLUDED.subsidiaries;
    `;

    await pool.query(q, [
      // PSAP
      'psap-emergency-response-osint',
      'PSAP: Emergency Response & OSINT Training',
      'Comprehensive training for Public Safety Answering Point operators on GIS mapping, OSINT data gathering, and pre-arrival emergency instructions.',
      'Operational',
      'Advanced',
      'Online',
      2,
      0,
      'DCI - PSAP, BLACK',
      psapContent,
      'michael.marquis@eibgroup.com',

      // SAC
      'sac-intelligence-systems-osint',
      'SAC: Intelligence Systems & OSINT Techniques',
      'Specialized training on centralized database management, AI-assisted research, and advanced GEOINT/OSINT techniques.',
      'Technical',
      'Advanced',
      'Online',
      2,
      0,
      'DCI - SAC, BLACK',
      sacContent,
      'michael.marquis@eibgroup.com',

      // RAW
      'raw-cyber-intelligence',
      'RAW: Cyber Intelligence & Product Documentation',
      'Advanced offensive and defensive cybersecurity training, search engine verification techniques, and product documentation development.',
      'Technical',
      'Advanced',
      'Online',
      2,
      0,
      'DCI - RAW, BLACK',
      rawContent,
      'michael.marquis@eibgroup.com',

      // INTEL
      'intel-information-analysis',
      'INTEL: Information Gathering & Analysis',
      'Techniques for verifying operational intelligence, preventing misinformation, and utilizing analytical databases to identify trends.',
      'Operational',
      'Advanced',
      'Online',
      2,
      0,
      'DCI - Intel, BLACK',
      intelContent,
      'michael.marquis@eibgroup.com'
    ]);

    console.log('Successfully inserted tailored courses for PSAP, SAC, RAW, and INTEL!');
  } catch(e) {
    console.error('Error inserting tailored courses', e);
  } finally {
    process.exit(0);
  }
}

run();
