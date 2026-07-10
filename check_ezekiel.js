const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function checkUser() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const r1 = await p.query('SELECT * FROM "user" WHERE email = \'ezekiel.okenyeka@dico.eibstratoc.com\'');
    console.log("Ezekiel:", r1.rows[0]);
    const r2 = await p.query('SELECT * FROM "user" WHERE email = \'ishaku.tarfa@eibgroup.com\'');
    console.log("Ishaku:", r2.rows[0]);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
checkUser();
