const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const res = await pool.query(`
      SELECT account.password 
      FROM account 
      JOIN "user" ON account."userId" = "user".id 
      WHERE "user".email = 'learner@eibgroup.com'
    `);
    console.log('Learner password hash:', res.rows[0]?.password);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
