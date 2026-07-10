const { Pool } = require("pg");
const { isCourseVisibleToUser } = require("./lib/utils.ts");

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FIB5gDZVS0no@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
});

async function main() {
  const userQuery = await pool.query('SELECT * FROM "user" WHERE email ILIKE $1', ['%gideon.edeh%']);
  const user = userQuery.rows[0];
  
  if (!user) {
    console.log("User not found!");
    return;
  }

  const coursesQuery = await pool.query('SELECT * FROM courses WHERE "isBriefing" = false');
  const allCourses = coursesQuery.rows;

  const visible = allCourses.filter(c => isCourseVisibleToUser(c.subsidiaries, user.subsidiary, user.role, user.email));
  
  console.log(`Gideon (${user.email}, sub=${user.subsidiary}, role=${user.role}) sees ${visible.length} courses:`);
  visible.forEach(c => console.log(`  - [ID ${c.id}] ${c.title} (subs: ${c.subsidiaries})`));

  await pool.end();
}
main().catch(e=>console.error(e));
