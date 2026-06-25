"use client"

import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { submissionStats, challengeThemes, kpis } from "@/lib/plan-data"

const submissionData = [
  { name: "Submitted", value: submissionStats.submitted, fill: "var(--chart-1)" },
  { name: "No challenges", value: submissionStats.noChallenges, fill: "var(--chart-2)" },
  { name: "Awaiting", value: submissionStats.awaiting, fill: "var(--chart-3)" },
]

const submissionConfig = {
  value: { label: "Subsidiaries" },
  Submitted: { label: "Submitted", color: "var(--chart-1)" },
  "No challenges": { label: "No challenges", color: "var(--chart-2)" },
  Awaiting: { label: "Awaiting", color: "var(--chart-3)" },
} satisfies ChartConfig

export function SubmissionDonut() {
  const responded = submissionStats.submitted + submissionStats.noChallenges
  const rate = Math.round((responded / submissionStats.total) * 100)
  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle className="font-heading text-base">Task Force Response Status</CardTitle>
        <CardDescription>{submissionStats.total} subsidiary representatives</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={submissionConfig} className="mx-auto aspect-square max-h-[220px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={submissionData} dataKey="value" nameKey="name" innerRadius={58} strokeWidth={3}>
              {submissionData.map((d) => (
                <Cell key={d.name} fill={d.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{rate}%</span> response rate
        </p>
      </CardContent>
    </Card>
  )
}

const themeConfig = {
  count: { label: "Mentions", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChallengeThemesChart() {
  return (
    <Card className="avoid-break lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-heading text-base">Recurring Challenge Themes</CardTitle>
        <CardDescription>Consolidated across all submissions — drives Month 1 diagnosis</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={themeConfig} className="h-[220px] w-full">
          <BarChart
            data={challengeThemes}
            layout="vertical"
            margin={{ left: 8, right: 16 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="theme"
              width={150}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const kpiData = kpis.map((k) => ({
  name: k.kpi.replace(" Ratings", "").replace(" Scores", ""),
  target: Math.abs(parseInt(k.target, 10)),
  direction: k.direction,
}))

const kpiConfig = {
  target: { label: "Target change (%)" },
} satisfies ChartConfig

export function KpiTargetChart() {
  return (
    <Card className="avoid-break lg:col-span-3">
      <CardHeader>
        <CardTitle className="font-heading text-base">90-Day KPI Targets</CardTitle>
        <CardDescription>Percentage change against established baselines</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={kpiConfig} className="h-[240px] w-full">
          <BarChart data={kpiData} margin={{ top: 8 }}>
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              interval={0}
            />
            <YAxis hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="target" radius={4}>
              {kpiData.map((d) => (
                <Cell
                  key={d.name}
                  fill={d.direction === "up" ? "var(--chart-1)" : "var(--chart-4)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
