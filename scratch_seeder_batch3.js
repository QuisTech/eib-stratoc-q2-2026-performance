const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

const ctoLessons = [
  {
    key: "cto-infrastructure-cybersecurity",
    title: "Infrastructure & Cybersecurity",
    minutes: 45,
    summary: "Improving network reliability and strengthening cybersecurity defenses.",
    attachments: [
      { title: "CTO Strategic Plans (PDF)", url: "/docs/cto-strategic-plans.pdf" }
    ],
    sections: [
      {
        heading: "Improve Network Reliability",
        body: [
          "- **Goal:** Achieve enterprise-class network performance.",
          "- **Key Actions:** Upgrade aging core switches and routers, increase redundancy, improve WAN resilience.",
          "- **KPIs:** 99.95% uptime, MTTR < 1 hour, Packet loss < 1%."
        ]
      },
      {
        heading: "Strengthen Cybersecurity",
        body: [
          "- **Goal:** Protect business assets against emerging cyber threats.",
          "- **Initiatives:** Zero Trust implementation, vulnerability assessments, penetration testing, SIEM Development, SOC Actualization.",
          "- **KPIs:** 95% patch compliance, 50% reduction in phishing success rate."
        ]
      }
    ],
    takeaways: ["99.95% network uptime target", "Zero Trust implementation", "Establish a SOC (Security Operations Center)"]
  },
  {
    key: "cto-optimization-virtualization",
    title: "Cost Optimization & Virtualization",
    minutes: 45,
    summary: "Delivering measurable financial savings and expanding cloud readiness.",
    sections: [
      {
        heading: "Optimize IT Costs",
        body: [
          "- **Target Savings:** 30% reduction in bandwidth costs, 25% reduction in server maintenance, 30% reduction in power consumption.",
          "- **Initiatives:** Internet bandwidth optimization, vendor contract renegotiation, asset lifecycle optimization."
        ]
      },
      {
        heading: "Expand Virtualization",
        body: [
          "- **Goal:** Increase server virtualization to 90%.",
          "- **Target:** 99.99% VM availability, 40% storage optimization."
        ]
      }
    ],
    takeaways: ["Reduce bandwidth costs by 30%", "Achieve 90% server virtualization", "Implement automated provisioning"]
  },
  {
    key: "cto-data-center-governance",
    title: "Data Centre Actualization & Governance",
    minutes: 45,
    summary: "Establishing a functional data center and enforcing IT compliance.",
    sections: [
      {
        heading: "Data Centre Actualization",
        body: [
          "- **Projects:** Intelligent fire suppression systems (FM 200 or Novec 1230), Rack optimization, Environmental monitoring (HVAC), Standard Solar Deployment.",
          "- **KPIs:** Zero fire-related incidents, 99.99% power availability."
        ]
      },
      {
        heading: "Improve Governance and Compliance",
        body: [
          "- **Initiatives:** IT policy review, Risk assessments, Disaster recovery testing.",
          "- **KPIs:** 100% compliance with IT policies, 100% disaster recovery tests completed as scheduled."
        ]
      }
    ],
    takeaways: ["Install FM 200 / Novec 1230 fire suppression", "100% IT Policy Compliance", "Standard Solar Deployment for power redundancy"]
  }
];

const ctoQuiz = [
  { prompt: "What is the network availability KPI target set by the CTO?", options: ["80%", "90%", "95%", "99.95%"], correctIndex: 3, explanation: "The target for network availability is 99.95%." },
  { prompt: "Which cybersecurity framework is planned for implementation?", options: ["Zero Trust", "Open Access", "Bring Your Own Device (BYOD) only", "Perimeter-only defense"], correctIndex: 0, explanation: "Zero Trust implementation is a key initiative to strengthen cybersecurity." },
  { prompt: "What is the target reduction for internet bandwidth costs?", options: ["10%", "20%", "30%", "50%"], correctIndex: 2, explanation: "The CTO aims for a 30% reduction in bandwidth costs." },
  { prompt: "What target percentage has been set for Server Virtualization?", options: ["45%", "60%", "90%", "100%"], correctIndex: 2, explanation: "The target is 90% server virtualization." },
  { prompt: "What fire suppression system is recommended for the Data Centre?", options: ["Water Sprinklers", "FM 200 or Novec 1230", "Sand buckets", "Foam extinguishers"], correctIndex: 1, explanation: "Intelligent fire suppression systems like FM 200 or Novec 1230 are specified." },
  { prompt: "What is the KPI for compliance with IT policies?", options: ["50%", "75%", "90%", "100%"], correctIndex: 3, explanation: "The goal is 100% compliance with IT policies." },
  { prompt: "What is the target for reduction in phishing success rate?", options: ["10%", "30%", "50%", "100%"], correctIndex: 2, explanation: "The KPI aims for a 50% reduction in phishing success rate." },
  { prompt: "What is the target Mean Time To Repair (MTTR) for the network?", options: ["< 1 Hour", "< 4 Hours", "< 12 Hours", "< 24 Hours"], correctIndex: 0, explanation: "The MTTR target is < 1 Hour." },
  { prompt: "Which of these is a key component of Data Centre Actualization?", options: ["Buying more laptops", "Environmental monitoring (HVAC) and Power redundancy", "Removing all physical servers", "Outsourcing entirely to a third party"], correctIndex: 1, explanation: "Environmental monitoring and Power redundancy (Solar) are key projects." },
  { prompt: "What is the target for employee training completion in the IT department?", options: ["50%", "75%", "95%", "100%"], correctIndex: 2, explanation: "The KPI for human capital development is 95% training completion." }
];

