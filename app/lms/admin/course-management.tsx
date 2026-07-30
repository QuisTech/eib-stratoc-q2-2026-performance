"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, BookOpen, Filter, Copy, Loader2, Trash2, EyeOff, Flame } from "lucide-react"
import { formatNaira } from "@/lib/utils"
import { duplicateCourseAsLMS, softDeleteCourse, hardDeleteCourse } from "@/app/actions/lms"
import { isSuperAdmin as checkIsSuperAdmin } from "@/lib/access-control"

export function CourseManagement({ courses, userRole, userEmail }: { courses: any[]; userRole: string; userEmail?: string }) {
  const [filter, setFilter] = useState("All")
  const [duplicatingSlug, setDuplicatingSlug] = useState<string | null>(null)
  const [duplicateError, setDuplicateError] = useState<string | null>(null)
  const [duplicateSuccess, setDuplicateSuccess] = useState<string | null>(null)
  const router = useRouter()
  const isSuperAdmin = checkIsSuperAdmin(userEmail)

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

  async function handleDuplicate(slug: string, title: string) {
    if (!confirm(`Duplicate "${title}" as a regular LMS Course visible to staff?`)) return
    setDuplicatingSlug(slug)
    setDuplicateError(null)
    setDuplicateSuccess(null)
    try {
      const result = await duplicateCourseAsLMS(slug)
      setDuplicateSuccess(`Duplicated! New course slug: ${result.newSlug}`)
      router.refresh()
    } catch (err: any) {
      setDuplicateError(err.message)
    } finally {
      setDuplicatingSlug(null)
    }
  }

  async function handleSoftDelete(slug: string, title: string) {
    if (!confirm(`Soft Delete "${title}"?\n\nThis will hide the course from all learners and catalog views, but preserve past certificates and completion logs.`)) return
    try {
      await softDeleteCourse(slug)
      setDuplicateSuccess(`Soft-deleted (hidden) course "${title}"`)
      router.refresh()
    } catch (err: any) {
      setDuplicateError(err.message)
    }
  }

  async function handleHardDelete(slug: string, title: string) {
    if (!confirm(`HARD DELETE "${title}"?\n\nWARNING: This will PERMANENTLY purge this course, all student enrollments, quiz attempts, and certificates! This action CANNOT be undone.`)) return
    try {
      await hardDeleteCourse(slug)
      setDuplicateSuccess(`Hard-deleted (permanently wiped) course "${title}"`)
      router.refresh()
    } catch (err: any) {
      setDuplicateError(err.message)
    }
  }

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

      {duplicateError && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">{duplicateError}</div>
      )}
      {duplicateSuccess && (
        <div className="rounded-md bg-green-500/15 p-3 text-sm font-medium text-green-700 dark:text-green-400">{duplicateSuccess}</div>
      )}

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
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      {c.title}
                      {c.isBriefing && (
                        <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                          Briefing
                        </span>
                      )}
                    </div>
                  </td>
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
                    {c.isBriefing && isSuperAdmin && (
                      <button
                        onClick={() => handleDuplicate(c.slug, c.title)}
                        disabled={duplicatingSlug === c.slug}
                        className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-500 hover:text-white disabled:opacity-50 dark:text-emerald-400"
                      >
                        {duplicatingSlug === c.slug ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        Duplicate as LMS Course
                      </button>
                    )}
                    {isSuperAdmin && (
                      <>
                        <button
                          onClick={() => handleSoftDelete(c.slug, c.title)}
                          title="Soft Delete: Hide course from catalog while preserving historical student records"
                          className="inline-flex items-center gap-1.5 rounded-md border border-amber-500 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-500 hover:text-white dark:text-amber-400"
                        >
                          <EyeOff className="h-3.5 w-3.5" /> Soft Delete
                        </button>
                        <button
                          onClick={() => handleHardDelete(c.slug, c.title)}
                          title="Hard Delete: Permanently wipe course and all student data"
                          className="inline-flex items-center gap-1.5 rounded-md border border-red-500 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500 hover:text-white dark:text-red-400"
                        >
                          <Flame className="h-3.5 w-3.5" /> Hard Delete
                        </button>
                      </>
                    )}
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
