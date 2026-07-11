"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { enrollInCourse, unenrollFromCourse } from "@/app/actions/lms"
import { Loader2, Check, Plus, X } from "lucide-react"

type Props = {
  courseId: number
  enrolled: boolean
  isCompleted?: boolean
  size?: "sm" | "default"
  variant?: "default" | "secondary" | "outline" | "ghost"
}

export function EnrollButton({ courseId, enrolled, isCompleted, size = "sm", variant }: Props) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function toggle() {
    startTransition(async () => {
      try {
        if (enrolled) {
          await unenrollFromCourse(courseId)
        } else {
          await enrollInCourse(courseId)
        }
        router.refresh()
      } catch (err: any) {
        alert(err.message || "Failed to update enrollment. Please try again.")
      }
    })
  }

  if (isCompleted) {
    return (
      <Button
        type="button"
        size={size}
        variant="outline"
        disabled
        className="disabled:opacity-100 font-medium text-green-600 dark:!text-emerald-400 border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-900/10"
      >
        <Check className="mr-2 h-4 w-4" />
        Completed
      </Button>
    )
  }

  if (enrolled) {
    return (
      <Button
        type="button"
        size={size}
        variant={variant ?? "outline"}
        onClick={toggle}
        disabled={pending}
        className="group"
      >
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <>
            <Check className="mr-2 h-4 w-4 group-hover:hidden" />
            <X className="mr-2 hidden h-4 w-4 group-hover:block" />
          </>
        )}
        <span className="group-hover:hidden">Enrolled</span>
        <span className="hidden group-hover:inline">Drop course</span>
      </Button>
    )
  }

  return (
    <Button type="button" size={size} variant={variant ?? "default"} onClick={toggle} disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
      Enroll
    </Button>
  )
}
