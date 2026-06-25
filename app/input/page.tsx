import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PrintActions } from "@/components/print-actions"
import { SubmissionCard } from "@/components/task-force/submission-card"
import { taskForce, submissions, submissionStats, planMeta } from "@/lib/plan-data"
import { Mail, CalendarClock } from "lucide-react"

export const metadata: Metadata = {
  title: "Subsidiary Input | EIB Group Performance Improvement Task Force",
}

export default function InputPage() {
  const ordered = [...submissions].sort((a, b) => {
    const rank = { Submitted: 0, "No challenges": 1, Awaiting: 2 } as const
    return rank[a.state] - rank[b.state]
  })

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <header className="avoid-break border-b pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {taskForce.title}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold md:text-4xl">Consolidated Subsidiary Input</h1>
        <p className="mt-2 max-w-3xl text-pretty text-sm text-muted-foreground">
          {taskForce.mandate} These submissions are the real operational evidence that validates the{" "}
          {planMeta.horizonDays}-day plan against actual needs.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock className="h-4 w-4" /> Submission deadline: {taskForce.deadline}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Mail className="h-4 w-4" /> {taskForce.contactEmail}
          </span>
        </div>
        <div className="no-print mt-4">
          <PrintActions label="subsidiary input" />
        </div>
      </header>

      {/* Requested format */}
      <Card className="avoid-break mt-6 bg-muted/40">
        <CardHeader>
          <CardTitle className="font-heading text-base">What each representative was asked to submit</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {taskForce.requested.map((r, i) => (
              <li key={r} className="flex gap-2">
                <span className="font-semibold text-foreground">{i + 1}.</span>
                {r}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Status line */}
      <p className="mt-6 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{submissionStats.submitted}</span> detailed submissions,{" "}
        <span className="font-semibold text-foreground">{submissionStats.noChallenges}</span> reported no challenges,{" "}
        and <span className="font-semibold text-foreground">{submissionStats.awaiting}</span> awaiting response.
      </p>

      <div className="mt-4 grid gap-5 md:grid-cols-2">
        {ordered.map((s) => (
          <SubmissionCard key={s.subsidiary} s={s} />
        ))}
      </div>
    </main>
  )
}
