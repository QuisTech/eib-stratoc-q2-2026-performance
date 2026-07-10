const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function fix() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const q = 'UPDATE courses SET "customContent" = NULL WHERE title ILIKE \'%DCI-Intel: Fundamentals%\' RETURNING id';
    const r = await p.query(q);
    console.log("Fixed course ID:", r.rows[0]?.id);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
fix();
