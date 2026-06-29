import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PrintActions } from "@/components/print-actions"
import { SubmissionCard } from "@/components/task-force/submission-card"
import { StateBadge } from "@/components/state-badge"
import { taskForce, submissions, submissionStats, planMeta } from "@/lib/plan-data"
import { Mail, CalendarClock } from "lucide-react"

export const metadata: Metadata = {
  title: "Subsidiary Input | EIB Group Performance Improvement Task Force",
}

const rank: Record<string, number> = {
  Submitted: 0,
  "No challenges": 1,
  Pending: 2,
  Redacted: 3,
  "No response": 4,
  "Not applicable": 5,
  Morphed: 6,
}

export default function InputPage() {
  const ordered = [...submissions].sort((a, b) => rank[a.state] - rank[b.state])

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
        <span className="font-semibold text-foreground">{submissionStats.pending}</span> pending/redacted, and{" "}
        <span className="font-semibold text-foreground">{submissionStats.noResponse}</span> with no response.
      </p>

      {/* Full Task Force composition */}
      <Card className="avoid-break mt-6">
        <CardHeader>
          <CardTitle className="font-heading text-base">Task Force Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Representative</TableHead>
                  <TableHead>Subsidiary</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead className="hidden w-[130px] sm:table-cell">Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordered.map((s, i) => (
                  <TableRow key={s.subsidiary}>
                    <TableCell className="text-sm text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="text-sm font-medium">{s.representative}</TableCell>
                    <TableCell className="text-sm">{s.subsidiary}</TableCell>
                    <TableCell>
                      <StateBadge state={s.state} />
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                      {s.detail}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Deep-dive cards */}
      <h2 className="mt-8 font-heading text-xl font-bold">Subsidiary Deep-Dive</h2>
      <div className="mt-4 grid gap-5 md:grid-cols-2">
        {ordered.map((s) => (
          <SubmissionCard key={s.subsidiary} s={s} />
        ))}
      </div>
    </main>
  )
}
