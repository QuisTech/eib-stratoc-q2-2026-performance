const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    await pool.query('UPDATE courses SET "imageUrl" = $1 WHERE slug = $2', ['/thumbnails/bef_foundation.png', 'bef-q3-2026-workplan']);
    console.log('BEF Foundation Workplan thumbnail updated successfully.');
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
