const { Pool } = require("pg");
const crypto = require("crypto");

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FIB5gDZVS0no@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
});

async function main() {
  try {
    const email = "grace.nnaji@eibstratoc.com";
    const name = "Grace Nnaji";
    const subsidiary = "EIB Stratoc";
    const role = "learner";

    // Grab default hash from a known user (like a test user)
    const hashRes = await pool.query('SELECT account.password FROM account JOIN "user" ON account."userId" = "user".id WHERE "user".email = $1 LIMIT 1', ['test.user@eibstratoc.com']);
    if (hashRes.rows.length === 0) {
      console.log("Could not find default hash.");
      return;
    }
    const hash = hashRes.rows[0].password;

    // Check if she exists
    const existing = await pool.query('SELECT id FROM "user" WHERE email = $1', [email]);
    let userId;
    if (existing.rows.length === 0) {
      userId = crypto.randomBytes(16).toString("hex");
      await pool.query(
        'INSERT INTO "user" (id, name, email, "emailVerified", image, role, subsidiary, "createdAt", "updatedAt") VALUES ($1, $2, $3, false, NULL, $4, $5, NOW(), NOW())',
        [userId, name, email, role, subsidiary]
      );
      console.log(`Inserted user ${name}`);
    } else {
      userId = existing.rows[0].id;
      console.log(`User ${name} already exists with ID ${userId}`);
    }

    // Insert account
    const accountId = crypto.randomBytes(16).toString("hex");
    await pool.query('DELETE FROM account WHERE "userId" = $1', [userId]);
    await pool.query(
      'INSERT INTO account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
      [accountId, email, 'credential', userId, hash]
    );

    console.log(`Inserted account for ${email}. She can now log in with the standard default password.`);

  } catch(e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

main();
