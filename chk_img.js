const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function chkImg() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const q = 'SELECT title, "imageUrl" FROM courses WHERE slug=\'dci-intel-fundamentals-of-analysis-reporting\'';
    const r = await p.query(q);
    console.log(r.rows);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
chkImg();
