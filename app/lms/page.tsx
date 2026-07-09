import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getCourses, getMyEnrollments } from "@/app/actions/lms"
import { CourseCard } from "@/components/lms/course-card"
import { CourseCatalog } from "@/components/lms/course-catalog"
import { formatNaira, isCourseVisibleToUser } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { PrintActions } from "@/components/print-actions"
import { lmsVision, type LmsPhaseStatus } from "@/lib/plan-data"
import {
  GraduationCap,
  ArrowRight,
  MoveRight,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Activity,
  Award,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Learning Portal | EIB Group Training & OD",
  description:
    "Enroll in role-based training mapped to the EIB Group skill-gap analysis and track your learning progress.",
}

const statusMeta: Record<LmsPhaseStatus, { cls: string; dot: string; Icon: typeof CheckCircle2 }> = {
  "Live now": { cls: "bg-[var(--chart-1)] text-background", dot: "var(--chart-1)", Icon: CheckCircle2 },
  Next: { cls: "bg-accent text-accent-foreground", dot: "var(--accent)", Icon: Clock },
  Planned: { cls: "bg-secondary text-secondary-foreground", dot: "var(--chart-3)", Icon: Circle },
  Future: { cls: "bg-muted text-muted-foreground", dot: "var(--muted-foreground)", Icon: Circle },
}

