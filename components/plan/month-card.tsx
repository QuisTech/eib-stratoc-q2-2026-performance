import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { MonthPlan } from "@/lib/plan-data"
import { Lightbulb } from "lucide-react"

const phaseAccent: Record<number, string> = {
  1: "var(--chart-2)",
  2: "var(--chart-3)",
  3: "var(--chart-1)",
}

export function MonthCard({ plan }: { plan: MonthPlan }) {
  const accent = phaseAccent[plan.month]
  return (
    <Card className="avoid-break overflow-hidden">
      <CardHeader className="gap-2 border-b" style={{ borderColor: `${accent}` }}>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md font-heading text-lg font-bold text-background"
            style={{ backgroundColor: accent }}
          >
            {plan.month}
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {plan.label} · {plan.window}
            </p>
            <h3 className="font-heading text-lg font-semibold leading-tight">{plan.phase}</h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{plan.focus}</p>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        {plan.initiatives.map((init) => (
          <div key={init.n} className="avoid-break border-l-2 pl-4" style={{ borderColor: accent }}>
            <h4 className="font-medium leading-snug">
              <span className="text-muted-foreground">Initiative {init.n}:</span> {init.title}
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">{init.actions}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span className="font-medium">
                Deliverable: <span className="font-normal text-muted-foreground">{init.deliverable}</span>
              </span>
              <span className="font-medium">
                Business Impact: <span className="font-normal text-muted-foreground">{init.impact}</span>
              </span>
            </div>
            {init.evidence && (
              <div
                className="mt-3 rounded-md p-3 text-xs"
                style={{ backgroundColor: `color-mix(in oklch, ${accent} 8%, transparent)` }}
              >
                <p className="mb-1 flex items-center gap-1.5 font-medium" style={{ color: accent }}>
                  <Lightbulb className="h-3.5 w-3.5" /> Grounded in subsidiary input
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  {init.evidence.map((e, i) => (
                    <li key={i} className="flex gap-1.5">
                      <span aria-hidden style={{ color: accent }}>
                        •
                      </span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
