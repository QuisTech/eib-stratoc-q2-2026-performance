"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/status-badge"
import { cn } from "@/lib/utils"
import { subsidiaries, statusBreakdown, type ComplianceStatus } from "@/lib/report-data"

const filters: ("All" | ComplianceStatus)[] = [
  "All",
  "High-performing",
  "Satisfactory",
  "Partial engagement",
  "Non-compliant",
]

const submittedTone: Record<string, string> = {
  Yes: "text-[var(--chart-1)]",
  Partial: "text-[oklch(0.5_0.12_70)]",
  No: "text-[var(--chart-4)]",
}

export function SubsidiaryTable() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const rows = filter === "All" ? subsidiaries : subsidiaries.filter((s) => s.status === filter)

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-1">
          <CardTitle>Subsidiary Performance &amp; Compliance</CardTitle>
          <CardDescription>Training delivery and training-needs submission across the Group</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const count =
              f === "All" ? subsidiaries.length : statusBreakdown.find((s) => s.status === f)?.count ?? 0
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filter === f
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                {f} <span className="opacity-70">({count})</span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Subsidiary</TableHead>
                <TableHead className="hidden md:table-cell">Sector</TableHead>
                <TableHead className="hidden lg:table-cell">Q2 Training Activity</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-muted-foreground">{s.id}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{s.sector}</TableCell>
                  <TableCell className="hidden max-w-md text-sm text-muted-foreground lg:table-cell">
                    {s.activity}
                  </TableCell>
                  <TableCell className={cn("font-semibold", submittedTone[s.submitted])}>
                    {s.submitted}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={s.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
