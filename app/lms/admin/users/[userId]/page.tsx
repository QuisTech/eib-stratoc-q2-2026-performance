import { getSessionUser } from "@/app/actions/auth"
import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { headers } from "next/headers"
import { getAdminUserDetail } from "@/app/actions/lms"
import { formatNaira } from "@/lib/utils"
import { isSuperAdminEmail } from "@/lib/access-control"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  BookOpen,
  Activity,
  Award,
  CheckCircle2,
  Clock,
  GraduationCap,
  Mail,
  Building2,
  CalendarDays,
  FileText,
  HelpCircle,
  Trophy,
} from "lucide-react"

export const dynamic = "force-dynamic"

type Params = { userId: string }

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function fmtDate(d: Date | string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function fmtDateTime(d: Date | string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function statusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/25 hover:bg-emerald-500/25">Completed</Badge>
    case "in_progress":
      return <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/25 hover:bg-amber-500/25">In Progress</Badge>
    default:
      return <Badge variant="secondary">Enrolled</Badge>
  }
}

const eventIcons = {
  enrollment: BookOpen,
  lesson: FileText,
  quiz: HelpCircle,
  certificate: Trophy,
}

const eventColors = {
  enrollment: "text-blue-500 bg-blue-500/10",
  lesson: "text-emerald-500 bg-emerald-500/10",
  quiz: "text-amber-500 bg-amber-500/10",
  certificate: "text-purple-500 bg-purple-500/10",
}

export default async function UserDetailPage({ params }: { params: Promise<Params> }) {
  const { userId } = await params

  try {
    const user = await getSessionUser();
  const session = user ? { user } : null
    if (!session?.user) redirect("/sign-in")

    const role = (session.user as { role?: string }).role ?? "learner"
    const isSuperAdmin = isSuperAdminEmail(session.user.email)
    if (!isSuperAdmin && role !== "group_head" && role !== "lead" && role !== "group_head_standard") {
      redirect("/lms")
    }

    const detail = await getAdminUserDetail(userId).catch(() => null)
    if (!detail) {
      notFound()
    }

    const stats = [
      { label: "Enrolled", value: detail.totals?.enrolled ?? 0, icon: BookOpen },
      { label: "In progress", value: detail.totals?.inProgress ?? 0, icon: Activity },
      { label: "Completed", value: detail.totals?.completed ?? 0, icon: GraduationCap },
      { label: "Certificates", value: detail.totals?.certificates ?? 0, icon: Award },
    ]

    return (
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <Link
          href="/lms/admin"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Team Admin
        </Link>

        {/* ── User Header ── */}
        <Card className="mb-8">
          <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
              {initials(detail.name)}
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl font-bold tracking-tight">{detail.name}</h1>
                <Badge variant="outline" className="capitalize">{detail.role}</Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {detail.email}
                </span>
                {detail.subsidiary && (
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" /> {detail.subsidiary}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> Member since {fmtDate(detail.createdAt)}
                </span>
              </div>
            </div>
            {detail.totals.trainingValue > 0 && (
              <div className="shrink-0 text-right">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Training value</p>
                <p className="font-heading text-2xl font-bold tabular-nums">{formatNaira(detail.totals.trainingValue)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Summary Stats ── */}
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

        {/* ── Average Progress ── */}
        <Card className="mb-8 border-accent/40 bg-accent/5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Overall average progress</p>
              <Progress value={detail.totals.avgProgress} className="mt-2 h-2.5" />
            </div>
            <span className="font-heading text-3xl font-bold tabular-nums">{detail.totals.avgProgress}%</span>
          </CardContent>
        </Card>

        {/* ── Course Activity Table ── */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {detail.enrollments.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  This user has not enrolled in any courses yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-3 py-2 font-medium">Course</th>
                        <th className="px-3 py-2 font-medium">Status</th>
                        <th className="px-3 py-2 font-medium">Progress</th>
                        <th className="px-3 py-2 text-center font-medium">Lessons</th>
                        <th className="px-3 py-2 text-center font-medium">Quiz</th>
                        <th className="px-3 py-2 text-center font-medium">Cert</th>
                        <th className="px-3 py-2 font-medium">Enrolled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.enrollments.map((e) => {
                        const quizPct =
                          e.bestQuizScore !== null && e.bestQuizTotal !== null && e.bestQuizTotal > 0
                            ? Math.round((e.bestQuizScore / e.bestQuizTotal) * 100)
                            : null
                        return (
                          <tr key={e.courseId} className="border-b last:border-0 hover:bg-muted/50">
                            <td className="px-3 py-3">
                              <Link
                                href={`/lms/${e.courseSlug}`}
                                className="font-medium text-foreground hover:text-primary hover:underline"
                              >
                                {e.courseTitle}
                              </Link>
                              <span className="ml-2 text-xs text-muted-foreground">{e.courseCategory}</span>
                            </td>
                            <td className="px-3 py-3">{statusBadge(e.status)}</td>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2">
                                <Progress value={e.progress} className="h-1.5 w-20" />
                                <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
                                  {e.progress}%
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-center tabular-nums">
                              {e.lessonsTotal > 0 ? (
                                <span className={e.lessonsCompleted === e.lessonsTotal ? "text-emerald-600 font-medium" : ""}>
                                  {e.lessonsCompleted}/{e.lessonsTotal}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-3 py-3 text-center tabular-nums">
                              {quizPct !== null ? (
                                <span className={e.quizPassed ? "text-emerald-600 font-medium" : "text-amber-600"}>
                                  {quizPct}% {e.quizPassed ? "✓" : ""}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {e.hasCertificate ? (
                                <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="px-3 py-3 text-xs text-muted-foreground tabular-nums">
                              {fmtDate(e.enrolledAt)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ── Activity Timeline ── */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {detail.activity.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No activity recorded yet.
                </p>
              ) : (
                <div className="relative space-y-0">
                  {detail.activity.slice(0, 30).map((evt, i) => {
                    const Icon = eventIcons[evt.type as keyof typeof eventIcons]
                    const color = eventColors[evt.type as keyof typeof eventColors]
                    return (
                      <div key={i} className="flex gap-4 py-3 border-b last:border-0">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight">{evt.label}</p>
                          <p className="text-xs text-muted-foreground truncate">{evt.detail}</p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                          {fmtDateTime(evt.timestamp)}
                        </span>
                      </div>
                    )
                  })}
                  {detail.activity.length > 30 && (
                    <p className="pt-3 text-center text-xs text-muted-foreground">
                      Showing 30 of {detail.activity.length} events
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    )
  } catch (err: any) {
    if (err?.digest?.includes("NEXT_NOT_FOUND")) throw err
    if (err?.digest?.includes("NEXT_REDIRECT")) throw err
    return (
      <div className="p-8 font-mono text-red-500 whitespace-pre-wrap">
        <h1 className="text-xl font-bold">Error loading user detail:</h1>
        <p className="mt-4">{err.message}</p>
      </div>
    )
  }
}
