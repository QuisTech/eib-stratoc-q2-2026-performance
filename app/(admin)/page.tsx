import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { PrintActions } from "@/components/print-actions"
import { KpiTable } from "@/components/plan/kpi-table"
import {
  ArrowRight,
  Target,
  CheckCircle2,
  Building2,
  Settings2,
  TrendingUp,
  CalendarRange,
} from "lucide-react"
import {
  planMeta,
  strategicGoal,
  objectives,
  roadmap,
  outcomes,
  executiveSummary,
  submissionStats,
} from "@/lib/plan-data"

export default function OverviewPage() {
  const outcomeGroups = [
    { title: "Organizational", icon: Building2, items: outcomes.organizational, accent: "var(--chart-2)" },
    { title: "Operational", icon: Settings2, items: outcomes.operational, accent: "var(--chart-3)" },
    { title: "Financial / ROI", icon: TrendingUp, items: outcomes.financial, accent: "var(--chart-1)" },
  ]

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Hero */}
      <section className="avoid-break overflow-hidden rounded-xl border bg-primary text-primary-foreground">
        <div className="px-6 py-10 md:px-10 md:py-12">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground/70">
            {planMeta.office}
          </p>
          <h1 className="mt-3 max-w-3xl text-balance font-heading text-3xl font-bold leading-tight md:text-5xl">
            {planMeta.title}
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-sm text-primary-foreground/80 md:text-base">
            {planMeta.tagline}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
              <CalendarRange className="h-3.5 w-3.5" /> {planMeta.window}
            </span>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              {planMeta.horizonDays}-Day Horizon
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> {submissionStats.submitted} subsidiary submissions received
            </span>
          </div>
          <div className="no-print mt-7 flex flex-wrap gap-3">
            <Link href="/roadmap" className={buttonVariants({ variant: "default", size: "sm" })}>
              View 90-day roadmap <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/input" className={buttonVariants({ variant: "secondary", size: "sm" })}>
              Subsidiary input
            </Link>
            <PrintActions label="strategic plan" />
          </div>
        </div>
      </section>

      {/* Strategic goal + objectives */}
      <section className="mt-8 grid gap-6 lg:grid-cols-5">
        <Card className="avoid-break lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Target className="h-5 w-5 text-accent" /> Strategic Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-pretty leading-relaxed text-muted-foreground">{strategicGoal}</p>
          </CardContent>
        </Card>

        <Card className="avoid-break lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-heading">Key Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 sm:grid-cols-2">
              {objectives.map((o) => (
                <li key={o} className="flex gap-2.5 text-sm leading-relaxed">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--chart-1)]" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Roadmap snapshot */}
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-semibold">The 90-Day Roadmap</h2>
            <p className="text-sm text-muted-foreground">
              Three phases, nine initiatives — each tied to measurable business impact.
            </p>
          </div>
          <Link
            href="/roadmap"
            className="no-print text-sm font-medium text-accent-foreground hover:underline"
          >
            Full detail →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {roadmap.map((m) => {
            const accent =
              m.month === 1 ? "var(--chart-2)" : m.month === 2 ? "var(--chart-3)" : "var(--chart-1)"
            return (
              <Card key={m.month} className="avoid-break">
                <CardHeader className="gap-1">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-md font-heading font-bold text-background"
                    style={{ backgroundColor: accent }}
                  >
                    {m.month}
                  </span>
                  <CardTitle className="mt-2 font-heading text-base">{m.phase}</CardTitle>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{m.window}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {m.initiatives.map((i) => (
                      <li key={i.n} className="flex gap-2">
                        <span className="font-semibold" style={{ color: accent }}>
                          {i.n}
                        </span>
                        <span className="leading-snug">{i.title}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* KPI targets */}
      <section className="mt-8">
        <KpiTable />
      </section>

      {/* Expected outcomes */}
      <section className="mt-8">
        <h2 className="mb-4 font-heading text-2xl font-semibold">Expected Outcomes After 90 Days</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {outcomeGroups.map((g) => {
            const Icon = g.icon
            return (
              <Card key={g.title} className="avoid-break">
                <CardHeader className="gap-1">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-md"
                    style={{ backgroundColor: `color-mix(in oklch, ${g.accent} 15%, transparent)` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: g.accent }} />
                  </span>
                  <CardTitle className="mt-2 font-heading text-base">{g.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {g.items.map((it) => (
                      <li key={it} className="flex gap-2">
                        <span aria-hidden style={{ color: g.accent }}>
                          •
                        </span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Executive summary */}
      <section className="mt-8">
        <Card className="avoid-break border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle className="font-heading">Executive Summary for Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-pretty leading-relaxed text-muted-foreground">{executiveSummary}</p>
            <p className="rounded-md bg-muted/60 p-4 text-sm italic leading-relaxed">
              {planMeta.positioning}
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
