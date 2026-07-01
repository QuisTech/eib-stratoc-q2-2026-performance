const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

async function main() {
  const accounts = [
    { name: "Test Group Head", email: "grouphead@eibgroup.com", password: "Password123!", role: "group_head", subsidiary: "EIB Group" },
    { name: "Test Manager", email: "manager@eibgroup.com", password: "Password123!", role: "lead", subsidiary: "Briech UAS" },
    { name: "Test Learner", email: "learner@eibgroup.com", password: "Password123!", role: "learner", subsidiary: "Briech UAS" },
  ];

  for (const acc of accounts) {
    console.log(`Creating ${acc.email}...`);
    try {
      const res = await fetch("https://lms-eibgroup.vercel.app/api/auth/sign-up/email", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Origin": "https://lms-eibgroup.vercel.app"
        },
        body: JSON.stringify({
          email: acc.email,
          password: acc.password,
          name: acc.name
        })
      });
      
      const data = await res.json();
      console.log(`Signup response:`, data);
      
      // Update role via DB
      await pool.query('UPDATE "user" SET role = $1, subsidiary = $2 WHERE email = $3', [acc.role, acc.subsidiary, acc.email]);
      console.log(`Elevated ${acc.email} to ${acc.role}`);
    } catch (e) {
      console.error(`Error with ${acc.email}:`, e);
    }
  }
  
  process.exit(0);
}

main();
