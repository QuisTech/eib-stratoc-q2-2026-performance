import type { Metadata } from "next"
import { MonthCard } from "@/components/plan/month-card"
import { KpiTable } from "@/components/plan/kpi-table"
import { PrintActions } from "@/components/print-actions"
import { roadmap, planMeta } from "@/lib/plan-data"

export const metadata: Metadata = {
  title: "90-Day Roadmap | EIB Group Training & OD",
}

export default function RoadmapPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <header className="avoid-break flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {planMeta.title} · {planMeta.window}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold md:text-4xl">The 90-Day Roadmap</h1>
          <p className="mt-2 max-w-2xl text-pretty text-sm text-muted-foreground">
            A phased plan moving the Training Function from diagnosis to institutionalized performance
            improvement. Each initiative names its deliverable, its business impact, and — where applicable —
            the real subsidiary input that grounds it.
          </p>
        </div>
        <PrintActions label="roadmap" />
      </header>

      <div className="mt-8 space-y-6">
        {roadmap.map((m) => (
          <MonthCard key={m.month} plan={m} />
        ))}
      </div>

      <div className="mt-8">
        <KpiTable />
      </div>
    </main>
  )
}
