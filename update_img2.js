const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function update() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const q = 'UPDATE courses SET "imageUrl" = \'/thumbnails/dci_intel_thumbnail.png\' WHERE title ILIKE \'%DCI-Intel: Fundamentals%\' RETURNING id';
    const r = await p.query(q);
    console.log("Updated course ID:", r.rows[0]?.id);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
update();
