const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function migrateBriefings() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    // A course was considered a briefing if it had customContent and wasn't Global.
    // Let's set isBriefing = true for all courses matching that.
    const q = `
      UPDATE courses
      SET "isBriefing" = true
      WHERE "customContent" IS NOT NULL 
        AND "customContent" != '' 
        AND subsidiaries NOT ILIKE '%Global%'
      RETURNING title, "isBriefing";
    `;
    const r = await p.query(q);
    console.log("Migrated courses to Briefings:");
    console.table(r.rows);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
migrateBriefings();
