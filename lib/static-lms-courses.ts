import type { Course } from "@/lib/types"
import seedCourses from "@/courses_to_gen.json"

export type StaticLmsCourse = Omit<Course, "createdAt" | "updatedAt"> & {
  createdAt: string | Date
  updatedAt: string | Date
}

type SeedCourse = {
  id: number
  title: string
  category: string
  format: string
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function durationForFormat(format: string) {
  if (format === "Workshop") return 8
  if (format === "Blended") return 12
  return 6
}

function levelForFormat(format: string) {
  if (format === "Workshop") return "Intermediate"
  if (format === "Blended") return "Advanced"
  return "Beginner"
}

function descriptionForCourse(course: SeedCourse) {
  return `${course.title} develops practical ${course.category.toLowerCase()} capability for EIB Group staff through structured ${course.format.toLowerCase()} learning, applied scenarios, and competency assessment.`
}

function buildSeedCourse(course: SeedCourse): StaticLmsCourse {
  const publishedAt = "2026-07-15T00:00:00.000Z"

  return {
    id: course.id,
    slug: slugify(course.title),
    title: course.title,
    description: descriptionForCourse(course),
    category: course.category,
    level: levelForFormat(course.format),
    format: course.format,
    durationHours: durationForFormat(course.format),
    priceNaira: 0,
    subsidiaries: "EIB Group",
    initiative: null,
    videoUrl: null,
    imageUrl: null,
    authorId: null,
    isBriefing: false,
    customContent: null,
    createdAt: publishedAt,
    updatedAt: publishedAt,
  }
}

// This emergency catalog is built from the repository's existing course seed.
// Running `pnpm lms:export-courses` replaces this seed-backed list with the
// richer live Firestore catalog once quota is available again.
export const STATIC_LMS_COURSE_DATA: StaticLmsCourse[] = (seedCourses as SeedCourse[]).map(buildSeedCourse)

function hydrateCourse(course: StaticLmsCourse): Course {
  return {
    ...course,
    createdAt: course.createdAt instanceof Date ? course.createdAt : new Date(course.createdAt),
    updatedAt: course.updatedAt instanceof Date ? course.updatedAt : new Date(course.updatedAt),
  }
}

export function getStaticLmsCourses(): Course[] {
  return STATIC_LMS_COURSE_DATA.map(hydrateCourse).sort((a, b) => {
    const category = a.category.localeCompare(b.category)
    return category !== 0 ? category : a.title.localeCompare(b.title)
  })
}

export function getStaticLmsCourseBySlug(slug: string): Course | null {
  const course = STATIC_LMS_COURSE_DATA.find((item) => item.slug === slug)
  return course ? hydrateCourse(course) : null
}

export function getStaticLmsCourseById(id: number): Course | null {
  const course = STATIC_LMS_COURSE_DATA.find((item) => item.id === id)
  return course ? hydrateCourse(course) : null
}
