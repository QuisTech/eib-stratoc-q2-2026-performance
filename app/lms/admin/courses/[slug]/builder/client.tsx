"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { saveCustomCourseContent } from "@/app/actions/lms"
import { ArrowLeft, Plus, Trash2, Save, Loader2, HelpCircle, Sparkles, Square, Upload } from "lucide-react"

import Link from "next/link"
import { GraphicBuilder } from "@/components/lms/graphic-builder"
import { courseSchema } from "@/lib/lms-schema"

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
  const [customContext, setCustomContext] = useState("")
  const [showContextBox, setShowContextBox] = useState(false)

  const appendMode = useRef<"none" | "lesson" | "quiz">("none")

  const [isGenerating, setIsGenerating] = useState(false)

  // --- Surgical Section Refine State & Logic ---
  const [activeRefineSec, setActiveRefineSec] = useState<{ lIndex: number; sIndex: number } | null>(null)
  const [refinePrompt, setRefinePrompt] = useState("")
  const [isRefining, setIsRefining] = useState(false)
  const [refineSuccessMsg, setRefineSuccessMsg] = useState<string | null>(null)

  // --- Tab & Knowledge Check Generation State ---
  const [generatingTabForLesson, setGeneratingTabForLesson] = useState<number | null>(null)
  const [generatingKcForLesson, setGeneratingKcForLesson] = useState<number | null>(null)
  const [highlightedLessonKey, setHighlightedLessonKey] = useState<string | null>(null)
  const [incomingFeedback, setIncomingFeedback] = useState<string | null>(null)

  // Handle URL Params on mount (?lesson=...&feedback=...)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const lessonParam = params.get("lesson")
      const feedbackParam = params.get("feedback")

      if (lessonParam || feedbackParam) {
        if (lessonParam) {
          setHighlightedLessonKey(lessonParam)
          setTimeout(() => {
            const el = document.getElementById(`lesson-card-${lessonParam}`)
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" })
            }
          }, 350)
        }
        if (feedbackParam) {
          setIncomingFeedback(feedbackParam)
          setRefinePrompt(`Incorporate staff feedback: ${feedbackParam}`)
        }
      }
    }
  }, [])

  const handleRefineSection = async (lIndex: number, sIndex: number, promptText?: string) => {
    const pText = (promptText || refinePrompt || "").trim()
    if (!pText) return

    setIsRefining(true)
    setError(null)
    setRefineSuccessMsg(null)

    const sec = lessons[lIndex]?.sections?.[sIndex]
    if (!sec) return

    try {
      const res = await fetch("/api/lms/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "refine_section",
          title: course.title,
          category: course.category || "General",
          lessonTitle: lessons[lIndex]?.title || "Lesson",
          sectionHeading: sec.heading || "Section",
          sectionBody: sec.body || [],
          customContext: pText,
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to refine section.")
      }

      if (data.body) {
        const updated = [...lessons]
        updated[lIndex].sections[sIndex] = {
          heading: data.heading || sec.heading,
          body: Array.isArray(data.body) ? data.body : [String(data.body)],
        }
        setLessons(updated)
        setRefineSuccessMsg("Section refined successfully!")
        setTimeout(() => setRefineSuccessMsg(null), 4000)
      }
    } catch (err: any) {
      console.error("Section refine error:", err)
      setError(err.message || "Failed to refine section.")
    } finally {
      setIsRefining(false)
    }
  }

  const handleGenerateTab = async (lIndex: number, tabPrompt?: string) => {
    setGeneratingTabForLesson(lIndex)
    setError(null)

    try {
      const res = await fetch("/api/lms/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_tab",
          title: course.title,
          category: course.category || "General",
          lessonTitle: lessons[lIndex]?.title,
          customContext: tabPrompt || "Real-World Nigerian Corporate Case Study with operational execution and key lessons learned.",
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to generate interactive tab.")
      }

      if (data.tabTitle && data.content) {
        const updated = [...lessons]
        if (!Array.isArray(updated[lIndex].interactiveTabs)) {
          updated[lIndex].interactiveTabs = []
        }
        updated[lIndex].interactiveTabs.push({
          tabTitle: data.tabTitle,
          content: data.content,
        })
        setLessons(updated)
      }
    } catch (err: any) {
      console.error("Tab generate error:", err)
      setError(err.message || "Failed to generate tab.")
    } finally {
      setGeneratingTabForLesson(null)
    }
  }

  const handleGenerateKnowledgeCheck = async (lIndex: number) => {
    setGeneratingKcForLesson(lIndex)
    setError(null)

    try {
      const res = await fetch("/api/lms/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_knowledge_check",
          title: course.title,
          category: course.category || "General",
          lessonTitle: lessons[lIndex]?.title,
          lessonSummary: lessons[lIndex]?.summary,
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to generate knowledge check.")
      }

      if (data.knowledgeCheck) {
        const updated = [...lessons]
        updated[lIndex].knowledgeCheck = data.knowledgeCheck
        setLessons(updated)
      }
    } catch (err: any) {
      console.error("Knowledge check generate error:", err)
      setError(err.message || "Failed to generate knowledge check.")
    } finally {
      setGeneratingKcForLesson(null)
    }
  }

  const updateInteractiveTab = (lIndex: number, tIndex: number, field: string, value: string) => {
    const updated = [...lessons]
    updated[lIndex].interactiveTabs[tIndex] = {
      ...updated[lIndex].interactiveTabs[tIndex],
      [field]: value,
    }
    setLessons(updated)
  }

  const removeInteractiveTab = (lIndex: number, tIndex: number) => {
    const updated = [...lessons]
    updated[lIndex].interactiveTabs = updated[lIndex].interactiveTabs.filter((_: any, i: number) => i !== tIndex)
    setLessons(updated)
  }
  
  async function submitGeneration(payload: any, mode: "none" | "lesson" | "quiz") {
    setIsGenerating(true)
    setError(null)
    appendMode.current = mode
    
    try {
      const response = await fetch("/api/lms/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content.")
      }
      
      if (data.error) {
        throw new Error(`Server Error: ${data.error}`)
      }
      
      if (!data.lessons?.length && !data.quiz?.length) {
        throw new Error("AI returned an empty response. The content may have been blocked by safety filters or there is a configuration error.")
      }
      
      if (data.lessons && mode === "lesson") {
        setLessons((prev) => [...prev, ...data.lessons])
      } else if (data.quiz && mode === "quiz") {
        setQuiz((prev) => [...prev, ...data.quiz])
      } else if (mode === "none") {
        if (data.lessons) setLessons(data.lessons)
        if (data.quiz) setQuiz(data.quiz)
      }
    } catch (err: any) {
      console.error("Generation error:", err)
      setError(err.message || "Failed to generate content.")
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleGenerateWithGemini() {
    await submitGeneration({
      title: course.title,
      category: course.category || "General",
      customContext: customContext || undefined,
      existingLessons: lessons,
      existingQuiz: quiz
    }, "none")
  }

  async function handleAppendWithGemini() {
    await submitGeneration({
      title: course.title,
      category: course.category || "General",
      customContext: customContext || undefined,
      existingLessons: lessons,
      existingQuiz: quiz,
      action: "append_lesson"
    }, "lesson")
  }

  async function handleAppendQuizWithGemini() {
    await submitGeneration({
      title: course.title,
      category: course.category || "General",
      customContext: customContext || undefined,
      existingLessons: lessons,
      existingQuiz: quiz,
      action: "append_quiz"
    }, "quiz")
  }

  // Determine what to display while generating vs resting
  const displayLessons = lessons
  const displayQuiz = quiz
  const isLoading = isGenerating

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

  const handleFileUpload = async (lessonIndex: number, attIndex: number, file: File) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload file")
      }

      // Update the attachment with the uploaded file URL
      updateAttachment(lessonIndex, attIndex, "url", data.url)
      if (!lessons[lessonIndex].attachments[attIndex].title) {
        updateAttachment(lessonIndex, attIndex, "title", file.name)
      }
    } catch (error: any) {
      console.error("File upload error:", error)
      alert(error.message || "Failed to upload file")
    }
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
            <div className="flex gap-2">
              {isLoading ? (
                <button
                  onClick={() => stop()}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-red-600 px-6 text-sm font-medium text-white hover:bg-red-700"
                >
                  <Square className="h-4 w-4" fill="currentColor" />
                  Stop Streaming
                </button>
              ) : (
                <button
                  onClick={handleGenerateWithGemini}
                  disabled={loading}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  Spark Course with Gemini
                </button>
              )}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={loading || isLoading}
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

      {incomingFeedback && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50/80 p-4 dark:border-amber-900/60 dark:bg-amber-950/30 flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                Staff Feedback Linked
              </h4>
              <p className="text-sm font-medium text-amber-950 dark:text-amber-100 mt-0.5">
                &ldquo;{incomingFeedback}&rdquo;
              </p>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1">
                Target lesson focused. Click <strong>✨ AI Refine</strong> on any section below to apply this feedback in-place.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIncomingFeedback(null)}
            className="text-xs text-amber-800 dark:text-amber-300 hover:text-foreground font-semibold"
          >
            ✕ Dismiss
          </button>
        </div>
      )}

      {error && <div className="mb-6 rounded-md bg-destructive/15 p-4 text-sm font-medium text-destructive">{error}</div>}

      {/* LESSONS SECTION */}
      <div className="mb-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Lessons</h2>
          <div className="flex gap-2">
            {userRole === "admin" && (
              <button
                onClick={handleAppendWithGemini}
                disabled={isLoading || loading}
                className="inline-flex items-center gap-1.5 rounded-md bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-200 disabled:opacity-50"
              >
                {isLoading && appendMode.current === "lesson" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Append Lesson with Spark
              </button>
            )}
            <button
              onClick={addLesson}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:bg-accent/80 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add Lesson
            </button>
          </div>
        </div>

        {displayLessons.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No lessons added yet. Click "Add Lesson" to begin.
          </div>
        )}

        <div className="space-y-8">
          {displayLessons.map((lesson, lIndex) => {
            const isFocused =
              highlightedLessonKey === lesson.key ||
              highlightedLessonKey === `lesson-${lIndex + 1}` ||
              highlightedLessonKey === String(lIndex)

            return (
              <div
                key={lesson.key || lIndex}
                id={`lesson-card-${lesson.key || lIndex}`}
                className={`relative rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 ${
                  isFocused ? "ring-2 ring-indigo-500 shadow-indigo-100 dark:shadow-indigo-950/50" : ""
                } ${isLoading ? "opacity-70 pointer-events-none" : ""}`}
              >
                <button
                  onClick={() => removeLesson(lIndex)}
                  className="absolute right-4 top-4 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

                {isFocused && (
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950 px-3 py-1 text-xs font-semibold text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
                    <Sparkles className="h-3 w-3 text-indigo-600" /> Target Lesson from Feedback
                  </div>
                )}

                <div className="mb-6 grid gap-4 md:grid-cols-2 pr-8">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lesson Title</label>
                    <input
                      value={lesson.title || ""}
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

                <div className="mb-6 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`preview-${lIndex}`}
                    checked={lesson.isPreview || false}
                    onChange={(e) => updateLesson(lIndex, "isPreview", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor={`preview-${lIndex}`} className="text-sm font-medium text-foreground">
                    Make this lesson a Free Preview
                  </label>
                  <span className="text-xs text-muted-foreground ml-2">(Allows users to view this lesson without logging in/enrolling)</span>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Summary</label>
                  <input
                    value={lesson.summary || ""}
                    onChange={(e) => updateLesson(lIndex, "summary", e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm mb-6"
                    placeholder="A brief summary of what this lesson covers"
                  />
                </div>

                <div className="mb-4">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content Sections</label>
                  <div className="space-y-4">
                    {(lesson.sections || []).map((sec: any, sIndex: number) => {
                      const isRefiningThis =
                        activeRefineSec?.lIndex === lIndex && activeRefineSec?.sIndex === sIndex

                      return (
                        <div key={sIndex} className="rounded-md border bg-muted/30 p-4">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <input
                              value={sec.heading || ""}
                              onChange={(e) => updateSection(lIndex, sIndex, "heading", e.target.value)}
                              className="w-full font-medium bg-transparent border-b focus:outline-none focus:border-primary placeholder:text-muted-foreground text-sm"
                              placeholder="Section Heading"
                            />
                            {userRole === "admin" && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (isRefiningThis) {
                                    setActiveRefineSec(null)
                                  } else {
                                    setActiveRefineSec({ lIndex, sIndex })
                                    if (!refinePrompt && incomingFeedback) {
                                      setRefinePrompt(`Incorporate staff feedback: ${incomingFeedback}`)
                                    }
                                  }
                                }}
                                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 transition-colors"
                                title="Surgically improve this section with AI"
                              >
                                <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                <span>AI Refine</span>
                              </button>
                            )}
                          </div>

                          {/* Active Section AI Refine Drawer */}
                          {isRefiningThis && (
                            <div className="mb-3 rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 dark:border-indigo-800/80 dark:bg-indigo-950/40 animate-in fade-in slide-in-from-top-1 duration-150">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Refine this section in-place
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setActiveRefineSec(null)}
                                  className="text-[11px] text-muted-foreground hover:text-foreground"
                                >
                                  ✕ Close
                                </button>
                              </div>

                              {/* Quick Presets */}
                              <div className="flex flex-wrap gap-1.5 mb-2.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const p = incomingFeedback
                                      ? `Incorporate staff feedback: ${incomingFeedback}`
                                      : "Incorporate learner feedback to make this section clearer, more engaging, and address common points of confusion."
                                    setRefinePrompt(p)
                                    handleRefineSection(lIndex, sIndex, p)
                                  }}
                                  disabled={isRefining}
                                  className="rounded-full bg-white dark:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-700 px-2.5 py-0.5 text-[11px] font-medium text-indigo-800 dark:text-indigo-200 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                                >
                                  💬 Incorporate Staff Feedback
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const p = "Add a concrete, realistic Nigerian corporate case example with step-by-step execution and outcomes."
                                    setRefinePrompt(p)
                                    handleRefineSection(lIndex, sIndex, p)
                                  }}
                                  disabled={isRefining}
                                  className="rounded-full bg-white dark:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-700 px-2.5 py-0.5 text-[11px] font-medium text-indigo-800 dark:text-indigo-200 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                                >
                                  🇳🇬 Add Nigerian Case Example
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const p = "Make this section much more technical, detailed, and actionable for senior operators."
                                    setRefinePrompt(p)
                                    handleRefineSection(lIndex, sIndex, p)
                                  }}
                                  disabled={isRefining}
                                  className="rounded-full bg-white dark:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-700 px-2.5 py-0.5 text-[11px] font-medium text-indigo-800 dark:text-indigo-200 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                                >
                                  ⚡ Make More Technical & In-Depth
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const p = "Simplify the text, make it punchy, and structure key takeaways into clear bullet points."
                                    setRefinePrompt(p)
                                    handleRefineSection(lIndex, sIndex, p)
                                  }}
                                  disabled={isRefining}
                                  className="rounded-full bg-white dark:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-700 px-2.5 py-0.5 text-[11px] font-medium text-indigo-800 dark:text-indigo-200 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                                >
                                  📋 Format with Clear Bullet Points
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={refinePrompt}
                                  onChange={(e) => setRefinePrompt(e.target.value)}
                                  placeholder="Type custom instructions or paste feedback..."
                                  className="flex-1 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRefineSection(lIndex, sIndex)}
                                  disabled={isRefining || !refinePrompt.trim()}
                                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                                >
                                  {isRefining ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                                  {isRefining ? "Rewriting..." : "Refine Now"}
                                </button>
                              </div>
                              {refineSuccessMsg && (
                                <p className="mt-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                  ✓ {refineSuccessMsg}
                                </p>
                              )}
                            </div>
                          )}

                          <textarea
                            value={(sec.body || []).join("\n\n")}
                            onChange={(e) => updateSectionBody(lIndex, sIndex, e.target.value)}
                            className="w-full min-h-[100px] resize-y rounded-md border bg-background p-3 text-sm"
                            placeholder="Paragraph 1 (Supports Markdown: **bold**, *italic*, [link](url))&#10;&#10;Paragraph 2"
                          />
                        </div>
                      )
                    })}
                    <button
                      onClick={() => addSection(lIndex)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      + Add Section
                    </button>
                  </div>
                </div>

                {/* Interactive Deep-Dive Tabs Section */}
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                        Interactive Deep-Dive Tabs ({lesson.interactiveTabs?.length || 0})
                      </label>
                      <p className="text-[11px] text-muted-foreground">
                        Tabbed UI for case studies, operational frameworks, or deep dive analysis.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {userRole === "admin" && (
                        <button
                          type="button"
                          onClick={() => handleGenerateTab(lIndex)}
                          disabled={generatingTabForLesson === lIndex}
                          className="inline-flex items-center gap-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                        >
                          {generatingTabForLesson === lIndex ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-indigo-600" />}
                          ✨ Add Case Study Tab
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...lessons]
                          if (!Array.isArray(updated[lIndex].interactiveTabs)) updated[lIndex].interactiveTabs = []
                          updated[lIndex].interactiveTabs.push({ tabTitle: "New Tab", content: "Tab content here..." })
                          setLessons(updated)
                        }}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        + Add Tab
                      </button>
                    </div>
                  </div>

                  {Array.isArray(lesson.interactiveTabs) && lesson.interactiveTabs.length > 0 && (
                    <div className="space-y-3">
                      {lesson.interactiveTabs.map((tab: any, tIndex: number) => (
                        <div key={tIndex} className="rounded-lg border bg-muted/20 p-3.5 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              value={tab.tabTitle || ""}
                              onChange={(e) => updateInteractiveTab(lIndex, tIndex, "tabTitle", e.target.value)}
                              className="font-semibold text-xs bg-transparent border-b focus:outline-none focus:border-primary w-full"
                              placeholder="Tab Title (e.g. Case Study: Crisis Response)"
                            />
                            <button
                              type="button"
                              onClick={() => removeInteractiveTab(lIndex, tIndex)}
                              className="text-muted-foreground hover:text-destructive p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <textarea
                            value={tab.content || ""}
                            onChange={(e) => updateInteractiveTab(lIndex, tIndex, "content", e.target.value)}
                            rows={4}
                            className="w-full rounded-md border bg-background p-2.5 text-xs font-normal"
                            placeholder="Markdown content for this tab..."
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lesson Knowledge Check Section */}
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                        Lesson Knowledge Check (Matching Exercise)
                      </label>
                      <p className="text-[11px] text-muted-foreground">
                        Interactive drag-and-drop checkpoint inside this lesson.
                      </p>
                    </div>
                    {userRole === "admin" && (
                      <button
                        type="button"
                        onClick={() => handleGenerateKnowledgeCheck(lIndex)}
                        disabled={generatingKcForLesson === lIndex}
                        className="inline-flex items-center gap-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                      >
                        {generatingKcForLesson === lIndex ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-indigo-600" />}
                        ✨ {lesson.knowledgeCheck ? "Regenerate Exercise" : "Add Knowledge Check"}
                      </button>
                    )}
                  </div>

                  {lesson.knowledgeCheck ? (
                    <div className="rounded-lg border bg-muted/20 p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          {lesson.knowledgeCheck.prompt || "Match the concepts:"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...lessons]
                            delete updated[lIndex].knowledgeCheck
                            setLessons(updated)
                          }}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {(lesson.knowledgeCheck.pairs || []).map((pair: any, pIdx: number) => (
                          <div key={pIdx} className="p-2 rounded bg-background border flex justify-between gap-2">
                            <span className="font-semibold text-primary">{pair.left}</span>
                            <span className="text-muted-foreground">➔ {pair.right}</span>
                          </div>
                        ))}
                      </div>
                      {lesson.knowledgeCheck.explanation && (
                        <p className="text-[11px] text-muted-foreground italic mt-1">
                          Explanation: {lesson.knowledgeCheck.explanation}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground/80 italic">No knowledge check configured for this lesson.</p>
                  )}
                </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Takeaways (one per line)</label>
                <textarea
                  value={(lesson.takeaways || []).join("\n")}
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
                      <label className="cursor-pointer p-2 text-muted-foreground hover:text-primary">
                        <Upload className="h-4 w-4" />
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.pptx,.ppt"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(lIndex, aIndex, file)
                          }}
                        />
                      </label>
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

              <div className="mt-6 border-t pt-6">
                <GraphicBuilder 
                  data={lesson.labeledGraphic} 
                  onChange={(data) => updateLesson(lIndex, "labeledGraphic", data)} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUIZ SECTION */}
      <div className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Course Final Quiz</h2>
          <div className="flex gap-2">
            {userRole === "admin" && (
              <button
                onClick={handleAppendQuizWithGemini}
                disabled={isLoading || loading}
                className="inline-flex items-center gap-1.5 rounded-md bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-200 disabled:opacity-50"
              >
                {isLoading && appendMode.current === "quiz" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Append 10 Questions with Spark
              </button>
            )}
            <button
              onClick={addQuestion}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:bg-accent/80 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add Question
            </button>
          </div>
        </div>

        {displayQuiz.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No quiz questions added yet.
          </div>
        )}

        <div className="space-y-8">
          {displayQuiz.map((q, qIndex) => (
            <div key={q.id || qIndex} className={`relative rounded-xl border bg-card p-6 shadow-sm ${isLoading ? "opacity-70 pointer-events-none" : ""}`}>
              <button
                onClick={() => removeQuestion(qIndex)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-5 w-5" />
              </button>

              <div className="mb-4 pr-8">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Question Prompt</label>
                <input
                  value={q.prompt || ""}
                  onChange={(e) => updateQuestion(qIndex, "prompt", e.target.value)}
                  className="w-full font-medium rounded-md border bg-background px-3 py-2"
                  placeholder="What is..."
                />
              </div>

              {q.type === "matching" ? (
                <div className="mb-4 space-y-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Matching Pairs</label>
                  {(q.pairs || []).map((pair: any, pIndex: number) => (
                    <div key={pIndex} className="flex items-center gap-2">
                      <div className="w-1/2 rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">{pair.left}</div>
                      <div className="w-1/2 rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">{pair.right}</div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-1">Editing pairs in the builder is disabled. Delete and recreate if needed.</p>
                </div>
              ) : (
                <div className="mb-4 space-y-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Options (Select the correct one)</label>
                  {(q.options || []).map((opt: string, oIndex: number) => (
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
              )}

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explanation (Shown after answering)</label>
                <input
                  value={q.explanation || ""}
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
