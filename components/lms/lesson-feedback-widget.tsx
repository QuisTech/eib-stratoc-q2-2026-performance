"use client"

import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown, Send, CheckCircle2, MessageSquare } from "lucide-react"

interface LessonFeedbackWidgetProps {
  courseSlug: string
  lessonKey: string
  lessonTitle: string
  userName?: string
  userEmail?: string
  subsidiary?: string
}

const QUICK_TAGS = [
  "Clear & actionable",
  "Too fast / dense",
  "Needs more examples",
  "Great case study",
  "Formatting issue",
]

export function LessonFeedbackWidget({ courseSlug, lessonKey, lessonTitle, userName, userEmail, subsidiary }: LessonFeedbackWidgetProps) {
  const storageKey = `lms_fb_lesson_${courseSlug}_${lessonKey}`
  
  const [sentiment, setSentiment] = useState<"positive" | "negative" | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showCommentBox, setShowCommentBox] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        setSentiment(parsed.sentiment || "positive")
        setIsSubmitted(true)
      }
    } catch {}
  }, [storageKey])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleVote = async (choice: "positive" | "negative") => {
    setSentiment(choice)
    setShowCommentBox(true)
  }

  const handleSubmit = async () => {
    if (isSubmitting || isSubmitted) return
    setIsSubmitting(true)

    const payload = {
      type: "lesson",
      courseSlug,
      lessonKey,
      lessonTitle,
      rating: sentiment === "positive" ? 1 : -1,
      sentiment,
      tags: selectedTags,
      comment: comment.trim(),
      userName,
      userEmail,
      subsidiary,
    }

    try {
      // Save locally first to prevent duplicate network calls
      localStorage.setItem(storageKey, JSON.stringify(payload))
    } catch {}

    try {
      await fetch("/api/lms/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    } catch (e) {
      console.warn("Feedback network error handled gracefully:", e)
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 md:p-5 text-center flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <span className="text-sm font-medium text-foreground">
            Thank you! Your feedback helps us continuously improve this course.
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-3 py-1.5 rounded-full border">
          {sentiment === "positive" ? (
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ThumbsUp className="h-3.5 w-3.5" /> Marked as Helpful
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-600 font-semibold">
              <ThumbsDown className="h-3.5 w-3.5" /> Feedback Saved
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" /> How was this lesson?
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Help us refine the curriculum for your team with 1-click feedback.
          </p>
        </div>

        {/* Thumbs Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleVote("positive")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              sentiment === "positive"
                ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30"
                : "bg-muted text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600"
            }`}
          >
            <ThumbsUp className="h-4 w-4" /> Helpful
          </button>

          <button
            type="button"
            onClick={() => handleVote("negative")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              sentiment === "negative"
                ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-600/30"
                : "bg-muted text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600"
            }`}
          >
            <ThumbsDown className="h-4 w-4" /> Could Be Better
          </button>
        </div>
      </div>

      {/* Expanded Quick Tags & Comment Box */}
      {showCommentBox && (
        <div className="mt-4 pt-4 border-t border-border/60 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <span className="text-xs font-medium text-muted-foreground block mb-2">
              Select optional tags:
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What specifically can we add or improve? (Optional)"
              className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Submit"} <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
