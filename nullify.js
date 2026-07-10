const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function nullify() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const q = 'UPDATE courses SET "customContent" = NULL WHERE slug = \'dci-intel-fundamentals-of-analysis-reporting\' RETURNING id';
    const r = await p.query(q);
    console.log("Updated course ID:", r.rows[0]?.id);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
nullify();
