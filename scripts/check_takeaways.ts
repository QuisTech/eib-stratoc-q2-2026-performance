import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  const res = await pool.query(`SELECT "customContent" FROM courses WHERE title = 'IT Support Professional'`);
  const content = JSON.parse(res.rows[0].customContent);
  console.log("Takeaways:", JSON.stringify(content.lessons[1].takeaways, null, 2));
  process.exit(0);
}
main();
