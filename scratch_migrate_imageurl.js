const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    await pool.query('ALTER TABLE courses ADD COLUMN "imageUrl" text;');
    console.log("Column added successfully.");
  } catch(e) {
    if (e.code === '42701') {
      console.log("Column already exists.");
    } else {
      console.error(e)
    }
  } finally {
    pool.end();
  }
}
run();
