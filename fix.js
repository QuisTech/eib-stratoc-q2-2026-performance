require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');

async function fix() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query("UPDATE \"user\" SET role = 'group_head' WHERE email = 'marquis.abimbola@dico.eibstratoc.com'");
    console.log(res.rowCount + ' row(s) updated');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
fix();
