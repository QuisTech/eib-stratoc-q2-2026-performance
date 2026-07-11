import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { buttonVariants } from "@/components/ui/button"
import { EnrollButton } from "@/components/lms/enroll-button"
import type { Course } from "@/lib/db/schema"
import { formatNaira } from "@/lib/utils"
import { Clock, Layers, Building2, ArrowRight } from "lucide-react"

const levelClass: Record<string, string> = {
  Beginner: "bg-[color-mix(in_oklch,var(--chart-1)_18%,transparent)] text-[var(--chart-1)]",
  Intermediate: "bg-[color-mix(in_oklch,var(--chart-3)_20%,transparent)] text-[var(--chart-3)]",
  Advanced: "bg-[color-mix(in_oklch,var(--chart-5)_20%,transparent)] text-[var(--chart-5)]",
}

export function CourseCard({
  course,
  enrolled,
  progress,
  isCompleted,
}: {
  course: Course
  enrolled: boolean
  progress?: number
  isCompleted?: boolean
}) {
  return (
    <Card className="avoid-break flex flex-col overflow-hidden">
      {course.imageUrl && (
        <div className="aspect-video w-full overflow-hidden border-b">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{course.category}</Badge>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              levelClass[course.level] ?? "bg-muted text-muted-foreground"
            }`}
          >
            {course.level}
          </span>
        </div>
        <Link href={`/lms/${course.slug}`} className="group">
          <h3 className="text-balance font-heading text-lg font-bold leading-snug group-hover:text-primary">
            {course.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {course.description}
        </p>

        {course.priceNaira > 0 ? (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-xl font-bold tabular-nums text-muted-foreground line-through">
                {formatNaira(course.priceNaira)}
              </span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Free for you
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Covered by the organization</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-xl font-bold text-emerald-600 dark:text-emerald-400">
              Free
            </span>
          </div>
        )}

        <ul className="grid gap-1.5 text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-accent" /> {course.format}
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-accent" /> {course.durationHours} hours
          </li>
          {course.subsidiaries && (
            <li className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-accent" />
              <span className="line-clamp-1">{course.subsidiaries.split(",").join(" · ")}</span>
            </li>
          )}
        </ul>

        {enrolled && typeof progress === "number" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Progress</span>
              <span className="tabular-nums text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        <div className="mt-auto flex items-center gap-2 pt-1">
          <EnrollButton courseId={course.id} enrolled={enrolled} isCompleted={isCompleted} />
          <Link
            href={`/lms/${course.slug}`}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Details <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
