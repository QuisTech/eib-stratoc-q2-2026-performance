const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL });

const run = async () => {
  await pool.query("UPDATE courses SET subsidiaries = 'Global' WHERE slug = 'evp-group-hr-sops'");
  const res = await pool.query("SELECT slug, title, subsidiaries FROM courses WHERE slug = 'evp-group-hr-sops'");
  console.table(res.rows);
  process.exit(0);
};
run();
