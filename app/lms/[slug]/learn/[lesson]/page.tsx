import { getSessionUser } from "@/app/actions/auth"
import type { Metadata } from "next"
import type { Enrollment } from "@/lib/types"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"
import {
  getCourseBySlug,
  getMyCourseLearningState,
  getAdminCourseBySlug,
} from "@/app/actions/lms"
import { isSuperAdmin as checkIsSuperAdmin } from "@/lib/access-control"
import { getLessons } from "@/lib/lms-content"
import { Card, CardContent } from "@/components/ui/card"
import { LessonCompleteButton } from "@/components/lms/lesson-complete-button"
import { Flashcards } from "@/components/lms/flashcards"
import { ScormAccordion } from "@/components/lms/scorm-accordion"
import { LabeledGraphic } from "@/components/lms/labeled-graphic"
import { KnowledgeMatch } from "@/components/lms/knowledge-match"
import { InteractiveTabs } from "@/components/lms/interactive-tabs"
import { ArrowLeft, CheckCircle2, Circle, Clock, Lightbulb, Lock, Paperclip } from "lucide-react"
import { isCourseVisibleToUser } from "@/lib/utils"

function parseMarkdown(text: string) {
  let html = text
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-4 hover:text-primary/80">$1</a>')
  return html
}

type Params = { slug: string; lesson: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug, lesson: rawLesson } = await params
  const lesson = decodeURIComponent(rawLesson)
  const course = await getCourseBySlug(slug)
  if (!course) return { title: "Lesson not found | EIB Group LMS" }
  const found = getLessons(course).find((l) => l.key === lesson)
  return { title: `${found?.title ?? "Lesson"} · ${course.title} | EIB Group LMS` }
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { slug, lesson: rawLessonKey } = await params
  const lessonKey = decodeURIComponent(rawLessonKey)
  
  const user = await getSessionUser();
  const session = user ? { user } : null

  const isSuperAdmin = user && checkIsSuperAdmin(user)
  const course = isSuperAdmin ? await getAdminCourseBySlug(slug) : await getCourseBySlug(slug)
  
  if (!course) notFound()

  const lessons = getLessons(course)
  const index = lessons.findIndex((l) => l.key === lessonKey)
  if (index === -1) notFound()
  const lesson = lessons[index]
  
  const isFreePreview = index < 2 || !!lesson.isPreview
  let enrollment: Enrollment | null = null
  let completedKeys = new Set<string>()

  if (session?.user) {
    const isVisible = isCourseVisibleToUser(
      course.subsidiaries,
      session.user.subsidiary || null,
      session.user.role || "learner",
      session.user.email || null
    )
    if (!isVisible) notFound()
    const learningState = await getMyCourseLearningState(course.id)
    enrollment = learningState?.enrollment ?? null
    completedKeys = new Set(learningState?.completedLessonKeys ?? [])
  }

  const canAccess = isFreePreview || !!enrollment
  if (!canAccess) {
    if (!session?.user) redirect(`/sign-in`)
    else redirect(`/lms/${slug}`)
  }

  // Enforce sequential progression for Lesson 4 (index 3) onwards
  // Lessons 1 and 2 are free previews, so they are exempt from strict completion locks.
  if (enrollment && index >= 3) {
    let firstLockedIndex = -1
    for (let i = 2; i < index; i++) {
      if (!completedKeys.has(lessons[i].key)) {
        firstLockedIndex = i
        break
      }
    }
    if (firstLockedIndex !== -1) {
      redirect(`/lms/${slug}/learn/${lessons[firstLockedIndex].key}`)
    }
  }

  const isLast = index === lessons.length - 1
  const nextHref = isLast ? `/lms/${slug}/quiz` : `/lms/${slug}/learn/${lessons[index + 1].key}`

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <Link
        href={`/lms/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {course.title}
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Lesson list */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Curriculum
          </p>
          <ol className="flex flex-col gap-1">
            {lessons.map((l, i) => {
              const done = completedKeys.has(l.key)
              const active = l.key === lessonKey
              
              const isLessonFreePreview = i < 2 || !!l.isPreview
              let isLocked = false
              if (!enrollment && !isLessonFreePreview) {
                isLocked = true
              } else if (enrollment && i >= 3) {
                for (let j = 2; j < i; j++) {
                  if (!completedKeys.has(lessons[j].key)) {
                    isLocked = true
                    break
                  }
                }
              }

              return (
                <li key={l.key}>
                  {isLocked ? (
                    <div className="flex items-start gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground opacity-50 cursor-not-allowed">
                      <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        <span className="block text-xs text-muted-foreground">Lesson {i + 1}</span>
                        {l.title}
                      </span>
                    </div>
                  ) : (
                    <Link
                      href={`/lms/${slug}/learn/${l.key}`}
                      className={`flex items-start gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-primary/10 font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--chart-1)]" />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 shrink-0" />
                      )}
                      <span>
                        <span className="block text-xs text-muted-foreground">Lesson {i + 1}</span>
                        {l.title}
                      </span>
                    </Link>
                  )}
                </li>
              )
            })}
            <li>
              {(!enrollment || !lessons.every(l => completedKeys.has(l.key))) ? (
                <div className="flex items-start gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground opacity-50 cursor-not-allowed">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <span className="block text-xs text-muted-foreground">Final</span>
                    Assessment
                  </span>
                </div>
              ) : (
                <Link
                  href={`/lms/${slug}/quiz`}
                  className="flex items-start gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
                >
                  <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <span className="block text-xs text-muted-foreground">Final</span>
                    Assessment
                  </span>
                </Link>
              )}
            </li>
          </ol>
        </aside>

        {/* Lesson content */}
        <article>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">
            Lesson {index + 1} of {lessons.length}
          </p>
          <h1 className="mt-2 text-balance font-heading text-3xl font-bold">{lesson.title}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /> ~{lesson.minutes} min · {lesson.summary}
          </p>

          {lesson.videoUrl && (
            <div className="mt-6 aspect-video w-full overflow-hidden rounded-xl border border-border shadow-sm">
              <iframe
                src={lesson.videoUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div className="mt-7 flex flex-col gap-7">
            {Array.isArray(lesson.sections) && lesson.sections.map((s, idx) => {
              if (idx === 0) {
                const bodyArray = Array.isArray(s.body) ? s.body : (typeof s.body === 'string' ? [s.body] : [])
                return (
                  <section key={s.heading || `section-${idx}`}>
                    <h2 className="font-heading text-xl font-bold">{String(s.heading || "Introduction")}</h2>
                    <div className="mt-2 flex flex-col gap-3">
                      {bodyArray.map((p, i) => (
                        <p 
                          key={i} 
                          className="text-pretty leading-relaxed text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: parseMarkdown(String(p)) }}
                        />
                      ))}
                    </div>
                  </section>
                )
              }
              return null
            })}

            {Array.isArray(lesson.sections) && lesson.sections.length > 1 && (
              <ScormAccordion sections={lesson.sections.slice(1)} />
            )}
          </div>

          {Array.isArray(lesson.attachments) && lesson.attachments.length > 0 && (
            <div className="mt-8 flex flex-col gap-3">
              <h3 className="font-heading text-lg font-bold">Attachments & Links</h3>
              <div className="flex flex-col gap-2">
                {lesson.attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att?.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    <Paperclip className="h-4 w-4" />
                    {att?.title || att?.url || "Link"}
                  </a>
                ))}
              </div>
            </div>
          )}

          {lesson.labeledGraphic?.imageUrl && (
            <div className="mt-12">
              <LabeledGraphic data={lesson.labeledGraphic} />
            </div>
          )}

          {lesson.knowledgeCheck && (
            <div id="knowledge-check-section" className="mt-12 scroll-mt-24">
              <KnowledgeMatch question={lesson.knowledgeCheck} onPassed={(passed) => {
                // Store passed state in a data attribute for the button to read
                const section = document.getElementById("knowledge-check-section")
                if (section) {
                  section.dataset.passed = "true"
                }
              }} />
            </div>
          )}

          {Array.isArray(lesson.interactiveTabs) && lesson.interactiveTabs.length > 0 && (
            <div className="mt-12">
              <h3 className="font-heading text-xl font-bold mb-4">Deep Dive</h3>
              <InteractiveTabs tabs={lesson.interactiveTabs} />
            </div>
          )}

          {Array.isArray(lesson.takeaways) && lesson.takeaways.length > 0 && (
            <div className="mt-12">
              <h3 className="flex items-center gap-2 font-heading text-xl font-bold mb-5">
                <Lightbulb className="h-5 w-5 text-accent" /> Key Takeaways
              </h3>
              <Flashcards takeaways={lesson.takeaways} />
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
            <div className="flex items-center gap-4">
              {index > 0 ? (
                <Link
                  href={`/lms/${slug}/learn/${lessons[index - 1].key}`}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Previous lesson
                </Link>
              ) : (
                <span />
              )}
              <Link
                href={`/lms/${slug}`}
                className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline-block"
              >
                Return to Course Home
              </Link>
            </div>
            {enrollment ? (
              <LessonCompleteButton
                courseId={course.id}
                lessonKey={lesson.key}
                alreadyComplete={completedKeys.has(lesson.key)}
                nextHref={nextHref}
                isLast={isLast}
                hasKnowledgeCheck={!!lesson.knowledgeCheck}
              />
            ) : (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300 flex items-center justify-between gap-4 w-full sm:w-auto mt-4 sm:mt-0 flex-col sm:flex-row">
                <span><strong>Enjoying this preview?</strong> Sign in and enroll to access the full course and track your progress.</span>
                <Link href="/sign-in" className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700">
                  Sign In to Enroll
                </Link>
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  )
}
