"use server"

import { cookies } from "next/headers"
import { adminDb } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"
import {
  getEnrollmentsByUser,
  getQuizAttemptsByUser,
  getLessonProgressByUser,
  getCertificatesByUser,
  getUserById,
  getAllUsers,
  getAllEnrollments,
  getAllCertificates,
  invalidateUserCourseCaches,
} from "@/lib/firebase-admin"
import { getSessionUser } from "@/app/actions/auth"
import type { Course, Enrollment, QuizAttempt, Certificate, User } from "@/lib/types"
import { getLessons, gradeQuiz } from "@/lib/lms-content"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"
import { isCourseVisibleToUser } from "@/lib/utils"
import { isSuperAdmin as checkIsSuperAdmin } from "@/lib/access-control"
import {
  getStaticLmsCourseById,
  getStaticLmsCourseBySlug,
  getStaticLmsCourses,
  hasStaticLmsCourses,
} from "@/lib/static-lms-courses"

const COURSE_CACHE_TAG = "lms-courses"
const ADMIN_SOURCE_CACHE_TAG = "lms-admin-source"
const SESSION_USER_PROFILE_CACHE_TAG = "session-user-profile"
const ALLOW_FIRESTORE_COURSE_FALLBACK = process.env.LMS_ALLOW_FIRESTORE_COURSE_FALLBACK === "true"

function revalidateCacheTag(tag: string) {
  revalidateTag(tag, "max")
}

function parseSafeDate(val: any): Date {
  if (!val) return new Date()
  let d: Date
  if (typeof val?.toDate === "function") {
    d = val.toDate()
  } else {
    d = new Date(val)
  }
  return isNaN(d.getTime()) ? new Date() : d
}

async function getUserId() {
  try {
    const user = await getSessionUser()
    if (!user) throw new Error("Unauthorized")
    return user.id
  } catch (error) {
    console.error("Failed to get user ID:", error)
    // Return null instead of throwing, let the caller handle it?
    // Wait, the user snippet throws the error
    throw error
  }
}

export async function promoteMeToAdmin() {
  const user = await getSessionUser()
  if (user && checkIsSuperAdmin(user)) {
    await adminDb.collection("users").doc(user.id).update({ role: "admin" })
    revalidateCacheTag(SESSION_USER_PROFILE_CACHE_TAG)
  }
}

async function getCourseById(courseId: number): Promise<Course | null> {
  const staticCourse = getStaticLmsCourseById(courseId)
  if (staticCourse) return staticCourse
  if (hasStaticLmsCourses() && !ALLOW_FIRESTORE_COURSE_FALLBACK) return null

  const doc = await adminDb.collection("courses").doc(String(courseId)).get()
  return doc.exists ? (doc.data() as Course) : null
}

// ── In-memory TTL cache to prevent Firestore quota exhaustion ──
const cache = new Map<string, { data: any; expiresAt: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (entry && Date.now() < entry.expiresAt) return entry.data as T
  cache.delete(key)
  return null
}

function setCache(key: string, data: any, ttlMs = CACHE_TTL_MS) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs })
}

function invalidateCache(key?: string) {
  if (key) cache.delete(key)
  else cache.clear()
}


function isFirestoreQuotaError(error: unknown) {
  const err = error as { code?: string | number; message?: string; details?: string }
  const text = `${err?.message ?? ""} ${err?.details ?? ""}`
  return (
    err?.code === 8 ||
    err?.code === 4 ||
    err?.code === 14 ||
    err?.code === "resource-exhausted" ||
    err?.code === "deadline-exceeded" ||
    err?.code === "unavailable" ||
    text.includes("RESOURCE_EXHAUSTED") ||
    text.includes("DEADLINE_EXCEEDED") ||
    text.includes("UNAVAILABLE") ||
    text.includes("Quota exceeded") ||
    text.includes("fetch failed") ||
    text.includes("network-request-failed") ||
    text.includes("Too many requests") ||
    text.includes("timeout")
  )
}

function toCacheSafeValue(value: any): any {
  if (value == null) return value
  if (typeof value?.toDate === "function") return value.toDate().toISOString()
  if (typeof value?._seconds === "number") {
    return new Date(value._seconds * 1000 + Math.round((value._nanoseconds ?? 0) / 1000000)).toISOString()
  }
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map(toCacheSafeValue)
  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, toCacheSafeValue(val)]))
  }
  return value
}

const getCachedCoursesFromFirestore = unstable_cache(
  async () => {
    const snap = await adminDb.collection("courses").orderBy("category").orderBy("title").get()
    return snap.docs.map((d: any) => toCacheSafeValue(d.data()) as Course)
  },
  ["lms-courses-v1"],
  { tags: [COURSE_CACHE_TAG], revalidate: 60 * 60 }
)

const getCachedAdminSourceData = unstable_cache(
  async () => {
    const [usersList, enrollmentsList, certificatesList] = await Promise.all([
      getAllUsers(),
      getAllEnrollments(),
      getAllCertificates(),
    ])

    return {
      users: (Array.isArray(usersList) ? usersList : []).map(toCacheSafeValue) as User[],
      enrollments: (Array.isArray(enrollmentsList) ? enrollmentsList : []).map(toCacheSafeValue) as Enrollment[],
      certificates: (Array.isArray(certificatesList) ? certificatesList : []).map(toCacheSafeValue) as Certificate[],
    }
  },
  ["lms-admin-source-v1"],
  { tags: [ADMIN_SOURCE_CACHE_TAG], revalidate: 30 * 60 }
)

