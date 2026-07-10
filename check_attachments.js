const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function check() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const r = await p.query("SELECT \"customContent\" FROM courses WHERE slug='monitoring-evaluation-q3-action-plan'");
    if (r.rows.length > 0) {
      const c = JSON.parse(r.rows[0].customContent);
      console.log("Attachments:");
      c.lessons.forEach(l => {
        if (l.attachments && l.attachments.length > 0) {
          console.log(l.attachments);
        }
      });
    } else {
      console.log("Course not found");
    }
  } finally {
    p.end();
  }
}
check();
