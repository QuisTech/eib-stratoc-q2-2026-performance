const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL });

pool.query("SELECT slug, title, subsidiaries FROM courses WHERE title ILIKE '%EVP%' OR slug ILIKE '%evp%'").then(res => {
  console.table(res.rows);
  process.exit(0);
});