const archLessons = [
  {
    key: "arch-sterile-rooms",
    title: "Sterile Rooms & CSSD",
    minutes: 45,
    summary: "Design considerations and purpose of highly controlled sterile environments.",
    attachments: [
      { title: "Briech Hospital Wards 2026 (PDF)", url: "/docs/briech-hospital-wards-2026.pdf" },
      { title: "Hospital Project Appraisal (PDF)", url: "/docs/briech-hospital-project-appraisal.pdf" },
      { title: "Construction Operation Sequence (PDF)", url: "/docs/construction-operation-sequence.pdf" },
      { title: "Group Chief Architect Desk (PDF)", url: "/docs/group-chief-architect-desk.pdf" }
    ],
    sections: [
      {
        heading: "What is a Sterile Room?",
        body: [
          "A sterile room is a highly controlled environment designed to eliminate or minimize all forms of microorganisms (bacteria, viruses, fungi) to prevent contamination during medical procedures. Among all clinical spaces, Operating Theaters require the absolute highest level of sterility."
        ]
      },
      {
        heading: "Central Sterile Services Department (CSSD)",
        body: [
          "The Central Sterile Services Department (CSSD) is the specialized unit responsible for receiving, decontaminating, sterilizing, packaging, and distributing surgical instruments, medical devices, and sterile supplies across the hospital."
        ]
      },
      {
        heading: "Key Design Features",
        body: [
          "- **Air Filtration:** High-efficiency particulate air (HEPA) filters.",
          "- **Surfaces:** Seamless and easy-to-clean surfaces.",
          "- **Pass-Throughs:** Devices used to transfer items into and out of the sterile area, minimizing the need for personnel to enter and exit."
        ]
      }
    ],
    takeaways: ["Use HEPA filters", "Implement Pass-Throughs to reduce traffic", "Maintain seamless, easy-to-clean surfaces"]
  },
  {
    key: "arch-trauma-imaging",
    title: "Trauma Rooms & Imaging Rooms",
    minutes: 45,
    summary: "Architectural requirements for specialized trauma and radiology spaces.",
    sections: [
      {
        heading: "Trauma Room vs Standard ER",
        body: [
          "A trauma room specializes in treating severe, life-threatening injuries. Unlike a standard ER, it is equipped with advanced surgical resources and is staffed 24/7 by trauma surgeons and critical care specialists."
        ]
      },
      {
        heading: "Imaging (Radiology) Room Design",
        body: [
          "- **Radiation Protection:** Thick, shielded walls containing lead or steel.",
          "- **No Windows:** Windows are typically avoided in X-ray rooms to further limit radiation leakage.",
          "- **Usage:** X-rays, CT scans, MRIs, and ultrasounds."
        ]
      }
    ],
    takeaways: ["Trauma rooms require advanced surgical capability", "Imaging rooms need lead/steel shielding", "Avoid windows in X-Ray rooms"]
  }
];

