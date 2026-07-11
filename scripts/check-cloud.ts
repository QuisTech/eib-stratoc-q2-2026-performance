import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "../lib/db/schema"
import { eq } from "drizzle-orm"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../.env") })
dotenv.config({ path: path.resolve(__dirname, "../.env.local") })

const pool = new Pool({ connectionString: process.env.CLOUD_DATABASE_URL || process.env.DATABASE_URL })
const db = drizzle(pool, { schema })

async function run() {
  const courses = await db.select().from(schema.courses).where(eq(schema.courses.id, 18))
  if (courses.length > 0) {
    const course = courses[0]
    console.log(`Course: ${course.title}`)
    if (course.customContent) {
      console.log(`Custom Content Length: ${course.customContent.length}`)
      const parsed = JSON.parse(course.customContent)
      console.log(`Custom Lessons:`, parsed.lessons?.map((l: any) => l.key))
    } else {
      console.log(`No Custom Content.`)
    }
  }
  await pool.end()
}

run().catch(console.error)
