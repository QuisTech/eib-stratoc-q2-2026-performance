import type { ReactNode } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function ReportSection({
  num,
  title,
  intro,
  children,
}: {
  num: number
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <section id={`section-${num}`} className="avoid-break scroll-mt-24">
      <div className="mb-4 flex items-baseline gap-3 border-b-2 border-primary pb-2">
        <span className="font-heading text-xl font-bold text-accent">{num}.</span>
        <h2 className="font-heading text-xl font-bold text-foreground">{title}</h2>
      </div>
      {intro ? <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{intro}</p> : null}
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  )
}

export function SubHead({ children }: { children: ReactNode }) {
  return <h3 className="font-heading text-base font-semibold text-foreground">{children}</h3>
}

export function DataTable({
  columns,
  rows,
}: {
  columns: string[]
  rows: ReactNode[][]
}) {
  return (
    <div className="avoid-break overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60">
            {columns.map((c) => (
              <TableHead key={c} className="text-xs font-semibold uppercase tracking-wide text-foreground">
                {c}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j} className="align-top text-sm leading-relaxed">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
