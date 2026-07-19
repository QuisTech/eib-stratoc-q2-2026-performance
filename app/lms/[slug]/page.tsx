import { getSessionUser } from "@/app/actions/auth"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import {
  getCourseBySlug,
  getMyCourseLearningState,
} from "@/app/actions/lms"
import { getLessons } from "@/lib/lms-content"
import { formatNaira, isCourseVisibleToUser, formatCourseSubsidiaries } from "@/lib/utils"
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
  Unlock,
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
    openGraph: {
      title: `${course.title} | EIB Group LMS`,
      description: course.description,
      images: course.imageUrl ? [{ url: course.imageUrl, width: 1200, height: 630, type: "image/png" }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} | EIB Group LMS`,
      description: course.description,
      images: course.imageUrl ? [course.imageUrl] : [],
    },
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  
  const user = await getSessionUser();
  const session = user ? { user } : null
  const signedIn = Boolean(session?.user)

  // Super Admins get the bleeding edge live data so they can test their edits immediately
  const { getAdminCourseBySlug } = await import("@/app/actions/lms")
  const isSuperAdmin = user && (await import("@/lib/access-control")).isSuperAdminEmail(user.email)
  const course = isSuperAdmin ? await getAdminCourseBySlug(slug) : await getCourseBySlug(slug)
  
  if (!course) notFound()

  // Enforce subsidiary visibility check if the user is signed in
  if (session?.user) {
    const isVisible = isCourseVisibleToUser(
      course.subsidiaries,
      session.user.subsidiary || null,
      session.user.role || "learner",
      session.user.email || null
    )
    if (!isVisible) {
      notFound()
    }
  }

  const learningState = signedIn ? await getMyCourseLearningState(course.id) : null
  const enrollment = learningState?.enrollment ?? null
  const enrolled = Boolean(enrollment)

  const lessons = getLessons(course)
  const completedKeys = new Set(learningState?.completedLessonKeys ?? [])
  const attempts = learningState?.quizAttempts ?? []
  const certificate = learningState?.certificate ?? null
  const quizPassed = attempts.some((a) => a.passed)
  const bestPercent = attempts.reduce((m, a) => Math.max(m, Math.round((a.score / a.total) * 100)), 0)

  const firstIncomplete = lessons.find((l) => !completedKeys.has(l.key))
  const continueHref = lessons.length > 0 ? `/lms/${slug}/learn/${(firstIncomplete ?? lessons[0]).key}` : "#"
  const allLessonsDone = lessons.length > 0 && completedKeys.size >= lessons.length

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
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-accent" />
              {formatCourseSubsidiaries(course.subsidiaries)}
            </span>
          </div>

          {/* Curriculum */}
          <section id="curriculum" className="mt-9">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold">
              <BookOpen className="h-5 w-5 text-primary" /> Curriculum
            </h2>
            <ol className="mt-4 flex flex-col gap-3">
              {lessons.map((l, i) => {
                const done = completedKeys.has(l.key)
                const isFreePreview = i < 2 || !!l.isPreview
                const canAccess = enrolled || isFreePreview
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
                            {canAccess ? (
                              <Link
                                href={`/lms/${slug}/learn/${l.key}`}
                                className="font-medium hover:text-primary flex items-center gap-2"
                              >
                                {l.title}
                                {!enrolled && isFreePreview && (
                                  <Badge variant="default" className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm shadow-emerald-500/20">Free Preview</Badge>
                                )}
                              </Link>
                            ) : (
                              <p className="font-medium">{l.title}</p>
                            )}
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              {!enrolled && !isFreePreview && <Lock className="h-3 w-3" />}
                              {!enrolled && isFreePreview && <Unlock className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
                              ~{l.minutes}m
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
              {course.priceNaira > 0 ? (
                <div className="border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-3xl font-bold tabular-nums text-muted-foreground line-through">
                      {formatNaira(course.priceNaira)}
                    </span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      Free
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Equivalent market value of this training, fully sponsored by the organization.
                  </p>
                </div>
              ) : (
                <div className="border-b border-border pb-4">
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    Free
                  </span>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This course is provided completely free of charge.
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

                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--chart-1)]">
                      {enrollment?.status === "completed" && (
                        <>
                          <CheckCircle2 className="h-4 w-4" /> Course complete
                        </>
                      )}
                    </div>
                  </div>
                  <Link 
                    href={`/lms/${slug}#curriculum`}
                    className={buttonVariants({ size: "sm" })}
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    {enrollment?.status === "completed" 
                      ? "Review course materials" 
                      : completedKeys.size === 0 
                        ? "Start learning" 
                        : "Continue learning"}
                  </Link>

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
                    <EnrollButton courseId={course.id} enrolled variant="ghost" isCompleted={quizPassed} />
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