function invalidateAdminCaches() {
  invalidateCache("all_users")
  invalidateCache("all_enrollments")
  invalidateCache("all_certificates")
  revalidateCacheTag(ADMIN_SOURCE_CACHE_TAG)
}

function courseIsInManagerScope(course: Course, viewer: { id: string; role?: string; subsidiary?: string | null }) {
  if (course.authorId === viewer.id) return true
  const courseSubsidiaries = (course.subsidiaries || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)

  if (viewer.role === "group_head_standard") {
    return courseSubsidiaries.some((sub) => sub.startsWith("dci -"))
  }

  if (!viewer.subsidiary) return false
  return courseSubsidiaries.includes(viewer.subsidiary.toLowerCase())
}

async function assertCanManageTargetUser(
  viewer: { id: string; email: string; role?: string; subsidiary?: string | null },
  targetUserId: string
) {
  if (checkIsSuperAdmin(viewer)) return

  const target = await getUserById(targetUserId)
  if (!target) throw new Error("User not found")

  if (viewer.role === "group_head_standard") {
    if (target.subsidiary?.startsWith("DCI - ")) return
    throw new Error("Forbidden")
  }

  if ((viewer.role === "lead" || viewer.role === "group_head") && target.subsidiary === viewer.subsidiary) {
    return
  }

  throw new Error("Forbidden")
}

export async function getCourses(): Promise<Course[]> {
  const staticCourses = getStaticLmsCourses()
  let liveCourses: Course[] = []

  const cached = getCached<Course[]>("courses")
  if (cached) {
    liveCourses = cached
  } else {
    try {
      liveCourses = await getCachedCoursesFromFirestore()
      setCache("courses", liveCourses)
    } catch (error) {
      console.error("Firestore error while loading LMS courses.", error)
    }
  }

  const merged = new Map<string, Course>()
  for (const course of staticCourses) {
    merged.set(course.slug || String(course.id), course)
  }
  for (const course of liveCourses) {
    merged.set(course.slug || String(course.id), toCacheSafeValue(course) as Course)
  }
  return [...merged.values()].filter(c => !(c as any).isDeleted)
}

export async function getAdminCourses(): Promise<Course[]> {
  const staticCourses = getStaticLmsCourses()
  let liveCourses: Course[] = []

  try {
    liveCourses = await getCachedCoursesFromFirestore()
  } catch (error) {
    console.error("Firestore error while loading admin LMS courses; serving static catalog only.", error)
  }

  const merged = new Map<string, Course>()
  for (const course of staticCourses) {
    merged.set(course.slug || String(course.id), course)
  }
  for (const course of liveCourses) {
    merged.set(course.slug || String(course.id), toCacheSafeValue(course) as Course)
  }
  return [...merged.values()].filter(c => !(c as any).isDeleted)
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  let liveCourse: Course | null = null
  try {
    const snap = await adminDb.collection("courses").where("slug", "==", slug).limit(1).get()
    if (!snap.empty) {
      liveCourse = toCacheSafeValue(snap.docs[0].data()) as Course
    }
  } catch (error) {
    if (isFirestoreQuotaError(error)) {
      console.error(`Firestore quota exhausted while loading LMS course slug "${slug}".`, error)
    } else {
      throw error
    }
  }

  if (liveCourse) {
    if ((liveCourse as any).isDeleted) return null
    return liveCourse
  }

  return getStaticLmsCourseBySlug(slug) || null
}

export async function getAdminCourseBySlug(slug: string): Promise<Course | null> {
  return getCourseBySlug(slug)
}

export async function getMyEnrollments(): Promise<Enrollment[]> {
  const userId = await getUserId()
  let enrollments: Enrollment[] | null = null
  try {
    enrollments = await getEnrollmentsByUser(userId)
  } catch (error) {
    console.error("Firestore error while loading user enrollments; serving empty enrollment fallback.", error)
    return []
  }
  return (enrollments || []).map(toCacheSafeValue).sort((a: any, b: any) => {
    const aTime = (a.enrolledAt as any)?.getTime?.() || new Date(a.enrolledAt).getTime()
    const bTime = (b.enrolledAt as any)?.getTime?.() || new Date(b.enrolledAt).getTime()
    return aTime - bTime
  })
}

export async function getMyEnrollmentForCourse(courseId: number): Promise<Enrollment | null> {
  const userId = await getUserId()
  const enrollments = await getEnrollmentsByUser(userId)
  const enrollment = (enrollments || []).find((e: any) => Number(e.courseId) === Number(courseId))
  return enrollment ? (toCacheSafeValue(enrollment) as Enrollment) : null
}

export async function enrollInCourse(courseId: number) {
  const userId = await getUserId()
  const course = await getCourseById(courseId)
  if (!course) throw new Error("Course not found")

  const viewer = await getSessionUser()
  if (!viewer) throw new Error("Unauthorized")
  const isVisible = isCourseVisibleToUser(
    course.subsidiaries,
    viewer.subsidiary || null,
    viewer.role || "learner",
    viewer.email || null
  )
  if (!isVisible) throw new Error("Forbidden: You are not authorized to enroll in this course")

  const existing = await getMyEnrollmentForCourse(courseId)
  if (!existing) {
    const id = Date.now()
    await adminDb.collection("enrollments").doc(`${userId}_${courseId}`).set({
      id,
      userId,
      courseId,
      status: "enrolled",
      progress: 0,
      enrolledAt: new Date(),
      completedAt: null
    })
    await adminDb.collection("courses").doc(String(courseId)).update({
      enrollmentCount: FieldValue.increment(1)
    }).catch(e => console.error("Failed to increment enrollmentCount", e))
    invalidateUserCourseCaches(userId, courseId)
    revalidateCacheTag(`lms-state-${userId}-${courseId}`)

    await recomputeCourseProgress(userId, courseId)
  }
  invalidateAdminCaches()
  revalidatePath("/lms")
  revalidatePath("/lms", "layout")
}

