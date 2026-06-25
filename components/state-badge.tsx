import { cn } from "@/lib/utils"
import type { SubmissionState } from "@/lib/plan-data"

const meta: Record<SubmissionState, { label: string; cls: string }> = {
  Submitted: { label: "Submitted", cls: "bg-[color-mix(in_oklch,var(--chart-1)_18%,transparent)] text-[var(--chart-1)]" },
  "No challenges": { label: "No challenges", cls: "bg-[color-mix(in_oklch,var(--chart-2)_18%,transparent)] text-[var(--chart-2)]" },
  Pending: { label: "Pending", cls: "bg-[color-mix(in_oklch,var(--chart-3)_22%,transparent)] text-[oklch(0.45_0.12_70)]" },
  Redacted: { label: "Redacted", cls: "bg-[color-mix(in_oklch,var(--chart-3)_22%,transparent)] text-[oklch(0.45_0.12_70)]" },
  "No response": { label: "No response", cls: "bg-[color-mix(in_oklch,var(--chart-4)_18%,transparent)] text-[var(--chart-4)]" },
  "Not applicable": { label: "N/A", cls: "bg-muted text-muted-foreground" },
  Morphed: { label: "Morphed → BLACK", cls: "bg-muted text-muted-foreground" },
}

export function StateBadge({ state }: { state: SubmissionState }) {
  const m = meta[state]
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", m.cls)}>
      {m.label}
    </span>
  )
}
