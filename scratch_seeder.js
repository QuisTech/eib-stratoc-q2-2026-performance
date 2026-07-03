const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

const gcooLessons = [
  {
    key: "strategic-objectives",
    title: "Strategic Objectives & Foundation",
    minutes: 45,
    summary: "Aligning operations across all 8 subsidiaries for a unified group vision.",
    sections: [
      {
        heading: "Core Objectives",
        body: [
          "**1. OPERATIONAL ALIGNMENT:** Synchronize operations across all 8 subsidiaries for unified group vision.",
          "**2. STREAMLINED REPORTING:** Enhance decision-making through standardized performance tracking systems.",
          "**3. PROCESS OPTIMIZATION:** Boost workforce productivity and identify cross-company shared service synergies.",
          "**4. STAKEHOLDER CONFIDENCE:** Strengthen visibility and group-level credibility through transparent operations.",
          "**5. GROWTH FOUNDATION:** Establish the infrastructure and resource plans for 2027 strategic initiatives."
        ]
      },
      {
        heading: "Phase 1: Foundation & Awareness (June – July 2026)",
        body: [
          "**Establishing the Baseline:**",
          "- **Leadership Onboarding:** 1-on-1 meetings with GMs to align on unique subsidiary dynamics.",
          "- **Internal Audit:** Comprehensive review of Operations, HR, Finance, and Assets.",
          "- **Linkage Mapping:** Identifying operational overlaps and shared service opportunities.",
          "- **KPI Dashboard:** Deploying standardized reporting templates across the Group.",
          "- **Ops Leads:** Appointing subsidiary-level leads for group-level oversight."
        ]
      }
    ],
    takeaways: ["Standardization", "Unified Vision", "Baseline audits"]
  },
  {
    key: "timeline-integration",
    title: "Work Plan Timeline & Integration",
    minutes: 45,
    summary: "A timeline overview of the GCOO's strategic phases.",
    sections: [
      {
        heading: "Work Plan Timeline (2026)",
        body: [
          "The following timeline breaks down the high-level roadmap into distinct operational phases for the remainder of 2026.",
          "<div class='mt-4 border-l-4 pl-4 py-2 bg-muted/30 rounded-r-md' style='border-color: var(--primary)'>",
          "<p class='mb-2'><strong>Jun &ndash; Jul (Foundation):</strong> Internal Audits & Dashboards</p>",
          "<p class='mb-2'><strong>Aug &ndash; Sep (Integration):</strong> Ops Reviews & Policy Harmonization</p>",
          "<p class='mb-2'><strong>Oct &ndash; Nov (Growth):</strong> 2027 Strategy & Townhalls</p>",
          "<p><strong>December (Review):</strong> Appraisals & 2027 Budget</p>",
          "</div>"
        ]
      },
      {
        heading: "Phase 2: Integration & Optimization (Aug - Sep)",
        body: [
          "**Cost Savings Target:** ≥10% via Procurement Synergy.",
          "- **Procurement Pilot:** Centralized review in 2–3 companies for contract unification.",
          "- **Operational Reviews:** Launch quarterly performance tracking across all subsidiaries.",
          "- **Cross-Functional Synergy:** Leveraging other subsidiary tech products for Bright FM media products.",
          "- **Policy Harmonization:** Standardizing HR policies (Leave, Welfare, Conflict Resolution).",
          "- **Risk & Legal:** Consolidated Risk Register and IP framework for all subsidiaries."
        ]
      }
    ],
    takeaways: ["Cost Synergy", "Centralized Procurement", "Harmonization"]
  },
  {
    key: "subsidiary-priorities",
    title: "Subsidiary Priorities (Tech & Media)",
    minutes: 60,
    summary: "Targeted operational directives for individual subsidiaries.",
    sections: [
      {
        heading: "Tech Subsidiaries",
        body: [
          "<div class='overflow-x-auto mt-4 rounded-lg border border-border'><table class='w-full text-sm text-left'>",
          "<thead class='bg-muted text-muted-foreground'><tr><th class='px-4 py-3 font-medium'>Subsidiary</th><th class='px-4 py-3 font-medium'>Priorities</th></tr></thead>",
          "<tbody class='divide-y divide-border'>",
          "<tr><td class='px-4 py-3 font-semibold'>EIB STRATOC</td><td class='px-4 py-3'>Integrate UAV missions with central ops, Ensure drone readiness & logistics, Standardize inter-sector reporting</td></tr>",
          "<tr><td class='px-4 py-3 font-semibold'>BRIECH UAS</td><td class='px-4 py-3'>Expand industrial drone service reach, Target Military/Energy/Agriculture, Accelerate R&D</td></tr>",
          "<tr><td class='px-4 py-3 font-semibold'>BRIECH ATLANTIC</td><td class='px-4 py-3'>Optimize asset utilization, Evaluate revenue channels</td></tr>",
          "<tr><td class='px-4 py-3 font-semibold'>POCTOVA</td><td class='px-4 py-3'>Strengthen tech development cycles, Drive adoption of internal tools, Support R&D</td></tr>",
          "</tbody></table></div>"
        ]
      },
      {
        heading: "Media & Community",
        body: [
          "<div class='overflow-x-auto mt-4 rounded-lg border border-border'><table class='w-full text-sm text-left'>",
          "<thead class='bg-muted text-muted-foreground'><tr><th class='px-4 py-3 font-medium'>Subsidiary</th><th class='px-4 py-3 font-medium'>Priorities</th></tr></thead>",
          "<tbody class='divide-y divide-border'>",
          "<tr><td class='px-4 py-3 font-semibold'>LUFT PayTV</td><td class='px-4 py-3'>Look forward to return on air, Align with Bright FM for media leverage</td></tr>",
          "<tr><td class='px-4 py-3 font-semibold'>Luftrieber Automobile</td><td class='px-4 py-3'>Standardize inventory & maintenance logs, Unify parts procurement, Explore expansion</td></tr>",
          "<tr><td class='px-4 py-3 font-semibold'>Bright FM</td><td class='px-4 py-3'>Streamline scheduling & quality, Drive joint initiatives with Foundation</td></tr>",
          "<tr><td class='px-4 py-3 font-semibold'>Bright Foundation</td><td class='px-4 py-3'>Develop 2026 CSR calendar, Strengthen community impact reporting</td></tr>",
          "</tbody></table></div>"
        ]
      }
    ],
    takeaways: ["Tech alignment", "Shared resources", "Service reach expansion"]
  },
  {
    key: "growth-readiness",
    title: "Growth & 2027 Readiness",
    minutes: 30,
    summary: "Preparing for the upcoming year and cementing group visibility.",
    sections: [
      {
        heading: "Phase 3: Growth & Visibility (Oct - Nov)",
        body: [
          "- **2027 Strategic Planning:** Collaborative growth target definition and investment focus with each subsidiary.",
          "- **Internal Alignment:** Group Townhall and Stakeholder Briefings to improve internal morale and unity.",
          "- **Digital Presence:** Launch of consolidated Group Website and Intranet Portal for unified branding.",
          "- **Corporate Citizenship:** CSR Summit via Bright Foundation to position the group as a responsible leader."
        ]
      },
      {
        heading: "Phase 4: Review & Transition (December)",
        body: [
          "- **Operational Reporting:** Completing the Year-End report with key insights and gap analysis.",
          "- **Leadership Appraisals:** Conducting performance reviews for all subsidiary Operations Heads.",
          "- **Executive Presentation:** Delivering data-driven recommendations to the Group CEO and Board.",
          "- **2027 Readiness:** Finalizing budget approval and resource allocation for the new year."
        ]
      }
    ],
    takeaways: ["2027 Budgeting", "Executive reviews", "Unified branding"]
  },
  {
    key: "success-metrics",
    title: "Success Metrics & Conclusion",
    minutes: 30,
    summary: "How the group measures success and aligns on accountability.",
    sections: [
      {
        heading: "Key Success Metrics",
        body: [
          "- **Operational Alignment:** 100% implementation of cross-company KPIs by September 2026.",
          "- **Cost Efficiency:** Achieve ≥10% savings through centralized procurement synergy.",
          "- **Innovation:** Launch at least 4 new intercompany product or service initiatives.",
          "- **Strategic Readiness:** 100% Board approval of the 2027 strategic and budget plan.",
          "- **Leadership:** Improved staff satisfaction and GM alignment based on Townhall feedback."
        ]
      },
      {
        heading: "Conclusion",
        body: [
          "This work plan establishes a roadmap for a unified, efficient, and resilient Briech Group. By prioritizing synergy and accountability, we lay the foundation for sustainable growth in 2027.",
          "**TRANSPARENCY • ACCOUNTABILITY • SYNERGY**"
        ]
      }
    ],
    takeaways: ["100% KPI Implementation", "Cost reduction by 10%", "Cross-company Innovation"]
  }
];

