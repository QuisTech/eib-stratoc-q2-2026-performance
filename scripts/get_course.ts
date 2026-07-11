import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const db = drizzle(pool);

async function main() {
  const result = await pool.query(`SELECT title, "customContent" FROM courses ORDER BY id DESC LIMIT 2`);
  for (const row of result.rows) {
    console.log("Title:", row.title);
    if (!row.customContent) {
      console.log("No customContent");
      continue;
    }
    const content = JSON.parse(row.customContent);
    console.log("Lessons count:", content.lessons?.length);
    console.log("Quiz length:", content.quiz?.length);
    console.log("Quiz types:", content.quiz?.map((q: any) => q.type));
  }
  process.exit(0);
}
main();
