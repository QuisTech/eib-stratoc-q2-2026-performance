const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function insertCourse() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    // Generate a simple DCI Intel course content
    const customContent = {
      lessons: [
        {
          key: "intel-intro",
          title: "Introduction to Intelligence Analysis",
          minutes: 45,
          summary: "Core concepts of raw intelligence processing.",
          sections: [
            {
              heading: "The Intelligence Cycle",
              body: [
                "Understanding the full cycle from planning and direction to collection, processing, analysis, and dissemination.",
                "How DCI-Intel integrates within the broader EIB Group framework."
              ]
            }
          ],
          takeaways: [
            "Intelligence is only useful if actionable.",
            "Raw data must be verified before analysis."
          ],
          attachments: []
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
                "BLUF (Bottom Line Up Front) formatting.",
                "Separating fact from assessment and mitigating cognitive bias."
              ]
            }
          ],
          takeaways: [
            "Use clear, unambiguous language.",
            "Always cite sources and assign confidence levels."
          ],
          attachments: []
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

    const q = `
      INSERT INTO courses (
        slug, title, description, level, category, format, 
        "priceNaira", "durationHours", subsidiaries, 
        "authorId", "initiative", "customContent"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      ) RETURNING id;
    `;
    const values = [
      'dci-intel-fundamentals',
      'DCI-Intel: Fundamentals of Analysis & Reporting',
      'Core intelligence analysis methodologies and structured reporting protocols for DCI analysts.',
      'Intermediate',
      'Intelligence & Security',
      'Online',
      4000000,
      10,
      'DCI - Intel',
      'system',
      4,
      JSON.stringify(customContent)
    ];

    const res = await p.query(q, values);
    console.log("Successfully inserted course with ID:", res.rows[0].id);
  } catch (err) {
    console.error("Error inserting course:", err);
  } finally {
    p.end();
  }
}
insertCourse();
