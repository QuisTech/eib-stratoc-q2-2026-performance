const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function fixUser() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    // We update Ishaku Tarfa to be a lead for BLACK/DCI-Intel
    const q = `
      UPDATE "user"
      SET role = 'lead', subsidiary = 'BLACK'
      WHERE email = 'ishaku.tarfa@eibgroup.com'
      RETURNING id, name, role, subsidiary;
    `;
    const r = await p.query(q);
    console.log("Updated Ishaku Tarfa:", r.rows[0]);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
fixUser();
