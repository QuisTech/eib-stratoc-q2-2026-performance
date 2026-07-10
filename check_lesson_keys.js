const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FIB5gDZVS0no@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
});
async function main() {
  const res = await pool.query('SELECT title, "customContent" FROM courses WHERE slug = $1', ['group-chief-operating-officer-comprehensive-operations-staff-training']);
  if (res.rows.length === 0) {
    console.log("Course not found!");
    return;
  }
  const content = res.rows[0].customContent;
  let parsed = content;
  if (typeof content === 'string') {
    parsed = JSON.parse(content);
  }
  
  if (parsed && parsed.lessons) {
    parsed.lessons.forEach((l) => {
        console.log(`Lesson key: "${l.key}"`);
    });
  } else {
    console.log("No lessons found", parsed);
  }

  await pool.end();
}
main().catch(console.error);
