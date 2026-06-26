import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { kpis } from "@/lib/plan-data"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

export function KpiTable() {
  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle className="font-heading">Training ROI Dashboard — Trackable Metrics</CardTitle>
        <CardDescription>
          Baselines are established in Month 1; targets are measured at the close of the 90-day window.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr>
                <th className="px-4 py-2.5 font-medium">KPI</th>
                <th className="px-4 py-2.5 font-medium">Baseline</th>
                <th className="px-4 py-2.5 text-right font-medium">90-Day Target</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map((k) => {
                const Icon = k.direction === "up" ? ArrowUpRight : ArrowDownRight
                const color = k.direction === "up" ? "var(--chart-1)" : "var(--chart-4)"
                return (
                  <tr key={k.kpi} className="border-t">
                    <td className="px-4 py-2.5 font-medium">{k.kpi}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{k.baseline}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className="inline-flex items-center gap-1 font-semibold"
                        style={{ color }}
                      >
                        <Icon className="h-4 w-4" />
                        {k.target}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
