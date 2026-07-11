import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { enrollments, lessonProgress } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

/**
 * One-shot API to find enrollments stuck at 0% that actually have
 * lesson_progress rows (caused by course-builder lesson-key mismatch)
 * and restore their progress.
 *
 * GET /api/fix-progress?secret=eib-fix-2026
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get("secret") !== "eib-fix-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const zeroEnrollments = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.progress, 0))

  const fixes: string[] = []

  for (const e of zeroEnrollments) {
    // Skip already-completed courses that happen to be at 0 (shouldn't exist, but just in case)
    if (e.status === "completed") continue

    const lessons = await db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, e.userId),
          eq(lessonProgress.courseId, e.courseId)
        )
      )

    if (lessons.length > 0) {
      // This user actually completed lessons but progress was reset to 0
      // because the lesson keys changed when the course was customized.
      // Restore a proportional progress (cap at 99 so it doesn't falsely mark complete).
      const newProgress = Math.min(Math.round((lessons.length / 5) * 100), 99)

      await db
        .update(enrollments)
        .set({ progress: newProgress, status: "in_progress" })
        .where(
          and(
            eq(enrollments.userId, e.userId),
            eq(enrollments.courseId, e.courseId)
          )
        )

      fixes.push(
        `Fixed userId=${e.userId} courseId=${e.courseId}: ${lessons.length} old lessons → ${newProgress}%`
      )
    }
  }

  return NextResponse.json({
    success: true,
    fixed: fixes.length,
    details: fixes,
  })
}