export default async function LmsPage() {
  try {
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() })
  } catch (e) {
    console.error("LmsPage getSession error:", e)
  }

  const courses = await getCourses()

  // Signed-out: marketing / vision view with sign-up CTA.
  if (!session?.user) {
    const catalogValue = courses.reduce((s, c) => s + c.priceNaira, 0)
    return <SignedOutView courseCount={courses.length} catalogValue={catalogValue} />
  }

  const userRole = session.user.role || "learner"
  const userSubsidiary = session.user.subsidiary || null
  const userEmail = session.user.email || null

  const visibleCourses = courses.filter((c) =>
    !c.isBriefing && 
    isCourseVisibleToUser(c.subsidiaries, userSubsidiary, userRole, userEmail)
  )

  const enrollments = await getMyEnrollments()
  const enrollMap = new Map(enrollments.map((e) => [e.courseId, e]))
  const myCourses = courses.filter(
    (c) => enrollMap.has(c.id) && isCourseVisibleToUser(c.subsidiaries, userSubsidiary, userRole, userEmail)
  )

  const myValue = myCourses.reduce((s, c) => s + c.priceNaira, 0)
  const catalogValue = visibleCourses.reduce((s, c) => s + c.priceNaira, 0)

  const completed = enrollments.filter((e) => e.status === "completed").length
  const inProgress = enrollments.filter((e) => e.status === "in_progress").length
  const avg =
    enrollments.length > 0
      ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
      : 0

  // Group visible catalog by category.
  const byCategory = new Map<string, typeof courses>()
  for (const c of visibleCourses) {
    const list = byCategory.get(c.category) ?? []
    list.push(c)
    byCategory.set(c.category, list)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <GraduationCap className="h-4 w-4 text-accent" /> Learning Portal
          </p>
          <h1 className="mt-2 text-balance font-heading text-3xl font-bold md:text-4xl">
            Welcome back, {session.user.name?.split(" ")[0] || "learner"}
          </h1>
          <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            Enroll in training mapped directly to the EIB Group skill-gap analysis and track your
            progress toward measurable capability targets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/lms/settings" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Account Settings
          </Link>
          <PrintActions label="learning portal" />
        </div>
      </div>

      {/* Stats */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Enrolled" value={enrollments.length} />
        <StatCard icon={Activity} label="In progress" value={inProgress} />
        <StatCard icon={Award} label="Completed" value={completed} />
        <StatCard icon={CheckCircle2} label="Avg. progress" value={`${avg}%`} />
      </section>

      {myValue > 0 && (
        <Card className="mt-3 border-accent/40 bg-accent/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="text-sm text-muted-foreground">
              Training value you&apos;ve unlocked so far, fully sponsored by EIB Group
            </p>
            <span className="font-heading text-2xl font-bold tabular-nums text-foreground">
              {formatNaira(myValue)}
            </span>
          </CardContent>
        </Card>
      )}

      {/* My Learning */}
      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold">My Learning</h2>
        {myCourses.length === 0 ? (
          <Card className="mt-3">
            <CardContent className="flex flex-col items-start gap-3 p-6">
              <p className="text-sm text-muted-foreground">
                You haven&apos;t enrolled in any courses yet. Browse the catalog below and enroll in
                training relevant to your role.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myCourses.map((c) => (
              <CourseCard
                key={c.id}
                course={c}
                enrolled
                progress={enrollMap.get(c.id)?.progress ?? 0}
              />
            ))}
          </div>
        )}
      </section>

      <CourseCatalog
        courses={visibleCourses}
        enrollments={enrollments}
        userRole={userRole}
        userSubsidiary={userSubsidiary}
      />
    </main>
  )
  } catch (err: any) {
    return (
      <div className="p-8 font-mono text-red-500 whitespace-pre-wrap">
        <h1 className="text-xl font-bold">Server Error in LMS Dashboard:</h1>
        <p className="mt-4">{err.message}</p>
        <p className="mt-4 text-xs">{err.stack}</p>
      </div>
    )
  }
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen
  label: string
  value: string | number
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-bold tabular-nums leading-none">{value}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function SignedOutView({
  courseCount,
  catalogValue,
}: {
  courseCount: number
  catalogValue: number
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <GraduationCap className="h-4 w-4 text-accent" /> Learning Management System
          </p>
          <h1 className="mt-2 text-balance font-heading text-3xl font-bold md:text-4xl">
            {lmsVision.headline}
          </h1>
          <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
            {lmsVision.intro}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/sign-up" className={buttonVariants({ size: "sm" })}>
              Create an account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/sign-in" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Sign in
            </Link>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {courseCount} live courses worth {formatNaira(catalogValue)} in training value are ready
            — sign in to enroll and track progress.
          </p>
        </div>
        <PrintActions label="LMS vision" />
      </div>

      {/* The bridge: what we have → what it becomes */}
      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold">What We Already Have Becomes the LMS</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Nothing built so far is wasted — each asset maps directly onto a core LMS capability.
        </p>
        <div className="mt-4 grid gap-3">
          {lmsVision.bridge.map((b) => (
            <Card key={b.have} className="avoid-break">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Today
                  </p>
                  <p className="text-sm font-medium">{b.have}</p>
                </div>
                <MoveRight className="hidden h-5 w-5 shrink-0 text-accent sm:block" aria-hidden />
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                    In the LMS
                  </p>
                  <p className="text-sm font-medium">{b.becomes}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Phased maturity roadmap */}
      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold">The Build Path</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each phase is independently useful — we ship value continuously, not in one big bang.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          {lmsVision.phases.map((p) => {
            const meta = statusMeta[p.status]
            const StatusIcon = meta.Icon
            return (
              <Card
                key={p.phase}
                className="avoid-break overflow-hidden"
                style={{ borderLeft: `4px solid ${meta.dot}` }}
              >
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-md font-heading text-sm font-bold"
                        style={{
                          backgroundColor: `color-mix(in oklch, ${meta.dot} 18%, transparent)`,
                          color: meta.dot,
                        }}
                      >
                        {p.phase.replace("Phase ", "P")}
                      </span>
                      <div>
                        <p className="font-heading text-base font-semibold">{p.title}</p>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {p.phase}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.cls}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" /> {p.status}
                    </span>
                  </div>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {p.summary}
                  </p>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: meta.dot }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-md bg-muted/50 p-3 text-sm">
                    <span className="font-semibold text-foreground">Unlocks: </span>
                    <span className="text-muted-foreground">{p.unlocks}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="mt-10">
        <Card className="avoid-break bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <h3 className="font-heading text-lg font-semibold">Phase 1 is live</h3>
            <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/80">
              User accounts, roles, and a course catalog mapped to the skill-gap matrix are now
              available. Create an account to enroll in training tied to your subsidiary and track
              your progress.
            </p>
            <div className="no-print mt-5 flex flex-wrap gap-3">
              <Link href="/sign-up" className={buttonVariants({ variant: "secondary", size: "sm" })}>
                Get started
              </Link>
              <Link href="/input" className={buttonVariants({ variant: "outline", size: "sm" })}>
                See the skill-gap data <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
