const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const email = `dummy_${Date.now()}@eibgroup.com`;
  try {
    const res = await fetch("https://lms-eibgroup.vercel.app/api/auth/sign-up/email", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Origin": "https://lms-eibgroup.vercel.app"
      },
      body: JSON.stringify({
        email: email,
        password: "Changepwd",
        name: "Dummy User"
      })
    });
    
    const data = await res.json();
    console.log("Signup response:", data);
    
    // Grab the hash
    const hashRes = await pool.query('SELECT account.password FROM account JOIN "user" ON account."userId" = "user".id WHERE "user".email = $1', [email]);
    const hash = hashRes.rows[0].password;
    console.log(`Hash for Changepwd is: ${hash}`);
    
    // Now apply this hash to the 3 executives
    const emails = [
      'ishaku.tarfa@eibgroup.com',
      'babatunde.babalola@eibgroup.com',
      'uche.duruji@eibgroup.com'
    ];
    
    for (const execEmail of emails) {
      const userRes = await pool.query('SELECT id FROM "user" WHERE email = $1', [execEmail]);
      if (userRes.rows.length > 0) {
        const userId = userRes.rows[0].id;
        await pool.query('UPDATE account SET password = $1 WHERE "userId" = $2', [hash, userId]);
        console.log(`Updated password for ${execEmail}`);
      }
    }
    
    // Cleanup dummy user
    await pool.query('DELETE FROM account WHERE "userId" = (SELECT id FROM "user" WHERE email = $1)', [email]);
    await pool.query('DELETE FROM session WHERE "userId" = (SELECT id FROM "user" WHERE email = $1)', [email]);
    await pool.query('DELETE FROM "user" WHERE email = $1', [email]);
    console.log("Cleanup done.");
    
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

main();
