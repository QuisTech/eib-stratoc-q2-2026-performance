const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  });

  try {
    const res = await pool.query(
      `UPDATE courses SET subsidiaries = 'Global' WHERE slug = 'eib-group-global-orientation' RETURNING slug, title, subsidiaries`
    );
    console.log("Updated:", res.rows);
  } finally {
    await pool.end();
  }
}
main();
