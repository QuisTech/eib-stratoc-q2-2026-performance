import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { PrintActions } from "@/components/print-actions"
import {
  Compass,
  Target,
  ListChecks,
  CalendarRange,
  Quote,
  CheckCircle2,
  Flag,
  Eye,
  ArrowRight,
  GraduationCap,
} from "lucide-react"
import { strategy, objectives, planMeta } from "@/lib/plan-data"

export const metadata: Metadata = {
  title: "Strategic Plan | EIB Group Training & OD",
  description:
    "The EIB Group Training & OD strategic plan stated in the language executives expect: one goal, measurable objectives, and a phased path to a permanent capability system.",
}

const pillarIcons = [Target, ListChecks, CalendarRange]

export default function StrategyPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Compass className="h-4 w-4 text-accent" /> {planMeta.group} · Strategic Plan
          </p>
          <h1 className="mt-2 text-balance font-heading text-3xl font-bold md:text-4xl">
            The Strategy, in One Page
          </h1>
          <p className="mt-2 max-w-2xl text-pretty text-muted-foreground">
            Everything leadership keeps asking for — the goal, the objectives, and the path — stated
            the way executives expect to hear it.
          </p>
        </div>
        <PrintActions label="strategic plan" />
      </div>

      {/* The one-liner */}
      <Card className="avoid-break mt-6 overflow-hidden border-0 bg-primary text-primary-foreground">
        <CardContent className="flex gap-4 p-6 md:p-8">
          <Quote className="hidden h-8 w-8 shrink-0 text-accent sm:block" aria-hidden />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/60">
              If you only say one thing
            </p>
            <p className="mt-2 text-pretty font-heading text-lg leading-relaxed md:text-2xl">
              {strategy.oneLiner}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Three pillars */}
      <section className="mt-8">
        <h2 className="font-heading text-xl font-bold">The Three Questions Every Executive Asks</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {strategy.pillars.map((p, i) => {
            const Icon = pillarIcons[i]
            return (
              <Card key={p.label} className="avoid-break flex flex-col">
                <CardHeader className="gap-1">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/15 text-accent-foreground">
                    <Icon className="h-5 w-5 text-accent" />
                  </span>
                  <CardTitle className="mt-2 font-heading text-base">{p.label}</CardTitle>
                  <p className="text-sm italic text-muted-foreground">{p.question}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-pretty text-sm leading-relaxed">{p.statement}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="avoid-break border-l-4 border-l-[var(--chart-2)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-base">
              <Flag className="h-5 w-5 text-[var(--chart-2)]" /> Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-pretty leading-relaxed text-muted-foreground">{strategy.mission}</p>
          </CardContent>
        </Card>
        <Card className="avoid-break border-l-4 border-l-[var(--chart-1)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-base">
              <Eye className="h-5 w-5 text-[var(--chart-1)]" /> Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-pretty leading-relaxed text-muted-foreground">{strategy.vision}</p>
          </CardContent>
        </Card>
      </section>

      {/* Objectives */}
      <section className="mt-8">
        <Card className="avoid-break">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Measurable Objectives</CardTitle>
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

      {/* Why this is a strategy, not a to-do list */}
      <section className="mt-8">
        <Card className="avoid-break bg-muted/40">
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              Why This Is a Strategy — Not a To-Do List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 md:grid-cols-2">
              {strategy.principles.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm leading-relaxed">
                  <span
                    aria-hidden
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Next steps */}
      <section className="no-print mt-8 flex flex-wrap gap-3">
        <Link href="/roadmap" className={buttonVariants({ variant: "default", size: "sm" })}>
          See the 90-day roadmap <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <Link href="/lms" className={buttonVariants({ variant: "secondary", size: "sm" })}>
          <GraduationCap className="mr-2 h-4 w-4" /> How it becomes an LMS
        </Link>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "sm" })}>
          ROI dashboard
        </Link>
      </section>
    </main>
  )
}
