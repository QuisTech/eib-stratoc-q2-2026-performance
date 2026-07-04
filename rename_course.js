const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL });

pool.query("UPDATE courses SET title = 'Directorate of Intelligence and Clandestine Operations: Training Gap Analysis' WHERE slug = 'clandestine-training-gap-analysis'").then(() => {
  console.log("Renamed successfully.");
  process.exit(0);
});
