const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL });

pool.query("DELETE FROM courses WHERE slug = 'clandestine-training-gap-analysis'").then(() => {
  console.log("Deleted old course successfully.");
  process.exit(0);
});
