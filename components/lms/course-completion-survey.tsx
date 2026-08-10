"use client"

import { useState, useEffect } from "react"
import { Star, Send, Award, CheckCircle2 } from "lucide-react"

interface CourseCompletionSurveyProps {
  courseSlug: string
  courseTitle: string
  userName?: string
  userEmail?: string
  subsidiary?: string
}

export function CourseCompletionSurvey({ courseSlug, courseTitle, userName, userEmail, subsidiary }: CourseCompletionSurveyProps) {
  const storageKey = `lms_fb_course_${courseSlug}`

  const [overallRating, setOverallRating] = useState(5)
  const [contentQuality, setContentQuality] = useState(5)
  const [jobRelevance, setJobRelevance] = useState(5)
  const [visualsRating, setVisualsRating] = useState(5)
  const [npsScore, setNpsScore] = useState(9)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setIsSubmitted(true)
      }
    } catch {}
  }, [storageKey])

  const handleSubmit = async () => {
    if (isSubmitting || isSubmitted) return
    setIsSubmitting(true)

    const payload = {
      type: "course",
      courseSlug,
      courseTitle,
      rating: overallRating,
      dimensions: {
        content: contentQuality,
        relevance: jobRelevance,
        visuals: visualsRating,
      },
      npsScore,
      comment: comment.trim(),
      userName,
      userEmail,
      subsidiary,
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(payload))
    } catch {}

    try {
      await fetch("/api/lms/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    } catch (e) {
      console.warn("Course feedback network call handled gracefully:", e)
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center flex flex-col items-center gap-3">
        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        <h4 className="font-heading text-base font-bold text-foreground">Course Evaluation Submitted</h4>
        <p className="text-xs text-muted-foreground max-w-md">
          Thank you for helping us continuously improve corporate training quality across the group.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8 rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="font-heading text-lg font-bold text-foreground">Course Evaluation & Feedback</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-6">
        Please take a moment to evaluate <strong>{courseTitle}</strong>. Your feedback directly shapes our training curriculum.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Overall Rating */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-foreground">Overall Course Rating</label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setOverallRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= overallRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-xs font-bold text-muted-foreground">{overallRating} / 5 Stars</span>
          </div>
        </div>

        {/* Content Quality */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-foreground">Content Clarity & Depth</label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setContentQuality(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-5 w-5 ${
                    star <= contentQuality ? "fill-primary text-primary" : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Job Relevance */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-foreground">Relevance to Your Daily Role</label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setJobRelevance(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-5 w-5 ${
                    star <= jobRelevance ? "fill-primary text-primary" : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Visuals & Interactivity */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-foreground">Visual Graphics & Deep Dives</label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setVisualsRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-5 w-5 ${
                    star <= visualsRating ? "fill-primary text-primary" : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NPS Question */}
      <div className="mb-6 pt-4 border-t border-border/60">
        <label className="text-xs font-semibold text-foreground block mb-2">
          How likely are you to recommend this training to a colleague? (0 = Unlikely, 10 = Highly Likely)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 11 }, (_, i) => i).map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => setNpsScore(score)}
              className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                npsScore === score
                  ? "bg-primary text-primary-foreground shadow-sm scale-105"
                  : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-foreground"
              }`}
            >
              {score}
            </button>
          ))}
        </div>
      </div>

      {/* Open Comment Box */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-foreground block mb-2">
          What was most valuable, or how can we improve this course? (Optional)
        </label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share any specific suggestions, topics you'd like to see added, or feedback for the curriculum team..."
          className="w-full rounded-xl border border-input bg-background p-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
        >
          {isSubmitting ? "Submitting..." : "Submit Evaluation"} <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
