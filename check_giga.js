const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function checkGiga() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const r = await p.query("SELECT title, subsidiaries FROM courses WHERE slug='giga-forensics-h2-2026-strategy'");
    console.log(r.rows);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
checkGiga();
