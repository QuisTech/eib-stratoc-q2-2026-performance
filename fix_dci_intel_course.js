const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function fixCourse() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    // Set customContent to NULL for the newly added DCI-Intel course
    const q = 'UPDATE courses SET "customContent" = NULL WHERE slug = \'dci-intel-fundamentals\' RETURNING id';
    const r = await p.query(q);
    console.log("Fixed course ID:", r.rows[0]?.id);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
fixCourse();
