import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { implementationStatus } from "@/lib/report-data"

export function ImplementationProgress() {
  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle>Directive Implementation</CardTitle>
        <CardDescription>Execution status of Q2 management directives</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {implementationStatus.map((d) => (
          <div key={d.directive} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-foreground">{d.directive}</span>
              <span className="text-sm font-semibold tabular-nums text-foreground">{d.complete}%</span>
            </div>
            <Progress value={d.complete} className="h-2" />
            <span className="text-xs text-muted-foreground">{d.eta}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
