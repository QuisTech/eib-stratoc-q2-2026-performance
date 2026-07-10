const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function fix() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const r = await p.query("SELECT \"customContent\" FROM courses WHERE slug='monitoring-evaluation-q3-action-plan'");
    if (r.rows.length > 0) {
      const c = JSON.parse(r.rows[0].customContent);
      
      // Update attachments
      let updated = false;
      c.lessons.forEach(l => {
        if (l.attachments) {
          l.attachments.forEach(att => {
            if (att.url === '/docs/me-q3-action-report.pdf') {
              att.url = '/docs/monitoring-evaluation-h2-action-report.pdf';
              att.title = 'M&E H2 Action Report (PDF)';
              updated = true;
            }
          });
        }
      });
      
      if (updated) {
        await p.query("UPDATE courses SET \"customContent\" = $1 WHERE slug='monitoring-evaluation-q3-action-plan'", [JSON.stringify(c)]);
        console.log("Updated attachments successfully.");
      } else {
        console.log("No attachments needed updating.");
      }
    } else {
      console.log("Course not found");
    }
  } finally {
    p.end();
  }
}
fix();
