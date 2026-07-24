import { getSessionUser } from "@/app/actions/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

import { getAdminReport } from "@/app/actions/lms"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatNaira } from "@/lib/utils"
import { ArrowLeft, Users, BookOpen, GraduationCap, Award, Server } from "lucide-react"
import { ExportCsvButton } from "./export-csv-button"
import { LearnerManagement } from "./learner-management"
import { CourseManagement } from "./course-management"
import { isSuperAdmin as checkIsSuperAdmin } from "@/lib/access-control"
import { getCacheStats } from "@/lib/firebase-admin"
import { getFirestoreUsageSummary } from "@/lib/firestore-usage"
import { FirestoreQuotaButton } from "./firestore-quota-button"

export const dynamic = "force-dynamic"

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Lagos",
  }).format(new Date(value))
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ full?: string }> | { full?: string }
} = {}) {
  try {
    const user = await getSessionUser();
  const session = user ? { user } : null
    if (!session?.user) redirect("/sign-in")

    const role = (session.user as { role?: string }).role ?? "learner"
    const isSuperAdmin = checkIsSuperAdmin(session.user)
    const orgWide = isSuperAdmin
    const canManageCourses = isSuperAdmin || role === "group_head" || role === "lead"

    if (!isSuperAdmin && role !== "lead" && role !== "group_head" && role !== "group_head_standard") {
      // Learners don't have a team view — send them to their own portal.
      redirect("/lms")
    }

    const params = await Promise.resolve(searchParams)
    if (isSuperAdmin && params?.full !== "1") {
      const firestoreUsage = await getFirestoreUsageSummary()
      const cacheStats = getCacheStats()

      return (
        <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
          <Link
            href="/lms"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to LMS
          </Link>

          <header className="mb-8 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                Team Learning Admin
              </h1>
              <Badge>Quota-safe view</Badge>
              <Link
                href="/lms/admin?full=1"
                className="ml-auto inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Load full learner report
              </Link>
            </div>
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
              This view avoids the expensive group-wide learner scan. Open the full report only
              when you need learner tables, course popularity, or CSV export.
            </p>
          </header>

          <section className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Firestore usage today</CardTitle>
              </CardHeader>
              <CardContent>
                {firestoreUsage.available ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { label: "Reads", metric: firestoreUsage.reads },
                      { label: "Writes", metric: firestoreUsage.writes },
                      { label: "Deletes", metric: firestoreUsage.deletes },
                    ].map(({ label, metric }) => (
                      <div key={label} className="rounded-md border p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{label}</span>
                          <span className="text-xs text-muted-foreground">{metric.percent}%</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold tabular-nums">
                          {metric.count.toLocaleString()}
                        </p>
                        <Progress value={Math.min(metric.percent, 100)} className="mt-3 h-1.5" />
                        <p className="mt-2 text-xs text-muted-foreground">
                          of {metric.quota.toLocaleString()} free daily quota
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm">
                      <p className="font-medium text-destructive">Usage metrics unavailable</p>
                      <p className="mt-2 text-muted-foreground">
                        {firestoreUsage.error ||
                          "Google Monitoring API requires billing for in-app usage metrics. You can bypass this using the server command below."}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex flex-col items-start gap-2 border-t pt-4">
                  <FirestoreQuotaButton />
                  <p className="text-xs text-muted-foreground">
                    Lagos reset window: {formatTime(firestoreUsage.resetAt)} to{" "}
                    {formatTime(firestoreUsage.measuredAt)}.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Firestore cache</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Hits", value: cacheStats.hits },
                    { label: "Misses", value: cacheStats.misses },
                    { label: "Pending", value: cacheStats.pending },
                    { label: "Errors", value: cacheStats.errors },
                  ].map((item) => (
                    <div key={item.label} className="rounded-md border p-3">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-xl font-semibold tabular-nums">
                        {item.value.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  These counters reset when the server process restarts.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="mb-8">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-heading text-base font-semibold">Need the full learner report?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This loads learner tables, course popularity, training value, and CSV export.
                  </p>
                </div>
                <Link
                  href="/lms/admin?full=1"
                  className="inline-flex shrink-0 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Open full learner report
                </Link>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {/* Existing - Create New Course */}
            <Link href="/lms/admin/courses/new" className="block">
              <Card className="transition-colors hover:bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-base">Create New Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Build a course without loading the full learner report.
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            {/* NEW - Manage Courses (the missing piece) */}
            <Link href="/lms/admin/courses" className="block">
              <Card className="transition-colors hover:bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-base">Manage Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Edit, duplicate, or delete existing courses. Quota-friendly view.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/lms/admin/sync" className="block">
              <Card className="transition-colors hover:bg-muted/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base">Hybrid Sync</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Push/Pull to Cloud.</p>
                </CardContent>
              </Card>
            </Link>
          </section>
        </main>
      )
    }

    const [report, firestoreUsage] = await Promise.all([
      getAdminReport(),
      isSuperAdmin ? getFirestoreUsageSummary() : Promise.resolve(null),
    ])
    const { totals } = report
    const cacheStats = isSuperAdmin ? getCacheStats() : null
    const completionRate =
      totals.enrollments > 0 ? Math.round((totals.completions / totals.enrollments) * 100) : 0

    const stats = [
      { label: orgWide ? "Learners (all)" : "Team members", value: totals.learners, icon: Users },
      { label: "Total enrollments", value: totals.enrollments, icon: BookOpen },
      { label: "Courses completed", value: totals.completions, icon: GraduationCap },
      { label: "Certificates issued", value: totals.certificates, icon: Award },
    ]

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <Link
        href="/lms"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to LMS
      </Link>

      <header className="mb-8 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
            Team Learning Admin
          </h1>
          <Badge variant={orgWide ? "default" : "secondary"}>
            {orgWide ? "Group-wide" : report.scope}
          </Badge>
          {canManageCourses && (
            <Link
              href="/lms/admin/courses/new"
              className="ml-auto inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create New Course
            </Link>
          )}
        </div>
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          {orgWide
            ? "Enrollment and completion across every EIB Group subsidiary."
            : `Enrollment and completion for ${report.scope}. You see only your subsidiary's learners.`}
        </p>
      </header>

      <Card className="mb-6 border-accent/40 bg-accent/5">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Training investment {orgWide ? "(group-wide)" : `(${report.scope})`}
            </p>
            <p className="mt-1 font-heading text-3xl font-bold tabular-nums">
              {formatNaira(totals.trainingValue)}
            </p>
          </div>
          <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
            Combined market value of all training enrolled in by your{" "}
            {orgWide ? "organization" : "team"}, fully sponsored by EIB Group.
          </p>
        </CardContent>
      </Card>

      <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="leading-tight">
                  <span className="block text-2xl font-bold tabular-nums">{s.value}</span>
                  <span className="block text-xs text-muted-foreground">{s.label}</span>
                </span>
              </CardContent>
            </Card>
          )
        })}
      </section>

      {isSuperAdmin && (
        <section className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Firestore usage today</CardTitle>
            </CardHeader>
            <CardContent>
              {firestoreUsage?.available ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { label: "Reads", metric: firestoreUsage.reads },
                    { label: "Writes", metric: firestoreUsage.writes },
                    { label: "Deletes", metric: firestoreUsage.deletes },
                  ].map(({ label, metric }) => (
                    <div key={label} className="rounded-md border p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{label}</span>
                        <span className="text-xs text-muted-foreground">{metric.percent}%</span>
                      </div>
                      <p className="mt-2 text-2xl font-bold tabular-nums">
                        {metric.count.toLocaleString()}
                      </p>
                      <Progress value={Math.min(metric.percent, 100)} className="mt-3 h-1.5" />
                      <p className="mt-2 text-xs text-muted-foreground">
                        of {metric.quota.toLocaleString()} free daily quota
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm">
                  <p className="font-medium text-destructive">Usage metrics unavailable</p>
                  <p className="mt-2 text-muted-foreground">
                    {firestoreUsage?.error ||
                      "Grant the Firebase service account Monitoring Viewer access on the eib-lms project."}
                  </p>
                </div>
              )}
              {firestoreUsage && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Lagos reset window: {formatTime(firestoreUsage.resetAt)} to{" "}
                  {formatTime(firestoreUsage.measuredAt)}.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Firestore cache</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Hits", value: cacheStats?.hits ?? 0 },
                  { label: "Misses", value: cacheStats?.misses ?? 0 },
                  { label: "Pending", value: cacheStats?.pending ?? 0 },
                  { label: "Errors", value: cacheStats?.errors ?? 0 },
                ].map((item) => (
                  <div key={item.label} className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums">
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                These counters reset when the server process restarts.
              </p>
            </CardContent>
          </Card>

          <Link href="/lms/admin/sync" className="block">
            <Card className="border-[var(--chart-2)] bg-[var(--chart-2)]/5 hover:bg-[var(--chart-2)]/10 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[var(--chart-2)]">Hybrid Sync</CardTitle>
                <Server className="h-4 w-4 text-[var(--chart-2)]" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-[var(--chart-2)]">Database Sync</div>
                <p className="text-xs text-muted-foreground">Push/Pull to Cloud</p>
              </CardContent>
            </Card>
          </Link>
        </section>
      )}

      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most popular courses</CardTitle>
          </CardHeader>
          <CardContent>
            {report.topCourses.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No enrollments yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {report.topCourses.map((c) => {
                  const pct = c.enrolled > 0 ? Math.round((c.completed / c.enrolled) * 100) : 0
                  return (
                    <li key={c.courseId} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium">{c.title}</span>
                        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                          {c.completed}/{c.enrolled} completed · {pct}%
                        </span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <CardTitle className="text-base">Learners</CardTitle>
              <span className="text-sm text-muted-foreground tabular-nums">
                {completionRate}% completion rate
              </span>
            </div>
            {isSuperAdmin && <ExportCsvButton />}
          </CardHeader>
          <CardContent>
            {report.learners.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No learners in scope yet.
              </p>
            ) : (
              <LearnerManagement 
                learners={report.learners} 
                orgWide={orgWide} 
                role={isSuperAdmin ? "admin" : role}
                currentUserId={session.user.id} 
              />
            )}
          </CardContent>
        </Card>
      </section>




    </main>
  )
  } catch (err: any) {
    console.error("LMS admin page failed:", err)
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <Card>
          <CardContent className="p-6">
            <h1 className="font-heading text-2xl font-bold">Admin dashboard temporarily unavailable</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The dashboard is online, but Firestore is currently rejecting database reads because
              its quota has been exhausted. Please try again after the quota resets, or enable
              billing on the Firebase project.
            </p>
            <div className="mt-5">
              <Link
                href="/lms"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> Back to LMS
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }
}
