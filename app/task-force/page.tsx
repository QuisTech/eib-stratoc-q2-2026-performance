import { Mail, CalendarClock, Target, CheckCircle2, Clock, MinusCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PrintActions } from "@/components/print-actions"
import { SubmissionCard } from "@/components/task-force/submission-card"
import { taskForce, submissions, subsidiaries } from "@/lib/report-data"

export const metadata = {
  title: "Performance Improvement Task Force · 90-Day Plan",
}

const submittedCount = submissions.filter((s) => s.state === "Submitted").length
const noChallengeCount = submissions.filter((s) => s.state === "No challenges").length
const awaitingCount = submissions.filter((s) => s.state === "Awaiting").length
const responded = submittedCount + noChallengeCount

const stats = [
  { label: "Inputs Received", value: `${responded}/${subsidiaries.length}`, Icon: CheckCircle2, cls: "text-[var(--chart-1)]" },
  { label: "Detailed Submissions", value: submittedCount, Icon: Target, cls: "text-[var(--chart-2)]" },
  { label: "No Challenges Reported", value: noChallengeCount, Icon: MinusCircle, cls: "text-[var(--chart-3)]" },
  { label: "Awaiting Response", value: awaitingCount, Icon: Clock, cls: "text-[var(--chart-4)]" },
]

// Submitted first, then no-challenge, then awaiting
const order = { Submitted: 0, "No challenges": 1, Awaiting: 2 }
const sorted = [...submissions].sort((a, b) => order[a.state] - order[b.state])

export default function TaskForcePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <section className="mb-8 overflow-hidden rounded-xl border border-border bg-sidebar text-sidebar-foreground">
        <div className="flex flex-col gap-5 p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-2">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sidebar-border bg-sidebar-accent px-3 py-1 text-xs font-medium tracking-wide">
                {taskForce.horizonDays}-Day Strategic Plan
              </span>
              <h1 className="text-balance font-heading text-3xl font-bold leading-tight">
                {taskForce.title}
              </h1>
              <p className="max-w-2xl text-pretty text-sm text-sidebar-foreground/75">{taskForce.mandate}</p>
            </div>
            <PrintActions label="tracker" />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-sidebar-border pt-4 text-sm">
            <span className="flex items-center gap-2 text-sidebar-foreground/80">
              <CalendarClock className="h-4 w-4 text-accent" /> Deadline: {taskForce.deadline}
            </span>
            <span className="flex items-center gap-2 text-sidebar-foreground/80">
              <Mail className="h-4 w-4 text-accent" /> {taskForce.contactEmail}
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.Icon
          return (
            <Card key={s.label} className="avoid-break">
              <CardContent className="flex flex-col gap-2 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </span>
                  <Icon className={`h-5 w-5 ${s.cls}`} />
                </div>
                <span className="font-heading text-3xl font-bold text-foreground">{s.value}</span>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Requested inputs */}
      <Card className="mt-6 avoid-break">
        <CardContent className="p-5">
          <h2 className="mb-3 font-heading text-base font-semibold text-foreground">Requested from each member</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {taskForce.requested.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent-foreground">
                  {i + 1}
                </span>
                {r}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submissions */}
      <h2 className="mb-4 mt-8 font-heading text-xl font-bold text-foreground">Subsidiary Submissions</h2>
      <div className="flex flex-col gap-4">
        {sorted.map((s) => (
          <SubmissionCard key={s.subsidiary} s={s} />
        ))}
      </div>
    </main>
  )
}
