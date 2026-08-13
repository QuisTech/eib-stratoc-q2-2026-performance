"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Award, Search, RefreshCw, MessageCircle } from "lucide-react"

export function AdminFeedbackView() {
  const [feedbackList, setFeedbackList] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState<"all" | "lesson" | "course">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchFeedback = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/lms/feedback?limit=1000")
      const data = await res.json()
      setFeedbackList(data.feedback || [])
      setTotalCount(data.total || data.feedback?.length || 0)
    } catch (e) {
      console.error("Failed to load feedback:", e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [])

  const filteredList = feedbackList.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      item.courseTitle?.toLowerCase().includes(query) ||
      item.lessonTitle?.toLowerCase().includes(query) ||
      item.comment?.toLowerCase().includes(query) ||
      item.subsidiary?.toLowerCase().includes(query) ||
      item.userEmail?.toLowerCase().includes(query)
    )
  })

  // Metrics
  const lessonItems = feedbackList.filter((i) => i.type === "lesson")
  const courseItems = feedbackList.filter((i) => i.type === "course")

  const positiveLessonVotes = lessonItems.filter((i) => i.sentiment === "positive" || i.rating === 1).length
  const positiveLessonPercent = lessonItems.length > 0 ? Math.round((positiveLessonVotes / lessonItems.length) * 100) : 100

  const avgCourseRating =
    courseItems.length > 0
      ? (courseItems.reduce((acc, curr) => acc + (curr.rating || 5), 0) / courseItems.length).toFixed(1)
      : "5.0"

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> Staff Feedback & Course Improvement Hub
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time feedback collected from end-of-lesson micro checks and end-of-course evaluations.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchFeedback}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold hover:bg-muted transition-colors w-fit"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-primary" : ""}`} /> Refresh Feedback
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground block">Total Submissions</span>
            <span className="text-2xl font-bold font-heading text-foreground">{totalCount || feedbackList.length}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <MessageCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground block">Lesson Helpfulness Rate</span>
            <span className="text-2xl font-bold font-heading text-emerald-600">{positiveLessonPercent}% Positive</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <ThumbsUp className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground block">Avg Course Rating</span>
            <span className="text-2xl font-bold font-heading text-amber-500 flex items-center gap-1">
              {avgCourseRating} <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Award className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              filterType === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Feedback ({feedbackList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("lesson")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              filterType === "lesson" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Lesson Micro-Feedback ({lessonItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("course")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              filterType === "course" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Course Evaluations ({courseItems.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course, tag, comment..."
            className="w-full rounded-xl border border-input bg-card pl-9 pr-3 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Feedback List Table */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">Loading feedback insights...</div>
      ) : filteredList.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-border p-8">
          <p className="text-sm font-semibold text-foreground">No feedback entries found</p>
          <p className="text-xs text-muted-foreground mt-1">
            As staff complete lessons and course evaluations, their feedback will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredList.map((item) => {
            const isLesson = item.type === "lesson"
            const isPositive = item.sentiment === "positive" || item.rating === 1

            return (
              <div
                key={item.id || Math.random()}
                className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm hover:border-border transition-all flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {isLesson ? "Lesson Feedback" : "Course Evaluation"}
                      </span>
                      <span className="text-xs text-muted-foreground">· {item.courseTitle || item.courseSlug}</span>
                    </div>
                    {item.lessonTitle && (
                      <h4 className="font-heading text-sm font-bold text-foreground mt-0.5">
                        {item.lessonTitle}
                      </h4>
                    )}
                  </div>

                  {/* Rating / Badge */}
                  <div>
                    {isLesson ? (
                      isPositive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                          <ThumbsUp className="h-3 w-3" /> Helpful
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 border border-amber-500/20">
                          <ThumbsDown className="h-3 w-3" /> Needs Work
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 border border-amber-500/20">
                        {item.rating || 5} / 5 Stars <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Tags */}
                {Array.isArray(item.tags) && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 my-1">
                    {item.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground border border-border/50"
                      >
                        🏷️ {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Open Comment */}
                {item.comment && (
                  <p className="text-xs md:text-sm leading-relaxed text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/40 font-normal">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                )}

                {/* Submitting User & Timestamp */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground/80 border-t border-border/40 pt-2 mt-1">
                  <span>Submitted by: <strong>{item.userName || item.userEmail}</strong> ({item.subsidiary || "Group HQ"})</span>
                  <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-NG") : "Recent"}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
