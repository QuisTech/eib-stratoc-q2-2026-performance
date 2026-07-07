const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const courseIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    for (let i = 0; i < courseIds.length; i++) {
      const id = courseIds[i];
      const imageUrl = `/thumbnails/course_${i+1}.png`;
      await pool.query('UPDATE courses SET "imageUrl" = $1 WHERE id = $2', [imageUrl, id]);
    }
    console.log(`Successfully assigned custom AI images to ${courseIds.length} courses.`);
  } catch(e) {
    console.error(e)
  } finally {
    pool.end();
  }
}
run();
