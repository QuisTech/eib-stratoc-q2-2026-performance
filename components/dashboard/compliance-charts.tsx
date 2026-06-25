"use client"

import { Cell, Label, Pie, PieChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Line, LineChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { statusBreakdown, statusMeta, monthlyTrends, complianceSummary } from "@/lib/report-data"

const donutData = statusBreakdown.map((s) => ({
  name: s.status,
  value: s.count,
  fill: statusMeta[s.status].chart,
}))

const donutConfig = {
  value: { label: "Subsidiaries" },
  "High-performing": { label: "High-performing", color: "var(--chart-1)" },
  Satisfactory: { label: "Satisfactory", color: "var(--chart-2)" },
  "Partial engagement": { label: "Partial engagement", color: "var(--chart-3)" },
  "Non-compliant": { label: "Non-compliant", color: "var(--chart-4)" },
}

const trendConfig = {
  score: { label: "Impact score", color: "var(--chart-2)" },
  activities: { label: "Key activities", color: "var(--chart-3)" },
}

export function ComplianceDonut() {
  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle>Compliance Mix</CardTitle>
        <CardDescription>Status across all 11 subsidiaries</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={donutConfig} className="mx-auto aspect-square max-h-[240px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={58} strokeWidth={4}>
              {donutData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                          {complianceSummary.total}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-xs">
                          subsidiaries
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {donutData.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.fill }} />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="ml-auto font-semibold text-foreground">{d.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function TrendChart() {
  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle>Monthly Delivery Momentum</CardTitle>
        <CardDescription>Training impact &amp; activity count, Q2 2026</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={trendConfig} className="h-[240px] w-full">
          <LineChart data={monthlyTrends} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="short" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={28} domain={[0, 10]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="score" type="monotone" stroke="var(--color-score)" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line dataKey="activities" type="monotone" stroke="var(--color-activities)" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ChartContainer>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--chart-2)" }} /> Impact score
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--chart-3)" }} /> Key activities
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

const submissionData = [
  { name: "Submitted", value: complianceSummary.active, fill: "var(--chart-1)" },
  { name: "Partial", value: complianceSummary.partial, fill: "var(--chart-3)" },
  { name: "No response", value: complianceSummary.nonResponsive, fill: "var(--chart-4)" },
]

export function SubmissionBarChart() {
  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle>Training Needs Submission</CardTitle>
        <CardDescription>Response to the formal Group request</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ value: { label: "Subsidiaries" } }} className="h-[240px] w-full">
          <BarChart data={submissionData} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={28} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {submissionData.map((d) => (
                <Cell key={d.name} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
