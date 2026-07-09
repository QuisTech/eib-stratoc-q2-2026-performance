"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveCustomCourseContent } from "@/app/actions/lms"
import { generateCourseContentWithGemini } from "@/app/actions/gemini"
import { ArrowLeft, Plus, Trash2, Save, Loader2, HelpCircle, Sparkles } from "lucide-react"
import Link from "next/link"

export default function CourseBuilderClient({ course, userRole }: { course: any; userRole: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize state from existing customContent if it exists
  let initialLessons = []
  let initialQuiz = []
  if (course.customContent) {
    try {
      const parsed = JSON.parse(course.customContent)
      initialLessons = parsed.lessons || []
      initialQuiz = parsed.quiz || []
    } catch (e) {}
  }

  const [lessons, setLessons] = useState<any[]>(initialLessons)
  const [quiz, setQuiz] = useState<any[]>(initialQuiz)
  const [isGenerating, setIsGenerating] = useState(false)
  const [customContext, setCustomContext] = useState("")
  const [showContextBox, setShowContextBox] = useState(false)

  async function handleGenerateWithGemini() {
    setIsGenerating(true)
    setError(null)
    try {
      const generated = await generateCourseContentWithGemini(course.title, course.category || "General", customContext || undefined)
      if (generated.error) {
        setError(generated.error)
      } else {
        setLessons(generated.lessons)
        setQuiz(generated.quiz)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleSave() {
    setLoading(true)
    setError(null)
    try {
      const payload = { lessons, quiz }
      await saveCustomCourseContent(course.slug, JSON.stringify(payload))
      router.push("/lms/admin")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  // --- Lessons Logic ---
  const addLesson = () => {
    setLessons([
      ...lessons,
      {
        key: `lesson-${Date.now()}`,
        title: "New Lesson",
        minutes: 15,
        summary: "",
        videoUrl: "",
        sections: [{ heading: "", body: [""] }],
        takeaways: [""],
        attachments: [],
      },
    ])
  }

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index))
  }

  const updateLesson = (index: number, field: string, value: any) => {
    const updated = [...lessons]
    updated[index] = { ...updated[index], [field]: value }
    setLessons(updated)
  }

  const updateSection = (lessonIndex: number, sectionIndex: number, field: string, value: string) => {
    const updated = [...lessons]
    updated[lessonIndex].sections[sectionIndex] = { ...updated[lessonIndex].sections[sectionIndex], [field]: value }
    setLessons(updated)
  }

  const updateSectionBody = (lessonIndex: number, sectionIndex: number, value: string) => {
    const updated = [...lessons]
    // split text area by double newlines into array
    updated[lessonIndex].sections[sectionIndex].body = value.split("\n\n")
    setLessons(updated)
  }

  const addSection = (lessonIndex: number) => {
    const updated = [...lessons]
    updated[lessonIndex].sections.push({ heading: "", body: [""] })
    setLessons(updated)
  }

  const addAttachment = (lessonIndex: number) => {
    const updated = [...lessons]
    if (!updated[lessonIndex].attachments) updated[lessonIndex].attachments = []
    updated[lessonIndex].attachments.push({ title: "", url: "" })
    setLessons(updated)
  }

  const updateAttachment = (lessonIndex: number, attIndex: number, field: string, value: string) => {
    const updated = [...lessons]
    updated[lessonIndex].attachments[attIndex] = { ...updated[lessonIndex].attachments[attIndex], [field]: value }
    setLessons(updated)
  }

  const removeAttachment = (lessonIndex: number, attIndex: number) => {
    const updated = [...lessons]
    updated[lessonIndex].attachments = updated[lessonIndex].attachments.filter((_: any, i: number) => i !== attIndex)
    setLessons(updated)
  }

  // --- Quiz Logic ---
  const addQuestion = () => {
    setQuiz([
      ...quiz,
      {
        id: `q-${Date.now()}`,
        prompt: "",
        options: ["", "", "", ""],
        correctIndex: 0,
        explanation: "",
      },
    ])
  }

  const removeQuestion = (index: number) => {
    setQuiz(quiz.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...quiz]
    updated[index] = { ...updated[index], [field]: value }
    setQuiz(updated)
  }

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...quiz]
    updated[qIndex].options[optIndex] = value
    setQuiz(updated)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/lms/admin"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="mb-8 flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
            Custom Content Builder: {course.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your own lessons and quiz questions. When saved, this overrides the Generative Engine.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {userRole === "admin" && (
            <button
              onClick={handleGenerateWithGemini}
              disabled={isGenerating || loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Spark with Gemini (Admin Only)
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={loading || isGenerating}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Content
          </button>
        </div>
      </div>

      {/* AI Context Box — only visible to admin */}
      {userRole === "admin" && (
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowContextBox(!showContextBox)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {showContextBox ? "Hide" : "Show"} AI Context & Instructions
          </button>
          {showContextBox && (
            <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-800 dark:bg-indigo-950/30">
              <label className="block text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1">
                Custom Instructions for AI Generation
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Give the AI extra context about this specific course. E.g., &quot;This course is for PSAP emergency dispatchers&quot; or &quot;Focus on Nigerian financial regulations&quot;. The AI already knows EIB Group&apos;s subsidiaries and structure.
              </p>
              <textarea
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="e.g. This course targets DCI-PSAP staff. Focus on emergency call handling protocols, OSINT techniques, and Nigerian emergency response standards..."
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}
        </div>
      )}

      {error && <div className="mb-6 rounded-md bg-destructive/15 p-4 text-sm font-medium text-destructive">{error}</div>}

      {/* LESSONS SECTION */}
      <div className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Lessons</h2>
          <button
            onClick={addLesson}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:bg-accent/80"
          >
            <Plus className="h-4 w-4" /> Add Lesson
          </button>
        </div>

        {lessons.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No lessons added yet. Click "Add Lesson" to begin.
          </div>
        )}

        <div className="space-y-6">
          {lessons.map((lesson, lIndex) => (
            <div key={lesson.key} className="relative rounded-lg border bg-card p-6 shadow-sm">
              <button
                onClick={() => removeLesson(lIndex)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-5 w-5" />
              </button>

              <div className="mb-6 grid gap-4 md:grid-cols-2 pr-8">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lesson Title</label>
                  <input
                    value={lesson.title}
                    onChange={(e) => updateLesson(lIndex, "title", e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    placeholder="e.g. Introduction"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Video URL (Optional)</label>
                  <input
                    value={lesson.videoUrl || ""}
                    onChange={(e) => updateLesson(lIndex, "videoUrl", e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    placeholder="e.g. https://www.youtube.com/embed/..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Summary</label>
                <input
                  value={lesson.summary}
                  onChange={(e) => updateLesson(lIndex, "summary", e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm mb-6"
                  placeholder="A brief summary of what this lesson covers"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content Sections</label>
                <div className="space-y-4">
                  {lesson.sections.map((sec: any, sIndex: number) => (
                    <div key={sIndex} className="rounded-md border bg-muted/30 p-4">
                      <input
                        value={sec.heading}
                        onChange={(e) => updateSection(lIndex, sIndex, "heading", e.target.value)}
                        className="mb-3 w-full font-medium bg-transparent border-b focus:outline-none focus:border-primary placeholder:text-muted-foreground"
                        placeholder="Section Heading"
                      />
                      <textarea
                        value={sec.body.join("\n\n")}
                        onChange={(e) => updateSectionBody(lIndex, sIndex, e.target.value)}
                        className="w-full min-h-[100px] resize-y rounded-md border bg-background p-3 text-sm"
                        placeholder="Paragraph 1 (Supports Markdown: **bold**, *italic*, [link](url))&#10;&#10;Paragraph 2"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addSection(lIndex)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    + Add Section
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Takeaways (one per line)</label>
                <textarea
                  value={lesson.takeaways.join("\n")}
                  onChange={(e) => updateLesson(lIndex, "takeaways", e.target.value.split("\n"))}
                  className="w-full resize-y rounded-md border bg-background p-3 text-sm mb-6"
                  rows={3}
                  placeholder="Takeaway 1&#10;Takeaway 2"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attachments & Links</label>
                <div className="space-y-3">
                  {(lesson.attachments || []).map((att: any, aIndex: number) => (
                    <div key={aIndex} className="flex items-center gap-2">
                      <input
                        value={att.title}
                        onChange={(e) => updateAttachment(lIndex, aIndex, "title", e.target.value)}
                        className="w-1/3 rounded-md border bg-background px-3 py-2 text-sm"
                        placeholder="Link Title (e.g. PDF Guide)"
                      />
                      <input
                        value={att.url}
                        onChange={(e) => updateAttachment(lIndex, aIndex, "url", e.target.value)}
                        className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                        placeholder="URL (https://...)"
                      />
                      <button
                        onClick={() => removeAttachment(lIndex, aIndex)}
                        className="p-2 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addAttachment(lIndex)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    + Add Attachment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUIZ SECTION */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Quiz Questions
          </h2>
          <button
            onClick={addQuestion}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:bg-accent/80"
          >
            <Plus className="h-4 w-4" /> Add Question
          </button>
        </div>

        {quiz.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No quiz questions added. The course will not have an assessment if left empty.
          </div>
        )}

        <div className="space-y-6">
          {quiz.map((q, qIndex) => (
            <div key={q.id} className="relative rounded-lg border bg-card p-6 shadow-sm">
              <button
                onClick={() => removeQuestion(qIndex)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-5 w-5" />
              </button>

              <div className="mb-4 pr-8">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Question Prompt</label>
                <input
                  value={q.prompt}
                  onChange={(e) => updateQuestion(qIndex, "prompt", e.target.value)}
                  className="w-full font-medium rounded-md border bg-background px-3 py-2"
                  placeholder="What is..."
                />
              </div>

              <div className="mb-4 space-y-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Options (Select the correct one)</label>
                {q.options.map((opt: string, oIndex: number) => (
                  <div key={oIndex} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correctIndex === oIndex}
                      onChange={() => updateQuestion(qIndex, "correctIndex", oIndex)}
                      className="h-4 w-4 text-primary"
                    />
                    <input
                      value={opt}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      placeholder={`Option ${oIndex + 1}`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explanation (Shown after answering)</label>
                <input
                  value={q.explanation}
                  onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Why is this the correct answer?"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
