import { Building2, CheckCircle2, AlertTriangle, Cpu } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { complianceSummary, softwareTools } from "@/lib/report-data"

const deployed = softwareTools.filter((t) => t.status === "Deployed").length

const kpis = [
  {
    label: "Subsidiaries Overseen",
    value: complianceSummary.total,
    sub: "Group Training portfolio",
    icon: Building2,
    tone: "text-[var(--chart-2)]",
  },
  {
    label: "Active Compliance",
    value: `${complianceSummary.activeRate}%`,
    sub: `${complianceSummary.active} of ${complianceSummary.total} fully submitted`,
    icon: CheckCircle2,
    tone: "text-[var(--chart-1)]",
  },
  {
    label: "Non-responsive",
    value: complianceSummary.nonResponsive,
    sub: "Require EVP intervention",
    icon: AlertTriangle,
    tone: "text-[var(--chart-4)]",
  },
  {
    label: "Software Tools",
    value: `${deployed}/${softwareTools.length}`,
    sub: "Deployed on personal initiative",
    icon: Cpu,
    tone: "text-[var(--chart-3)]",
  },
]

export function KpiCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card key={kpi.label} className="avoid-break">
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {kpi.label}
                </span>
                <Icon className={`h-5 w-5 ${kpi.tone}`} />
              </div>
              <span className="font-heading text-3xl font-bold text-foreground">{kpi.value}</span>
              <span className="text-xs text-muted-foreground text-pretty">{kpi.sub}</span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
