import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { PrintActions } from "@/components/print-actions"
import { GraduationCap, ArrowRight, MoveRight, CheckCircle2, Circle, Clock } from "lucide-react"
import { lmsVision, type LmsPhaseStatus } from "@/lib/plan-data"

export const metadata: Metadata = {
  title: "LMS Vision & Roadmap | EIB Group Training & OD",
  description:
    "How the EIB Group Training intelligence dashboard evolves into a full Learning Management System — phase by phase, building on data already captured.",
}

const statusMeta: Record<
  LmsPhaseStatus,
  { cls: string; dot: string; Icon: typeof CheckCircle2 }
> = {
  "Live now": {
    cls: "bg-[var(--chart-1)] text-background",
    dot: "var(--chart-1)",
    Icon: CheckCircle2,
  },
  Next: { cls: "bg-accent text-accent-foreground", dot: "var(--accent)", Icon: Clock },
  Planned: { cls: "bg-secondary text-secondary-foreground", dot: "var(--chart-3)", Icon: Circle },
  Future: { cls: "bg-muted text-muted-foreground", dot: "var(--muted-foreground)", Icon: Circle },
}

export default function LmsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <GraduationCap className="h-4 w-4 text-accent" /> Learning Management System
          </p>
          <h1 className="mt-2 text-balance font-heading text-3xl font-bold md:text-4xl">
            {lmsVision.headline}
          </h1>
          <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
            {lmsVision.intro}
          </p>
        </div>
        <PrintActions label="LMS vision" />
      </div>

      {/* The bridge: what we have → what it becomes */}
      <section className="mt-8">
        <h2 className="font-heading text-xl font-bold">What We Already Have Becomes the LMS</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Nothing built so far is wasted — each asset maps directly onto a core LMS capability.
        </p>
        <div className="mt-4 grid gap-3">
          {lmsVision.bridge.map((b) => (
            <Card key={b.have} className="avoid-break">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Today
                  </p>
                  <p className="text-sm font-medium">{b.have}</p>
                </div>
                <MoveRight className="hidden h-5 w-5 shrink-0 text-accent sm:block" aria-hidden />
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                    In the LMS
                  </p>
                  <p className="text-sm font-medium">{b.becomes}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Phased maturity roadmap */}
      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold">The Build Path</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each phase is independently useful — we ship value continuously, not in one big bang.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          {lmsVision.phases.map((p) => {
            const meta = statusMeta[p.status]
            const StatusIcon = meta.Icon
            return (
              <Card
                key={p.phase}
                className="avoid-break overflow-hidden"
                style={{ borderLeft: `4px solid ${meta.dot}` }}
              >
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-md font-heading text-sm font-bold"
                        style={{
                          backgroundColor: `color-mix(in oklch, ${meta.dot} 18%, transparent)`,
                          color: meta.dot,
                        }}
                      >
                        {p.phase.replace("Phase ", "P")}
                      </span>
                      <div>
                        <CardTitle className="font-heading text-base">{p.title}</CardTitle>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {p.phase}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.cls}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" /> {p.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {p.summary}
                  </p>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2 text-sm">
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0"
                          style={{ color: meta.dot }}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-md bg-muted/50 p-3 text-sm">
                    <span className="font-semibold text-foreground">Unlocks: </span>
                    <span className="text-muted-foreground">{p.unlocks}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* What's needed note */}
      <section className="mt-8">
        <Card className="avoid-break bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <h3 className="font-heading text-lg font-semibold">Ready to start Phase 1?</h3>
            <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/80">
              Phase 1 adds the first real LMS building blocks — user accounts and roles, plus a
              course catalog mapped to the skill-gap matrix. It needs a secure database,
              authentication, and file storage, which can be added when you give the go-ahead. We
              build it incrementally so every phase is usable on its own.
            </p>
            <div className="no-print mt-5 flex flex-wrap gap-3">
              <Link href="/strategy" className={buttonVariants({ variant: "secondary", size: "sm" })}>
                Back to strategy
              </Link>
              <Link href="/input" className={buttonVariants({ variant: "default", size: "sm" })}>
                See the skill-gap data <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
