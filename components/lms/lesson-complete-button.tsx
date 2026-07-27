"use client"

import { useTransition, useState } from "react"
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
  hasKnowledgeCheck = false,
}: {
  courseId: number
  lessonKey: string
  alreadyComplete: boolean
  nextHref: string
  isLast: boolean
  hasKnowledgeCheck?: boolean
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleComplete() {
    // Temporarily disable knowledge check requirement to isolate the issue
    // if (hasKnowledgeCheck && !alreadyComplete && !isPassed) {
    //   const el = document.getElementById("knowledge-check-section")
    //   if (el) {
    //     el.scrollIntoView({ behavior: "smooth" })
    //   }
    //   setError("Please pass the Knowledge Check above to proceed.")
    //   return
    // }
    
    setError(null)
    startTransition(async () => {
      if (!alreadyComplete) await completeLesson(courseId, lessonKey)
      router.push(nextHref)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {error && (
        <span className="text-sm font-medium text-destructive animate-in fade-in slide-in-from-bottom-1">
          {error}
        </span>
      )}
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
    </div>
  )
}
