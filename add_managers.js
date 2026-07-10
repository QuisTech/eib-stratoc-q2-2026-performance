require('dotenv').config({ path: '.env.production' });
const { Pool } = require('pg');
const fs = require('fs');

async function fix() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const q = `
      INSERT INTO "user" (id, name, email, role, subsidiary, "emailVerified", "mustChangePassword", "createdAt", "updatedAt")
      VALUES 
      ($1, $2, $3, $4, $5, false, true, NOW(), NOW()),
      ($6, $7, $8, $9, $10, false, true, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, subsidiary = EXCLUDED.subsidiary;
    `;
    const res = await pool.query(q, [
      'user_babatunde_' + Date.now(), 'Babatunde Babalola', 'babatunde.babalola@eibgroup.com', 'group_head', 'EIB Group',
      'user_uche_' + Date.now(), 'Uche Duruji', 'uche.duruji@eibgroup.com', 'group_head', 'EIB Group'
    ]);
    console.log(res.rowCount + ' row(s) updated/inserted in DB');
    
    // Append to CSV
    const csvLine1 = '\nBabalola,Babatunde,,Group Head,babatunde.babalola@eibgroup.com,Changepwd,EIB Group,group_head';
    const csvLine2 = '\nDuruji,Uche,,Group Head,uche.duruji@eibgroup.com,Changepwd,EIB Group,group_head';
    fs.appendFileSync('master_staff_emails_complete.csv', csvLine1 + csvLine2);
    console.log('Appended to CSV');

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
fix();
