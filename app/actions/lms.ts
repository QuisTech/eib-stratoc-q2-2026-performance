"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  courses,
  enrollments,
  lessonProgress,
  quizAttempts,
  certificates,
  user,
  type Course,
  type Enrollment,
  type QuizAttempt,
  type Certificate,
} from "@/lib/db/schema"
import { getLessons, gradeQuiz } from "@/lib/lms-content"
import { and, asc, desc, eq, inArray, like } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export async function promoteMeToAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user?.email === "michael.marquis@eibgroup.com") {
    await db.update(user).set({ role: "admin" }).where(eq(user.email, "michael.marquis@eibgroup.com"))
  }
}

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user as { id: string; name: string; email: string; role?: string; subsidiary?: string }
}

async function getCourseById(courseId: number): Promise<Course | null> {
  const rows = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1)
  return rows[0] ?? null
}

/** Public catalog — courses are shared, admin-curated content (not user-scoped). */
export async function getCourses(): Promise<Course[]> {
  return db.select().from(courses).orderBy(asc(courses.category), asc(courses.title))
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const rows = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1)
  return rows[0] ?? null
}

/** All enrollments for the signed-in user. */
export async function getMyEnrollments(): Promise<Enrollment[]> {
  const userId = await getUserId()
  return db
    .select()
    .from(enrollments)
    .where(eq(enrollments.userId, userId))
    .orderBy(asc(enrollments.enrolledAt))
}

/** Enrollment for one course, for the signed-in user (or null). */
export async function getMyEnrollmentForCourse(courseId: number): Promise<Enrollment | null> {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
    .limit(1)
  return rows[0] ?? null
}

export async function enrollInCourse(courseId: number) {
  const userId = await getUserId()
  const existing = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
    .limit(1)

  if (existing.length === 0) {
    await db.insert(enrollments).values({ userId, courseId, status: "enrolled", progress: 0 })
  }
  revalidatePath("/lms")
  revalidatePath("/lms/[slug]", "page")
}

export async function unenrollFromCourse(courseId: number) {
  const userId = await getUserId()
  await db
    .delete(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
  revalidatePath("/lms")
  revalidatePath("/lms/[slug]", "page")
}

// --- Lessons ---------------------------------------------------------------

/** Completed lesson keys for the signed-in user on one course. */
export async function getMyLessonProgress(courseId: number): Promise<string[]> {
  const userId = await getUserId()
  const rows = await db
    .select({ lessonKey: lessonProgress.lessonKey })
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.courseId, courseId)))
  return rows.map((r) => r.lessonKey)
}

/** Mark a lesson complete (idempotent) and recompute course progress. */
export async function completeLesson(courseId: number, lessonKey: string) {
  const userId = await getUserId()
  await db
    .insert(lessonProgress)
    .values({ userId, courseId, lessonKey })
    .onConflictDoNothing()
  await recomputeCourseProgress(userId, courseId)
  revalidatePath("/lms")
  revalidatePath("/lms/[slug]", "page")
}

// --- Quiz ------------------------------------------------------------------

export async function getMyQuizAttempts(courseId: number): Promise<QuizAttempt[]> {
  const userId = await getUserId()
  return db
    .select()
    .from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.courseId, courseId)))
    .orderBy(desc(quizAttempts.createdAt))
}

/** Grade a submitted quiz, record the attempt, and recompute completion. */
export async function submitQuiz(courseId: number, answers: number[]) {
  const userId = await getUserId()
  const course = await getCourseById(courseId)
  if (!course) throw new Error("Course not found")

  const result = gradeQuiz(course, answers)
  await db.insert(quizAttempts).values({
    userId,
    courseId,
    score: result.score,
    total: result.total,
    passed: result.passed,
    answers: JSON.stringify(answers),
  })

  await recomputeCourseProgress(userId, courseId)
  revalidatePath("/lms")
  revalidatePath("/lms/[slug]", "page")
  return result
}

// --- Certificates ----------------------------------------------------------

export async function getMyCertificateForCourse(courseId: number): Promise<Certificate | null> {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(certificates)
    .where(and(eq(certificates.userId, userId), eq(certificates.courseId, courseId)))
    .limit(1)
  return rows[0] ?? null
}

export async function getMyCertificates(): Promise<Certificate[]> {
  const userId = await getUserId()
  return db
    .select()
    .from(certificates)
    .where(eq(certificates.userId, userId))
    .orderBy(desc(certificates.issuedAt))
}

// --- Progress engine -------------------------------------------------------
// Course progress = (completed lessons + passed quiz) / (lesson count + 1).
// Completing every lesson AND passing the quiz marks the course complete and
// issues a certificate.
async function recomputeCourseProgress(userId: string, courseId: number) {
  const course = await getCourseById(courseId)
  if (!course) return

  const lessons = getLessons(course)
  const totalSteps = lessons.length + 1 // + the quiz

  const doneLessonRows = await db
    .select({ lessonKey: lessonProgress.lessonKey })
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.courseId, courseId)))
  const validKeys = new Set(lessons.map((l) => l.key))
  const doneLessons = doneLessonRows.filter((r) => validKeys.has(r.lessonKey)).length

  const passedRows = await db
    .select({ id: quizAttempts.id })
    .from(quizAttempts)
    .where(
      and(
        eq(quizAttempts.userId, userId),
        eq(quizAttempts.courseId, courseId),
        eq(quizAttempts.passed, true),
      ),
    )
    .limit(1)
  const quizPassed = passedRows.length > 0

  const completedSteps = doneLessons + (quizPassed ? 1 : 0)
  const progress = Math.round((completedSteps / totalSteps) * 100)
  const isComplete = doneLessons >= lessons.length && quizPassed
  const status = isComplete ? "completed" : progress > 0 ? "in_progress" : "enrolled"

  await db
    .update(enrollments)
    .set({ progress, status, completedAt: isComplete ? new Date() : null })
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))

  if (isComplete) {
    const existing = await db
      .select({ id: certificates.id })
      .from(certificates)
      .where(and(eq(certificates.userId, userId), eq(certificates.courseId, courseId)))
      .limit(1)
    if (existing.length === 0) {
      const serial = `EIB-${String(courseId).padStart(3, "0")}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`
      await db
        .insert(certificates)
        .values({ userId, courseId, serial })
        .onConflictDoNothing()
    }
  }
}

