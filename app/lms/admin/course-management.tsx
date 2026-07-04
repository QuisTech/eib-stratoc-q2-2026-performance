"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, BookOpen, Filter } from "lucide-react"
import { formatNaira } from "@/lib/utils"

export function CourseManagement({ courses }: { courses: any[] }) {
  const [filter, setFilter] = useState("All")

  // Extract unique subsidiaries
  const subsidiariesSet = new Set<string>()
  courses.forEach(c => {
    if (!c.subsidiaries) {
      subsidiariesSet.add("Global")
    } else {
      c.subsidiaries.split(',').map((s: string) => s.trim()).forEach((s: string) => {
        if (s) subsidiariesSet.add(s)
      })
    }
  })
  const filterOptions = ["All", ...Array.from(subsidiariesSet).sort()]

  const filteredCourses = filter === "All" 
    ? courses 
    : courses.filter(c => {
        if (!c.subsidiaries) return filter === "Global"
        const subs = c.subsidiaries.split(',').map((s: string) => s.trim())
        return subs.includes(filter)
      })

  return (
    <div className="flex flex-col gap-4">
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

      {filteredCourses.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No courses match this filter.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Course Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Subsidiary</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{c.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="flex flex-wrap gap-1">
                      {c.subsidiaries ? (
                        c.subsidiaries.split(',').map((s: string, i: number) => (
                          <span key={i} className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                            {s.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                          Global
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{formatNaira(c.priceNaira)}</td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <Link
                      href={`/lms/admin/courses/${c.slug}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit Metadata
                    </Link>
                    <Link
                      href={`/lms/admin/courses/${c.slug}/builder`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-primary bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <BookOpen className="h-3.5 w-3.5" /> Build Content
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
