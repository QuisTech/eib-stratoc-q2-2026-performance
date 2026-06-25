import { Info } from "lucide-react"
import { PrintActions } from "@/components/print-actions"
import { TemplateDoc } from "@/components/template/template-doc"

export const metadata = {
  title: "Q3 2026 Report Template · EIB Group Training",
}

export default function TemplatePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-8">
      <div className="no-print mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Quarterly Report Template</h1>
          <p className="text-sm text-muted-foreground">
            A reusable scaffold for the next quarter, mirroring the Q2 structure.
          </p>
        </div>
        <PrintActions label="template" />
      </div>

      <div className="no-print mb-6 flex items-start gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--chart-2)]" />
        <p>
          Click any field below to type directly into it, then use <span className="font-medium text-foreground">Download PDF</span> to
          export. Empty fields print as blank lines so the document can also be filled by hand. Your typed text is not
          saved between sessions.
        </p>
      </div>

      <TemplateDoc />
    </main>
  )
}
