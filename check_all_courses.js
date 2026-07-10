const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FIB5gDZVS0no@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
});
async function main() {
  const res = await pool.query(`SELECT id, title, subsidiaries, "isBriefing" FROM courses WHERE "isBriefing" = false ORDER BY subsidiaries, title`);
  console.log(`Total non-briefing courses: ${res.rows.length}`);
  res.rows.forEach(c => console.log(`  [ID ${c.id}] ${c.title} | subs: ${c.subsidiaries}`));

  console.log("\n--- POCTOVA courses ---");
  const poctova = await pool.query(`SELECT id, title, subsidiaries, "isBriefing" FROM courses WHERE subsidiaries ILIKE '%poctova%'`);
  poctova.rows.forEach(c => console.log(`  [ID ${c.id}] ${c.title} | subs: ${c.subsidiaries} | briefing: ${c.isBriefing}`));

  console.log("\n--- BLACK-only courses (non-briefing) ---");
  const black = await pool.query(`SELECT id, title, subsidiaries, "isBriefing" FROM courses WHERE "isBriefing" = false AND (subsidiaries ILIKE '%black%')`);
  black.rows.forEach(c => console.log(`  [ID ${c.id}] ${c.title} | subs: ${c.subsidiaries}`));

  await pool.end();
}
main().catch(e=>console.error(e));
