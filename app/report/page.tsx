import { PrintActions } from "@/components/print-actions"
import { ReportCover } from "@/components/report/report-cover"
import { ReportSection, SubHead, DataTable } from "@/components/report/primitives"
import { StatusBadge } from "@/components/status-badge"
import {
  subsidiaries,
  complianceSummary,
  monthlyTrends,
  interventions,
  softwareTools,
  partnerships,
  opportunities,
  swot,
  implementationStatus,
  q3TrainingNeeds,
  summaryRatings,
  reportMeta,
} from "@/lib/report-data"

export const metadata = {
  title: "Full Report · Q2 2026 Performance Evaluation",
}

export default function ReportPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-8">
      <div className="no-print mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Full Performance Report</h1>
          <p className="text-sm text-muted-foreground">
            The complete 8-section Q2 2026 evaluation, formatted for screen and print.
          </p>
        </div>
        <PrintActions />
      </div>

      <article className="flex flex-col gap-10">
        <ReportCover />

        {/* Section 1 */}
        <ReportSection
          num={1}
          title="Consolidated Monthly Performance Report"
          intro="Summary of training performance across all eleven EIB Group subsidiaries under the Group Head Training portfolio."
        >
          <SubHead>Performance of Each Subsidiary</SubHead>
          <DataTable
            columns={["#", "Subsidiary", "Sector", "Submitted", "Status"]}
            rows={subsidiaries.map((s) => [
              s.id,
              <span key="n" className="font-medium">{s.name}</span>,
              s.sector,
              s.submitted,
              <StatusBadge key="s" status={s.status} />,
            ])}
          />

          <SubHead>Compliance Summary</SubHead>
          <DataTable
            columns={["Metric", "Data"]}
            rows={[
              ["Total subsidiaries under Group Training oversight", complianceSummary.total],
              ["Actively submitted training needs/reports", `${complianceSummary.active} (${complianceSummary.activeNames.join(", ")})`],
              ["Partial engagement (no formal submission)", `${complianceSummary.partial} (${complianceSummary.partialNames.join(", ")})`],
              ["Did NOT respond to formal request", `${complianceSummary.nonResponsive} (${complianceSummary.nonResponsiveNames.join(", ")})`],
              [<span key="r" className="font-semibold">Active compliance rate</span>, <span key="v" className="font-semibold">{complianceSummary.activeRate}% (4 of 11)</span>],
              [<span key="r2" className="font-semibold">Including partial engagement</span>, <span key="v2" className="font-semibold">{complianceSummary.inclusiveRate}% (6 of 11)</span>],
            ]}
          />

          <SubHead>Monthly Growth Trends</SubHead>
          <DataTable
            columns={["Month", "Key Activity", "Impact"]}
            rows={monthlyTrends.map((m) => [
              <span key="m" className="font-medium whitespace-nowrap">{m.month}</span>,
              m.key,
              m.impact,
            ])}
          />

          <SubHead>Areas Requiring Management Intervention</SubHead>
          <DataTable
            columns={["Area", "Details", "Recommended Action"]}
            rows={interventions.map((i) => [
              <span key="a" className="font-medium">{i.area}</span>,
              i.details,
              i.action,
            ])}
          />
        </ReportSection>

        {/* Section 2 */}
        <ReportSection
          num={2}
          title="Strategic Growth Report"
          intro="Focus on expansion and future opportunities for the Group Training function."
        >
          <SubHead>New Market Opportunities</SubHead>
          <DataTable
            columns={["Opportunity", "Details", "Potential Value"]}
            rows={opportunities.map((o) => [
              <span key="o" className="font-medium">{o.name}</span>,
              o.detail,
              <span key="v" className="font-semibold text-[var(--chart-1)]">{o.value}</span>,
            ])}
          />

          <SubHead>Strategic Partnerships</SubHead>
          <DataTable
            columns={["Partner / Entity", "Nature of Partnership", "Status"]}
            rows={partnerships.map((p) => [
              <span key="p" className="font-medium">{p.partner}</span>,
              p.nature,
              p.status,
            ])}
          />

          <SubHead>New Product Development (Personal Initiative)</SubHead>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The following software tools were developed by the Group Head Training leveraging a personal background in
            software engineering to enhance operational efficiency within the Training and HR functions. These are not
            contracted development projects.
          </p>
          <DataTable
            columns={["Product / Service", "Description", "Status"]}
            rows={softwareTools.map((t) => [
              <span key="t" className="font-medium">{t.name}</span>,
              t.desc,
              <span
                key="s"
                className={t.status === "Deployed" ? "font-medium text-[var(--chart-1)]" : "font-medium text-[oklch(0.55_0.12_70)]"}
              >
                {t.status}
              </span>,
            ])}
          />
        </ReportSection>

        {/* Section 3 */}
        <ReportSection
          num={3}
          title="Human Capital Development Report"
          intro="Workforce growth and leadership development across all EIB Group subsidiaries."
        >
          <SubHead>Leadership Development &amp; Field Training</SubHead>
          <DataTable
            columns={["Training / Initiative", "Target", "Details"]}
            rows={[
              ['Executive Leadership Training ("The Oranges")', "All Group & Subsidiary Managers", "Group-wide leadership capacity built — March 2026"],
              ["FPV Drone Training", "Briech UAS (Army)", "16 personnel (1 & 8 Divisions)"],
              ["Operational Induction Design", "BLACK / EIB Stratoc", "Orientation & induction for new operational camps (Niger, Kebbi, Plateau, Zamfara)"],
              ["Field Readiness & Risk Training", "BLACK / EIB Stratoc", "Operational risk assessment, drone mission planning, SAC 18 Form usage, field safety"],
              ["Technical GIS / Power BI", "Giga Forensics / EIB Stratoc", "QGIS querying, Shiroro mapping, Sentinel LULC imagery, Power BI dashboards"],
              ["HSE & Operational Debriefs", "EIB Stratoc", "Hypertension awareness, NOC/Command Centre familiarization, Shiroro debriefs"],
            ]}
          />

          <SubHead>Recruitment, Turnover &amp; Workforce Planning</SubHead>
          <DataTable
            columns={["Area", "Detail"]}
            rows={[
              ["Onboarding (BLACK)", "Ukachukwu Uchechi Jane, Queen Chinyere, Capt. Akomolafe Deji, Danlami Shamsuddeen Muhammad, Bruno Ifeanyi Igboanugo + IT student Ideba Samuel Pedro Efa"],
              ["Internal transfers", "Chimaobi John Nkwo, Precious Lemah, Angela Asika, Olima Emmanuel Oko"],
              ["Resignations processed", "Grace Haruna, Josephine Chikodi Amazu — payroll removal processed"],
              ["Curriculum preparation", "Extensive curricula generated via Lumethis for Q3 Group-wide rollout"],
            ]}
          />

          <SubHead>Training Needs Identified for Q3</SubHead>
          <DataTable
            columns={["Training Need", "Priority", "Target"]}
            rows={q3TrainingNeeds.map((n) => [
              <span key="n" className="font-medium">{n.need}</span>,
              <span key="p" className="font-semibold text-[var(--chart-4)]">{n.priority}</span>,
              n.target,
            ])}
          />
        </ReportSection>

        {/* Section 4 */}
        <ReportSection
          num={4}
          title="Financial Oversight Report"
          intro="Financial health of training operations across all subsidiaries."
        >
          <DataTable
            columns={["Area", "Detail / Assessment"]}
            rows={[
              ["Cost-saving — custom software (8 apps)", "Eliminated external vendor licensing and consulting costs; tools built at zero additional cost."],
              ["Stipend disbursement management", "₦50,000 per trainee × 16 Army personnel managed with full reconciliation (March 2026)."],
              ["ROI — FPV Drone Training", "High — cemented strategic military partnership and elevated Group credibility."],
              ["ROI — custom software tools", "High — eliminated recurring vendor costs; assets reusable and potentially licensable."],
              ["Financial risk — Shiroro budget", "Medium — 3-week delay approved; phased expenditure approach adopted."],
              ["Financial risk — reliance on personal initiative", "Medium — recommend formalizing development resources or budget allocation."],
              ["Q3 revenue drivers", "Expanded training contracts, Shiroro Camp launch, potential software licensing."],
            ]}
          />
        </ReportSection>

        {/* Section 5 */}
        <ReportSection
          num={5}
          title="Risk, Governance & Compliance Report"
          intro="Operational and regulatory risks across the training function."
        >
          <DataTable
            columns={["Item", "Details", "Resolution / Action"]}
            rows={[
              ["Non-submission by 5 subsidiaries", "Glint, Briech Atlantic, Air Friction, BEF, Bright FM failed to submit despite formal request.", "Escalation to EVP recommended"],
              ["Training needs collection process", "No enforcement mechanism to compel timely submission.", "EVP directive making submission mandatory"],
              ["Field reporting integrity", "Risk of fraudulent field reports.", "Document Intelligence Reporter deployed"],
              ["Manual performance tracking", "Legacy manual systems prone to error.", "PIS under development as replacement"],
              ["Site security (Shiroro Camp)", "3-week delay to prioritize perimeter defense following Airforce intervention.", "Phased deployment adopted"],
            ]}
          />
        </ReportSection>

        {/* Section 6 */}
        <ReportSection
          num={6}
          title="Management Action Implementation Report"
          intro="Execution of management directives issued to all subsidiaries."
        >
          <SubHead>Instructions Issued to All Subsidiary Managers</SubHead>
          <DataTable
            columns={["Instruction", "Issued To", "Status"]}
            rows={[
              ["Submit training needs and gap analysis", "All 11 subsidiary managers", "4 fully complied; 2 partial; 5 no response"],
              ["Deploy digital infrastructure (custom tools)", "Training operations team", "Completed"],
              ["Execute multi-state deployment framework", "Training & field teams", "In progress"],
              ["Conduct HSE & Field Operations Orientation", "Training team leads", "Completed"],
              ["Attend Executive Leadership Training", "All Group & Subsidiary Managers", "Completed"],
            ]}
          />

          <SubHead>Implementation Status</SubHead>
          <DataTable
            columns={["Directive", "% Complete", "Expected Completion"]}
            rows={implementationStatus.map((d) => [
              <span key="d" className="font-medium">{d.directive}</span>,
              <span key="p" className="font-semibold">{d.complete}%</span>,
              d.eta,
            ])}
          />
        </ReportSection>

        {/* Section 7 */}
        <ReportSection
          num={7}
          title="Quarterly SWOT Analysis Report"
          intro="A detailed SWOT analysis for the Training function across all EIB Group subsidiaries for Q2 2026."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["Strengths", swot.strengths, "var(--chart-1)"],
                ["Weaknesses", swot.weaknesses, "var(--chart-4)"],
                ["Opportunities", swot.opportunities, "var(--chart-2)"],
                ["Threats", swot.threats, "var(--chart-3)"],
              ] as const
            ).map(([title, items, color]) => (
              <div key={title} className="avoid-break rounded-lg border border-border p-4">
                <h4
                  className="mb-2 font-heading text-sm font-bold uppercase tracking-wide"
                  style={{ color }}
                >
                  {title}
                </h4>
                <ul className="flex flex-col gap-2">
                  {items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ReportSection>

        {/* Section 8 */}
        <ReportSection
          num={8}
          title="Cross-Functional Support Contributions"
          intro="Additional responsibilities performed outside the primary Group Manager (Training) role that contributed to organizational objectives — primarily HR management for the BLACK subsidiary."
        >
          <DataTable
            columns={["Support Activity", "Details"]}
            rows={[
              ["Payroll & Compensation", "Processed salary adjustments and arrears; adjusted IT student allowance to ₦150,000 monthly; issued payroll notifications to Group Chief Accountant and Group HR."],
              ["Onboarding & Contracts", "Onboarded permanent staff and IT student; coordinated documentation, polygraph forms, and ID processing."],
              ["Leave & Loan Administration", "Processed leave applications (Solomon Jideobi, Mary Agabi); escalated loan applications (Moses H. Bayawa, Kelvin Potts-Johnson, Tongji Ephraim Joseph) to EVP Finance."],
              ["Transfers & Redeployments", "Processed internal transfers; coordinated OSINT/GIS/Profiling deployment from Giga Forensics to BLACK."],
              ["HR Advisory & Compliance", "Drafted internal memos and approvals; participated in management meetings on new operational camps (Niger, Kebbi, Plateau, Zamfara)."],
              ["Daily Operational Supervision", "HR Assistant (Geraldine) conducted daily office inspections, biometric attendance enrollment, and facility monitoring."],
            ]}
          />

          <SubHead>Summary of Q2 2026 Performance</SubHead>
          <DataTable
            columns={["Area", "Rating"]}
            rows={summaryRatings.map((r) => [
              <span key="a" className="font-medium">{r.area}</span>,
              <span
                key="r"
                className={r.tone === "warn" ? "font-semibold text-[oklch(0.55_0.12_70)]" : "font-semibold text-[var(--chart-1)]"}
              >
                {r.rating}
              </span>,
            ])}
          />
        </ReportSection>

        <footer className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
          {reportMeta.classification} · Page {reportMeta.pages} of {reportMeta.pages} · {reportMeta.org} {reportMeta.period}
        </footer>
      </article>
    </main>
  )
}
