import { getSessionUser } from "@/app/actions/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

import { getAdminReport } from "@/app/actions/lms"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatNaira } from "@/lib/utils"
import { ArrowLeft, Users, BookOpen, GraduationCap, Award, Edit, Server } from "lucide-react"
import { ResetPasswordButton } from "./reset-password-button"
import { DeleteUserButton } from "./delete-user-button"
import { ExportCsvButton } from "./export-csv-button"
import { ResetQuizAttemptsButton } from "./reset-quiz-attempts-button"
import { LearnerManagement } from "./learner-management"
import { CourseManagement } from "./course-management"
import { isSuperAdminEmail } from "@/lib/access-control"

export const dynamic = "force-dynamic"

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export default async function AdminPage() {
  try {
    const user = await getSessionUser();
  const session = user ? { user } : null
    if (!session?.user) redirect("/sign-in")

    const role = (session.user as { role?: string }).role ?? "learner"
    const isSuperAdmin = isSuperAdminEmail(session.user.email)
    const orgWide = isSuperAdmin
    const canManageCourses = isSuperAdmin || role === "group_head" || role === "lead"

    if (!isSuperAdmin && role !== "lead" && role !== "group_head" && role !== "group_head_standard") {
      // Learners don't have a team view — send them to their own portal.
      redirect("/lms")
    }

    const report = await getAdminReport()
    const { totals } = report
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
        <section className="mb-8">
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



      {canManageCourses && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseManagement courses={report.allCourses} userRole={report.viewerRole} userEmail={session.user.email} />
            </CardContent>
          </Card>
        </section>
      )}
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
