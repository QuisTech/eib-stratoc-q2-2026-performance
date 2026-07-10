const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function checkUser() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const q = 'SELECT * FROM "user" WHERE email = \'ishaku.tarfa@eibgroup.com\'';
    const r = await p.query(q);
    console.log(r.rows);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
checkUser();
