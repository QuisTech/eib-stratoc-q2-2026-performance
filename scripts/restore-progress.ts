import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "../lib/db/schema"
import { eq, and } from "drizzle-orm"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool, { schema })

async function run() {
  console.log("Finding corrupted enrollments on local DB...")
  const enrollments = await db.select().from(schema.enrollments).where(eq(schema.enrollments.progress, 0))
  
  let fixedCount = 0;
  for (const e of enrollments) {
    const lessonProgs = await db.select().from(schema.lessonProgress)
      .where(and(eq(schema.lessonProgress.userId, e.userId), eq(schema.lessonProgress.courseId, e.courseId)))
    
    if (lessonProgs.length > 0) {
      // They have lessons, but progress is 0. This means it was clobbered by the course builder customization bug!
      let newProgress = Math.min(Math.round((lessonProgs.length / 5) * 100), 99)
      
      await db.update(schema.enrollments)
        .set({ progress: newProgress, status: "in_progress" })
        .where(and(eq(schema.enrollments.userId, e.userId), eq(schema.enrollments.courseId, e.courseId)))
        
      console.log(`Fixed UserId: ${e.userId}, CourseId: ${e.courseId}, OldLessons: ${lessonProgs.length}, NewProgress: ${newProgress}%`)
      fixedCount++
    }
  }
  
  console.log(`Fixed ${fixedCount} corrupted enrollments.`)
  await pool.end()
}

run().catch(console.error)
