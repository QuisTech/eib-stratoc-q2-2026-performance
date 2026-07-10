const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function checkUser() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const r = await p.query("SELECT * FROM \"user\" WHERE email='iheanyichukwu.okpo@gigaforensics.com'");
    if (r.rows.length > 0) {
      console.log(r.rows[0]);
    } else {
      console.log("User not found");
    }
  } finally {
    p.end();
  }
}
checkUser();
