"use client"

import { useState, useTransition, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { submitQuiz } from "@/app/actions/lms"
import { Loader2, CheckCircle2, XCircle, Award, RotateCcw, AlertTriangle, Ban, Clock } from "lucide-react"

type ClientQuestion = { 
  type?: "multiple_choice" | "matching"
  id: string
  prompt: string
  options?: string[]
  pairs?: { left: string; right: string }[]
}

type QuestionResult = {
  isCorrect: boolean
  correctIndex: number
  explanation: string
  pairResults?: Record<string, boolean>
}
type Result = { score: number; total: number; percent: number; passed: boolean; details: QuestionResult[] }

type ShuffledQuestion = {
  q: ClientQuestion
  originalIndex: number
  shuffledOptions?: { opt: string; originalOptionIndex: number }[]
  shuffledLeft?: string[]
  shuffledRight?: string[]
}

function MatchingQuestionUI({
  question,
  originalIndex,
  shuffledLeft,
  shuffledRight,
  answers,
  setAnswers,
  disabled,
  result
}: {
  question: ClientQuestion
  originalIndex: number
  shuffledLeft: string[]
  shuffledRight: string[]
  answers: Record<number, any>
  setAnswers: (fn: (a: any) => any) => void
  disabled: boolean
  result?: QuestionResult
}) {
  const currentAnswer = answers[originalIndex] || [] 
  
  const pool = shuffledRight.filter(r => !currentAnswer.some((a: any) => a.right === r))

  const handleDragStart = (e: React.DragEvent, rightItem: string, sourceLeft?: string) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData("text/plain", JSON.stringify({ rightItem, sourceLeft }))
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDropSlot = (e: React.DragEvent, targetLeft: string) => {
    e.preventDefault()
    if (disabled) return
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"))
      const { rightItem, sourceLeft } = data
      
      setAnswers((prev: any) => {
        const next = { ...prev }
        let currentAnswersForQ = next[originalIndex] ? [...next[originalIndex]] : []
        
        if (sourceLeft) {
          currentAnswersForQ = currentAnswersForQ.filter((a: any) => a.left !== sourceLeft)
        }
        currentAnswersForQ = currentAnswersForQ.filter((a: any) => a.left !== targetLeft)
        currentAnswersForQ.push({ left: targetLeft, right: rightItem })
        next[originalIndex] = currentAnswersForQ
        return next
      })
    } catch {}
  }

  const handleDropPool = (e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"))
      const { sourceLeft } = data
      if (sourceLeft) {
        setAnswers((prev: any) => {
          const next = { ...prev }
          let currentAnswersForQ = next[originalIndex] ? [...next[originalIndex]] : []
          currentAnswersForQ = currentAnswersForQ.filter((a: any) => a.left !== sourceLeft)
          next[originalIndex] = currentAnswersForQ
          return next
        })
      }
    } catch {}
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div 
        className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 p-4 min-h-[80px]"
        onDrop={handleDropPool}
        onDragOver={handleDragOver}
      >
        <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Drag from here</p>
        <div className="flex flex-wrap gap-2">
          {pool.map((r) => (
            <div
              key={r}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, r)}
              className={"cursor-grab active:cursor-grabbing rounded border bg-background px-3 py-2 text-sm shadow-sm hover:border-primary transition-colors" + (disabled ? " opacity-50 cursor-not-allowed" : "")}
            >
              {r}
            </div>
          ))}
          {pool.length === 0 && <span className="text-sm text-muted-foreground italic">All items placed</span>}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {shuffledLeft.map(left => {
          const matched = currentAnswer.find((a: any) => a.left === left)
          const isCorrectPair = result?.pairResults?.[left]

          let slotClass = "flex-1 rounded-md border border-dashed p-2 min-h-[42px] transition-colors"
          if (matched) {
            if (result) {
              if (isCorrectPair) {
                slotClass = "flex-1 rounded-md border border-[var(--chart-1)] bg-[var(--chart-1)]/10"
              } else {
                slotClass = "flex-1 rounded-md border border-destructive bg-destructive/10"
              }
            } else {
              slotClass = "flex-1 rounded-md border border-primary bg-primary/5"
            }
          }

          return (
            <div key={left} className="flex flex-col sm:flex-row sm:items-stretch gap-3">
              <div className="flex-1 rounded-md border bg-muted/30 px-3 py-2.5 text-sm flex items-center">
                {left}
              </div>
              <div className="hidden sm:flex items-center text-muted-foreground">→</div>
              <div 
                className={slotClass}
                onDrop={(e) => handleDropSlot(e, left)}
                onDragOver={handleDragOver}
              >
                {matched ? (
                  <div 
                    draggable={!disabled}
                    onDragStart={(e) => handleDragStart(e, matched.right, left)}
                    className={"flex h-full items-center justify-between cursor-grab active:cursor-grabbing rounded border bg-background px-3 py-1.5 text-sm shadow-sm" + (disabled ? " cursor-default" : "")}
                  >
                    <span>{matched.right}</span>
                    {result && isCorrectPair && <CheckCircle2 className="h-4 w-4 text-[var(--chart-1)] ml-2 shrink-0" />}
                    {result && !isCorrectPair && <XCircle className="h-4 w-4 text-destructive ml-2 shrink-0" />}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground italic">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function QuizForm({
  courseId,
  slug,
  questions,
  passThreshold,
  isLockedOutByAttempts,
  isLockedOutByTime,
  waitHoursLeft,
  waitPeriodHours,
  maxAttempts,
  userEmail,
  quizSeed
}: {
  courseId: number
  slug: string
  questions: ClientQuestion[]
  passThreshold: number
  isLockedOutByAttempts?: boolean
  isLockedOutByTime?: boolean
  waitHoursLeft?: number
  waitPeriodHours?: number
  maxAttempts: number
  userEmail: string
  quizSeed?: number
}) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  
  const [isMounted, setIsMounted] = useState(false)
  const [shuffled, setShuffled] = useState<ShuffledQuestion[]>([])

  const tabSwitchCountRef = useRef(0)
  const lastLossRef = useRef(0)
  const [showWarningModal, setShowWarningModal] = useState(false)

  const buildShuffled = () => {
    const randomized = questions.map((q, qi) => {
      if (q.type === "matching" && q.pairs) {
        const lefts = q.pairs.map(p => p.left)
        const rights = q.pairs.map(p => p.right)
        for (let i = lefts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[lefts[i], lefts[j]] = [lefts[j], lefts[i]]
        }
        for (let i = rights.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[rights[i], rights[j]] = [rights[j], rights[i]]
        }
        return { q, originalIndex: qi, shuffledLeft: lefts, shuffledRight: rights }
      }

      const options = (q.options || []).map((opt, oi) => ({ opt, originalOptionIndex: oi }))
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[options[i], options[j]] = [options[j], options[i]]
      }
      return { q, originalIndex: qi, shuffledOptions: options }
    })
    
    for (let i = randomized.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[randomized[i], randomized[j]] = [randomized[j], randomized[i]]
    }
    return randomized
  }

  useEffect(() => {
    setShuffled(buildShuffled())
    setIsMounted(true)
  }, [questions])

  useEffect(() => {
    // Only enforce anti-cheating when mounted, actively taking the quiz, and no pending submission
    if (!isMounted || result || pending || isLockedOutByAttempts || isLockedOutByTime) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const now = Date.now()
        // Ignore duplicate events fired within 2 seconds
        if (now - lastLossRef.current < 2000) return 
        lastLossRef.current = now

        tabSwitchCountRef.current += 1
        const count = tabSwitchCountRef.current

        if (count === 1) {
          setShowWarningModal(true)
        } else if (count >= 2) {
          submit(true) // Force auto-submit
        }
      }
    }

    const handlePopState = () => {
      // If the user tries to use the browser back button while the quiz is active
      submit(true)
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Prompt user with standard browser warning if they try to close/refresh tab
      e.preventDefault()
      e.returnValue = ''
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isMounted, result, pending])

  const allAnswered = questions.every((q, i) => {
    if (q.type === "matching") {
      const ans = answers[i] as { left: string; right: string }[] | undefined
      return ans && ans.length === q.pairs?.length
    }
    return answers[i] !== undefined
  })

  function submit(forced = false) {
    setError(null)
    if (!forced && !allAnswered) {
      setError("Please answer every question before submitting.")
      return
    }
    // If forced, unanswered questions will be passed as undefined to the server and marked incorrect.
    const ordered = questions.map((_, i) => answers[i] !== undefined ? answers[i] : null)
    startTransition(async () => {
      try {
        const res = await submitQuiz(courseId, ordered, quizSeed)
        setResult(res as Result)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } catch (e) {
        setError("Could not submit your quiz. Please try again.")
      }
    })
  }

  function retake() {
    setAnswers({})
    setResult(null)
    setError(null)
    setShuffled(buildShuffled())
  }

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div 
      className="flex flex-col gap-5 relative select-none"
      onCopy={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {result?.passed && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
          <div className="flex flex-wrap gap-8 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 -rotate-12">
            {Array.from({ length: 150 }).map((_, i) => (
              <span key={i} className="text-xl font-bold whitespace-nowrap">
                {userEmail} • {new Date().toLocaleDateString()}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="z-10 flex flex-col gap-5">
      {result && (
        <Card
          className="border-l-4 mb-4"
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
                  <RotateCcw className="mr-2 h-4 w-4" /> Retake Assessment
                </Button>
                <Link
                  href={`/lms/${slug}`}
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Review lessons
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ZERO LEAKAGE POLICY: If they failed, we DO NOT show the questions or answers. */}
      {result && !result.passed ? null : (
        <>
          {shuffled.length === 0 && !isLockedOutByAttempts && !isLockedOutByTime && (
            <p className="text-sm text-muted-foreground">No questions available.</p>
          )}

      {!result && isLockedOutByAttempts ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Ban className="h-5 w-5" /> Maximum Attempts Reached
            </CardTitle>
            <CardDescription>
              You have reached the maximum of {maxAttempts} attempts for this course assessment.
              Please contact your administrator or supervisor to review the material and request a reset.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : !result && isLockedOutByTime ? (
        <Card className="border-muted bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" /> Waiting Period
            </CardTitle>
            <CardDescription>
              This course requires a {waitPeriodHours}-hour waiting period between failed attempts
              to encourage reviewing the material before trying again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              You can try again in approximately {waitHoursLeft} hour(s).
            </p>
          </CardContent>
        </Card>
      ) : (
        shuffled.map((sq, qi) => {
        const qResult = result?.details[sq.originalIndex]
        
        return (
          <Card key={sq.q.id} className={qResult ? (qResult.isCorrect ? "border-[var(--chart-1)] bg-green-500/5 dark:bg-green-500/10" : "border-destructive bg-destructive/5") : ""}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                {qResult && (
                  <div className="mt-0.5 shrink-0">
                    {qResult.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-[var(--chart-1)]" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium">
                    <span className="text-muted-foreground">Question {qi + 1}. </span>
                    {sq.q.prompt}
                  </p>
                  
                  {sq.q.type === "matching" && sq.q.pairs ? (
                    <MatchingQuestionUI
                      question={sq.q}
                      originalIndex={sq.originalIndex}
                      shuffledLeft={sq.shuffledLeft!}
                      shuffledRight={sq.shuffledRight!}
                      answers={answers}
                      setAnswers={setAnswers}
                      disabled={!!result}
                      result={qResult}
                    />
                  ) : (
                    <fieldset className="mt-3 flex flex-col gap-2" disabled={!!result}>
                      <legend className="sr-only">{sq.q.prompt}</legend>
                      {sq.shuffledOptions!.map((optObj, oi) => {
                        const selected = answers[sq.originalIndex] === optObj.originalOptionIndex
                        const isCorrectOption = qResult?.correctIndex === optObj.originalOptionIndex
                        
                        let optionClasses = selected
                            ? "border-primary bg-primary/5"
                            : "border-input hover:bg-muted"
                            
                        if (result) {
                          if (isCorrectOption) {
                            optionClasses = "border-[var(--chart-1)] bg-[var(--chart-1)]/10 ring-1 ring-[var(--chart-1)]"
                          } else if (selected && !isCorrectOption) {
                            optionClasses = "border-destructive bg-destructive/10 ring-1 ring-destructive opacity-75"
                          } else {
                            optionClasses = "border-input opacity-50"
                          }
                        }

                        return (
                          <label
                            key={oi}
                            className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-sm transition-colors ${optionClasses}`}
                          >
                            <input
                              type="radio"
                              name={`q-${sq.originalIndex}`}
                              checked={selected}
                              onChange={() => setAnswers((a) => ({ ...a, [sq.originalIndex]: optObj.originalOptionIndex }))}
                              className="h-4 w-4 accent-[var(--primary)] disabled:opacity-50"
                            />
                            <span className="flex-1">{optObj.opt}</span>
                            {result && isCorrectOption && <CheckCircle2 className="h-4 w-4 text-[var(--chart-1)]" />}
                            {result && selected && !isCorrectOption && <XCircle className="h-4 w-4 text-destructive" />}
                          </label>
                        )
                      })}
                    </fieldset>
                  )}

                  {qResult && (
                    <div className="mt-4 rounded-md border bg-background p-4 text-sm">
                      <p className="font-semibold text-foreground mb-1">Explanation</p>
                      <p className="text-muted-foreground leading-relaxed">{qResult.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
              </CardContent>
            </Card>
          )
        })
      )}
      </>
      )}

      {!result && !isLockedOutByAttempts && !isLockedOutByTime && (
        <>
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button onClick={() => submit()} disabled={pending} size="lg">
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit assessment
            </Button>
            <span className="text-sm text-muted-foreground">
              {Object.keys(answers).length} / {questions.length} answered
            </span>
          </div>
        </>
      )}

      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-destructive bg-background shadow-lg">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <AlertTriangle className="h-16 w-16 text-destructive" />
              <h2 className="font-heading text-2xl font-bold text-destructive">
                Anti-Cheating Warning
              </h2>
              <p className="text-muted-foreground text-balance">
                You navigated away from the assessment window. Tab switching, opening other applications, or minimizing the browser is strictly prohibited during this assessment.
              </p>
              <div className="mt-2 w-full rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive">
                If you leave the window again, your quiz will be automatically submitted and locked.
              </div>
              <Button size="lg" className="mt-4 w-full" onClick={() => setShowWarningModal(false)}>
                I understand, return to assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </div>
  )
}
