const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const res = await pool.query("SELECT id, slug, title, \"customContent\" FROM courses WHERE title LIKE '%Monitoring & Evaluation%'");
    
    if (res.rows.length === 0) {
      console.log("Course not found!");
      return;
    }

    const course = res.rows[0];
    let content = typeof course.customContent === 'string' ? JSON.parse(course.customContent) : course.customContent;
    
    if (!content) {
      content = { lessons: [] };
    }
    
    if (!content.lessons || content.lessons.length === 0) {
      content.lessons = [{ title: "Overview", attachments: [] }];
    }
    
    if (!content.lessons[0].attachments) {
      content.lessons[0].attachments = [];
    }

    // Add the new attachment
    content.lessons[0].attachments.push({
      title: "Monitoring & Evaluation H2 Action Report (PDF)",
      url: "/docs/monitoring-evaluation-h2-action-report.pdf"
    });

    await pool.query('UPDATE courses SET "customContent" = $1 WHERE id = $2', [
      JSON.stringify(content),
      course.id
    ]);

    console.log("Successfully added the PDF to the Monitoring & Evaluation course.");
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();
