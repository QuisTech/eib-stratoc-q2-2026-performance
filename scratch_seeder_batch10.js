const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

const clandestineLessons = [
  {
    key: "psap-gap-analysis",
    title: "PSAP: Gap Analysis & Questionnaire",
    minutes: 30,
    summary: "Operational challenges, skill gaps, and competency assessment for the Public Safety Answering Point.",
    attachments: [
      { title: "Black Mid-Year Presentation (PDF)", url: "/docs/black-mid-year-presentation.pdf" }
    ],
    sections: [
      {
        heading: "Operational Challenges & Gaps",
        body: [
          "- **Challenges:** Periodic downtime in in-house solutions (Command Ops and Vanguard Application) and internet fluctuations.",
          "- **Skill Gaps:** Insufficient OSINT knowledge, limited capacity to use GIS tools, and limited capacity in providing pre-arrival instructions for medical/fire emergencies."
        ]
      },
      {
        heading: "Intervention Priorities & Resources",
        body: [
          "- **Training:** OSINT data gathering, practical GIS training, First Responder communication, incident verification, and emergency call routing.",
          "- **Resources:** Noise Cancellation Headsets, external facilitators, and wired network connections for stability."
        ]
      },
      {
        heading: "PSAP Competency Questionnaire",
        body: [
          "1. How confident are you in handling distressed callers?",
          "2. How do you prioritize emergency calls?",
          "3. What difficulties do you experience while gathering information from callers?",
          "4. Are you familiar with all emergency call protocols?",
          "5. What factors affect your response time?",
          "6. What types of calls are most difficult to manage?",
          "7. Would training in customer service or crisis communication be beneficial?",
          "8. What additional skills would help you perform better?",
          "9. How do you manage difficult or emotional callers?"
        ]
      }
    ],
    takeaways: ["PSAP needs critical training in OSINT, GIS, and Pre-arrival instructions", "System downtime and internet stability are major operational hurdles", "Noise cancellation headsets are a primary resource requirement"]
  },
  {
    key: "sac-gap-analysis",
    title: "SAC: Strategic Recommendations",
    minutes: 30,
    summary: "Strategic recommendations, PIP, and competency questions for the SAC unit.",
    sections: [
      {
        heading: "Strategic Recommendations (90-Day PIP)",
        body: [
          "- **Centralized DB:** Create a centralized system for storing intelligence reports, coordinates, and operational records to improve remote retrieval.",
          "- **Training:** Regular sessions in OSINT, GEOINT, AI-assisted research, and cyber awareness.",
          "- **Tools & Equipment:** Acquire paid online tools for intel collection/data visualization, and provide a bigger board for investigations and analysis."
        ]
      },
      {
        heading: "SAC Competency Questionnaire",
        body: [
          "Key areas of assessment include:",
          "- Comfort using monitoring systems and interpreting incident alerts.",
          "- Confidence in handling emergency situations and carrying out special operations.",
          "- Ability to assess and verify information before acting.",
          "- Proficiency in preparing accurate reports and documenting findings.",
          "- Identification of technologies or software requiring additional training."
        ]
      }
    ],
    takeaways: ["SAC requires a centralized Database for intelligence reports", "Training in OSINT, GEOINT, and AI-assisted research is crucial", "Paid online tools are needed to improve analytical capabilities"]
  },
  {
    key: "raw-intel-gap-analysis",
    title: "RAW & INTEL: Operational Gaps",
    minutes: 30,
    summary: "Operational challenges, proposed training for RAW, and competency questions for RAW and INTEL units.",
    sections: [
      {
        heading: "RAW: Gaps & Training Priorities",
        body: [
          "- **Current Status:** No significant operational challenges affecting productivity.",
          "- **Proposed Training:** Advanced cybersecurity (Offensive & Defensive), advanced search engine techniques for OSINT, and product documentation development.",
          "- **Resources:** Budget for specialized training/certifications, technical equipment, dedicated workstations, and external experts."
        ]
      },
      {
        heading: "INTEL Questionnaire",
        body: [
          "- Assess methods for gathering and verifying information.",
          "- Confidence in analyzing and preparing intelligence reports.",
          "- Identify intelligence tools or software that staff find difficult to use."
        ]
      },
      {
        heading: "RAW Questionnaire",
        body: [
          "- Assess operational challenges in the field and equipment proficiency.",
          "- Evaluate communication effectiveness and research validation methods.",
          "- Gauge confidence in analyzing data, identifying trends, and using analytical software (Excel, databases)."
        ]
      }
    ],
    takeaways: ["RAW needs Offensive and Defensive Cybersecurity training", "INTEL requires assessment of information gathering and reporting skills", "RAW personnel must be proficient in analytical tools and databases"]
  },
  {
    key: "general-competency",
    title: "General Competency Framework",
    minutes: 30,
    summary: "Standardized competency questions for all departmental staff as prepared by Geraldine.",
    sections: [
      {
        heading: "Individual & Team Assessment",
        body: [
          "1. Describe a situation when you had to solve a difficult problem.",
          "2. Tell me about a time you had to make a difficult decision.",
          "3. Tell me about a time you worked as part of the team.",
          "4. What are your primary responsibilities?",
          "5. How confident are you in performing your duties?",
          "6. Which aspects of your job do you find most challenging?"
        ]
      },
      {
        heading: "Skills & Communication",
        body: [
          "7. Are there any tasks you feel you need more training on?",
          "8. What skills are most important for your role?",
          "9. Which of these skills would you like to improve on?",
          "10. Have you received any training related to your role?",
          "11. Was the training sufficient?",
          "12. What regularly prevents you from performing effectively?",
          "13. What mistakes or errors occur most frequently in your unit?",
          "14. What resources or tools do you need?",
          "15. Do you receive clear instructions from your supervisor?",
          "16. How effective is communication within your department?",
          "17. What communication challenges affect your work?",
          "18. If the organization could provide one training program, what would it be?"
        ]
      }
    ],
    takeaways: ["Assess problem-solving and decision-making skills", "Identify specific resource gaps and frequent errors in units", "Evaluate the effectiveness of departmental communication and instructions"]
  }
];

