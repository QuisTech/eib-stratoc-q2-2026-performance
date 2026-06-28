import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

const handler = toNextJsHandler(auth.handler)

let tablesEnsured = false

async function ensureTables() {
  if (tablesEnsured) return
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        "emailVerified" BOOLEAN NOT NULL DEFAULT false,
        image TEXT,
        role TEXT DEFAULT 'learner',
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
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
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
    tablesEnsured = true
    console.log("AUTH TABLES: ensured successfully")
  } catch (err) {
    console.error("AUTH TABLES: failed to ensure", err)
  }
}

export async function POST(req: NextRequest) {
  await ensureTables()
  try {
    const res = await handler.POST(req)
    if (res.status === 500) {
      const text = await res.clone().text()
      console.error("BETTER AUTH 500 ERROR (POST):", text)
    }
    return res
  } catch (err) {
    console.error("FATAL API ERROR (POST):", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  await ensureTables()
  try {
    const res = await handler.GET(req)
    if (res.status === 500) {
      const text = await res.clone().text()
      console.error("BETTER AUTH 500 ERROR (GET):", text)
    }
    return res
  } catch (err) {
    console.error("FATAL API ERROR (GET):", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
