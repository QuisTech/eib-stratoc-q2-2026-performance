"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { submitQuiz } from "@/app/actions/lms"
import { Loader2, CheckCircle2, XCircle, Award, RotateCcw } from "lucide-react"

type ClientQuestion = { id: string; prompt: string; options: string[] }
type Result = { score: number; total: number; percent: number; passed: boolean }

export function QuizForm({
  courseId,
  slug,
  questions,
  passThreshold,
}: {
  courseId: number
  slug: string
  questions: ClientQuestion[]
  passThreshold: number
}) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const allAnswered = questions.every((_, i) => answers[i] !== undefined)

  function submit() {
    setError(null)
    if (!allAnswered) {
      setError("Please answer every question before submitting.")
      return
    }
    const ordered = questions.map((_, i) => answers[i])
    startTransition(async () => {
      try {
        const r = await submitQuiz(courseId, ordered)
        setResult(r)
        router.refresh()
      } catch {
        setError("Could not submit your quiz. Please try again.")
      }
    })
  }

  function retake() {
    setAnswers({})
    setResult(null)
    setError(null)
  }

  if (result) {
    return (
      <Card
        className="border-l-4"
        style={{ borderLeftColor: result.passed ? "var(--chart-1)" : "var(--destructive)" }}
      >
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          {result.passed ? (
            <CheckCircle2 className="h-14 w-14 text-[var(--chart-1)]" />
          ) : (
            <XCircle className="h-14 w-14 text-destructive" />
          )}
          <div>
            <h2 className="font-heading text-2xl font-bold">
              {result.passed ? "Assessment passed" : "Not quite there yet"}
            </h2>
            <p className="mt-1 text-muted-foreground">
              You scored {result.score} / {result.total} ({result.percent}%). A score of{" "}
              {passThreshold}% is required to pass.
            </p>
          </div>

          {result.passed ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href={`/lms/${slug}/certificate`} className={buttonVariants({ size: "lg" })}>
                <Award className="mr-2 h-4 w-4" /> View your certificate
              </Link>
              <Link
                href={`/lms/${slug}`}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Back to course
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={retake} size="lg">
                <RotateCcw className="mr-2 h-4 w-4" /> Retake assessment
              </Button>
              <Link
                href={`/lms/${slug}/learn/${"orientation"}`}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Review lessons
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {questions.map((q, qi) => (
        <Card key={q.id}>
          <CardContent className="p-5">
            <p className="font-medium">
              <span className="text-muted-foreground">Question {qi + 1}. </span>
              {q.prompt}
            </p>
            <fieldset className="mt-3 flex flex-col gap-2">
              <legend className="sr-only">{q.prompt}</legend>
              {q.options.map((opt, oi) => {
                const selected = answers[qi] === oi
                return (
                  <label
                    key={oi}
                    className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-sm transition-colors ${
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-input hover:bg-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      checked={selected}
                      onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      className="h-4 w-4 accent-[var(--primary)]"
                    />
                    <span>{opt}</span>
                  </label>
                )
              })}
            </fieldset>
          </CardContent>
        </Card>
      ))}

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={submit} disabled={pending} size="lg">
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit assessment
        </Button>
        <span className="text-sm text-muted-foreground">
          {Object.keys(answers).length} / {questions.length} answered
        </span>
      </div>
    </div>
  )
}