const archQuiz = [
  { prompt: "What type of filter is critical for a hospital Sterile Room?", options: ["Carbon filter", "HEPA (High-efficiency particulate air) filter", "UV water filter", "Standard dust filter"], correctIndex: 1, explanation: "HEPA filters capture airborne particles and microorganisms in sterile rooms." },
  { prompt: "What is a 'Pass-Through' in a sterile room?", options: ["A hallway for patients", "A device to transfer items in/out without personnel entering", "An air vent", "A type of surgical tool"], correctIndex: 1, explanation: "Pass-throughs allow items to be transferred while minimizing personnel traffic." },
  { prompt: "How does a Trauma Room differ from a standard ER?", options: ["It is smaller", "It only handles minor cuts", "It specializes in the most critical, life-threatening injuries and has specialized trauma surgeons", "It is only open during the day"], correctIndex: 2, explanation: "A trauma room is dedicated to severe, life-threatening injuries with specialized resources." },
  { prompt: "What is a crucial design feature of an Imaging (X-Ray) Room?", options: ["Large glass windows for natural light", "Thick, shielded walls with lead or steel", "Carpeted floors", "Open-plan layout"], correctIndex: 1, explanation: "Imaging rooms need lead or steel shielding to prevent radiation leakage." },
  { prompt: "Why are windows typically avoided in X-Ray rooms?", options: ["To save construction costs", "To limit radiation leakage", "To keep the room dark for sleeping", "To prevent patients from looking outside"], correctIndex: 1, explanation: "Windows are avoided to further limit the risk of radiation leakage." },
  { prompt: "Which department is responsible for decontaminating and packaging surgical instruments?", options: ["CSSD (Central Sterile Services Department)", "HR", "Radiology", "Business Development"], correctIndex: 0, explanation: "CSSD handles the sterilization of medical devices." },
  { prompt: "Which of these requires the highest level of sterility?", options: ["Hospital Cafeteria", "Waiting Lounge", "Operating Theaters", "Admin Offices"], correctIndex: 2, explanation: "Operating theaters require the highest level of sterility for surgical procedures." },
  { prompt: "What type of surfaces are required in a Sterile Room?", options: ["Porous and textured", "Seamless and easy-to-clean", "Carpeted", "Wood-paneled"], correctIndex: 1, explanation: "Seamless, easy-to-clean surfaces facilitate frequent disinfection." },
  { prompt: "What imaging modalities are typically housed in shielded Imaging Rooms?", options: ["Only Ultrasounds", "X-Rays, CT Scans, and MRIs", "Microscopes", "Endoscopes"], correctIndex: 1, explanation: "X-rays, CT scans, and MRIs require specialized imaging rooms." },
  { prompt: "What characterizes the staffing of a Trauma Room?", options: ["Staffed only by nurses", "Staffed 9 to 5 on weekdays", "Staffed 24/7 with trauma surgeons and critical care specialists", "Staffed by medical students"], correctIndex: 2, explanation: "Trauma rooms are staffed 24/7 by highly specialized critical care personnel." }
];

const bdLessons = [
  {
    key: "bd-phase1-assessment",
    title: "Phase 1: Assessment & Foundation",
    minutes: 45,
    summary: "Evaluating business performance and executive engagement.",
    attachments: [
      { title: "Business Development Strategic Plan (PDF)", url: "/docs/business-development-strategic-plan.pdf" },
      { title: "EIB 90-Day Business Development Plan (PDF)", url: "/docs/eib-90-day-business-development-plan.pdf" }
    ],
    sections: [
      {
        heading: "Executive Engagement",
        body: [
          "Strategic meetings with General Managers of 'Cash Cow' subsidiaries: Briech UAS, Briech Atlantic, Poctova, EIB Stratoc, Luftriber Automobile, GIGA Forensics, PSAP, RAW.",
          "Media Partners: Bright FM & BEF."
        ]
      },
      {
        heading: "Business Performance Assessment",
        body: [
          "- **Financial:** Revenue generation and Profitability.",
          "- **Commercial:** Existing vs potential clients.",
          "- **Operational:** Resource efficiency, service delivery, capacity utilization.",
          "- **Competitive Analysis:** Market position, SWOT analysis."
        ]
      }
    ],
    takeaways: ["Engage with Cash Cow GMs", "Conduct comprehensive SWOT analysis", "Assess operational capacity"]
  },
  {
    key: "bd-phase2-growth",
    title: "Phase 2 & 3: Growth Acceleration & Consolidation",
    minutes: 45,
    summary: "Accelerating revenue generation and institutionalizing the BD system.",
    sections: [
      {
        heading: "Phase 2: Growth Acceleration",
        body: [
          "- **Revenue Growth Campaign:** Client visits, contract negotiations, customer acquisition.",
          "- **Strategic Partnerships:** Government Ministries, Stakeholder Engagement.",
          "- **Visibility:** Digital campaigns, corporate branding, executive networking."
        ]
      },
      {
        heading: "Phase 3: Consolidation",
        body: [
          "- **Revenue Optimization:** Cost optimization, resource utilization, business process improvement.",
          "- **Customer Experience:** CRM optimization and customer satisfaction surveys.",
          "- **Expected Outcomes:** Measurable revenue pipeline, improved profitability, standardized BD reporting."
        ]
      }
    ],
    takeaways: ["Drive strategic partnerships with Ministries", "Optimize the CRM system", "Standardize BD reporting across the Group"]
  }
];

