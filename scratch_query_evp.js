const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const res = await pool.query("SELECT title, \"customContent\" FROM courses WHERE title LIKE '%EVP%'");
    console.log(res.rows[0].customContent);
  } catch(e) {
    console.error(e)
  } finally {
    pool.end();
  }
}
run();
