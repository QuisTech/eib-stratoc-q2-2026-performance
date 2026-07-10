const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FIB5gDZVS0no@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
});
async function main() {
  const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'courses' ORDER BY ordinal_position");
  console.log("Courses columns:", res.rows.map(r => r.column_name));
  await pool.end();
}
main().catch(e => console.error(e));
