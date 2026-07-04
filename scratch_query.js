const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const res = await pool.query('SELECT title, "customContent" FROM courses WHERE subsidiaries = $1', ['POCTOVA']);
    console.dir(res.rows, {depth: null});
  } finally {
    pool.end();
  }
}
run();
