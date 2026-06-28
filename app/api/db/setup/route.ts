import { pool } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reset = searchParams.get("reset")

    if (reset === "true") {
      await pool.query(`
        DROP TABLE IF EXISTS "certificates" CASCADE;
        DROP TABLE IF EXISTS "quiz_attempts" CASCADE;
        DROP TABLE IF EXISTS "lesson_progress" CASCADE;
        DROP TABLE IF EXISTS "enrollments" CASCADE;
        DROP TABLE IF EXISTS "courses" CASCADE;
      `)
    }

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
      const coursesToSeed = [
        { title: "Customer Care & Service Advisor Excellence", category: "Customer-Facing", level: "Beginner", format: "Workshop", durationHours: 8, priceNaira: 80000, subsidiaries: "Luftreiber Automobile", description: "Front-desk operations, service-advisor communication, and customer-care standards." },
        { title: "Digital Audience Engagement", category: "Digital Media", level: "Beginner", format: "Online", durationHours: 8, priceNaira: 70000, subsidiaries: "Bright FM", description: "Grow and engage online audiences with digital content and platform strategy." },
        { title: "Drone Operations & Live-Feed Management", category: "Emerging Tech", level: "Advanced", format: "Workshop", durationHours: 16, priceNaira: 320000, subsidiaries: "EIB Stratoc, Luftreiber Automobile", description: "Safe drone operation and real-time live-feed capture, routing, and management." },
        { title: "Financial Management & Budgeting", category: "Financial", level: "Intermediate", format: "Online", durationHours: 10, priceNaira: 135000, subsidiaries: "BEF", description: "Financial management, budget development, and budget control for program owners." },
        { title: "Leadership & Team Management", category: "Leadership", level: "Intermediate", format: "Blended", durationHours: 12, priceNaira: 175000, subsidiaries: "BEF", description: "Core leadership, delegation, and team-management skills for emerging supervisors." },
        { title: "Monitoring, Evaluation & Data Analysis", category: "M&E / Data", level: "Intermediate", format: "Online", durationHours: 12, priceNaira: 150000, subsidiaries: "BEF", description: "M&E frameworks, data collection, analysis, and impact measurement." },
        { title: "Radio Marketing, Sales & Sponsorship", category: "Marketing & Sales", level: "Intermediate", format: "Blended", durationHours: 10, priceNaira: 125000, subsidiaries: "Bright FM", description: "Radio marketing, ad sales, and sponsorship development to grow station revenue." },
        { title: "Radio Presentation & Storytelling", category: "Media & Content", level: "Beginner", format: "Workshop", durationHours: 10, priceNaira: 90000, subsidiaries: "Bright FM", description: "On-air presentation, storytelling, and content development for broadcast teams." },
        { title: "QA Inspection Protocols", category: "Operational", level: "Intermediate", format: "Workshop", durationHours: 10, priceNaira: 140000, subsidiaries: "Briech UAS", description: "Quality-assurance inspection routines, checklists, and defect prevention for production lines." },
        { title: "Time Management & Workload Prioritization", category: "Operational", level: "Beginner", format: "Workshop", durationHours: 6, priceNaira: 65000, subsidiaries: "EIB Stratoc, Briech UAS", description: "Practical prioritization, planning, and focus techniques to reduce supervisory burnout and delays." },
        { title: "Project Planning & Risk Management", category: "Project Management", level: "Intermediate", format: "Blended", durationHours: 16, priceNaira: 210000, subsidiaries: "BEF", description: "Project planning, implementation, risk management, and progress reporting for delivery teams." },
        { title: "Intelligence Report Writing & MS Word Essentials", category: "Reporting & Documentation", level: "Beginner", format: "Online", durationHours: 8, priceNaira: 75000, subsidiaries: "EIB Stratoc, Briech UAS", description: "Structured report writing, formatting, and documentation discipline using MS Word for analysts and technical staff." },
        { title: "MRO Record-Keeping & Technical Documentation", category: "Reporting & Documentation", level: "Intermediate", format: "Blended", durationHours: 8, priceNaira: 110000, subsidiaries: "Briech UAS", description: "Maintenance, repair, and overhaul documentation standards and traceable record-keeping." },
        { title: "HSE Awareness & Operational Risk Assessment", category: "Safety & Compliance", level: "Beginner", format: "Blended", durationHours: 8, priceNaira: 95000, subsidiaries: "Luftreiber Automobile", description: "Health, safety, and environment fundamentals plus structured operational risk assessment." },
        { title: "AV & Transmission Equipment Operations", category: "Technical", level: "Intermediate", format: "Blended", durationHours: 12, priceNaira: 165000, subsidiaries: "EIB Stratoc", description: "Operate and maintain audio-visual and transmission equipment to broadcast and intelligence standards." },
        { title: "UAV Assembly, Calibration & Avionics", category: "Technical", level: "Advanced", format: "Workshop", durationHours: 24, priceNaira: 450000, subsidiaries: "Briech UAS", description: "End-to-end drone build, sensor calibration, and avionics troubleshooting for production and field teams." },
        { title: "Vehicle Diagnostics & EV (NEV) Fundamentals", category: "Technical", level: "Intermediate", format: "Workshop", durationHours: 16, priceNaira: 185000, subsidiaries: "Luftreiber Automobile", description: "Hands-on diagnostics for modern combustion and new-energy vehicles, covering fault tracing, electronic systems, and EV safety." }
      ];

      for (const course of coursesToSeed) {
        const slug = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        await pool.query(
          `INSERT INTO "courses" (slug, title, description, category, level, format, "durationHours", "priceNaira", subsidiaries) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            slug,
            course.title,
            course.description,
            course.category,
            course.level,
            course.format,
            course.durationHours,
            course.priceNaira,
            course.subsidiaries
          ]
        )
      }
    }

    return NextResponse.json({ success: true, message: "Database tables created and seeded successfully!" })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
