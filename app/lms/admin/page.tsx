import Link from "next/link"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getAdminReport } from "@/app/actions/lms"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatNaira } from "@/lib/utils"
import { ArrowLeft, Users, BookOpen, GraduationCap, Award, Edit } from "lucide-react"

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
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const role = (session.user as { role?: string }).role ?? "learner"
  const orgWide = role === "admin" || role === "group_head"
  if (!orgWide && role !== "lead") {
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
          {orgWide && (
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

      <section className="mb-8">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Learners</CardTitle>
            <span className="text-sm text-muted-foreground tabular-nums">
              {completionRate}% completion rate
            </span>
          </CardHeader>
          <CardContent>
            {report.learners.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No learners in scope yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Learner</th>
                      {orgWide && <th className="px-3 py-2 font-medium">Subsidiary</th>}
                      <th className="px-3 py-2 text-center font-medium">Enrolled</th>
                      <th className="px-3 py-2 text-center font-medium">In progress</th>
                      <th className="px-3 py-2 text-center font-medium">Completed</th>
                      <th className="px-3 py-2 text-center font-medium">Certs</th>
                      <th className="px-3 py-2 font-medium">Avg progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.learners.map((l) => (
                      <tr key={l.id} className="border-b last:border-0">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                              {initials(l.name)}
                            </span>
                            <span className="leading-tight">
                              <span className="block font-medium">{l.name}</span>
                              <span className="block text-xs text-muted-foreground">{l.email}</span>
                            </span>
                            {l.role !== "learner" && (
                              <Badge variant="outline" className="ml-1 text-[10px] capitalize">
                                {l.role}
                              </Badge>
                            )}
                          </div>
                        </td>
                        {orgWide && (
                          <td className="px-3 py-3 text-muted-foreground">{l.subsidiary ?? "—"}</td>
                        )}
                        <td className="px-3 py-3 text-center tabular-nums">{l.enrolled}</td>
                        <td className="px-3 py-3 text-center tabular-nums">{l.inProgress}</td>
                        <td className="px-3 py-3 text-center tabular-nums">{l.completed}</td>
                        <td className="px-3 py-3 text-center tabular-nums">{l.certificates}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <Progress value={l.avgProgress} className="h-1.5 w-24" />
                            <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
                              {l.avgProgress}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
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

      {orgWide && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course Management</CardTitle>
            </CardHeader>
            <CardContent>
              {report.allCourses.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No courses exist yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-3 py-2 font-medium">Course Title</th>
                        <th className="px-3 py-2 font-medium">Category</th>
                        <th className="px-3 py-2 font-medium">Price</th>
                        <th className="px-3 py-2 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.allCourses.map((c) => (
                        <tr key={c.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="px-3 py-3 font-medium">{c.title}</td>
                          <td className="px-3 py-3 text-muted-foreground">{c.category}</td>
                          <td className="px-3 py-3 tabular-nums">{formatNaira(c.priceNaira)}</td>
                          <td className="px-3 py-3 text-right space-x-2">
                            <Link
                              href={`/lms/admin/courses/${c.slug}/edit`}
                              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                              <Edit className="h-3.5 w-3.5" /> Edit Metadata
                            </Link>
                            <Link
                              href={`/lms/admin/courses/${c.slug}/builder`}
                              className="inline-flex items-center gap-1.5 rounded-md border border-primary bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground"
                            >
                              <BookOpen className="h-3.5 w-3.5" /> Build Content
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </main>
  )
}
