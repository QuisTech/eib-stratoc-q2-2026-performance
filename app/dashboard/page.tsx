import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PrintActions } from "@/components/print-actions"
import {
  SubmissionDonut,
  ChallengeThemesChart,
  KpiTargetChart,
} from "@/components/dashboard/plan-charts"
import { KpiTable } from "@/components/plan/kpi-table"
import { submissionStats, planMeta } from "@/lib/plan-data"
import { Users, CheckCircle2, Clock, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "ROI Dashboard | EIB Group Training & OD",
}

const stats = [
  {
    label: "Representatives",
    value: submissionStats.total,
    icon: Users,
    accent: "var(--chart-2)",
    sub: "One per subsidiary",
  },
  {
    label: "Submitted",
    value: submissionStats.submitted,
    icon: CheckCircle2,
    accent: "var(--chart-1)",
    sub: "Detailed input received",
  },
  {
    label: "No challenges",
    value: submissionStats.noChallenges,
    icon: ShieldCheck,
    accent: "var(--chart-2)",
    sub: "Reported nil",
  },
  {
    label: "Awaiting",
    value: submissionStats.awaiting,
    icon: Clock,
    accent: "var(--chart-3)",
    sub: "Follow-up required",
  },
]

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <header className="avoid-break flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {planMeta.title} · {planMeta.window}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold md:text-4xl">ROI &amp; Performance Dashboard</h1>
          <p className="mt-2 max-w-2xl text-pretty text-sm text-muted-foreground">
            Live tracking of the inputs and targets that demonstrate measurable value from the 90-day plan.
          </p>
        </div>
        <PrintActions label="dashboard" />
      </header>

      {/* Stat cards */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="avoid-break">
              <CardContent className="flex items-center gap-4 pt-6">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md"
                  style={{ backgroundColor: `color-mix(in oklch, ${s.accent} 15%, transparent)` }}
                >
                  <Icon className="h-5 w-5" style={{ color: s.accent }} />
                </span>
                <div>
                  <p className="font-heading text-2xl font-bold leading-none">{s.value}</p>
                  <p className="mt-1 text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      {/* Charts */}
      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <SubmissionDonut />
        <ChallengeThemesChart />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <KpiTargetChart />
      </section>

      {/* KPI detail table */}
      <section className="mt-6">
        <KpiTable />
      </section>

      <Card className="avoid-break mt-6 border-l-4 border-l-accent">
        <CardHeader>
          <CardTitle className="font-heading text-base">How this demonstrates ROI</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The dashboard converts qualitative subsidiary input into trackable metrics. Recurring challenge
            themes prioritize where training spend will have the greatest operational effect, while the KPI
            targets give management a single, monthly view of participation, competency, service quality,
            error reduction, and staff readiness — proving that every intervention ties back to business value.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
