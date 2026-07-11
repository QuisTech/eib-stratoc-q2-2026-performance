import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "../lib/db/schema"
import { eq, and } from "drizzle-orm"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../.env") })
dotenv.config({ path: path.resolve(__dirname, "../.env.local") })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool, { schema })

const dataToRestore = [
  { email: "marquis.abimbola@dico.eibstratoc.com", course: "EVP: Standard Operating Procedures & Reporting", status: "in_progress", progress: 67 },
  { email: "iheanyichukwu.okpo@gigaforensics.com", course: "EVP: Standard Operating Procedures & Reporting", status: "in_progress", progress: 67 },
  { email: "iheanyichukwu.okpo@gigaforensics.com", course: "EIB Group Global Orientation", status: "in_progress", progress: 17 },
]

async function run() {
  console.log("Restoring progress...")
  
  for (const item of dataToRestore) {
    // 1. Find user
    const users = await db.select().from(schema.user).where(eq(schema.user.email, item.email))
    if (users.length === 0) {
      console.log(`User not found: ${item.email}`)
      continue
    }
    const userId = users[0].id

    // 2. Find course
    const courses = await db.select().from(schema.courses).where(eq(schema.courses.title, item.course))
    if (courses.length === 0) {
      console.log(`Course not found: ${item.course}`)
      continue
    }
    const courseId = courses[0].id

    // 3. Update enrollment
    await db.update(schema.enrollments)
      .set({ status: item.status, progress: item.progress })
      .where(and(eq(schema.enrollments.userId, userId), eq(schema.enrollments.courseId, courseId)))
      
    console.log(`Restored ${item.email} - ${item.course} -> ${item.progress}%`)
  }
  
  console.log("Done.")
  await pool.end()
}

run().catch(console.error)
