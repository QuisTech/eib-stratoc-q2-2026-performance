const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FIB5gDZVS0no@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
});
async function main() {
  const updates = [
    { id: 69, imageUrl: "/thumbnails/course_69_lms.png" },
    { id: 56, imageUrl: "/thumbnails/course_56_lms.png" },
    { id: 68, imageUrl: "/thumbnails/course_68_lms.png" },
    { id: 66, imageUrl: "/thumbnails/course_66_lms.png" },
    { id: 67, imageUrl: "/thumbnails/course_67_lms.png" },
    { id: 62, imageUrl: "/thumbnails/course_62_lms.png" },
    { id: 74, imageUrl: "/thumbnails/course_74_lms.png" },
    { id: 60, imageUrl: "/thumbnails/course_60_lms.png" },
    { id: 59, imageUrl: "/thumbnails/course_59_lms.png" },
    { id: 64, imageUrl: "/thumbnails/course_64_lms.png" },
    { id: 65, imageUrl: "/thumbnails/course_65_lms.png" },
    { id: 57, imageUrl: "/thumbnails/course_57_lms.png" },
    { id: 58, imageUrl: "/thumbnails/course_58_lms.png" },
    { id: 63, imageUrl: "/thumbnails/course_63_lms.png" },
    { id: 61, imageUrl: "/thumbnails/course_61_lms.png" }
  ];

  for (const u of updates) {
    await pool.query('UPDATE courses SET "imageUrl" = $1 WHERE id = $2', [u.imageUrl, u.id]);
    console.log(`Updated course ${u.id} with imageUrl ${u.imageUrl}`);
  }

  await pool.end();
}
main().catch(console.error);