const gcooQuiz = [
  { prompt: "What is the targeted Cost Savings percentage via Procurement Synergy?", options: ["≥5%", "≥10%", "≥15%", "≥20%"], correctIndex: 1, explanation: "The GCOO Work Plan explicitly targets ≥10% cost savings." },
  { prompt: "Which of these is a stated priority for EIB STRATOC?", options: ["Targeting Agricultural Drones", "Expanding media footprint", "Integrate UAV missions with central ops", "Standardizing automotive inventory"], correctIndex: 2, explanation: "EIB Stratoc must integrate UAV missions with central ops and ensure drone readiness." },
  { prompt: "What happens in Phase 2 (Aug - Sep)?", options: ["Internal Audits", "Group Townhall", "Year-End Reporting", "Procurement Pilot & Ops Reviews"], correctIndex: 3, explanation: "Phase 2 involves the Procurement Pilot, Policy Harmonization, and Ops Reviews." },
  { prompt: "What is the strategic objective regarding Stakeholder Confidence?", options: ["Reducing headcounts", "Strengthening visibility and group-level credibility through transparent operations", "Stopping external communications", "Delegating all tasks to subsidiaries"], correctIndex: 1, explanation: "Confidence is built through transparent operations and group-level credibility." },
  { prompt: "By what date must cross-company KPIs be 100% implemented according to the Success Metrics?", options: ["December 2026", "July 2026", "September 2026", "October 2026"], correctIndex: 2, explanation: "Operational Alignment demands 100% implementation of cross-company KPIs by September 2026." },
  { prompt: "What is the main priority for Poctova?", options: ["UAV deployments", "Strengthen tech development cycles & drive adoption of internal tools", "Automotive procurement", "Radio broadcasting"], correctIndex: 1, explanation: "Poctova focuses on tech development cycles and internal tool adoption." },
  { prompt: "What happens during the December Phase 4?", options: ["CSR Summit", "Leadership Appraisals & 2027 Budget Readiness", "Internal Audits", "Procurement Pilot"], correctIndex: 1, explanation: "December focuses on appraisals, year-end reports, and 2027 budget readiness." },
  { prompt: "What is the core theme of the GCOO's concluding statement?", options: ["Competition and Profit", "Transparency, Accountability, Synergy", "Isolation and Speed", "Reducing compliance"], correctIndex: 1, explanation: "The pillars of the roadmap are Transparency, Accountability, and Synergy." },
  { prompt: "How many new intercompany product/service initiatives are targeted under 'Innovation'?", options: ["At least 2", "At least 4", "At least 6", "At least 10"], correctIndex: 1, explanation: "The success metric demands launching at least 4 new intercompany initiatives." },
  { prompt: "Which subsidiary is tasked with developing a 2026 CSR calendar?", options: ["Luft PayTV", "EIB Stratoc", "Bright Foundation", "Giga Forensics"], correctIndex: 2, explanation: "Bright Foundation handles CSR and community impact." }
];

