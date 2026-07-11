import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import {
  getCourseBySlug,
  getMyEnrollmentForCourse,
  getMyLessonProgress,
} from "@/app/actions/lms"
import { getLessons } from "@/lib/lms-content"
import { Card, CardContent } from "@/components/ui/card"
import { LessonCompleteButton } from "@/components/lms/lesson-complete-button"
import { Flashcards } from "@/components/lms/flashcards"
import { ScormAccordion } from "@/components/lms/scorm-accordion"
import { LabeledGraphic } from "@/components/lms/labeled-graphic"
import { KnowledgeMatch } from "@/components/lms/knowledge-match"
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
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect(`/sign-in`)

  // Enforce subsidiary visibility check
  const isVisible = isCourseVisibleToUser(
    course.subsidiaries,
    session.user.subsidiary || null,
    session.user.role || "learner",
    session.user.email || null
  )
  if (!isVisible) {
    notFound()
  }

  const enrollment = await getMyEnrollmentForCourse(course.id)
  if (!enrollment) redirect(`/lms/${slug}`)

  const lessons = getLessons(course)
  const index = lessons.findIndex((l) => l.key === lessonKey)
  if (index === -1) notFound()
  const lesson = lessons[index]

  const completedKeys = new Set(await getMyLessonProgress(course.id))
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
              return (
                <li key={l.key}>
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
                </li>
              )
            })}
            <li>
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
            {lesson.sections.map((s, idx) => {
              if (idx === 0) {
                return (
                  <section key={s.heading}>
                    <h2 className="font-heading text-xl font-bold">{s.heading}</h2>
                    <div className="mt-2 flex flex-col gap-3">
                      {s.body.map((p, i) => (
                        <p 
                          key={i} 
                          className="text-pretty leading-relaxed text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: parseMarkdown(p) }}
                        />
                      ))}
                    </div>
                  </section>
                )
              }
              return null
            })}

            {lesson.sections.length > 1 && (
              <ScormAccordion sections={lesson.sections.slice(1)} />
            )}
          </div>

          {lesson.attachments && lesson.attachments.length > 0 && (
            <div className="mt-8 flex flex-col gap-3">
              <h3 className="font-heading text-lg font-bold">Attachments & Links</h3>
              <div className="flex flex-col gap-2">
                {lesson.attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    <Paperclip className="h-4 w-4" />
                    {att.title || att.url}
                  </a>
                ))}
              </div>
            </div>
          )}

          {lesson.knowledgeCheck && (
            <div className="mt-12">
              <KnowledgeMatch question={lesson.knowledgeCheck} />
            </div>
          )}

          <div className="mt-12">
            <h3 className="flex items-center gap-2 font-heading text-xl font-bold mb-5">
              <Lightbulb className="h-5 w-5 text-accent" /> Key Takeaways
            </h3>
            <Flashcards takeaways={lesson.takeaways} />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
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
            <LessonCompleteButton
              courseId={course.id}
              lessonKey={lesson.key}
              alreadyComplete={completedKeys.has(lesson.key)}
              nextHref={nextHref}
              isLast={isLast}
            />
          </div>
        </article>
      </div>
    </main>
  )
}
