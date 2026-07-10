const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FIB5gDZVS0no@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
});
async function main() {
  const res = await pool.query('SELECT id, title, slug, "imageUrl", "isBriefing" FROM courses ORDER BY id ASC');
  const courses = res.rows;
  
  const imageCounts = {};
  courses.forEach(c => {
    if (c.imageUrl) {
      if (!imageCounts[c.imageUrl]) imageCounts[c.imageUrl] = [];
      imageCounts[c.imageUrl].push(c);
    }
  });

  console.log("Shared images:");
  for (const [img, list] of Object.entries(imageCounts)) {
    if (list.length > 1) {
      console.log(`\nImage: ${img}`);
      list.forEach(c => console.log(`  - ID: ${c.id}, Title: "${c.title}", isBriefing: ${c.isBriefing}`));
    }
  }

  await pool.end();
}
main().catch(console.error);
