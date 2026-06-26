"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { enrollInCourse, unenrollFromCourse } from "@/app/actions/lms"
import { Loader2, Check, Plus, X } from "lucide-react"

type Props = {
  courseId: number
  enrolled: boolean
  size?: "sm" | "default"
  variant?: "default" | "secondary" | "outline"
}

export function EnrollButton({ courseId, enrolled, size = "sm", variant }: Props) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function toggle() {
    startTransition(async () => {
      if (enrolled) {
        await unenrollFromCourse(courseId)
      } else {
        await enrollInCourse(courseId)
      }
      router.refresh()
    })
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
