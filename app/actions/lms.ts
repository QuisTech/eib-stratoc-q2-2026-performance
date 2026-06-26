"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { courses, enrollments, type Course, type Enrollment } from "@/lib/db/schema"
import { and, asc, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
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

/** Set progress (0-100); marks status + completedAt automatically. */
export async function setCourseProgress(courseId: number, progress: number) {
  const userId = await getUserId()
  const clamped = Math.max(0, Math.min(100, Math.round(progress)))
  const status = clamped >= 100 ? "completed" : clamped > 0 ? "in_progress" : "enrolled"

  await db
    .update(enrollments)
    .set({
      progress: clamped,
      status,
      completedAt: clamped >= 100 ? new Date() : null,
    })
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))

  revalidatePath("/lms")
  revalidatePath("/lms/[slug]", "page")
}
