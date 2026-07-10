const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function chk() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const r1 = await p.query('SELECT * FROM courses WHERE slug=\'psap-emergency-response-osint\'');
    const r2 = await p.query('SELECT * FROM courses WHERE slug=\'dci-intel-fundamentals\'');
    console.log("PSAP Course:", r1.rows[0]);
    console.log("INTEL Course:", r2.rows[0]);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
chk();