export async function unenrollFromCourse(courseId: number) {
  const userId = await getUserId()
  const existing = await getMyEnrollmentForCourse(courseId)
  if (!existing) return
  if (existing.status === "completed") throw new Error("Cannot drop a course that has already been completed.")

  // Delete all matching documents regardless of doc ID format (legacy enrollments used Date.now() in doc ID)
  const snap = await adminDb.collection("enrollments")
    .where("userId", "==", userId)
    .where("courseId", "in", [courseId, String(courseId)])
    .get()

  if (!snap.empty) {
    const batch = adminDb.batch()
    snap.docs.forEach(doc => batch.delete(doc.ref))
    await batch.commit()
  }

  await adminDb.collection("courses").doc(String(courseId)).update({
    enrollmentCount: FieldValue.increment(-1)
  }).catch(e => console.error("Failed to decrement enrollmentCount", e))
  invalidateUserCourseCaches(userId, courseId)
  revalidateCacheTag(`lms-state-${userId}-${courseId}`)

  invalidateAdminCaches()
  revalidatePath("/lms")
  revalidatePath("/lms", "layout")
}

export async function getMyLessonProgress(courseId: number): Promise<string[]> {
  const userId = await getUserId()
  const progress = await getLessonProgressByUser(userId, courseId)
  return (progress || []).map((p: any) => p.lessonKey)
}

export async function completeLesson(courseId: number, lessonKey: string) {
  const userId = await getUserId()
  const docId = `${userId}_${courseId}_${lessonKey}`
  await adminDb.collection("lessonProgress").doc(docId).set({
    userId,
    courseId,
    lessonKey,
    completedAt: new Date()
  }, { merge: true })
  invalidateUserCourseCaches(userId, courseId)
  revalidateCacheTag(`lms-state-${userId}-${courseId}`)

  await recomputeCourseProgress(userId, courseId)
  revalidatePath("/lms")
  revalidatePath("/lms", "layout")
}

