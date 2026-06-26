"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { setCourseProgress } from "@/app/actions/lms"
import { Loader2 } from "lucide-react"

export function ProgressControls({
  courseId,
  progress,
}: {
  courseId: number
  progress: number
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function update(next: number) {
    startTransition(async () => {
      await setCourseProgress(courseId, next)
      router.refresh()
    })
  }

  const steps = [0, 25, 50, 75, 100]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Your progress</span>
        <span className="tabular-nums text-muted-foreground">
          {progress}%{progress >= 100 ? " · Completed" : ""}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex flex-wrap items-center gap-2">
        {pending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        {steps.map((s) => (
          <Button
            key={s}
            type="button"
            size="sm"
            variant={progress === s ? "default" : "outline"}
            onClick={() => update(s)}
            disabled={pending}
          >
            {s === 100 ? "Mark complete" : `${s}%`}
          </Button>
        ))}
      </div>
    </div>
  )
}