const gigaLessons = [
  {
    key: "giga-mission",
    title: "Mission & Strategic Priorities",
    minutes: 30,
    summary: "An overview of Giga Forensics' H2 2026 strategic direction.",
    sections: [
      {
        heading: "Mission for H2 2026",
        body: [
          "Become the preferred provider and deliver innovative forensic, tracking, and lawful intercept solutions while achieving sustainable growth, operational excellence, and exceptional client satisfaction across Nigeria and Africa."
        ]
      },
      {
        heading: "Strategic Priorities",
        body: [
          "- Expand digital forensics",
          "- Enhance tracking solutions",
          "- Strengthen lawful intercept",
          "- Integration of AI",
          "- Improve customer satisfaction",
          "- Develop staff capacity",
          "- Grow revenue"
        ]
      }
    ],
    takeaways: ["Focus on AI Integration", "Lawful intercept enhancement", "Capacity development"]
  },
  {
    key: "giga-roadmap",
    title: "Digital Forensics & SOC Roadmap",
    minutes: 60,
    summary: "Infrastructure and technological acquisitions for the Security Operations Center.",
    sections: [
      {
        heading: "Acquisitions & Implementations",
        body: [
          "- **Software & Hardware:** Acquire software's for Forensics Labs.",
          "- **AI Solutions:** Acquire and Development of AI Solutions.",
          "- **SOC Operations:** Implement Infrastructures, Technologies needed to operate a SOC."
        ]
      },
      {
        heading: "Knowledge Expansion",
        body: [
          "The team is required to strictly expand knowledge on:",
          "1. Mobile forensics",
          "2. Computer forensics",
          "3. Cloud forensics",
          "4. Vehicle forensics",
          "",
          "We must also Develop Trainings on required skills to operate a SOC."
        ]
      }
    ],
    takeaways: ["Vehicle & Cloud Forensics", "SOC Infrastructure", "AI Acquisition"]
  },
  {
    key: "capacity-building",
    title: "Capacity Building & Certifications",
    minutes: 30,
    summary: "Training expectations for Giga Forensics staff.",
    sections: [
      {
        heading: "Staff Development Domains",
        body: [
          "To maintain our edge, staff must participate in:",
          "- **Certifications:** Earning recognized forensic credentials.",
          "- **Workshops:** Hands-on practical applications.",
          "- **Cybersecurity training:** Maintaining defensive postures.",
          "- **Leadership:** Grooming the next generation of managers.",
          "- **Knowledge sharing:** Internal dissemination of new forensic techniques."
        ]
      }
    ],
    takeaways: ["Mandatory Certifications", "Knowledge sharing"]
  }
];

