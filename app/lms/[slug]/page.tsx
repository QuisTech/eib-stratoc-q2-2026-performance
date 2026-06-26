import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getCourseBySlug, getMyEnrollmentForCourse } from "@/app/actions/lms"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { EnrollButton } from "@/components/lms/enroll-button"
import { ProgressControls } from "@/components/lms/progress-controls"
import {
  ArrowLeft,
  Clock,
  Layers,
  Building2,
  Target,
  BookOpen,
  Lock,
  CheckCircle2,
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

// A deterministic module outline derived from the course so the detail page
// reads like a real curriculum without needing a separate lessons table.
function buildModules(title: string, durationHours: number) {
  const base = [
    { name: "Orientation & objectives", note: "What you'll achieve and how it maps to your role." },
    { name: "Core concepts", note: "The essential knowledge and terminology." },
    { name: "Hands-on practice", note: "Guided exercises on real scenarios." },
    { name: "Applied workshop", note: "Apply the skills to a subsidiary use case." },
    { name: "Assessment & certification", note: "Demonstrate competency and earn your record." },
  ]
  const perModule = Math.max(1, Math.round(durationHours / base.length))
  return base.map((m, i) => ({ ...m, index: i + 1, hours: perModule }))
}

export default async function CourseDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const session = await auth.api.getSession({ headers: await headers() })
  const enrollment = session?.user ? await getMyEnrollmentForCourse(course.id) : null
  const enrolled = Boolean(enrollment)
  const modules = buildModules(course.title, course.durationHours)

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
              {modules.map((m) => {
                const moduleDone =
                  enrolled && (enrollment?.progress ?? 0) >= (m.index / modules.length) * 100
                return (
                  <li key={m.index}>
                    <Card className="avoid-break">
                      <CardContent className="flex items-start gap-4 p-4">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                            moduleDone
                              ? "bg-[var(--chart-1)] text-background"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {moduleDone ? <CheckCircle2 className="h-4 w-4" /> : m.index}
                        </span>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-medium">{m.name}</p>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              {!enrolled && <Lock className="h-3 w-3" />}
                              {m.hours}h
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">{m.note}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                )
              })}
            </ol>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardContent className="flex flex-col gap-5 p-6">
              {!session?.user ? (
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
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--chart-1)]">
                    <CheckCircle2 className="h-4 w-4" /> You&apos;re enrolled
                  </div>
                  <ProgressControls courseId={course.id} progress={enrollment?.progress ?? 0} />
                  <div className="border-t border-border pt-4">
                    <EnrollButton courseId={course.id} enrolled variant="outline" />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Enroll to unlock the full curriculum and start tracking your progress.
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
