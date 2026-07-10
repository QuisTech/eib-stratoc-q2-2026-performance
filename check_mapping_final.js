const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const res = await pool.query(`
      SELECT id, slug, title, "imageUrl" 
      FROM courses 
      ORDER BY id ASC
    `);
    
    for(const row of res.rows) {
      console.log(`${row.id.toString().padEnd(3)} | ${row.slug.padEnd(45)} | ${row.imageUrl}`);
    }
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
