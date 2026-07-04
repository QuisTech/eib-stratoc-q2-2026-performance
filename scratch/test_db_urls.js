const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

async function test() {
  try {
    const res = await pool.query(`SELECT slug, "customContent" FROM courses WHERE slug = 'bef-q3-2026-workplan'`);
    if (res.rows.length > 0) {
      console.log('Seeded customContent:', res.rows[0].customContent);
    } else {
      console.log('Course not found in database!');
    }
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
test();
