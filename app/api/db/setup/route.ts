import { pool } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        "emailVerified" BOOLEAN NOT NULL DEFAULT false,
        image TEXT,
        role TEXT NOT NULL DEFAULT 'learner',
        subsidiary TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS "session" (
        id TEXT PRIMARY KEY,
        "expiresAt" TIMESTAMP NOT NULL,
        token TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "ipAddress" TEXT,
        "userAgent" TEXT,
        "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS "account" (
        id TEXT PRIMARY KEY,
        "accountId" TEXT NOT NULL,
        "providerId" TEXT NOT NULL,
        "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "accessToken" TEXT,
        "refreshToken" TEXT,
        "idToken" TEXT,
        "accessTokenExpiresAt" TIMESTAMP,
        "refreshTokenExpiresAt" TIMESTAMP,
        scope TEXT,
        password TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS "verification" (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expiresAt TIMESTAMP NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "courses" (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        level TEXT NOT NULL DEFAULT 'Intermediate',
        format TEXT NOT NULL DEFAULT 'Workshop',
        "durationHours" INTEGER NOT NULL DEFAULT 8,
        "priceNaira" INTEGER NOT NULL DEFAULT 0,
        subsidiaries TEXT,
        initiative INTEGER,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "enrollments" (
        id SERIAL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "courseId" INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'enrolled',
        progress INTEGER NOT NULL DEFAULT 0,
        "enrolledAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "completedAt" TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "lesson_progress" (
        id SERIAL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "courseId" INTEGER NOT NULL,
        "lessonKey" TEXT NOT NULL,
        "completedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "quiz_attempts" (
        id SERIAL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "courseId" INTEGER NOT NULL,
        score INTEGER NOT NULL,
        total INTEGER NOT NULL,
        passed BOOLEAN NOT NULL DEFAULT false,
        answers TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "certificates" (
        id SERIAL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "courseId" INTEGER NOT NULL,
        serial TEXT NOT NULL UNIQUE,
        "issuedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    // Seed courses if empty
    const { rowCount } = await pool.query('SELECT count(*) FROM "courses"');
    if (rowCount === 0 || (await pool.query('SELECT count(*) FROM "courses"')).rows[0].count === '0') {
      const { skillGapAnalysis } = await import("@/lib/plan-data")
      for (const [i, gap] of skillGapAnalysis.entries()) {
        await pool.query(
          `INSERT INTO "courses" (slug, title, description, category, "priceNaira", subsidiaries) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            `course-${i + 1}-${gap.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            `${gap.category} Fundamentals`,
            `Learn essential skills covering ${gap.gaps} to address performance bottlenecks.`,
            gap.category,
            (i + 1) * 25000,
            gap.subsidiaries.join(", ")
          ]
        )
      }
    }

    return NextResponse.json({ success: true, message: "Database tables created and seeded successfully!" })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
