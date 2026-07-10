const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function addContent() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const customContent = {
      lessons: [
        {
          key: "intel-intro",
          title: "Introduction to Intelligence Analysis",
          minutes: 45,
          summary: "Core concepts of raw intelligence processing.",
          attachments: [
            {
              title: "Black Mid-Year Presentation (PDF)",
              url: "/docs/black-mid-year-presentation.pdf"
            }
          ],
          sections: [
            {
              heading: "The Intelligence Cycle",
              body: [
                "- **Planning & Direction:** Establishing intelligence requirements based on command directives.",
                "- **Collection & Processing:** Gathering raw data and formatting it for analyst review.",
                "- **Analysis & Dissemination:** Evaluating the data, creating actionable intelligence, and distributing it to decision-makers."
              ]
            }
          ],
          takeaways: [
            "Intelligence is only useful if actionable.",
            "Raw data must be verified before analysis."
          ]
        },
        {
          key: "intel-reporting",
          title: "Structured Reporting",
          minutes: 60,
          summary: "How to draft clear, concise, and accurate intel reports.",
          sections: [
            {
              heading: "Writing for the Executive",
              body: [
                "- **BLUF (Bottom Line Up Front):** Lead with the most critical assessment.",
                "- **Fact vs Assessment:** Clearly distinguish between verified information and analyst conjecture.",
                "- **Confidence Levels:** Assign High, Moderate, or Low confidence to assessments based on source reliability."
              ]
            }
          ],
          takeaways: [
            "Use clear, unambiguous language.",
            "Always cite sources and assign confidence levels."
          ]
        }
      ],
      quiz: [
        {
          id: "intel-q1",
          prompt: "What is the primary purpose of the BLUF format?",
          options: [
            "To make the report longer",
            "To deliver the most critical information immediately",
            "To hide the source",
            "To confuse the adversary"
          ],
          correctIndex: 1,
          explanation: "BLUF (Bottom Line Up Front) ensures the reader gets the critical takeaway immediately."
        },
        {
          id: "intel-q2",
          prompt: "In analysis, what must be clearly separated?",
          options: [
            "Facts and assessments",
            "Digital and physical files",
            "Names and dates",
            "Nothing, blend them together"
          ],
          correctIndex: 0,
          explanation: "An analyst must clearly distinguish between verified facts and their own assessments."
        }
      ]
    };

    const q = 'UPDATE courses SET "customContent" = $1 WHERE slug = \'dci-intel-fundamentals-of-analysis-reporting\' RETURNING id';
    const r = await p.query(q, [JSON.stringify(customContent)]);
    console.log("Updated course ID:", r.rows[0]?.id);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
addContent();
