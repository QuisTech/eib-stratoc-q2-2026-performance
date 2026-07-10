const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FIB5gDZVS0no@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
});
async function main() {
  const res = await pool.query(`SELECT id, title, subsidiaries, "isBriefing" FROM courses WHERE subsidiaries ILIKE '%black%' OR subsidiaries ILIKE '%dci%'`);
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}
main().catch(e=>console.error(e));
