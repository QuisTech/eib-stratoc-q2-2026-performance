const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fix() {
  try {
    // Get the TRUE standard Changepwd hash from grouphead@eibgroup.com
    const hashRes = await pool.query('SELECT account.password FROM account JOIN "user" ON account."userId" = "user".id WHERE "user".email = $1 LIMIT 1', ['grouphead@eibgroup.com']);
    const standardHash = hashRes.rows[0].password;
    console.log("Using TRUE standard hash for Changepwd:", standardHash);
    
    // Update Ishaku, Babatunde, Uche
    const emails = [
      'ishaku.tarfa@eibgroup.com',
      'babatunde.babalola@eibgroup.com',
      'uche.duruji@eibgroup.com'
    ];
    
    for (const email of emails) {
      const updateRes = await pool.query('UPDATE account SET password = $1 FROM "user" WHERE account."userId" = "user".id AND "user".email = $2', [standardHash, email]);
      console.log(`Password reset for ${email}. Row count: ${updateRes.rowCount}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
fix();
