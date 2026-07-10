const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const emails = [
    'chairman@eibgroup.com',
    'evp-ops-admin@eibgroup.com',
    'evp-finance-commercial@eibgroup.com'
  ];

  // We are using a known hash for "Password123!"
  const defaultHash = '54fbfb4ab35d8fd560b9167e3c3bed4b:a0711277147361d8153bb92103e8529f5ef6965e2c6bd2cb1f20c4fc42b5e9611e6f3e4567b6f2ca4e5f7ab3280c34ba02db242a1ef1754d71470ad1a78cd535';

  try {
    for (const email of emails) {
      // Get the userId for the given email
      const userRes = await pool.query('SELECT id FROM "user" WHERE email = $1', [email]);
      if (userRes.rows.length === 0) {
        console.log(`User not found: ${email}`);
        continue;
      }
      const userId = userRes.rows[0].id;

      // Update the user table
      await pool.query('UPDATE "user" SET "mustChangePassword" = true WHERE id = $1', [userId]);

      // Update the account table
      await pool.query('UPDATE account SET password = $1 WHERE "userId" = $2', [defaultHash, userId]);
      
      console.log(`Successfully reset account for ${email}`);
    }
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
