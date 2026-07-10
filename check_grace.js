const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FIB5gDZVS0no@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
});
async function main() {
  const r = await pool.query(
    `SELECT id, name, email, subsidiary, role FROM "user" WHERE email ILIKE '%nnaji%' OR name ILIKE '%nnaji%' OR name ILIKE '%grace n%' OR email = 'nnajigrace2004@gmail.com'`
  );
  console.log("Grace Nnaji search results:", JSON.stringify(r.rows, null, 2));
  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
