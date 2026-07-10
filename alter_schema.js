const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function addColumn() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const q = 'ALTER TABLE courses ADD COLUMN "isBriefing" BOOLEAN NOT NULL DEFAULT false;';
    await p.query(q);
    console.log("Column added successfully.");
  } catch(e) {
    if (e.code === '42701') {
      console.log("Column already exists.");
    } else {
      console.error(e);
    }
  } finally {
    p.end();
  }
}
addColumn();
