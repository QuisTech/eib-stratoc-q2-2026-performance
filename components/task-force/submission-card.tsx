import { CheckCircle2, Clock, MinusCircle, AlertCircle, EyeOff, XCircle, Slash, GitMerge } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Submission } from "@/lib/plan-data"

const stateMeta = {
  Submitted: { Icon: CheckCircle2, cls: "text-[var(--chart-1)]", ring: "border-l-[var(--chart-1)]" },
  "No challenges": { Icon: MinusCircle, cls: "text-[var(--chart-2)]", ring: "border-l-[var(--chart-2)]" },
  Pending: { Icon: Clock, cls: "text-[oklch(0.55_0.12_70)]", ring: "border-l-[var(--chart-3)]" },
  Redacted: { Icon: EyeOff, cls: "text-[oklch(0.55_0.12_70)]", ring: "border-l-[var(--chart-3)]" },
  "No response": { Icon: XCircle, cls: "text-[var(--chart-4)]", ring: "border-l-[var(--chart-4)]" },
  "Not applicable": { Icon: Slash, cls: "text-muted-foreground", ring: "border-l-border" },
  Morphed: { Icon: GitMerge, cls: "text-muted-foreground", ring: "border-l-border" },
}

function Block({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <div className="flex flex-col gap-1.5">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h4>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SubmissionCard({ s }: { s: Submission }) {
  const meta = stateMeta[s.state]
  const Icon = meta.Icon
  return (
    <Card className={cn("avoid-break border-l-4", meta.ring)}>
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-heading text-lg font-bold text-foreground">{s.subsidiary}</h3>
            <p className="text-xs text-muted-foreground">
              {s.representative}
              {s.department ? ` · ${s.department}` : ""}
            </p>
          </div>
          <span className={cn("flex shrink-0 items-center gap-1.5 text-xs font-semibold", meta.cls)}>
            <Icon className="h-4 w-4" />
            {s.state}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {s.note ? (
          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {s.note}
          </div>
        ) : null}
        {s.subReps && s.subReps.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sub-subsidiary representatives
            </h4>
            <ul className="flex flex-col gap-1.5">
              {s.subReps.map((r) => (
                <li key={r.name} className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-foreground">{r.name}</span>
                  <span className="shrink-0 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {r.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <Block title="Top operational challenges" items={s.challenges} />
        <Block title="Critical skill gaps" items={s.skillGaps} />
        <Block title="Proposed interventions" items={s.priorities} />
        <Block title="Estimated resources" items={s.resources} />
        {s.budget && s.budget.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Submitted budget estimates
            </h4>
            <dl className="overflow-hidden rounded-lg border border-border">
              {s.budget.map((b, i) => {
                const isTotal = i === s.budget!.length - 1
                return (
                  <div
                    key={b.area}
                    className={cn(
                      "flex items-center justify-between gap-3 px-3 py-2 text-sm",
                      i % 2 === 0 && !isTotal ? "bg-muted/40" : "",
                      isTotal ? "bg-primary text-primary-foreground font-semibold" : "",
                    )}
                  >
                    <dt className={isTotal ? "" : "text-foreground"}>{b.area}</dt>
                    <dd className="shrink-0 font-mono text-xs tabular-nums">{b.cost}</dd>
                  </div>
                )
              })}
            </dl>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
