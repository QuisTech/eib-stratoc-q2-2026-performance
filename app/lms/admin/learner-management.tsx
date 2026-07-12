"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Filter, Search } from "lucide-react"
import { ResetQuizAttemptsButton } from "./reset-quiz-attempts-button"
import { ResetPasswordButton } from "./reset-password-button"
import { DeleteUserButton } from "./delete-user-button"
import { EditNameButton } from "./edit-name-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function initials(name: string) {
  return (name || "")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function LearnerManagement({ 
  learners, 
  orgWide, 
  role, 
  currentUserId 
}: { 
  learners: any[]; 
  orgWide: boolean; 
  role: string; 
  currentUserId: string;
}) {
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("name")

  // Extract unique subsidiaries
  const subsidiariesSet = new Set<string>(["Global"])
  learners.forEach(l => {
    if (l.subsidiary) subsidiariesSet.add(l.subsidiary)
  })
  const filterOptions = ["All", ...Array.from(subsidiariesSet).sort()]

  const filteredLearners = learners.filter(l => {
    // Subsidiary filter
    if (filter !== "All") {
       const sub = l.subsidiary || "Global"
       if (sub !== filter) return false
    }
    // Search filter (name or email)
    if (search.trim()) {
       const q = search.toLowerCase()
       if (!(l.name || "").toLowerCase().includes(q) && !(l.email || "").toLowerCase().includes(q)) return false
    }
    return true
  }).sort((a, b) => {
    if (sortBy === "joined") {
      const dateA = a.joinedAt ? new Date(a.joinedAt).getTime() : 0
      const dateB = b.joinedAt ? new Date(b.joinedAt).getTime() : 0
      return dateB - dateA
    }
    if (sortBy === "enrolled") {
      return (b.enrolled || 0) - (a.enrolled || 0)
    }
    return (a.name || "").localeCompare(b.name || "")
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {orgWide && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              className="text-sm rounded-md border border-input bg-background px-3 py-1.5 focus:ring-1 focus:ring-primary outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {filterOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-2 flex-1 max-w-sm relative">
            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by name or email..."
              className="text-sm rounded-md border border-input bg-background pl-9 pr-3 py-1.5 focus:ring-1 focus:ring-primary outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
          <select 
            className="text-sm rounded-md border border-input bg-background px-3 py-1.5 focus:ring-1 focus:ring-primary outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="joined">Recently Joined</option>
            <option value="enrolled">Highest Enrolled</option>
          </select>
        </div>
      </div>

      {filteredLearners.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No learners match this filter.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Learner</th>
                {orgWide && <th className="px-4 py-3 font-medium">Subsidiary</th>}
                <th className="px-4 py-3 text-center font-medium">Joined</th>
                <th className="px-4 py-3 text-center font-medium">Enrolled</th>
                <th className="px-4 py-3 text-center font-medium">In progress</th>
                <th className="px-4 py-3 text-center font-medium">Completed</th>
                <th className="px-4 py-3 text-center font-medium">Certs</th>
                <th className="px-4 py-3 font-medium">Avg progress</th>
                {role === "admin" && <th className="px-4 py-3 text-right font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredLearners.map((l) => (
                <tr key={l.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Link href={`/lms/admin/users/${l.id}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                        {initials(l.name)}
                      </Link>
                      <Link href={`/lms/admin/users/${l.id}`} className="leading-tight group">
                        <span className="block font-medium group-hover:text-primary group-hover:underline transition-colors">{l.name}</span>
                        <span className="block text-xs text-muted-foreground">{l.email}</span>
                      </Link>
                      {l.role !== "learner" && (
                        <Badge variant="outline" className="ml-1 text-[10px] capitalize">
                          {l.role}
                        </Badge>
                      )}
                    </div>
                  </td>
                  {orgWide && (
                    <td className="px-4 py-3 text-muted-foreground">{l.subsidiary ?? "—"}</td>
                  )}
                  <td className="px-4 py-3 text-center tabular-nums text-muted-foreground text-xs whitespace-nowrap">
                    {l.joinedAt ? new Date(l.joinedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums">
                    {l.enrolled > 0 && l.enrolledCourses && l.enrolledCourses.length > 0 ? (
                      <Tooltip>
                        <TooltipTrigger className="cursor-help underline decoration-muted-foreground decoration-dotted underline-offset-2">
                          {l.enrolled}
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground shadow-md p-3 max-w-xs text-sm">
                          <ul className="list-disc pl-4 space-y-1 text-left">
                            {l.enrolledCourses.map((c: any) => (
                              <li key={c.courseId}>{c.title}</li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span>{l.enrolled}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums">{l.inProgress}</td>
                  <td className="px-4 py-3 text-center tabular-nums">{l.completed}</td>
                  <td className="px-4 py-3 text-center tabular-nums">{l.certificates}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Progress value={l.avgProgress} className="h-1.5 w-24" />
                      <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
                        {l.avgProgress}%
                      </span>
                    </div>
                  </td>
                  {role === "admin" && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end">
                        <EditNameButton userId={l.id} userName={l.name} />
                        <ResetQuizAttemptsButton userId={l.id} userName={l.name} enrolledCourses={l.enrolledCourses} />
                        <ResetPasswordButton userId={l.id} userName={l.name} />
                        {currentUserId !== l.id && <DeleteUserButton userId={l.id} userName={l.name} />}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
