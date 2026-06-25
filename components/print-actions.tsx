"use client"

import { Printer, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PrintActions({ label = "report" }: { label?: string }) {
  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
      <Button size="sm" onClick={() => window.print()}>
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </Button>
      <span className="hidden text-xs text-muted-foreground sm:inline">
        Tip: choose &ldquo;Save as PDF&rdquo; as the destination to export this {label}.
      </span>
    </div>
  )
}
