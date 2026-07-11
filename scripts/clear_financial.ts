import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const db = drizzle(pool);

async function main() {
  await pool.query(`UPDATE courses SET "customContent" = NULL WHERE title = 'Financial Management & Budgeting'`);
  console.log("Cleared customContent for Financial course!");
  process.exit(0);
}
main();
