const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function addBlack() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const q = 'UPDATE courses SET subsidiaries = \'DCI - Intel, BLACK\' WHERE slug = \'dci-intel-fundamentals\' RETURNING id';
    const r = await p.query(q);
    console.log("Updated course ID:", r.rows[0]?.id);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
addBlack();
