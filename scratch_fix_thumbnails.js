const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const res = await pool.query('SELECT id, title, category FROM courses');
    let updatedCount = 0;
    
    for (const row of res.rows) {
      // Keep the premium AI images for the specific courses
      if (
        row.title === "EIB Group Global Orientation" || 
        row.title.includes("Camps Security") || 
        row.title.includes("(BLACK)")
      ) {
        continue;
      }

      // Generate a unique URL based on the course ID and Category
      const keyword1 = row.category.split(' ')[0].replace(/[^a-zA-Z]/g, '').toLowerCase() || 'business';
      const imageUrl = `https://loremflickr.com/800/600/${keyword1},corporate?lock=${row.id}`;

      await pool.query('UPDATE courses SET "imageUrl" = $1 WHERE id = $2', [imageUrl, row.id]);
      updatedCount++;
    }
    console.log(`Successfully assigned unique, relatable corporate images to ${updatedCount} courses.`);
  } catch(e) {
    console.error(e)
  } finally {
    pool.end();
  }
}
run();
