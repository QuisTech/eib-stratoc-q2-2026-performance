import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import {
  getCourseBySlug,
  getMyEnrollmentForCourse,
  getMyLessonProgress,
  getMyQuizAttempts,
  getMyCertificateForCourse,
} from "@/app/actions/lms"
import { getLessons } from "@/lib/lms-content"
import { formatNaira } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { buttonVariants } from "@/components/ui/button"
import { EnrollButton } from "@/components/lms/enroll-button"
import {
  ArrowLeft,
  Clock,
  Layers,
  Building2,
  Target,
  BookOpen,
  Lock,
  CheckCircle2,
  ClipboardCheck,
  Award,
  PlayCircle,
} from "lucide-react"

type Params = { slug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) return { title: "Course not found | EIB Group LMS" }
  return {
    title: `${course.title} | EIB Group LMS`,
    description: course.description,
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const session = await auth.api.getSession({ headers: await headers() })
  const signedIn = Boolean(session?.user)

  const enrollment = signedIn ? await getMyEnrollmentForCourse(course.id) : null
  const enrolled = Boolean(enrollment)

  const lessons = getLessons(course)
  const completedKeys = enrolled ? new Set(await getMyLessonProgress(course.id)) : new Set<string>()
  const attempts = enrolled ? await getMyQuizAttempts(course.id) : []
  const certificate = enrolled ? await getMyCertificateForCourse(course.id) : null
  const quizPassed = attempts.some((a) => a.passed)
  const bestPercent = attempts.reduce((m, a) => Math.max(m, Math.round((a.score / a.total) * 100)), 0)

  const firstIncomplete = lessons.find((l) => !completedKeys.has(l.key))
  const continueHref = `/lms/${slug}/learn/${(firstIncomplete ?? lessons[0]).key}`
  const allLessonsDone = completedKeys.size >= lessons.length

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <Link
        href="/lms"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to catalog
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{course.category}</Badge>
            <Badge variant="outline">{course.level}</Badge>
            {course.initiative && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                <Target className="h-3.5 w-3.5" /> Initiative #{course.initiative}
              </span>
            )}
          </div>

          <h1 className="mt-3 text-balance font-heading text-3xl font-bold md:text-4xl">
            {course.title}
          </h1>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            {course.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-5 text-sm">
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-accent" /> {course.format}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" /> {course.durationHours} hours
            </span>
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-accent" /> {lessons.length} lessons + assessment
            </span>
            {course.subsidiaries && (
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-accent" />
                {course.subsidiaries.split(",").join(" · ")}
              </span>
            )}
          </div>

          {/* Curriculum */}
          <section className="mt-9">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold">
              <BookOpen className="h-5 w-5 text-primary" /> Curriculum
            </h2>
            <ol className="mt-4 flex flex-col gap-3">
              {lessons.map((l, i) => {
                const done = completedKeys.has(l.key)
                return (
                  <li key={l.key}>
                    <Card className="avoid-break">
                      <CardContent className="flex items-start gap-4 p-4">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                            done
                              ? "bg-[var(--chart-1)] text-background"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            {enrolled ? (
                              <Link
                                href={`/lms/${slug}/learn/${l.key}`}
                                className="font-medium hover:text-primary"
                              >
                                {l.title}
                              </Link>
                            ) : (
                              <p className="font-medium">{l.title}</p>
                            )}
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              {!enrolled && <Lock className="h-3 w-3" />}~{l.minutes}m
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">{l.summary}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                )
              })}
              {/* Assessment row */}
              <li>
                <Card className="avoid-break">
                  <CardContent className="flex items-start gap-4 p-4">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        quizPassed ? "bg-[var(--chart-1)] text-background" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {quizPassed ? <CheckCircle2 className="h-4 w-4" /> : <ClipboardCheck className="h-4 w-4" />}
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {enrolled ? (
                          <Link href={`/lms/${slug}/quiz`} className="font-medium hover:text-primary">
                            Final assessment
                          </Link>
                        ) : (
                          <p className="font-medium">Final assessment</p>
                        )}
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          {!enrolled && <Lock className="h-3 w-3" />}
                          {quizPassed ? "Passed" : "Quiz"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Demonstrate competency and earn your certificate.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            </ol>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardContent className="flex flex-col gap-5 p-6">
              {course.priceNaira > 0 && (
                <div className="border-b border-border pb-4">
                  <span className="font-heading text-3xl font-bold tabular-nums">
                    {formatNaira(course.priceNaira)}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Equivalent market value of this training, fully sponsored for EIB Group staff.
                  </p>
                </div>
              )}

              {!signedIn ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Sign in to enroll in this course and track your progress.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link href="/sign-in" className={buttonVariants({ size: "sm" })}>
                      Sign in to enroll
                    </Link>
                    <Link
                      href="/sign-up"
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      Create an account
                    </Link>
                  </div>
                </>
              ) : enrolled ? (
                <>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Your progress</span>
                      <span className="tabular-nums text-muted-foreground">
                        {enrollment?.progress ?? 0}%
                        {enrollment?.status === "completed" ? " · Completed" : ""}
                      </span>
                    </div>
                    <Progress value={enrollment?.progress ?? 0} className="mt-2 h-2" />
                  </div>

                  {enrollment?.status === "completed" ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--chart-1)]">
                      <CheckCircle2 className="h-4 w-4" /> Course complete
                    </div>
                  ) : (
                    <Link href={continueHref} className={buttonVariants({ size: "sm" })}>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {completedKeys.size === 0 ? "Start learning" : "Continue learning"}
                    </Link>
                  )}

                  <Link
                    href={`/lms/${slug}/quiz`}
                    className={buttonVariants({
                      variant: allLessonsDone && !quizPassed ? "default" : "outline",
                      size: "sm",
                    })}
                  >
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    {quizPassed
                      ? `Assessment passed (${bestPercent}%)`
                      : attempts.length > 0
                        ? "Retake assessment"
                        : "Take assessment"}
                  </Link>

                  {certificate && (
                    <Link
                      href={`/lms/${slug}/certificate`}
                      className={buttonVariants({ variant: "secondary", size: "sm" })}
                    >
                      <Award className="mr-2 h-4 w-4" /> View certificate
                    </Link>
                  )}

                  <div className="border-t border-border pt-4">
                    <EnrollButton courseId={course.id} enrolled variant="ghost" />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Enroll to unlock the {lessons.length} lessons, the assessment, and your
                    certificate.
                  </p>
                  <EnrollButton courseId={course.id} enrolled={false} />
                </>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
