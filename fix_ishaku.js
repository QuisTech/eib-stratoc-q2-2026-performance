const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fix() {
  try {
    const email = 'ishaku.tarfa@eibgroup.com';
    
    // Get the standard Changepwd hash from michael.marquis
    const hashRes = await pool.query('SELECT account.password FROM account JOIN "user" ON account."userId" = "user".id WHERE "user".email = $1 LIMIT 1', ['michael.marquis@eibgroup.com']);
    const standardHash = hashRes.rows[0].password;
    
    // Update Ishaku's password
    const updateRes = await pool.query('UPDATE account SET password = $1 FROM "user" WHERE account."userId" = "user".id AND "user".email = $2', [standardHash, email]);
    
    console.log(`Password reset for ${email}. Row count: ${updateRes.rowCount}`);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
fix();
