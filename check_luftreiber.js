const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function checkCourse() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const q = 'SELECT title, slug, subsidiaries, "customContent" FROM courses WHERE title LIKE \'%Luftreiber Automobile: Building%\'';
    const r = await p.query(q);
    console.log(r.rows);
  } catch(e) {
    console.error(e);
  } finally {
    p.end();
  }
}
checkCourse();
