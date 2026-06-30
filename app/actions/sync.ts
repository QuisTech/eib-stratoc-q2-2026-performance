"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db, pool } from "@/lib/db"
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "@/lib/db/schema"
import { sql } from "drizzle-orm"

// Simple robust sync function
async function syncTable(
  sourceDb: any,
  targetDb: any,
  tableObj: any,
  tableName: string,
  conflictTarget: string
) {
  const records = await sourceDb.select().from(tableObj)
  if (records.length === 0) return 0
  
  // Drizzle doesn't have a simple batch upsert for dynamic objects without knowing the schema perfectly.
  // We will do a generic raw SQL upsert since we know the records.
  let synced = 0
  for (const record of records) {
    try {
      const keys = Object.keys(record).filter(k => record[k] !== undefined)
      const values = keys.map(k => record[k])
      
      const insertCols = keys.map(k => `"${k}"`).join(", ")
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ")
      const setCols = keys.filter(k => k !== conflictTarget).map(k => `"${k}" = EXCLUDED."${k}"`).join(", ")
      
      let query = `INSERT INTO "${tableName}" (${insertCols}) VALUES (${placeholders})`
      if (setCols.length > 0) {
        query += ` ON CONFLICT ("${conflictTarget}") DO UPDATE SET ${setCols}`
      } else {
        query += ` ON CONFLICT ("${conflictTarget}") DO NOTHING`
      }
      
      // we must use the raw target pool to execute this securely
      // TargetDb is either the local 'pool' or the 'cloudPool'
      // We will expose a helper to run raw queries
      await targetDb.execute(sql.raw(
        query.replace(/\$(\d+)/g, (match, idx) => {
          let val = values[parseInt(idx) - 1]
          if (val === null) return "NULL"
          if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`
          if (val instanceof Date) return `'${val.toISOString()}'`
          if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`
          return val
        })
      ))
      synced++
    } catch (e) {
      console.error(`Failed to sync record in ${tableName}:`, e)
    }
  }
  return synced
}

export async function pushToCloud(isCron = false) {
  if (!isCron) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session?.user?.role !== "admin") throw new Error("Unauthorized")
  }

  if (!process.env.CLOUD_DATABASE_URL) throw new Error("CLOUD_DATABASE_URL not set")
  const cloudPool = new Pool({ connectionString: process.env.CLOUD_DATABASE_URL })
  const cloudDb = drizzle(cloudPool, { schema })

  try {
    const logs = []
    
    // Sync order matters for foreign keys!
    // 1. User
    let c = await syncTable(db, cloudDb, schema.user, "user", "id")
    logs.push(`Pushed ${c} users`)
    
    // 2. Account, Session
    c = await syncTable(db, cloudDb, schema.account, "account", "id")
    logs.push(`Pushed ${c} accounts`)
    
    c = await syncTable(db, cloudDb, schema.session, "session", "id")
    logs.push(`Pushed ${c} sessions`)
    
    // 3. Courses
    c = await syncTable(db, cloudDb, schema.courses, "courses", "id")
    logs.push(`Pushed ${c} courses`)
    
    // 4. Enrollments
    c = await syncTable(db, cloudDb, schema.enrollments, "enrollments", "id")
    logs.push(`Pushed ${c} enrollments`)
    
    // 5. Lesson Progress, Quiz Attempts, Certificates
    c = await syncTable(db, cloudDb, schema.lessonProgress, "lesson_progress", "id")
    logs.push(`Pushed ${c} lesson progress`)
    
    c = await syncTable(db, cloudDb, schema.quizAttempts, "quiz_attempts", "id")
    logs.push(`Pushed ${c} quiz attempts`)
    
    c = await syncTable(db, cloudDb, schema.certificates, "certificates", "id")
    logs.push(`Pushed ${c} certificates`)

    return { success: true, logs }
  } finally {
    await cloudPool.end()
  }
}

export async function pullFromCloud(isCron = false) {
  if (!isCron) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session?.user?.role !== "admin") throw new Error("Unauthorized")
  }

  if (!process.env.CLOUD_DATABASE_URL) throw new Error("CLOUD_DATABASE_URL not set")
  const cloudPool = new Pool({ connectionString: process.env.CLOUD_DATABASE_URL })
  const cloudDb = drizzle(cloudPool, { schema })

  try {
    const logs = []
    
    let c = await syncTable(cloudDb, db, schema.user, "user", "id")
    logs.push(`Pulled ${c} users`)
    
    c = await syncTable(cloudDb, db, schema.account, "account", "id")
    logs.push(`Pulled ${c} accounts`)
    
    c = await syncTable(cloudDb, db, schema.session, "session", "id")
    logs.push(`Pulled ${c} sessions`)
    
    c = await syncTable(cloudDb, db, schema.courses, "courses", "id")
    logs.push(`Pulled ${c} courses`)
    
    c = await syncTable(cloudDb, db, schema.enrollments, "enrollments", "id")
    logs.push(`Pulled ${c} enrollments`)
    
    c = await syncTable(cloudDb, db, schema.lessonProgress, "lesson_progress", "id")
    logs.push(`Pulled ${c} lesson progress`)
    
    c = await syncTable(cloudDb, db, schema.quizAttempts, "quiz_attempts", "id")
    logs.push(`Pulled ${c} quiz attempts`)
    
    c = await syncTable(cloudDb, db, schema.certificates, "certificates", "id")
    logs.push(`Pulled ${c} certificates`)

    return { success: true, logs }
  } finally {
    await cloudPool.end()
  }
}
