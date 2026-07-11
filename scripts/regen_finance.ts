import { generateCourseContentWithGemini } from '../app/actions/gemini';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const db = drizzle(pool);

async function main() {
  console.log("Generating course...");
  const res = await generateCourseContentWithGemini("Financial Management & Budgeting", "Finance");
  if (res.error) {
    console.error(res.error);
    process.exit(1);
  }
  
  console.log("Got course content! Updating DB...");
  await pool.query(`UPDATE courses SET "customContent" = $1 WHERE title = 'Financial Management & Budgeting'`, [JSON.stringify(res)]);
  console.log("Successfully restored AI version!");
  process.exit(0);
}
main();
