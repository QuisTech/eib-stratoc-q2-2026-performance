"use client"

import type { ReactNode } from "react"
import { ShieldCheck } from "lucide-react"

function Field({ label, lines = 1 }: { label: string; lines?: number }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {lines === 1 ? (
        <input
          type="text"
          className="w-full border-0 border-b border-border bg-transparent px-0 py-1 text-sm text-foreground outline-none focus:border-accent"
        />
      ) : (
        <textarea
          rows={lines}
          className="w-full resize-none rounded-md border border-border bg-transparent p-2 text-sm text-foreground outline-none focus:border-accent"
        />
      )}
    </label>
  )
}

function Section({ num, title, children }: { num: number; title: string; children: ReactNode }) {
  return (
    <section className="avoid-break">
      <div className="mb-3 flex items-baseline gap-3 border-b-2 border-primary pb-2">
        <span className="font-heading text-lg font-bold text-accent">{num}.</span>
        <h2 className="font-heading text-lg font-bold text-foreground">{title}</h2>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function TableTemplate({ columns, rows = 4 }: { columns: string[]; rows?: number }) {
  return (
    <div className="avoid-break overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted/60">
            {columns.map((c) => (
              <th
                key={c}
                className="border-b border-border px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-foreground"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {columns.map((c) => (
                <td key={c} className="border-b border-border p-0">
                  <input
                    type="text"
                    className="w-full bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:bg-accent/5"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TemplateDoc() {
  return (
    <article className="flex flex-col gap-8">
      {/* Cover */}
      <div className="avoid-break rounded-xl border border-border bg-sidebar p-6 text-sidebar-foreground md:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div className="leading-tight">
            <p className="font-heading text-base font-bold tracking-wide">EIB STRATOC</p>
            <p className="text-xs uppercase tracking-widest text-sidebar-foreground/70">EIB GROUP</p>
          </div>
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold">Quarterly Performance Evaluation Report</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Quarter / Period" />
          <Field label="Date" />
          <Field label="To" />
          <Field label="From" />
        </div>
      </div>

      <Section num={1} title="Consolidated Performance Report">
        <p className="text-xs text-muted-foreground">List each subsidiary, its Q3 training activity, submission status, and performance rating.</p>
        <TableTemplate columns={["#", "Subsidiary", "Training Activity", "Submitted?", "Status"]} rows={11} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Active compliance rate" />
          <Field label="Including partial engagement" />
        </div>
      </Section>

      <Section num={2} title="Strategic Growth Report">
        <TableTemplate columns={["Opportunity / Initiative", "Details", "Status / Value"]} />
      </Section>

      <Section num={3} title="Human Capital Development Report">
        <TableTemplate columns={["Training / Initiative", "Target", "Details"]} />
        <Field label="Training needs identified for next quarter" lines={3} />
      </Section>

      <Section num={4} title="Financial Oversight Report">
        <TableTemplate columns={["Area", "Detail / Assessment"]} rows={5} />
      </Section>

      <Section num={5} title="Risk, Governance & Compliance Report">
        <TableTemplate columns={["Item", "Details", "Resolution / Action"]} />
      </Section>

      <Section num={6} title="Management Action Implementation Report">
        <TableTemplate columns={["Directive", "% Complete", "Expected Completion"]} />
      </Section>

      <Section num={7} title="Quarterly SWOT Analysis">
        <div className="grid gap-4 sm:grid-cols-2">
          {["Strengths", "Weaknesses", "Opportunities", "Threats"].map((t) => (
            <div key={t} className="flex flex-col gap-1">
              <span className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">{t}</span>
              <textarea
                rows={5}
                className="w-full resize-none rounded-md border border-border bg-transparent p-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section num={8} title="Cross-Functional Support & Summary">
        <TableTemplate columns={["Area", "Rating / Detail"]} rows={6} />
        <Field label="Overall summary / management review focus" lines={4} />
      </Section>
    </article>
  )
}
