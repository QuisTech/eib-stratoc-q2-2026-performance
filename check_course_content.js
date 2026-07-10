const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function checkContent() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const q = 'SELECT title, subsidiaries, "customContent" IS NOT NULL as has_content FROM courses WHERE subsidiaries ILIKE \'%DCI%\'';
    const r = await p.query(q);
    console.table(r.rows);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
checkContent();
