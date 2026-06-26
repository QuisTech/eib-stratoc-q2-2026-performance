"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { completeLesson } from "@/app/actions/lms"
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react"

export function LessonCompleteButton({
  courseId,
  lessonKey,
  alreadyComplete,
  nextHref,
  isLast,
}: {
  courseId: number
  lessonKey: string
  alreadyComplete: boolean
  nextHref: string
  isLast: boolean
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleComplete() {
    startTransition(async () => {
      if (!alreadyComplete) await completeLesson(courseId, lessonKey)
      router.push(nextHref)
      router.refresh()
    })
  }

  return (
    <Button onClick={handleComplete} disabled={pending} size="lg">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle2 className="mr-2 h-4 w-4" />
      )}
      {alreadyComplete
        ? isLast
          ? "Go to assessment"
          : "Next lesson"
        : isLast
          ? "Complete & go to assessment"
          : "Mark complete & continue"}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  )
}
