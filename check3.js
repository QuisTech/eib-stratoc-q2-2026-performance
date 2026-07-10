const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT id, slug, title FROM courses WHERE id > 21 ORDER BY id').then(res => {
  console.table(res.rows);
  process.exit(0);
});
