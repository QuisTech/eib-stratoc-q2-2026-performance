const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  try {
    const email = 'ishaku.tarfa@eibgroup.com';
    const userRes = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      console.log(`User ${email} not found in database.`);
      return;
    }
    const user = userRes.rows[0];
    console.log("USER TABLE:");
    console.log(user);

    const accRes = await pool.query('SELECT * FROM account WHERE "userId" = $1', [user.id]);
    if (accRes.rows.length === 0) {
      console.log(`No account record found for ${email}. They cannot log in without an account record.`);
      return;
    }
    const acc = accRes.rows[0];
    console.log("ACCOUNT TABLE (has password?):", acc.password ? "YES" : "NO");
    console.log("ACCOUNT DETAILS:");
    console.log({ id: acc.id, providerId: acc.providerId });
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
check();