const clandestineQuiz = [
  { prompt: "What is a critical skill gap identified for PSAP?", options: ["Typing speed", "Insufficient knowledge of OSINT and GIS tools", "Physical fitness", "Programming in Java"], correctIndex: 1, explanation: "PSAP identified gaps in OSINT and GIS tools." },
  { prompt: "What is a key recommendation for SAC to improve information sharing?", options: ["Buying more filing cabinets", "Creating a centralized system or Database for storing intelligence reports", "Using WhatsApp groups", "Printing all reports"], correctIndex: 1, explanation: "A centralized database was recommended for SAC." },
  { prompt: "What type of advanced cyber practices training is proposed for RAW?", options: ["Social Media Marketing", "Basic IT Support", "Cybersecurity advanced cyber practices (Offensive and Defensive)", "Web Design"], correctIndex: 2, explanation: "Offensive and Defensive cybersecurity training is proposed for RAW." },
  { prompt: "What is a major operational challenge currently affecting PSAP?", options: ["Periodic downtime in the in-house solution (Command Ops and Vanguard)", "Lack of vehicles", "Too many phone calls", "Poor lighting in the office"], correctIndex: 0, explanation: "Downtime in their in-house solutions is a major operational challenge." },
  { prompt: "What specific resource is requested by PSAP to improve call answering?", options: ["New chairs", "Noise Cancellation Headsets", "Loudspeakers", "More coffee"], correctIndex: 1, explanation: "Noise cancellation headsets are requested for PSAP." },
  { prompt: "According to the SAC recommendations, what is needed for investigations and analysis?", options: ["A bigger board", "A new office", "More pens", "A projector"], correctIndex: 0, explanation: "A bigger board for investigations and analysis was requested by SAC." },
  { prompt: "What specific skill does PSAP need regarding emergency callers?", options: ["How to transfer calls to voicemail", "Providing pre-arrival instructions and emergency guidance (Medical, Fire, etc.)", "How to block numbers", "How to speak louder"], correctIndex: 1, explanation: "PSAP needs training in providing pre-arrival instructions." },
  { prompt: "Which unit requires training in Product documentation development?", options: ["PSAP", "SAC", "RAW", "INTEL"], correctIndex: 2, explanation: "RAW requested training in product documentation development." },
  { prompt: "What does the General Competency Questionnaire seek to assess regarding teamwork?", options: ["Who is the funniest in the team", "Tell me about a time you worked as part of the team", "Who is the boss", "How many teams there are"], correctIndex: 1, explanation: "The questionnaire asks staff to describe a time they worked as part of a team." },
  { prompt: "What is a key question asked in the INTEL questionnaire regarding reports?", options: ["Do you like reading?", "How confident are you in preparing intelligence reports?", "Can you type fast?", "What font do you use?"], correctIndex: 1, explanation: "The INTEL questionnaire assesses confidence in preparing intelligence reports." }
];

async function run() {
  try {
    const clandestineContent = JSON.stringify({ lessons: clandestineLessons, quiz: clandestineQuiz });

    const q = `
      INSERT INTO "courses" (slug, title, description, category, level, format, "durationHours", "priceNaira", subsidiaries, "customContent", "authorId")
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (slug) DO UPDATE 
      SET title = EXCLUDED.title, description = EXCLUDED.description, "customContent" = EXCLUDED."customContent";
    `;

    await pool.query(q, [
      'clandestine-training-gap-analysis',
      'Directorate of Intelligence and Clandestine Operations: Training Gap Analysis',
      'Detailed operational challenges, skill gaps, proposed interventions, and competency questionnaires for PSAP, SAC, RAW, and INTEL units.',
      'Operational',
      'Advanced',
      'Online',
      2,
      0,
      'Black', // Linking this specifically to the Intelligence / Black directorate subsidiary
      clandestineContent,
      'michael.marquis@eibgroup.com'
    ]);

    console.log('Successfully inserted Clandestine Training Gap Analysis course!');
  } catch(e) {
    console.error('Error inserting courses', e);
  } finally {
    process.exit(0);
  }
}

run();
