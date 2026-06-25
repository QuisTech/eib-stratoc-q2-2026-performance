import Link from "next/link"
import { ArrowRight, AlertTriangle, CheckCircle2, Minus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { PrintActions } from "@/components/print-actions"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import {
  ComplianceDonut,
  SubmissionBarChart,
  TrendChart,
} from "@/components/dashboard/compliance-charts"
import { SubsidiaryTable } from "@/components/dashboard/subsidiary-table"
import { ImplementationProgress } from "@/components/dashboard/implementation-progress"
import { interventions, summaryRatings, reportMeta } from "@/lib/report-data"

const toneIcon = {
  good: { Icon: CheckCircle2, cls: "text-[var(--chart-1)]" },
  warn: { Icon: AlertTriangle, cls: "text-[oklch(0.55_0.12_70)]" },
  bad: { Icon: Minus, cls: "text-[var(--chart-4)]" },
}

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Hero */}
      <section className="mb-8 overflow-hidden rounded-xl border border-border bg-sidebar text-sidebar-foreground">
        <div className="flex flex-col gap-5 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sidebar-border bg-sidebar-accent px-3 py-1 text-xs font-medium tracking-wide">
              {reportMeta.classification} · {reportMeta.period}
            </span>
            <h1 className="text-balance font-heading text-3xl font-bold leading-tight md:text-4xl">
              Group Training &amp; OD Performance Evaluation
            </h1>
            <p className="max-w-2xl text-pretty text-sm text-sidebar-foreground/75">
              Consolidated training delivery, compliance, and capacity-building performance across all eleven EIB Group
              subsidiaries. Prepared for the {reportMeta.to} · {reportMeta.date}.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <PrintActions label="dashboard" />
            <Link href="/report" className={buttonVariants({ variant: "secondary", size: "sm" })}>
              Open full report <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <KpiCards />

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ComplianceDonut />
        <SubmissionBarChart />
        <TrendChart />
      </div>

      {/* Subsidiary table */}
      <div className="mt-6">
        <SubsidiaryTable />
      </div>

      {/* Progress + interventions */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ImplementationProgress />
        <Card className="avoid-break">
          <CardHeader>
            <CardTitle>Areas Requiring Management Intervention</CardTitle>
            <CardDescription>Escalations recommended to the EVP</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {interventions.map((i) => (
              <div key={i.area} className="rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.55_0.12_70)]" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{i.area}</span>
                    <p className="text-xs leading-relaxed text-muted-foreground">{i.details}</p>
                    <p className="text-xs leading-relaxed text-foreground">
                      <span className="font-medium">Action: </span>
                      {i.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Summary ratings */}
      <Card className="mt-6 avoid-break">
        <CardHeader>
          <CardTitle>Q2 2026 Performance Summary</CardTitle>
          <CardDescription>Management review ratings by focus area</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {summaryRatings.map((r) => {
            const { Icon, cls } = toneIcon[r.tone as keyof typeof toneIcon] ?? toneIcon.good
            return (
              <div
                key={r.area}
                className="flex items-start justify-between gap-3 rounded-lg border border-border p-4"
              >
                <span className="text-sm font-medium text-foreground">{r.area}</span>
                <span className={`flex shrink-0 items-center gap-1.5 text-xs font-semibold ${cls}`}>
                  <Icon className="h-4 w-4" />
                  <span className="max-w-[10rem] text-right">{r.rating}</span>
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </main>
  )
}
