import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import {
  getCourseBySlug,
  getMyEnrollmentForCourse,
  getMyLessonProgress,
  getMyQuizAttempts,
} from "@/app/actions/lms"
import { getLessons, getQuiz, QUIZ_PASS_THRESHOLD } from "@/lib/lms-content"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { QuizForm } from "@/components/lms/quiz-form"
import { ArrowLeft, ClipboardCheck, AlertTriangle, Award } from "lucide-react"

type Params = { slug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  return { title: course ? `Assessment · ${course.title} | EIB Group LMS` : "Assessment" }
}

export default async function QuizPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const enrollment = await getMyEnrollmentForCourse(course.id)
  if (!enrollment) redirect(`/lms/${slug}`)

  const lessons = getLessons(course)
  const completed = new Set(await getMyLessonProgress(course.id))
  const remaining = lessons.filter((l) => !completed.has(l.key))
  const attempts = await getMyQuizAttempts(course.id)
  const alreadyPassed = attempts.some((a) => a.passed)

  // Sanitize: never send correct answers to the client.
  const clientQuestions = getQuiz(course).map((q) => ({
    id: q.id,
    prompt: q.prompt,
    options: q.options,
  }))

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <Link
        href={`/lms/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {course.title}
      </Link>

      <div className="mt-5">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">
          <ClipboardCheck className="h-4 w-4" /> Final assessment
        </p>
        <h1 className="mt-2 text-balance font-heading text-3xl font-bold">{course.title}</h1>
        <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
          Answer all {clientQuestions.length} questions. You need {QUIZ_PASS_THRESHOLD}% to pass and
          earn your certificate. You can retake the assessment as many times as you need.
        </p>
      </div>

      {alreadyPassed && (
        <Card className="mt-6 border-l-4" style={{ borderLeftColor: "var(--chart-1)" }}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="text-sm font-medium">You have already passed this assessment.</p>
            <Link
              href={`/lms/${slug}/certificate`}
              className={buttonVariants({ size: "sm" })}
            >
              <Award className="mr-2 h-4 w-4" /> View certificate
            </Link>
          </CardContent>
        </Card>
      )}

      {remaining.length > 0 && (
        <Card className="mt-6 border-l-4" style={{ borderLeftColor: "var(--chart-3)" }}>
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--chart-3)]" />
            <div className="text-sm">
              <p className="font-medium">
                You can take the assessment now, but {remaining.length} lesson
                {remaining.length > 1 ? "s are" : " is"} still incomplete.
              </p>
              <p className="mt-0.5 text-muted-foreground">
                The course is only marked complete once every lesson is done and the quiz is passed.{" "}
                <Link
                  href={`/lms/${slug}/learn/${remaining[0].key}`}
                  className="font-medium text-primary hover:underline"
                >
                  Resume lessons
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-7">
        <QuizForm
          courseId={course.id}
          slug={slug}
          questions={clientQuestions}
          passThreshold={QUIZ_PASS_THRESHOLD}
        />
      </div>
    </main>
  )
}