export async function getMyQuizAttempts(courseId: number): Promise<QuizAttempt[]> {
  const userId = await getUserId()
  const attempts = await getQuizAttemptsByUser(userId, courseId)
  const results = (attempts || []).map((d: any) => ({
    ...d,
    createdAt: (d.createdAt as any)?.toDate?.() || new Date(d.createdAt)
  })) as QuizAttempt[]
  return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function submitQuiz(courseId: number, answers: any[], seed?: number) {
  const userId = await getUserId()
  const course = await getCourseById(courseId)
  if (!course) throw new Error("Course not found")

  const result = gradeQuiz(course, answers, seed)
  await adminDb.collection("quizAttempts").add({
    id: Date.now(),
    userId,
    courseId,
    score: result.score,
    total: result.total,
    passed: result.passed,
    answers: JSON.stringify(answers),
    createdAt: new Date(),
  })

  invalidateUserCourseCaches(userId, courseId)
  revalidateCacheTag(`lms-state-${userId}-${courseId}`)
  await recomputeCourseProgress(userId, courseId)
  revalidatePath("/lms")
  revalidatePath("/lms", "layout")
  return result
}

export async function getMyCertificateForCourse(courseId: number): Promise<Certificate | null> {
  const userId = await getUserId()
  return getCertificateForCourse(courseId, userId)
}

export async function getCertificateForCourse(courseId: number, targetUserId?: string): Promise<Certificate | null> {
  const uid = targetUserId || await getUserId()
  const certificates = await getCertificatesByUser(uid, courseId)
  if (!certificates || certificates.length === 0) return null;
  const cert = certificates[0];
  return {
    ...cert,
    issuedAt: parseSafeDate(cert.issuedAt)
  } as Certificate;
}

export type MyCourseLearningState = {
  enrollment: Enrollment | null
  completedLessonKeys: string[]
  quizAttempts: QuizAttempt[]
  certificate: Certificate | null
}

async function fetchLearningState(uid: string, cid: number): Promise<MyCourseLearningState> {
  const enrollments = await getEnrollmentsByUser(uid)
  const rawEnrollment = (enrollments || []).find((e: any) => Number(e.courseId) === Number(cid))
  const enrollment = rawEnrollment ? (toCacheSafeValue(rawEnrollment) as Enrollment) : null

  if (!enrollment) {
    return {
      enrollment: null,
      completedLessonKeys: [],
      quizAttempts: [],
      certificate: null,
    }
  }

  const [progress, attempts, certificates] = await Promise.all([
    getLessonProgressByUser(uid, cid),
    getQuizAttemptsByUser(uid, cid),
    getCertificatesByUser(uid, cid),
  ])

  const quizAttempts = ((attempts || []).map((d: any) => ({
    ...d,
    createdAt: parseSafeDate(d.createdAt),
  })) as QuizAttempt[]).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const certificate = certificates?.[0]
    ? ({
        ...certificates[0],
        issuedAt: parseSafeDate(certificates[0].issuedAt),
      } as Certificate)
    : null

  return {
    enrollment,
    completedLessonKeys: (progress || []).map((p: any) => p.lessonKey),
    quizAttempts,
    certificate,
  }
}

export async function getMyCourseLearningState(courseId: number): Promise<MyCourseLearningState> {
  try {
    const userId = await getUserId()

    // ── Distributed Next.js Data Cache (Zero Firestore reads on hit) ──
    const getCachedState = unstable_cache(
      fetchLearningState,
      [`ls-${userId}-${courseId}`],
      {
        tags: [`lms-state-${userId}-${courseId}`],
        revalidate: 15 * 60, // 15 minutes globally
      }
    )

    return await getCachedState(userId, courseId)
  } catch (error) {
    console.error("Failed to load course learning state:", error)
    return {
      enrollment: null,
      completedLessonKeys: [],
      quizAttempts: [],
      certificate: null,
    }
  }
}

export async function getMyCertificates(): Promise<Certificate[]> {
  const userId = await getUserId()
  const certificates = await getCertificatesByUser(userId)
  return (certificates || [])
    .map((c: any) => ({
      ...c,
      issuedAt: parseSafeDate(c.issuedAt)
    }))
    .sort((a: any, b: any) => b.issuedAt.getTime() - a.issuedAt.getTime())
}

export async function recomputeCourseProgress(userId: string, courseId: number) {
  const course = await getCourseById(courseId)
  if (!course) return

  const hasCertificate = !!(await getCertificateForCourse(courseId, userId))
  const lessons = getLessons(course)
  const totalSteps = lessons.length + 1

  const lessonProgress = await getLessonProgressByUser(userId, courseId)
  const doneLessonRows = (lessonProgress || []).map((p: any) => p.lessonKey)
  const validKeys = new Set(lessons.map((l) => l.key))
  const currentKeyMatches = doneLessonRows.filter((k) => validKeys.has(k)).length
  const totalLegacyLessons = new Set(doneLessonRows).size
  const doneLessons = Math.max(currentKeyMatches, Math.min(totalLegacyLessons, lessons.length))

  const quizAttempts = await getQuizAttemptsByUser(userId, courseId)
  const quizPassed = (quizAttempts || []).some((qa: any) => qa.passed === true)

  const completedSteps = doneLessons + (quizPassed ? 1 : 0)
  
  let progress = Math.round((completedSteps / totalSteps) * 100)
  let isComplete = doneLessons >= lessons.length && quizPassed
  let status = isComplete ? "completed" : progress > 0 ? "in_progress" : "enrolled"

  if (hasCertificate) {
    progress = 100
    isComplete = true
    status = "completed"
  }

  const enrollmentRef = adminDb.collection("enrollments").doc(`${userId}_${courseId}`)
  try {
    await enrollmentRef.update({
      progress,
      status,
      completedAt: isComplete ? new Date() : null,
    })
  } catch (error: any) {
    if (error?.code !== 5) throw error

    await enrollmentRef.set({
      id: Date.now(),
      userId,
      courseId,
      status,
      progress,
      enrolledAt: new Date(),
      completedAt: isComplete ? new Date() : null,
    })
  }

  if (isComplete && !hasCertificate) {
    const serial = `EIB-${String(courseId).padStart(3, "0")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    await adminDb.collection("certificates").doc(`${userId}_${courseId}`).set({
      id: Date.now(),
      userId,
      courseId,
      serial,
      issuedAt: new Date()
    })
  }
  invalidateUserCourseCaches(userId, courseId)
  revalidateCacheTag(`lms-state-${userId}-${courseId}`)
}

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
  latestCertificateAt: Date | null
  latestEnrollmentAt: Date | null
  avgProgress: number
  enrolledCourses: { courseId: number; title: string; slug: string; status: string; progress: number; certificateId?: string }[]
  joinedAt: Date
}

export type AdminReport = {
  scope: "all" | string
  viewerRole: string
  totals: {
    learners: number
    enrollments: number
    completions: number
    certificates: number
    trainingValue: number
  }
  learners: LearnerReportRow[]
  topCourses: { courseId: number; title: string; enrolled: number; completed: number }[]
  allCourses: Course[]
}

export async function getViewerContext() {
  const u = await getSessionUser()
  if (!u) throw new Error("Unauthorized")
  return { role: u.role ?? "learner", subsidiary: u.subsidiary ?? null, name: u.name }
}

export async function getAdminReport(): Promise<AdminReport> {
  const viewer = await getSessionUser()
  if (!viewer) throw new Error("Unauthorized")
  const role = viewer.role ?? "learner"
  const isSuperAdmin = checkIsSuperAdmin(viewer)
  const orgWide = isSuperAdmin
  if (!isSuperAdmin && role !== "lead" && role !== "group_head" && role !== "group_head_standard") throw new Error("Forbidden")

  let learnerRows: User[] = []
  const [adminSource, allAvailableCourses] = await Promise.all([
    getCachedAdminSourceData(),
    getAdminCourses(),
  ])
  const allUsers = adminSource.users
  const allEnrollmentsRaw = adminSource.enrollments
  const allCertsRaw = adminSource.certificates

  if (isSuperAdmin) {
    learnerRows = allUsers
  } else {
    // 1. Find all courses authored by the viewer from the cached course list.
    const myCourseIds = allAvailableCourses
      .filter((c) => c.authorId === viewer.id)
      .map((c) => Number(c.id))

    // 2. Find all users enrolled in those courses (use cached enrollments)
    let enrolledUserIds: string[] = []
    if (myCourseIds.length > 0) {
      enrolledUserIds = allEnrollmentsRaw.filter(e => myCourseIds.includes(e.courseId)).map(e => e.userId)
    }

    // 3. Find base users
    let baseUsers: User[] = []
    if (role === "lead" || role === "group_head") {
      baseUsers = allUsers.filter(u => u.subsidiary === (viewer.subsidiary ?? "__none__"))
    } else if (role === "group_head_standard") {
      baseUsers = allUsers.filter(u => u.subsidiary?.startsWith("DCI - "))
    }

    const visibleUserIds = new Set(baseUsers.map((u) => u.id))
    enrolledUserIds.forEach((id) => visibleUserIds.add(id))
    learnerRows = allUsers.filter(u => visibleUserIds.has(u.id))
  }

  let manageableCourses = allAvailableCourses
  if (!isSuperAdmin) {
    manageableCourses = allAvailableCourses.filter((course) => courseIsInManagerScope(course, viewer))
  }

  const courseTitle = new Map(allAvailableCourses.map((c) => [c.id, c.title]))
  const courseSlug = new Map(allAvailableCourses.map((c) => [c.id, c.slug]))
  const coursePrice = new Map(allAvailableCourses.map((c) => [c.id, c.priceNaira]))
  
  const ids = learnerRows.map((u) => u.id)
  
  const visibleUserIdSet = new Set(ids)
  const allEnrollments = allEnrollmentsRaw.filter((e: Enrollment) => visibleUserIdSet.has(e.userId))
  
  const allCerts = allCertsRaw.filter((c: Certificate) => visibleUserIdSet.has(c.userId))

  const enrByUser = new Map<string, Enrollment[]>()
  const latestEnrollDateByUser = new Map<string, Date>()
  for (const e of allEnrollments) {
    const list = enrByUser.get(e.userId) ?? []
    list.push(e)
    enrByUser.set(e.userId, list)

    const dt = (e.enrolledAt as any)?.toDate ? (e.enrolledAt as any).toDate() : new Date(e.enrolledAt)
    const currentLatest = latestEnrollDateByUser.get(e.userId)
    if (dt && (!currentLatest || dt > currentLatest)) {
      latestEnrollDateByUser.set(e.userId, dt)
    }
  }
  const certCountByUser = new Map<string, number>()
  const latestCertDateByUser = new Map<string, Date>()
  for (const c of allCerts) {
    certCountByUser.set(c.userId, (certCountByUser.get(c.userId) ?? 0) + 1)
    const dt = (c.issuedAt as any)?.toDate ? (c.issuedAt as any).toDate() : new Date(c.issuedAt)
    const currentLatest = latestCertDateByUser.get(c.userId)
    if (dt && (!currentLatest || dt > currentLatest)) {
      latestCertDateByUser.set(c.userId, dt)
    }
  }

  const learners: LearnerReportRow[] = learnerRows.map((u) => {
    const list = enrByUser.get(u.id) ?? []
    const completed = list.filter((e) => e.status === "completed").length
    const inProgress = list.filter((e) => e.status === "in_progress").length
    const avgProgress = list.length > 0 ? Math.round(list.reduce((s, e) => s + e.progress, 0) / list.length) : 0
    
    const enrolledCourses = list.map((e) => {
      const cert = allCerts.find(c => c.userId === u.id && c.courseId === e.courseId)
      return {
        courseId: e.courseId,
        title: courseTitle.get(e.courseId) ?? `Course #${e.courseId}`,
        slug: courseSlug.get(e.courseId) ?? "",
        status: e.status,
        progress: e.progress,
        certificateId: cert?.id ? String(cert.id) : undefined
      }
    })

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
      latestCertificateAt: latestCertDateByUser.get(u.id) ?? null,
      latestEnrollmentAt: latestEnrollDateByUser.get(u.id) ?? null,
      avgProgress,
      enrolledCourses,
      joinedAt: (u.createdAt as any)?.toDate ? (u.createdAt as any).toDate() : new Date(u.createdAt),
    }
  })

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
    allCourses: manageableCourses,
  }
}

