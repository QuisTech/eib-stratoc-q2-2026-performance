const { Client } = require('pg');
require('dotenv').config({path: '.env.local'});
const client = new Client({ connectionString: process.env.POSTGRES_URL });
client.connect().then(() => {
  return client.query("SELECT custom_content FROM lms_courses WHERE slug = 'business-development-strategic-plan-staff-training'");
}).then(res => {
  console.log(JSON.stringify(JSON.parse(res.rows[0].custom_content), null, 2));
  client.end();
}).catch(console.error);
