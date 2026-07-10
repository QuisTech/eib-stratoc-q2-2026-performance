const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FIB5gDZVS0no@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
});
async function main() {
  const res = await pool.query('SELECT "customContent" FROM courses WHERE slug = $1', ['group-chief-operating-officer-comprehensive-operations-staff-training']);
  const content = typeof res.rows[0].customContent === 'string' ? JSON.parse(res.rows[0].customContent) : res.rows[0].customContent;
  console.log(JSON.stringify(content.lessons.map(l => ({ key: l.key, len: l.key.length, charCodes: l.key.split('').map(c => c.charCodeAt(0)) }))));
  await pool.end();
}
main().catch(console.error);
