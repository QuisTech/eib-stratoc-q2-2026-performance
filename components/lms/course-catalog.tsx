"use client"

import { useState, useMemo } from "react"
import type { Course, Enrollment } from "@/lib/db/schema"
import { CourseCard } from "@/components/lms/course-card"
import { formatNaira } from "@/lib/utils"

type CourseCatalogProps = {
  courses: Course[]
  enrollments: Enrollment[]
  userRole?: string
  userSubsidiary?: string | null
}

export function CourseCatalog({
  courses,
  enrollments,
  userRole = "learner",
  userSubsidiary = null,
}: CourseCatalogProps) {
  const [filterSubsidiary, setFilterSubsidiary] = useState<string>("All")
  const [filterCategory, setFilterCategory] = useState<string>("All")
  const [groupingMode, setGroupingMode] = useState<"subsidiary" | "category">("subsidiary")

  const enrollMap = useMemo(() => {
    const map = new Map<number, Enrollment>()
    for (const e of enrollments) {
      map.set(e.courseId, e)
    }
    return map
  }, [enrollments])

  // Extract unique lists for filters
  const allCategories = useMemo(() => {
    const set = new Set(courses.map(c => c.category))
    return Array.from(set).sort()
  }, [courses])

  const allSubsidiaries = useMemo(() => {
    const set = new Set<string>()
    for (const c of courses) {
      if (c.subsidiaries) {
        c.subsidiaries.split(',').forEach(s => {
          const trimmed = s.trim()
          if (trimmed.toUpperCase() !== 'BLACK') {
            set.add(trimmed)
          }
        })
      }
    }
    return Array.from(set).sort()
  }, [courses])

  // Apply filters
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      // Category filter
      if (filterCategory !== "All" && c.category !== filterCategory) return false

      // Subsidiary filter (always show EIB Group / Global courses, unless explicitly hiding)
      // If a course has "EIB Group" as a subsidiary, it's considered global.
      if (filterSubsidiary !== "All") {
        const subs = c.subsidiaries ? c.subsidiaries.split(',').map(s => s.trim()) : []
        const isGlobal = subs.includes("EIB Group")
        const matchesSub = subs.includes(filterSubsidiary)
        
        // Show if it matches the subsidiary OR if it's a global "EIB Group" course
        if (!matchesSub && !isGlobal) return false
      }

      return true
    })
  }, [courses, filterCategory, filterSubsidiary])

  // Group filtered courses
  const groupedCourses = useMemo(() => {
    const groups = new Map<string, Course[]>()
    
    for (const c of filteredCourses) {
      let keys: string[] = []
      
      if (groupingMode === "category") {
        keys = [c.category]
      } else {
        // Group by subsidiary
        // If a course has multiple subsidiaries, it should appear in all relevant subsidiary groups
        keys = c.subsidiaries ? c.subsidiaries.split(',').map(s => s.trim()).filter(s => s.toUpperCase() !== 'BLACK') : ["General"]
        
        // If the user is filtering by a specific subsidiary, we only want to show that group and the Global group
        if (filterSubsidiary !== "All") {
          keys = keys.filter(k => k === filterSubsidiary || k === "EIB Group")
        } else if (userRole !== "admin" && userRole !== "group_head") {
          // If not a global admin/group_head, restrict keys to their own subsidiary and global/general
          keys = keys.filter(
            (k) =>
              k.toLowerCase() === userSubsidiary?.toLowerCase() ||
              k === "EIB Group" ||
              k === "Global"
          )
        }
      }

      for (const key of keys) {
        const list = groups.get(key) ?? []
        list.push(c)
        groups.set(key, list)
      }
    }
    return groups
  }, [filteredCourses, groupingMode, filterSubsidiary])

  const catalogValue = courses.reduce((s, c) => s + c.priceNaira, 0)

  return (
    <section className="mt-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold">Course Catalog</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {courses.length} courses across {allCategories.length} skill-gap categories &middot;{" "}
            {formatNaira(catalogValue)} in total training value.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-muted/50 p-2 rounded-lg border border-border">
          {/* Grouping Toggle */}
          <div className="flex items-center rounded-md bg-background p-1 border border-border">
            <button
              onClick={() => setGroupingMode("subsidiary")}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${groupingMode === "subsidiary" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted"}`}
            >
              By Subsidiary
            </button>
            <button
              onClick={() => setGroupingMode("category")}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${groupingMode === "category" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted"}`}
            >
              By Category
            </button>
          </div>
          
          {(userRole === "admin" || userRole === "group_head") && (
            <>
              <div className="h-6 w-px bg-border hidden sm:block"></div>

              {/* Subsidiary Filter */}
              <select 
                className="text-sm bg-background border border-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={filterSubsidiary}
                onChange={(e) => setFilterSubsidiary(e.target.value)}
              >
                <option value="All">All Subsidiaries</option>
                {allSubsidiaries.filter(s => s !== "EIB Group").map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value="EIB Group">EIB Group (Global)</option>
              </select>
            </>
          )}

          {/* Category Filter */}
          <select 
            className="text-sm bg-background border border-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {allCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 space-y-10">
        {filteredCourses.length === 0 ? (
          <div className="p-8 text-center border rounded-xl border-dashed bg-muted/20">
            <p className="text-muted-foreground">No courses match your selected filters.</p>
            <button 
              onClick={() => { setFilterSubsidiary("All"); setFilterCategory("All"); }}
              className="mt-3 text-sm font-medium text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          [...groupedCourses.entries()]
            .sort(([a], [b]) => {
              // Always put EIB Group first if grouping by subsidiary
              if (groupingMode === "subsidiary") {
                if (a === "EIB Group") return -1;
                if (b === "EIB Group") return 1;
              }
              return a.localeCompare(b);
            })
            .map(([groupName, list]) => (
            <div key={groupName}>
              <div className="mb-4 flex items-center gap-2 border-b pb-2">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {groupName}
                </h3>
                <span className="flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {list.length} {list.length === 1 ? 'course' : 'courses'}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {list.map((c) => (
                  <CourseCard
                    key={`${groupName}-${c.id}`}
                    course={c}
                    enrolled={enrollMap.has(c.id)}
                    progress={enrollMap.get(c.id)?.progress}
                    isCompleted={enrollMap.get(c.id)?.status === "completed"}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
