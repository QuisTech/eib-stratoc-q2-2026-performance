const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const res = await pool.query(`
      SELECT "user".email, account.password, "user"."mustChangePassword"
      FROM account 
      JOIN "user" ON account."userId" = "user".id 
      WHERE "user"."mustChangePassword" = true
      AND "user".email NOT LIKE '%test%'
      AND "user".email != 'learner@eibgroup.com'
      AND "user".email != 'manager@eibgroup.com'
      LIMIT 1
    `);
    console.log('Sample unmodified user:', res.rows[0]);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
