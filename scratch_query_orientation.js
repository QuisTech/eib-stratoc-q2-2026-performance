const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const res = await pool.query("SELECT id, title, \"customContent\" FROM courses WHERE title LIKE '%Global Orientation%'");
    console.log(res.rows[0]);
  } catch(e) {
    console.error(e)
  } finally {
    pool.end();
  }
}
run();
