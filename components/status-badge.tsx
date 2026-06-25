import { cn } from "@/lib/utils"
import type { ComplianceStatus } from "@/lib/report-data"

const styles: Record<ComplianceStatus, string> = {
  "High-performing": "bg-[var(--chart-1)]/12 text-[var(--chart-1)] border-[var(--chart-1)]/30",
  Satisfactory: "bg-[var(--chart-2)]/12 text-[var(--chart-2)] border-[var(--chart-2)]/30",
  "Partial engagement": "bg-[var(--chart-3)]/15 text-[oklch(0.5_0.12_70)] border-[var(--chart-3)]/40",
  "Non-compliant": "bg-[var(--chart-4)]/12 text-[var(--chart-4)] border-[var(--chart-4)]/30",
}

export function StatusBadge({ status, className }: { status: ComplianceStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        styles[status],
        className,
      )}
    >
      {status}
    </span>
  )
}
