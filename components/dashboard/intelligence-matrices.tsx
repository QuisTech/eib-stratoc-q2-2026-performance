import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { challengeMatrix, skillGapAnalysis, resourceRequirements, strategicAlignment } from "@/lib/plan-data"

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
      {children}
    </span>
  )
}

export function ChallengeMatrix() {
  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle className="font-heading text-base">Operational Challenges Matrix</CardTitle>
        <CardDescription>Challenge themes cross-referenced to the subsidiaries affected</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[44%]">Theme</TableHead>
                <TableHead>Subsidiaries affected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challengeMatrix.map((r) => (
                <TableRow key={r.theme}>
                  <TableCell className="align-top text-sm font-medium">{r.theme}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {r.subsidiaries.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>
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

export function SkillGapMatrix() {
  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle className="font-heading text-base">Skill Gap Analysis</CardTitle>
        <CardDescription>Consolidated capability gaps by category — feeds the Capability Improvement Program</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Category</TableHead>
                <TableHead>Specific gaps</TableHead>
                <TableHead className="w-[230px]">Subsidiaries</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skillGapAnalysis.map((r) => (
                <TableRow key={r.category}>
                  <TableCell className="align-top text-sm font-semibold">{r.category}</TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">{r.gaps}</TableCell>
                  <TableCell className="align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {r.subsidiaries.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>
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

export function ResourceRequirements() {
  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle className="font-heading text-base">Resource Requirements Summary</CardTitle>
        <CardDescription>Categorized for the 3-month budget submission</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 sm:grid-cols-2">
          {resourceRequirements.map((r) => (
            <li key={r.category} className="rounded-lg border bg-muted/30 p-3">
              <p className="text-sm font-semibold">{r.category}</p>
              <p className="mt-1 text-sm text-muted-foreground">{r.items}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function StrategicAlignmentMatrix() {
  return (
    <Card className="avoid-break">
      <CardHeader>
        <CardTitle className="font-heading text-base">Strategic Alignment Matrix</CardTitle>
        <CardDescription>How Task Force input maps to the nine initiatives of the 90-day plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead className="w-[210px]">Initiative</TableHead>
                <TableHead className="hidden md:table-cell">What it covers</TableHead>
                <TableHead>Task Force data feeding in</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {strategicAlignment.map((r) => (
                <TableRow key={r.n}>
                  <TableCell className="align-top text-sm font-semibold text-accent-foreground">{r.n}</TableCell>
                  <TableCell className="align-top text-sm font-medium">{r.initiative}</TableCell>
                  <TableCell className="hidden align-top text-sm text-muted-foreground md:table-cell">
                    {r.covers}
                  </TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">{r.feed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
