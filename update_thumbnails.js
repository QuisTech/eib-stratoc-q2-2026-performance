const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FIB5gDZVS0no@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
});
async function main() {
  const updates = [
    { id: 71, imageUrl: "/thumbnails/course_71.png" },
    { id: 72, imageUrl: "/thumbnails/course_72.png" },
    { id: 73, imageUrl: "/thumbnails/course_73.png" },
  ];
  for (const u of updates) {
    await pool.query('UPDATE courses SET "imageUrl" = $1 WHERE id = $2', [u.imageUrl, u.id]);
    console.log(`Updated course ${u.id} with imageUrl ${u.imageUrl}`);
  }
  await pool.end();
}
main().catch(e => console.error(e));