export async function createCourse(data: any) {
  const user = await getSessionUser()
  if (!user) throw new Error("Unauthorized")
  if (!checkIsSuperAdmin(user) && user.role !== "group_head" && user.role !== "lead") throw new Error("Forbidden")

  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  const existing = await getCourseBySlug(slug)
  if (existing) throw new Error("A course with this title already exists!")

  const id = Date.now()
  await adminDb.collection("courses").doc(String(id)).set({
    ...data,
    id,
    slug,
    isBriefing: !!data.isBriefing,
    authorId: user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  invalidateCache("courses")
  revalidateCacheTag(COURSE_CACHE_TAG)
  revalidateCacheTag(ADMIN_SOURCE_CACHE_TAG)
  revalidatePath("/lms")
  revalidatePath("/lms/admin")
}

export async function updateCourse(slug: string, data: any) {
  const user = await getSessionUser()
  if (!user) throw new Error("Unauthorized")

  const existing = await getCourseBySlug(slug)
  if (!existing) throw new Error("Course not found")
  if (!checkIsSuperAdmin(user) && existing.authorId !== user.id) throw new Error("Forbidden")

  await adminDb.collection("courses").doc(String(existing.id)).update({
    ...data,
    isBriefing: !!data.isBriefing,
    updatedAt: new Date()
  })

  invalidateCache("courses")
  revalidateCacheTag(COURSE_CACHE_TAG)
  revalidateCacheTag(ADMIN_SOURCE_CACHE_TAG)
  revalidatePath("/lms")
  revalidatePath("/lms/admin")
}

export async function saveCustomCourseContent(slug: string, content: string) {
  const user = await getSessionUser()
  if (!user) throw new Error("Unauthorized")

  const existing = await getCourseBySlug(slug)
  if (!existing) throw new Error("Course not found")
  if (!checkIsSuperAdmin(user) && existing.authorId !== user.id) throw new Error("Forbidden")

  await adminDb.collection("courses").doc(String(existing.id)).update({ customContent: content })
  invalidateCache("courses")
  revalidateCacheTag(COURSE_CACHE_TAG)
  revalidateCacheTag(ADMIN_SOURCE_CACHE_TAG)
  revalidatePath(`/lms/admin`)
  revalidatePath(`/lms/courses/${slug}`)
}

export async function setInitialRole(userId: string, requestedRole: string) {
  const user = await getSessionUser()
  if (!user) throw new Error("Unauthorized")
  if (!checkIsSuperAdmin(user) && user.id !== userId) throw new Error("Forbidden")
  if (!checkIsSuperAdmin(user) && requestedRole !== "learner") throw new Error("Forbidden")

  const validRoles = ["learner", "lead", "group_head"]
  if (!validRoles.includes(requestedRole)) return
  await adminDb.collection("users").doc(userId).update({ role: requestedRole })
  revalidateCacheTag(SESSION_USER_PROFILE_CACHE_TAG)
  invalidateAdminCaches()
  revalidatePath("/lms/admin")
}

export async function autoEnrollOnboarding(subsidiary: string) {
  try {
    const userId = await getUserId()
    const availableCourses = await getCourses()
    
    let subCourseTitle: string | null = null
    if (subsidiary === "DCI - SAC") subCourseTitle = "Special Operations Brief"
    else if (subsidiary === "DCI - RAW") subCourseTitle = "Information Security & Clearance Protocols"
    else if (subsidiary === "DCI - PSAP") subCourseTitle = "Public Safety Comms"
    else if (subsidiary === "DCI - Intel") subCourseTitle = "Intelligence Report Writing & MS Word Essentials"
    
    const toEnroll = []
    const globalCourse = availableCourses.find((course) => course.title === "EIB Group Global Orientation")
    if (globalCourse) toEnroll.push(globalCourse.id)

    if (subCourseTitle) {
      const subCourse = availableCourses.find((course) => course.title === subCourseTitle)
      if (subCourse) toEnroll.push(subCourse.id)
    }

    const existingEnrollments = await getEnrollmentsByUser(userId)
    const existingCourseIds = new Set((existingEnrollments || []).map((enrollment: any) => enrollment.courseId))

    for (const courseId of toEnroll) {
      if (!existingCourseIds.has(courseId)) {
        await adminDb.collection("enrollments").doc(`${userId}_${courseId}`).set({
          id: Date.now() + Math.random(),
          userId,
          courseId,
          status: "enrolled",
          progress: 0,
          enrolledAt: new Date(),
          completedAt: null
        })
        await adminDb.collection("courses").doc(String(courseId)).update({
          enrollmentCount: FieldValue.increment(1)
        }).catch(e => console.error("Failed to increment auto-enrollment count", e))
        invalidateUserCourseCaches(userId, courseId)
        revalidateCacheTag(`lms-state-${userId}-${courseId}`)
      }
    }
    invalidateAdminCaches()
  } catch (e) {
    console.error("Auto enroll failed", e)
  }
}

export async function adminResetUserPassword(userId: string) {
  const user = await getSessionUser()
  if (!checkIsSuperAdmin(user)) throw new Error("Forbidden")

  // Passwords are now managed by Firebase Auth
  const defaultPass = process.env.DEFAULT_RESET_PASSWORD || "ChangeMeImmediately123!"
  const { adminAuth } = await import("@/lib/firebase-admin")
  await adminAuth.updateUser(userId, { password: defaultPass })
  await adminDb.collection("users").doc(userId).update({ mustChangePassword: true })
  revalidateCacheTag(SESSION_USER_PROFILE_CACHE_TAG)
  revalidatePath("/lms/admin")
}

export async function adminUpdateUserName(userId: string, newName: string) {
  const user = await getSessionUser()
  if (!user || !checkIsSuperAdmin(user)) throw new Error("Forbidden")
  await adminDb.collection("users").doc(userId).update({ name: newName.trim() })
  revalidateCacheTag(SESSION_USER_PROFILE_CACHE_TAG)
  invalidateAdminCaches()
  revalidatePath("/lms/admin")
}

export async function adminUpdateUserEmail(userId: string, newEmail: string) {
  const user = await getSessionUser()
  if (!user || !checkIsSuperAdmin(user)) throw new Error("Forbidden")
  
  const { adminAuth } = await import("@/lib/firebase-admin")
  await adminAuth.updateUser(userId, { email: newEmail.trim() })
  await adminDb.collection("users").doc(userId).update({ email: newEmail.trim() })
  
  revalidateCacheTag(SESSION_USER_PROFILE_CACHE_TAG)
  invalidateAdminCaches()
  revalidatePath("/lms/admin")
}

export async function adminDeleteUser(userId: string) {
  const user = await getSessionUser()
  if (!user || !checkIsSuperAdmin(user)) throw new Error("Forbidden")
  if (user.id === userId) throw new Error("Cannot delete yourself")

  const { adminAuth } = await import("@/lib/firebase-admin")
  await adminAuth.deleteUser(userId)
  await adminDb.collection("users").doc(userId).delete()

  const deleteQuery = async (coll: string, field: string) => {
    const snap = await adminDb.collection(coll).where(field, "==", userId).get()
    const batch = adminDb.batch()
    snap.docs.forEach(d => batch.delete(d.ref))
    await batch.commit()
  }

  await deleteQuery("enrollments", "userId")
  await deleteQuery("lessonProgress", "userId")
  await deleteQuery("quizAttempts", "userId")
  await deleteQuery("certificates", "userId")

  invalidateAdminCaches()
  revalidatePath("/lms/admin")
}

export async function adminResetQuizAttempts(userId: string, courseId: number) {
  const user = await getSessionUser()
  if (!user || (!checkIsSuperAdmin(user) && user.role !== "group_head" && user.role !== "lead")) throw new Error("Forbidden")
  await assertCanManageTargetUser(user, userId)
  
  const snap = await adminDb.collection("quizAttempts")
    .where("userId", "==", userId)
    .where("courseId", "==", courseId).get()
  const batch = adminDb.batch()
  snap.docs.forEach(d => batch.delete(d.ref))
  await batch.commit()

  invalidateAdminCaches()
  revalidatePath("/lms/admin")
  revalidatePath(`/lms`)
}

export async function exportAdminCSV(): Promise<string> {
  const user = await getSessionUser()
  if (!user || !checkIsSuperAdmin(user)) throw new Error("Forbidden")

  const report = await getAdminReport()
  let csv = "Name,Email,Subsidiary,Course,Status,Progress (%),Certificate Link\n"
  const host = (await import("next/headers")).headers().then(h => h.get("host") || "localhost:3000")
  const baseUrl = `https://${await host}`

  for (const learner of report.learners) {
    const sub = learner.subsidiary || ""
    if (learner.enrolledCourses.length === 0) {
      csv += `"${learner.name}","${learner.email}","${sub}","(No enrollments)","N/A","0",""\n`
    } else {
      for (const course of learner.enrolledCourses) {
        const certLink = course.certificateId ? `${baseUrl}/lms/${course.slug}/certificate?userId=${learner.id}` : ""
        csv += `"${learner.name}","${learner.email}","${sub}","${course.title}","${course.status}","${course.progress}","${certLink}"\n`
      }
    }
  }
  return csv
}

export async function deleteCourse(slug: string) {
  const user = await getSessionUser()
  if (!checkIsSuperAdmin(user)) throw new Error("Forbidden")

  const course = await getCourseBySlug(slug)
  if (!course) return
  
  // 1. Fetch related enrollments to know which users were enrolled (needed for user cache invalidation)
  const enrollmentsSnap = await adminDb.collection("enrollments").where("courseId", "==", course.id).get()
  const userIds = Array.from(new Set(enrollmentsSnap.docs.map(d => d.data().userId)))

  // 2. Perform batched deletions of all related documents to optimize Firestore writes
  const batch = adminDb.batch()
  const courseRef = adminDb.collection("courses").doc(String(course.id))
  batch.set(courseRef, { isDeleted: true, id: course.id, slug: course.slug }, { merge: true })

  enrollmentsSnap.docs.forEach(doc => batch.delete(doc.ref))

  const quizAttemptsSnap = await adminDb.collection("quizAttempts").where("courseId", "==", course.id).get()
  quizAttemptsSnap.docs.forEach(doc => batch.delete(doc.ref))

  const lessonProgressSnap = await adminDb.collection("lessonProgress").where("courseId", "==", course.id).get()
  lessonProgressSnap.docs.forEach(doc => batch.delete(doc.ref))

  const certificatesSnap = await adminDb.collection("certificates").where("courseId", "==", course.id).get()
  certificatesSnap.docs.forEach(doc => batch.delete(doc.ref))

  await batch.commit()

  // 3. Invalidate caches for all affected users so their dashboard metrics are accurate
  for (const uid of userIds) {
    invalidateUserCourseCaches(uid, course.id)
  }

  // 4. Invalidate global admin and catalog caches
  invalidateAdminCaches()
  invalidateCache("courses")
  revalidateCacheTag(COURSE_CACHE_TAG)
  revalidatePath("/lms")
  revalidatePath("/lms/admin")
}

export async function duplicateCourseAsLMS(slug: string) {
  const user = await getSessionUser()
  if (!user || !checkIsSuperAdmin(user)) throw new Error("Forbidden")

  const course = await getCourseBySlug(slug)
  if (!course) throw new Error("Course not found")

  const newId = Date.now()
  const newSlug = `${course.slug}-copy-${Math.random().toString(36).substring(2, 7)}`
  await adminDb.collection("courses").doc(String(newId)).set({
    ...course,
    id: newId,
    slug: newSlug,
    title: `${course.title} (Copy)`,
    authorId: user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  invalidateCache("courses")
  revalidateCacheTag(COURSE_CACHE_TAG)
  revalidateCacheTag(ADMIN_SOURCE_CACHE_TAG)
  revalidatePath("/lms")
  revalidatePath("/lms/admin")
  return { newSlug }
}

export async function getAdminUserDetail(userId: string) {
  const viewer = await getSessionUser()
  if (!viewer) throw new Error("Unauthorized")

  const userData = await getUserById(userId)
  if (!userData) throw new Error("User not found")
  if (!checkIsSuperAdmin(viewer)) {
    const role = viewer.role ?? "learner"
    if (role !== "lead" && role !== "group_head" && role !== "group_head_standard") throw new Error("Forbidden")

    if (role === "group_head_standard") {
      if (!userData.subsidiary?.startsWith("DCI - ")) throw new Error("Forbidden")
    } else if (userData.subsidiary !== viewer.subsidiary) {
      throw new Error("Forbidden")
    }
  }
  
  // Use cached queries to prevent quota exhaustion
  const enrollments = await getEnrollmentsByUser(userId)
  const lessonProgress = await getLessonProgressByUser(userId)
  const quizAttempts = await getQuizAttemptsByUser(userId)
  const certificates = await getCertificatesByUser(userId)

  // Fetch all courses to get titles, categories, prices, lesson counts
  const allCourses = await getCourses()
  const courseMap = new Map(allCourses.map(c => [c.id, c]))

  const enrollmentsList = (enrollments || []).map((e: any) => {
    const course = courseMap.get(e.courseId)
    const lessonsForCourse = (lessonProgress || []).filter((lp: any) => lp.courseId === e.courseId && !!lp.lessonKey)
    const quizzesForCourse = (quizAttempts || []).filter((qa: any) => qa.courseId === e.courseId)
    
    let bestQuizScore = null
    let bestQuizTotal = null
    let quizPassed = false
    for (const qa of quizzesForCourse) {
      if (bestQuizScore === null || qa.score > bestQuizScore) {
        bestQuizScore = qa.score
        bestQuizTotal = qa.total
        quizPassed = qa.passed
      }
    }

    const hasCert = (certificates || []).some((c: any) => c.courseId === e.courseId)

    return {
      courseId: e.courseId,
      courseSlug: course?.slug || "",
      courseTitle: course?.title || `Course #${e.courseId}`,
      courseCategory: course?.category || "Uncategorized",
      status: e.status,
      progress: e.progress,
      lessonsCompleted: lessonsForCourse.length,
      lessonsTotal: course ? getLessons(course).length : 0,
      bestQuizScore,
      bestQuizTotal,
      quizPassed,
      hasCertificate: hasCert,
      enrolledAt: (e.enrolledAt as any)?.toDate ? (e.enrolledAt as any).toDate() : new Date(e.enrolledAt)
    }
  })

  // Calculate totals
  let trainingValue = 0
  for (const e of (enrollments || [])) {
    const course = courseMap.get(e.courseId)
    if (course) trainingValue += course.priceNaira
  }

  const totals = {
    enrolled: (enrollments || []).length,
    inProgress: (enrollments || []).filter((e: any) => e.status === "in_progress").length,
    completed: (enrollments || []).filter((e: any) => e.status === "completed").length,
    certificates: (certificates || []).length,
    trainingValue,
    avgProgress: (enrollments || []).length > 0 ? Math.round((enrollments || []).reduce((s: number, e: any) => s + e.progress, 0) / (enrollments || []).length) : 0
  }

  // Create activity feed
  const activity = []
  for (const e of (enrollments || [])) {
    const course = courseMap.get(e.courseId)
    activity.push({
      type: "enrollment",
      label: `Enrolled in ${course?.title || 'a course'}`,
      detail: "Started a new course",
      timestamp: (e.enrolledAt as any)?.toDate ? (e.enrolledAt as any).toDate() : new Date(e.enrolledAt)
    })
    if (e.status === "completed") {
      activity.push({
        type: "lesson",
        label: `Completed ${course?.title || 'a course'}`,
        detail: "Finished all lessons",
        timestamp: (e.completedAt as any)?.toDate ? (e.completedAt as any).toDate() : new Date()
      })
    }
  }
  for (const qa of (quizAttempts || [])) {
    const course = courseMap.get(qa.courseId)
    activity.push({
      type: "quiz",
      label: `Took quiz for ${course?.title || 'a course'}`,
      detail: `Scored ${qa.score}/${qa.total} ${qa.passed ? '(Passed)' : '(Failed)'}`,
      timestamp: (qa.createdAt as any)?.toDate ? (qa.createdAt as any).toDate() : new Date(qa.createdAt)
    })
  }
  for (const c of (certificates || [])) {
    const course = courseMap.get(c.courseId)
    activity.push({
      type: "certificate",
      label: `Earned Certificate`,
      detail: `Completed ${course?.title || 'a course'}`,
      timestamp: (c.issuedAt as any)?.toDate ? (c.issuedAt as any).toDate() : new Date(c.issuedAt)
    })
  }

  activity.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return {
    name: userData.name,
    email: userData.email,
    role: userData.role,
    subsidiary: userData.subsidiary,
    createdAt: (userData.createdAt as any)?.toDate ? (userData.createdAt as any).toDate() : new Date(userData.createdAt),
    totals,
    enrollments: enrollmentsList,
    activity
  }
}

export async function adminUpdateUserRole(userId: string, newRole: string) {
  const sessionUser = await getSessionUser()
  if (!sessionUser) throw new Error("Unauthorized")

  if (!checkIsSuperAdmin(sessionUser)) {
    throw new Error("Only Super Admins can update user roles.")
  }

  const { updateUserDoc } = await import("./auth")
  await updateUserDoc(userId, { role: newRole })
}
