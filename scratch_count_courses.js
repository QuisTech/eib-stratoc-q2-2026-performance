const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const res = await pool.query('SELECT subsidiaries, "customContent" FROM courses');
    let briefings = 0;
    let lms = 0;
    res.rows.forEach(c => {
      const subs = c.subsidiaries ? c.subsidiaries.toLowerCase() : '';
      if (c.customContent && !subs.includes('global')) {
        briefings++;
      } else {
        lms++;
      }
    });
    console.log('Total Courses:', res.rows.length);
    console.log('Strategic Briefings:', briefings);
    console.log('LMS Training Courses:', lms);
  } catch(e) {
    console.error(e)
  } finally {
    pool.end();
  }
}
run();