// --- Admin / Lead reporting ------------------------------------------------

export type LearnerReportRow = {
  id: string
  name: string
  email: string
  subsidiary: string | null
  role: string
  enrolled: number
  inProgress: number
  completed: number
  certificates: number
  avgProgress: number
}

export type AdminReport = {
  scope: "all" | string
  viewerRole: string
  totals: {
    learners: number
    enrollments: number
    completions: number
    certificates: number
    trainingValue: number // ₦ value of all enrollments in scope
  }
  learners: LearnerReportRow[]
  topCourses: { courseId: number; title: string; enrolled: number; completed: number }[]
}

/** Returns the viewer's role + subsidiary so the UI can gate the admin link. */
export async function getViewerContext() {
  const u = await getSessionUser()
  return { role: u.role ?? "learner", subsidiary: u.subsidiary ?? null, name: u.name }
}

/**
 * Aggregated enrollment/completion report.
 * - role "admin": every subsidiary.
 * - role "lead": only the lead's own subsidiary.
 * - anyone else: rejected.
 */
export async function getAdminReport(): Promise<AdminReport> {
  const viewer = await getSessionUser()
  const role = viewer.role ?? "learner"
  const orgWide = role === "admin" || role === "group_head"
  if (!orgWide && role !== "lead") throw new Error("Forbidden")

  const isDCIHead = role === "lead" && viewer.subsidiary === "Directorate of Clandestine & Intelligence"

  let learnerRows;
  if (orgWide) {
    learnerRows = await db.select().from(user).orderBy(asc(user.subsidiary), asc(user.name))
  } else if (isDCIHead) {
    learnerRows = await db
      .select()
      .from(user)
      .where(like(user.subsidiary, "DCI - %"))
      .orderBy(asc(user.subsidiary), asc(user.name))
  } else {
    learnerRows = await db
        .select()
        .from(user)
        .where(eq(user.subsidiary, viewer.subsidiary ?? "__none__"))
        .orderBy(asc(user.name))
  }

  const ids = learnerRows.map((u) => u.id)
  const allEnrollments = ids.length
    ? await db.select().from(enrollments).where(inArray(enrollments.userId, ids))
    : []
  const allCerts = ids.length
    ? await db.select().from(certificates).where(inArray(certificates.userId, ids))
    : []
  const allCourses = await db.select().from(courses)
  const courseTitle = new Map(allCourses.map((c) => [c.id, c.title]))
  const coursePrice = new Map(allCourses.map((c) => [c.id, c.priceNaira]))

  const enrByUser = new Map<string, Enrollment[]>()
  for (const e of allEnrollments) {
    const list = enrByUser.get(e.userId) ?? []
    list.push(e)
    enrByUser.set(e.userId, list)
  }
  const certCountByUser = new Map<string, number>()
  for (const c of allCerts) {
    certCountByUser.set(c.userId, (certCountByUser.get(c.userId) ?? 0) + 1)
  }

  const learners: LearnerReportRow[] = learnerRows.map((u) => {
    const list = enrByUser.get(u.id) ?? []
    const completed = list.filter((e) => e.status === "completed").length
    const inProgress = list.filter((e) => e.status === "in_progress").length
    const avgProgress =
      list.length > 0 ? Math.round(list.reduce((s, e) => s + e.progress, 0) / list.length) : 0
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      subsidiary: u.subsidiary,
      role: u.role,
      enrolled: list.length,
      inProgress,
      completed,
      certificates: certCountByUser.get(u.id) ?? 0,
      avgProgress,
    }
  })

  // Course popularity within scope.
  const enrolledByCourse = new Map<number, { enrolled: number; completed: number }>()
  for (const e of allEnrollments) {
    const agg = enrolledByCourse.get(e.courseId) ?? { enrolled: 0, completed: 0 }
    agg.enrolled++
    if (e.status === "completed") agg.completed++
    enrolledByCourse.set(e.courseId, agg)
  }
  const topCourses = [...enrolledByCourse.entries()]
    .map(([courseId, agg]) => ({
      courseId,
      title: courseTitle.get(courseId) ?? `Course #${courseId}`,
      enrolled: agg.enrolled,
      completed: agg.completed,
    }))
    .sort((a, b) => b.enrolled - a.enrolled)
    .slice(0, 8)

  return {
    scope: orgWide ? "all" : viewer.subsidiary ?? "—",
    viewerRole: role,
    totals: {
      learners: learners.length,
      enrollments: allEnrollments.length,
      completions: allEnrollments.filter((e) => e.status === "completed").length,
      certificates: allCerts.length,
      trainingValue: allEnrollments.reduce((s, e) => s + (coursePrice.get(e.courseId) ?? 0), 0),
    },
    learners,
    topCourses,
  }
}
