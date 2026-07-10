const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function updateTitle() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const q = 'UPDATE courses SET title = \'DCI-Intel: Information Gathering & Analysis\' WHERE title = \'INTEL: Information Gathering & Analysis\' RETURNING id, title';
    const r = await p.query(q);
    console.log("Updated course:", r.rows[0]);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
updateTitle();
