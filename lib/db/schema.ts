import { pgTable, text, timestamp, boolean, serial, integer } from "drizzle-orm/pg-core"

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  // LMS additional fields (configured in lib/auth.ts additionalFields).
  role: text("role").notNull().default("learner"), // learner | lead | admin
  subsidiary: text("subsidiary"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// --- LMS app tables --------------------------------------------------------
// `courses` is shared catalog content (admin-curated), so it is not user-scoped.
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // maps to a skill-gap category
  level: text("level").notNull().default("Intermediate"), // Beginner | Intermediate | Advanced
  format: text("format").notNull().default("Workshop"), // Workshop | Online | Blended
  durationHours: integer("durationHours").notNull().default(8),
  subsidiaries: text("subsidiaries"), // comma-separated subsidiary tags
  initiative: integer("initiative"), // links to one of the 9 strategic initiatives
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// `enrollments` are per-user. Every read/write is scoped by userId — no FK by design.
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  courseId: integer("courseId").notNull(),
  status: text("status").notNull().default("enrolled"), // enrolled | in_progress | completed
  progress: integer("progress").notNull().default(0), // 0-100
  enrolledAt: timestamp("enrolledAt").notNull().defaultNow(),
  completedAt: timestamp("completedAt"),
})

export type Course = typeof courses.$inferSelect
export type Enrollment = typeof enrollments.$inferSelect
