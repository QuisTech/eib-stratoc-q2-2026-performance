const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const res = await pool.query('SELECT id, title, category, format FROM courses ORDER BY id ASC');
    const filtered = res.rows.filter(r => !["EIB Group Global Orientation", "Camps Security Strategic Plan 2026", "Directorate of Clandestine & Intelligence (BLACK)"].includes(r.title));
    fs.writeFileSync('courses_to_gen.json', JSON.stringify(filtered, null, 2));
    console.log(`Saved ${filtered.length} courses to courses_to_gen.json`);
  } catch(e) {
    console.error(e)
  } finally {
    pool.end();
  }
}
run();