const gigaQuiz = [
  { prompt: "What is the stated Mission for Giga Forensics in H2 2026?", options: ["To sell commercial software", "To become the preferred provider of innovative forensic, tracking, and lawful intercept solutions", "To exit the Nigerian market", "To manufacture drones"], correctIndex: 1, explanation: "The mission focuses on forensic, tracking, and lawful intercept solutions across Africa." },
  { prompt: "Which of the following is NOT one of the 4 specific forensic knowledge expansion areas?", options: ["Mobile forensics", "Computer forensics", "Vehicle forensics", "Bio-forensics"], correctIndex: 3, explanation: "The roadmap specifies Mobile, Computer, Cloud, and Vehicle forensics." },
  { prompt: "What infrastructure must be implemented according to the roadmap?", options: ["A new data center", "Technologies needed to operate a SOC (Security Operations Center)", "A retail outlet", "Public Wi-Fi towers"], correctIndex: 1, explanation: "The roadmap specifically demands infrastructure for a SOC." },
  { prompt: "Which technology integration is heavily prioritized for Giga Forensics?", options: ["Blockchain", "Integration of AI", "Virtual Reality", "Quantum Computing"], correctIndex: 1, explanation: "Integration and Acquisition of AI solutions is a core strategic priority." },
  { prompt: "What does Giga Forensics intend to do regarding 'Lawful Intercept'?", options: ["Abandon it", "Strengthen it", "Outsource it", "Sell it"], correctIndex: 1, explanation: "Strengthening lawful intercept is one of the 7 strategic priorities." },
  { prompt: "Which of these is a listed Capacity Building initiative?", options: ["Mandatory vacations", "Knowledge sharing", "Physical fitness", "Social media posting"], correctIndex: 1, explanation: "Knowledge sharing is one of the 5 capacity building pillars." },
  { prompt: "What is required to operate the SOC?", options: ["Develop Trainings on required skills", "Hiring only external consultants", "Shutting down the Forensics Lab", "Waiting for 2027"], correctIndex: 0, explanation: "Staff must develop trainings on required skills to operate the SOC." },
  { prompt: "Which metric is tied to 'Exceptional Client Satisfaction' in the mission?", options: ["Decreased prices", "Sustainable growth and operational excellence", "Faster typing speeds", "No complaints ever"], correctIndex: 1, explanation: "The mission links sustainable growth and operational excellence to client satisfaction." },
  { prompt: "Why must staff attend Cybersecurity training?", options: ["To learn programming", "As part of the mandatory capacity building framework", "To fix printers", "Only if they are developers"], correctIndex: 1, explanation: "Cybersecurity training is a core pillar of Capacity Building." },
  { prompt: "What is the geographical target of the H2 2026 Mission?", options: ["Lagos only", "Nigeria and Africa", "Global", "Europe"], correctIndex: 1, explanation: "The mission states 'across Nigeria and Africa'." }
];

async function run() {
  try {
    const gcooContent = JSON.stringify({ lessons: gcooLessons, quiz: gcooQuiz });
    const gigaContent = JSON.stringify({ lessons: gigaLessons, quiz: gigaQuiz });

    const q = `
      INSERT INTO "courses" (slug, title, description, category, level, format, "durationHours", "priceNaira", subsidiaries, "customContent", "authorId")
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11),
      ($12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      ON CONFLICT (slug) DO UPDATE 
      SET title = EXCLUDED.title, description = EXCLUDED.description, "customContent" = EXCLUDED."customContent";
    `;

    await pool.query(q, [
      // GCOO
      'gcoo-operations-workplan-2026',
      'GCOO Comprehensive Operations & 2026 Work Plan',
      'Detailed operational priorities, timelines, and integration strategies across all subsidiaries as presented by the Group Chief Operations Officer.',
      'Operational',
      'Advanced',
      'Online',
      4,
      0,
      'EIB Group',
      gcooContent,
      'michael.marquis@eibgroup.com',

      // Giga
      'giga-forensics-h2-2026-strategy',
      'Giga Forensics H2 2026 Operations & Strategy',
      'Strategic roadmap, SOC requirements, and capacity building mandates for Giga Forensics.',
      'Technical',
      'Intermediate',
      'Online',
      2,
      0,
      'Giga Forensics',
      gigaContent,
      'michael.marquis@eibgroup.com'
    ]);

    console.log('Successfully inserted GCOO and Giga courses!');
  } catch(e) {
    console.error('Error inserting courses', e);
  } finally {
    process.exit(0);
  }
}

run();
