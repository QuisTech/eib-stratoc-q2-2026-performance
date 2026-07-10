const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  try {
    // Grab the hash for Changepwd from michael.marquis (or someone else)
    const hashRes = await pool.query('SELECT account.password FROM account JOIN "user" ON account."userId" = "user".id WHERE "user".email = $1 LIMIT 1', ['michael.marquis@eibgroup.com']);
    
    if (hashRes.rows.length === 0) {
      console.log("Could not find hash.");
      return;
    }
    
    const hash = hashRes.rows[0].password;
    console.log(`Using existing hash for Changepwd`);
    
    const emails = [
      'babatunde.babalola@eibgroup.com',
      'uche.duruji@eibgroup.com'
    ];
    
    for (const email of emails) {
      const userRes = await pool.query('SELECT id FROM "user" WHERE email = $1', [email]);
      if (userRes.rows.length > 0) {
        const userId = userRes.rows[0].id;
        
        // Insert or update account table
        const accountQuery = `
          INSERT INTO account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
          VALUES ($1, $2, 'credential', $3, $4, NOW(), NOW())
          ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password
        `;
        const accountId = 'account_' + Date.now() + Math.floor(Math.random()*1000);
        // We will just try to insert. If it fails, maybe there's a unique constraint on userId + providerId.
        // Actually let's just delete the existing account row and insert a fresh one
        await pool.query('DELETE FROM account WHERE "userId" = $1', [userId]);
        await pool.query(accountQuery, [accountId, email, userId, hash]);
        
        console.log(`Set password for ${email}`);
      }
    }
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

main();
