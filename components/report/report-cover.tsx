import { ShieldCheck } from "lucide-react"
import { reportMeta } from "@/lib/report-data"

const sections = [
  "Consolidated Monthly Performance Report",
  "Strategic Growth Report",
  "Human Capital Development Report",
  "Financial Oversight Report",
  "Risk, Governance & Compliance Report",
  "Management Action Implementation Report",
  "Quarterly SWOT Analysis Report",
  "Cross-Functional Support Contributions",
]

export function ReportCover() {
  return (
    <div className="print-page avoid-break rounded-xl border border-border bg-sidebar p-8 text-sidebar-foreground md:p-12">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <ShieldCheck className="h-7 w-7" />
        </span>
        <div className="leading-tight">
          <p className="font-heading text-lg font-bold tracking-wide">{reportMeta.org}</p>
          <p className="text-xs uppercase tracking-widest text-sidebar-foreground/70">{reportMeta.group}</p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-2">
        <span className="inline-flex w-fit rounded-full border border-sidebar-border bg-sidebar-accent px-3 py-1 text-xs font-medium tracking-wide">
          {reportMeta.classification} · Page 1 of {reportMeta.pages}
        </span>
        <h1 className="text-balance font-heading text-3xl font-bold leading-tight md:text-4xl">
          {reportMeta.title}
        </h1>
        <p className="font-heading text-2xl font-semibold text-accent">{reportMeta.period}</p>
      </div>

      <dl className="mt-8 grid gap-4 border-t border-sidebar-border pt-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-sidebar-foreground/60">Date</dt>
          <dd className="text-sm font-medium">{reportMeta.date}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-sidebar-foreground/60">To</dt>
          <dd className="text-sm font-medium">
            {reportMeta.to} ({reportMeta.toEmail})
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-sidebar-foreground/60">From</dt>
          <dd className="text-sm font-medium">{reportMeta.from}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-sidebar-foreground/60">Scope</dt>
          <dd className="text-sm font-medium">11 EIB Group subsidiaries</dd>
        </div>
      </dl>

      <div className="mt-8 border-t border-sidebar-border pt-6">
        <p className="mb-3 text-xs uppercase tracking-wide text-sidebar-foreground/60">Contents</p>
        <ol className="grid gap-1.5 sm:grid-cols-2">
          {sections.map((s, i) => (
            <li key={s} className="flex gap-2 text-sm">
              <span className="font-semibold text-accent">{i + 1}.</span>
              <a href={`#section-${i + 1}`} className="text-sidebar-foreground/85 hover:text-accent hover:underline">
                {s}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