const bdQuiz = [
  { prompt: "Which subsidiary is designated as a 'Media Partner' rather than a 'Cash Cow' in the BD plan?", options: ["GIGA Forensics", "Bright FM", "EIB Stratoc", "Briech UAS"], correctIndex: 1, explanation: "Bright FM (and BEF) are designated as Media Partners." },
  { prompt: "What is the primary objective of Phase 2 (Growth Acceleration)?", options: ["Firing underperforming staff", "Accelerating revenue generation through aggressive market engagement", "Moving offices to a new city", "Shutting down subsidiaries"], correctIndex: 1, explanation: "Phase 2 focuses on accelerating revenue generation and strategic partnerships." },
  { prompt: "What is one of the key elements of the Business Performance Assessment in Phase 1?", options: ["Ordering new office furniture", "Competitive Analysis and SWOT Analysis", "Planning the end-of-year party", "Redesigning the company logo"], correctIndex: 1, explanation: "Competitive Analysis and SWOT are key parts of the Phase 1 assessment." },
  { prompt: "What tool is targeted for optimization in Phase 3 to improve Customer Experience?", options: ["The CRM (Customer Relationship Management) system", "The Payroll system", "The Drone navigation software", "The Employee Handbook"], correctIndex: 0, explanation: "CRM optimization is a specific target for Phase 3." },
  { prompt: "Which of the following is listed as an Expected Outcome after 90 days?", options: ["A weaker market position", "Standardized business development systems and reporting", "Elimination of the BD department", "Decreased customer loyalty"], correctIndex: 1, explanation: "Standardized BD systems and reporting is an expected outcome." },
  { prompt: "Who must the Group Head of BD engage with during Phase 1?", options: ["Only external clients", "General Managers of the subsidiaries", "Only the Board of Directors", "Junior interns"], correctIndex: 1, explanation: "Phase 1 requires Executive Engagement with the GMs." },
  { prompt: "What sector is targeted for Strategic Partnerships in Phase 2?", options: ["Rival security companies", "Government Ministries", "Fast food chains", "Primary schools"], correctIndex: 1, explanation: "Ministries and stakeholder engagement are targeted for partnerships." },
  { prompt: "What is analyzed under 'Operational Performance'?", options: ["Social media likes", "Resource Efficiency, service delivery, and Capacity utilization", "Employee dress code", "Bank interest rates"], correctIndex: 1, explanation: "Operational performance assesses resource efficiency and capacity utilization." },
  { prompt: "Which of these subsidiaries is NOT explicitly labeled a 'Cash Cow'?", options: ["Poctova", "Briech Atlantic", "BEF", "PSAP"], correctIndex: 2, explanation: "BEF (along with Bright FM) is a Media Partner, not labeled a Cash Cow." },
  { prompt: "What is a key focus of Phase 3 (Consolidation)?", options: ["Customer Retention and CRM Optimization", "Hiring a new CTO", "Purchasing new vehicles", "Creating a new corporate entity"], correctIndex: 0, explanation: "Phase 3 focuses on Customer Experience Improvement and retention." }
];

async function run() {
  try {
    const ctoContent = JSON.stringify({ lessons: ctoLessons, quiz: ctoQuiz });
    const archContent = JSON.stringify({ lessons: archLessons, quiz: archQuiz });
    const bdContent = JSON.stringify({ lessons: bdLessons, quiz: bdQuiz });

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
      // CTO
      'cto-strategic-plan',
      'Group CTO IT Strategic Plan (H2 2026)',
      'Infrastructure modernization, Zero Trust cybersecurity, Data Centre actualization, and IT cost optimization frameworks.',
      'Technical',
      'Advanced',
      'Online',
      3,
      0,
      'EIB Group',
      ctoContent,
      'michael.marquis@eibgroup.com',

      // Arch Giwa
      'arch-giwa-research-unit',
      'Research Unit: Hospital Architectural Design Guidelines',
      'Design principles and operational specifications for Sterile Rooms, Trauma Rooms, and Imaging Facilities.',
      'Technical',
      'Advanced',
      'Online',
      2,
      0,
      'Briech Hospital',
      archContent,
      'michael.marquis@eibgroup.com',

      // BD
      'business-development-strategic-plan',
      '90-Day Business Development Strategic Plan',
      'Strategies for revenue acceleration, executive engagement with cash-cow subsidiaries, and CRM optimization.',
      'Operational',
      'Intermediate',
      'Online',
      2,
      0,
      'EIB Group',
      bdContent,
      'michael.marquis@eibgroup.com'
    ]);

    console.log('Successfully inserted CTO, Architect, and BD courses!');
  } catch(e) {
    console.error('Error inserting courses', e);
  } finally {
    process.exit(0);
  }
}

run();
