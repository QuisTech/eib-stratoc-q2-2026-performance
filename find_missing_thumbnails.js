const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FIB5gDZVS0no@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
});
async function main() {
  const res = await pool.query('SELECT id, title, slug, "imageUrl" FROM courses WHERE "imageUrl" IS NULL OR "imageUrl" = \'\' ORDER BY id ASC');
  const courses = res.rows;
  
  if (courses.length === 0) {
    console.log("No courses found without an imageUrl.");
  } else {
    console.log("Courses needing thumbnails:");
    courses.forEach(c => console.log(`  - ID: ${c.id}, Title: "${c.title}"`));
  }

  await pool.end();
}
main().catch(console.error);
