const { db } = require('./lib/db/db');
const { user } = require('./lib/db/schema');
const { ne, asc } = require('drizzle-orm');

async function test() {
  try {
    const rows = await db.select().from(user).where(ne(user.subsidiary, "BLACK")).orderBy(asc(user.name));
    console.log(`Found ${rows.length} rows`);
  } catch (e) {
    console.error("ERROR:", e);
  }
}
test();
