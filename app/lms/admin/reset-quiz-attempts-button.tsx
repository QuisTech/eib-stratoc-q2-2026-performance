"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { adminResetQuizAttempts } from "@/app/actions/lms"
import { Loader2, RotateCcw } from "lucide-react"

export function ResetQuizAttemptsButton({
  userId,
  userName,
  enrolledCourses,
}: {
  userId: string
  userName: string
  enrolledCourses: { courseId: number; title: string }[]
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState("")

  async function handleReset() {
    if (!selectedCourse) return

    const course = enrolledCourses.find((c) => c.courseId === parseInt(selectedCourse))
    if (!course) return

    if (!confirm(`Are you sure you want to reset quiz attempts for ${userName} in "${course.title}"? They will have to retake the quiz.`)) {
      return
    }

    setLoading(true)
    try {
      await adminResetQuizAttempts(userId, course.courseId)
      alert(`Quiz attempts reset for ${userName} in ${course.title}.`)
      setOpen(false)
      setSelectedCourse("")
    } catch (e) {
      alert("Failed to reset quiz attempts. You might not have permission.")
    } finally {
      setLoading(false)
    }
  }

  if (enrolledCourses.length === 0) return null

  if (!open) {
    return (
      <Button variant="outline" size="sm" className="mr-2" onClick={() => setOpen(true)}>
        <RotateCcw className="mr-2 h-3.5 w-3.5" />
        Reset Quiz
      </Button>
    )
  }

  return (
    <div className="mr-2 inline-flex items-center gap-2">
      <select 
        className="h-8 rounded-md border border-input bg-background px-2 text-xs ring-offset-background"
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="">Select course...</option>
        {enrolledCourses.map((c) => (
          <option key={c.courseId} value={c.courseId}>
            {c.title}
          </option>
        ))}
      </select>
      <Button 
        size="sm" 
        onClick={handleReset} 
        disabled={loading || !selectedCourse}
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm"}
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => { setOpen(false); setSelectedCourse("") }}
        disabled={loading}
      >
        Cancel
      </Button>
    </div>
  )
}
