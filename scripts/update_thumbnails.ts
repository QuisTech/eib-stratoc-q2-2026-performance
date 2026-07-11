import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const db = drizzle(pool);

async function main() {
  await pool.query(`UPDATE courses SET "imageUrl" = '/thumbnails/it-support.png' WHERE title = 'IT Support Professional'`);
  await pool.query(`UPDATE courses SET "imageUrl" = '/thumbnails/auto-engineering.png' WHERE title = 'Automotive Engineering, Fleet Management, and Mobility Solutions: A Practical Project-Based Training Program'`);
  console.log("Updated thumbnails!");
  process.exit(0);
}
main();
